<?php

namespace App\Exceptions;

use Throwable;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;

class Handler extends ExceptionHandler
{

    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /**
     * Report or log an exception.
     *
     * @param  \Throwable  $exception
     * @return void
     */
    public function report(Throwable $exception)
    {
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $exception
     * @return \Illuminate\Http\Response
     */
    public function render($request, Throwable $exception)
    {
        // If the request expects JSON and the exception is a ValidationException,
        // return a JSON response with validation errors
        if ($request->expectsJson() && $exception instanceof ValidationException) {
            return response()->json([
                'message' => 'The given data was invalid.',
                'errors' => $exception->errors(),
            ], $exception->status);
        }

        return parent::render($request, $exception);
    }

}
