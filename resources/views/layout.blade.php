<!DOCTYPE html>
<html>
    <head>
        <title>Project Europa</title>

        <link href="https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/cerulean/bootstrap.min.css" rel="stylesheet" id="themesid">
        <link rel ="stylesheet" href= "{{ asset('css/common.css') }}">
        <!-- 固有のcss読み込み-->
        @yield('css')
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
    </head>
    <body>
        <header>
            <nav class="navbar navbar-inverse navbar-fixed-top">
                <div class="container">
                    <div class="navbar-header">
                        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                        <ul class="nav navbar-nav navbar-left">
                            <a class="navbar-brand" href="{!! url('/') !!}">Top/</a>
                            <a class="navbar-brand" href="{!! url('/infomation') !!}">Infomation/</a>
                            <li class="dropdown">
                                <a href="#" class="dropdown-toggle navbar-brand" data-toggle="dropdown" role="button" aria-expanded="false">
                                    Search/
                                </a>
                                <ul class="dropdown-menu" role="menu">
                                    <li><a href="/search/team">Team data</a></li>
                                    <li><a href="/search/match">Match Data</a></li>
                                </ul>
                            </li>
                            <li class="dropdown">
                                <a href="#" class="dropdown-toggle navbar-brand" data-toggle="dropdown" role="button" aria-expanded="false">
                                    Sum DL/
                                </a>
                                <ul class="dropdown-menu" role="menu">
                                    <li><a href="/sumdownload/team">Team DL</a></li>
                                    <li><a href="/sumdownload/match">Match DL</a></li>
                                </ul>
                            </li>

                            @if (Auth::guest())
                            {{-- 未ログイン時は簡易アップロード表示 --}}
                            <a class="navbar-brand" href="{!! url('/simpleupload') !!}">Simple Upload/</a>
                            @else
                            {{-- ログイン中は通常アップロード・イベント告知表示 --}}
                            <a class="navbar-brand" href="{!! url('/upload') !!}">Upload/</a>
                            <a class="navbar-brand" href="{!! url('/eventnotice') !!}">Event Notice/</a>
                            @endif
                            <a class="navbar-brand" href="{!! url('/help') !!}">Help/</a>
                            <a class="navbar-brand" href="{!! url('/links') !!}">Links</a>
                        </ul>
                    </div>

                    <ul class="nav navbar-nav navbar-right">
                        @if (Auth::guest())
                        {{-- 未ログイン時はSign in表示 --}}
                        <a class="navbar-brand" href="{!! url('/twitter') !!}">Sign in</a>
                        @else
                        {{-- ログイン中はSign Out マイページ表示--}}
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                                Sign in: {{ Auth::user()->name }} 
                                <img src="{{ Auth::user()->avatar }}" height="20" width="20"/>
                                <span class="caret"></span>
                            </a>
                            <ul class="dropdown-menu" role="menu">
                                <li><a href="/mypage">My Page</a></li>
                                <li><a href="/auth/logout">Sign out</a></li>
                            </ul>
                        </li>
                        @endif
                    </ul>
                </div>
            </nav>
        </header>


        <div class="container main">
            {{-- 子のビューで指定される、contentセクションを読み込む --}}
            @yield('content')
        </div>

        <div class="container">
            <footer>
                <p>&copy; 2016 Team Project Europa <br>
            </footer>
        </div>

        <!-- 固有のJavaScript読み込み-->
        @yield('js')
    </body>
</html>
