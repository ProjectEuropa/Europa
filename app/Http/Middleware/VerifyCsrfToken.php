<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * Indicates whether the XSRF-TOKEN cookie should be set on the response.
     *
     * @var bool
     */
    protected $addHttpCookie = true;

    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array
     */
    protected $except = [
        // Sanctumの正攻法でCSRF保護を維持
    ];

    /**
     * Add the CSRF token to the response cookies.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Symfony\Component\HttpFoundation\Response  $response
     * @return \Symfony\Component\HttpFoundation\Response
     */
    protected function addCookieToResponse($request, $response)
    {
        $config = config('session');

        if ($this->addHttpCookie) {
            $response->headers->setCookie(
                new \Symfony\Component\HttpFoundation\Cookie(
                    'XSRF-TOKEN',
                    $request->session()->token(),
                    time() + 60 * $config['lifetime'],
                    $config['path'],
                    $config['domain'],
                    $config['secure'],
                    false, // httpOnly = false (JavaScriptからアクセス可能)
                    false, // raw
                    $config['same_site'] ?? 'none'
                )
            );
        }

        return $response;
    }
}
