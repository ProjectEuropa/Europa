@extends('layouts.app')

@section('content')
<main>
    <div class="container">
        <div class="under-header">
            <h2>Password Reset</h2>
            <p>パスワードのリセットが可能です。登録したメールアドレスを入力して送信ボタンをクリックしてください。</p>
        </div>
        @if (session('status'))
        <div class="alert alert-success">
            {{ session('status') }}
        </div>
        @endif

        <div class="row" style="margin-bottom: 10px;">
            <div class="col-md-12 col-md-offset-0">
                <div class="card">
                    <div class="card-header lighten-1 white-text info-color text-center">パスワードリセット</div>
                    <div class="card-body">
                        <form class="form-horizontal" method="POST" action="{{ route('password.email') }}">
                            {{ csrf_field() }}

                            <div class="form-group{{ $errors->has('email') ? ' has-error' : '' }}">
                                <label for="email" class="control-label">メールアドレス:</label>

                                <div class="">
                                    <input id="email" type="email" class="form-control input-alternate" name="email" value="{{ old('email') }}" style="padding: 0;" required >

                                    @if ($errors->has('email'))
                                        <span class="help-block">
                                            <strong>{{ $errors->first('email') }}</strong>
                                        </span>
                                    @endif
                                </div>
                            </div>

                            <div class="form-group">
                                <div class="">
                                    <button type="submit" class="btn btn-info btn-block">
                                            パスワードリセットリンクを送信
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
