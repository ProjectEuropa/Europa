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
use Illuminate\Support\Facades\Input;

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
Route::post('/simpleUpload/upload', function() {

    $team = new Team;

    // fileデータ取得
    $file = Input::file('up_file');
    //$file = Request::file('up_file');

    $team->file_data = file_get_contents($file);
    $team->file_title = $file->getClientOriginalName();
    $team->data_type = '2'; // 定数か

    $team->save();

    return view('upload.index');
});
