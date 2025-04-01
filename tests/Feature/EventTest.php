<?php

namespace Tests\Feature;

use App\Event;
use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class EventTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_イベント取得()
    {
        Event::factory()->create();
        // チーム
        $response = $this->json('GET', '/api/event');
        $json = (json_decode($response->getContent()));

        $this->assertObjectHasProperty('event_name', $json->data[0]);
        $this->assertObjectHasProperty('event_details', $json->data[0]);
        $this->assertObjectHasProperty('event_closing_day', $json->data[0]);
        $this->assertObjectHasProperty('event_reference_url', $json->data[0]);
    }

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_マイページイベント取得()
    {
        $token = Str::random(80);

        $user = User::factory()->create([
            'api_token' => hash('sha256', $token),
        ]);

        Event::factory()->create(
            [
                'register_user_id' => $user->id,
            ]
        );



        // チーム
        $response = $this->actingAs($user)->json('GET', "/api/mypage/events?api_token={$token}");
        $json = (json_decode($response->getContent()));

        $this->assertObjectHasProperty('event_name', $json->data[0]);
        $this->assertObjectHasProperty('event_details', $json->data[0]);
        $this->assertObjectHasProperty('event_closing_day', $json->data[0]);
        $this->assertObjectHasProperty('event_reference_url', $json->data[0]);
    }

}
