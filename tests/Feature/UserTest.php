<?php

namespace Tests\Feature;

use App\Event;
use App\File;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Str;
use Tests\TestCase;

class UserTest extends TestCase
{

    use DatabaseTransactions;

    /**
     *
     * @return void
     */
    public function test_ユーザー更新テスト()
    {
        $token = Str::random(80);

        $user = factory(User::class)->create([
            'name' => 'もっっっっm',
            'api_token' => hash('sha256', $token),
        ]);

        $response = $this
            ->actingAs($user)
            ->withHeaders(
                [
                    'Authorization' => "Bearer ${token}",
                ]
            )
            ->post('/api/userUpdate',
                [
                    'name' => 'ふが',
                ]
            );
        $this->assertDatabaseMissing('users', [
            'name' => 'もっっっっm',
        ]);
    }

    /**
     *
     *
     * @return void
     */
    public function test_マイページイベント削除()
    {
        $token = Str::random(80);

        $user = factory(User::class)->create([
            'api_token' => hash('sha256', $token),
        ]);

        $event = factory(Event::class)->create(
            [
                'event_name' => 'あああああ',
                'event_details' => 'いいいい',
                'event_reference_url' => 'https://afals',
                'register_user_id' => $user->id,
            ]
        );

        $response = $this
            ->actingAs($user)
            ->withHeaders(
                [
                    'Authorization' => "Bearer ${token}",
                ]
            )
            ->post('/api/delete/usersRegisteredCloumn',
                [
                    'id' => $event->id,
                    'fileType' => 'event',
                ]
            );
        $this->assertDatabaseMissing('events', [
            'event_name' => 'あああああ',
            'event_details' => 'いいいい',
            'event_reference_url' => 'https://afals',
        ]);
    }

    /**
     *
     *
     * @return void
     */
    public function test_マイページファイル削除()
    {
        $token = Str::random(80);

        $user = factory(User::class)->create([
            'api_token' => hash('sha256', $token),
        ]);

        $file = factory(File::class)->create(
            [
                'upload_user_id' => $user->id,
            ]
        );

        $response = $this
            ->actingAs($user)
            ->withHeaders(
                [
                    'Authorization' => "Bearer ${token}",
                ]
            )
            ->post('/api/delete/usersRegisteredCloumn',
                [
                    'id' => $file->id,
                    'fileType' => 'team',
                ]
            );
        $this->assertDatabaseMissing('files', [
            'upload_owner_name' => $file->upload_owner_name,
            'file_name' => $file->file_name,
            'file_comment' => $file->file_comment,
        ]);
    }
}
