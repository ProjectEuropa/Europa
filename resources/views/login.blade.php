@extends('layout')

{{-- css読み込みフォーム --}}
@section('css')
<link rel="stylesheet" href="{{ asset('css/bootstrap/bootstrap.social.css') }}">
<link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css" rel="stylesheet">
@endsection

@section('content')
<div class="container main">
    <h2>Login</h2>
    <p>登録ユーザー情報およびTwitterまたはGoogleアカウントでのログインが有効です。</p>

    <div class="row">
        <div class="col-md-9 col-md-offset-0">
            {{-- フラッシュメッセージの表示 --}}
            @include('common.flash')

            {{-- バリデーションメッセージの表示 --}}
            @include('common.validation')
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">ユーザー情報入力</h3>
                </div>
                <div class="panel-body">
                    <form role="form" method="post" action="{{ url('/auth/login') }}">
                        <fieldset>
                            <div class="form-group">
                                <label for="email">メールアドレス:</label>
                                <input type="email" class="form-control" name="email" value="{{ old('email') }}">
                            </div>
                            <div class="form-group">
                                <label for="password">パスワード:</label>
                                <input type="password" class="form-control" name="password">
                            </div>
                            <div class="pure-controls">

                              {{-- remember me（継続ログイン）の有効無効指定チェックボックス --}}
                              <label for="remember" class="pure-checkbox">
                                <input id="remember" type="checkbox" name="remember"
                                {{-- remember入力項目が存在しているならば、チェックされている --}}
                                {!! old('remember') ? 'checked="checked"' : '' !!} > 継続ログイン
                            </label>
                            <a class="pure-button" href="{!! url('/password/email') !!}">
                                パスワードリセット
                            </a>
                            </div>
                        
                            {{ csrf_field() }}
                            <button type="submit" class="btn btn-block btn-primary">ログイン</button>
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div class="col-md-3">
        <a class="btn btn-block btn-social btn-twitter"  href="/auth/twitter">
            <span class="fa fa-twitter"></span> Login with Twitter
        </a>
        <a class="btn btn-block btn-social btn-google"  href="/auth/google">
            <span class="fa fa-google-plus"></span> Login with Google
        </a>
    </div>
</div>
@endsection