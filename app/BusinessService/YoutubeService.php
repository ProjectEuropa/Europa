<?php

namespace App\BusinessService;

use App\YoutubeAccessToken;
use Youtube;
use YoutubeSearch;
use App\CommonUtils\Constants;
use Illuminate\Http\Request;
use DB;

/*
 * YoutubeService
 * YoutubeAccessTokenモデル・Youtubeに関わるロジックを記述
 */

class YoutubeService {

    /**
     *
     * 過去のアクセストークン削除
     * @return void
     */
    public static function pastAccessTokenDelete() {

    	$acccessTokenCount = YoutubeAccessToken::all()->count();

    	if ($acccessTokenCount >= 3) {
    		$deleteData = YoutubeAccessToken::query()->first();
    		YoutubeAccessToken::destroy($deleteData->id);
    	}
    }

    /**
     *
     * 動画をYoutubeにアップロード
     * @param Request　リクエストデータ
     * @param $uploadVideoPath　アップロードする動画のパス
     * @return void
     */
    public static function uploadVideotoYoutube(Request $request, $uploadVideoPath) {

        Youtube::upload($uploadVideoPath, [
                'title'       => $request->input('title'),
                'description' => $request->input('description'),
                'category_id' => Constants::NUM_YOUTUBE_GAME_CATEGORY_ID_TWENTY
        ]);

    }

    /**
     *
     * Youtube動画検索
     * @param String　検索ワード
     * @return array　配列形式の動画情報
     */
    public static function searchVideoFromYoutube(String $keyword, int $numSearch) : array {

    	return YoutubeSearch::searchChannelVideos($keyword,
    			Constants::STR_YOUTUBE_EUROPA_CHANNEL_ID, $numSearch);

    }


}
