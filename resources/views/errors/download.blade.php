<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ダウンロードエラー</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
      margin-top: 50px;
    }
    .error-message {
      color: red;
      font-size: 20px;
    }
  </style>
</head>
<body>
<h1>エラーが発生しました</h1>
<p class="error-message">{{ $message }}</p>
<a href="{{ url('/') }}">ホームに戻る</a>
</body>
</html>
