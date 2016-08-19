{{-- 親ビューの指定 --}}
@extends('layout')

{{-- アップロードフォーム --}}
@section('content')
<h2>Upload</h2>
<p>チームデータ・マッチデータのアップロードが可能です。</p>

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
                <form accept-charset="UTF-8" role="form" method="post" action="{{ url('/upload/teamUpload') }}"  enctype="multipart/form-data">
                    <fieldset>
                        <div class="form-group">
                            <label for="teamOwnerName">オーナー名:</label>
                            <input type="text" name="teamOwnerName" class="form-control" id="teamOwnerName" value="{{ Auth::user()->name }}">
                        </div>
                        <div class="form-group">
                            <label for="teamComment">コメント:</label>
                            <textarea name="teamComment" class="form-control" rows="5" id="teamComment">{!! old('teamComment') !!}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="exampleInputFile">チームファイル</label>
                            <input type="file" name="teamFile" id="teamFile" >
                            <p class="help-block">CHEチームデータが選択可能です</p>
                        </div>
                        <input type="hidden" name="_token" value="<?php echo csrf_token(); ?>">
                        <input class="btn btn-block btn-primary" type="submit" value="チームデータアップロード">
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
                <form accept-charset="UTF-8" role="form" method="post" action="{{ url('/upload/matchUpload') }}"  enctype="multipart/form-data">
                    <fieldset>
                        <div class="form-group">
                            <label for="matchOwnerName">オーナー名:</label>
                            <input type="text" name="matchOwnerName" class="form-control" id="teamOwnerName" value="{{ Auth::user()->name }}">
                        </div>
                        <div class="form-group">
                            <label for="matchComment">コメント:</label>
                            <textarea name="matchComment" class="form-control" rows="5" id="matchComment">{!! old('matchComment') !!}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="exampleInputFile">マッチファイル</label>
                            <input type="file" name="matchFile" id="matchFile" >
                            <p class="help-block">CHEマッチデータが選択可能です</p>
                        </div>
                        <input type="hidden" name="_token" value="<?php echo csrf_token(); ?>">
                        <input class="btn btn-block btn-info" type="submit" value="マッチデータアップロード">
                    </fieldset>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection