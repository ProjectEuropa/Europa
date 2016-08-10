<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\BusinessModel\EventBusiness;
use Validator;

class EventNoticeController extends Controller {

    /**
     * 初期表示処理。
     *
     * @param  Request  $request
     * @return view eventNotice.eventNoticeIndex
     */
    public function index() {
        return view('eventNotice.eventNoticeIndex');
    }

    /**
     * 初期表示処理。
     *
     * @param  Request  $request
     * @return view eventNotice.eventNoticeIndex
     */
    public function register(Request $request) {

        /*
          　イベント名・イベント詳細・イベント締日・表示日必須
          　イベント詳細まで（改行コード含む）・イベント締日,表示日日付[yyyy/mm/dd HH:MM]
         */
        $validator = Validator::make($request->all(), [
                    'eventName' => 'required|max:20',
                    'eventDetails' => 'required|max:100',
                    'eventClosingDay' => 'required|date_format:yyyy-mm-dd hh:mm:ss',
                    'eventDisplayingDay' => 'required|date_format:yyyy/mm/dd HH:MM',
        ]);
        
        var_dump($request);

        var_dump($request->input('eventClosingDay'));
        
        if ($validator->fails()) {
            return view('eventNotice.eventNoticeIndex');
//            return redirect('/eventNotice')
//                            ->withInput()
//                            ->withErrors($validator);
        }

        // EventBusinessクラスでイベント登録処理を実行
        $isRegisterSucess = EventBusiness::registerEvent($request);

        if ($isRegisterSucess) {
            \Session::flash('flash_message', trans('messages.register_complete', ['name' => 'イベント']));
            return redirect('eventNotice');
        } else {
            \Session::flash('error_message', trans('messages.register_fail', ['name' => 'イベント']));
            return redirect('eventNotice');
        }
    }

}
