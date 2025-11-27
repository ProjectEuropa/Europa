<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
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

        // トークンの有効期限を設定（Cookieと一致させる）
        $tokenLifetimeMinutes = intval(config('session.lifetime', 120));
        $expiresAt = now()->addMinutes($tokenLifetimeMinutes);

        $token = $user->createToken(
            'auth-token',
            ['*'],
            $expiresAt
        )->plainTextToken;

        // HttpOnly Cookieに保存（XSS攻撃から保護）
        $cookie = cookie(
            config('auth.token_cookie_name'), // Cookie名（設定で一元管理）
            $token,                           // トークン
            $tokenLifetimeMinutes,            // 有効期限をトークンと合わせる
            '/',                              // パス
            null,                             // ドメイン（nullで自動）
            config('session.secure'),         // Secure（HTTPS）
            true,                             // HttpOnly（JavaScriptからアクセス不可）
            false,                            // Raw
            config('session.same_site')       // SameSite
        );

        return response()->json([
            'message' => 'ログイン成功',
            'user' => new UserResource($user),
        ])->cookie($cookie);
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        // ユーザーが認証されている場合のみトークン削除
        if ($user) {
            $accessToken = $user->currentAccessToken();

            // TransientToken（セッションベース認証）でない場合のみトークンを削除
            if ($accessToken && !($accessToken instanceof \Laravel\Sanctum\TransientToken)) {
                $accessToken->delete();
            }
        }

        // セッションのクリーンアップ（存在する場合）
        if ($request->hasSession()) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        // Cookieを削除
        $cookie = cookie()->forget(config('auth.token_cookie_name'));

        return response()->json([
            'message' => 'ログアウトしました'
        ])->cookie($cookie);
    }
}
