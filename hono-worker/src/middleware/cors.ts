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
                    'http://localhost:3002', // フロントエンド開発サーバー（HTTP）
                    'https://localhost:3002', // フロントエンド開発サーバー（HTTPS）
                    c.env.FRONTEND_URL,
                ].filter(Boolean) as string[];

                // 直接URLアクセス（Originなし）を許可
                if (!origin) {
                    return true;
                }

                return allowedOrigins.includes(origin) ? origin : false;
            },
            credentials: true,
            allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
            exposeHeaders: ['Set-Cookie', 'Content-Disposition'],
            maxAge: 86400, // 24時間
        });

        return middleware(c, next);
    };
}
