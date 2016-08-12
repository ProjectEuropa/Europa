/* 
 カレンダー・日付関連設定Javascript
 */
$(function () {
    // 時刻設定
    $('.timepicker').timepicker({
        timeFormat: 'HH:mm',
        interval: 60,
        minTime: '0',
        maxTime: '23:00',
        defaultTime: '23:59',
        startTime: '0:00',
        dynamic: false,
        dropdown: true,
        scrollbar: true
    });
    // 日付設定
    $('.datepicker').datepicker({
        language: 'ja',
        autoclose: true
    });

});


