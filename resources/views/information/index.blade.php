@extends('layouts.app')

@section('content')
<main class="container">
    <div class="under-header">
        <h2>Information</h2>
        <p>お知らせ情報の閲覧が可能です。<a href="{{ url('/eventcalendar') }}">イベントカレンダー</a>で閲覧することも可能です。</p>
    </div>
    @forelse($events as $event)
    <div class="row" style="margin-bottom: 10px;">
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
            <div class="card">
                <div class="card-header puerto-color white-text text-center">
                    <a href="{{ $event->event_reference_url }}" class="card-link">{{ $event->event_name }}</a>
                </div>
                <div class="card-body">
                    @if ($event->event_type != '2')
                    <h4 class="card-title">受付期間:{{ $event->event_closing_day }} まで</h4>
                    @endif
                    <p class="card-text">{!! nl2br(e($event->event_details)) !!}</p>
                </div>
                <div class="card-footer text-muted puerto-color white-text text-center">
                    <p class="mb-0">表示期間： {{ $event->event_displaying_day }} まで</p>
                </div>
            </div>
        </div>
    </div>
    @empty
    <div class="alert alert-success">現在登録されているお知らせ情報はありません。</div>
    @endforelse
</main>
@endsection

@section('js')
@endsection