<?php

namespace App\Http\Controllers\Api;

use App\Event;
use App\File;
use App\Http\Controllers\Controller;
use App\User;
use DB;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function userUpdate(Request $request)
    {
        $result = DB::transaction(function () use ($request) {
            $numDeleteCount = User::where('id', $request->user()->id)
                ->update(['name' => $request->name]);

            if ($numDeleteCount !== 1) {
                throw new \Exception("ユーザー名の更新に失敗しました。更新された数は${numDeleteCount}です。");
            } else {
                return $numDeleteCount;
            }
        });
    }

    public function deleteUsersRegisteredCloumn(Request $request)
    {
        $result = 0;
        if ($request->fileType === 'event') {
            $result = DB::transaction(function () use ($request) {
                $numDeleteCount = Event::where('register_user_id', $request->user()->id)
                    ->where('id', $request->id)
                    ->delete();

                if ($numDeleteCount !== 1) {
                    throw new \Exception("ファイルの削除に失敗しました。ファイル削除数は${numDeleteCount}です。");
                } else {
                    return $numDeleteCount;
                }
            });
        } else {
            $result = DB::transaction(function () use ($request) {
                $numDeleteCount = File::where('upload_user_id', $request->user()->id)
                    ->where('id', $request->id)
                    ->delete();

                if ($numDeleteCount !== 1) {
                    throw new \Exception("ファイルの削除に失敗しました。ファイル削除数は${numDeleteCount}です。");
                } else {
                    return $numDeleteCount;
                }
            });
        }

        if ($result === 1) {
            return $result;
        } else {
            throw new \Exception("ファイルの削除に失敗しました");
        }
    }
}
