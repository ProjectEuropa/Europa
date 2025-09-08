<?php

namespace Tests\Feature\Api\V1;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\User;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_ユーザー登録でセッション認証()
    {
        // CSRF Cookieを事前取得（Sanctumのstateful認証をシミュレート）
        $csrfResponse = $this->withHeaders([
            'Origin' => 'http://localhost:3000',
            'Referer' => 'http://localhost:3000',
        ])->get('/sanctum/csrf-cookie');
        $csrfResponse->assertStatus(204);
        
        $response = $this->withHeaders([
            'Accept' => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
            'Origin' => 'http://localhost:3000',
            'Referer' => 'http://localhost:3000',
        ])->postJson('/api/v1/register', [
            'name' => 'テストユーザー',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['message', 'user'])
            ->assertJsonMissing(['token']); // tokenは返されない（Cookie認証）

        // ユーザーが認証されていることを確認
        $user = User::where('email', 'test@example.com')->first();
        $this->assertAuthenticatedAs($user);
        $this->assertNotNull($user);
    }

    public function test_ユーザーログインでセッション認証()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);

        // CSRF Cookieを事前取得（Sanctumのstateful認証をシミュレート）
        $csrfResponse = $this->withHeaders([
            'Origin' => 'http://localhost:3000',
            'Referer' => 'http://localhost:3000',
        ])->get('/sanctum/csrf-cookie');
        $csrfResponse->assertStatus(204);

        $response = $this->withHeaders([
            'Accept' => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
            'Origin' => 'http://localhost:3000',
            'Referer' => 'http://localhost:3000',
        ])->postJson('/api/v1/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['message', 'user'])
            ->assertJsonMissing(['token']); // tokenは返されない（Cookie認証）

        // セッションに認証情報が保存されていることを確認
        $this->assertAuthenticatedAs($user);
    }

    public function test_CSRFヘッダー付きログインでセッション認証()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);

        // CSRF Cookieを事前取得（Sanctumのstateful認証をシミュレート）
        $csrfResponse = $this->withHeaders([
            'Origin' => 'http://localhost:3000',
            'Referer' => 'http://localhost:3000',
        ])->get('/sanctum/csrf-cookie');
        $csrfResponse->assertStatus(204);

        // CSRF保護されたリクエスト
        $response = $this->withHeaders([
            'X-Requested-With' => 'XMLHttpRequest',
            'Accept' => 'application/json',
            'Origin' => 'http://localhost:3000',
            'Referer' => 'http://localhost:3000',
        ])->postJson('/api/v1/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'ログイン成功',
            ])
            ->assertJsonStructure(['message', 'user'])
            ->assertJsonMissing(['token']); // tokenは返されない（Cookie認証）

        // セッションに認証情報が保存されていることを確認
        $this->assertAuthenticatedAs($user);
    }

    public function test_CSRF保護された登録でセッション認証()
    {
        // CSRF Cookieを事前取得
        $csrfResponse = $this->get('/sanctum/csrf-cookie');
        $csrfResponse->assertStatus(204);

        // CSRF保護されたリクエスト
        $response = $this->withSession([])
            ->withMiddleware()
            ->withHeaders([
                'X-Requested-With' => 'XMLHttpRequest',
                'Accept' => 'application/json',
            ])->postJson('/api/v1/register', [
                'name' => 'テストユーザー',
                'email' => 'test@example.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['message', 'user'])
            ->assertJsonMissing(['token']); // tokenは返されない（Cookie認証）

        // データベースにユーザーが作成されていることを確認
        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'name' => 'テストユーザー',
        ]);

        // セッションに認証情報が保存されていることを確認
        $user = User::where('email', 'test@example.com')->first();
        $this->assertAuthenticatedAs($user);
    }

    public function test_ログアウトでセッション無効化()
    {
        $user = User::factory()->create();
        
        // Cookie認証でログイン（Sanctumのstateful認証をシミュレート）
        $this->actingAs($user, 'web');
        
        // CSRF Cookieを事前取得
        $csrfResponse = $this->withHeaders([
            'Origin' => 'http://localhost:3000',
            'Referer' => 'http://localhost:3000',
        ])->get('/sanctum/csrf-cookie');
        $csrfResponse->assertStatus(204);
        
        $response = $this->withHeaders([
            'Accept' => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
            'Origin' => 'http://localhost:3000',
            'Referer' => 'http://localhost:3000',
        ])->post('/api/v1/logout');

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'ログアウトしました'
            ]);

        // セッションが無効化されていることを確認
        $this->assertGuest('web');
    }

    public function test_ログアウトには認証が必要()
    {
        $response = $this->postJson('/api/v1/logout');

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
        // Sanctum標準のCSRFエンドポイントをテスト（statefulドメインからのリクエストをシミュレート）
        $response = $this->withHeaders([
            'Origin' => 'http://localhost:3000',
            'Referer' => 'http://localhost:3000',
        ])->get('/sanctum/csrf-cookie');

        // Sanctumは204 No Contentレスポンスを返す
        $response->assertStatus(204);
        
        // XSRF-TOKENクッキーが設定されているか確認
        $response->assertCookie('XSRF-TOKEN');
    }
}
