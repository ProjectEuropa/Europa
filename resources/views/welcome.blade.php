{{-- 親ビューの指定 --}}
@extends('layout')

{{-- css読み込みフォーム --}}
@section('css')
<link rel ="stylesheet" href= "{{ asset('css/top.css') }}">
@endsection

@section('content')
<div id="main-carousel" class="carousel">
    <div class="europa-inner">
        <div class="item active">
            <img src="image/europa.jpg">
            <div class="carousel-caption">
                <h1>Welcome To Europa</h1>
                <p>Carnage Heart Exa 非公式アップローダーEuropaにようこそ！</p>
                <p>Headerのリンク先からお進みください。</p>
                <a href="https://twitter.com/share" class="twitter-share-button" data-size="large">Tweet</a>
                <script>!function(d, s, id){var js, fjs = d.getElementsByTagName(s)[0], p = /^http:/.test(d.location)?'http':'https'; if (!d.getElementById(id)){js = d.createElement(s); js.id = id; js.src = p + '://platform.twitter.com/widgets.js'; fjs.parentNode.insertBefore(js, fjs); }}(document, 'script', 'twitter-wjs');</script>
                
                <div class="c-c-japan">This image of copyright belong to <a href="https://creativecommons.jp/">creative commons JAPAN</a></p></div>
            </div>
        </div>
    </div>
</div>

<div class="container">
    <div class="row">
        <!-- cell -->
        <div class="col-sm-4">
            <div class="panel panel-deafult">
                <div class="panel-header">検索・ダウンロード機能</div>
                <div class="panel-body">
                    <div class="img-box">
                        <img src="image/search.png" class="box-img">
                    </div>
                    <div>
                        チームデータorマッチデータを検索してダウンロードが可能です。アイコンを押すとダウンロードが始まります。<br>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="panel panel-deafult">
                <div class="panel-header">アップロード機能</div>
                <div class="panel-body">
                    <div class="img-box">
                        <img src="image/upload.png" class="box-img">
                    </div>
                    <div>
                        チームデータorマッチデータのアップロードが可能です。ユーザ登録なしでもご利用いただけます。
                    </div>
                </div>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="panel panel-deafult">
                <div class="panel-header">イベント告知機能</div>
                <div class="panel-body">
                    <div class="img-box">
                        <img src="image/eventnotice.png" class="box-img">
                    </div>
                    <div>
                        イベントの告知が可能です。大会の告知などにご利用ください。ご利用にはユーザ登録が必要です。
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

@endsection