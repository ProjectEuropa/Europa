<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AuthenticateFromCookie
{
    /**
     * CookieからSanctumトークンを取得してAuthorizationヘッダーに設定
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Cookieからauth_tokenを取得
        $token = $request->cookie('auth_token');

        // トークンが存在し、Authorizationヘッダーが未設定の場合
        if ($token && !$request->bearerToken()) {
            // AuthorizationヘッダーにBearerトークンを設定
            $request->headers->set('Authorization', "Bearer {$token}");
        }

        return $next($request);
    }
}
