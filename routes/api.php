<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

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

// Legacy API routes (unversioned - keep existing endpoints)
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
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
    Route::post('delete/usersRegisteredCloumn', 'Api\UserController@deleteUsersRegisteredCloumn');
    Route::post('userUpdate', 'Api\UserController@userUpdate');
});

Route::prefix('v1')->group(function () {
    Route::post('login', [\App\Http\Controllers\Api\V1\Auth\LoginController::class, 'login']);
    Route::post('register', [\App\Http\Controllers\Api\V1\Auth\RegisterController::class, 'register']);
    Route::get('auth/logout', [\App\Http\Controllers\Api\V1\Auth\LoginController::class, 'logout']);
    Route::get('download/{id}', [\App\Http\Controllers\Api\V1\FileConventionalUtilController::class, 'download']);
    Route::post('sumDownload', [\App\Http\Controllers\Api\V1\FileConventionalUtilController::class, 'sumDownload']);
    Route::post('eventNotice', [\App\Http\Controllers\Api\V1\EventNoticeController::class, 'store']);
    Route::post('team/simpleupload', [\App\Http\Controllers\Api\V1\UploadController::class, 'upload'])->defaults('isTeam', true)->defaults('isNormalUpdate', false);
    Route::post('match/simpleupload', [\App\Http\Controllers\Api\V1\UploadController::class, 'upload'])->defaults('isTeam', false)->defaults('isNormalUpdate', false);

    Route::middleware('auth:sanctum')->get('/user/profile', function (Request $request) {
      return response()->json($request->user());
    });

    Route::group(['middleware' => ['api']], function () {
        Route::get('search/{searchType}', [\App\Http\Controllers\Api\V1\SearchController::class, 'search']);
        Route::get('sumDLSearch/{searchType}', [\App\Http\Controllers\Api\V1\SearchController::class, 'sumDLSearch']);
        Route::get('event', [\App\Http\Controllers\Api\V1\EventController::class, 'getEventData']);
        Route::post('delete/searchFile', [\App\Http\Controllers\Api\V1\FileConventionalUtilController::class, 'deleteSearchFile']);
    });

    Route::group(['middleware' => ['auth:sanctum']], function () {
        Route::get('mypage/team', [\App\Http\Controllers\Api\V1\UserController::class, 'getMyTeamData']);
        Route::get('mypage/match', [\App\Http\Controllers\Api\V1\UserController::class, 'getMyMatchData']);
        Route::get('mypage/events', [\App\Http\Controllers\Api\V1\UserController::class, 'getMyEventData']);
        Route::post('eventNotice', [\App\Http\Controllers\Api\V1\EventNoticeController::class, 'store']);
        Route::post('delete/usersRegisteredCloumn', [\App\Http\Controllers\Api\V1\UserController::class, 'deleteUsersRegisteredCloumn']);
        Route::post('delete/myFile', [\App\Http\Controllers\Api\V1\UserController::class, 'deleteMyFile']);
        Route::post('user/update', [\App\Http\Controllers\Api\V1\UserController::class, 'userUpdate']);
        Route::post('team/upload', [\App\Http\Controllers\Api\V1\UploadController::class, 'upload'])->defaults('isTeam', true)->defaults('isNormalUpdate', true);
        Route::post('match/upload', [\App\Http\Controllers\Api\V1\UploadController::class, 'upload'])->defaults('isTeam', false)->defaults('isNormalUpdate', true);
    });
});
