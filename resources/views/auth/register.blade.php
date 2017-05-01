@extends('layout')

{{-- css読み込みフォーム --}}

 
@section('content')
<div class="container main">
    <h2>Register</h2>
    <p>ユーザー登録処理が可能です。</p>

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
                    <form role="form" method="post" action="{{ url('/auth/register') }}">
                        <fieldset>
                            <div class="form-group">
                                <label for="name">名前:</label>
                                <input type="text" class="form-control" name="name" value="{{ old('name') }}">
                            </div>
                            <div class="form-group">
                                <label for="email">メールアドレス:</label>
                                <input type="email" class="form-control" name="email" value="{{ old('email') }}">
                            </div>
                             <div class="form-group">
                                <label for="password">パスワード:</label>
                                <input type="password" class="form-control" name="password">
                            </div>                           
                            <div class="form-group">
                                <label for="password_confirmation">パスワード再確認:</label>
                                <input type="password" class="form-control" name="password_confirmation">
                            </div>
                            {{ csrf_field() }}
                            <button type="submit" class="btn btn-block btn-primary">登録</button>
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection