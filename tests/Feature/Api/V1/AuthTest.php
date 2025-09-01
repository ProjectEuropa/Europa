<?php

namespace Tests\Feature\Api\V1;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\User;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_ユーザー登録でトークンを受け取れる()
    {
        $response = $this->postJson('/api/v1/register', [
            'name' => 'テストユーザー',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['message', 'token', 'user']);
    }

    public function test_ユーザーログインでトークンを受け取れる()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/v1/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['message', 'token', 'user']);
    }

    public function test_SPAログインで空トークンとセッション作成()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);

        // CSRF Cookieを取得
        $this->get('/api/v1/csrf-cookie');

        $response = $this->withHeaders([
            'X-Requested-With' => 'XMLHttpRequest',
            'Accept' => 'application/json',
        ])->postJson('/api/v1/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'ログイン成功',
                'token' => '', // SPA認証では空のtoken
            ])
            ->assertJsonStructure(['message', 'token', 'user']);

        // セッションに認証情報が保存されていることを確認
        $this->assertAuthenticatedAs($user);
    }

    public function test_SPA登録で空トークンとセッション作成()
    {
        // CSRF Cookieを取得
        $this->get('/api/v1/csrf-cookie');

        $response = $this->withHeaders([
            'X-Requested-With' => 'XMLHttpRequest',
            'Accept' => 'application/json',
        ])->postJson('/api/v1/register', [
            'name' => 'テストユーザー',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'token' => '', // SPA認証では空のtoken
            ])
            ->assertJsonStructure(['message', 'token', 'user']);

        // データベースにユーザーが作成されていることを確認
        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'name' => 'テストユーザー',
        ]);

        // セッションに認証情報が保存されていることを確認
        $user = User::where('email', 'test@example.com')->first();
        $this->assertAuthenticatedAs($user);
    }

    public function test_非SPAリクエストでトークンを返す()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);

        // 通常のAPIリクエスト（X-Requested-Withヘッダーなし）
        $response = $this->postJson('/api/v1/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['message', 'token', 'user']);

        // tokenが空でないことを確認
        $responseData = $response->json();
        $this->assertNotEmpty($responseData['token']);
        $this->assertNotEquals('', $responseData['token']);
    }

    public function test_SPAログアウトでセッション無効化()
    {
        $user = User::factory()->create();
        
        // SPA認証でログイン
        $this->actingAs($user);
        
        $response = $this->withHeaders([
            'X-Requested-With' => 'XMLHttpRequest',
            'Accept' => 'application/json',
        ])->post('/api/v1/auth/logout');

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'ログアウトしました'
            ]);

        // セッションが無効化されていることを確認
        $this->assertGuest();
    }

    public function test_トークンログアウトでトークン無効化()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
            'Accept' => 'application/json',
        ])->post('/api/v1/auth/logout');

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'ログアウトしました'
            ]);

        // トークンが無効化されていることを確認
        $this->assertEquals(0, $user->tokens()->count());
    }

    public function test_ログアウトには認証が必要()
    {
        $response = $this->postJson('/api/v1/auth/logout');

        $response->assertStatus(401);
    }

    public function test_無効な認証情報でログイン失敗()
    {
        $response = $this->postJson('/api/v1/login', [
            'email' => 'nonexistent@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'error' => 'メールアドレスまたはパスワードが正しくありません。'
            ]);
    }

    public function test_ログイン必須フィールドのバリデーション()
    {
        $response = $this->postJson('/api/v1/login', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_登録必須フィールドのバリデーション()
    {
        $response = $this->postJson('/api/v1/register', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    public function test_パスワード確認のバリデーション()
    {
        $response = $this->postJson('/api/v1/register', [
            'name' => 'テストユーザー',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'differentpassword',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    public function test_CSRFクッキーエンドポイントの動作()
    {
        $response = $this->get('/api/v1/csrf-cookie');

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'CSRF cookie set'
            ]);
    }
}
