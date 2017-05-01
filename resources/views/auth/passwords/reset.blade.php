@extends('layout')

@section('content')
<div class="container main">
    <h2>Password Reset Setting</h2>
    <p>パスワードリセットの設定を行ってください。</p>

    <div class="row">
        <div class="col-md-9 col-md-offset-0">
            {{-- フラッシュメッセージの表示 --}}
            @include('common.flash')

            {{-- バリデーションメッセージの表示 --}}
            @include('common.validation')
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">パスワードリセット情報入力</h3>
                </div>
                <div class="panel-body">
                    <form role="form" method="post" action="{{ url('/password/reset') }}">
                        <input type="hidden" name="token" value="{{ $token }}">

                        <fieldset>
                            <div class="form-group">
                                <label for="email">メールアドレス:</label>
                                <input id="email" type="email" class="form-control" name="email" value="{{ $email or old('email') }}">
                            </div>
                            <div class="form-group">
                                <label for="password">パスワード:</label>
                                <input id="password" type="password" class="form-control" name="password">
                            </div>
                            <div class="form-group">
                                <label for="password">パスワード再確認:</label>
                                <input id="password-confirm" type="password" class="form-control" name="password_confirmation">
                            </div>
                        
                            {{ csrf_field() }}
                            <button type="submit" class="btn btn-block btn-primary">パスワードリセット</button>
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
