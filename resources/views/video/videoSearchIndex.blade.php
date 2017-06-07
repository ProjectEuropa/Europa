{{-- 親ビューの指定 --}}
@extends('layout')


{{-- アップロードフォーム --}}
@section('content')
<div class="container main">
    <h2>Video Search</h2>
    <p>アップロードした動画の検索が可能です。</p>

    <div class="row">
        <div class="col-md-12">
            {{-- フラッシュメッセージの表示 --}}
            @include('common.flash')

            {{-- バリデーションメッセージの表示 --}}
            @include('common.validation')

            <div class="row">
				<div class="col-md-12">
					<h5>
						<form method="get" action="/video/search" class="form-inline" role="form">
							<div class="form-group">
								<label for="word">検索ワード:</label>
								<input type="text" name="keyword" class="form-control" value="{{ $keyword }}">
								<button type="submit" class="btn btn-primary">検索</button>
							</div>
						</form>
					</h5>
				</div>
			</div>
			<div class="row">
			@if (!(empty($videos)))
				@foreach($videos as $video)
					<div class="col-md-4 b-break">
						<div style="position:relative;height:0;padding-bottom:56.25%">
							<iframe src="https://www.youtube.com/embed/{{ $video->id->videoId }}?ecver=2" width="640"
							height="360" frameborder="0" style="position:absolute;width:100%;height:100%;left:0"
							allowfullscreen=""></iframe>
						</div>
						<h5 class="text-center">{{ $video->snippet->title }}</h5>
					</div>
				@endforeach

			@else
			<div class="col-md-4 b-break">
				<h4 class="text-left">Video not Found.</h4>
			</div>
			@endif
			</div>
			
        </div>
        @if (!(empty($videos)))
        	{!! $videos->appends(['keyword'=>$keyword])->links() !!}
        @endif
    </div>
</div>
@endsection

