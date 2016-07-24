{{-- 親ビューの指定 --}}
@extends('layout')


{{-- ユーザーレコード一覧表示 --}}
@section('content')

<h2>My Page</h2>
<p>ユーザー登録情報の編集アップロードしたチームデータ・マッチデータの閲覧が可能です。</p>

{{-- フラッシュメッセージの表示 --}}
@if (Session::has('flash_message'))
<div class="alert alert-success">{{ Session::get('flash_message') }}</div>
@endif

{{-- バリデーションメッセージの表示 --}}
@if (count($errors) > 0)
<div class="alert alert-danger">
    <ul>
@foreach ($errors->all() as $error)
    <li>{{ $error }}</li>
    @endforeach
    </ul>
</div>
@endif
<div style="margin-top: 30px;">
    <h4>登録ユーザー情報</h4>
    <div class="row">
        <div class="col-md-2">
            <img src="{{ Auth::user()->avatar }}" class="img-thumbnail img-responsive">
        </div>
        <div class="col-md-4">  
            <h5 class="text-left">オーナー名</h5>
            <form method="post" action="/mypage/editUserInfo" class="form-inline" role="form">
                <div class="form-group">
                    <input type="text" name="ownerName" value="{{ Auth::user()->name }}">
                    <button type="submit" class="btn btn-primary btn-edit">編集</button>
                </div>
                <input type="hidden" name="_token" value="<?php echo csrf_token(); ?>">
            </form>
        </div>
    </div>
</div>

<div style="margin-top: 30px;">
    <h4>アップロード済チームデータ</h4>
    <table class="table table-bordered table-hover">
        <thead>
            <tr class="something">
                <th class="col-md-1">ダウンロード</th>
                <th class="col-md-1">オーナー名</th>
                <th class="col-md-3">コメント</th>
                <th class="col-md-1">ファイル名</th>
                <th class="col-md-2">アップロード日時</th>
                <th class="col-md-1">削除</th>
            </tr>
        </thead>
        <tbody>
            @forelse($teams as $team)
            <tr>
                <td class="col-md-1">
                    <a href="/mypage/download/{{$team->id}}"><span class="glyphicon glyphicon-cloud-download"></span></a>
                </td>
                <td class="col-md-1">{{ $team->upload_owner_name }}</td>
                <td class="col-md-3">{!! nl2br(e($team->file_comment)) !!}</td>
                <td class="col-md-1">{{ $team->file_name }}</td>
                <td class="col-md-2">{{ $team->created_at }}</td>
                <td class="col-md-1">
                    <form method="post" action="/mypage/delete" class="form-horizontal">
                        <div class="form-group">
                            <div class="col-xs-12 form-inline">
                                <input type="hidden" name="id" class="form-control" value="{{ $team->id }}">
                                <button type="submit" class="btn btn-info btn-delete" value="{{ $team->file_name}}">削除</button>
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
</div>

<div style="margin-top: 30px;">
    <h4>アップロード済マッチデータ</h4>
    <table class="table table-bordered table-hover">
        <thead>
            <tr class="something">
                <th class="col-md-1">ダウンロード</th>
                <th class="col-md-1">オーナー名</th>
                <th class="col-md-3">コメント</th>
                <th class="col-md-1">ファイル名</th>
                <th class="col-md-2">アップロード日時</th>
                <th class="col-md-1">削除</th>
            </tr>
        </thead>
        <tbody>
            @forelse($matchs as $match)
            <tr>
                <td class="col-md-1">
                    <a href="/mypage/download/{{$match->id}}"><span class="glyphicon glyphicon-cloud-download"></span></a>
                </td>
                <td class="col-md-1">{{ $match->upload_owner_name }}</td>
                <td class="col-md-3">{!! nl2br(e($match->file_comment)) !!}</td>
                <td class="col-md-1">{{ $match->file_name }}</td>
                <td class="col-md-2">{{ $match->created_at }}</td>
                <td class="col-md-1">            
                    <form method="post" action="/mypage/delete" class="form-horizontal">
                        <div class="form-group">
                            <div class="col-xs-12 form-inline">
                                <input type="hidden" name="id" class="form-control" value="{{ $match->id }}">
                                <button type="submit" class="btn btn-info btn-delete" value="{{ $match->file_name}}">削除</button>
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
</div>
@endsection

{{-- Javascript読み込み --}}
@section('js')
<script>
 $(function(){
    $(".btn-delete").click(function(){
        if (confirm($(this).val() + "を本当に削除しますか？")){
        } else {
            //cancel
            return false;
        }
    });
    $(".btn-edit").click(function(){
        if (confirm("この内容でユーザ情報を更新しますか？")){
        } else {
            //cancel
            return false;
        }
    });
});
</script>
@endsection