{{-- 親ビューの指定 --}}
@extends('layout')

{{-- アップロードフォーム --}}
@section('content')
<div class="container main">
    <h2>Simple Upload</h2>
    <p>ユーザー登録処理をせずにチームデータ・マッチデータのアップロードが可能です。</p>

    <div class="row">
        <div class="col-md-9 col-md-offset-0">
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

            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">チームデータアップロード</h3>
                </div>
                <div class="panel-body">
                    <form accept-charset="UTF-8" role="form" method="post" action="{{ url('/simpleupload/teamupload') }}"  enctype="multipart/form-data">
                        <fieldset>
                            <div class="form-group">
                                <label for="teamOwnerName">オーナー名:</label>
                                <input type="text" name="teamOwnerName" class="form-control" id="teamOwnerName" value="{!! old('teamOwnerName') !!}">
                            </div>
                            <div class="form-group">
                                <label for="teamComment">コメント:</label>
                                <textarea name="teamComment" class="form-control" rows="5" id="teamComment">{!! old('teamComment') !!}</textarea>
                            </div>
                            <div class="form-group">
                                <label for="teamDeletePassWord">削除パスワード:</label>
                                <input type="text" name="teamDeletePassWord" class="form-control" rows="5" id="teamDeletePassWord" value="{!! old('teamDeletePassWord') !!}">
                            </div>
                            <div class="form-group">
                                <label for="exampleInputFile">チームファイル</label>
                                <input type="file" name="teamFile" id="teamFile" >
                                <p class="help-block">CHEチームデータが選択可能です</p>
                            </div>
                            <input type="hidden" name="_token" value="<?php echo csrf_token(); ?>">
                            <button type="submit" class="btn btn-block btn-primary">チームデータアップロード</button>
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-md-9 col-md-offset-0">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">マッチデータアップロード</h3>
                </div>
                <div class="panel-body">
                    <form accept-charset="UTF-8" role="form" method="post" action="{{ url('/simpleupload/matchupload') }}"  enctype="multipart/form-data">
                        <fieldset>
                            <div class="form-group">
                                <label for="matchOwnerName">オーナー名:</label>
                                <input type="text" name="matchOwnerName" class="form-control" id="matchOwnerName" value="{!! old('matchOwnerName') !!}">
                            </div>
                            <div class="form-group">
                                <label for="matchComment">コメント:</label>
                                <textarea name="matchComment" class="form-control" rows="5" id="matchComment">{!! old('matchComment') !!}</textarea>
                            </div>
                            <div class="form-group">
                                <label for="matchDeletePassWord">削除パスワード:</label>
                                <input type="text" name="matchDeletePassWord" class="form-control" rows="5" id="matchDeletePassWord" value="{!! old('matchDeletePassWord') !!}">
                            </div>
                            <div class="form-group">
                                <label for="exampleInputFile">マッチファイル</label>
                                <input type="file" name="matchFile" id="matchFile" >
                                <p class="help-block">CHEマッチデータが選択可能です</p>
                            </div>
                            <input type="hidden" name="_token" value="<?php echo csrf_token(); ?>">
                            <button type="submit" class="btn btn-block btn-info">マッチデータアップロード</button>
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection