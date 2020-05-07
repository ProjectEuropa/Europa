<?php

namespace App\Http\Controllers\Api;

use App\File;
use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     *
     *
     * @return
     */
    public function search(Request $request, string $searchType)
    {
        $files = File::select('id', 'upload_owner_name', 'file_name', 'file_comment', 'created_at', 'upload_user_id', 'upload_type', 'search_tag1', 'search_tag2', 'search_tag3', 'search_tag4')
            ->where('data_type', '=', $searchType === "team" ? '1' : '2')
            ->orderby('id', $request->orderType === '1' || $request->orderType === null ? 'desc' : 'asc');

        $keyword = $request->keyword;
        if ($keyword) {
            $files = $this->setSearchKeyword($files, $keyword);
        }
        return $files->paginate(10);
    }

    /**
     *
     *
     */
    private function setSearchKeyword(Builder $files, String $keyword): Builder
    {
        return $files->where(function ($files) use ($keyword) {
            $files->orWhere('upload_owner_name', 'LIKE', '%' . $keyword . '%')
                ->orWhere('file_name', 'like', '%' . $keyword . '%')
                ->orWhere('file_comment', 'like', '%' . $keyword . '%')
                ->orWhere('search_tag1', 'like', '%' . $keyword . '%')
                ->orWhere('search_tag2', 'like', '%' . $keyword . '%')
                ->orWhere('search_tag3', 'like', '%' . $keyword . '%')
                ->orWhere('search_tag4', 'like', '%' . $keyword . '%');
        });
    }

    /**
     *
     *
     * @return
     */
    public function sumDLsearch(Request $request, string $searchType)
    {
        $files = File::select('id', 'upload_owner_name', 'file_name', 'file_comment', 'created_at', 'upload_user_id', 'search_tag1', 'search_tag2', 'search_tag3', 'search_tag4')
            ->where('data_type', '=', $searchType === "team" ? '1' : '2')
            ->orderby('id', $request->orderType === '1' || $request->orderType === null ? 'desc' : 'asc');

        $keyword = $request->keyword;
        if ($keyword) {
            $files = $this->setSearchKeyword($files, $keyword);
        }
        return $files->paginate(50);
    }
}
