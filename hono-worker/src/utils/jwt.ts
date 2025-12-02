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
    secure: boolean = true
): string {
    const cookieOptions = [
        `token=${token}`,
        `Max-Age=${maxAge}`,
        'Path=/',
        'HttpOnly',
        'SameSite=Strict',
    ];

    if (secure) {
        cookieOptions.push('Secure');
    }

    return cookieOptions.join('; ');
}

/**
 * ログアウト用のCookieヘッダーを生成
 */
export function createLogoutCookieHeader(): string {
    return createCookieHeader('', 0);
}
