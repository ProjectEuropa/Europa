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
//ログイン後用
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

//イベントカレンダー
Route::get('/eventcalendar', 'EventCalendarController@index');

// リンク集画面
Route::get('/links', function () {
    return view('links.linksIndex');
});

// 検索一覧（チーム・マッチ共用）
Route::get('/search/{searchType}', 'SearchController@index');
// ダウンロード（チーム・マッチ共用）
Route::get('/search/download/{id}', 'SearchController@download');
// 削除（チーム・マッチ共用）
Route::post('/search/{searchType}/delete', 'SearchController@delete');


// まとめてダウンロード検索一覧（チーム・マッチ共用）
Route::get('/sumdownload/{searchType}', 'SumDownloadController@index');
// 削除（チーム・マッチ共用）
Route::post('/sumdownload/download', 'SumDownloadController@download');

// アップロード画面・簡易
Route::get('/simpleupload', 'UploadController@simpleIndex');
// アップロード画面・通常
Route::get('/upload', 'UploadController@normalIndex');

// アップロード（チーム・マッチデータ）
//post（受け取り）
Route::post('/simpleupload/teamupload', 'UploadController@teamUpload');
Route::post('/simpleupload/matchupload', 'UploadController@matchUpload');
Route::post('/upload/teamupload', 'UploadController@normalTeamUpload');
Route::post('/upload/matchupload', 'UploadController@normalMatchUpload');

// マイページ
Route::get('/mypage', 'MypageController@index');
//マイページ・ファイル削除
Route::post('/mypage/file/delete', 'MypageController@fileDelete');
//マイページ・イベント削除
Route::post('/mypage/event/delete', 'MypageController@eventDelete');
//マイページ・ダウンロード
Route::get('/mypage/download/{id}', 'MypageController@download');
//マイページ・ダウンロード
Route::post('/mypage/editUserInfo', 'MypageController@editUserInfo');

//イベント告知
Route::get('/eventnotice', 'EventNoticeController@index');
//イベント告知登録
Route::post('/eventnotice/register', 'EventNoticeController@register');

//インフォメーション
Route::get('/information', 'InformationController@index');

//ログイン認証用
Route::group(['middleware' => 'guest'], function () {
    Route::get('/login', function ()    {
        return view('login');
    });
});
Route::get('/auth/twitter', 'Auth\SocialController@getTwitterAuth');
Route::get('/auth/twitter/callback', 'Auth\SocialController@getTwitterAuthCallback');
Route::get('/auth/google', 'Auth\SocialController@getGoogleAuth');
Route::get('/auth/google/callback', 'Auth\SocialController@getGoogleAuthCallback');
Route::get('/auth/logout', 'Auth\AuthController@logout');

// 通常ログイン
Route::get('/auth/login', 'Auth\AuthController@getLogin');
Route::post('/auth/login', 'Auth\AuthController@postLogin');
Route::get('/auth/register', 'Auth\AuthController@getRegister');
Route::post('/auth/register', 'Auth\AuthController@postRegister');

// パスワードリセット
Route::get('password/email', 'Auth\PasswordController@getEmail');
Route::post('password/email', 'Auth\PasswordController@postEmail');
Route::get('password/reset/{token}', 'Auth\PasswordController@getReset');
Route::post('password/reset', 'Auth\PasswordController@postReset');

// 問い合わせ
Route::get('/inquiry', 'InquiryController@index');
// 問い合わせ
Route::post('/inquiry/send', 'InquiryController@send');

// 動画
Route::get('/video/upload', 'VideoController@index');
Route::post('/video/upload', 'VideoController@upload');
Route::get('/video/search', 'VideoController@search');

