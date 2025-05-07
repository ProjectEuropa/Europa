<?php

namespace Tests\Feature\Api\V1;

use App\File;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class SearchControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @test
     * キーワード検索が正しく動作するかテスト
     */
    public function keyword_search_works_correctly()
    {
        // ファイルを準備
        File::factory()->create([
            'data_type' => '1', // team
            'file_name' => 'テスト用ファイル',
            'upload_owner_name' => 'テストユーザー',
            'file_comment' => '通常のコメント',
            'downloadable_at' => null
        ]);

        File::factory()->create([
            'data_type' => '1', // team
            'file_name' => '別のファイル',
            'upload_owner_name' => '別のユーザー',
            'file_comment' => 'キーワードを含むコメント',
            'downloadable_at' => null
        ]);

        // APIリクエスト実行
        $response = $this->getJson('/api/v1/search/team?keyword=キーワード');

        // 結果を検証
        $response->assertOk();
        $response->assertJsonCount(1, 'data');
        $response->assertJsonFragment(['file_comment' => 'キーワードを含むコメント']);
    }

    /**
     * @test
     * ダウンロード可能日時が過ぎていないファイルのコメントがマスクされることを確認
     */
    public function comments_are_masked_for_files_with_future_downloadable_date()
    {
        // 将来の日時を設定
        $futureDate = Carbon::now()->addDays(1);

        // ファイルを準備
        File::factory()->create([
            'data_type' => '1', // team
            'file_name' => 'マスク対象ファイル',
            'upload_owner_name' => 'テストユーザー',
            'file_comment' => '秘密のコメント',
            'downloadable_at' => $futureDate
        ]);

        File::factory()->create([
            'data_type' => '1', // team
            'file_name' => '通常ファイル',
            'upload_owner_name' => 'テストユーザー',
            'file_comment' => '通常のコメント',
            'downloadable_at' => null
        ]);

        // APIリクエスト実行
        $response = $this->getJson('/api/v1/search/team');

        // 結果を検証
        $response->assertOk();
        $response->assertJsonCount(2, 'data');
        $response->assertJsonFragment(['file_comment' => 'ダウンロード可能日時が過ぎていないためコメントは非表示です']);
        $response->assertJsonFragment(['file_comment' => '通常のコメント']);
    }

    /**
     * @test
     * ダウンロード可能日時が過ぎたファイルのコメントが表示されることを確認
     */
    public function comments_are_visible_for_files_with_past_downloadable_date()
    {
        // 過去の日時を設定
        $pastDate = Carbon::now()->subDays(1);

        // ファイルを準備
        File::factory()->create([
            'data_type' => '1', // team
            'file_name' => '過去のダウンロード日時ファイル',
            'upload_owner_name' => 'テストユーザー',
            'file_comment' => '表示されるコメント',
            'downloadable_at' => $pastDate
        ]);

        // APIリクエスト実行
        $response = $this->getJson('/api/v1/search/team');

        // 結果を検証
        $response->assertOk();
        $response->assertJsonFragment(['file_comment' => '表示されるコメント']);
    }

    /**
     * @test
     * sumDLsearchメソッドが正しく動作するかテスト
     */
    public function sum_dl_search_returns_paginated_results()
    {
        // 多数のファイルを準備
        File::factory()->count(60)->create([
            'data_type' => '2', // match
        ]);

        // APIリクエスト実行
        $response = $this->getJson('/api/v1/sumDLSearch/match');

        // 結果を検証
        $response->assertOk();
        $response->assertJsonCount(50, 'data'); // 50件でページネーション
        $response->assertJsonStructure([
            'current_page',
            'data',
            'first_page_url',
            'from',
            'last_page',
            'last_page_url',
            'links',
            'next_page_url',
            'path',
            'per_page',
            'prev_page_url',
            'to',
            'total'
        ]);
    }
}
