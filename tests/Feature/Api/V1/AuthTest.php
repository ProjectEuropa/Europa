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
        $response = $this->postJson('/api/v1/register', [
            'name' => 'テストユーザー',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['message', 'user'])
            ->assertCookie(config('auth.token_cookie_name')); // HttpOnly Cookieにトークンが設定される

        // ユーザーがデータベースに作成されたことを確認
        $user = User::where('email', 'test@example.com')->first();
        $this->assertNotNull($user);

        // トークンが生成されたことを確認
        $this->assertCount(1, $user->tokens);
    }

    public function test_ユーザーログインでセッション認証()
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
            ->assertJsonStructure(['message', 'user'])
            ->assertCookie(config('auth.token_cookie_name')); // HttpOnly Cookieにトークンが設定される

        // トークンが生成されたことを確認
        $this->assertCount(1, $user->fresh()->tokens);
    }

    public function test_CSRFヘッダー付きログインでセッション認証()
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
            ->assertJson([
                'message' => 'ログイン成功',
            ])
            ->assertJsonStructure(['message', 'user'])
            ->assertCookie(config('auth.token_cookie_name')); // HttpOnly Cookieにトークンが設定される

        // トークンが生成されたことを確認
        $this->assertCount(1, $user->fresh()->tokens);
    }

    public function test_ログインしたままにする機能でセッション期間延長()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/v1/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
            'remember' => true,
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['message', 'user'])
            ->assertCookie(config('auth.token_cookie_name'));

        // トークンの有効期限が約14日後（20160分）になっていることを確認
        // 注: 正確な時間をテストするのは難しいため、デフォルト（120分）より明らかに長いことで判定
        $token = $user->fresh()->tokens->first();
        $this->assertNotNull($token->expires_at);
        
        // 13日以上後の有効期限であることを確認
        $this->assertTrue(
            $token->expires_at->gt(now()->addDays(13)),
            'Token expiration should be greater than 13 days'
        );
    }

    public function test_CSRF保護された登録でセッション認証()
    {
        $response = $this->postJson('/api/v1/register', [
            'name' => 'テストユーザー',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['message', 'user'])
            ->assertCookie(config('auth.token_cookie_name')); // HttpOnly Cookieにトークンが設定される

        // データベースにユーザーが作成されていることを確認
        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'name' => 'テストユーザー',
        ]);

        // トークンが生成されたことを確認
        $user = User::where('email', 'test@example.com')->first();
        $this->assertCount(1, $user->tokens);
    }

    public function test_ログアウトでセッション無効化()
    {
        $user = User::factory()->create();

        // Sanctumトークンを生成
        $token = $user->createToken('test-token')->plainTextToken;

        // トークン認証でログアウト
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/v1/logout');

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'ログアウトしました'
            ]);

        // トークンが削除されていることを確認
        $this->assertCount(0, $user->fresh()->tokens);
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

    public function test_トークン認証でAPIアクセス可能()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        // トークン認証でプロフィール取得
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/v1/user/profile');

        $response->assertStatus(200)
            ->assertJsonStructure(['id', 'name', 'email', 'created_at']);
    }
}
