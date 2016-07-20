<!DOCTYPE html>
<html>
    <head>
        <title>Project Europa</title>

        <link href="https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/cerulean/bootstrap.min.css" rel="stylesheet" id="themesid">
        <link href="css/common.css" rel="stylesheet">
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
                        <a class="navbar-brand" href="{!! url('/search/team') !!}">Team data/</a>
                        <a class="navbar-brand" href="{!! url('/search/match') !!}">Match Data/</a>
                        <a class="navbar-brand" href="{!! url('/replayData') !!}">Replay Data/</a>
                        <a class="navbar-brand" href="{!! url('/upload') !!}">Upload/</a>
                        <a class="navbar-brand" href="{!! url('/simpleUpload') !!}">Simple Upload/</a>
                        <a class="navbar-brand" href="{!! url('/help') !!}">Help/</a>
                        <a class="navbar-brand" href="{!! url('/links') !!}">Links</a>
                    </div>

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
        

        <div class="container" style="margin-top: 50px;">
            {{-- 子のビューで指定される、contentセクションを読み込む --}}
            @yield('content')

            <footer>
                <p>&copy; 2016 Team Project Europa <br>
            </footer>
        </div>
    </body>
</html>
