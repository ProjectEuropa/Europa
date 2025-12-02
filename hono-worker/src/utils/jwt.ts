import { sign, verify } from 'hono/jwt';
import type { JWTPayload } from '../types/api';

const JWT_ALGORITHM = 'HS256';

/**
 * JWTトークンを生成
 */
export async function generateToken(
    userId: number,
    email: string,
    secret: string,
    expiresIn: number = 7 * 24 * 60 * 60 // 7日間（秒）
): Promise<string> {
    const now = Math.floor(Date.now() / 1000);

    const payload: JWTPayload = {
        userId,
        email,
        iat: now,
        exp: now + expiresIn,
    };

    return await sign(payload, secret, JWT_ALGORITHM);
}

/**
 * JWTトークンを検証
 */
export async function verifyToken(
    token: string,
    secret: string
): Promise<JWTPayload | null> {
    try {
        const payload = await verify(token, secret, JWT_ALGORITHM);
        return payload as JWTPayload;
    } catch (error) {
        return null;
    }
}

/**
 * Cookieからトークンを取得
 */
export function getTokenFromCookie(cookieHeader: string | null): string | null {
    if (!cookieHeader) return null;

    const cookies = cookieHeader.split(';').map(c => c.trim());
    const tokenCookie = cookies.find(c => c.startsWith('token='));

    if (!tokenCookie) return null;

    return tokenCookie.split('=')[1];
}

/**
 * Set-Cookie ヘッダーを生成
 */
export function createCookieHeader(
    token: string,
    maxAge: number = 7 * 24 * 60 * 60, // 7日間（秒）
    secure: boolean = true,
    environment: string = 'production'
): string {
    const cookieOptions = [
        `token=${token}`,
        `Max-Age=${maxAge}`,
        'Path=/',
        'HttpOnly',
    ];

    // Cross-Origin Cookie対応
    // 本番・ステージング環境：SameSite=None; Secure（HTTPSフロントエンド用）
    // 開発環境：SameSite=Lax（HTTPローカル開発用）
    if (environment === 'production' || environment === 'staging') {
        // HTTPSフロントエンドからのCross-Originリクエストに対応
        cookieOptions.push('SameSite=None');
        if (secure) {
            cookieOptions.push('Secure');
        }
    } else {
        // 開発環境ではLax（Same-Origin前提）
        cookieOptions.push('SameSite=Lax');
    }

    return cookieOptions.join('; ');
}

/**
 * ログアウト用のCookieヘッダーを生成
 */
export function createLogoutCookieHeader(): string {
    return createCookieHeader('', 0);
}
