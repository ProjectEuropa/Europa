import { Context, Next } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from '../types/bindings';

/**
 * CORS設定ミドルウェア
 */
export function setupCORS() {
    return async (c: Context<{ Bindings: Env }>, next: Next) => {
        const middleware = cors({
            origin: (origin) => {
                // 開発環境とフロントエンドURLを許可
                const allowedOrigins = [
                    'http://localhost:3000',
                    'http://localhost:3001',
                    c.env.FRONTEND_URL,
                ].filter(Boolean) as string[];

                return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
            },
            credentials: true,
            allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowHeaders: ['Content-Type', 'Authorization'],
            exposeHeaders: ['Set-Cookie'],
            maxAge: 86400, // 24時間
        });

        return middleware(c, next);
    };
}
