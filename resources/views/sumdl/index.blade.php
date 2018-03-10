@extends('layouts.app')

@section('content')
<main class="container">
    <div class="under-header">
    <input type="hidden" id="search-type" value="{{ $searchType == 'team' ?  'team' : 'match' }}">
        <h2>Sum DL {{ $searchType == 'team' ?  'Team' : 'Match' }} Data</h2>
        <p>{{ $searchType == 'team' ?  'チーム' : 'マッチ' }}データの一括ダウンロードが可能です。ダウンロードしたいデータにチェックを入れて一括ダウンロードボタンをクリックしてください。</p>
    </div>
    <div id="sumdl">
        <sumdownload-component></sumdownload-component>
    </div>
</main>
@endsection

@section('js')
<script src="{{ asset('js/sumdl.js') }}"></script>
@include('common.message')
@endsection