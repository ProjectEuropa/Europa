import { Hono } from 'hono';
import { logger } from 'hono/logger';
import type { Env } from './types/bindings';
import { setupCORS } from './middleware/cors';
import { notFoundHandler } from './middleware/error';
import { HTTPException } from 'hono/http-exception';
import type { ErrorResponse } from './types/api';
import auth from './routes/auth';
import events from './routes/events';
import files from './routes/files';

const app = new Hono<{ Bindings: Env }>();

// グローバルミドルウェア
app.use('*', logger());
app.use('*', setupCORS());

// グローバルエラーハンドラー (onErrorを使用)
app.onError((error, c) => {
    console.error('[Error Handler] Caught error:', error);

    if (error instanceof HTTPException) {
        console.log('[Error Handler] HTTPException detected');
        console.log('[Error Handler] Status:', error.status);
        console.log('[Error Handler] Message:', error.message);
        
        const response: ErrorResponse = {
            error: {
                message: error.message,
                code: `HTTP_${error.status}`,
            },
        };
        
        console.log('[Error Handler] Sending response:', JSON.stringify(response));
        return c.json(response, error.status);
    }

    if (error instanceof Error) {
        console.error('[Error Handler] Generic Error:', error.message);
        const response: ErrorResponse = {
            error: {
                message: error.message || 'Internal server error',
            },
        };
        return c.json(response, 500);
    }

    console.error('[Error Handler] Unknown error type');
    const response: ErrorResponse = {
        error: {
            message: 'Unknown error occurred',
        },
    };
    return c.json(response, 500);
});

// ヘルスチェック
app.get('/', (c) => {
    return c.json({
        message: 'Hono Worker API',
        version: 'v2',
        status: 'healthy',
    });
});

app.get('/health', (c) => {
    return c.json({ status: 'ok' });
});

// API v2 ルート
const api = new Hono<{ Bindings: Env }>();

api.route('/auth', auth);
api.route('/events', events);
api.route('/files', files);

app.route('/api/v2', api);

// 404ハンドラー
app.notFound(notFoundHandler);

export default app;
