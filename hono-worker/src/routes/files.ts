import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { neon } from '@neondatabase/serverless';
import { GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import type { Env } from '../types/bindings';
import type { File as FileType, SuccessResponse, PaginationMeta } from '../types/api';
import { fileQuerySchema, type FileQueryInput } from '../utils/validation';
import { authMiddleware } from '../middleware/auth';

const files = new Hono<{ Bindings: Env }>();

/**
 * GET /api/v2/files
 * ファイル一覧取得（認証必須）
 */
files.get('/', authMiddleware, async (c) => {
    const user = c.get('user');

    // クエリパラメータのバリデーション
    const queryParams = c.req.query();
    const result = fileQuerySchema.safeParse(queryParams);

    const { page = 1, limit = 20, tag, upload_user_id, mine }: FileQueryInput = result.success
        ? result.data
        : { page: 1, limit: 20 };

    // ページネーション計算
    const offset = (page - 1) * limit;

    // データベース接続
    const sql = neon(c.env.DATABASE_URL);

    // フィルタ条件の決定
    let targetUserId = upload_user_id;
    if (mine === 'true') {
        targetUserId = parseInt(user.userId);
    }

    // クエリ構築
    let filesList;
    let countResult;

    if (tag && targetUserId) {
        // タグ + ユーザー
        countResult = await sql`
      SELECT COUNT(DISTINCT f.id) as count
      FROM files f
      INNER JOIN file_tags ft ON f.id = ft.file_id
      INNER JOIN tags t ON ft.tag_id = t.id
      WHERE t.tag_name = ${tag} AND f.upload_user_id = ${targetUserId}
    `;

        filesList = await sql`
      SELECT DISTINCT
        f.id, f.upload_user_id, f.file_name, f.file_path, f.file_size,
        f.file_comment, f.downloadable_at, f.created_at, f.updated_at
      FROM files f
      INNER JOIN file_tags ft ON f.id = ft.file_id
      INNER JOIN tags t ON ft.tag_id = t.id
      WHERE t.tag_name = ${tag} AND f.upload_user_id = ${targetUserId}
      ORDER BY f.created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;
    } else if (tag) {
        // タグのみ
        countResult = await sql`
      SELECT COUNT(DISTINCT f.id) as count
      FROM files f
      INNER JOIN file_tags ft ON f.id = ft.file_id
      INNER JOIN tags t ON ft.tag_id = t.id
      WHERE t.tag_name = ${tag}
    `;

        filesList = await sql`
      SELECT DISTINCT
        f.id, f.upload_user_id, f.file_name, f.file_path, f.file_size,
        f.file_comment, f.downloadable_at, f.created_at, f.updated_at
      FROM files f
      INNER JOIN file_tags ft ON f.id = ft.file_id
      INNER JOIN tags t ON ft.tag_id = t.id
      WHERE t.tag_name = ${tag}
      ORDER BY f.created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;
    } else if (targetUserId) {
        // ユーザーのみ
        countResult = await sql`
      SELECT COUNT(*) as count FROM files WHERE upload_user_id = ${targetUserId}
    `;

        filesList = await sql`
      SELECT 
        id, upload_user_id, file_name, file_path, file_size,
        file_comment, downloadable_at, created_at, updated_at
      FROM files
      WHERE upload_user_id = ${targetUserId}
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;
    } else {
        // 全ファイル
        countResult = await sql`
      SELECT COUNT(*) as count FROM files
    `;

        filesList = await sql`
      SELECT 
        id, upload_user_id, file_name, file_path, file_size,
        file_comment, downloadable_at, created_at, updated_at
      FROM files
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;
    }

    const total = parseInt(countResult[0].count as string);

    // 各ファイルのタグを取得
    const filesWithTags = await Promise.all(
        filesList.map(async (file: any) => {
            const tags = await sql`
        SELECT t.tag_name
        FROM tags t
        INNER JOIN file_tags ft ON t.id = ft.tag_id
        WHERE ft.file_id = ${file.id}
        ORDER BY t.tag_name
      `;

            return {
                ...file,
                tags: tags.map((t: any) => t.tag_name),
            } as FileType;
        })
    );

    const pagination: PaginationMeta = {
        page,
        limit,
        total,
    };

    const response: SuccessResponse<{ files: FileType[]; pagination: PaginationMeta }> = {
        data: {
            files: filesWithTags,
            pagination,
        },
    };

    return c.json(response, 200);
});

/**
 * GET /api/v2/files/:id
 * ファイルダウンロード（認証必須）
 */
files.get('/:id', authMiddleware, async (c) => {
    const id = c.req.param('id');

    // IDのバリデーション
    if (!/^\d+$/.test(id)) {
        throw new HTTPException(400, { message: 'Invalid file ID' });
    }

    // データベース接続
    const sql = neon(c.env.DATABASE_URL);

    // ファイル情報を取得
    const filesList = await sql`
    SELECT id, file_name, file_path, file_size
    FROM files
    WHERE id = ${parseInt(id)}
  `;

    if (filesList.length === 0) {
        throw new HTTPException(404, { message: 'File not found' });
    }

    const file = filesList[0] as FileType;

    // R2からファイルを取得
    const object = await c.env.FILES_BUCKET.get(file.file_path);

    if (!object) {
        throw new HTTPException(404, { message: 'File not found in storage' });
    }

    // ファイルをストリーミング
    return new Response(object.body, {
        headers: {
            'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${file.file_name}"`,
            'Content-Length': file.file_size.toString(),
        },
    });
});

/**
 * POST /api/v2/files
 * ファイルアップロード（認証必須）
 */
files.post('/', authMiddleware, async (c) => {
    const user = c.get('user');

    // multipart/form-data を解析
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const comment = formData.get('comment') as string | null;
    const tagsString = formData.get('tags') as string | null;

    if (!file) {
        throw new HTTPException(400, { message: 'File is required' });
    }

    // ファイルサイズ制限（10MB）
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
        throw new HTTPException(400, { message: 'File size exceeds 10MB limit' });
    }

    // タグをパース
    const tags = tagsString ? JSON.parse(tagsString) : [];

    // データベース接続
    const sql = neon(c.env.DATABASE_URL);

    // ファイルメタデータを挿入
    const newFiles = await sql`
    INSERT INTO files (
      upload_user_id, file_name, file_path, file_size, file_comment,
      created_at, updated_at
    )
    VALUES (
      ${user.userId}, ${file.name}, '', ${file.size}, ${comment || null},
      NOW(), NOW()
    )
    RETURNING id, upload_user_id, file_name, file_size, file_comment, created_at, updated_at
  `;

    const newFile = newFiles[0] as FileType;

    // R2にアップロード
    const key = `files/${newFile.id}/${file.name}`;
    const arrayBuffer = await file.arrayBuffer();

    await c.env.FILES_BUCKET.put(key, arrayBuffer, {
        httpMetadata: {
            contentType: file.type || 'application/octet-stream',
        },
    });

    // file_pathを更新
    await sql`
    UPDATE files
    SET file_path = ${key}
    WHERE id = ${newFile.id}
  `;

    // タグを処理
    const tagNames: string[] = [];
    for (const tagName of tags) {
        if (!tagName || typeof tagName !== 'string') continue;

        const trimmed = tagName.trim();
        if (!trimmed) continue;

        // タグを取得または作成
        const tagResult = await sql`
      INSERT INTO tags (tag_name, created_at)
      VALUES (${trimmed}, NOW())
      ON CONFLICT (tag_name) DO UPDATE SET tag_name = EXCLUDED.tag_name
      RETURNING id
    `;

        const tagId = (tagResult as any[])[0]?.id;
        if (!tagId) continue;

        // file_tagsに関連付け
        await sql`
      INSERT INTO file_tags (file_id, tag_id, created_at)
      VALUES (${newFile.id}, ${tagId}, NOW())
      ON CONFLICT (file_id, tag_id) DO NOTHING
    `;

        tagNames.push(trimmed);
    }

    const response: SuccessResponse<{ file: FileType }> = {
        data: {
            file: {
                ...newFile,
                file_path: key,
                tags: tagNames,
            },
        },
    };

    return c.json(response, 201);
});

/**
 * DELETE /api/v2/files/:id
 * ファイル削除（認証必須）
 */
files.delete('/:id', authMiddleware, async (c) => {
    const user = c.get('user');
    const id = c.req.param('id');

    // IDのバリデーション
    if (!/^\d+$/.test(id)) {
        throw new HTTPException(400, { message: 'Invalid file ID' });
    }

    // データベース接続
    const sql = neon(c.env.DATABASE_URL);

    // ファイル情報を取得
    const filesList = await sql`
    SELECT id, upload_user_id, file_path
    FROM files
    WHERE id = ${parseInt(id)}
  `;

    if (filesList.length === 0) {
        throw new HTTPException(404, { message: 'File not found' });
    }

    const file = filesList[0] as FileType;

    // 権限チェック（アップロードしたユーザーのみ削除可能）
    if (file.upload_user_id !== user.userId) {
        throw new HTTPException(403, { message: 'Forbidden: You can only delete your own files' });
    }

    // R2から削除
    await c.env.FILES_BUCKET.delete(file.file_path);

    // データベースから削除（file_tagsもCASCADEで削除される）
    await sql`
    DELETE FROM files WHERE id = ${parseInt(id)}
  `;

    const response: SuccessResponse<never> = {
        message: 'File deleted successfully',
    };

    return c.json(response, 200);
});

export default files;
