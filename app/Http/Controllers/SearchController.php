<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use App\BusinessService\FileService;

class SearchController extends Controller
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
        return view('search.index')->with('searchType', $searchType);
    }

    /**
     * ファイルダウンロード実行Action
     * download/{id}のURLのidから指定したidのファイルをDLする
     *
     * @param  id  URL：指定したファイルのid
     * @return response DBに登録済みのバイナリデータ
     */
    public function download($id) 
    {

        $file = DB::table('files')
                ->select('file_name', 'file_data')
                ->where('id', '=', $id)
                ->first();

        // タイトル取得
        $title = $file->file_name;
        // CHEバイナリデータ取得
        $fileData = $file->file_data;
        // 取得したバイナリデータを書き込み
        $cheData = '.CHE';
        file_put_contents($cheData, $fileData);
        $headers = array(
            'Content-Type: application/CHE',
        );
        return response()->download($cheData, $title, $headers);
    }

    /**
     * 
     *
     * @return 
     */
    public function delete(Request $request, $searchType)
    {
        
        $result = DB::transaction(function () use ($request) {
            $numDeleteCount = $this->fileService->deleteSearchFile($request);
            if ($numDeleteCount >= 2) {
                throw new Exception;
            } else {
                return $numDeleteCount;
            }
        });

        if ($result == 0) {
            return redirect('/search/'.$searchType)->with('error_message', 'データの削除に失敗しました');
        } else {
            return redirect('/search/'.$searchType)->with('message', 'データの削除が完了しました');
        }
    }
}
