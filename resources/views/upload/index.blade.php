{{-- 親ビューの指定 --}}
@extends('layout')

{{-- アップロードフォーム --}}
@section('content')
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
                <form accept-charset="UTF-8" role="form" method="post" action="{{ url('/simpleUpload/teamUpload') }}"  enctype="multipart/form-data">
                    <fieldset>
                        <div class="form-group">
                            <label for="owner">オーナー名:</label>
                            <input type="text" name="ownerName" class="form-control" id="teamOwnerName">
                        </div>
                        <div class="form-group">
                            <label for="comment">コメント:</label>
                            <textarea name="comment" class="form-control" rows="5" id="teamComment"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="deletePassWord">削除パスワード:</label>
                            <input type="text" name="deletePassWord" class="form-control" rows="5" id="teamDeletePassWord">
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
                <form accept-charset="UTF-8" role="form" method="post" action="{{ url('/simpleUpload/matchUpload') }}"  enctype="multipart/form-data">
                    <fieldset>
                        <div class="form-group">
                            <label for="owner">オーナー名:</label>
                            <input type="text" name="ownerName" class="form-control" id="matchOwnerName">
                        </div>
                        <div class="form-group">
                            <label for="comment">コメント:</label>
                            <textarea name="comment" class="form-control" rows="5" id="matchComment"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="deletePassWord">削除パスワード:</label>
                            <input type="text" name="deletePassWord" class="form-control" rows="5" id="matchDeletePassWord">
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