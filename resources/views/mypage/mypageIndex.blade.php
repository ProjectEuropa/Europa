{{-- 親ビューの指定 --}}
@extends('layout')


{{-- ユーザーレコード一覧表示 --}}
@section('content')
<div class="container main">

    <h2>My Page</h2>
    <p>ユーザー登録情報の編集、アップロード・登録したチームデータ・マッチデータ・イベントの閲覧が可能です。</p>

    {{-- フラッシュメッセージの表示 --}}
    @include('common.flash')

    {{-- バリデーションメッセージの表示 --}}
    @include('common.validation')

    <ul class="nav nav-tabs">
        <li class="active"><a href="#tab1" data-toggle="tab">ユーザ情報</a></li>
        <li><a href="#tab2" data-toggle="tab">アップロード済チームデータ</a></li>
        <li><a href="#tab3" data-toggle="tab">アップロード済マッチデータ</a></li>
        <li><a href="#tab4" data-toggle="tab">登録済みイベント</a></li>
    </ul>

    <div class="tab-content">
        <div class="tab-pane active" id="tab1">
            <div class="row">
                <div class="col-md-2">
                    <img src="{{ Auth::user()->avatar }}" class="img-thumbnail img-responsive">
                </div>
                <div class="col-md-4">  
                    <h5 class="text-left">オーナー名</h5>
                    <form method="post" action="/mypage/editUserInfo" class="form-inline" role="form">
                        <div class="form-group">
                            <input type="text" name="ownerName" value="{{ Auth::user()->name }}">
                            <button type="submit" class="btn btn-primary btn-edit">編集</button>
                        </div>
                        {{ csrf_field() }}
                    </form>
                </div>
            </div>
        </div>
        <div class="tab-pane" id="tab2">
            <table class="table table-bordered table-hover">
                <thead>
                    <tr class="something">
                        <th class="col-md-1">ダウンロード</th>
                        <th class="col-md-1">オーナー名</th>
                        <th class="col-md-3">コメント</th>
                        <th class="col-md-1">ファイル名</th>
                        <th class="col-md-2">アップロード日時</th>
                        <th class="col-md-1">削除</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($teams as $team)
                    <tr>
                        <td class="col-md-1">
                            <a href="/search/download/{{$team->id}}"><span class="glyphicon glyphicon-cloud-download"></span></a>
                        </td>
                        <td class="col-md-1">{{ $team->upload_owner_name }}</td>
                        <td class="col-md-3">{!! nl2br(e($team->file_comment)) !!}</td>
                        <td class="col-md-1">{{ $team->file_name }}</td>
                        <td class="col-md-2">{{ $team->created_at }}</td>
                        <td class="col-md-1">
                            <form method="post" action="/mypage/file/delete" class="form-horizontal">
                                <div class="form-group">
                                    <div class="col-xs-12 form-inline">
                                        <input type="hidden" name="id" class="form-control" value="{{ $team->id }}">
                                        <button type="submit" class="btn btn-info btn-delete" value="{{ $team->file_name}}">削除</button>
                                    </div>
                                </div>
                                {{ csrf_field() }}
                            </form>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td></td>
                        <td>レコード未登録</td>
                        <td></td><td></td><td></td><td></td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        
        <div class="tab-pane" id="tab3">
            <table class="table table-bordered table-hover">
                <thead>
                    <tr class="something">
                        <th class="col-md-1">ダウンロード</th>
                        <th class="col-md-1">オーナー名</th>
                        <th class="col-md-3">コメント</th>
                        <th class="col-md-1">ファイル名</th>
                        <th class="col-md-2">アップロード日時</th>
                        <th class="col-md-1">削除</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($matchs as $match)
                    <tr>
                        <td class="col-md-1">
                            <a href="/search/download/{{$match->id}}"><span class="glyphicon glyphicon-cloud-download"></span></a>
                        </td>
                        <td class="col-md-1">{{ $match->upload_owner_name }}</td>
                        <td class="col-md-3">{!! nl2br(e($match->file_comment)) !!}</td>
                        <td class="col-md-1">{{ $match->file_name }}</td>
                        <td class="col-md-2">{{ $match->created_at }}</td>
                        <td class="col-md-1">            
                            <form method="post" action="/mypage/file/delete" class="form-horizontal">
                                <div class="form-group">
                                    <div class="col-xs-12 form-inline">
                                        <input type="hidden" name="id" class="form-control" value="{{ $match->id }}">
                                        <button type="submit" class="btn btn-info btn-delete" value="{{ $match->file_name}}">削除</button>
                                    </div>
                                </div>
                                {{ csrf_field() }}
                            </form>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td></td>
                        <td>レコード未登録</td>
                        <td></td><td></td><td></td><td></td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        
        <div class="tab-pane" id="tab4">
            <table class="table table-bordered table-hover">
                <thead>
                    <tr class="something">
                        <th class="col-md-1">イベント名</th>
                        <th class="col-md-3">イベント詳細</th>
                        <th class="col-md-2">イベント受付期間締切日</th>
                        <th class="col-md-2">イベント表示最終日</th>
                        <th class="col-md-1">削除</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($events as $event)
                    <tr>
                        <td class="col-md-1">{{ $event->event_name }}</td>
                        <td class="col-md-3">{!! nl2br(e($event->event_details)) !!}</td>
                        <td class="col-md-2">{{ $event->event_closing_day }}</td>
                        <td class="col-md-2">{{ $event->event_displaying_day }}</td>
                        <td class="col-md-1">            
                            <form method="post" action="/mypage/event/delete" class="form-horizontal">
                                <div class="form-group">
                                    <div class="col-xs-12 form-inline">
                                        <input type="hidden" name="id" class="form-control" value="{{ $event->id }}">
                                        <button type="submit" class="btn btn-info btn-delete" value="{{ $event->event_name}}">削除</button>
                                    </div>
                                </div>
                                {{ csrf_field() }}
                            </form>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td></td>
                        <td>レコード未登録</td>
                        <td></td><td></td><td></td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        
    </div>
</div>
@endsection

{{-- btn.js読み込み --}}
@section('js')
<script type="text/javascript" src="{{ asset('js/btn.js') }}"></script>
@endsection