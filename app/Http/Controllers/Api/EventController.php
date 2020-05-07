<?php

namespace App\Http\Controllers\Api;

use App\Event;
use App\Http\Controllers\Controller;
use DB;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function getEventData()
    {
        $data = Event::select('id', 'event_name', 'event_details', 'event_closing_day', 'event_reference_url')->get();
        return ['data' => $data];
    }

    public function getMyEventData(Request $request)
    {
        $data = Event::select('id', 'event_name', 'event_details', 'event_closing_day', 'event_displaying_day', 'event_reference_url')
            ->where('register_user_id', $request->user()->id)
            ->get();
        return ['data' => $data];
    }
}
