<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Maknz\Slack\Facades\Slack;
use Validator;


/*
 * 問い合わせ実行コントローラ
 */
class InquiryController extends Controller {
	/**
	 * 初期表示処理
	 *
	 * @return view inquiry.inquiryIndex
	 */
	public function index() {
		return view('inquiry.inquiryIndex');
	}

	/**
	 * 問い合わせ処理
	 *
	 * @return view inquiry.inquiryIndex
	 */
	public function send(Request $request) {

		$validator = Validator::make($request->all(), [
				'name' => 'required|max:20',
				'email' => 'required|email',
				'inquiryComment' => 'required|max:200',
		]);

		if ($validator->fails()) {
			return redirect('/inquiry')
			->withInput()
			->withErrors($validator);
		}

		Slack::send('>'.$request->input('name').'様から問い合わせ');
		Slack::send('> メールアドレス:'.$request->input('email'));
		Slack::send('> 内容:'.$request->input('inquiryComment'));

		\Session::flash('flash_message', trans('messages.send_complete', ['name' => '問い合わせ内容']));

		return redirect('/inquiry');
	}
}