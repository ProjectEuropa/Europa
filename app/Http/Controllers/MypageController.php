<?php

namespace App\Http\Controllers;

use App\File;
use App\User;
use Validator;
use Auth;
use App\CommonUtils\Constants;
use Illuminate\Http\Request;
use App\BusinessService\FileService;

/*
 * 　マイページコントローラ
 */

class MypageController extends Controller {

    /**
     * Mypageは認証必須
     */
    public function __construct() {
        $this->middleware('auth');
    }

    /**
     * 初期表示処理。チーム・マッチデータ検索
     *
     * @return view mypage.mypageInde
     */
    public function index() {
        
        //ユーザの持つチームデータマッチデータ検索
        $teams = FileService::searchUserFiles(Auth::user()->id, Constants::DB_STR_DATA_TYPE_TEAM);
        $matchs = FileService::searchUserFiles(Auth::user()->id, Constants::DB_STR_DATA_TYPE_MATCH);

        //チームデータマッチデータの検索結果を送信
        return view('mypage.mypageIndex', [
            'teams' => $teams,
            'matchs' => $matchs
        ]);
    }

    /** TODO 不要
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
     * @return view mypage
     */
    public function delete(Request $request) {
        $id = $request->input('id');

        // id, delete_passwordをキーとして削除実行
        File::where('id', '=', $id)->delete();

        \Session::flash('flash_message', trans('messages.delete_complete', ['name' => 'データ']));
        return redirect('mypage');
    }

    /**
     * ユーザ情報編集Action
     * ユーザ情報（現状オーナー名のみ）を編集し、DBのusersテーブルをUpdateする
     *
     * @return view mypage
     */
    public function editUserInfo(Request $request) {

        /*
          　オーナー名必須
         */
        $validator = Validator::make($request->all(), [
                    'ownerName' => 'required|max:12'
        ]);

        if ($validator->fails()) {
            return redirect('/mypage')
                            ->withInput()
                            ->withErrors($validator);
        }

        // ユーザーIDをセッションから取得
        $userId = Auth::user()->id;
        // オーナー名をリクエストから取得
        $ownerName = $request->input('ownerName');

        $userQuery = User::query();
        // ユーザ名をUpdate
        $userQuery->where('id', $userId)->update(['name' => $ownerName]);

        \Session::flash('flash_message', trans('messages.update_complete', ['name' => 'オーナー名']));

        return redirect('mypage');
    }

}
