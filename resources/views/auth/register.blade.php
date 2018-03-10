@extends('layouts.app')

{{-- css読み込みフォーム --}}

 
@section('content')
<main>
    <div class="container">
        <div class="under-header">
            <h2>Register</h2>
            <p>ユーザー登録処理が可能です。</p>
        </div>

        @include('common.validation')

        <div class="row" style="margin-bottom: 10px;">
            <div class="col-md-12 col-md-offset-0">
                <div class="card">
                    <div class="card-header lighten-1 white-text info-color text-center">
                        ユーザー情報入力
                    </div>
                    <div class="card-body">
                        <form role="form" method="post" action="{{ url('/register') }}" style="padding: 0;">
                            <fieldset>
                                <div class="form-group">
                                    <label for="name">名前:</label>
                                    <input type="text" class="form-control input-alternate" name="name" value="{{ old('name') }}" style="padding: 0;">
                                </div>
                                <div class="form-group">
                                    <label for="email">メールアドレス:</label>
                                    <input type="email" class="form-control input-alternate" name="email" value="{{ old('email') }}" style="padding: 0;">
                                </div>
                                <div class="form-group">
                                    <label for="password">パスワード:</label>
                                    <input type="password" class="form-control input-alternate" name="password" style="padding: 0;">
                                </div>                           
                                <div class="form-group">
                                    <label for="password_confirmation">パスワード再確認:</label>
                                    <input type="password" class="form-control input-alternate" name="password_confirmation" style="padding: 0;">
                                </div>
                                {{ csrf_field() }}
                                <button type="submit" class="btn btn-block btn-info">登録</button>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>
@endsection

@section('js')
@include('common.message')
@endsection