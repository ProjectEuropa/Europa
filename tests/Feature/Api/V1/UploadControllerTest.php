<?php

namespace Tests\Feature\Api\V1;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\User;

class UploadControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function team_upload_requires_required_fields()
    {
        // Create a user and authenticate
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        // Send a request without required fields
        $response = $this->postJson('/api/v1/team/upload', []);

        // Assert that the response is a 422 (Unprocessable Entity)
        $response->assertStatus(422);

        // Assert that the response is JSON and has the expected structure
        $response->assertJson([
            'message' => 'The given data was invalid.',
            'errors' => [
                'teamOwnerName' => [
                    'team owner nameは必ず指定してください。'
                ],
                'teamComment' => [
                    'team commentは必ず指定してください。'
                ],
                'teamFile' => [
                    'team fileは必ず指定してください。'
                ]
            ]
        ]);
    }

    /** @test */
    public function match_upload_requires_required_fields()
    {
        // Create a user and authenticate
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        // Send a request without required fields
        $response = $this->postJson('/api/v1/match/upload', []);

        // Assert that the response is a 422 (Unprocessable Entity)
        $response->assertStatus(422);

        // Assert that the response is JSON and has the expected structure
        $response->assertJson([
            'message' => 'The given data was invalid.',
            'errors' => [
                'matchOwnerName' => [
                    'match owner nameは必ず指定してください。'
                ],
                'matchComment' => [
                    'match commentは必ず指定してください。'
                ],
                'matchFile' => [
                    'match fileは必ず指定してください。'
                ]
            ]
        ]);
    }

    /** @test */
    public function team_simpleupload_requires_required_fields()
    {
        // Create a user and authenticate
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        // Send a request without required fields
        $response = $this->postJson('/api/v1/team/simpleupload', []);

        // Assert that the response is a 422 (Unprocessable Entity)
        $response->assertStatus(422);

        // Assert that the response is JSON and has the expected structure
        $response->assertJson([
            'message' => 'The given data was invalid.',
            'errors' => [
                'teamOwnerName' => [
                    'team owner nameは必ず指定してください。'
                ],
                'teamComment' => [
                    'team commentは必ず指定してください。'
                ],
                'teamDeletePassWord' => [
                    'team delete pass wordは必ず指定してください。'
                ],
                'teamFile' => [
                    'team fileは必ず指定してください。'
                ]
            ]
        ]);
    }

    /** @test */
    public function match_simpleupload_requires_required_fields()
    {
        // Create a user and authenticate
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        // Send a request without required fields
        $response = $this->postJson('/api/v1/match/simpleupload', []);

        // Assert that the response is a 422 (Unprocessable Entity)
        $response->assertStatus(422);

        // Assert that the response is JSON and has the expected structure
        $response->assertJson([
            'message' => 'The given data was invalid.',
            'errors' => [
                'matchOwnerName' => [
                    'match owner nameは必ず指定してください。'
                ],
                'matchComment' => [
                    'match commentは必ず指定してください。'
                ],
                'matchDeletePassWord' => [
                    'match delete pass wordは必ず指定してください。'
                ],
                'matchFile' => [
                    'match fileは必ず指定してください。'
                ]
            ]
        ]);
    }
}
