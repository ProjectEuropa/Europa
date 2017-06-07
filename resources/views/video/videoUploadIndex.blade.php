{{-- 親ビューの指定 --}}
@extends('layout')

{{-- videocss読み込み --}}
@section('css')
<link rel ="stylesheet" href= "{{ asset('css/video.css') }}">
@endsection

{{-- アップロードフォーム --}}
@section('content')
<div class="container main">
    <h2>Video Upload</h2>
    <p>動画のアップロードが可能です。</p>

    <div class="row">
        <div class="col-md-9 col-md-offset-0">
            {{-- フラッシュメッセージの表示 --}}
            @include('common.flash')

            {{-- バリデーションメッセージの表示 --}}
            @include('common.validation')

            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">動画アップロード</h3>
                </div>
                <div class="panel-body">
                    <form id="uploadFrom" accept-charset="UTF-8" role="form" method="post" action="{{ url('/video/upload') }}"  enctype="multipart/form-data">
                        <fieldset>
                            <div class="form-group">
                                <label for="title">タイトル:</label>
                                <input type="text" class="form-control" name="title" value="{{ old('title') }}">
                            </div>
                            <div class="form-group">
                                <label for="description">説明文:</label>
                                <textarea name="description" class="form-control" rows="5" id="description">{{ old('description') }}</textarea>
                            </div>                        
                            <div class="form-group">
                                <label for="video">動画ファイル</label>
                                <input type="file" name="video" id="video" >
                                <p class="help-block">動画ファイル（avi, mp4）が選択可能です</p>
                            </div>
                            {{ csrf_field() }}
                            <button type="submit" id="videoUpload" class="btn btn-block btn-primary">動画アップロード</button>
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<div id="loading"><img src="{{ asset('image/loading.gif') }}"></div>
@endsection

@section('js')
{{-- btn.js読み込み --}}
<script type="text/javascript" src="{{ asset('js/btn.js') }}"></script>
@endsection
