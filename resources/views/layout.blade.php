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
                        <a class="navbar-brand" href="{!! url('/') !!}">Top/</a>
                        <a class="navbar-brand" href="{!! url('/infomation') !!}">Infomation/</a>
                        <a class="navbar-brand" href="{!! url('/search/team') !!}">Team data/</a>
                        <a class="navbar-brand" href="{!! url('/search/match') !!}">Match Data/</a>
                        @if (Auth::guest())
                        {{-- 未ログイン時は簡易アップロード表示 --}}
                            <a class="navbar-brand" href="{!! url('/simpleUpload') !!}">Simple Upload/</a>
                        @else
                        {{-- ログイン中は通常アップロード・イベント告知表示 --}}
                            <a class="navbar-brand" href="{!! url('/upload') !!}">Upload/</a>
                            <a class="navbar-brand" href="{!! url('/eventNotice') !!}">Event Notice/</a>
                        @endif
                        <a class="navbar-brand" href="{!! url('/help') !!}">Help/</a>
                        <a class="navbar-brand" href="{!! url('/links') !!}">Links</a>
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

                    <!--<div id="navbar" class="navbar-collapse collapse">
                      <form class="navbar-form navbar-right">
                        <div class="form-group">
                          <input type="text" placeholder="Email" class="form-control">
                        </div>
                        <div class="form-group">
                          <input type="password" placeholder="Password" class="form-control">
                        </div>
                        <button type="submit" class="btn btn-primary">Sign in</button>
                      </form>
                    </div>--><!--/.navbar-collapse -->
                </div>
            </nav>
        </header>
        

        <div class="container main">
            {{-- 子のビューで指定される、contentセクションを読み込む --}}
            @yield('content')

            <footer>
                <p>&copy; 2016 Team Project Europa <br>
            </footer>
        </div>
        
        <!-- 固有のJavaScript読み込み-->
        @yield('js')
    </body>
</html>
