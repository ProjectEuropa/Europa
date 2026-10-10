import { neon } from '@neondatabase/serverless';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { authMiddleware } from '../middleware/auth';
import type { SuccessResponse, User } from '../types/api';
import type { Env } from '../types/bindings';
import { createCookieHeader, createLogoutCookieHeader, generateToken } from '../utils/jwt';
import { hashPassword, verifyPassword } from '../utils/password';
import {
    type LoginInput,
    loginSchema,
    type RegisterInput,
    registerSchema,
    resendOtpSchema,
    verifyOtpSchema,
} from '../utils/validation';
import {
    generateOtpCode,
    generateSessionToken,
    hashOtpCode,
    maskEmail,
    OTP_CONFIG,
    verifyOtpCode,
} from '../utils/otp';

const auth = new Hono<{ Bindings: Env }>();

/**
 * POST /api/v2/auth/register
 * ユーザー登録
 */
auth.post('/register', async c => {
    const body = await c.req.json();

    // バリデーション
    const result = registerSchema.safeParse(body);
    if (!result.success) {
        throw new HTTPException(422, {
            message: 'Validation error',
            cause: result.error.issues,
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
auth.post('/login', async c => {
    const body = await c.req.json();

    // バリデーション
    const result = loginSchema.safeParse(body);
    if (!result.success) {
        throw new HTTPException(422, {
            message: 'Validation error',
            cause: result.error.issues,
        });
    }

    const { email, password, remember }: LoginInput = result.data;

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

    // パスワード認証成功: 2段階認証用のワンタイムパスコードを発行
    const otpCode = generateOtpCode();
    const codeHash = await hashOtpCode(otpCode);
    const sessionToken = generateSessionToken();

    const expiresAt = new Date(Date.now() + OTP_CONFIG.EXPIRES_IN_SECONDS * 1000);
    const resendAvailableAt = new Date(Date.now() + OTP_CONFIG.RESEND_COOLDOWN_SECONDS * 1000);

    // 既存のOTPレコードを削除し、新規登録
    await sql`DELETE FROM login_otps WHERE user_id = ${user.id}`;
    await sql`
        INSERT INTO login_otps (
            user_id,
            code_hash,
            session_token,
            expires_at,
            resend_available_at
        )
        VALUES (
            ${user.id},
            ${codeHash},
            ${sessionToken},
            ${expiresAt.toISOString()},
            ${resendAvailableAt.toISOString()}
        )
    `;

    // メール送信（Resend）
    if (c.env.RESEND_API_KEY) {
        const { sendEmail, generateOtpEmail } = await import('../utils/email');
        const { html, text } = generateOtpEmail(otpCode, user.email, Math.round(OTP_CONFIG.EXPIRES_IN_SECONDS / 60));
        const fromEmail = c.env.RESEND_FROM_EMAIL || 'noreply@project-europa.work';

        const emailResult = await sendEmail(
            {
                to: user.email,
                subject: '【Europa】ログイン認証コード',
                html,
                text,
            },
            c.env.RESEND_API_KEY,
            fromEmail
        );

        if (!emailResult.success) {
            console.error('[Auth] Failed to send OTP email:', emailResult.error);
        }
    }

    // 開発環境の場合はコンソールにもコードを出力（テスト容易化）
    if (c.env.ENVIRONMENT === 'development' || !c.env.RESEND_API_KEY) {
        const { logOtpToConsole } = await import('../utils/email');
        logOtpToConsole(user.email, otpCode);
    }

    // 2FAが必要であることをフロントエンドに返却（この時点ではまだJWT Cookieは発行しない）
    return c.json(
        {
            data: {
                requires2FA: true,
                sessionToken,
                maskedEmail: maskEmail(user.email),
                expiresIn: OTP_CONFIG.EXPIRES_IN_SECONDS,
            },
        },
        200
    );
});

/**
 * POST /api/v2/auth/verify-otp
 * 2段階認証コードの検証
 */
auth.post('/verify-otp', async c => {
    const body = await c.req.json().catch(() => ({}));

    // バリデーション
    const result = verifyOtpSchema.safeParse(body);
    if (!result.success) {
        throw new HTTPException(422, {
            message: 'Validation error',
            cause: result.error.issues,
        });
    }

    const { sessionToken, code, remember } = result.data;

    // データベース接続
    const sql = neon(c.env.DATABASE_URL);

    // セッショントークンからOTPおよびユーザー情報を取得
    const records = await sql`
        SELECT 
            lo.id,
            lo.user_id,
            lo.code_hash,
            lo.expires_at,
            lo.attempts,
            u.name,
            u.email,
            u.created_at,
            u.updated_at
        FROM login_otps lo
        JOIN users u ON lo.user_id = u.id
        WHERE lo.session_token = ${sessionToken}
    `;

    if (records.length === 0) {
        throw new HTTPException(401, {
            message: '無効または有効期限切れのセッションです。再度ログインしてください。',
        });
    }

    const record = records[0];

    // 有効期限チェック
    if (new Date(record.expires_at) < new Date()) {
        await sql`DELETE FROM login_otps WHERE id = ${record.id}`;
        throw new HTTPException(401, {
            message: '認証コードの有効期限が切れています。再度コードを発行してください。',
        });
    }

    // 試行回数上限チェック（ブルートフォース攻撃対策）
    if (record.attempts >= OTP_CONFIG.MAX_ATTEMPTS) {
        await sql`DELETE FROM login_otps WHERE id = ${record.id}`;
        throw new HTTPException(401, {
            message: '試行回数の上限を超えました。安全のため最初からログインをやり直してください。',
        });
    }

    // コード照合（E2E環境および開発環境ではテスト用固定コード 000000 を許容）
    const isE2ETestCode =
        (c.env.ENVIRONMENT === 'e2e' || c.env.ENVIRONMENT === 'development') &&
        code === '000000';
    const isValid = isE2ETestCode || (await verifyOtpCode(code, record.code_hash));
    if (!isValid) {
        const nextAttempts = record.attempts + 1;
        await sql`UPDATE login_otps SET attempts = ${nextAttempts} WHERE id = ${record.id}`;

        const remaining = OTP_CONFIG.MAX_ATTEMPTS - nextAttempts;
        if (remaining <= 0) {
            await sql`DELETE FROM login_otps WHERE id = ${record.id}`;
            throw new HTTPException(401, {
                message: '試行回数の上限を超えました。安全のため最初からログインをやり直してください。',
            });
        }

        throw new HTTPException(401, {
            message: `認証コードが正しくありません。残り試行可能回数: ${remaining}回`,
        });
    }

    // 検証成功: OTPレコードを削除
    await sql`DELETE FROM login_otps WHERE id = ${record.id}`;

    // Remember Me: 30日間、通常: 7日間
    const expiresIn = remember ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60;

    // JWTトークンを生成
    const token = await generateToken(record.user_id, record.email, c.env.JWT_SECRET, expiresIn);

    // Cookieを設定
    const cookieHeader = createCookieHeader(
        token,
        expiresIn,
        c.env.ENVIRONMENT === 'production' || c.env.ENVIRONMENT === 'staging',
        c.env.ENVIRONMENT
    );

    const userObj: User = {
        id: record.user_id,
        name: record.name,
        email: record.email,
        created_at: record.created_at,
        updated_at: record.updated_at,
    };

    const response: SuccessResponse<{ user: User }> = {
        data: { user: userObj },
        message: 'ログインに成功しました',
    };

    return c.json(response, 200, {
        'Set-Cookie': cookieHeader,
    });
});

/**
 * POST /api/v2/auth/resend-otp
 * 認証コードの再送信
 */
auth.post('/resend-otp', async c => {
    const body = await c.req.json().catch(() => ({}));

    // バリデーション
    const result = resendOtpSchema.safeParse(body);
    if (!result.success) {
        throw new HTTPException(422, {
            message: 'Validation error',
            cause: result.error.issues,
        });
    }

    const { sessionToken } = result.data;

    // データベース接続
    const sql = neon(c.env.DATABASE_URL);

    // レコード取得
    const records = await sql`
        SELECT 
            lo.id,
            lo.resend_available_at,
            u.email
        FROM login_otps lo
        JOIN users u ON lo.user_id = u.id
        WHERE lo.session_token = ${sessionToken}
    `;

    if (records.length === 0) {
        throw new HTTPException(400, {
            message: '無効または期限切れのセッションです。再度ログインしてください。',
        });
    }

    const record = records[0];
    const now = new Date();
    const resendAvailableAt = new Date(record.resend_available_at);

    // クールダウンチェック（60秒以内の再送防止）
    if (resendAvailableAt > now) {
        const remainingSeconds = Math.ceil((resendAvailableAt.getTime() - now.getTime()) / 1000);
        throw new HTTPException(429, {
            message: `コードの再送信は ${remainingSeconds} 秒後に可能です。`,
        });
    }

    // 新しいOTPコードを生成
    const newOtpCode = generateOtpCode();
    const newCodeHash = await hashOtpCode(newOtpCode);
    const newExpiresAt = new Date(Date.now() + OTP_CONFIG.EXPIRES_IN_SECONDS * 1000);
    const nextResendAt = new Date(Date.now() + OTP_CONFIG.RESEND_COOLDOWN_SECONDS * 1000);

    // DBを更新（attemptsもリセット）
    await sql`
        UPDATE login_otps
        SET 
            code_hash = ${newCodeHash},
            expires_at = ${newExpiresAt.toISOString()},
            resend_available_at = ${nextResendAt.toISOString()},
            attempts = 0
        WHERE id = ${record.id}
    `;

    // メール送信
    if (c.env.RESEND_API_KEY) {
        const { sendEmail, generateOtpEmail } = await import('../utils/email');
        const { html, text } = generateOtpEmail(newOtpCode, record.email, Math.round(OTP_CONFIG.EXPIRES_IN_SECONDS / 60));
        const fromEmail = c.env.RESEND_FROM_EMAIL || 'noreply@project-europa.work';

        await sendEmail(
            {
                to: record.email,
                subject: '【Europa】ログイン認証コード（再送）',
                html,
                text,
            },
            c.env.RESEND_API_KEY,
            fromEmail
        );
    }

    if (c.env.ENVIRONMENT === 'development' || !c.env.RESEND_API_KEY) {
        const { logOtpToConsole } = await import('../utils/email');
        logOtpToConsole(record.email, newOtpCode);
    }

    return c.json(
        {
            message: '認証コードを再送信しました',
            data: {
                expiresIn: OTP_CONFIG.EXPIRES_IN_SECONDS,
            },
        },
        200
    );
});

/**
 * POST /api/v2/auth/logout
 * ログアウト
 */
auth.post('/logout', authMiddleware, async c => {
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
auth.get('/me', authMiddleware, async c => {
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
auth.put('/me', authMiddleware, async c => {
    const jwtPayload = c.get('user');
    const body = await c.req.json();

    // バリデーション
    const { userUpdateSchema } = await import('../utils/validation');
    const result = userUpdateSchema.safeParse(body);
    if (!result.success) {
        throw new HTTPException(422, {
            message: 'Validation error',
            cause: result.error.issues,
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
auth.post('/password/reset', async c => {
    const body = await c.req.json().catch(() => ({}));

    // バリデーション
    const { passwordResetRequestSchema } = await import('../utils/validation');
    const result = passwordResetRequestSchema.safeParse(body);
    if (!result.success) {
        throw new HTTPException(422, {
            message: 'Validation error',
            cause: result.error,
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
    return c.json(
        {
            message: 'パスワードリセットのメールを送信しました',
        },
        200
    );
});

/**
 * POST /api/v2/auth/password/update
 * パスワードリセット実行
 */
auth.post('/password/update', async c => {
    const body = await c.req.json().catch(() => ({}));

    // バリデーション
    const { passwordResetUpdateSchema } = await import('../utils/validation');
    const result = passwordResetUpdateSchema.safeParse(body);
    if (!result.success) {
        throw new HTTPException(422, {
            message: 'Validation error',
            cause: result.error,
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
            cause: { code: 'INVALID_TOKEN' },
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
            cause: { code: 'TOKEN_EXPIRED' },
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

    return c.json(
        {
            message: 'パスワードを更新しました',
        },
        200
    );
});

/**
 * POST /api/v2/auth/password/check
 * パスワードリセットトークンの検証
 */
auth.post('/password/check', async c => {
    const body = await c.req.json().catch(() => ({}));

    // バリデーション
    const { passwordResetCheckSchema } = await import('../utils/validation');
    const result = passwordResetCheckSchema.safeParse(body);
    if (!result.success) {
        throw new HTTPException(422, {
            message: 'Validation error',
            cause: result.error,
        });
    }

    const { token } = result.data;

    // データベース接続
    const sql = neon(c.env.DATABASE_URL);

    // トークンの検証
    const resets = await sql`
        SELECT email, created_at FROM password_resets WHERE token = ${token}
    `;

    if (resets.length === 0) {
        throw new HTTPException(400, {
            message: '無効なトークンまたは有効期限切れです',
            cause: { code: 'INVALID_TOKEN' },
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
            cause: { code: 'TOKEN_EXPIRED' },
        });
    }

    return c.json(
        {
            valid: true,
            email: reset.email,
        },
        200
    );
});

export default auth;
