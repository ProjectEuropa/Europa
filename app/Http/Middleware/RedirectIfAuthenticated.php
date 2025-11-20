<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null)
    {
        if (Auth::guard($guard)->check()) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Already authenticated.',
                    'user' => Auth::guard($guard)->user(),
                ], 200);
            }
            return redirect('/home');
        }

        return $next($request);
    }
}
