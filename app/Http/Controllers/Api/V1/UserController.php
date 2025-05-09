<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\User;
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
                $affected = User::where('id', $request->user()->id)
                    ->update(['registered_column' => null]);
                if ($affected !== 1) {
                    throw new \Exception("登録カラムの削除に失敗しました。更新された数は{$affected}です。");
                }
                return $affected;
            });
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }

        return response()->json(['deleted' => true]);
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
}
