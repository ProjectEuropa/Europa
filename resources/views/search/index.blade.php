{{-- 親ビューの指定 --}}
@extends('layout')


{{-- ユーザーレコード一覧表示 --}}
@section('content')

@if (($type) == 'team')
<h2>Team Data</h2>
<p>チームデータの検索が可能です。</p>
@endif
@if (($type) == 'match')
<h2>Match Data</h2>
<p>マッチデータの検索が可能です。</p>
@endif
{{-- フラッシュメッセージの表示 --}}
@if (Session::has('flash_message'))
    <div class="alert alert-success">{{ Session::get('flash_message') }}</div>
@endif
{{-- エラーメッセージの表示 --}}
@if (Session::has('error_message'))
    <div class="alert alert-danger">{{ Session::get('error_message') }}</div>
@endif
<h5>
    <form method="get" action="{!! url('/search', [$type]) !!}" class="form-inline" role="form">
        <div class="form-group">
            <label for="word">検索ワード:</label>
            <input type="text" name="keyword" class="form-control" value="{{$keyword}}">
            {{Form::select('orderType', [
                'new' => '投稿日時の新しい順',
                'old' => '投稿日時の古い順']
                , $orderType, ['class' => 'form-control'])}}
            <button type="submit" class="btn btn-primary">Search</button>
        </div>
    </form>
</h5>
<table class="table table-bordered table-hover">
    <thead>
        <tr class="something">
            <th>ダウンロード</th>
            <th>オーナー名</th>
            <th>コメント</th>
            <th>ファイル名</th>
            <th>アップロード日時</th>
            <th>削除</th>
        </tr>
    </thead>
    <tbody>
        @forelse($files as $file)
        <tr>
            <td class="col-md-1">
                <a href="/search/download/{{$file->id}}"><span class="glyphicon glyphicon-cloud-download"></span></a>
            </td>
            <td class="col-md-1">{{ $file->upload_owner_name }}</td>
            <td class="col-md-3">{!! nl2br(e($file->file_comment)) !!}</td>
            <td class="col-md-1">{{ $file->file_name }}</td>
            <td class="col-md-2">{{ $file->created_at }}</td>
            <td class="col-md-3">
            <form method="post" action="/search/{{$type}}/delete" class="form-horizontal">
                <div class="form-group">
                    <div class="col-xs-12 form-inline">
                        <input type="text" name="deletePassword" class="form-control" placeholder="削除パスワード">
                        <input type="hidden" name="id" class="form-control" value="{{ $file->id }}">
                        <button type="submit" class="btn btn-info btn-delete" value="{{ $file->file_name}}">削除</button>
                        <!-- 削除ボタンクリックイベントを92行目に定義-->
                    </div>
                </div>
                <input type="hidden" name="_token" value="<?php echo csrf_token(); ?>">
            </form>
            </td>
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
{!! $files->appends(['keyword'=>$keyword, 'orderType'=>$orderType])->render() !!}

<script>
 $(function(){
    $(".btn-delete").click(function(){
        if (confirm($(this).val() + "を本当に削除しますか？")){
        } else {
            //cancel
            return false;
        }
    });
});
</script>
@endsection