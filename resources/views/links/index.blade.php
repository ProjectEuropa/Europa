{{-- 親ビューの指定 --}}
@extends('layout')

{{-- css読み込みフォーム --}}
@section('css')
    <link rel ="stylesheet" href= "{{ asset('css/links.css') }}">
@endsection

{{-- アップロードフォーム --}}
@section('content')
<h2>Links</h2>
<p>Carnage Heart EXA に関連するリンク集です。各画像のリンクからお進みください。</p>

<div class="row no-gutter">
                <div class="col-lg-4 col-sm-6">
                    <a href="http://chehl.main.jp/" target="_blank" class="portfolio-box">
                        <img src="image/headline.png" class="img-responsive" alt="">
                        <div class="portfolio-box-caption">
                            <div class="portfolio-box-caption-content">
                                <div class="project-category text-faded">
                                    Carnage Heart EXA Headline
                                </div>
                                <div class="project-name">
                                    Copyright © 2012-2015 "D" All Rights Reserved.
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
                <div class="col-lg-4 col-sm-6">
                    <a href="http://www37.atwiki.jp/chex/" target="_blank" class="portfolio-box">
                        <img src="image/carnagewiki.png" class="img-responsive" alt="">
                        <div class="portfolio-box-caption">
                            <div class="portfolio-box-caption-content">
                                <div class="project-category text-faded">
                                    Carnage Heart EXA 2chまとめwiki
                                </div>
                                <div class="project-name">
                                    @wiki
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
                <div class="col-lg-4 col-sm-6">
                    <a href="http://jbbs.shitaraba.net/game/58835/" target="_blank" class="portfolio-box">
                        <img src="image/sitaraba.png" class="img-responsive" alt="">
                        <div class="portfolio-box-caption">
                            <div class="portfolio-box-caption-content">
                                <div class="project-category text-faded">
                                    したらば 【PSP】カルネージハートエクサ避難所
                                </div>
                                <div class="project-name">
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
                <div class="col-lg-4 col-sm-6">
                    <a href="http://satloke.jp/" target="_blank" class="portfolio-box">
                        <img src="image/SATLOKE.png" class="img-responsive" alt="">
                        <div class="portfolio-box-caption">
                            <div class="portfolio-box-caption-content">
                                <div class="project-category text-faded">
                                    SATLOKE
                                </div>
                                <div class="project-name">
                                    © 2010-2013 ARTDINK. All Rights Reserved.
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
                <div class="col-lg-4 col-sm-6">
                    <a href="http://mixi.jp/view_community.pl?id=5138413" target="_blank" class="portfolio-box">
                        <img src="image/mixi.png" class="img-responsive" alt="">
                        <div class="portfolio-box-caption">
                            <div class="portfolio-box-caption-content">
                                <div class="project-category text-faded">
                                    mixi カルネージハートエクサコミュニティ
                                </div>
                                <div class="project-name">
                                    Copyright (C) 1999-2016 mixi, Inc. All rights reserved.
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
                <div class="col-lg-4 col-sm-6">
                    <a href="http://exa.orz.hm/pandit3/uploader.php" target="_blank" class="portfolio-box">
                        <img src="image/pandit.png" class="img-responsive" alt="">
                        <div class="portfolio-box-caption">
                            <div class="portfolio-box-caption-content">
                                <div class="project-category text-faded">
                                    pandit3
                                </div>
                                <div class="project-name">
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
@endsection