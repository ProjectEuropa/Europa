<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# website: http://ogp.me/ns/website#">
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="robots" content="index,follow">
  <meta name="description" content="Carnage Heart EXA 非公式アップローダーEuropaです">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:image" content="{{ url('') }}/images/Europa.jpg">
  <meta name="twitter:url" content="{{ url()->full() }}">
  <meta name="twitter:description" content="Carnage Heart EXA 非公式アップローダーEuropaです">
  <meta name="twitter:title" content="Europa - Carnage Heart EXA Uploader -">
  <meta property="og:description" content="Carnage Heart EXA 非公式アップローダーEuropaです">
  <meta property="og:site_name" content="Europa - Carnage Heart EXA Uploader -">
  <meta property="og:locale" content="ja_JP">
  <meta property="og:type" content="{{ \Request::is('/') ? 'website' : 'article'}}">
  <meta property="og:image" content="{{ url('') }}/images/header-logo.png">
  <meta property="og:url" content="{{ url()->full() }}">
  <meta property="og:title" content="Europa - Carnage Heart EXA Uploader -">
  <style>
    body,
    html {
      margin: 0;
      padding: 0;
    }

    .img {
      position: relative;
      background-image: url(/images/Europa.jpg);
      background-position: center;
      background-size: cover;
      height: 1500px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: whitesmoke;
      font-family: 'MokotoGlitch';
      font-size: 60px;
    }

    @font-face {
      font-family: 'MokotoGlitch';
      src: url(/fonts/MokotoGlitch.ttf);
    }

    article {
      font-family: 'Courier New', Courier, monospace;
      text-align: center;
      font-weight: bold;
    }

    .btn-flat-border {
      display: inline-block;
      padding: 0.3em 1em;
      text-decoration: none;
      color: darkgray;
      border: solid 5px darkgray;
      border-radius: 3px;
      transition: .4s;
    }

    .btn-flat-border:hover {
      background: black;
      color: white;
    }

    @media screen and (max-width:768px) {
      .img {
        height: 1000px;
        width: 100%;
        font-size: 30px
      }
    }
  </style>
  <title>Europa - Carnage Heart EXA Uploader -</title>
</head>

<body>
  <div class="img">
    <main>
      <h1>Europa</h1>
    </main>
    <article>
      <div>Welcome to <br>Carnage Heart EXA <br>unofficial uploader</div>
    </article>
    <article class="search">
      <a href="/search/team" class="btn-flat-border">SEARCH</a>
    </article>
  </div>
</body>
</html>
