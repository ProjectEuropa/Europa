<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;

class ForgotPasswordController extends Controller
{
  /**
   * リセットリンク送信フォームを表示
   */
  public function showLinkRequestForm()
  {
    return view('auth.forgot-password'); // Bladeファイル名は自由
  }

  /**
   * リセットリンクをメール送信する
   */
  public function sendResetLinkEmail(Request $request)
  {
    // 入力チェック
    $request->validate([
      'email' => 'required|email',
    ]);

    // リセットリンク送信
    $status = Password::sendResetLink(
      $request->only('email')
    );

    // 送信結果に応じてフラッシュメッセージなどを出し分け
    return $status === Password::RESET_LINK_SENT
      ? back()->with('status', __($status))
      : back()->withErrors(['email' => __($status)]);
  }
}
