{{-- 親ビューの指定 --}}
@extends('layout')

{{-- 一括ダウンロード表示 --}}
@section('content')
<div class="container main">

    @if (($searchType) === 'team')
    <h2>Sum DL Team</h2>
    <p>チームデータの一括ダウンロードが可能です。ダウンロードしたいデータにチェックを入れて一括ダウンロードボタンをクリックしてください。</p>
    @endif
    @if (($searchType) === 'match')
    <h2>Sum DL Match</h2>
    <p>マッチデータの一括ダウンロードが可能です。ダウンロードしたいデータにチェックを入れて一括ダウンロードボタンをクリックしてください。</p>
    @endif

    {{-- バリデーションメッセージの表示 --}}
    @include('common.validation')

    <h5>
        <form method="get" action="/sumdownload/{{$searchType}}" class="form-inline" role="form">
            <div class="form-group">
                <label for="word">検索ワード:</label>
                <input type="text" name="keyword" class="form-control" value="{{$keyword}}">
                {{Form::select('orderType', [
                'new' => '投稿日時の新しい順',
                'old' => '投稿日時の古い順']
                , $orderType, ['class' => 'form-control'])}}
                <button type="submit" class="btn btn-primary">検索</button>
            </div>
        </form>
    </h5>
    <p>全{{$files->total()}}件中{{$files->currentPage()}}ページ目</p>
    <form method="post" action="/sumdownload/download" class="form-horizontal">
        <table class="table table-bordered table-hover">
            <thead>
                <tr class="something">
                    <th><input type="checkbox" id="parentCheck">全チェック</th>
                    <th>オーナー名</th>
                    <th>コメント</th>
                    <th>ファイル名</th>
                    <th>アップロード日時</th>
                </tr>
            </thead>
            <tbody>
                @forelse($files as $file)
                <tr>
                    <td class="col-md-1">
                        <input type="checkbox" name="checkFileId[]" class="childCheck" value="{{$file->id}}">
                    </td>
                    <td class="col-md-1">{{ $file->upload_owner_name }}</td>
                    <td class="col-md-6">{!! nl2br(e($file->file_comment)) !!}</td>
                    <td class="col-md-2">{{ $file->file_name }}</td>
                    <td class="col-md-2">{{ $file->created_at }}</td>
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
        {{ csrf_field() }}
        <input type="hidden" name="searchType" value="{{$searchType}}">
        <button type="submit" class="btn btn-info" value="">一括ダウンロード</button>
    </form>

    {{-- ページネーションリンク キーワード返却含む--}}
    {!! $files->appends(['keyword'=>$keyword, 'orderType'=>$orderType])->render() !!}
</div>
@endsection

{{-- btn.js読み込み --}}
@section('js')
<script type="text/javascript" src="{{ asset('js/sumdl.js') }}"></script>
@endsection