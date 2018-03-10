@extends('layouts.app')

@section('css')
<style rel="stylesheet" href="{{ asset('css/css-loader.css') }}"></style>
@endsection

@section('content')
<main>
    <div id="main-carousel" class="carousel">
        <div class="europa-inner">
            <div class="item active">
                <img class="img-responsive" src="{{ asset('image/Europa.jpg') }}">
                <div class="carousel-caption">
                    <h1>Welcome to Europa</h1>
                    <p>Carnage Heart EXA 非公式アップローダーEuropaにようこそ</p>
                    <p>Headerの各種リンク先からお進みください。</p>
                    <iframe id="twitter-widget-0" scrolling="no" frameborder="0" allowtransparency="true" class="twitter-share-button twitter-share-button-rendered twitter-tweet-button"
                        title="Twitter Tweet Button" src="https://platform.twitter.com/widgets/tweet_button.eaf4b750247dd4d0c4a27df474e7e934.en.html#dnt=false&amp;id=twitter-widget-0&amp;lang=en&amp;original_referer=https%3A%2F%2Fproject-europa.herokuapp.com%2F&amp;size=l&amp;text=Project%20Europa&amp;time=1513843230478&amp;type=share&amp;url=https%3A%2F%2Fproject-europa.herokuapp.com%2F"
                        style="position: static; visibility: visible; width: 76px; height: 28px;"></iframe>
                    <script id="twitter-wjs" src="https://platform.twitter.com/widgets.js"></script>
                    <script>
                        ! function (d, s, id) {
                            var js, fjs = d.getElementsByTagName(s)[0],
                                p = /^http:/.test(d.location) ? 'http' : 'https';
                            if (!d.getElementById(id)) {
                                js = d.createElement(s);
                                js.id = id;
                                js.src = p + '://platform.twitter.com/widgets.js';
                                fjs.parentNode.insertBefore(js, fjs);
                            }
                        }(document, 'script', 'twitter-wjs');
                    </script>

                    <div class="c-c-japan">This image of copyright belong to
                        <a href="https://creativecommons.jp/">creative commons JAPAN.</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="container">
        <div class="row" style="margin-top: 10px; margin-bottom: 10px;">
            <!-- cell -->
            <div class="col-sm-4">
                <div class="card">
                    <div class="card-header lighten-1 white-text thin-blue-color text-center">検索・ダウンロード機能</div>
                    <div class="card-body">
                        <div class="img-box">
                            <img src="{{ asset('image/search_team.png') }}" class="box-img img-fluid">
                        </div>
                        <div>
                            チームデータ・マッチデータを検索してダウンロードが可能です。ユーザ登録なしでもご利用いただけます。
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-4">
                <div class="card">
                    <div class="card-header lighten-1 white-text thin-blue-color text-center">アップロード機能</div>
                    <div class="card-body">
                        <div class="img-box">
                            <img src="{{ asset('image/upload.png') }}" class="box-img img-fluid">
                        </div>
                        <div>
                            チームデータ・マッチデータのアップロードが可能です。ユーザ登録なしでもご利用いただけます。
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-4">
                <div class="card">
                    <div class="card-header lighten-1 white-text thin-blue-color text-center">イベント告知機能</div>
                    <div class="card-body">
                        <div class="img-box">
                            <img src="{{ asset('image/eventnotice.png') }}" class="box-img img-fluid">
                        </div>
                        <div>
                            イベントの告知が可能です。大会の告知などにご利用ください。ご利用にはユーザ登録が必要です。
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>
@endsection

@section('js')
<script src="{{ asset('js/app.js') }}"></script>
@endsection