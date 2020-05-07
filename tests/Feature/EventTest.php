<?php

namespace Tests\Feature;

use App\Event;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Str;
use Tests\TestCase;

class EventTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_イベント取得()
    {
        factory(Event::class, 30)->create();
        // チーム
        $response = $this->json('GET', '/api/event');
        $json = (json_decode($response->getContent()));

        $this->assertObjectHasAttribute('event_name', $json->data[0]);
        $this->assertObjectHasAttribute('event_details', $json->data[0]);
        $this->assertObjectHasAttribute('event_closing_day', $json->data[0]);
        $this->assertObjectHasAttribute('event_reference_url', $json->data[0]);
    }

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_マイページイベント取得()
    {
        $token = Str::random(80);

        $user = factory(User::class)->create([
            'api_token' => hash('sha256', $token),
        ]);

        factory(Event::class, 30)->create(
            [
                'register_user_id' => $user->id,
            ]
        );

        // チーム
        $response = $this->actingAs($user)->json('GET', "/api/mypage/events?api_token={$token}");
        $json = (json_decode($response->getContent()));

        $this->assertObjectHasAttribute('event_name', $json->data[0]);
        $this->assertObjectHasAttribute('event_details', $json->data[0]);
        $this->assertObjectHasAttribute('event_closing_day', $json->data[0]);
        $this->assertObjectHasAttribute('event_reference_url', $json->data[0]);
    }

}
