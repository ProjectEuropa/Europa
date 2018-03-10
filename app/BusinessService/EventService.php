<?php

namespace App\BusinessService;

use Illuminate\Http\Request;
use DB;

/*
 * EventServieクラス
 * Eventモデルに関わるロジックを記述
 */
class EventService {

    /**
     *
     * イベント全件検索
     * @return Event
     */
    public function searchAllEvents() 
    {
        return DB::table('events')->select('id', 'event_name', 'event_details', 'event_reference_url', 'event_type', DB::raw("to_char(event_closing_day, 'YYYY/MM/DD (TMDy) HH24:MI') as event_closing_day, "
                                . "to_char(event_displaying_day, 'YYYY/MM/DD (TMDy) HH24:MI') as event_displaying_day "))
                ->get();
    }

    /**
     *
     * ユーザイベント検索
     * 特定ユーザが登録したイベントを検索する
     * @param String $registerUserId 登録ユーザID
     * @return Event
     */
    public function searchUserEvents(String $registerUserId) 
    {
        return DB::table('events')->select('id', 'event_name', 'event_details', DB::raw("to_char(event_closing_day, 'YYYY/MM/DD (TMDy) HH24:MI') as event_closing_day, "
                                . "to_char(event_displaying_day, 'YYYY/MM/DD (TMDy) HH24:MI') as event_displaying_day "))
                ->where('register_user_id', '=', $registerUserId)
                ->get();
    }

    /**
     *
     * イベント登録
     * @param Request
     * @param String 登録ユーザID
     * @return bool
     */
    public function registerEvent(Request $request, String $registerUserId) 
    {
        $now = date('Y/m/d H:i:s');
        $insertArray = [
            'register_user_id' => $registerUserId,
            'event_name' => $request->input('eventName'),
            'event_details' => $request->input('eventDetails'),
            'event_type' => $request->input('eventType'),
            'event_reference_url' => $request->input('eventReferenceUrl') === null ? '#' : $request->input('eventReferenceUrl'),
            'event_closing_day' => $request->input('eventClosingDate') . ' ' . $request->input('eventClosingTime'),
            'event_displaying_day' => $request->input('eventDisplayingDate') . ' ' . $request->input('eventDisplayingTime'),
            'updated_at' => $now,
            'created_at' => $now
        ];

        return DB::table('events')->insert($insertArray);
    }
    
    /**
     *
     * 特定ユーザのイベント削除
     *
     * @param String $eventId イベントID
     * @param String $registerUserId 登録ユーザID
     * @return int $deleteCount 削除件数
     */
    public function deleteUserEvent(String $eventId, String $registerUserId) : int 
    {
        return DB::table('events')
                ->where('id', '=', $eventId)
                ->where('register_user_id', '=', $registerUserId)
                ->delete();
    }

    /**
     *
     * 過去表示の日付イベント削除
     * @return int 削除件数
     */
    public function deletePastDisplayingEvents() : int
    {
        // 表示日時が現在日付以前のイベントを削除
        $now = date('Y/m/d H:i:s');

        $count = DB::table('events')
                ->where('event_displaying_day', '<', $now)
                ->count();

        if ($count >= 1) {
            return DB::table('events')
                ->where('event_displaying_day', '<', $now)
                ->delete();
        } else {
            return 0;
        }
    }

    /**
     *
     * イベントカンレダー用検索
     * @return Event
     */
    public function searchEventCalendarData() {
        return DB::table('events')->select('event_name', 'event_reference_url', 'event_closing_day')->get();
    }
}