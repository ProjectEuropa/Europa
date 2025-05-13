<?php

namespace App\Http\Controllers\Api\V1;

use App\File;
use App\Event;
use App\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    /**
     * ユーザー登録カラムの削除
     */
    public function deleteUsersRegisteredCloumn(Request $request)
    {
        // ユーザー認証のチェック
        if (!$request->user()) {
            return response()->json(['error' => '認証されていません'], 401);
        }

        try {
            $result = DB::transaction(function () use ($request) {
                $numDeleteCount = Event::where('register_user_id', $request->user()->id)
                    ->where('id', $request->id)
                    ->delete();
                if ($numDeleteCount !== 1) {
                    throw new \Exception("登録カラムの削除に失敗しました。更新された数は{$numDeleteCount}です。");
                }
                return $numDeleteCount;
            });
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }

        return response()->json(['deleted' => true]);
    }

    /**
     * Get authenticated user's comment
     */
    public function deleteMyFile(Request $request)
    {
        $result = DB::transaction(function () use ($request) {
            $numDeleteCount = File::where('upload_user_id', $request->user()->id)
                ->where('id', $request->id)
                ->delete();

            if ($numDeleteCount !== 1) {
                throw new \Exception("ファイルの削除に失敗しました。ファイル削除数は{$numDeleteCount}です。");
            } else {
                return $numDeleteCount;
            }
        });

        if ($result === 1) {
            return response()->json(['message' => 'ファイルを削除しました']);
        }
        return response()->json(['message' => 'ファイルの削除に失敗しました'], 400);
    }

    /**
     * Update authenticated user's name.
     */
    public function userUpdate(Request $request)
    {
        $user = User::find($request->user()->id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        try {
            $result = DB::transaction(function () use ($user, $validated) {
                $affected = User::where('id', $user->id)
                    ->update(['name' => $validated['name']]);
                if ($affected !== 1) {
                    throw new \Exception("ユーザー名の更新に失敗しました。更新された数は{$affected}です。");
                }
                return $affected;
            });
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }

        $user = User::find($request->user()->id);

        return response()->json([
            'message' => 'ユーザー名を更新しました。',
            'user' => $user
        ]);
    }


    /**
     * Get authenticated user's team files
     */
    public function getMyTeamData(Request $request)
    {
        $files = File::where('upload_user_id', $request->user()->id)
            ->where('data_type', '=', '1')
            ->select('id', 'upload_owner_name', 'file_name', 'file_comment', 'created_at', 'search_tag1', 'search_tag2', 'search_tag3', 'search_tag4', 'downloadable_at')
            ->get();

        return response()->json([
            'files' => $files
        ]);
    }

    /**
     * Get authenticated user's match files
     */
    public function getMyMatchData(Request $request)
    {
        $files = File::where('upload_user_id', $request->user()->id)
            ->where('data_type', '=', '2')
            ->select('id', 'upload_owner_name', 'file_name', 'file_comment', 'created_at', 'search_tag1', 'search_tag2', 'search_tag3', 'search_tag4')
            ->get();

        return response()->json([
            'files' => $files
        ]);
    }

    /**
     * Get authenticated user's events
     */
    public function getMyEventData(Request $request)
    {
        $events = Event::where('register_user_id', $request->user()->id)
            ->get();
        return response()->json([
            'events' => $events
        ]);
    }
}
