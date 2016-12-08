<?php

namespace App\BusinessService;

use Illuminate\Http\Request;
use App\CommonUtils\Constants;
use App\File;
use Auth;
use DB;

/*
 * FileService
 * Fileモデルに関わるロジックを記述
 */

class FileService {

    /**
     * 
     * ファイル検索
     * リクエストに送られたキーワード・ソート順、
     * URLの検索タイプ（team または match）をもとにファイルを検索し、
     * ページネーション済のファイルデータを返却する
     * 
     * @param Request $request リクエスト
     * @param String $searchType 検索タイプ(team or match)
     * @param int $numPagenation ページネーション数
     * @return $files ページネーション済ファイルデータ
     */
    public static function searchFiles(Request $request, String $searchType, int $numPagenation) {

        //ファイルデータ検索Query生成
        $query = File::query();

        // search/{type}のurlがteamの場合チーム検索・matchの場合マッチデータ検索
        if ($searchType === Constants::URL_SEARCH_TYPE_TEAM) {
            $query->where('data_type', '=', Constants::DB_STR_DATA_TYPE_TEAM);
        } else {
            $query->where('data_type', '=', Constants::DB_STR_DATA_TYPE_MATCH);
        }

        // 検索ワード取得
        $keyword = $request->input('keyword');

        //キーワード(検索ワード)存在時のオーナー名・ファイル名・ファイルコメント・検索タグ部分一致検索
        if (!empty($keyword)) {
            $query->where(function($query) use ($keyword) {
                $query->orwhere('upload_owner_name', 'like', '%' . $keyword . '%')
                        ->orWhere('file_name', 'like', '%' . $keyword . '%')
                        ->orWhere('file_comment', 'like', '%' . $keyword . '%')
                        ->orWhere('search_tag1', 'like', '%' . $keyword . '%')
                        ->orWhere('search_tag2', 'like', '%' . $keyword . '%')
                        ->orWhere('search_tag3', 'like', '%' . $keyword . '%')
                        ->orWhere('search_tag4', 'like', '%' . $keyword . '%');
            });
        }
        // ソート順指定
        $orderType = $request->input('orderType');
        if (($orderType === Constants::STR_ORDER_TYPE_NEW) || (empty($orderType))) {
            // ソート順指定が'New'または指定なしの場合は、id降順（新規登録順）
            $query->orderBy('id', 'desc');
        } else {
            //Oldの場合は、id昇順（旧登録順）
            $query->orderBy('id', 'asc');
        }

        $files = $query->paginate($numPagenation);

        return $files;
    }

    /**
     * 
     * ユーザファイル検索
     * @param String $userId ユーザID
     * @param int $fileType 検索タイプ(team:1 or match:2)
     * @return $files ユーザファイルデータ
     */
    public static function searchUserFiles(String $userId, int $fileType) {

        $fileQuery = File::query();

        $files = $fileQuery->where('upload_user_id', '=', $userId)
                        ->where('data_type', '=', $fileType)
                        ->orderBy('id', 'desc')->get();

        return $files;
    }

    /**
     * ファイルデータ登録処理
     * @param Request リクエスト
     * @param  bool  true場合チーム falseの場合マッチデータ
     * @param  bool  true通常アップロード場合チーム falseの場合簡易アップロード     
     * @return void
     */
    public static function registerFileData(Request $request, bool $teamFlg, bool $normalUploadFlg) {

        $dataType = null;
        $file = null;
        $uploadOwnerName = null;
        $fileComment = null;
        $deletePassword = null;
        $searchTags = null;

        // チームFlgがオンならばチームデータを取得、offならばマッチデータ
        if ($teamFlg) {
            $dataType = Constants::DB_STR_DATA_TYPE_TEAM;
            $file = $request->file('teamFile');
            $uploadOwnerName = $request->input('teamOwnerName'); // アップロードオーナー名（編集可能）
            $fileComment = $request->input('teamComment'); // コメント
            $deletePassword = $request->input('teamDeletePassWord'); // 削除パスワード
            $searchTags = $request->input('teamSearchTags'); // 検索タグ
        } else {
            $dataType = Constants::DB_STR_DATA_TYPE_MATCH;
            $file = $request->file('matchFile');
            $uploadOwnerName = $request->input('matchOwnerName'); // アップロードオーナー名（編集可能）
            $fileComment = $request->input('matchComment'); // コメント
            $deletePassword = $request->input('matchDeletePassWord'); // 削除パスワード
            $searchTags = $request->input('matchSearchTags'); // 検索タグ
        }

        $fileData = file_get_contents($file);       // ファイルのバイナリデータ取得
        $fileName = $file->getClientOriginalName();     // ファイル名
        $now = date('Y/m/d H:i:s'); // 現在日付

        $uploadUserId = null;
        $uploadType = null;

        // 通常アップロードであるならばセッションのユーザーIDを登録
        if ($normalUploadFlg) {
            $uploadUserId = Auth::user()->id;
            $uploadType = Constants::DB_UPLOAD_TYPE_NORMAL; //通常アップロード
        } else {
            $uploadUserId = 0;
            $uploadType = Constants::DB_UPLOAD_TYPE_SIMPLE; //簡易アップロード
        }

        //検索タグ1,2,3,4をつけるロジックだが、動的に変数名を付ける方法があればかなり簡略化できると思う
        $searchTag1 = null;
        $searchTag2 = null;
        $searchTag3 = null;
        $searchTag4 = null;

        switch (count($searchTags)) {
            case 4:
                $searchTag4 = $searchTags[3];
            case 3:
                $searchTag3 = $searchTags[2];
            case 2:
                $searchTag2 = $searchTags[1];
            case 1:
                $searchTag1 = $searchTags[0];
                break;
        }

        // LOB使用のためPDOを取得し直接SQLを実行する
        $db = DB::connection('pgsql')->getPdo();

        $stmt = $db->prepare("INSERT INTO files (file_data, upload_type, file_name, upload_owner_name, file_comment, delete_password, data_type, created_at, updated_at, upload_user_id, search_tag1, search_tag2, search_tag3, search_tag4) "
                . "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        $stmt->bindParam(1, $fileData, $db::PARAM_LOB); //ラージオブジェクトとして登録
        $stmt->bindParam(2, $uploadType, $db::PARAM_STR);
        $stmt->bindParam(3, $fileName, $db::PARAM_STR);
        $stmt->bindParam(4, $uploadOwnerName, $db::PARAM_STR);
        $stmt->bindParam(5, $fileComment, $db::PARAM_STR);
        $stmt->bindParam(6, $deletePassword, $db::PARAM_STR);
        $stmt->bindParam(7, $dataType, $db::PARAM_STR);
        $stmt->bindParam(8, $now, $db::PARAM_STR);
        $stmt->bindParam(9, $now, $db::PARAM_STR);
        $stmt->bindParam(10, $uploadUserId, $db::PARAM_INT);
        $stmt->bindParam(11, $searchTag1, $db::PARAM_STR);
        $stmt->bindParam(12, $searchTag2, $db::PARAM_STR);
        $stmt->bindParam(13, $searchTag3, $db::PARAM_STR);
        $stmt->bindParam(14, $searchTag4, $db::PARAM_STR);

        // 登録実行
        $stmt->execute();
        // 切断
        unset($db);
    }

    /**
     * 特定ユーザのファイル削除
     * @param String fileId 削除対象ファイルID
     * @param String  $upLoadUserId アップロードユーザID   
     * @return int $deleteCount 削除実行レコード数
     */
    public static function deleteUserFile(String $fileId, String $upLoadUserId) {

        //指定したファイルとアップロードユーザIDを対象として削除
        $deleteCount = File::where('id', '=', $fileId)
                ->where('upload_user_id', '=', $upLoadUserId)
                ->delete();

        return $deleteCount;
    }

}
