<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\BusinessService\YoutubeService;
use App\CommonUtils\Constants;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use FFMpeg;

/*
  Video操作実行コントローラ
 */

class VideoController extends Controller {

    //初期画面
    public function index() {
        return view('video.videoUploadIndex');
    }

    //アップロード
    public function upload(Request $request) {

        /*
          　タイトル・説明文・ビデオファイル必須
          　ビデオファイルの拡張子はavi,mp4
         */
        $validator = Validator::make($request->all(), [
                    'title' => 'required|max:20',
                    'description' => 'required|max:200',
                    'video' => 'required|mimes:avi,mp4|max:270000',
        ]);

        if ($validator->fails()) {
            return redirect('/video/upload')
                            ->withInput()
                            ->withErrors($validator);
        }

    	$originalVideoFile = $request->file('video');
        $orijinalFileExtension = $originalVideoFile->getClientOriginalExtension();
        $orijinalFilename = $originalVideoFile->getClientOriginalName();

        $uploadVideoPath;
        // aviファイルの場合はmp4にエンコード
        if ($orijinalFileExtension === 'avi') {
            Storage::disk('local')->put($orijinalFilename,  File::get($originalVideoFile));

            FFMpeg::open($orijinalFilename)
                        ->export()
                        ->toDisk('local')
                        ->inFormat(new \FFMpeg\Format\Video\X264('libmp3lame', 'libx264'))
                        ->save('preUpload.mp4');

            $uploadVideoPath = storage_path('app/preUpload.mp4');
        } else {
            $uploadVideoPath = $originalVideoFile;
        }

        // Youtubeに動画をアップロード
		YoutubeService::uploadVideotoYoutube($request, $uploadVideoPath);

        // ローカルにアップロードしたファイルを削除
        $localFiles = array(storage_path('app/'.$orijinalFilename), storage_path('app/preUpload.mp4'));
        File::delete($localFiles);

        // 不要になった過去のアクセストークンを削除
        YoutubeService::pastAccessTokenDelete();

        \Session::flash('flash_message', trans('messages.upload_complete', ['name' => '動画']));
        return redirect('/video/upload');
    }

    //検索画面
    public function search(Request $request) {

    	$keyword = '';
    	if (!($request->input('keyword') === null)) {
    		$keyword = $request->input('keyword');
    	}

    	// 指定のチャンネルから50件キーワード検索する。
    	$videoArray = YoutubeService::searchVideoFromYoutube($keyword, Constants::NUM_MAX_VIDEO_SEARCH_FIFTY);
        $videos = '';

        // ビデオファイルはモデルにないので手動でページネーション実施
        if ($videoArray) {
            // 投稿が新しい順にソート
        	$videoArray = collect($videoArray)->sortBy('snippet.publishedAt')->toArray();
    		$currentPage = LengthAwarePaginator::resolveCurrentPage();
    		$perPage = Constants::NUM_VIDEO_PAGINATION_SIX;
    		$col = new Collection($videoArray);
    		$currentPageSearchResults = $col->slice(($currentPage - 1) * $perPage, $perPage)->all();

    		$videos = new LengthAwarePaginator($currentPageSearchResults, count($col), $perPage);
    		$videos->setPath($request->url());
        }

        return view('video.videoSearchIndex', [
            'videos' => $videos,
            'keyword' => $keyword
        ]);
    }
}
