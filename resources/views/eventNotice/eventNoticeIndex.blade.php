{{-- 親ビューの指定 --}}
@extends('layout')



{{-- css読み込みフォーム・カレンダー・日付関連 --}}
@section('css')
<link rel="stylesheet" href= "{{ asset('css/bootstrap/bootstrap-datepicker.min.css') }}">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.css">
@endsection

{{-- アップロードフォーム --}}
@section('content')
<h2>Event Notice</h2>
<p>イベントの告知が可能です。ここで登録した内容はInfomationに表示されます。</p>

@if (Auth::guest())
<div class="alert alert-danger">Sign in時のみイベント告知が可能です。Sign inをお願い致します。</div>
@else
<div class="row">
    <div class="col-md-9 col-md-offset-0">
        {{-- フラッシュメッセージの表示 --}}
        @if (Session::has('flash_message'))
        <div class="alert alert-success">{{ Session::get('flash_message') }}</div>
        @endif
        {{-- エラーメッセージの表示 --}}
        @if (Session::has('error_message'))
        <div class="alert alert-danger">{{ Session::get('flash_message') }}</div>
        @endif
        {{-- バリデーションメッセージの表示 --}}
        @if (count($errors) > 0)
        <div class="alert alert-danger">
            <ul>
                @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
        @endif

        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">イベント情報告知</h3>
            </div>
            <div class="panel-body">
                <form accept-charset="UTF-8" role="form" method="post" action="{{ url('/eventNotice/register') }}">
                    <fieldset>
                        <div class="form-group">
                            <label for="eventName">イベント名:</label>
                            <input type="text" name="eventName" class="form-control" id="eventName" value="{!! old('eventName') !!}" placeholder="イベント名をご入力ください">
                        </div>
                        <div class="form-group">
                            <label for="eventDetails">イベント詳細情報:</label>
                            <textarea name="eventDetails" class="form-control" rows="5" id="eventDetails" placeholder="イベントの詳細情報をご入力ください">{!! old('eventDetails') !!}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="eventReferenceUrl">イベント参照URL:</label>
                            <input type="url" name="eventReferenceUrl" class="form-control" rows="5" id="eventReferenceUrl" value="{!! old('eventReferenceUrl') !!}" placeholder="イベントの参照となる掲示板やブログのURLをご入力ください">
                        </div>
                        <div class="form-group">
                            <label for="eventClosingDay">イベント受付期間締切日:</label>
                            <div class="form-inline">
                                <input type="text" name="eventClosingDate" class="form-control datepicker" id="eventClosingDate" value="{!! old('eventClosingDate') !!}" placeholder="締切日付をご入力ください">
                                <input type="text" name="eventClosingTime" class="form-control timepicker" id="eventClosingTime" value="23:59" placeholder="締切時刻をご入力ください"> までイベント受付
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="eventDisplayingDay">イベント表示最終日:</label>
                            <div class="form-inline">
                                <input type="text" name="eventDisplayingDate" class="form-control datepicker" id="eventDisplayingDate" value="{!! old('eventDisplayingDate') !!}" placeholder="表示最終日をご入力ください">
                                <input type="text" name="eventDisplayingTime" class="form-control timepicker" id="eventDisplayingTime" value="23:59" placeholder="表示最終日時刻をご入力ください"> までInfomationに表示
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="eventType">イベント種別</label>
                            {{Form::select('eventType', [
                                '1' => '大会',
                                '2' => 'その他']
                                , '', ['class' => 'form-control'])}}
                        </div>
                        <input type="hidden" name="_token" value="<?php echo csrf_token(); ?>">
                        <button type="submit" class="btn btn-block btn-primary">イベント情報登録</button>
                    </fieldset>
                </form>
            </div>
        </div>
    </div>
</div>
@endif

@endsection

{{-- カレンダー・日付関連js読み込み --}}
@section('js')
<script src="https://cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.js"></script>
<script type="text/javascript" src="{{ asset('js/bootstrap/bootstrap-datepicker.min.js') }}"></script>
<script type="text/javascript" src="{{ asset('js/bootstrap/bootstrap-datepicker.ja.min.js') }}"></script>
<script type="text/javascript" src="{{ asset('js/datepicker-config.js') }}"></script>
@endsection