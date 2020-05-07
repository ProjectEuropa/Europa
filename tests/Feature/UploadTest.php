<?php

namespace Tests\Feature;

use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class UploadTest extends TestCase
{

    use DatabaseTransactions;

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_簡易アップロードチームデータ()
    {
        $file = UploadedFile::fake()->create('hoge.CHE', 24);

        $response = $this->post('/team/simpleupload', [
            'teamOwnerName' => 'MMM',
            'teamComment' => 'aiyaaa',
            'teamSearchTags' => 'a,b',
            'teamDeletePassWord' => 'aakjflsjf',
            'teamFile' => $file,
        ]);

        $this->assertDatabaseHas('files', [
            'upload_user_id' => 0,
            'upload_owner_name' => 'MMM',
            'file_name' => 'hoge.CHE',
            'file_comment' => 'aiyaaa',
            'delete_password' => 'aakjflsjf',
            'data_type' => '1',
            'search_tag1' => 'a',
            'search_tag2' => 'b',
        ]);
    }

    public function test_簡易アップロードマッチデータ()
    {
        $file = UploadedFile::fake()->create('MatchSimple.CHE', 255);

        $response = $this->post('/match/simpleupload', [
            'matchOwnerName' => 'MAX',
            'matchComment' => 'VCIEC',
            'matchSearchTags' => 'FFFF,XXX',
            'matchDeletePassWord' => 'deliuc',
            'matchFile' => $file,
        ]);

        $this->assertDatabaseHas('files', [
            'upload_user_id' => 0,
            'upload_owner_name' => 'MAX',
            'file_name' => 'MatchSimple.CHE',
            'file_comment' => 'VCIEC',
            'delete_password' => 'deliuc',
            'data_type' => '2',
            'search_tag1' => 'FFFF',
            'search_tag2' => 'XXX',
        ]);

    }

    public function test_アップロードチームデータ()
    {
        $file = UploadedFile::fake()->create('UP.CHE', 24);

        $user = factory(User::class)->create();

        $response = $this->actingAs($user)->post('/team/upload', [
            'teamOwnerName' => $user->name,
            'teamComment' => 'fkjsflk',
            'teamSearchTags' => 'eee,fff',
            'teamDeletePassWord' => 'eee',
            'teamFile' => $file,
        ]);

        $this->assertDatabaseHas('files', [
            'upload_user_id' => $user->id,
            'upload_owner_name' => $user->name,
            'file_name' => 'UP.CHE',
            'file_comment' => 'fkjsflk',
            'delete_password' => 'eee',
            'data_type' => '1',
            'search_tag1' => 'eee',
            'search_tag2' => 'fff',
        ]);
    }

    public function test_アップロードマッチデータ()
    {
        $file = UploadedFile::fake()->create('UPUPIE.CHE', 255);

        $user = factory(User::class)->create();

        $response = $this->actingAs($user)->post('/match/upload', [
            'matchOwnerName' => $user->name,
            'matchComment' => 'VCIEC',
            'matchSearchTags' => 'EEE,SDF,Af,BE',
            'matchFile' => $file,
        ]);

        $this->assertDatabaseHas('files', [
            'upload_user_id' => $user->id,
            'upload_owner_name' => $user->name,
            'file_name' => 'UPUPIE.CHE',
            'file_comment' => 'VCIEC',
            'data_type' => '2',
            'search_tag1' => 'EEE',
            'search_tag2' => 'SDF',
            'search_tag3' => 'Af',
            'search_tag4' => 'BE',
        ]);
    }
}
