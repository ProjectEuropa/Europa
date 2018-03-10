@extends('layouts.app')

@section('css')
<style>
    dialog:not([open]) {
        display: none;
    }
    dialog {
        border: none;
    }
    dialog menu {
        padding: 0;
        margin: 0;
    }
    .alert {
        padding: 0;
    }
    @media screen and (max-width: 767px) {
        table {
          overflow: auto;
          white-space: nowrap;
        }
      }
</style>
@endsection

@section('content')
<main>
    <div class="container">
        <div class="under-header">
            <h2>My Page</h2>
            <p>ユーザー登録情報の編集、アップロード・登録したチームデータ・マッチデータ・イベントの閲覧が可能です。</p>
        </div>

        @include('common.validation')

        <ul class="nav nav-pills" style="margin-bottom: 10px;">
            <li><a href="#tab1" data-toggle="tab" class="active show">ユーザ情報</a></li>
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
                    <form method="post" action="{{ url('/mypage/edituserinfo') }}" class="form-inline" role="form">
                        <div class="card" style="margin-bottom: 20px;">  
                            <div class="card-header lighten-1 white-text puerto-color text-center">
                                オーナー名編集
                            </div>
                            <div class="card-body">
                                <div class="">
                                    <input type="text" class="input-alternate" name="ownerName" value="{{ Auth::user()->name }}" style="padding: 0;margin-bottom: 10px;">
                                    
                                </div>
                                {{ csrf_field() }}
                                <button type="submit" class="btn btn-block puerto-color">編集</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="tab-pane" id="tab2">
                <table class="table table-bordered table-hover">
                    <thead>
                        <tr class="table-header">
                            <th class="">ダウンロード</th>
                            <th class="">オーナー名</th>
                            <th class="">コメント</th>
                            <th class="">ファイル名</th>
                            <th class="">アップロード日時</th>
                            <th class="">削除</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($teams as $team)
                        <tr>
                            <td class="">
                                <a href="{{ url('/search/download/'.$team->id) }}"><i aria-hidden="true" class="fa fa-cloud-download"></i></a>
                            </td>
                            <td class="">{{ $team->upload_owner_name }}</td>
                            <td class="">
                                <div>{!! nl2br(e($team->file_comment)) !!}</div>
                                @if (!(empty($team->search_tag1)))
                                <span class="alert alert-info"><i class="fa fa-search"></i>{{ $team->search_tag1 }}</i></span>
                                @endif
                                @if (!(empty($team->search_tag2)))
                                <span class="alert alert-info"><i class="fa fa-search"></i>{{ $team->search_tag2 }}</i></span>
                                @endif
                                @if (!(empty($team->search_tag3)))
                                <span class="alert alert-info"><i class="fa fa-search"></i>{{ $team->search_tag3 }}</i></span>
                                @endif
                                @if (!(empty($team->search_tag4)))
                                <span class="alert alert-info"><i class="fa fa-search"></i>{{ $team->search_tag4 }}</i></span>
                                @endif
                            </td>
                            <td class="">{{ $team->file_name }}</td>
                            <td class="">{{ $team->created_at }}</td>
                            <td class="">
                                <form method="post" action="{{ url('/mypage/file/delete') }}" class="form-horizontal" id="{{ 'team-' .$team->id }}">
                                    <div class="form-group">
                                        <div class="col-xs-12 form-inline">
                                            <input type="hidden" name="id" class="form-control" value="{{ $team->id }}">
                                            <button type="button" class="btn btn-info btn-delete" value="{{ $team->file_name}}" onclick='deleteConfirm("{{ 'team-'.$team->id }}", "{{ $team->file_name }}")'>削除</button>
                                        </div>
                                    </div>
                                    {{ csrf_field() }}
                                    {{ method_field('DELETE') }}
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
                        <tr class="table-header">
                            <th class="">ダウンロード</th>
                            <th class="">オーナー名</th>
                            <th class="">コメント</th>
                            <th class="">ファイル名</th>
                            <th class="">アップロード日時</th>
                            <th class="">削除</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($matchs as $match)
                        <tr>
                            <td class="">
                                <a href="{{ url('/search/download/'.$match->id) }}"><i aria-hidden="true" class="fa fa-cloud-download"></i></a>
                            </td>
                            <td class="">{{ $match->upload_owner_name }}</td>
                            <td class="">
                                <div>{!! nl2br(e($match->file_comment)) !!}</div>
                                @if (!(empty($match->search_tag1)))
                                <span class="alert alert-info"><i class="fa fa-search"></i>{{ $match->search_tag1 }}</i></span>
                                @endif
                                @if (!(empty($match->search_tag2)))
                                <span class="alert alert-info"><i class="fa fa-search"></i>{{ $match->search_tag2 }}</i></span>
                                @endif
                                @if (!(empty($match->search_tag3)))
                                <span class="alert alert-info"><i class="fa fa-search"></i>{{ $match->search_tag3 }}</i></span>
                                @endif
                                @if (!(empty($match->search_tag4)))
                                <span class="alert alert-info"><i class="fa fa-search"></i>{{ $match->search_tag4 }}</i></span>
                                @endif
                            </td>
                            <td class="">{{ $match->file_name }}</td>
                            <td class="">{{ $match->created_at }}</td>
                            <td class="">            
                                <form method="post" action="{{ url('/mypage/file/delete') }}" class="form-horizontal" id="{{ 'match-' .$match->id }}">
                                    <div class="form-group">
                                        <div class="col-xs-12 form-inline">
                                            <input type="hidden" name="id" class="form-control" value="{{ $match->id }}">
                                            <button type="button" class="btn btn-info btn-delete" value="{{ $match->file_name}}" onclick='deleteConfirm("{{ 'match-'.$match->id }}", "{{ $match->file_name }}")'>削除</button>
                                        </div>
                                    </div>
                                    {{ csrf_field() }}
                                    {{ method_field('DELETE') }}
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
                        <tr class="table-header">
                            <th class="">イベント名</th>
                            <th class="">イベント詳細</th>
                            <th class="">イベント受付期間締切日</th>
                            <th class="">イベント表示最終日</th>
                            <th class="">削除</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($events as $event)
                        <tr>
                            <td class="">{{ $event->event_name }}</td>
                            <td class="">{!! nl2br(e($event->event_details)) !!}</td>
                            <td class="">{{ $event->event_closing_day }}</td>
                            <td class="">{{ $event->event_displaying_day }}</td>
                            <td class="">            
                                <form method="post" action="{{ url('/mypage/event/delete') }}" class="form-horizontal" id="{{ 'event-' .$event->id }}">
                                    <div class="form-group">
                                        <div class="col-xs-12 form-inline">
                                            <input type="hidden" name="id" class="form-control" value="{{ $event->id }}">
                                            <button type="button" class="btn btn-info btn-delete" value="{{ $event->event_name }}" onclick='deleteConfirm("{{ 'event-'.$event->id }}", "{{ $event->event_name }}")'>削除</button>
                                        </div>
                                    </div>
                                    {{ csrf_field() }}
                                    {{ method_field('DELETE') }}
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
</main>
<dialog id="confirm-dialog">
    <p class="text-center">本当に「<span id="delete-file-name"></span>」を削除しますか？</p>
    <input type="hidden" id="delete-form-id" value="">
    <menu class="text-center">
      <button id="cancel" class="btn btn-info" onclick="document.getElementById('confirm-dialog').close();">キャンセル</button>
      <button type="button" id="delete-submit" class="btn btn-danger" onclick="document.getElementById(document.getElementById('delete-form-id').value).submit(); document.getElementById('delete-submit').disabled = true;">削除する</button>
    </menu>
</dialog>
@endsection

@section('js')
@include('common.message')
<script>
    function deleteConfirm(formId, fileName) {
        document.getElementById('delete-file-name').innerText = fileName;
        document.getElementById('delete-form-id').value = formId;
        document.getElementById('confirm-dialog').showModal();
    }
</script>
@endsection