import { Hono } from 'hono';
import { describe, expect, it } from 'vitest';
import type { Env } from '../types/bindings';
import { setupBasicAuth } from './basic-auth';

function createTestApp() {
    const app = new Hono<{ Bindings: Env }>();
    app.use('*', setupBasicAuth());
    app.get('/api/v2/files', c => c.json({ ok: true }));
    app.get('/health', c => c.json({ status: 'ok' }));
    app.post('/api/v2/discord', c => c.json({ type: 1 }));
    return app;
}

const baseStagingEnv = {
    ENVIRONMENT: 'staging',
    BASIC_AUTH_USER: 'stg-user',
    BASIC_AUTH_PASSWORD: 'stg-password',
} as unknown as Env;

describe('setupBasicAuth', () => {
    it('staging環境で認証ヘッダーがない場合は401とWWW-Authenticateヘッダーを返す', async () => {
        const app = createTestApp();
        const res = await app.request('/api/v2/files', { method: 'GET' }, baseStagingEnv);

        expect(res.status).toBe(401);
        expect(res.headers.get('WWW-Authenticate')).toBe('Basic realm="Staging API"');
        expect(await res.json()).toEqual({
            error: {
                message: '[BasicAuthMiddleware] Unauthorized: Basic authentication required',
                code: 'HTTP_401',
            },
        });
    });

    it('staging環境で正しいBasic認証ヘッダーがある場合はリクエストを通す', async () => {
        const app = createTestApp();
        const credentials = btoa('stg-user:stg-password');
        const res = await app.request(
            '/api/v2/files',
            {
                method: 'GET',
                headers: {
                    Authorization: `Basic ${credentials}`,
                },
            },
            baseStagingEnv
        );

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ ok: true });
    });

    it('staging環境で誤ったBasic認証ヘッダーの場合は401を返す', async () => {
        const app = createTestApp();
        const credentials = btoa('stg-user:wrong-password');
        const res = await app.request(
            '/api/v2/files',
            {
                method: 'GET',
                headers: {
                    Authorization: `Basic ${credentials}`,
                },
            },
            baseStagingEnv
        );

        expect(res.status).toBe(401);
    });

    it('production環境やe2e環境ではBasic認証をスキップする', async () => {
        const app = createTestApp();
        const prodEnv = {
            ...baseStagingEnv,
            ENVIRONMENT: 'production',
        } as unknown as Env;

        const res = await app.request('/api/v2/files', { method: 'GET' }, prodEnv);
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ ok: true });
    });

    it('staging環境でも認証情報が未設定の場合はスキップする', async () => {
        const app = createTestApp();
        const envWithoutSecrets = {
            ENVIRONMENT: 'staging',
        } as unknown as Env;

        const res = await app.request('/api/v2/files', { method: 'GET' }, envWithoutSecrets);
        expect(res.status).toBe(200);
    });

    it('/health と /api/v2/discord と OPTIONS リクエストはBasic認証をバイパスする', async () => {
        const app = createTestApp();

        const healthRes = await app.request('/health', { method: 'GET' }, baseStagingEnv);
        expect(healthRes.status).toBe(200);

        const discordRes = await app.request(
            '/api/v2/discord',
            { method: 'POST' },
            baseStagingEnv
        );
        expect(discordRes.status).toBe(200);

        const optionsRes = await app.request(
            '/api/v2/files',
            { method: 'OPTIONS' },
            baseStagingEnv
        );
        expect(optionsRes.status).not.toBe(401);
    });
});
