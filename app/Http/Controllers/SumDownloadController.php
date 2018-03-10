<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\SumDownloadRequest;
use DB;
use App\BusinessService\FileService;
use Zipper;

class SumdownloadController extends Controller
{

    private $fileService;

    public function __construct(FileService $fileService)
    {
        $this->fileService = $fileService;
    }

    /**
     * 
     *
     * @return 
     */
    public function index($searchType)
    {
        return view('sumdl.index')->with('searchType', $searchType);
    }

    /**
     * ファイルダウンロード実行Action
     *
     * @param  Request  
     * @return response zipファイル
     */
    public function download(SumDownloadRequest $request) {

        // リクエストから取得したIDを元にファイルデータ抽出
        $fileIds = $request->input('checkFileId');
        $zipPrefiles = DB::table('files')->whereIn('id', $fileIds)->select('file_name', 'file_data')->get();
        //zip作成前用のフォルダに個別にCHEファイルを作成
        foreach ($zipPrefiles as $zipPrefile) {
            $fileName = $zipPrefile->file_name;
            $fileData = $zipPrefile->file_data;
            $cheData = public_path('prezipfiles/' . $fileName);
            file_put_contents($cheData, $fileData);
        }
        // Zip用ファイル全て取得
        $allZipfiles = glob(public_path('prezipfiles/*'));
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
