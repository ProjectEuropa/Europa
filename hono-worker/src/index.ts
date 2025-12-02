import { Hono } from 'hono';
import { logger } from 'hono/logger';
import type { Env } from './types/bindings';
import { setupCORS } from './middleware/cors';
import { errorHandler, notFoundHandler } from './middleware/error';
import auth from './routes/auth';
import events from './routes/events';
import files from './routes/files';

const app = new Hono<{ Bindings: Env }>();

// グローバルミドルウェア
app.use('*', logger());
app.use('*', setupCORS());
app.use('*', errorHandler);

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
