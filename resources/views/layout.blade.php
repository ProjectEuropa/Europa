<!DOCTYPE html>
<html>
    <head>
        <title>Project Europa</title>

        <link href="https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/cerulean/bootstrap.min.css" rel="stylesheet" id="themesid">
        <link rel ="stylesheet" href= "{{ asset('css/common.css') }}">
        <!-- 固有のcss読み込み-->
        @yield('css')
    </head>
    <body>

        <header>
            <!-- top nav -->
            <nav class="navbar navbar-inverse">
                <div class="container">
                    <div class="navbar-header">
                        <!-- toggle -->
                        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#top-nav">
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                    </div>
                    <!-- top menu -->
                    <div class="collapse navbar-collapse" id="top-nav">
                        <!-- main navbar -->
                        <ul class="nav navbar-nav navbar-left">
                            <li><a class="navbar-brand" href="{!! url('/') !!}">Top</a></li>
                            <li><a class="navbar-brand" href="{!! url('/infomation') !!}">Infomation</a></li>
                            <li class="dropdown">
                                <a href="#" class="dropdown-toggle navbar-brand" data-toggle="dropdown" role="button" aria-expanded="false">
                                    Search
                                </a>
                                <ul class="dropdown-menu" role="menu">
                                    <li><a href="/search/team">Team Data</a></li>
                                    <li><a href="/search/match">Match Data</a></li>
                                </ul>
                            </li>
                            <li class="dropdown">
                                <a href="#" class="dropdown-toggle navbar-brand" data-toggle="dropdown" role="button" aria-expanded="false">
                                    Sum DL
                                </a>
                                <ul class="dropdown-menu" role="menu">
                                    <li><a href="/sumdownload/team">DL Team</a></li>
                                    <li><a href="/sumdownload/match">DL Match</a></li>
                                </ul>
                            </li>
                            @if (Auth::guest())
                            {{-- 未ログイン時は簡易アップロード表示 --}}
                            <li><a class="navbar-brand" href="{!! url('/simpleupload') !!}">Simple Upload</a></li>
                            @else
                            {{-- ログイン中は通常アップロード・イベント告知表示 --}}
                            <li><a class="navbar-brand" href="{!! url('/upload') !!}">Upload</a></li>
                            <li><a class="navbar-brand" href="{!! url('/eventnotice') !!}">Event Notice</a></li>
                            @endif
                            <li><a class="navbar-brand" href="{!! url('/help') !!}">Help</a></li>
                            <li><a class="navbar-brand" href="{!! url('/links') !!}">Links</a></li>
                        </ul>

                        <!-- right navbar -->
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
                </div>
                <!-- end container -->
            </nav>
        </header>

        {{-- 子のビューで指定される、contentセクションを読み込む --}}
        @yield('content')

        <div class="container">
            <footer>
                <p>&copy; 2016 Team Project Europa <br>
            </footer>
        </div>

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
        <!-- 固有のJavaScript読み込み-->
        @yield('js')
    </body>
</html>
