<?php

namespace App\Http\Controllers\Api\V1;

use App\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class EventNoticeController extends Controller
{


    public function store(Request $request)
    {
        $user = Auth::user();
        $eventReferenceUrl = $request->eventReferenceUrl ?? null;
        $event = new Event;
        $event->register_user_id = $user->id;
        $event->event_name = $request->eventName;
        $event->event_details = $request->eventDetails;
        $event->event_reference_url = $eventReferenceUrl;
        $event->event_type = $request->eventType;
        $event->event_closing_day = $request->eventClosingDay . ' 23:59:00';
        $event->event_displaying_day = $request->eventDisplayingDay . ' 23:59:00';
        $event->save();
        return response()->json([
            'message' => 'イベント告知の登録に成功しました'
        ], 201);
    }
}
