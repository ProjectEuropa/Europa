<?php

namespace App\Http\Controllers;

use App\BusinessService\EventService;

class InfomationController extends Controller {

    /**
     * 初期表示処理。
     * 表示が過去日付イベント削除し、表示する全件のイベントを検索
     *
     * @return view infomation.informationIndex
     */
    public function index() {
        
        EventService::deletePastDisplayingEvents();
        
        $events = EventService::searchAllEvents();

        return view('infomation.informationIndex', [
            'events' => $events,
        ]);
    }
}
