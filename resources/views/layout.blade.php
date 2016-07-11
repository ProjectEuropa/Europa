<!DOCTYPE html>
<html>
    <head>
        <title>Project Europa</title>

        <link href="https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/cerulean/bootstrap.min.css" rel="stylesheet" id="themesid">
        <link href="css/common.css" rel="stylesheet">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
        <!--<style>
            html, body {
                height: 100%;
            }

            body {
                margin: 0;
                padding: 0;
                width: 100%;
                display: table;
                font-weight: 100;
                font-family: 'Lato';
            }

            .container {
                text-align: center;
                display: table-cell;
                vertical-align: middle;
            }

            .content {
                text-align: center;
                display: inline-block;
            }

            .title {
                font-size: 96px;
            }
        </style>-->
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
                        <a class="navbar-brand" href="#">Top/</a>
                        <a class="navbar-brand" href="#">Team data/</a>
                        <a class="navbar-brand" href="#">Match Data/</a>
                        <a class="navbar-brand" href="#">Replay Data/</a>
                        <a class="navbar-brand" href="#">Upload/</a>
                        <a class="navbar-brand" href="#">Simple Upload/</a>
                        <a class="navbar-brand" href="#">Help</a>
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
        

        <div class="container main">
            <h2>Welcome to Project Europa</h2>
            <p>This is informal uploader of Carnage Heart EXA.</p>  
            {{-- 子のビューで指定される、contentセクションを読み込む --}}
            @yield('content')

            <footer>
                <p>&copy; 2016 Team Project Europa</p>
            </footer>
        </div> 
    </body>
</html>
