<?php

/*
  |--------------------------------------------------------------------------
  | Application Routes
  |--------------------------------------------------------------------------
  |
  | Here is where you can register all of the routes for an application.
  | It's a breeze. Simply tell Laravel the URIs it should respond to
  | and give it the controller to call when that URI is requested.
  |
 */

use App\Http\Requests;
use App\Team;

Route::get('/', function () {
    return view('welcome');
});

// チーム一覧
Route::get('/team', 'TeamController@index');

// チームダウンロード
Route::get('/team/download/{id}', 'TeamController@download');

// チーム一覧
Route::get('/simpleUpload', 'UploadController@index');

// チーム一覧
//post（受け取り）
// TODO コントろらーで作成 Onwer名取得
Route::post('/simpleUpload/upload', 'UploadController@upload');
