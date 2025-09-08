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
        
        // Sanctumのセッション認証を使用（セッションが利用可能な場合のみ）
        if ($request->hasSession()) {
            $request->session()->regenerate();
        }
        
        return response()->json([
            'message' => 'ログイン成功',
            'user' => $user,
            'token' => '' // Cookie認証のため空文字列を返す（後方互換性維持）
        ], 200);
    }

    public function logout(Request $request)
    {
        // Cookie認証のみに統一（セキュリティ強化）
        Auth::guard('web')->logout();
        
        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return response()->json([
            'message' => 'ログアウトしました'
        ], 200);
    }
}
