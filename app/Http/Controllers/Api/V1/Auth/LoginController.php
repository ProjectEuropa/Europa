<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            return response()->json([
                'error' => 'メールアドレスまたはパスワードが正しくありません。'
            ], 401);
        }

        $user = Auth::user();

        // Sanctumトークンを生成
        $token = $user->createToken('auth-token')->plainTextToken;

        // HttpOnly Cookieに保存（XSS攻撃から保護）
        $cookie = cookie(
            'auth_token',                    // Cookie名
            $token,                          // トークン
            config('session.lifetime'),      // セッション有効期限と同じ
            '/',                             // パス
            null,                            // ドメイン（nullで自動）
            config('session.secure'),        // Secure（HTTPS）
            true,                            // HttpOnly（JavaScriptからアクセス不可）
            false,                           // Raw
            config('session.same_site')      // SameSite
        );

        return response()->json([
            'message' => 'ログイン成功',
            'user' => $user,
        ])->cookie($cookie);
    }

    public function logout(Request $request)
    {
        // Sanctumトークンを削除
        $request->user()->currentAccessToken()->delete();

        // Cookieを削除
        $cookie = cookie()->forget('auth_token');

        return response()->json([
            'message' => 'ログアウトしました'
        ])->cookie($cookie);
    }
}
