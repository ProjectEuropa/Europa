<?php

namespace App\BusinessService;

use Illuminate\Http\Request;
use App\CommonUtils\Constants;
use App\File;

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

        //キーワード(検索ワード)存在時のオーナー名・ファイル名・ファイルコメント部分一致検索
        if (!empty($keyword)) {
            $query->where(function($query) use ($keyword) {
                $query->orwhere('upload_owner_name', 'like', '%' . $keyword . '%')
                        ->orWhere('file_name', 'like', '%' . $keyword . '%')
                        ->orWhere('file_comment', 'like', '%' . $keyword . '%');
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
}
