@extends('layouts.app')

@section('css')
<style>
    .fc .fc-row .fc-content-skeleton table, .fc .fc-row .fc-content-skeleton td, .fc .fc-row .fc-helper-skeleton td {
    background: 0 0;
    border-color: #ddd !important;
}
</style>
@endsection

{{-- イベントカレンダー --}}
@section('content')
<main>
    <div class="container">
        <div class="under-header">
            <h2>Event Calendar</h2>
            <p>イベントカレンダーの閲覧が可能です。</p>
        </div>

        <div id="calendar"></div>

    </div>
</main>
@endsection

@section('js')
<script src="{{ asset('js/calendar.js') }}"></script>
<script>
    $(function () {
        $("#calendar").fullCalendar({
            views: {
                month: {
                    titleFormat: 'YYYY年MM月DD日'
                }
            },
            monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            dayNames: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
            dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
            displayEventTime : false,
            events : [
                @foreach($events as $event)
                {
                    title : "{{ $event->event_name }}",
                    start : "{{ $event->event_closing_day }}",
                    url : "{{ $event->event_reference_url }}"
                },
                @endforeach
            ]
        })
    });
</script>
@endsection