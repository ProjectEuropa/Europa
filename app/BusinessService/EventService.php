<?php

namespace App\BusinessService;

use Illuminate\Http\Request;
use App\Event;

/* 
 * EventServieクラス
 * Eventモデルに関わるロジックを記述
 */
class EventService
{
     /**
     * 
     * イベント登録
     * @param Request
     * @return bool
     */
    public static function registerEvent(Request $request){
        
        $event = new Event();
        
        $event->event_name = $request->input('eventName');
        $event->event_details = $request->input('eventDetails');
        $event->event_reference_url = $request->input('eventReferenceUrl');
        $event->event_type = $request->input('eventType');
        
        // イベント締切、表示日時はyyyy/mm/dd + hh:mmで登録する
        $eventClosingDay = $request->input('eventClosingDate').' '.$request->input('eventClosingTime');
        $eventDisplayingDay = $request->input('eventDisplayingDate').' '.$request->input('eventDisplayingTime');
        
        $event->event_closing_day = $eventClosingDay;
        $event->event_displaying_day = $eventDisplayingDay;
        
        if($event->save()){
            return true;
        } else {
            return false;
        }
    }
}
