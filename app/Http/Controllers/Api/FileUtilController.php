<?php

namespace App\Http\Controllers\Api;

use App\File;
use App\Http\Controllers\Controller;
use DB;
use Illuminate\Http\Request;

class FileUtilController extends Controller
{

    public function deleteSearchFile(Request $request)
    {
        $result = DB::transaction(function () use ($request) {
            $numDeleteCount = File::where('id', '=', $request->input('id'))
                ->where('delete_password', '=', $request->input('deletePassword') === null ? '' : $request->input('deletePassword'))
                ->delete();
            if ($numDeleteCount !== 1) {
                throw new \Exception('ファイルの削除に失敗しました');
            } else {
                return $numDeleteCount;
            }
        });

        if ($result === 1) {
            return $result;
        } else {
            throw new \Exception("ファイルの削除に失敗しました");
        }
    }

    public function myTeam(Request $request)
    {
        return [
            'data' => File::where('upload_user_id', '=', $request->user()->id)
                ->where('data_type', '=', '1')
                ->select('id', 'upload_owner_name', 'file_name', 'file_comment', 'created_at', 'search_tag1', 'search_tag2', 'search_tag3', 'search_tag4')
                ->get()
        ];

    }

    public function myMatch(Request $request)
    {

        return [
            'data' => File::where('upload_user_id', '=', $request->user()->id)
                ->where('data_type', '=', '2')
                ->select('id', 'upload_owner_name', 'file_name', 'file_comment', 'created_at', 'search_tag1', 'search_tag2', 'search_tag3', 'search_tag4')
                ->get(),
        ];
    }
}
