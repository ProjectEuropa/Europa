<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use App\BusinessService\FileService;

class ApiController extends Controller
{

    private $fileService;

    public function __construct(FileService $fileService)
    {
        $this->fileService = $fileService;
    }

    /**
     * 
     *
     * @return 
     */
    public function search(Request $request, $searchtype)
    {
        $files = DB::table('files')
                ->select('id', 'upload_owner_name', 'file_name', 'file_comment', 'created_at', 'upload_user_id', 'upload_type',  'search_tag1', 'search_tag2', 'search_tag3', 'search_tag4');

        if ($searchtype == 'team') {
            $files = $files->where('data_type', '=', \Config::get('const.DB_STR_DATA_TYPE_TEAM'));
        } else {
            $files = $files->where('data_type', '=', \Config::get('const.DB_STR_DATA_TYPE_MATCH'));
        }

        if ($request->ordertype) {
            $files = $files->orderby('id', $request->ordertype);
        } else {
            $files = $files->orderby('id', 'desc');
        }

        $keyword =$request->keyword;
        if ($keyword) {
            $files = $this->setSearchKeyword($files, $keyword);
        }

        return $files->paginate(10);
    }

    /**
     * 
     *
     * @return 
     */
    public function sumdownload(Request $request, $searchtype)
    {
        
        $files = DB::table('files')
                ->select('id', 'upload_owner_name', 'file_name', 'file_comment', 'created_at', 'upload_user_id', 'search_tag1', 'search_tag2', 'search_tag3', 'search_tag4');

        if ($searchtype == 'team') {
            $files = $files->where('data_type', '=', \Config::get('const.DB_STR_DATA_TYPE_TEAM'));
        } else {
            $files = $files->where('data_type', '=', \Config::get('const.DB_STR_DATA_TYPE_MATCH'));
        }

        if ($request->ordertype) {
            $files = $files->orderby('id', $request->ordertype);
        } else {
            $files = $files->orderby('id', 'desc');
        }

        $keyword =$request->keyword;
        if ($keyword) {
            $files = $this->setSearchKeyword($files, $keyword);
        }

        return $files->paginate(50);
    }

    /**
     * 
     * 
     */
    private function setSearchKeyword(object $files, String $keyword) : object
    {
        return $files->where(function($files) use ($keyword) {
            $files->orWhere('upload_owner_name', 'LIKE', '%'.$keyword.'%')
                    ->orWhere('file_name', 'like', '%' . $keyword . '%')
                    ->orWhere('file_comment', 'like', '%' . $keyword . '%')
                    ->orWhere('search_tag1', 'like', '%' . $keyword . '%')
                    ->orWhere('search_tag2', 'like', '%' . $keyword . '%')
                    ->orWhere('search_tag3', 'like', '%' . $keyword . '%')
                    ->orWhere('search_tag4', 'like', '%' . $keyword . '%');
        });
    }
}
