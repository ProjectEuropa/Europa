<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller
{
    protected $redirectTo = '/';

    public function __construct()
    {
        $this->middleware('guest');
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Sanctumトークンを生成
        $token = $user->createToken('auth-token')->plainTextToken;

        // HttpOnly Cookieに保存（XSS攻撃から保護）
        $cookie = cookie(
            config('auth.token_cookie_name'), // Cookie名（設定で一元管理）
            $token,                           // トークン
            config('session.lifetime'),       // セッション有効期限と同じ
            '/',                              // パス
            null,                             // ドメイン（nullで自動）
            config('session.secure'),         // Secure（HTTPS）
            true,                             // HttpOnly（JavaScriptからアクセス不可）
            false,                            // Raw
            config('session.same_site')       // SameSite
        );

        return response()->json([
            'message' => 'ユーザー登録成功',
            'user' => new UserResource($user),
        ], 201)->cookie($cookie);
    }

    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);
    }

    protected function create(array $data)
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
    }
}
