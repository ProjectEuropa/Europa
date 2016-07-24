@extends('layout')

{{-- css読み込みフォーム --}}
@section('css')
    <link rel="stylesheet" href="css/bootstrap.social.css" type="text/css">
    <link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css" rel="stylesheet">
@endsection

@section('content')
<h2>Sign in</h2>
<p>現在TwitterでのSign inのみが有効です。</p>

<div class="col-md-3">
    <a class="btn btn-block btn-social btn-twitter"  href="auth/twitter">
        <span class="fa fa-twitter"></span> Sign in with Twitter
    </a>
</dv>
@endsection