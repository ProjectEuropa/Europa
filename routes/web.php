<?php

use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\ResetPasswordController;

Route::group(['middleware' => 'auth.very_basic'], function () {
    Route::get('/', function () {
        return view('welcome');
    });
    Route::get('/upload', function () {
        return view('index');
    });
    Route::get('/{any}', function () {
      return view('index');
    })->where('any', '^(?!api)(?!aut).*$');

    Route::post('/login', 'Auth\LoginController@login');
    Route::post('/register', 'Auth\RegisterController@register');
    Route::get('/auth/logout', 'Auth\LoginController@logout');
    Route::get('/auto/download/{id}', 'FileConventionalUtilController@download');
    Route::post('/sumDownload', 'FileConventionalUtilController@sumDownload');
    Route::post('/eventNotice', 'EventNoticeController@store');

    Route::post('/team/simpleupload', 'UploadController@upload')->defaults('isTeam', true)->defaults('isNormalUpdate', false);
    Route::post('/match/simpleupload', 'UploadController@upload')->defaults('isTeam', false)->defaults('isNormalUpdate', false);
    Route::post('/team/upload', 'UploadController@upload')->defaults('isTeam', true)->defaults('isNormalUpdate', true);
    Route::post('/match/upload', 'UploadController@upload')->defaults('isTeam', false)->defaults('isNormalUpdate', true);



  Route::get('login', [LoginController::class, 'showLoginForm'])->name('login');
  Route::post('login', [LoginController::class, 'login']);
  Route::post('logout', [LoginController::class, 'logout'])->name('logout');

  Route::get('password/reset', [ForgotPasswordController::class, 'showLinkRequestForm'])->name('password.request');
  Route::post('password/email', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email');
  Route::get('password/reset/{token}', [ResetPasswordController::class, 'showResetForm'])->name('password.reset');
  Route::post('password/reset', [ResetPasswordController::class, 'reset']);
});
