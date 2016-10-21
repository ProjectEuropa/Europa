{{-- フラッシュメッセージの表示 --}}
@if (Session::has('flash_message'))
<div class="alert alert-success">{{ Session::get('flash_message') }}</div>
@endif
{{-- エラーメッセージの表示 --}}
@if (Session::has('error_message'))
<div class="alert alert-danger">{{ Session::get('error_message') }}</div>
@endif
