<?php

namespace Tests\Feature;

use App\File;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DownloadTest extends TestCase
{

    use RefreshDatabase;

    /**
     * .
     *
     * @return void
     */
    public function test_ファイルダウンロードテスト()
    {

        File::factory(50)->create();
        $file = File::select('id')->inRandomOrder()->first();

        $response = $this->get("/auto/download/{$file->id}");

        $response->assertStatus(200);
    }

    /**
     * .
     *
     * @return void
     */
    public function test_一括ダウンロードテスト()
    {
        File::factory(50)->create();
        $fileIds = File::select('id')->inRandomOrder()->limit(10)->get()->toArray();

        $response = $this->post("/sumDownload",
            [
                'checkedId' => $fileIds,
            ]
        );

        $response->assertStatus(200);
    }
}
