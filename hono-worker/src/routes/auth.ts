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
            cause: result.error.errors
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
    const cookieHeader = createCookieHeader(token, 7 * 24 * 60 * 60, c.env.ENVIRONMENT === 'production');

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
            cause: result.error.errors
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
    const cookieHeader = createCookieHeader(token, 7 * 24 * 60 * 60, c.env.ENVIRONMENT === 'production');

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

export default auth;
