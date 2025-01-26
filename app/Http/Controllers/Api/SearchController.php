<?php

namespace App\Http\Controllers\Api;

use App\File;
use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class SearchController extends Controller
{
  public function search(Request $request, string $searchType)
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
      'search_tag4',
      'downloadable_at'
    )
      ->where('data_type', '=', $searchType === "team" ? '1' : '2')
      ->orderBy('id', $request->orderType === '1' || $request->orderType === null ? 'desc' : 'asc');

    $keyword = $request->keyword;
    if ($keyword) {
      $files = $this->setSearchKeyword($files, $keyword);
    }

    // ページネーションする
    // per_page の数はお好みで変更してください。
    // またはクエリパラメータ等に合わせて可変にすることも可能です。
    $files = $files->paginate(10);

    // ページネータ内に含まれるコレクションを取り出してマスク処理
    $files->getCollection()->transform(function ($file) {
      if ($file->downloadable_at && now()->lt($file->downloadable_at)) {
        $file->file_comment = 'ダウンロード可能日時が過ぎていないためコメントは非表示です';
      }
      return $file;
    });

    // ページネータを返すと、テストで 'current_page' や 'data' が確認できる
    return $files;
  }

  private function setSearchKeyword(Builder $files, string $keyword): Builder
  {
    return $files->where(function ($query) use ($keyword) {
      // 例: file_commentも検索する場合
      $query->orWhere('upload_owner_name', 'LIKE', '%' . $keyword . '%')
        ->orWhere('file_name', 'like', '%' . $keyword . '%')
        ->orWhere('file_comment', 'like', '%' . $keyword . '%')
        ->orWhere('search_tag1', 'like', '%' . $keyword . '%')
        ->orWhere('search_tag2', 'like', '%' . $keyword . '%')
        ->orWhere('search_tag3', 'like', '%' . $keyword . '%')
        ->orWhere('search_tag4', 'like', '%' . $keyword . '%');
    });
  }

  public function sumDLsearch(Request $request, string $searchType)
  {
    $files = File::select(
      'id',
      'upload_owner_name',
      'file_name',
      'file_comment',
      'created_at',
      'upload_user_id',
      'search_tag1',
      'search_tag2',
      'search_tag3',
      'search_tag4',
      'downloadable_at'
    )
      ->where('data_type', '=', $searchType === "team" ? '1' : '2')
      ->orderBy('id', $request->orderType === '1' || $request->orderType === null ? 'desc' : 'asc');

    $keyword = $request->keyword;
    if ($keyword) {
      $files = $this->setSearchKeyword($files, $keyword);
    }

    // ページネーションする
    $files = $files->paginate(10);

    // マスク処理
    $files->getCollection()->transform(function ($file) {
      if ($file->downloadable_at && now()->lt($file->downloadable_at)) {
        $file->file_comment = 'ダウンロード可能日時が過ぎていないためコメントは非表示です';
      }
      return $file;
    });

    return $files;
  }
}
