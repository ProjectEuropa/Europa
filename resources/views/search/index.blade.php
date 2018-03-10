@extends('layouts.app')

@section('content')
<main class="container">
    <div class="under-header">
    <input type="hidden" id="search-type" value="{{ $searchType == 'team' ?  'team' : 'match' }}">
        <h2>{{ $searchType == 'team' ?  'Team' : 'Match' }} Data</h2>
        <p>{{ $searchType == 'team' ?  'チーム' : 'マッチ' }}データの検索が可能です。ダウンロードアイコンをクリックするとダウンロードが始まります。</p>
    </div>
    <div id="app">
        <search-component></search-component>
    </div>
</main>
@endsection

@section('js')
<script src="{{ asset('js/app.js') }}"></script>
@include('common.message')
@endsection