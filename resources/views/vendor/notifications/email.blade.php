@component('mail::message')
<p>From Europa</p>


{{-- Action Button --}}
@component('mail::button', ['url' => $actionUrl, 'color' => 'blue'])
{{ $actionText }}
@endcomponent


{{-- Subcopy --}}
@component('mail::subcopy')
<p>パスワードリセットボタンをクリックするか、下記のURLにアクセスしてパスワードをリセットしてください。</p>
<p>このメールに心当たりがなければ無視してください。</p>
URL: [{{ $actionUrl }}]({{ $actionUrl }})
@endcomponent
@endcomponent