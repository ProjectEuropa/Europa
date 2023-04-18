<?php

namespace Tests\Unit;

use App\BusinessService\FileService;
use App\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class FileServiceTest extends TestCase
{
    use RefreshDatabase;

    protected $fileService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->fileService = new FileService();
    }

    public function testRegisterFileData()
    {
        // Set up a test user
        $user = User::factory()->create();
        Auth::login($user);

        // Set up a test file
        Storage::fake('local');
        $testFile = UploadedFile::fake()->create('testfile.CHE', 100);

        // Set up a test request
        $request = new \Illuminate\Http\Request();
        $request->setMethod('POST');
        $request->files->add(["teamFile" => $testFile]);

        // Set up input data
        $request->merge([
            'teamOwnerName' => 'Test Owner',
            'teamComment' => 'Test Comment',
            'teamDeletePassWord' => 'Test Password',
            'teamSearchTags' => 'tag1,tag2,tag3',
        ]);

        // Call the registerFileData method
        $options = [
            'isTeam' => true,
            'isNormalUpdate' => true
        ];
        $this->fileService->registerFileData($request, $options);

        // Assert that the file was added to the database
        $this->assertDatabaseHas('files', [
            'file_name' => 'testfile.CHE',
            'upload_owner_name' => 'Test Owner',
            'file_comment' => 'Test Comment',
            'delete_password' => 'Test Password',
            'data_type' => 'team',
            'upload_user_id' => $user->id,
            'search_tag1' => 'tag1',
            'search_tag2' => 'tag2',
            'search_tag3' => 'tag3',
            'search_tag4' => null,
        ]);
    }
}
