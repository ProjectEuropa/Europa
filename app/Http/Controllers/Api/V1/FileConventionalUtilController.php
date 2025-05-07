<?php

namespace App\Http\Controllers\Api\V1;

use App\File;
use Madzipper;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class FileConventionalUtilController extends Controller
{
    public function download(int $id)
    {
        $file = File::select('file_name', 'file_data', 'downloadable_at')
            ->where('id', '=', $id)
            ->first();
        if ($file->downloadable_at >= now()) {
            return response()->json([
              'error' => '現在はダウンロード可能な状態ではありません。'
            ], 400);
        }
        $title = $file->file_name;
        $fileData = $file->file_data;
        $cheData = public_path('.CHE');
        file_put_contents($cheData, $fileData);
        $headers = [
            'Content-Type: application/CHE',
        ];
        return response()->download($cheData, $title, $headers)->deleteFileAfterSend(true);
    }
    public function sumDownload(Request $request)
    {
        $fileIds = $request->input('checkedId');
        $zipPrefiles = File::whereIn('id', $fileIds)->select('file_name', 'file_data', 'downloadable_at')->get();
        foreach ($zipPrefiles as $zipPrefile) {
            if ($zipPrefile->downloadable_at >= now()) {
                continue;
            }
            $fileName = $zipPrefile->file_name;
            $fileData = $zipPrefile->file_data;
            $cheData = public_path('prezipfiles/' . $fileName);
            file_put_contents($cheData, $fileData);
        }
        $allZipfiles = glob(public_path('prezipfiles/*'));
        Madzipper::make(public_path('zipdldir/sum.zip'))->add($allZipfiles)->close();
        $files = glob(public_path('prezipfiles/*'));
        foreach ($files as $file) {
            unlink($file);
        }
        return response()->download(public_path('zipdldir/sum.zip'))->deleteFileAfterSend(true);
    }
}
