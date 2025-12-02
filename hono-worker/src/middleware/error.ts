import { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { ErrorResponse } from '../types/api';

/**
 * グローバルエラーハンドリングミドルウェア
 */
export async function errorHandler(c: Context, next: Next) {
    try {
        await next();
    } catch (error) {
        console.error('Error:', error);

        if (error instanceof HTTPException) {
            const response: ErrorResponse = {
                error: {
                    message: error.message,
                    code: `HTTP_${error.status}`,
                },
            };
            return c.json(response, error.status);
        }

        if (error instanceof Error) {
            const response: ErrorResponse = {
                error: {
                    message: error.message || 'Internal server error',
                },
            };
            return c.json(response, 500);
        }

        const response: ErrorResponse = {
            error: {
                message: 'Unknown error occurred',
            },
        };
        return c.json(response, 500);
    }
}

/**
 * 404エラーハンドラー
 */
export function notFoundHandler(c: Context) {
    const response: ErrorResponse = {
        error: {
            message: 'Not found',
            code: 'NOT_FOUND',
        },
    };
    return c.json(response, 404);
}
