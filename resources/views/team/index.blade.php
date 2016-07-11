{{-- 親ビューの指定 --}}
@extends('layout')


{{-- ユーザーレコード一覧表示 --}}
@section('content')
<table class="table table-bordered table-hover">
    <thead>
        <tr>
            <th>DownLoad</th>
            <th>Description</th>
            <th>Onwer</th>
            <th>Summary</th>
            <th>File Name</th>
            <th>Uploaded On</th>
        </tr>
    </thead>
    <tbody>
        @forelse($teams as $team)
        <tr>
            <td><a href="#"><span class="glyphicon glyphicon-cloud-download"></span></a></td>
            <td><a href="#"><span class="glyphicon glyphicon glyphicon-file"></span></a></td>
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
@endsection