<?php

namespace Tests\Feature\Api\V1;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\File;

class FileControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test /api/v1/file returns list of files
     */
    public function test_index_returns_list_of_files()
    {
        // Arrange: use factories
        File::factory()->create(["file_name" => "file1.txt"]);
        File::factory()->create(["file_name" => "file2.txt"]);

        // Act
        $response = $this->getJson('/api/v1/file');

        // Assert
        $response->assertOk()
                 ->assertJsonCount(2)
                 ->assertJsonFragment(['file_name' => 'file1.txt'])
                 ->assertJsonFragment(['file_name' => 'file2.txt']);
    }
}
