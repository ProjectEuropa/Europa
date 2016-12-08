{{-- 親ビューの指定 --}}
@extends('layout')

{{-- css読み込みフォーム --}}
@section('css')
<link rel ="stylesheet" href= "{{ asset('css/magicsuggest-min.css') }}">
@endsection

{{-- アップロードフォーム --}}
@section('content')
<div class="container main">
    <h2>Simple Upload</h2>
    <p>ユーザー登録処理をせずにチームデータ・マッチデータのアップロードが可能です。</p>

    <div class="row">
        <div class="col-md-9 col-md-offset-0">
            {{-- フラッシュメッセージの表示 --}}
            @include('common.flash')

            {{-- バリデーションメッセージの表示 --}}
            @include('common.validation')

            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">チームデータアップロード</h3>
                </div>
                <div class="panel-body">
                    <form accept-charset="UTF-8" role="form" method="post" action="{{ url('/simpleupload/teamupload') }}"  enctype="multipart/form-data">
                        <fieldset>
                            <div class="form-group">
                                <label for="teamOwnerName">オーナー名:</label>
                                <input type="text" name="teamOwnerName" class="form-control" id="teamOwnerName" value="{!! old('teamOwnerName') !!}">
                            </div>
                            <div class="form-group">
                                <label for="teamComment">コメント:</label>
                                <textarea name="teamComment" class="form-control" rows="5" id="teamComment">{!! old('teamComment') !!}</textarea>
                            </div>
                            <div class="form-group">
                                <label for="teamDeletePassWord">削除パスワード:</label>
                                <input type="text" name="teamDeletePassWord" class="form-control" rows="5" id="teamDeletePassWord" value="{!! old('teamDeletePassWord') !!}">
                            </div>
                            <div class="form-group">
                                <label for="teamSearchTags">検索タグ</label>
                                {{Form::select('teamSearchTags', [
                                '大会ゲスト許可' => '大会ゲスト許可',
                                'フリーOKE' => 'フリーOKE']
                                , "{!! old('teamSearchTags') !!}", ['id' => 'teamSearchTags', 'class' => 'form-control'])}}
                            </div>
                            <div class="form-group">
                                <label for="exampleInputFile">チームファイル</label>
                                <input type="file" name="teamFile" id="teamFile" >
                                <p class="help-block">CHEチームデータが選択可能です</p>
                            </div>
                            {{ csrf_field() }}
                            <button type="submit" class="btn btn-block btn-primary">チームデータアップロード</button>
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-md-9 col-md-offset-0">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">マッチデータアップロード</h3>
                </div>
                <div class="panel-body">
                    <form accept-charset="UTF-8" role="form" method="post" action="{{ url('/simpleupload/matchupload') }}"  enctype="multipart/form-data">
                        <fieldset>
                            <div class="form-group">
                                <label for="matchOwnerName">オーナー名:</label>
                                <input type="text" name="matchOwnerName" class="form-control" id="matchOwnerName" value="{!! old('matchOwnerName') !!}">
                            </div>
                            <div class="form-group">
                                <label for="matchComment">コメント:</label>
                                <textarea name="matchComment" class="form-control" rows="5" id="matchComment">{!! old('matchComment') !!}</textarea>
                            </div>
                            <div class="form-group">
                                <label for="matchDeletePassWord">削除パスワード:</label>
                                <input type="text" name="matchDeletePassWord" class="form-control" rows="5" id="matchDeletePassWord" value="{!! old('matchDeletePassWord') !!}">
                            </div>
                            <div class="form-group">
                                <label for="matchSearchTags">検索タグ</label>
                                {{Form::select('matchSearchTags', [
                                'ハーフリーグ' => 'ハーフリーグ',
                                'フルリーグ' => 'フルリーグ',
                                'トーナメント' => 'トーナメント',
                                '上級演習所' => '上級演習所']
                                , "{!! old('matchSearchTags') !!}", ['id' => 'matchSearchTags', 'class' => 'form-control'])}}
                            </div>
                            <div class="form-group">
                                <label for="exampleInputFile">マッチファイル</label>
                                <input type="file" name="matchFile" id="matchFile" >
                                <p class="help-block">CHEマッチデータが選択可能です</p>
                            </div>
                            {{ csrf_field() }}
                            <button type="submit" class="btn btn-block btn-info">マッチデータアップロード</button>
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>


@endsection

{{-- magicsuggest.js関連ファイル読み込み --}}
@section('js')
<script type="text/javascript" src="{{ asset('js/magicsuggest-min.js') }}"></script>
<script type="text/javascript" src="{{ asset('js/magicsuggest-conf.js') }}"></script>
@endsection