<?php

namespace Tests\Feature;

use App\Http\Requests\UploadRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class UploadTest extends TestCase
{
    use RefreshDatabase;

    // public function test_successfully_uploads_team_and_match_data()
    // {
    //     Storage::fake('local');

    //     $testCases = [
    //         ['isTeam' => true, 'isNormalUpdate' => true, 'redirectUrl' => '/upload'],
    //         ['isTeam' => true, 'isNormalUpdate' => false, 'redirectUrl' => '/simpleupload'],
    //         ['isTeam' => false, 'isNormalUpdate' => true, 'redirectUrl' => '/upload'],
    //         ['isTeam' => false, 'isNormalUpdate' => false, 'redirectUrl' => '/simpleupload'],
    //     ];

    //     foreach ($testCases as $testCase) {

    //         $response = $this->postJson(route('upload', [
    //             'request' => ['file' => $file],
    //             'isTeam' => $testCase['isTeam'],
    //             'isNormalUpdate' => $testCase['isNormalUpdate'],
    //         ]));

    //         $response->assertRedirect($testCase['redirectUrl']);
    //         $response->assertSessionHas('message', ($testCase['isTeam'] ? 'チーム' : 'マッチ') . 'データのアップロードが完了しました');
    //     }
    // }

    /** @test */
    public function it_successfully_uploads_team_and_match_data()
    {
        // テスト用のディスクを設定します
        Storage::fake('local');

        // テスト用のファイルを作成します
        $file = UploadedFile::fake()->create('document.txt', 200);

        // テストケースの組み合わせ
        $testCases = [
            // ['isTeam' => true, 'isNormalUpdate' => true, 'redirectUrl' => '/upload'],
            ['isTeam' => true, 'isNormalUpdate' => false, 'redirectUrl' => '/simpleupload'],
            // ['isTeam' => false, 'isNormalUpdate' => true, 'redirectUrl' => '/upload'],
            // ['isTeam' => false, 'isNormalUpdate' => false, 'redirectUrl' => '/simpleupload'],
        ];

        // テストケースの組み合わせでループ処理
        foreach ($testCases as $testCase) {
            $filePath = storage_path("app/public/sample.CHE");
            $binaryData = file_get_contents($filePath);
            $file = new UploadedFile($filePath, "sample.CHE", null, null, true);
            $dataType = $testCase['isTeam'] ? 'team' : 'match';

            $request = new UploadRequest();
            $request->merge([
                "{$dataType}OwnerName" => 'test',
                "{$dataType}Comment" => 'comment',
                "{$dataType}DeletePassWord" => 'password',
                "{$dataType}SearchTags" => 'tag1,tag2,tag3,tag4',
            ]);
            // $request->files->add(["{$dataType}File" => $file]);

            $url = "/{$dataType}{$testCase["redirectUrl"]}";

            $response = $this->post($url, [
                'request' => $request,
                'isTeam' => $testCase['isTeam'],
                'isNormalUpdate' => $testCase['isNormalUpdate'],
            ]);

            $response->assertRedirect($testCase['redirectUrl']);
            $response->assertSessionHas('message', ($testCase['isTeam'] ? 'チーム' : 'マッチ') . 'データのアップロードが完了しました');
        }
    }
}
