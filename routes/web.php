<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});
Route::get('/simpleupload', function () {
    return view('upload.index');
});
Route::post('/team/simpleupload', 'UploadController@teamSimpleUpload');
Route::post('/match/simpleupload', 'UploadController@matchSimpleUpload');


// 検索一覧（チーム・マッチ共用）
// 実際の検索機能はApiで実施
Route::get('/search/{searchType}', 'SearchController@index');
// ダウンロード（チーム・マッチ共用）
Route::get('/search/download/{id}', 'SearchController@download');
// 削除（チーム・マッチ共用）
Route::delete('/search/{searchType}/delete', 'SearchController@delete');
// 一括ダウンロード一覧（チーム・マッチ共用）
// 実際の検索機能はApiで実施
Route::get('/sumdownload/{searchType}', 'SumDownloadController@index');
Route::post('/sumdownload/download', 'SumDownloadController@download');
//インフォメーション
Route::get('/information', 'InformationController@index');
Route::get('/eventcalendar', 'InformationController@calendar');

// リンク集画面
Route::get('/links', function () {
    return view('links.index');
});

Route::group(['middliware' => 'auth'], function() {
    Route::get('/upload', function () {
        return view('upload.index');
    });
    Route::post('/match/upload', 'UploadController@matchUpload');
    Route::post('/team/upload', 'UploadController@teamUpload');
    //イベント告知
    Route::get('/eventnotice', 'EventNoticeController@index');
    Route::post('/eventnotice', 'EventNoticeController@register');
    // マイページ
    Route::get('/mypage', 'MypageController@index');
    //マイページ・ファイル削除
    Route::delete('/mypage/file/delete', 'MypageController@fileDelete');
    //マイページ・イベント削除
    Route::delete('/mypage/event/delete', 'MypageController@eventDelete');
    //マイページ・ユーザ情報編集
    Route::post('/mypage/edituserinfo', 'MypageController@editUserInfo');
});


Route::get('/auth/twitter', 'Auth\SocialController@getTwitterAuth');
Route::get('/auth/twitter/callback', 'Auth\SocialController@getTwitterAuthCallback');
Route::get('/auth/google', 'Auth\SocialController@getGoogleAuth');
Route::get('/auth/google/callback', 'Auth\SocialController@getGoogleAuthCallback');

Auth::routes();
