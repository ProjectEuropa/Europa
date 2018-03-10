@extends('layouts.app')

@section('css')
@endsection

@section('content')
<main>
    <div class="container">
        <div class="under-header">
            <h2>Login</h2>
            <p>登録ユーザー情報およびTwitterまたはGoogleアカウントでのログインが有効です。</p>
        </div>

        @include('common.validation')

        <div class="row" style="margin-bottom: 10px;">
            <div class="col-md-12 col-md-offset-0">
                <div class="card">
                    <div class="card-header lighten-1 white-text info-color text-center">
                        ユーザー情報入力
                    </div>
                    <div class="card-body">
                        <form role="form" method="post" action="{{ url('/login') }}">
                            <fieldset>
                                <div class="form-group">
                                    <label for="email">メールアドレス:</label>
                                    <input type="email" class="form-control input-alternate" name="email" value="{{ old('email') }}" style="padding: 0;" required>
                                </div>
                                <div class="form-group">
                                    <label for="password">パスワード:</label>
                                    <input type="password" class="form-control input-alternate" name="password" style="padding: 0;" required>
                                </div>
                                <div class="pure-controls">

                                <label for="remember" class="pure-checkbox">
                                    <input id="remember" type="checkbox" name="remember"
                                    {!! old('remember') ? 'checked="checked"' : '' !!} > 継続ログイン
                                </label>
                                <a class="pure-button" href="{!! url('/password/reset') !!}">
                                    パスワードリセット
                                </a>
                                </div>
                            
                                {{ csrf_field() }}
                                <button type="submit" class="btn btn-block btn-info">ログイン</button>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-3">
            <a class="btn btn-info btn-tw"  href="{{ url('/auth/twitter') }}">
                <span class="fa fa-twitter"></span> Login with Twitter
            </a>
            <a class="btn btn-danger btn-gplus"  href="{{ url('/auth/google') }}">
                <span class="fa fa-google-plus"></span> Login with Google
            </a>
        </div>
    </div>
</main>
@endsection

@section('js')
    @include('common.message')
@endsection