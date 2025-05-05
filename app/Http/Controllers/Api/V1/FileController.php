<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\File;
use Illuminate\Http\Request;

class FileController extends Controller
{
    /**
     * Display a listing of files.
     */
    public function index()
    {
        $files = File::select(
            'id',
            'upload_owner_name',
            'file_name',
            'file_comment',
            'created_at',
            'upload_user_id',
            'upload_type',
            'search_tag1',
            'search_tag2',
            'search_tag3',
            'search_tag4'
        )->get();

        return response()->json($files);
    }
}
