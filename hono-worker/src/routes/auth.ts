import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { neon } from '@neondatabase/serverless';
import type { Env } from '../types/bindings';
import type { User, SuccessResponse } from '../types/api';
import { registerSchema, loginSchema, type RegisterInput, type LoginInput } from '../utils/validation';
import { hashPassword, verifyPassword } from '../utils/password';
import { generateToken, createCookieHeader, createLogoutCookieHeader } from '../utils/jwt';
import { authMiddleware } from '../middleware/auth';

const auth = new Hono<{ Bindings: Env }>();

/**
 * POST /api/v2/auth/register
 * ユーザー登録
 */
auth.post('/register', async (c) => {
    const body = await c.req.json();

    // バリデーション
    const result = registerSchema.safeParse(body);
    if (!result.success) {
        throw new HTTPException(400, {
            message: 'Validation error',
            cause: result.error.issues
        });
    }

    const { name, email, password }: RegisterInput = result.data;

    // データベース接続
    const sql = neon(c.env.DATABASE_URL);

    // メールアドレスの重複チェック
    const existingUsers = await sql`
    SELECT id FROM users WHERE email = ${email}
  `;

    if (existingUsers.length > 0) {
        throw new HTTPException(409, { message: 'Email already exists' });
    }

    // パスワードをハッシュ化
    const hashedPassword = await hashPassword(password);

    // ユーザーを作成
    const users = await sql`
    INSERT INTO users (name, email, password, created_at, updated_at)
    VALUES (${name}, ${email}, ${hashedPassword}, NOW(), NOW())
    RETURNING id, name, email, created_at, updated_at
  `;

    const user = users[0] as User;

    // JWTトークンを生成
    const token = await generateToken(user.id, user.email, c.env.JWT_SECRET);

    // Cookieを設定
    // Cookieを設定（Cross-Origin対応）
    const cookieHeader = createCookieHeader(
        token,
        7 * 24 * 60 * 60,
        c.env.ENVIRONMENT === 'production' || c.env.ENVIRONMENT === 'staging',
        c.env.ENVIRONMENT
    );

    const response: SuccessResponse<{ user: User }> = {
        data: { user },
    };

    return c.json(response, 201, {
        'Set-Cookie': cookieHeader,
    });
});

/**
 * POST /api/v2/auth/login
 * ログイン
 */
auth.post('/login', async (c) => {
    const body = await c.req.json();

    // バリデーション
    const result = loginSchema.safeParse(body);
    if (!result.success) {
        throw new HTTPException(400, {
            message: 'Validation error',
            cause: result.error.issues
        });
    }

    const { email, password }: LoginInput = result.data;

    // データベース接続
    const sql = neon(c.env.DATABASE_URL);

    // ユーザーを検索
    const users = await sql`
    SELECT id, name, email, password, created_at, updated_at
    FROM users
    WHERE email = ${email}
  `;

    if (users.length === 0) {
        throw new HTTPException(401, { message: 'Invalid credentials' });
    }

    const user = users[0] as User & { password: string };

    // パスワードを検証
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
        throw new HTTPException(401, { message: 'Invalid credentials' });
    }

    // JWTトークンを生成
    const token = await generateToken(user.id, user.email, c.env.JWT_SECRET);

    // Cookieを設定
    // Cookieを設定（Cross-Origin対応）
    const cookieHeader = createCookieHeader(
        token,
        7 * 24 * 60 * 60,
        c.env.ENVIRONMENT === 'production' || c.env.ENVIRONMENT === 'staging',
        c.env.ENVIRONMENT
    );

    // パスワードを除外
    const { password: _, ...userWithoutPassword } = user;

    const response: SuccessResponse<{ user: Omit<User, 'password'> }> = {
        data: { user: userWithoutPassword },
    };

    return c.json(response, 200, {
        'Set-Cookie': cookieHeader,
    });
});

/**
 * POST /api/v2/auth/logout
 * ログアウト
 */
auth.post('/logout', authMiddleware, async (c) => {
    const cookieHeader = createLogoutCookieHeader();

    const response: SuccessResponse<never> = {
        message: 'Logged out successfully',
    };

    return c.json(response, 200, {
        'Set-Cookie': cookieHeader,
    });
});

/**
 * GET /api/v2/auth/me
 * 現在のユーザー情報を取得
 */
auth.get('/me', authMiddleware, async (c) => {
    const jwtPayload = c.get('user');

    // データベース接続
    const sql = neon(c.env.DATABASE_URL);

    // ユーザー情報を取得
    const users = await sql`
    SELECT id, name, email, created_at, updated_at
    FROM users
    WHERE id = ${jwtPayload.userId}
  `;

    if (users.length === 0) {
        throw new HTTPException(404, { message: 'User not found' });
    }

    const user = users[0] as User;

    const response: SuccessResponse<{ user: User }> = {
        data: { user },
    };

    return c.json(response, 200);
});

/**
 * PUT /api/v2/auth/me
 * ユーザー情報を更新
 */
auth.put('/me', authMiddleware, async (c) => {
    const jwtPayload = c.get('user');
    const body = await c.req.json();

    // バリデーション
    const { userUpdateSchema } = await import('../utils/validation');
    const result = userUpdateSchema.safeParse(body);
    if (!result.success) {
        throw new HTTPException(400, {
            message: 'Validation error',
            cause: result.error.issues
        });
    }

    const { name } = result.data;

    // データベース接続
    const sql = neon(c.env.DATABASE_URL);

    // ユーザー情報を更新
    const users = await sql`
        UPDATE users
        SET name = ${name}, updated_at = NOW()
        WHERE id = ${jwtPayload.userId}
        RETURNING id, name, email, created_at, updated_at
    `;

    if (users.length === 0) {
        throw new HTTPException(404, { message: 'User not found' });
    }

    const user = users[0] as User;

    const response: SuccessResponse<{ user: User }> = {
        data: { user },
    };

    return c.json(response, 200);
});

/**
 * POST /api/v2/auth/password/reset
 * パスワードリセット申請
 */
auth.post('/password/reset', async (c) => {
    const body = await c.req.json().catch(() => ({}));

    // バリデーション
    const { passwordResetRequestSchema } = await import('../utils/validation');
    const result = passwordResetRequestSchema.safeParse(body);
    if (!result.success) {
        throw new HTTPException(400, {
            message: 'Validation error',
            cause: result.error
        });
    }

    const { email } = result.data;

    // データベース接続
    const sql = neon(c.env.DATABASE_URL);

    // メールアドレスの存在確認
    const users = await sql`SELECT id FROM users WHERE email = ${email}`;

    // セキュリティ上、メールアドレスの存在に関わらず同じレスポンスを返す
    if (users.length > 0) {
        // トークン生成
        const { generateResetToken } = await import('../utils/token');
        const token = generateResetToken();

        // password_resetsテーブルに保存（既存レコードがあれば上書き）
        await sql`
            INSERT INTO password_resets (email, token, created_at)
            VALUES (${email}, ${token}, NOW())
            ON CONFLICT (email)
            DO UPDATE SET token = ${token}, created_at = NOW()
        `;

        // メール送信
        const resetUrl = `${c.env.FRONTEND_URL}/reset-password?token=${token}`;
        
        if (c.env.RESEND_API_KEY) {
            // Resendを使用してメール送信
            const { sendEmail, generatePasswordResetEmail } = await import('../utils/email');
            const { html, text } = generatePasswordResetEmail(resetUrl, email);
            
            const fromEmail = c.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
            
            const result = await sendEmail(
                {
                    to: email,
                    subject: 'パスワードリセットのご案内',
                    html,
                    text,
                },
                c.env.RESEND_API_KEY,
                fromEmail
            );

            if (!result.success) {
                console.error('Failed to send password reset email:', result.error);
                // メール送信失敗時もエラーは返さない（セキュリティのため）
            } else {
                console.log('Password reset email sent successfully to:', email);
            }
        } else {
            // 開発環境：コンソールログ
            const { logEmailToConsole } = await import('../utils/email');
            logEmailToConsole(email, 'パスワードリセットのご案内', resetUrl, token);
        }
    }

    // セキュリティ上、常に同じレスポンスを返す
    return c.json({
        message: 'パスワードリセットのメールを送信しました'
    }, 200);
});

/**
 * POST /api/v2/auth/password/update
 * パスワードリセット実行
 */
auth.post('/password/update', async (c) => {
    const body = await c.req.json().catch(() => ({}));

    // バリデーション
    const { passwordResetUpdateSchema } = await import('../utils/validation');
    const result = passwordResetUpdateSchema.safeParse(body);
    if (!result.success) {
        throw new HTTPException(400, {
            message: 'Validation error',
            cause: result.error
        });
    }

    const { token, password } = result.data;

    // データベース接続
    const sql = neon(c.env.DATABASE_URL);

    // トークンの検証
    const resets = await sql`
        SELECT email, created_at FROM password_resets WHERE token = ${token}
    `;

    if (resets.length === 0) {
        throw new HTTPException(400, {
            message: '無効なトークンまたは有効期限切れです',
            cause: { code: 'INVALID_TOKEN' }
        });
    }

    const reset = resets[0];

    // トークンの有効期限チェック（1時間）
    const { isTokenExpired } = await import('../utils/token');
    if (isTokenExpired(new Date(reset.created_at))) {
        // 期限切れトークンを削除
        await sql`DELETE FROM password_resets WHERE token = ${token}`;
        throw new HTTPException(400, {
            message: '無効なトークンまたは有効期限切れです',
            cause: { code: 'TOKEN_EXPIRED' }
        });
    }

    // パスワードをハッシュ化
    const hashedPassword = await hashPassword(password);

    // パスワード更新
    await sql`
        UPDATE users
        SET password = ${hashedPassword}, updated_at = NOW()
        WHERE email = ${reset.email}
    `;

    // トークン削除
    await sql`DELETE FROM password_resets WHERE token = ${token}`;

    return c.json({
        message: 'パスワードを更新しました'
    }, 200);
});

/**
 * POST /api/v2/auth/password/check
 * パスワードリセットトークンの検証
 */
auth.post('/password/check', async (c) => {
    const body = await c.req.json().catch(() => ({}));

    const { token } = body;

    if (!token || typeof token !== 'string') {
        throw new HTTPException(400, {
            message: 'トークンが必要です',
            cause: { code: 'TOKEN_REQUIRED' }
        });
    }

    // データベース接続
    const sql = neon(c.env.DATABASE_URL);

    // トークンの検証
    const resets = await sql`
        SELECT email, created_at FROM password_resets WHERE token = ${token}
    `;

    if (resets.length === 0) {
        throw new HTTPException(400, {
            message: '無効なトークンまたは有効期限切れです',
            cause: { code: 'INVALID_TOKEN' }
        });
    }

    const reset = resets[0];

    // トークンの有効期限チェック（1時間）
    const { isTokenExpired } = await import('../utils/token');
    if (isTokenExpired(new Date(reset.created_at))) {
        // 期限切れトークンを削除
        await sql`DELETE FROM password_resets WHERE token = ${token}`;
        throw new HTTPException(400, {
            message: '無効なトークンまたは有効期限切れです',
            cause: { code: 'TOKEN_EXPIRED' }
        });
    }

    return c.json({
        valid: true,
        email: reset.email
    }, 200);
});

export default auth;

