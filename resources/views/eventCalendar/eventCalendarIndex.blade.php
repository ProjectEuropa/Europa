{{-- 親ビューの指定 --}}
@extends('layout')


{{-- css読み込みフォーム・カレンダー・日付関連 --}}
@section('css')
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.1.0/fullcalendar.min.css" />
@endsection

{{-- イベントの告知フォーム --}}
@section('content')
<div class="container main">

    <h2>Event Calendar</h2>
    <p>イベントカレンダーの閲覧が可能です。</p>

    <div id="calendar"></div>

</div>
@endsection

{{-- カレンダー・関連js読み込み --}}
@section('js')
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.1.0/fullcalendar.min.js"></script>
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