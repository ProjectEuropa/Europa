<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

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
     * Update user information
     */
    public function userUpdate(Request $request)
    {
        // TODO: implement update logic
        return response()->json(['updated' => true]);
    }
}
