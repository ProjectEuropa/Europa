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

// top画面
Route::get('/', function () {
    return view('welcome');
});
//twitterログイン後用
Route::get('/', array('as' => '/', 'uses' => function(){
    return view('welcome');
}));

// リプレイ・ヘルプ未実装
Route::get('/replayData', function () {
    return view('errors.503');
});
Route::get('/help', function () {
    return view('errors.503');
});

// リンク集画面
Route::get('/links', function () {
    return view('links.index');
});

// 検索一覧（チーム・マッチ共用）
Route::get('/search/{type}', 'SearchController@index');
// ダウンロード（チーム・マッチ共用）
Route::get('/search/download/{id}', 'SearchController@download');
// 削除（チーム・マッチ共用）
Route::post('/search/{type}/delete', 'SearchController@delete');

// アップロード画面・簡易
Route::get('/simpleUpload', 'UploadController@simpleIndex');
// アップロード画面・通常
Route::get('/upload', 'UploadController@normalIndex');

// アップロード（チーム・マッチデータ）
//post（受け取り）
Route::post('/simpleUpload/teamUpload', 'UploadController@teamUpload');
Route::post('/simpleUpload/matchUpload', 'UploadController@matchUpload');
Route::post('/upload/teamUpload', 'UploadController@normalTeamUpload');
Route::post('/upload/matchUpload', 'UploadController@normalMatchUpload');

// マイページ
Route::get('/mypage', 'MypageController@index');
//マイページ・データ削除
Route::post('/mypage/delete', 'MypageController@delete');
//マイページ・ダウンロード
Route::get('/mypage/download/{id}', 'MypageController@download');
//マイページ・ダウンロード
Route::post('/mypage/editUserInfo', 'MypageController@editUserInfo');

//Twitter認証用
Route::get('twitter', function () {
    return view('twitterAuth');
});
Route::get('auth/twitter', 'Auth\AuthController@redirectToProvider');
Route::get('auth/twitter/callback', 'Auth\AuthController@handleProviderCallback');
Route::get('auth/logout', 'Auth\AuthController@logout');