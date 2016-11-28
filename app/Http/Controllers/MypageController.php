<?php

namespace App\Http\Controllers;

use App\BusinessService\EventService;
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

        //ユーザの持つチームデータマッチデータ登録イベント検索
        $teams = FileService::searchUserFiles(Auth::user()->id, Constants::DB_STR_DATA_TYPE_TEAM);
        $matchs = FileService::searchUserFiles(Auth::user()->id, Constants::DB_STR_DATA_TYPE_MATCH);
        $events = EventService::searchUserEvents(Auth::user()->id);

        //チームデータマッチデータの検索結果を送信
        return view('mypage.mypageIndex', [
            'teams' => $teams,
            'matchs' => $matchs,
            'events' => $events
        ]);
    }

    /**
     * ファイル削除実行Action
     *
     * @param  Requesty  $request
     * @return view mypage
     */
    public function fileDelete(Request $request) {
        $id = $request->input('id');

        // id, アップロードユーザIDをキーとして削除実行
        $deleteCount = FileService::deleteUserFile($id, Auth::user()->id);

        if ($deleteCount === 0) {
            // 削除カウントが0の場合削除失敗
            \Session::flash('error_message', trans('messages.delete_fail', ['name' => 'データ']));
        } else {
            \Session::flash('flash_message', trans('messages.delete_complete', ['name' => 'データ']));
        }

        return redirect('mypage');
    }

    /**
     * イベント削除実行Action
     *
     * @param  Requesty  $request
     * @return view mypage
     */
    public function eventDelete(Request $request) {
        $id = $request->input('id');

        // id, 登録ユーザIDをキーとして削除実行
        $deleteCount = EventService::deleteUserEvent($id, Auth::user()->id);

        if ($deleteCount === 0) {
            // 削除カウントが0の場合削除失敗
            \Session::flash('error_message', trans('messages.delete_fail', ['name' => 'イベント']));
        } else {
            \Session::flash('flash_message', trans('messages.delete_complete', ['name' => 'イベント']));
        }

        return redirect('mypage');
    }

    /**
     * ユーザ情報編集Action
     * ユーザ情報（現状オーナー名のみ）を編集し、DBのusersテーブルをUpdateする
     * @param Request
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
