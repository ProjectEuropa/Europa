<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\EventNoticeRequest;
use App\BusinessService\EventService;
use Auth;

class EventNoticeController extends Controller
{
    private $eventService;

    public function __construct(EventService $eventService)
    {
        $this->eventService = $eventService;
    }

    /**
     * 
     * 初期表示処理
     * @return 
     */
    public function index()
    {
        return view('eventnotice.index');
    }

    /**
     * イベント登録処理。
     *
     * @param  Request  $request
     * @return view eventNotice.eventNoticeIndex
     */
    public function register(EventNoticeRequest $request) 
    {
        // EventBusinessクラスでイベント登録処理を実行
        $registerUserId = Auth::user()->id;
        $isRegisterSucess = $this->eventService->registerEvent($request, $registerUserId);
        if ($isRegisterSucess) {
            return redirect('/eventnotice')->with('message', 'イベントの登録が完了しました。');
        } else {
            return redirect('/eventnotice')->with('error_message', 'イベントの登録に失敗しました。');
        }
    }
}
