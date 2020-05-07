<?php

use App\File;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
 */
use Illuminate\Http\Request;

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('api')->get('/file', function () {
    return File::select('id', 'upload_owner_name', 'file_name', 'file_comment', 'created_at', 'upload_user_id', 'upload_type', 'search_tag1', 'search_tag2', 'search_tag3', 'search_tag4')->get();
});

Route::group(['middleware' => ['api']], function () {
    Route::get('search/{searchType}', 'Api\SearchController@search');
    Route::get('sumDLSearch/{searchType}', 'Api\SearchController@sumDLSearch');
    Route::get('event', 'Api\EventController@getEventData');
    Route::post('delete/searchFile', 'Api\FileUtilController@deleteSearchFile');
});

Route::group(['middleware' => ['api', 'auth:api']], function () {
    Route::get('mypage/team', 'Api\FileUtilController@myTeam');
    Route::get('mypage/match', 'Api\FileUtilController@myMatch');
    Route::get('mypage/events', 'Api\EventController@getMyEventData');
    Route::post('delete/usersRegisteredCloumn ', 'Api\UserController@deleteUsersRegisteredCloumn');
    Route::post('userUpdate ', 'Api\UserController@userUpdate');
});
