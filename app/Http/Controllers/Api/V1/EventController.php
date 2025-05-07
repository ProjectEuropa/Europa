<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Event;
use Illuminate\Http\Request;
use DB;

class EventController extends Controller
{
    /**
     * Display all events
     */
    public function getEventData()
    {
        $data = Event::select(
            'id',
            'event_name',
            'event_details',
            'event_closing_day',
            'event_reference_url'
        )->get();
        return response()->json(['data' => $data]);
    }

    /**
     * Display authenticated user events
     */
    public function getMyEventData(Request $request)
    {
        $data = Event::select(
            'id',
            'event_name',
            'event_details',
            'event_closing_day',
            'event_displaying_day',
            'event_reference_url'
        )
        ->where('register_user_id', $request->user()->id)
        ->get();
        return response()->json(['data' => $data]);
    }
}
