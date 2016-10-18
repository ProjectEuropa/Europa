<?php

namespace App\Http\Controllers;

use App\File;
use App\CommonUtils\Constants;
use App\BusinessService\FileService;
use Illuminate\Http\Request;
use Zipper;
use Validator;

/*
 * 　まとめでダウンロード
 */

class SumDownloadController extends Controller {

    /**
     * チーム・マッチデータ検索処理
     * ページング機能を実装
     *
     * @param  Request  $request
     * @param type sumdonwload/{type} teamの場合はチーム検索、matchの場合はマッチ検索
     * @return view search/team or search/match
     */
    public function index(Request $request, $type) {

        // ソート順指定
        $orderType = $request->input('orderType');
        // 検索ワード取得
        $keyword = $request->input('keyword');

        //ページング機能:1ページ100レコード
        $files = FileService::searchFiles($request, $type, Constants::NUM_PAGENATION_HUNDRED);

        // 検索ワードと検索結果、検索タイプを送信
        return view('sumdownload.sumdownloadIndex', [
            'files' => $files,
            'keyword' => $keyword,
            'type' => $type, // team or match
            'orderType' => $orderType
        ]);
    }

    /**
     * ファイルダウンロード実行Action
     *
     * @param  Request  
     * @return response zipファイル
     */
    public function download(Request $request) {
        /*
          　チェックボックスチェックは必須
         */
        $validator = Validator::make($request->all(), [
                    'checkFileId' => 'required|max:20',
        ]);

        $type = $request->input('type');

        if ($validator->fails()) {
            return redirect('/sumdownload/'.$type)
                            ->withInput()
                            ->withErrors($validator);
        }

        // リクエストから取得したIDを元にファイルデータ抽出
        $fileIds = $request->input('checkFileId');
        $zipPrefiles = File::whereIn('id', $fileIds)->select('file_name', 'file_data')->get();

        //$fileOne = File::where('id', '=', 7)->first();
        //zip作成前用のフォルダに個別にCHEファイルを作成
        foreach ($zipPrefiles as $zipPrefile) {
            $fileName = $zipPrefile->file_name;
            $fileData = $zipPrefile->file_data;
            $cheData = public_path('prezipfiles/' . $fileName);
            file_put_contents($cheData, $fileData);
        }

        // Zip用ファイル全て取得
        $allZipfiles = glob(public_path('prezipfiles/*'));

        // zipファイルを作成してレスポンスへ送る
        // TODO zipファイルの名称
        Zipper::make('zipdldir/sum.zip')->add($allZipfiles);
        Zipper::close();

        // ZIPファイル作成用ディレクトリに格納中のファイルを全て削除        
        $files = glob(public_path('prezipfiles/*'));
        foreach ($files as $file) {
            unlink($file);
        }

        // 作成したzipをレスポンスとして送った後に削除
        return response()->download(public_path('zipdldir/sum.zip'))->deleteFileAfterSend(true);
    }

}
