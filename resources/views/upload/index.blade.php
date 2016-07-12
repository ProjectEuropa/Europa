{{-- 親ビューの指定 --}}
@extends('layout')

{{-- アップロードフォーム --}}
@section('content')
<h2>Simple Upload</h2>
<p>ユーザー登録処理をせずにチームのアップロードが可能です。</p>

<div class="row">
    <div class="col-md-9 col-md-offset-0">
        <div class="panel panel-default">
            <!--<div class="panel-heading">
                <h3 class="panel-title">Please sign in</h3>
            </div>-->
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
            <div class="panel-body">
                <form accept-charset="UTF-8" role="form" method="post" action="{{ url('/simpleUpload/upload') }}"  enctype="multipart/form-data">
                    <fieldset>
                        <div class="form-group">
                            <label for="owner">OwnerName:</label>
                            <input type="text" name="ownerName" class="form-control" id="usr">
                        </div>
                        <div class="form-group">
                            <label for="comment">Comment:</label>
                            <textarea name="comment" class="form-control" rows="5" id="comment"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="deletePassWord">Delete Password:</label>
                            <input type="text" name="deletePassWord" class="form-control" rows="5" id="comment"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="exampleInputFile">Team File</label>
                            <input type="file" name="teamFile" id="exampleInputFile" >
                            <p class="help-block">CHEチームデータが選択可能です</p>
                        </div>
                        <input type="hidden" name="_token" value="<?php echo csrf_token(); ?>">
                        <input class="btn btn-block btn-primary" type="submit" value="submit">
                    </fieldset>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection