<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\File;
use App\Http\Resources\V1\FileResource;

class SearchController extends Controller
{
    /**
     * Search files by type with pagination and masking
     */
    public function search(Request $request, string $searchType)
    {
        $query = File::where('data_type', $searchType === 'team' ? '1' : '2')
            ->when($request->keyword, fn($q, $k) => $q->withKeyword($k))
            ->orderBy('id', $request->orderType === '1' || is_null($request->orderType) ? 'desc' : 'asc');

        $paginator = $query->paginate(50);
        return FileResource::collection($paginator);
    }

    /**
     * Sum download search with pagination and masking
     */
    public function sumDLSearch(Request $request, string $searchType)
    {
        $query = File::where('data_type', $searchType === 'team' ? '1' : '2')
            ->when($request->keyword, fn($q, $k) => $q->withKeyword($k))
            ->orderBy('id', $request->orderType === '1' || is_null($request->orderType) ? 'desc' : 'asc');

        $paginator = $query->paginate(50);
        return FileResource::collection($paginator);
    }
}
