<?php

Route::group(['middleware' => 'auth.very_basic'], function () {
    Route::get('/', function () {
        return view('index');
    });
    Route::get('/upload', function () {
        return view('index');
    });
    Route::get('/{any}', function () {
        return view('index');
    })->where('any', '[^aut].*$');

    Route::post('/login', 'Auth\LoginController@login');
    Route::post('/register', 'Auth\RegisterController@register');
    Route::get('/auth/logout', 'Auth\LoginController@logout');
    Route::get('/auto/download/{id}', 'FileConventionalUtilController@download');
    Route::post('/sumDownload', 'FileConventionalUtilController@sumDownload');
    Route::post('/eventNotice', 'EventNoticeController@store');

    Route::post('/team/simpleupload', 'UploadController@teamSimpleUpload');
    Route::post('/match/simpleupload', 'UploadController@matchSimpleUpload');
    Route::post('/team/upload', 'UploadController@teamUpload');
    Route::post('/match/upload', 'UploadController@matchUpload');

    Route::get('/auth/twitter', 'Auth\SocialAuthController@getTwitterAuth');
    Route::get('/auth/twitter/callback', 'Auth\SocialAuthController@getTwitterAuthCallback');

    Auth::routes(['register' => false, 'login' => false]);
});
