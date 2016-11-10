<?php

namespace App\Http\Controllers;

use App\File;
use App\CommonUtils\Constants;
use App\BusinessService\FileService;
use Illuminate\Http\Request;

/*
 * 　チームデータ検索コントローラ
 */

class SearchController extends Controller {

    /**
     * チーム・マッチデータ検索処理
     * ページング機能を実装
     *
     * @param  Request  $request
     * @param searchType search/{searchType} teamの場合はチーム検索、matchの場合はマッチ検索
     * @return view search/team or search/match
     */
    public function index(Request $request, $searchType) {

        // ソート順指定
        $orderType = $request->input('orderType');
        // 検索ワード取得
        $keyword = $request->input('keyword');

        //ページング機能:1ページ10レコード
        $files = FileService::searchFiles($request, $searchType, Constants::NUM_PAGENATION_TEN);

        // 検索ワードと検索結果、検索タイプを送信
        return view('search.searchIndex', [
            'files' => $files,
            'keyword' => $keyword,
            'searchType' => $searchType, // team or match
            'orderType' => $orderType
        ]);
    }

    /**
     * ファイルダウンロード実行Action
     * download/{id}のURLのidから指定したidのファイルをDLする
     *
     * @param  id  URL：指定したファイルのid
     * @return response DBに登録済みのバイナリデータ
     */
    public function download($id) {
        $file = File::where('id', '=', $id)->first();

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
     * ファイル削除実行Action
     *
     * @param  Requesty  $request
     * @param $searchType search/{type} 'team'または'match'
     * @return view search/team or search/match
     */
    public function delete(Request $request, $searchType) {
        $id = $request->input('id');

        //DBから削除パスワード取得
        $dbDeletePassWord = File::where('id', '=', $id)->select('delete_password')->first()->delete_password;

        // 削除パスワード取得
        $inputDeletePassWord = $request->input('deletePassword');

        // 入力パスとDBのパスが一致していない場合、削除処理をせずViewを返却
        if ($dbDeletePassWord !== $inputDeletePassWord) {
            \Session::flash('error_message', trans('messages.run_mistake', ['name' => '削除パスワード']));
            return redirect('search/' . $searchType);
        }

        // id, delete_passwordをキーとして削除実行
        File::where('id', '=', $id)->where('delete_password', '=', $inputDeletePassWord)->delete();

        if ($searchType == Constants::URL_SEARCH_TYPE_TEAM) {
            \Session::flash('flash_message', trans('messages.delete_complete', ['name' => 'チームデータ']));
        } else {
            \Session::flash('flash_message', trans('messages.delete_complete', ['name' => 'マッチデータ']));
        }
        return redirect('search/' . $searchType);
    }

}
