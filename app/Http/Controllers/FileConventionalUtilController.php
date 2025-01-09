<?php

namespace App\Http\Controllers;

use App\File;
use Madzipper;
use Illuminate\Http\Request;

class FileConventionalUtilController extends Controller
{

    public function download(int $id)
    {
        $file = File::select('file_name', 'file_data', 'downloadable_at')
            ->where('id', '=', $id)
            ->first();

        if ($file->downloadable_at >= now()) {
            return response()->view('errors.download', [
              'message' => '現在はダウンロード可能な状態ではありません。',
            ], 400);
        }

        // タイトル取得
        $title = $file->file_name;
        // CHEバイナリデータ取得
        $fileData = $file->file_data;
        // 取得したバイナリデータを書き込み
        $cheData = public_path('.CHE');
        file_put_contents($cheData, $fileData);
        $headers = [
            'Content-Type: application/CHE',
        ];
        return response()->download($cheData, $title, $headers)->deleteFileAfterSend(true);
    }

    public function sumDownload(Request $request)
    {
        // リクエストから取得したIDを元にファイルデータ抽出
        $fileIds = $request->input('checkedId');
        $zipPrefiles = File::whereIn('id', $fileIds)->select('file_name', 'file_data', 'downloadable_at')->get();
        //zip作成前用のフォルダに個別にCHEファイルを作成
        foreach ($zipPrefiles as $zipPrefile) {
            if ($zipPrefile->downloadable_at >= now()) {
                continue;
            }
            $fileName = $zipPrefile->file_name;
            $fileData = $zipPrefile->file_data;
            $cheData = public_path('prezipfiles/' . $fileName);
            file_put_contents($cheData, $fileData);
        }
        // Zip用ファイル全て取得
        $allZipfiles = glob(public_path('prezipfiles/*'));
        Madzipper::make(public_path('zipdldir/sum.zip'))->add($allZipfiles)->close();
        // ZIPファイル作成用ディレクトリに格納中のファイルを全て削除
        $files = glob(public_path('prezipfiles/*'));
        foreach ($files as $file) {
            unlink($file);
        }
        // 作成したzipをレスポンスとして送った後に削除
        return response()->download(public_path('zipdldir/sum.zip'))->deleteFileAfterSend(true);
    }
}
