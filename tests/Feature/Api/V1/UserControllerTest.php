<?php

namespace Tests\Feature\Api\V1;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\User;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function can_get_authenticated_user_profile()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $response = $this->getJson('/api/v1/user/profile');

        $response->assertStatus(200)
            ->assertJson([
                'id' => $user->id,
                'email' => $user->email,
            ]);
    }

    /** @test */
    public function can_update_user_name()
    {
        $user = User::factory()->create(['name' => 'OldName']);
        $this->actingAs($user, 'sanctum');

        $response = $this->putJson('/api/v1/user/update', [
            'name' => 'NewName'
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'ユーザー名を更新しました。',
                'user' => [
                    'id' => $user->id,
                    'name' => 'NewName'
                ]
            ]);
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'NewName'
        ]);
    }

    /** @test */
    public function update_user_name_requires_name()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $response = $this->putJson('/api/v1/user/update', []);

        $response->assertStatus(422); // validation error
    }
}
