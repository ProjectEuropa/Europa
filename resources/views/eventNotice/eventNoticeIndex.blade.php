{{-- 親ビューの指定 --}}
@extends('layout')

{{-- アップロードフォーム --}}
@section('content')
<h2>Event Notice</h2>
<p>イベントの告知が可能です。ここで登録した内容はInfomationに表示されます。</p>

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
                            <label for="owner">イベント名:</label>
                            <input type="text" name="eventName" class="form-control" id="eventName" placeholder="告知したいイベント名をご入力ください">
                        </div>
                        <div class="form-group">
                            <label for="comment">イベント詳細情報:</label>
                            <textarea name="eventDetails" class="form-control" rows="5" id="eventDetails" placeholder="イベントの詳細情報をご入力ください"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="comment">イベント参照URL:</label>
                            <input type="url" name="eventReferenceUrl" class="form-control" rows="5" id="eventReferenceUrl" placeholder="イベントの参照となる掲示板やブログのURLをご入力ください">
                        </div>
                        <div class="form-group">
                            <label for="owner">イベント受付期間締切日:</label>
                            <input type="datetime-local" name="eventClosingDay" class="form-control" id="eventClosingDay" placeholder="イベントの詳細情報をご入力ください"">
                        </div>
                        <div class="form-group">
                            <label for="owner">イベント表示最終日:</label>
                            <input type="datetime-local" name="eventDisplayingDay" class="form-control" id="teamOwnerName">
                        </div>
                        <div class="form-group">
                            <label for="word">イベント種別</label>
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
@endsection