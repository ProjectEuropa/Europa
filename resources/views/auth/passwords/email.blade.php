@extends('layout')

<!-- Main Content -->
@section('content')
<div class="container main">
    <h2>Password Reset</h2>
    <p>パスワードのリセットが可能です。登録したメールアドレスを入力して送信ボタンをクリックしてください。</p>

    <div class="row">
        <div class="col-md-9 col-md-offset-0">
            {{-- フラッシュメッセージの表示 --}}
            @include('common.flash')

            @if (session('status'))
            <div class="alert alert-success">
              {{ session('status') }}
            </div>
            @endif

            {{-- バリデーションメッセージの表示 --}}
            @include('common.validation')
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">パスワードリセット</h3>
                </div>
                <div class="panel-body">
                    <form role="form" method="post" action="{{ url('/password/email') }}">
                        <fieldset>
                            <div class="form-group">
                                <label for="email">メールアドレス:</label>
                                <input id="email" type="email" class="form-control" name="email" value="{{ old('email') }}">
                            </div>

                            {{ csrf_field() }}
                            <button type="submit" class="btn btn-block btn-primary">パスワードリセットリンクを送信</button>
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

@endsection
