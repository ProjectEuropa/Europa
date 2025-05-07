<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\User;

class UserController extends Controller
{
    /**
     * Return authenticated user profile
     */
    public function profile(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Delete users registered column
     */
    public function deleteUsersRegisteredCloumn(Request $request)
    {
        // TODO: implement deletion logic
        return response()->json(['deleted' => true]);
    }

    /**
     * Update authenticated user's name.
     */
    public function userUpdate(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        try {
            $result = DB::transaction(function () use ($request) {
                $affected = User::where('id', $request->user()->id)
                    ->update(['name' => $request->name]);

                if ($affected !== 1) {
                    throw new \Exception("ユーザー名の更新に失敗しました。更新された数は{$affected}です。");
                }
                return $affected;
            });

            $user = User::find($request->user()->id);

            return response()->json([
                'message' => 'ユーザー名を更新しました。',
                'user' => $user,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 400);
        }
    }
}
