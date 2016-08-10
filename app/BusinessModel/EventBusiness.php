<?php

namespace App\BusinessModel;

use Illuminate\Http\Request;
use App\Event;

/* 
 * EventNoticeビジネスクラス
 * Eventモデルに関わるロジックを記述
 */
class EventBusiness
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
        $event->event_closing_day = $request->input('eventClosingDay');
        $event->event_displaying_day = $request->input('eventDisplayingDay');
        
        if($event->save()){
            return true;
        } else {
            return false;
        }
    }
}
