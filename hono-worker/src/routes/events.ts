import { neon } from '@neondatabase/serverless';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { authMiddleware } from '../middleware/auth';
import type { Event, PaginationMeta, SuccessResponse } from '../types/api';
import type { Env } from '../types/bindings';
import {
    type EventQueryInput,
    eventQuerySchema,
    eventRegistrationSchema,
} from '../utils/validation';

const events = new Hono<{ Bindings: Env }>();

/**
 * GET /api/v2/events
 * イベント一覧取得（全体）
 */
events.get('/', async c => {
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

    // 総件数を取得（表示期限内のもののみ）
    const countResult = await sql`
      SELECT COUNT(*) as count 
      FROM events
      WHERE event_displaying_day >= NOW()
    `;
    const total = parseInt(countResult[0].count as string);

    // イベント一覧を取得（表示期限内のもののみ）
    const eventsList = await sql`
    SELECT
      id, register_user_id, event_name, event_details, event_reference_url,
      event_type, event_closing_day, event_displaying_day, created_at, updated_at
    FROM events
    WHERE event_displaying_day >= NOW()
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
 * GET /api/v2/events/me
 * 自分が登録したイベント一覧取得（認証必須）
 */
events.get('/me', authMiddleware, async c => {
    const user = c.get('user');

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

    // 総件数を取得（認証ユーザーのみ）
    const countResult = await sql`
        SELECT COUNT(*) as count FROM events
        WHERE register_user_id = ${user.userId}
    `;
    const total = parseInt(countResult[0].count as string);

    // イベント一覧を取得（認証ユーザーのみ）
    const eventsList = await sql`
        SELECT
            id, register_user_id, event_name, event_details, event_reference_url,
            event_type, event_closing_day, event_displaying_day, created_at, updated_at
        FROM events
        WHERE register_user_id = ${user.userId}
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
events.get('/:id', async c => {
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

/**
 * POST /api/v2/events
 * イベント登録（認証必須）
 */
events.post('/', authMiddleware, async c => {
    const user = c.get('user');
    const body = await c.req.json().catch(() => ({}));

    // バリデーション
    const result = eventRegistrationSchema.safeParse(body);
    if (!result.success) {
        throw new HTTPException(400, { message: 'Validation failed', cause: result.error });
    }

    const input = result.data;

    // データベース接続
    const sql = neon(c.env.DATABASE_URL);

    // イベントを登録
    const newEvents = await sql`
        INSERT INTO events (
            register_user_id,
            event_name,
            event_details,
            event_reference_url,
            event_type,
            event_closing_day,
            event_displaying_day
        ) VALUES (
            ${user.userId},
            ${input.name},
            ${input.details},
            ${input.url || null},
            ${input.type},
            ${input.deadline}::timestamptz AT TIME ZONE 'Asia/Tokyo',
            ${input.endDisplayDate}::timestamptz AT TIME ZONE 'Asia/Tokyo'
        )
        RETURNING
            id, register_user_id, event_name, event_details, event_reference_url,
            event_type, event_closing_day, event_displaying_day, created_at, updated_at
    `;

    const event = newEvents[0] as Event;

    const successResponse: SuccessResponse<{ event: Event }> = {
        message: 'Event created successfully',
        data: { event },
    };

    return c.json(successResponse, 201);
});

/**
 * DELETE /api/v2/events/:id
 * イベント削除（認証必須、登録者のみ）
 */
events.delete('/:id', authMiddleware, async c => {
    const id = c.req.param('id');
    const user = c.get('user');

    // IDのバリデーション
    if (!/^\d+$/.test(id)) {
        throw new HTTPException(400, { message: 'Invalid event ID' });
    }

    // データベース接続
    const sql = neon(c.env.DATABASE_URL);

    // イベントの存在確認と権限チェック
    const existingEvents = await sql`
        SELECT register_user_id FROM events WHERE id = ${parseInt(id)}
    `;

    if (existingEvents.length === 0) {
        throw new HTTPException(404, { message: 'Event not found' });
    }

    const event = existingEvents[0];

    // 権限チェック: 登録者自身のイベントか確認
    // register_user_id は VARCHAR なので文字列比較
    if (event.register_user_id !== String(user.userId)) {
        throw new HTTPException(403, { message: 'Forbidden: You can only delete your own events' });
    }

    // イベントを削除
    await sql`DELETE FROM events WHERE id = ${parseInt(id)}`;

    return c.json({ message: 'Event deleted successfully' }, 200);
});

export default events;
