@extends('layouts.app')


@section('css')

@endsection

{{-- イベントの告知フォーム --}}
@section('content')
<main>
    <div class="container">
        <div class="under-header">
            <h2>Event Notice</h2>
            <p>イベントの告知が可能です。ここで登録した内容はInformationに表示されます。</p>
        </div>
        @include('common.validation')

        <div class="row" style="margin-bottom: 20px;">
            <div class="col-md-12 col-md-offset-0">
                <div class="card">
                    <div class="card-header lighten-1 white-text puerto-color text-center">
                        イベント情報告知
                    </div>
                    <div class="card-body">
                        <form accept-charset="UTF-8" role="form" method="post" action="{{ url('/eventnotice') }}">
                            <fieldset>
                                <div class="form-group">
                                    <label for="eventName">イベント名:</label>
                                    <input type="text" name="eventName" class="form-control input-alternate" id="eventName" value="{{ old('eventName') }}" placeholder="イベント名をご入力ください" style="padding: 0;" required>
                                </div>
                                <div class="form-group">
                                    <label for="eventDetails">イベント詳細情報:</label>
                                    <textarea name="eventDetails" class="form-control input-alternate" rows="5" id="eventDetails" placeholder="イベントの詳細情報をご入力ください" style="padding-bottom: 10em;" required>{{ old('eventDetails') }}</textarea>
                                </div>
                                <div class="form-group">
                                    <label for="eventReferenceUrl">イベント参照URL:</label>
                                    <input type="url" name="eventReferenceUrl" class="form-control input-alternate" rows="5" id="eventReferenceUrl" value="{{ old('eventReferenceUrl') }}" placeholder="イベントの参照となる掲示板やブログのURLをご入力ください" style="padding: 0;">
                                </div>
                                <div class="form-group">
                                    <label for="eventClosingDay">イベント受付期間締切日:</label>
                                    <div class="form-inline">
                                        <input type="date" name="eventClosingDate" class="form-control input-alternate" id="eventClosingDate" value="{{ old('eventClosingDate') }}" placeholder="締切日付をご入力ください" style="margin-right: 20px;" required>
                                        <input type="time" name="eventClosingTime" class="form-control input-alternate" id="eventClosingTime" value="23:59" placeholder="締切時刻をご入力ください" required> までイベント受付
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="eventDisplayingDay">イベント表示最終日:</label>
                                    <div class="form-inline">
                                        <input type="date" name="eventDisplayingDate" class="form-control input-alternate" id="eventDisplayingDate" value="{{ old('eventDisplayingDate') }}" placeholder="表示最終日をご入力ください" style="margin-right: 20px;" required>
                                        <input type="time" name="eventDisplayingTime" class="form-control input-alternate" id="eventDisplayingTime" value="23:59" placeholder="表示最終日時刻をご入力ください" required> までInformationに表示
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="eventType">イベント種別:</label>
                                    <select name="eventType" class="form-inline" style="width: 100%;">
                                        <option value="1">大会</option>
                                        <option value="2">告知</option>
                                        <option value="3">その他</option>
                                    </select>
                                </div>
                                {{ csrf_field() }}
                                <button type="submit" class="btn btn-block puerto-color">イベント情報登録</button>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>
@endsection

@section('js')
@include('common.message')
@endsection