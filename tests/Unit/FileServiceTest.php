<?php

namespace Tests\Unit;

use App\BusinessService\FileService;
use App\File;
use App\Http\Requests\UploadRequest;
use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
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
        $user = User::factory()->create();
        Auth::login($user);
        Storage::fake('local');
        $testCases = [
            ['isTeam' => true, 'isNormalUpdate' => true],
            ['isTeam' => true, 'isNormalUpdate' => false],
            ['isTeam' => false, 'isNormalUpdate' => true],
            ['isTeam' => false, 'isNormalUpdate' => false],
        ];

        foreach ($testCases as $testCase) {
            $options = [
                'isTeam' => $testCase['isTeam'],
                'isNormalUpdate' => $testCase['isNormalUpdate'],
            ];
            $request = new UploadRequest();
            $request->setMethod('POST');
            $dataType = $options['isTeam'] ? 'team' : 'match';
            $dataTypeId = $dataType === 'team' ? '1' : '2';
            $uploadUserId = $options['isNormalUpdate'] ? $user->id : 0;

            $testFile = UploadedFile::fake()->create('testfile.CHE', 100);

            $request->files->add(["{$dataType}File" => $testFile]);

            $owner = Str::random(10);
            $commnent = Str::random(10);
            $password = Str::random(10);

            $request->merge([
                "{$dataType}OwnerName" => $owner,
                "{$dataType}Comment" => $commnent,
                "{$dataType}DeletePassWord" => $password,
                "{$dataType}SearchTags" => 'tag1,tag2,tag3,tag4',
            ]);

            $this->fileService->registerFileData($request, $options);

            $this->assertDatabaseHas('files', [
                'file_name' => 'testfile.CHE',
                'upload_owner_name' => $owner,
                'file_comment' => $commnent,
                'delete_password' => $password,
                'data_type' => $dataTypeId,
                'upload_user_id' => $uploadUserId,
                'search_tag1' => 'tag1',
                'search_tag2' => 'tag2',
                'search_tag3' => 'tag3',
                'search_tag4' => 'tag4',
            ]);
        }
    }

    public function testStoresBinaryCorrectlyTeam()
    {
        $user = User::factory()->create();
        Auth::login($user);

        $filePath = storage_path('app/public/team.CHE');
        $binaryData = file_get_contents($filePath);
        $file = new UploadedFile($filePath, 'team.CHE', null, null, true);

        $request = new UploadRequest();
        $request->merge([
            'teamOwnerName' => 'Test Owner',
            'teamComment' => 'Test Comment',
            'teamDeletePassWord' => 'Test Password',
            'teamSearchTags' => 'tag1,tag2,tag3,tag4',
        ]);

        $request->files->add(['teamFile' => $file]);

        $this->fileService->registerFileData($request, ['isTeam' => true, 'isNormalUpdate' => true]);

        $storedFile = File::latest('id')->first();
        $this->assertEquals($binaryData, $storedFile->file_data);
    }

    public function testStoresBinaryCorrectlyMatch()
    {
        $user = User::factory()->create();
        Auth::login($user);

        $filePath = storage_path('app/public/match.CHE');
        $binaryData = file_get_contents($filePath);
        $file = new UploadedFile($filePath, 'match.CHE', null, null, true);

        $request = new UploadRequest();
        $request->merge([
            'matchOwnerName' => 'Test Owner',
            'matchComment' => 'Test Comment',
            'matchDeletePassWord' => 'Test Password',
            'matchSearchTags' => 'tag1,tag2,tag3,tag4',
        ]);

        $request->files->add(['matchFile' => $file]);

        $this->fileService->registerFileData($request, ['isTeam' => false, 'isNormalUpdate' => true]);

        $storedFile = File::latest('id')->first();
        $this->assertEquals($binaryData, $storedFile->file_data);
    }
}
