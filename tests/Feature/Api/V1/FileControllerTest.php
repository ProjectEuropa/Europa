<?php

namespace Tests\Feature\Api\V1;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

class FileControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test /api/v1/file returns list of files
     */
    public function test_index_returns_list_of_files()
    {
        // Arrange
        DB::table('files')->insert([
            [
                'upload_owner_name' => 'Alice',
                'file_name'         => 'file1.txt',
                'file_comment'      => 'comment1',
                'upload_user_id'    => 1,
                'upload_type'       => '1',
                'data_type'         => '1',
                'search_tag1'       => 'tag1',
                'search_tag2'       => 'tag2',
                'search_tag3'       => 'tag3',
                'search_tag4'       => 'tag4',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'upload_owner_name' => 'Bob',
                'file_name'         => 'file2.txt',
                'file_comment'      => 'comment2',
                'upload_user_id'    => 2,
                'upload_type'       => '2',
                'data_type'         => '2',
                'search_tag1'       => 'tag1',
                'search_tag2'       => 'tag2',
                'search_tag3'       => 'tag3',
                'search_tag4'       => 'tag4',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
        ]);

        // Act
        $response = $this->getJson('/api/v1/file');

        // Assert
        $response->assertOk()
                 ->assertJsonCount(2, 'data')
                 ->assertJsonFragment(['file_name' => 'file1.txt'])
                 ->assertJsonFragment(['file_name' => 'file2.txt']);
    }
}
