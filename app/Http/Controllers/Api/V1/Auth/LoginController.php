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

    /**
     * Handle login request with SPA authentication.
     * Supports both token-based and cookie-based authentication.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * @throws ValidationException
     */
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
        
        // Check if this is a stateful request (SPA mode)
        if ($request->hasSession()) {
            $request->session()->regenerate();
            
            // For SPA mode, just return user data without token
            return response()->json([
                'message' => 'ログイン成功',
                'user' => $user
            ], 200);
        }

        // For API token mode, create token as before
        $token = $user->createToken('app')->plainTextToken;

        return response()->json([
            'message' => 'ログイン成功',
            'token' => $token,
            'user' => $user
        ], 200);
    }

    /**
     * Handle logout request for both SPA and token authentication.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        // For SPA mode with session
        if ($request->hasSession()) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }
        
        // For token-based authentication, revoke current access token
        if ($request->user() && $request->bearerToken()) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json([
            'message' => 'ログアウトしました'
        ], 200);
    }
}
