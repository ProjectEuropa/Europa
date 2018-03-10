<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Europa</title>
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <link href="{{ asset('css/material.css') }}" rel="stylesheet">
    <link href="{{ asset('css/top.css') }}" rel="stylesheet">
    <script>
        window.myToken =  <?php echo json_encode([
            'csrfToken' => csrf_token(),
        ]); ?>
    </script>
    @yield('css')
</head>
<body>
        <header>
            <nav class="navbar navbar-expand-lg">
                <div class="container">
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"><i class="fa fa-bars" aria-hidden="true"></i></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav mr-auto">
                            <li class="nav-item">
                                <a class="nav-link" href="{{ url('/')}} ">Top</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="{{ url('/information')}} ">Information</a>
                            </li>
                            <li class="dropdown nav-item">
                                <a href="#" class="nav-link" data-toggle="dropdown" role="button" aria-expanded="false">
                                    Search
                                </a>
                                <ul class="dropdown-menu" role="menu">
                                    <li>
                                        <a href="{{ url('/search/team') }}">Team Data</a>
                                    </li>
                                    <li>
                                        <a href="{{ url('/search/match') }}">Match Data</a>
                                    </li>
                                </ul>
                            </li>
                            <li class="dropdown nav-item">
                                <a href="#" class="nav-link" data-toggle="dropdown" role="button" aria-expanded="false">
                                    SUM DL
                                </a>
                                <ul class="dropdown-menu" role="menu">
                                    <li>
                                        <a href="{{ url('/sumdownload/team') }}">DL Team</a>
                                    </li>
                                    <li>
                                        <a href="{{ url('/sumdownload/match') }}">DL Match</a>
                                    </li>
                                </ul>
                            </li>
                            @if (Auth::guest())
                            <li class="nav-item">
                                <a class="nav-link" href="{{ url('/simpleupload') }}">Simple Upload</a>
                            </li>
                            @else
                                <li class="nav-item"><a class="nav-link" href="{{ url('/upload') }}">Upload</a></li>
                                <li class="nav-item"><a class="nav-link" href="{{ url('/eventnotice') }}">Event Notice</a></li>
                                @endif
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="{{ url('/links') }}">Links</a>
                            </li>
                        </ul>
                        <ul class="navbar-nav nav-right">
                            @if (Auth::guest())
                            <li class="nav-item">
                                <a class="nav-link" href="{{ url('/login') }}">
                                    Login
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="{{ url('/register') }}">
                                    Register
                                </a>
                            </li>
                            @else
                            <li class="dropdown nav-item">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                                    Login: {{ Auth::user()->name }}
                                    <img src="{{ Auth::user()->avatar }}" height="20" width="20"/>
                                    <span class="caret"></span>
                                </a>
                                <ul class="dropdown-menu" role="menu">
                                    <li><a href="{{ url('/mypage') }}">My Page</a></li>
                                    <form method="POST" name="logout" action="{{ url('/logout') }}">
                                        {{ csrf_field() }}
                                        <li><a href="javascript:logout.submit()">Logout</a></li>
                                    </form>
                                </ul>
                            </li>
                            @endif
                        </ul>
                    </div>
                </div>
            </nav>
        </header>

        @yield('content')
        <footer>
            <div class="container text-center">
                <small>© 2016-<span id="nowYear"></span> Team Project Europa</small>
            </div>
        </footer>
        
        <script>
            document.getElementById("nowYear").innerText = new Date().getFullYear();
        </script>
        <script src="{{ asset('js/material.js') }}"></script>
        @yield('js')
</body>
</html>
