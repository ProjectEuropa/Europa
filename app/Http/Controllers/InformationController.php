<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use App\BusinessService\EventService;

class InformationController extends Controller
{

    private $eventService;

    public function __construct(EventService $eventService)
    {
        $this->eventService = $eventService;
    }

    /**
     * 
     *
     * @return 
     */
    public function index()
    {
        $this->eventService->deletePastDisplayingEvents();

        $events = $this->eventService->searchAllEvents();

        return view('information.index')->with('events', $events);
    }

    /**
     * 
     * イベントカレンダー用データを全件検索
     *
     * @return view 
     */
    public function calendar() {
        
        $events = $this->eventService->searchEventCalendarData();

        return view('information.calendar')->with('events', $events);
    }
}
