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
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="api-token" content="{{ session()->get('api_token') ?? '' }}">
    <title>Europa - Carnage Heart EXA Uploader -</title>
  </head>
    <body>
      <div id="app" >
        <app :auth="{{ Auth::user() ?? 'null' }}" flash="{{ session('message') ?? null }}" :errors="{{ $errors }}" />
      </div>
      <script src="{{ mix('/js/app.js') }}"></script>
    </body>
</html>
