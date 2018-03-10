<?php
namespace App\Http\Controllers;
use App\BusinessService\EventService;
use App\User;
use Auth;
use Illuminate\Http\Request;
use App\BusinessService\FileService;
use App\Http\Requests\EditUserRequest;

/*
 * 　マイページコントローラ
 */
class MypageController extends Controller {


    private $fileService;
    private $eventService;

    public function __construct(FileService $fileService, EventService $eventService)
    {
        $this->fileService = $fileService;
        $this->eventService = $eventService;

    }

    /**
     * 初期表示処理。チーム・マッチデータ検索
     *
     * @return view mypage.mypageInde
     */
    public function index() {
        //ユーザの持つチームデータマッチデータ登録イベント検索
        $teams = $this->fileService->searchUserFiles(Auth::user()->id, \Config::get('const.DB_STR_DATA_TYPE_TEAM'));
        $matchs = $this->fileService->searchUserFiles(Auth::user()->id, \Config::get('const.DB_STR_DATA_TYPE_MATCH'));
        $events = $this->eventService->searchUserEvents(Auth::user()->id);
        //チームデータマッチデータの検索結果を送信
        return view('mypage.index')->with('teams', $teams)
                                         ->with('matchs', $matchs)
                                         ->with('events', $events);
    }
    /**
     * ファイル削除実行Action
     *
     * @param  Requesty  $request
     * @return view mypage
     */
    public function fileDelete(Request $request) {

        // id, アップロードユーザIDをキーとして削除実行
        $deleteCount = $this->fileService->deleteUserFile($request->input('id'), Auth::user()->id);
        if ($deleteCount === 0) {
            // 削除カウントが0の場合削除失敗
            return redirect('/mypage')->with('error_message', 'データの削除に失敗しました。');
        } else {
            return redirect('/mypage')->with('message', 'データの削除が完了しました。');
        }
    }
    /**
     * イベント削除実行Action
     *
     * @param  Request  $request
     * @return view mypage
     */
    public function eventDelete(Request $request) {
        // id, 登録ユーザIDをキーとして削除実行
        $deleteCount = $this->eventService->deleteUserEvent($request->input('id'), Auth::user()->id);
        if ($deleteCount === 0) {
            // 削除カウントが0の場合削除失敗
            return redirect('/mypage')->with('error_message', 'データの削除に失敗しました。');
        } else {
            return redirect('/mypage')->with('message', 'データの削除が完了しました。');
        }
    }

    /**
     * ユーザ情報編集Action
     * ユーザ情報（現状オーナー名のみ）を編集し、DBのusersテーブルをUpdateする
     * @param Request
     * @return view mypage
     */
    public function editUserInfo(EditUserRequest $request) {
        // ユーザーIDをセッションから取得
        $userId = Auth::user()->id;
        // オーナー名をリクエストから取得
        $ownerName = $request->input('ownerName');
        $userQuery = User::query();
        // ユーザ名をUpdate
        $userQuery->where('id', $userId)->update(['name' => $ownerName]);
        return redirect('/mypage')->with('message', 'オーナー名の編集が完了しました。');
    }
}