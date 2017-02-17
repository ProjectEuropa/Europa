{{-- 親ビューの指定 --}}
@extends('layout')

{{-- 問い合わせフォーム --}}
@section('content')
<div class="container main">
    <h2>Inquiry</h2>
    <p>問い合わせ内容を記述し送信ボタンをクリックしてください。</p>

    <div class="row">
        <div class="col-md-9 col-md-offset-0">
            {{-- フラッシュメッセージの表示 --}}
            @include('common.flash')

            {{-- バリデーションメッセージの表示 --}}
            @include('common.validation')

            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">問い合わせ内容</h3>
                </div>
                <div class="panel-body">
                    <form accept-charset="UTF-8" role="form" method="post" action="{{ url('/inquiry/send') }}">
                        <fieldset>
                            <div class="form-group">
                                <label for="name">名前:</label>
                                <input type="text" name="name" class="form-control" id="name" value="{!! old('name') !!}">
                            </div>
                            <div class="form-group">
                                <label for="email">メールアドレス:</label>
                                <input type="text" name="email" class="form-control" id="email" value="{!! old('email') !!}">
                            </div>
                            <div class="form-group">
                                <label for="inquiryComment">問い合わせ内容:</label>
                                <textarea name="inquiryComment" class="form-control" rows="5" id="inquiryComment">{!! old('inquiryComment') !!}</textarea>
                            </div>
                            {{ csrf_field() }}
                            <button type="submit" id="inquirySend" class="btn btn-block btn-primary">送信</button>
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

{{-- btn.js読み込み --}}
@section('js')
<script type="text/javascript" src="{{ asset('js/btn.js') }}"></script>
@endsection