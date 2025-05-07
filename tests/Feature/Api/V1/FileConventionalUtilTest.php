<?php

namespace Tests\Feature\Api\V1;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\User;
use App\File;
use Illuminate\Support\Carbon;

class FileConventionalUtilTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function cannot_download_if_not_yet_downloadable()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $file = File::factory()->create([
            'file_name' => 'test.che',
            'file_data' => 'dummydata',
            'downloadable_at' => Carbon::now()->addHour(), // まだダウンロード不可
        ]);

        $response = $this->getJson("/api/v1/download/{$file->id}");

        $response->assertStatus(400)
            ->assertJson(['error' => '現在はダウンロード可能な状態ではありません。']);
    }

    /** @test */
    public function can_download_file_when_downloadable()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $file = File::factory()->create([
            'file_name' => 'test.che',
            'file_data' => 'dummydata',
            'downloadable_at' => Carbon::now()->subHour(), // ダウンロード可能
        ]);

        $response = $this->get("/api/v1/download/{$file->id}");

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/CHE');
        $response->assertHeader('Content-Disposition', 'attachment; filename=test.che');
        $this->assertEquals('dummydata', $response->getContent());
    }
}
