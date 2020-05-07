<?php

namespace Tests\Feature;

use App\File;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class DownloadTest extends TestCase
{

    use DatabaseTransactions;

    /**
     * .
     *
     * @return void
     */
    public function test_ファイルダウンロードテスト()
    {

        factory(File::class, 50)->create();
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
        factory(File::class, 50)->create();
        $fileIds = File::select('id')->inRandomOrder()->limit(10)->get()->toArray();

        $response = $this->post("/sumDownload",
            [
                'checkedId' => $fileIds,
            ]
        );

        $response->assertStatus(200);
    }
}
