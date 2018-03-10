@extends('layouts.app')

@section('content')
<main>
    <div class="container">
        <div class="under-header">
            <h2>{{ strpos(Request::url(), 'simpleupload') !== false ? 'Simple ' : ''}}Upload</h2>
            <p>{{ strpos(Request::url(), 'simpleupload') !== false ? 'ユーザー登録処理をせずに' : ''}}チームデータ・マッチデータのアップロードが可能です。</p>
        </div>

        @include('common.validation')

        <div class="row">
            <div class="col-md-12 col-md-offset-0">
                <div class="card">
                    <div class="card-header lighten-1 white-text puerto-color text-center">
                        チームデータアップロード
                    </div>
                    <div class="card-body">
                        <form accept-charset="UTF-8" role="form" method="post" action="{{ strpos(Request::url(), 'simpleupload') !== false ? url('team/simpleupload') : url('team/upload') }}" enctype="multipart/form-data">
                            <fieldset>
                                <div class="form-group">
                                    <label for="teamOwnerName">オーナー名:</label>
                                    <input type="text" name="teamOwnerName" class="form-control input-alternate" id="teamOwnerName" value="{{ strpos(Request::url(), 'simpleupload') !== false ? old('teamOwnerName') : Auth::user()->name }}" style="padding: 0;" required>
                                </div>
                                <div class="form-group">
                                    <label for="teamComment">コメント:</label>
                                    <textarea name="teamComment" class="form-control input-alternate" rows="10" id="teamComment" style="padding-bottom: 10em;" required>{{ old('teamComment') }}</textarea>
                                </div>
                                @if(strpos(Request::url(), 'simpleupload') !== false)
                                <div class="form-group">
                                    <label for="teamDeletePassWord">削除パスワード:</label>
                                    <input type="text" name="teamDeletePassWord" class="form-control input-alternate" rows="5" id="teamDeletePassWord" value=""
                                        style="padding: 0;" required>
                                </div>
                                @endif
                                <div class="form-group">
                                    <label for="teamSearchTags">検索タグ:</label>
                                    <select id="teamSearchTags" class="form-control" name="teamSearchTags">
                                        <option value="大会ゲスト許可" {{ (old('teamSearchTags') !== null && in_array('大会ゲスト許可', old('teamSearchTags'))) === true ? 'selected' : ''}}>大会ゲスト許可</option>
                                        <option value="フリーOKE" {{ (old('teamSearchTags') !== null && in_array('フリーOKE', old('teamSearchTags'))) === true ? 'selected' : ''}}>フリーOKE</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <input id="teamfile" type="file" style="display:none" name="teamFile" required>
                                    <div class="input-group">
                                        <span class="input-group-btn">
                                            <button type="button" class="btn btn-info" onclick="$('input[id=teamfile]').click();">チームファイル</button>
                                        </span>
                                        <input type="text" id="teamCover" class="form-control" placeholder="select file...">
                                    </div>
                                    <p class="help-block">CHEチームデータが選択可能です</p>
                                </div>
                                {{ csrf_field() }}
                                <button type="submit" class="btn btn-block puerto-color">チームデータアップロード</button>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <div class="row" style="margin-top: 30px;">
            <div class="col-md-12 col-md-offset-0" style="margin-bottom: 20px;">
                <div class="card">
                    <div class="card-header downy-color lighten-1 white-text text-center">
                        マッチデータアップロード
                    </div>
                    <div class="card-body">
                        <form accept-charset="UTF-8" role="form" method="post" action="{{ strpos(Request::url(), 'simpleupload') !== false ? url('match/simpleupload') : url('match/upload') }}"
                            enctype="multipart/form-data">
                            <fieldset>
                                <div class="form-group">
                                    <label for="matchOwnerName">オーナー名:</label>
                                    <input type="text" name="matchOwnerName" class="form-control input-alternate" id="matchOwnerName" value="{{ strpos(Request::url(), 'simpleupload') !== false ? old('matchOwnerName') : Auth::user()->name }}" style="padding: 0;" required>
                                </div>
                                <div class="form-group">
                                    <label for="matchComment">コメント:</label>
                                    <textarea name="matchComment" class="form-control input-alternate" rows="5" id="matchComment" style="padding-bottom: 10em;" required>{{ old('matchComment') }}</textarea>
                                </div>
                                @if(strpos(Request::url(), 'simpleupload') !== false)
                                <div class="form-group">
                                    <label for="matchDeletePassWord">削除パスワード:</label>
                                    <input type="text" name="matchDeletePassWord" class="form-control input-alternate" rows="5" id="matchDeletePassWord" value="" style="padding: 0;" required>
                                </div>
                                @endif
                                <div class="form-group">
                                    <label for="matchSearchTags">検索タグ:</label>
                                    <select id="matchSearchTags" class="form-control" name="matchSearchTags">
                                        <option value="ハーフリーグ" {{ (old('matchSearchTags') !== null && in_array('ハーフリーグ', old('matchSearchTags'))) === true ? 'selected' : ''}}>ハーフリーグ</option>
                                        <option value="フルリーグ" {{ (old('matchSearchTags') !== null && in_array('フルリーグ', old('matchSearchTags'))) === true ? 'selected' : ''}}>フルリーグ</option>
                                        <option value="トーナメント" {{ (old('matchSearchTags') !== null && in_array('トーナメント', old('matchSearchTags'))) === true ? 'selected' : ''}}>トーナメント</option>
                                        <option value="上級演習所" {{ (old('matchSearchTags') !== null && in_array('上級演習所', old('matchSearchTags'))) === true ? 'selected' : ''}}>上級演習所</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                        <input id="matchfile" type="file" style="display:none" name="matchFile" required>
                                        <div class="input-group">
                                            <span class="input-group-btn">
                                                <button type="button" class="btn btn-info" onclick="$('input[id=matchfile]').click();">マッチファイル</button>
                                            </span>
                                            <input type="text" id="matchCover" class="form-control" placeholder="select file...">
                                        </div>
                                        <p class="help-block">CHEマッチデータが選択可能です</p>
                                </div>
                                {{ csrf_field() }}
                                <button type="submit" class="btn btn-block downy-color">マッチデータアップロード</button>
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
<script>
    $('input[id=teamfile]').change(function () {
        $('#teamCover').val($(this).val());
    });
    $('input[id=matchfile]').change(function () {
        $('#matchCover').val($(this).val());
    });
</script>
@include('common.message')
@endsection