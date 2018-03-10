@extends('layouts.app')

@section('content')
<main>
    <div class="container">
        <div class="under-header">
            <h2>Password Reset Setting</h2>
            <p>パスワードリセットの設定を行ってください。</p>
        </div>

        <div class="row" style="margin-bottom: 10px;">
            <div class="col-md-12 col-md-offset-0">
                <div class="card">
                    <div class="card-header lighten-1 white-text info-color text-center">パスワードリセット</div>

                    <div class="card-body">
                        <div class="cardpanel-body">
                        <form class="form-horizontal" method="POST" action="{{ route('password.request') }}">
                            {{ csrf_field() }}

                            <input type="hidden" name="token" value="{{ $token }}">

                            <div class="form-group{{ $errors->has('email') ? ' has-error' : '' }}">
                                <label for="email" class="control-label">メールアドレス:</label>

                                <div class="">
                                    <input id="email" type="email" class="form-control input-alternate" name="email" value="{{ $email or old('email') }}" style="padding: 0;" required autofocus>

                                    @if ($errors->has('email'))
                                        <span class="help-block">
                                            <strong>{{ $errors->first('email') }}</strong>
                                        </span>
                                    @endif
                                </div>
                            </div>

                            <div class="form-group{{ $errors->has('password') ? ' has-error' : '' }}">
                                <label for="password" class="control-label">パスワード:</label>

                                <div class="">
                                    <input id="password" type="password" class="form-control input-alternate" name="password" style="padding: 0;" required>

                                    @if ($errors->has('password'))
                                        <span class="help-block">
                                            <strong>{{ $errors->first('password') }}</strong>
                                        </span>
                                    @endif
                                </div>
                            </div>

                            <div class="form-group{{ $errors->has('password_confirmation') ? ' has-error' : '' }}">
                                <label for="password-confirm" class="control-label">パスワード再確認:</label>
                                <div class="">
                                    <input id="password-confirm" type="password" class="form-control input-alternate" name="password_confirmation" style="padding: 0;" required>

                                    @if ($errors->has('password_confirmation'))
                                        <span class="help-block">
                                            <strong>{{ $errors->first('password_confirmation') }}</strong>
                                        </span>
                                    @endif
                                </div>
                            </div>

                            <div class="form-group">
                                <div class="">
                                    <button type="submit" class="btn btn-info btn-block">
                                            パスワードリセット
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>
@endsection
