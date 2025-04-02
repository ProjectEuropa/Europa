<?php

namespace Tests\Feature;

use App\File;
use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class FileUtilTest extends TestCase
{

    use RefreshDatabase;

    /**
     *
     *
     * @return void
     */
    public function test_削除のテスト()
    {

        $file = File::factory()->create(
            [
                'delete_password' => 'fuga',
            ]
        );

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

        $user = User::factory()->create([
            'api_token' => hash('sha256', $token),
        ]);
        File::factory(50)->create(
            [
                'upload_user_id' => $user->id,
            ]
        );

        // チーム
        $response = $this->actingAs($user)->json('GET', "/api/mypage/team?api_token={$token}");
        $json = (json_decode($response->getContent()));

        $this->assertObjectHasProperty('id', $json->data[0]);
        $this->assertObjectHasProperty('upload_owner_name', $json->data[0]);
        $this->assertObjectHasProperty('file_name', $json->data[0]);
        $this->assertObjectHasProperty('file_comment', $json->data[0]);
        $this->assertObjectHasProperty('created_at', $json->data[0]);
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
    public function test_apimymatchのテスト()
    {
        $token = Str::random(80);

        $user = User::factory()->create([
            'api_token' => hash('sha256', $token),
        ]);
        File::factory(10)->create(
            [
                'upload_user_id' => $user->id,
            ]
        );

        // チーム
        $response = $this->actingAs($user)->json('GET', "/api/mypage/match?api_token={$token}");
        $json = (json_decode($response->getContent()));

        $this->assertObjectHasProperty('id', $json->data[0]);
        $this->assertObjectHasProperty('upload_owner_name', $json->data[0]);
        $this->assertObjectHasProperty('file_name', $json->data[0]);
        $this->assertObjectHasProperty('file_comment', $json->data[0]);
        $this->assertObjectHasProperty('created_at', $json->data[0]);
        $this->assertObjectHasProperty('search_tag1', $json->data[0]);
        $this->assertObjectHasProperty('search_tag2', $json->data[0]);
        $this->assertObjectHasProperty('search_tag3', $json->data[0]);
        $this->assertObjectHasProperty('search_tag4', $json->data[0]);
    }
}
