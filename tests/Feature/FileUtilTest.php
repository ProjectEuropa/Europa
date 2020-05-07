<?php

namespace Tests\Feature;

use App\File;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Str;
use Tests\TestCase;

class FileUtilTest extends TestCase
{

    use DatabaseTransactions;

    /**
     *
     *
     * @return void
     */
    public function test_削除のテスト()
    {

        factory(File::class, 50)->create();

        $file = factory(File::class, 1)->create(
            [
                'delete_password' => 'fuga',
            ]
        )[0];

        // 削除失敗
        $response = $this->post('/api/delete/searchFile',
            [
                'id' => $file->id,
                'deletePassword' => 'aaabbb',
            ]);

        $this->assertDatabaseHas('files', [
            'id' => $file->id,
        ]);

        // 削除成功
        $response = $this->post('/api/delete/searchFile',
            [
                'id' => $file->id,
                'deletePassword' => 'fuga',
            ]);

        $this->assertDatabaseMissing('files', [
            'id' => $file->id,
        ]);
    }

    /**
     *
     *
     * @return void
     */
    public function test_apimyteamのテスト()
    {
        $token = Str::random(80);

        $user = factory(User::class)->create([
            'api_token' => hash('sha256', $token),
        ]);

        factory(File::class, 10)->create(
            [
                'upload_user_id' => $user->id,
            ]
        );

        // チーム
        $response = $this->actingAs($user)->json('GET', "/api/mypage/team?api_token={$token}");
        $json = (json_decode($response->getContent()));

        $this->assertObjectHasAttribute('id', $json->data[0]);
        $this->assertObjectHasAttribute('upload_owner_name', $json->data[0]);
        $this->assertObjectHasAttribute('file_name', $json->data[0]);
        $this->assertObjectHasAttribute('file_comment', $json->data[0]);
        $this->assertObjectHasAttribute('created_at', $json->data[0]);
        $this->assertObjectHasAttribute('search_tag1', $json->data[0]);
        $this->assertObjectHasAttribute('search_tag2', $json->data[0]);
        $this->assertObjectHasAttribute('search_tag3', $json->data[0]);
        $this->assertObjectHasAttribute('search_tag4', $json->data[0]);
    }

        /**
     *
     *
     * @return void
     */
    public function test_apimymatchのテスト()
    {
        $token = Str::random(80);

        $user = factory(User::class)->create([
            'api_token' => hash('sha256', $token),
        ]);

        factory(File::class, 10)->create(
            [
                'upload_user_id' => $user->id,
            ]
        );

        // チーム
        $response = $this->actingAs($user)->json('GET', "/api/mypage/match?api_token={$token}");
        $json = (json_decode($response->getContent()));

        $this->assertObjectHasAttribute('id', $json->data[0]);
        $this->assertObjectHasAttribute('upload_owner_name', $json->data[0]);
        $this->assertObjectHasAttribute('file_name', $json->data[0]);
        $this->assertObjectHasAttribute('file_comment', $json->data[0]);
        $this->assertObjectHasAttribute('created_at', $json->data[0]);
        $this->assertObjectHasAttribute('search_tag1', $json->data[0]);
        $this->assertObjectHasAttribute('search_tag2', $json->data[0]);
        $this->assertObjectHasAttribute('search_tag3', $json->data[0]);
        $this->assertObjectHasAttribute('search_tag4', $json->data[0]);
    }
}
