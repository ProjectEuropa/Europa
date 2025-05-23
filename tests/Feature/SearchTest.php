<?php

namespace Tests\Feature;

use App\File;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SearchTest extends TestCase
{
    use RefreshDatabase;

    /**
     *
     *
     * @return void
     */
    public function test_検索のテスト()
    {

        File::factory(50)->create();

        // チーム
        $response = $this->json('GET', '/api/search/team');
        $json = (json_decode($response->getContent()));

        $this->assertObjectHasProperty('current_page', $json);
        $this->assertObjectHasProperty('data', $json);
        $this->assertObjectHasProperty('first_page_url', $json);
        $this->assertObjectHasProperty('from', $json);
        $this->assertObjectHasProperty('last_page_url', $json);
        $this->assertObjectHasProperty('next_page_url', $json);
        $this->assertObjectHasProperty('path', $json);
        $this->assertObjectHasProperty('per_page', $json);
        $this->assertObjectHasProperty('prev_page_url', $json);
        $this->assertObjectHasProperty('to', $json);
        $this->assertObjectHasProperty('total', $json);
        $this->assertObjectHasProperty('id', $json->data[0]);
        $this->assertObjectHasProperty('upload_owner_name', $json->data[0]);
        $this->assertObjectHasProperty('file_name', $json->data[0]);
        $this->assertObjectHasProperty('file_comment', $json->data[0]);
        $this->assertObjectHasProperty('upload_type', $json->data[0]);
        $this->assertObjectHasProperty('created_at', $json->data[0]);
        $this->assertObjectHasProperty('upload_user_id', $json->data[0]);
        $this->assertObjectHasProperty('search_tag1', $json->data[0]);
        $this->assertObjectHasProperty('search_tag2', $json->data[0]);
        $this->assertObjectHasProperty('search_tag3', $json->data[0]);
        $this->assertObjectHasProperty('search_tag4', $json->data[0]);

        // マッチ
        $response = $this->json('GET', '/api/search/match');
        $json = (json_decode($response->getContent()));

        $this->assertObjectHasProperty('current_page', $json);
        $this->assertObjectHasProperty('data', $json);
        $this->assertObjectHasProperty('first_page_url', $json);
        $this->assertObjectHasProperty('from', $json);
        $this->assertObjectHasProperty('last_page_url', $json);
        $this->assertObjectHasProperty('next_page_url', $json);
        $this->assertObjectHasProperty('path', $json);
        $this->assertObjectHasProperty('per_page', $json);
        $this->assertObjectHasProperty('prev_page_url', $json);
        $this->assertObjectHasProperty('to', $json);
        $this->assertObjectHasProperty('total', $json);
        $this->assertObjectHasProperty('id', $json->data[0]);
        $this->assertObjectHasProperty('upload_owner_name', $json->data[0]);
        $this->assertObjectHasProperty('file_name', $json->data[0]);
        $this->assertObjectHasProperty('file_comment', $json->data[0]);
        $this->assertObjectHasProperty('created_at', $json->data[0]);
        $this->assertObjectHasProperty('upload_user_id', $json->data[0]);
        $this->assertObjectHasProperty('search_tag1', $json->data[0]);
        $this->assertObjectHasProperty('search_tag2', $json->data[0]);
        $this->assertObjectHasProperty('search_tag3', $json->data[0]);
        $this->assertObjectHasProperty('search_tag4', $json->data[0]);
    }

    /**
     *
     *
     * @return void
     */
    public function test_検索orderbyのテスト()
    {

        File::factory(50)->create();

        // チームデータ検索
        $response = $this->json('GET', '/api/search/team?orderType=2');
        $json = (json_decode($response->getContent()));
        $file = File::where('data_type', '=', '1')->orderBy('id', 'asc')->first();
        $this->assertEquals($file->id, $json->data[0]->id);

        $response = $this->json('GET', '/api/search/team?orderType=1');
        $json = (json_decode($response->getContent()));
        $file = File::where('data_type', '=', '1')->orderBy('id', 'desc')->first();
        $this->assertEquals($file->id, $json->data[0]->id);

        // マッチデータ検索
        $response = $this->json('GET', '/api/search/match?orderType=2');
        $json = (json_decode($response->getContent()));
        $file = File::where('data_type', '=', '2')->orderBy('id', 'asc')->first();
        $this->assertEquals($file->id, $json->data[0]->id);

        $response = $this->json('GET', '/api/search/match?orderType=1');
        $json = (json_decode($response->getContent()));
        $file = File::where('data_type', '=', '2')->orderBy('id', 'desc')->first();
        $this->assertEquals($file->id, $json->data[0]->id);
    }

    /**
     *
     *
     * @return void
     */
    public function test_検索絞り込みテスト()
    {
        File::factory(50)->create();

        File::factory(50)->create(
            [
                'data_type' => '1',
                'file_comment' => '文字列',
            ]
        );

        $response = $this->json('GET', '/api/search/team?keyword=文字列');
        $json = (json_decode($response->getContent()));
        $this->assertStringContainsString($json->data[0]->file_comment, '文字列');
    }

    /**
     * A basic test example.
     *
     * @return void
     */
    public function test_一括DL検索のテスト()
    {

        File::factory(50)->create();

        // チーム
        $response = $this->json('GET', '/api/sumDLSearch/team');
        $json = (json_decode($response->getContent()));

        $this->assertObjectHasProperty('current_page', $json);
        $this->assertObjectHasProperty('data', $json);
        $this->assertObjectHasProperty('first_page_url', $json);
        $this->assertObjectHasProperty('from', $json);
        $this->assertObjectHasProperty('last_page_url', $json);
        $this->assertObjectHasProperty('next_page_url', $json);
        $this->assertObjectHasProperty('path', $json);
        $this->assertObjectHasProperty('per_page', $json);
        $this->assertObjectHasProperty('prev_page_url', $json);
        $this->assertObjectHasProperty('to', $json);
        $this->assertObjectHasProperty('total', $json);
        $this->assertObjectHasProperty('id', $json->data[0]);
        $this->assertObjectHasProperty('upload_owner_name', $json->data[0]);
        $this->assertObjectHasProperty('file_name', $json->data[0]);
        $this->assertObjectHasProperty('file_comment', $json->data[0]);
        $this->assertObjectHasProperty('created_at', $json->data[0]);
        $this->assertObjectHasProperty('upload_user_id', $json->data[0]);
        $this->assertObjectHasProperty('search_tag1', $json->data[0]);
        $this->assertObjectHasProperty('search_tag2', $json->data[0]);
        $this->assertObjectHasProperty('search_tag3', $json->data[0]);
        $this->assertObjectHasProperty('search_tag4', $json->data[0]);

        // マッチ
        $response = $this->json('GET', '/api/search/match');
        $json = (json_decode($response->getContent()));

        $this->assertObjectHasProperty('current_page', $json);
        $this->assertObjectHasProperty('data', $json);
        $this->assertObjectHasProperty('first_page_url', $json);
        $this->assertObjectHasProperty('from', $json);
        $this->assertObjectHasProperty('last_page_url', $json);
        $this->assertObjectHasProperty('next_page_url', $json);
        $this->assertObjectHasProperty('path', $json);
        $this->assertObjectHasProperty('per_page', $json);
        $this->assertObjectHasProperty('prev_page_url', $json);
        $this->assertObjectHasProperty('to', $json);
        $this->assertObjectHasProperty('total', $json);
        $this->assertObjectHasProperty('id', $json->data[0]);
        $this->assertObjectHasProperty('upload_owner_name', $json->data[0]);
        $this->assertObjectHasProperty('file_name', $json->data[0]);
        $this->assertObjectHasProperty('file_comment', $json->data[0]);
        $this->assertObjectHasProperty('created_at', $json->data[0]);
        $this->assertObjectHasProperty('upload_user_id', $json->data[0]);
        $this->assertObjectHasProperty('search_tag1', $json->data[0]);
        $this->assertObjectHasProperty('search_tag2', $json->data[0]);
        $this->assertObjectHasProperty('search_tag3', $json->data[0]);
        $this->assertObjectHasProperty('search_tag4', $json->data[0]);
    }

    /**
     *
     *
     * @return void
     */
    public function test_一括DL検索orderbyのテスト()
    {

        File::factory(50)->create();

        // チームデータ検索
        $response = $this->json('GET', '/api/sumDLSearch/team?orderType=2');
        $json = (json_decode($response->getContent()));
        $file = File::where('data_type', '=', '1')->orderBy('id', 'asc')->first();
        $this->assertEquals($file->id, $json->data[0]->id);

        $response = $this->json('GET', '/api/sumDLSearch/team?orderType=1');
        $json = (json_decode($response->getContent()));
        $file = File::where('data_type', '=', '1')->orderBy('id', 'desc')->first();
        $this->assertEquals($file->id, $json->data[0]->id);

        // マッチデータ検索
        $response = $this->json('GET', '/api/sumDLSearch/match?orderType=2');
        $json = (json_decode($response->getContent()));
        $file = File::where('data_type', '=', '2')->orderBy('id', 'asc')->first();
        $this->assertEquals($file->id, $json->data[0]->id);

        $response = $this->json('GET', '/api/sumDLSearch/match?orderType=1');
        $json = (json_decode($response->getContent()));
        $file = File::where('data_type', '=', '2')->orderBy('id', 'desc')->first();
        $this->assertEquals($file->id, $json->data[0]->id);
    }
}
