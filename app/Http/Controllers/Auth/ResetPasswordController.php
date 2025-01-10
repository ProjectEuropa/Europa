<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ResetPasswordController extends Controller
{
  /**
   * パスワード再設定フォームを表示
   */
  public function showResetForm(Request $request, $token = null)
  {
    return view('auth.reset-password', [
      'token' => $token,
      'email' => $request->email,
    ]);
  }

  /**
   * パスワードの再設定処理
   */
  public function reset(Request $request)
  {
    // バリデーション
    $request->validate([
      'token'    => 'required',
      'email'    => 'required|email',
      'password' => 'required|min:8|confirmed',
    ]);

    $token = Str::random(80);

    // パスワードリセットを実行
    $status = Password::reset(
      $request->only('email', 'password', 'password_confirmation', 'token'),
      // 成功時のコールバック
      function ($user, $password) use ($token) {
        // パスワード更新
        $user->forceFill([
          'password'       => Hash::make($password),
          'remember_token' => Str::random(60),
          'api_token'      => hash('sha256', $token),
        ])->save();

        session()->put('api_token', $token);
        Auth::login($user);
      }
    );

    // 成功/失敗に応じた処理
    return $status === Password::PASSWORD_RESET
      ? redirect()->route('login')->with('status', __($status))
      : back()->withErrors(['email' => __($status)]);
  }
}
