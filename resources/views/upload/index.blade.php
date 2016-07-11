{{-- 親ビューの指定 --}}
@extends('layout')


{{-- ユーザーレコード一覧表示 --}}
@section('content')
<div class="row">
    <div class="col-md-9 col-md-offset-0">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">Please sign in</h3>
            </div>
            <div class="panel-body">
                <form accept-charset="UTF-8" role="form" method="post" action="{{ url('/simpleUpload/upload') }}"  enctype="multipart/form-data">
                    <fieldset>
                        <div class="form-group">
                            <input class="form-control" placeholder="E-mail" name="email" type="text">
                        </div>
                        <div class="form-group">
                            <label for="usr">Owner:</label>
                            <input type="text" class="form-control" id="usr">
                        </div>
                        <div class="form-group">
                            <label for="comment">Comment:</label>
                            <textarea class="form-control" rows="5" id="comment"></textarea>
                        </div>
                        <div class="checkbox">
                            <label>
                                <input name="remember" type="checkbox" value="Remember Me"> Remember Me
                            </label>
                        </div>
                        <div class="form-group">
                            <label for="exampleInputFile">Team Data</label>
                            <input type="file" name="up_file" id="exampleInputFile" >
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

<form class="form-horizontal" role="form">
    <div class="form-group">
        <label for="usr">Owner:</label>
        <input type="text" class="form-control" id="usr">
    </div>
    <div class="form-group">
        <label for="comment">Comment:</label>
        <textarea class="form-control" rows="5" id="comment"></textarea>
    </div>
    <div class="form-group">
        <label for="exampleInputFile">Team Data</label>
        <input type="file" id="exampleInputFile">
        <p class="help-block">● 〇〇MBまでの画像をアップロードできるよ！</p>
    </div>
    <div class="form-group">
        <button type="submit" class="btn btn-primary">Submit</button>
    </div>
</form>
@endsection