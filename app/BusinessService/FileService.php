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
     * @param Request $request リクエスト
     * @param String $type 検索タイプ(team or match)
     * @param int $numPagenation ページネーション数
     * @return $files ページネーション済ファイルデータ
     */
    public static function searchFiles(Request $request, String $type, int $numPagenation) {

        //ファイルデータ検索Query生成
        $query = File::query();

        // search/{type}のurlがteamの場合チーム検索かmatchの場合マッチデータ検索
        if ($type === Constants::URL_SEARCH_TYPE_TEAM) {
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
            $query->orderBy('id', 'desc');
            $orderType = Constants::STR_ORDER_TYPE_NEW;
        } else {
            $query->orderBy('id', 'asc');
            $orderType = Constants::STR_ORDER_TYPE_OLD;
        }
        
        $files = $query->paginate($numPagenation);
        
        return $files;
    }

}
