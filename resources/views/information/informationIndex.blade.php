{{-- 親ビューの指定 --}}
@extends('layout')


{{-- アップロードフォーム --}}
@section('content')
<div class="container main">

    <h2>Information</h2>
    <p>お知らせ情報の閲覧が可能です。</p>

    @forelse($events as $index => $event)
    @if (($index % 2) == 0)
    <div class="row">
        <div class="col-md-6">
            @if ($event->event_type == '1')
            <img src="{{ asset('image/tournament.jpeg') }}"
                 class="img-responsive">
            @else
            <img src="{{ asset('image/others.jpeg') }}"
                 class="img-responsive">
            @endif
        </div>
        <div class="col-md-6">
            <h3><a href="{{ $event->event_reference_url }}">{{ $event->event_name }}</a></h3>
            <h4>受付期間:{{ $event->event_closing_day }} まで</h4>
            <p>詳細：{!! nl2br(e($event->event_details)) !!}</p>
            <p>表示期間： {{ $event->event_displaying_day }} まで</p>
        </div>
    </div>
    @else
    <div class="row">
        <div class="col-md-6">
            <h3><a href="{{ $event->event_reference_url }}">{{ $event->event_name }}</a></h3>
            <h4>受付期間:{{ $event->event_closing_day }} まで</h4>
            <p>詳細：{!! nl2br(e($event->event_details)) !!}</p>
            <p>表示期間：{{ $event->event_displaying_day }} まで</p>
        </div>
        <div class="col-md-6">
            @if ($event->event_type == 1)
            <img src="{{ asset('image/tournament.jpeg') }}"
                 class="img-responsive">
            @else
            <img src="{{ asset('image/others.jpeg') }}"
                 class="img-responsive">
            @endif
        </div>
    </div>
    @endif
    @empty
    <div class="alert alert-success">現在登録されているお知らせ情報はありません。</div>
    @endforelse

</div>
@endsection