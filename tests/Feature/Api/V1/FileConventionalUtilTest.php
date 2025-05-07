<?php

namespace Tests\Feature\Api\V1;

use App\File;
use Tests\TestCase;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Testing\RefreshDatabase;

class FileConventionalUtilTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @test
     * ファイルダウンロードが正常に動作するかテスト
     */
    public function can_download_file()
    {
        // テスト用のディレクトリとファイルを作成
        Storage::fake('public');
        $testContent = 'dummydata';
        Storage::disk('public')->put('test.CHE', $testContent);

        // ファイルレコードをDB作成
        $file = File::factory()->create([
            'file_name' => 'test.CHE',
            'file_comment' => 'Test file for download'
        ]);

        $response = $this->get("/api/v1/download/{$file->id}");

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/CHE');
        $response->assertHeader('Content-Disposition', 'attachment; filename=test.CHE');
        $this->assertEquals('dummydata', $response->getContent());
    }

    /**
     * @test
     * 存在しないファイルIDを指定した場合は404を返すことをテスト
     */
    public function returns_404_for_non_existent_file()
    {
        $nonExistentId = 999;
        $response = $this->get("/api/v1/download/{$nonExistentId}");
        $response->assertStatus(404);
    }

    /**
     * @test
     * 複数ファイルのZIPダウンロードが正常に動作するかテスト
     */
    public function can_download_multiple_files_as_zip()
    {
        // テスト用のディレクトリとファイルを作成
        Storage::fake('public');

        // テスト用のファイルを作成
        $testContent1 = 'content1';
        $testContent2 = 'content2';
        Storage::disk('public')->put('test1.CHE', $testContent1);
        Storage::disk('public')->put('test2.CHE', $testContent2);

        // ファイルレコードをDB作成
        $file1 = File::factory()->create([
            'file_name' => 'test1.CHE',
            'file_comment' => 'Test file for download'
        ]);

        $file2 = File::factory()->create([
            'file_name' => 'test2.CHE',
            'file_comment' => 'Test file for download'
        ]);

        $response = $this->post('/api/v1/sumDownload', [
            'checkedId' => [$file1->id, $file2->id]
        ]);

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/zip');
        $response->assertHeader('Content-Disposition', 'attachment; filename=sum.zip');
    }

    /**
     * @test
     * IDが指定されていない場合はエラーを返すことをテスト
     */
    public function returns_error_when_no_ids_provided()
    {
        $response = $this->post('/api/v1/sumDownload', [
            'checkedId' => []
        ]);

        $response->assertStatus(400);
        $response->assertJson(['error' => 'IDが指定されていません']);
    }

    /**
     * @test
     * 存在しないファイルIDの場合はエラーを返すことをテスト
     */
    public function returns_error_for_non_existent_files()
    {
        $response = $this->post('/api/v1/sumDownload', [
            'checkedId' => [999, 1000]
        ]);

        $response->assertStatus(404);
        $response->assertJson(['error' => 'ファイルが見つかりません']);
    }
}
