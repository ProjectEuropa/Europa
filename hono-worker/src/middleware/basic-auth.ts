import type { Context, Next } from 'hono';
import { basicAuth } from 'hono/basic-auth';
import { HTTPException } from 'hono/http-exception';
import type { Env } from '../types/bindings';
import { createHttpErrorResponse } from './error';

const BYPASS_PATHS = ['/health', '/api/v2/discord'];

function isBypassPath(path: string): boolean {
    return BYPASS_PATHS.some(
        bypassPath => path === bypassPath || path.startsWith(`${bypassPath}/`)
    );
}

/**
 * STG環境用 Basic認証ミドルウェア
 *
 * ENVIRONMENT === 'staging' かつ BASIC_AUTH_USER / BASIC_AUTH_PASSWORD が
 * 設定されている場合のみ Basic 認証を要求します。
 */
export function setupBasicAuth() {
    return async (c: Context<{ Bindings: Env }>, next: Next) => {
        if (c.env?.ENVIRONMENT !== 'staging') {
            return next();
        }

        const username = c.env.BASIC_AUTH_USER;
        const password = c.env.BASIC_AUTH_PASSWORD;

        if (!username || !password) {
            return next();
        }

        if (c.req.method === 'OPTIONS' || isBypassPath(c.req.path)) {
            return next();
        }

        const middleware = basicAuth({
            username,
            password,
            realm: 'Staging API',
        });

        try {
            return await middleware(c, next);
        } catch (error) {
            if (error instanceof HTTPException && error.status === 401) {
                c.header('WWW-Authenticate', 'Basic realm="Staging API"');
                const authError = new HTTPException(401, {
                    message: '[BasicAuthMiddleware] Unauthorized: Basic authentication required',
                });
                return c.json(createHttpErrorResponse(authError), 401);
            }
            throw error;
        }
    };
}
