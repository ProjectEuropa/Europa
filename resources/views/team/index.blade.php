{{-- 親ビューの指定 --}}
@extends('layout')


{{-- ユーザーレコード一覧表示 --}}
@section('content')
<h2>Team Data</h2>
<p>チームデータの検索が可能です。</p>
<h5>
    <form method="get" action="/team" class="form-inline" role="form">
        <div class="form-group">
            <label for="word">検索ワード:</label>
            <input type="text" name="keyword" class="form-control" value="{{$keyword}}">
            <select class="form-control" id="sel1">
                <option>投稿日時の新しい順</option>
                <option>投稿日時の古い順</option>
            </select>
            <button type="submit" class="btn btn-primary">Search</button>
        </div>
    </form>
</h5>
<table class="table table-bordered table-hover">
    <thead>
        <tr>
            <th>DownLoad</th>
            <th>Onwer</th>
            <th>Summary</th>
            <th>File Name</th>
            <th>Uploaded On</th>
        </tr>
    </thead>
    <tbody>
        @forelse($teams as $team)
        <tr>
            <td>
                <a href="{!! url('/team/download', [$team->id]) !!}"><span class="glyphicon glyphicon-cloud-download"></span></a>
            </td>
            <td>{{ $team->upload_user_name }}</td>
            <td>{{ $team->file_comment }}</td>
            <td>{{ $team->file_title }}</td>
            <td>{{ $team->created_at }}</td>
        </tr>

        @empty
        <tr>
            <td></td>
            <td>レコード未登録</td>
            <td></td><td></td><td></td><td></td>
        </tr>
        @endforelse
    </tbody>
</table>

{{-- ページネーションリンク キーワード返却含む--}}
{!! $teams->appends(['keyword'=>$keyword])->render() !!}

@endsection