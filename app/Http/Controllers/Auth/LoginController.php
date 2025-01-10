<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
  /**
   * Handle login request.
   *
   * @param Request $request
   * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
   * @throws ValidationException
   */
  public function login(Request $request)
  {
    // バリデーションを実施: メールアドレスとパスワードが必須
    $request->validate([
      'email' => 'required|email',
      'password' => 'required',
    ]);

    // ログイン認証を試みる
    if (!Auth::attempt($request->only('email', 'password'))) {
      // 認証失敗時にエラーを返す
      throw ValidationException::withMessages([
        'email' => ['メールアドレスまたはパスワードが正しくありません。'],
      ]);
    }

    // 認証されたユーザーを取得
    $user = $request->user();

    // APIトークンを生成
    $token = Str::random(80);

    // ユーザーのAPIトークンを更新
    $user->forceFill([
      'api_token' => hash('sha256', $token),
    ])->save();

    // セッションにトークンを保存
    session()->put('api_token', $token);

    // 成功時のレスポンス: JSONまたはリダイレクト
    return redirect('/');
  }

    protected function authenticated(Request $request)
    {
        $token = Str::random(80);

        $request->user()->forceFill([
            'api_token' => hash('sha256', $token),
        ])->save();

        session()->put('api_token', $token);
    }

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

  /**
   * Logout the user and invalidate the API token.
   *
   * @param Request $request
   * @return \Illuminate\Http\RedirectResponse
   */
  public function logout(Request $request)
  {
    // 現在のユーザーの API トークンを無効化
    $request->user()->forceFill([
      'api_token' => null,
    ])->save();

    // セッションをクリア
    session()->flush();

    // ユーザーをログアウト
    auth()->logout();

    // ログアウト後のリダイレクト先を定義
    return redirect('/');
  }
}
