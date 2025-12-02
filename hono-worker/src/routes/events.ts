import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { neon } from '@neondatabase/serverless';
import type { Env } from '../types/bindings';
import type { Event, SuccessResponse, PaginationMeta } from '../types/api';
import { eventQuerySchema, type EventQueryInput } from '../utils/validation';

const events = new Hono<{ Bindings: Env }>();

/**
 * GET /api/v2/events
 * イベント一覧取得
 */
events.get('/', async (c) => {
    // クエリパラメータのバリデーション
    const queryParams = c.req.query();
    const result = eventQuerySchema.safeParse(queryParams);

    const { page = 1, limit = 20 }: EventQueryInput = result.success
        ? result.data
        : { page: 1, limit: 20 };

    // ページネーション計算
    const offset = (page - 1) * limit;

    // データベース接続
    const sql = neon(c.env.DATABASE_URL);

    // 総件数を取得
    const countResult = await sql`
    SELECT COUNT(*) as count FROM events
  `;
    const total = parseInt(countResult[0].count as string);

    // イベント一覧を取得
    const eventsList = await sql`
    SELECT 
      id, register_user_id, event_name, event_details, event_reference_url,
      event_type, event_closing_day, event_displaying_day, created_at, updated_at
    FROM events
    ORDER BY event_displaying_day DESC, created_at DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

    const pagination: PaginationMeta = {
        page,
        limit,
        total,
    };

    const response: SuccessResponse<{ events: Event[]; pagination: PaginationMeta }> = {
        data: {
            events: eventsList as Event[],
            pagination,
        },
    };

    return c.json(response, 200);
});

/**
 * GET /api/v2/events/:id
 * イベント詳細取得
 */
events.get('/:id', async (c) => {
    const id = c.req.param('id');

    // IDのバリデーション
    if (!/^\d+$/.test(id)) {
        throw new HTTPException(400, { message: 'Invalid event ID' });
    }

    // データベース接続
    const sql = neon(c.env.DATABASE_URL);

    // イベントを取得
    const eventsList = await sql`
    SELECT 
      id, register_user_id, event_name, event_details, event_reference_url,
      event_type, event_closing_day, event_displaying_day, created_at, updated_at
    FROM events
    WHERE id = ${parseInt(id)}
  `;

    if (eventsList.length === 0) {
        throw new HTTPException(404, { message: 'Event not found' });
    }

    const event = eventsList[0] as Event;

    const response: SuccessResponse<{ event: Event }> = {
        data: { event },
    };

    return c.json(response, 200);
});

export default events;
