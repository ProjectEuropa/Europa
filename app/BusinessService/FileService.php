<?php
namespace App\BusinessService;

use App\File;
use Auth;
use DB;
use Illuminate\Http\Request;

/*
 * FileService
 * Fileモデルに関わるロジックを記述
 */
class FileService
{

    /**
     * ファイルデータ登録処理
     * @param Request リクエスト
     * @param  array ['isTeam']  true場合チーム falseの場合マッチデータ ['isNormalUpdate']true通常アップロード場合チーム falseの場合簡易アップロード
     * @return void
     */
    public function registerFileData(Request $request, array $arrayIsTeamOrNormarUpdate)
    {
        $dataType = null;
        $file = null;
        $uploadOwnerName = null;
        $fileComment = null;
        $deletePassword = null;
        $searchTags = null;

        // チームFlgがオンならばチームデータを取得、offならばマッチデータ
        if ($arrayIsTeamOrNormarUpdate['isTeam']) {
            $dataType = \Config::get('const.DB_STR_DATA_TYPE_TEAM');
            $file = $request->file('teamFile');
            $uploadOwnerName = $request->input('teamOwnerName'); // アップロードオーナー名（編集可能）
            $fileComment = $request->input('teamComment'); // コメント
            $deletePassword = $request->input('teamDeletePassWord'); // 削除パスワード
            $searchTags = explode(',', $request->input('teamSearchTags')); // 検索タグ
        } else {
            $dataType = \Config::get('const.DB_STR_DATA_TYPE_MATCH');
            $file = $request->file('matchFile');
            $uploadOwnerName = $request->input('matchOwnerName'); // アップロードオーナー名（編集可能）
            $fileComment = $request->input('matchComment'); // コメント
            $deletePassword = $request->input('matchDeletePassWord'); // 削除パスワード
            $searchTags = explode(',', $request->input('matchSearchTags')); // 検索タグ
        }
        $fileData = file_get_contents($file); // ファイルのバイナリデータ取得
        $fileName = $file->getClientOriginalName(); // ファイル名
        $now = date('Y/m/d H:i:s'); // 現在日付
        $uploadUserId = null;
        $uploadType = null;
        // 通常アップロードであるならばセッションのユーザーIDを登録
        if ($arrayIsTeamOrNormarUpdate['isNormalUpdate']) {
            $uploadUserId = Auth::user()->id;
            $uploadType = \Config::get('const.DB_UPLOAD_TYPE_NORMAL'); //通常アップロード
        } else {
            $uploadUserId = 0;
            $uploadType = \Config::get('const.DB_UPLOAD_TYPE_SIMPLE'); //簡易アップロード
        }
        //検索タグ1,2,3,4をつけるロジックだが、動的に変数名を付ける方法があればかなり簡略化できると思う
        $searchTag1 = null;
        $searchTag2 = null;
        $searchTag3 = null;
        $searchTag4 = null;
        switch ($searchTags !== null ? count($searchTags) : 0) {
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
}
