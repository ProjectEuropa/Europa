<?php

namespace App\Http\Controllers;

use App\BusinessService\EventService;

class EventCalendarController extends Controller {

    /**
     * 初期表示処理。
     * イベントカレンダー用データを全件検索
     *
     * @return view eventCalendar.eventCalendarIndex
     */
    public function index() {
        
        $events = EventService::searchEventCalendarData();

        return view('eventCalendar.eventCalendarIndex', [
            'events' => $events,
        ]);
    }
}
