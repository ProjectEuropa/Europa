import { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { Env } from '../types/bindings';
import type { JWTPayload } from '../types/api';
import { getTokenFromCookie, verifyToken } from '../utils/jwt';

// Context に user プロパティを追加
declare module 'hono' {
    interface ContextVariableMap {
        user: JWTPayload;
    }
}

/**
 * JWT認証ミドルウェア
 * 
 * Cookieからトークンを取得し、検証します。
 * 検証に成功した場合、c.get('user')でユーザー情報にアクセスできます。
 */
export async function authMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
    const cookieHeader = c.req.header('Cookie');
    const token = getTokenFromCookie(cookieHeader);

    if (!token) {
        throw new HTTPException(401, { message: 'Unauthorized: No token provided' });
    }

    const jwtSecret = c.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new HTTPException(500, { message: 'JWT_SECRET not configured' });
    }

    const payload = await verifyToken(token, jwtSecret);

    if (!payload) {
        throw new HTTPException(401, { message: 'Unauthorized: Invalid token' });
    }

    // トークンの有効期限チェック
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
        throw new HTTPException(401, { message: 'Unauthorized: Token expired' });
    }

    // ユーザー情報をコンテキストに保存
    c.set('user', payload);

    await next();
}

/**
 * オプショナル認証ミドルウェア
 * 
 * トークンがあれば検証しますが、なくてもエラーにしません。
 */
export async function optionalAuthMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
    const cookieHeader = c.req.header('Cookie');
    const token = getTokenFromCookie(cookieHeader);

    if (token) {
        const jwtSecret = c.env.JWT_SECRET;
        if (jwtSecret) {
            const payload = await verifyToken(token, jwtSecret);
            if (payload) {
                const now = Math.floor(Date.now() / 1000);
                if (payload.exp >= now) {
                    c.set('user', payload);
                }
            }
        }
    }

    await next();
}
