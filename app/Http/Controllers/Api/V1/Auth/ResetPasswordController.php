<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ResetPasswordController extends Controller
{
    /**
     * API用トークン有効性チェック
     */
    public function showResetForm(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->input('email'))->first();
        if (!$user) {
            return response()->json(['message' => '無効なリセットリンクです'], 400);
        }

        $token = $request->input('token');
        $exists = Password::broker()->getRepository()->exists($user, $token);

        if ($exists) {
            return response()->json(['message' => '有効なリセットリンクです'], 200);
        } else {
            return response()->json(['message' => '無効なリセットリンクです'], 400);
        }
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

        // パスワードリセットを実行
        $status = Password::reset(
          $request->only('email', 'password', 'password_confirmation', 'token'),
          // 成功時のコールバック
          function ($user, $password) {
            // パスワード更新
            $user->forceFill([
              'password'       => Hash::make($password),
              'remember_token' => Str::random(60),
            ])->save();
          }
        );

        // 成功/失敗に応じた処理
        return $status === Password::PASSWORD_RESET
          ? response()->json([
            'message' => 'パスワード再設定成功',
          ], 200)
          : response()->json([
            'error' => __($status)
          ], 400);
    }
}
