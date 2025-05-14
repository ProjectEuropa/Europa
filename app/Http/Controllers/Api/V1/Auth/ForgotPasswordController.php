<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;

class ForgotPasswordController extends Controller
{


    /**
     * リセットリンクをメール送信する
     */
    public function sendResetLinkEmail(Request $request)
    {
        // 入力チェック
        $request->validate(['email' => 'required|email']);

        // リセットリンク送信
        $status = Password::sendResetLink($request->only('email'));

        // 送信結果に応じてフラッシュメッセージなどを出し分け
        return $status === Password::RESET_LINK_SENT
        ? response()->json([
          'status' => __($status)
        ])
        : response()->json([
          'error' => __($status)
        ], 400);
    }
}
