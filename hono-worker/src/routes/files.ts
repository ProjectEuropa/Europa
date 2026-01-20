import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { neon } from '@neondatabase/serverless';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';
import {
    DATA_TYPE,
    type File as FileType,
    type PaginationMeta,
    type SuccessResponse,
} from '../types/api';
import type { Env } from '../types/bindings';
import { maskFilesIfNotDownloadable } from '../utils/file-mask';
import {
    generateDeletePassword,
    hashDeletePassword,
    verifyDeletePassword,
} from '../utils/password';
import { buildFileQueryWhere } from '../utils/query-builder';
import { type FileQueryInput, fileQuerySchema } from '../utils/validation';

const files = new Hono<{ Bindings: Env }>();

/**
 * GET /api/v2/files
 * ファイル一覧取得（認証はオプショナル）
 */
files.get('/', optionalAuthMiddleware, async c => {
    const user = c.get('user');

    // クエリパラメータのバリデーション
    const queryParams = c.req.query();
    const result = fileQuerySchema.safeParse(queryParams);

    const {
        page = 1,
        limit = 20,
        tag,
        upload_user_id,
        mine,
        keyword,
        data_type,
        sort_order = 'desc',
    }: FileQueryInput = result.success ? result.data : { page: 1, limit: 20 };

    // ページネーション計算
    const offset = (page - 1) * limit;

    // データベース接続
    const sql = neon(c.env.DATABASE_URL);

    // フィルタ条件の決定
    let targetUserId = upload_user_id;
    if (mine === 'true') {
        if (!user) {
            throw new HTTPException(401, {
                message: '[FilesRoute] Unauthorized: Login required for "mine" filter',
            });
        }
        targetUserId = user.userId;
    }

    // biome-ignore lint/suspicious/noImplicitAnyLet: クエリ結果の型が動的なため
    let countResult: any;
    // biome-ignore lint/suspicious/noImplicitAnyLet: クエリ結果の型が動的なため
    let filesList: any;

    // タグフィルタがある場合は、タグでフィルタリングされたファイルIDを取得
    let tagFilteredFileIds: number[] | null = null;
    if (tag) {
        const tagResults = await sql`
      SELECT DISTINCT ft.file_id
      FROM file_tags ft
      INNER JOIN tags t ON ft.tag_id = t.id
      WHERE t.tag_name = ${tag}
    `;
        tagFilteredFileIds = tagResults.map((r: any) => r.file_id);

        // タグに該当するファイルが存在しない場合は空の結果を返す
        if (tagFilteredFileIds.length === 0) {
            countResult = [{ count: '0' }];
            filesList = [];
        }
    }

    // キーワード検索時にタグも検索対象にする
    let keywordMatchedFileIds: number[] | undefined;
    if (keyword && !tag) {
        // ILIKE用の特殊文字（\, %, _）をエスケープ
        const escapedKeyword = keyword.replace(/[\\%_]/g, '\\$&');
        const keywordTagResults = await sql`
      SELECT DISTINCT ft.file_id
      FROM file_tags ft
      INNER JOIN tags t ON ft.tag_id = t.id
      WHERE t.tag_name ILIKE ${'%' + escapedKeyword + '%'} ESCAPE '\\'
    `;
        keywordMatchedFileIds = keywordTagResults.map((r: any) => r.file_id);
    }

    // タグフィルタで結果が空でない場合のみクエリを実行
    if (!tag || (tagFilteredFileIds && tagFilteredFileIds.length > 0)) {
        // WHERE条件を動的に構築
        const { whereClause, whereParams } = buildFileQueryWhere({
            data_type,
            targetUserId,
            keyword,
            tagFilteredFileIds: tagFilteredFileIds || undefined,
            keywordMatchedFileIds,
        });

        // 件数取得とリスト取得のクエリを並列実行
        const countQuery = `SELECT COUNT(*) as count FROM files ${whereClause}`;
        const orderDirection = sort_order === 'asc' ? 'ASC' : 'DESC';
        const listQuery = `SELECT id, upload_user_id, upload_owner_name, file_name, file_path, file_size, file_comment, data_type, downloadable_at, created_at, updated_at FROM files ${whereClause} ORDER BY created_at ${orderDirection} LIMIT $${whereParams.length + 1} OFFSET $${whereParams.length + 2}`;

        [countResult, filesList] = await Promise.all([
            sql(countQuery, whereParams),
            sql(listQuery, [...whereParams, limit, offset]),
        ]);
    }

    const total = parseInt(countResult[0].count as string);

    // 全ファイルのタグを一度に取得（N+1問題を回避）
    const fileIds = (filesList as any[]).map((f: any) => f.id);
    let allTags: any[] = [];

    if (fileIds.length > 0) {
        // IN句を使用して安全に配列を処理
        // Note: Using array directly as Neon supports parameterized arrays
        allTags = await sql`
      SELECT ft.file_id, t.tag_name
      FROM tags t
      INNER JOIN file_tags ft ON t.id = ft.tag_id
      WHERE ft.file_id = ANY(${fileIds})
      ORDER BY ft.file_id, t.tag_name
    `;
    }

    // ファイルIDごとにタグをグループ化
    const tagsByFileId = new Map<number, string[]>();
    for (const tag of allTags) {
        const fileId = tag.file_id;
        if (!tagsByFileId.has(fileId)) {
            tagsByFileId.set(fileId, []);
        }
        tagsByFileId.get(fileId)!.push(tag.tag_name);
    }

    // ファイルにタグを追加
    const filesWithTags = filesList.map((file: any) => ({
        ...file,
        tags: tagsByFileId.get(file.id) || [],
    })) as FileType[];

    // マスク処理を適用（マイページの場合はスキップ）
    const maskedFiles =
        mine === 'true'
            ? filesWithTags
            : maskFilesIfNotDownloadable(filesWithTags as unknown as Record<string, unknown>[]);

    const pagination: PaginationMeta = {
        page,
        limit,
        total,
    };

    const response: SuccessResponse<{ files: FileType[]; pagination: PaginationMeta }> = {
        data: {
            files: maskedFiles as FileType[],
            pagination,
        },
    };

    return c.json(response, 200);
});

/**
 * GET /api/v2/tags
 * タグ一覧取得（認証不要）
 */
files.get('/tags', async c => {
    // データベース接続
    const sql = neon(c.env.DATABASE_URL);

    // タグを使用頻度順で取得
    const tagsResult = await sql`
    SELECT t.tag_name, COUNT(ft.file_id) as usage_count
    FROM tags t
    LEFT JOIN file_tags ft ON t.id = ft.tag_id
    GROUP BY t.tag_name
    ORDER BY usage_count DESC, t.tag_name ASC
  `;

    const tags = tagsResult.map((row: any) => row.tag_name);

    const response: SuccessResponse<{ tags: string[] }> = {
        data: { tags },
    };

    return c.json(response, 200);
});

/**
 * GET /api/v2/files/:id
 * ファイルダウンロード（認証不要）
 */
files.get('/:id', async c => {
    const id = c.req.param('id');

    // IDのバリデーション
    if (!/^\d+$/.test(id)) {
        throw new HTTPException(400, { message: 'Invalid file ID' });
    }

    // データベース接続
    const sql = neon(c.env.DATABASE_URL);

    // ファイル情報を取得
    const filesList = await sql`
    SELECT id, file_name, file_path, file_size, downloadable_at
    FROM files
    WHERE id = ${parseInt(id)}
  `;

    if (filesList.length === 0) {
        throw new HTTPException(404, { message: 'File not found' });
    }

    const file = filesList[0] as FileType;

    // ダウンロード可能日時のチェック
    if (file.downloadable_at) {
        // DBのdownloadable_atはJSTのローカル時刻として保存されている（タイムゾーン情報なし）
        // 現在時刻もJSTで比較する必要がある
        const nowUtc = new Date();
        // UTCからJSTへ変換（+9時間）
        const nowJst = new Date(nowUtc.getTime() + 9 * 60 * 60 * 1000);

        // DBの値を文字列として取得し、JSTローカル時刻としてパース
        const dateStr =
            (file.downloadable_at as unknown) instanceof Date
                ? (file.downloadable_at as unknown as Date).toISOString()
                : String(file.downloadable_at);

        // DBからの日時文字列をパース（タイムゾーン情報がない場合はUTCとして解釈される）
        // "2025-12-21T23:59:00" or "2025-12-21T23:59:00.000Z" → Date
        const downloadableDate = new Date(dateStr);

        // JSTの現在時刻と比較（downloadableDateはDBに保存されたJST時刻がUTCとして解釈されているので、
        // nowJstのUTC表現と比較するために調整不要）
        // 例: DBに "2024-12-29 10:00:00" (JST) → new Date()で 2024-12-29T10:00:00Z (UTC) として解釈
        // nowJst = 現在のJST時刻のUTC表現（例: JST 10:00 → nowJst.getTime() = UTC 10:00のタイムスタンプ）
        if (nowJst < downloadableDate) {
            const formatted = dateStr.replace(
                /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2}).*/,
                '$1 $2'
            );

            throw new HTTPException(403, {
                message: `このファイルは${formatted}以降にダウンロード可能です`,
            });
        }
    }

    console.log('Download file info:', {
        id: file.id,
        file_name: file.file_name,
        file_path: file.file_path,
    });

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
 * ファイルアップロード（認証はオプショナル）
 */
files.post('/', optionalAuthMiddleware, async c => {
    const user = c.get('user');

    // multipart/form-data を解析
    const formData = await c.req.formData();
    const file = formData.get('file') as unknown as File;
    const comment = formData.get('comment') as string | null;
    const tagsString = formData.get('tags') as string | null;
    const inputDeletePassword = formData.get('deletePassword') as string | null; // ユーザー入力の削除パスワード
    const inputOwnerName = formData.get('upload_owner_name') as string | null; // ユーザー入力のアップロード者名
    const inputDownloadableAt = formData.get('downloadable_at') as string | null; // ダウンロード可能日時
    const inputDataType = formData.get('data_type') as string | null; // データタイプ (1: チーム, 2: マッチ)

    if (!file) {
        throw new HTTPException(400, { message: 'File is required' });
    }

    // ファイルサイズ制限（10MB）
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
        throw new HTTPException(400, { message: 'File size exceeds 10MB limit' });
    }

    // コメントは必須
    if (!comment || !comment.trim()) {
        throw new HTTPException(400, { message: 'コメントを入力してください' });
    }

    // 未認証ユーザーの場合、オーナー名と削除パスワードが必須
    if (!user) {
        if (!inputOwnerName || !inputOwnerName.trim()) {
            throw new HTTPException(400, { message: 'オーナー名を入力してください' });
        }
        if (!inputDeletePassword || !inputDeletePassword.trim()) {
            throw new HTTPException(400, { message: '削除パスワードを入力してください' });
        }
    }

    // タグをパース
    const tags = tagsString ? JSON.parse(tagsString) : [];

    // data_typeを判定（フロントエンドから送信された値を使用、デフォルトはチーム）
    const dataType = inputDataType === DATA_TYPE.MATCH ? DATA_TYPE.MATCH : DATA_TYPE.TEAM;

    // データベース接続
    const sql = neon(c.env.DATABASE_URL);

    // 削除パスワードを処理（ログインユーザー・匿名ユーザー両方とも設定可能）
    let deletePassword: string | null = null;
    let hashedDeletePassword: string | null = null;

    if (inputDeletePassword && inputDeletePassword.trim()) {
        // ユーザーが入力した削除パスワードをハッシュ化して保存
        deletePassword = inputDeletePassword.trim();
        hashedDeletePassword = await hashDeletePassword(deletePassword);
    }

    // アップロード者名を決定（優先順位: 入力値 > ログインユーザーのemail > Anonymous）
    const ownerName =
        inputOwnerName && inputOwnerName.trim()
            ? inputOwnerName.trim()
            : user
              ? user.email
              : 'Anonymous';

    // ファイルメタデータを挿入（JST時刻で保存）
    const newFiles = await sql`
    INSERT INTO files (
      upload_user_id, upload_owner_name, file_name, file_path, file_size, file_comment, data_type, delete_password, downloadable_at,
      created_at, updated_at
    )
    VALUES (
      ${user?.userId || null}, ${ownerName}, ${file.name}, '', ${file.size}, ${comment || null}, ${dataType}, ${hashedDeletePassword}, ${inputDownloadableAt || null},
      NOW() AT TIME ZONE 'Asia/Tokyo', NOW() AT TIME ZONE 'Asia/Tokyo'
    )
    RETURNING id, upload_user_id, upload_owner_name, file_name, file_size, file_comment, data_type, downloadable_at, created_at, updated_at
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

    // レスポンスに削除パスワードを含める（匿名ユーザーのみ）
    const response: SuccessResponse<{ file: FileType; deletePassword?: string }> = {
        data: {
            file: {
                ...newFile,
                file_path: key,
                tags: tagNames,
                delete_password: null, // ハッシュ化されたパスワードは返さない
            },
            ...(deletePassword && { deletePassword }), // 平文の削除パスワードを返す
        },
    };

    return c.json(response, 201);
});

/**
 * DELETE /api/v2/files/:id
 * ファイル削除（認証ユーザー or 削除パスワード）
 */
files.delete('/:id', optionalAuthMiddleware, async c => {
    const user = c.get('user');
    const id = c.req.param('id');

    // IDのバリデーション
    if (!/^\d+$/.test(id)) {
        throw new HTTPException(400, { message: 'Invalid file ID' });
    }

    // データベース接続
    const sql = neon(c.env.DATABASE_URL);

    // ファイル情報を取得（delete_passwordも取得）
    const filesList = await sql`
    SELECT id, upload_user_id, file_path, delete_password
    FROM files
    WHERE id = ${parseInt(id)}
  `;

    if (filesList.length === 0) {
        throw new HTTPException(404, { message: 'File not found' });
    }

    const file = filesList[0] as FileType;

    // 権限チェック
    if (user) {
        // 認証ユーザー: ユーザーIDで権限チェック
        if (file.upload_user_id !== user.userId) {
            throw new HTTPException(403, { message: '削除に失敗しました' });
        }
    } else {
        // 匿名ユーザー: 削除パスワードで検証
        const body = await c.req.json().catch(() => ({}));
        const { deletePassword } = body;

        if (!deletePassword) {
            throw new HTTPException(401, { message: '削除パスワードが必要です' });
        }

        if (!file.delete_password) {
            throw new HTTPException(403, { message: '削除に失敗しました' });
        }

        const { isValid, needsUpgrade } = await verifyDeletePassword(
            deletePassword,
            file.delete_password
        );
        if (!isValid) {
            throw new HTTPException(403, { message: '削除パスワードが正しくありません' });
        }

        // 注: needsUpgradeフラグは削除時には使用されません。
        // 古いSHA-256ハッシュは、新規アップロード時にbcryptを使うことで
        // 時間とともに自然に減少していきます。
    }

    // R2から削除
    await c.env.FILES_BUCKET.delete(file.file_path);

    // データベースから削除（file_tagsもCASCADEで削除される）
    await sql`
    DELETE FROM files WHERE id = ${parseInt(id)}
  `;

    return c.json({ message: 'File deleted successfully' }, 200);
});

/**
 * POST /api/v2/files/bulk-download
 * 複数ファイルの一括ダウンロード（ZIP形式）
 */
files.post('/bulk-download', optionalAuthMiddleware, async c => {
    const body = await c.req.json().catch(() => ({}));
    const { fileIds } = body;

    // バリデーション
    if (!Array.isArray(fileIds) || fileIds.length === 0) {
        throw new HTTPException(400, { message: 'ファイルIDのリストが必要です' });
    }

    if (fileIds.length > 50) {
        throw new HTTPException(400, { message: '一度に選択できるファイルは50個までです' });
    }

    // データベース接続
    const sql = neon(c.env.DATABASE_URL);

    // ファイル情報を取得（IN句を使用して安全に配列を処理）
    // Note: Using array directly as Neon supports parameterized arrays
    const filesList = await sql`
    SELECT id, file_name, file_path, file_size, downloadable_at
    FROM files
    WHERE id = ANY(${fileIds})
  `;

    if (filesList.length === 0) {
        throw new HTTPException(404, { message: 'ファイルが見つかりません' });
    }

    // fflateを動的インポート
    const { zipSync } = await import('fflate');

    // ZIPファイルの内容を準備
    const zipContents: Record<string, Uint8Array> = {};
    const fileNameCounts = new Map<string, number>(); // ファイル名の出現回数を記録
    const skippedFiles: string[] = []; // ダウンロード不可のファイル
    let totalSize = 0;

    // 現在時刻をJSTで取得（ループ外で1回だけ計算）
    const nowUtcForBulk = new Date();
    const nowJstForBulk = new Date(nowUtcForBulk.getTime() + 9 * 60 * 60 * 1000);

    for (const file of filesList) {
        // ダウンロード可能日時のチェック
        if (file.downloadable_at) {
            // DBの値を文字列として取得
            const dateStr =
                (file.downloadable_at as unknown) instanceof Date
                    ? (file.downloadable_at as unknown as Date).toISOString()
                    : String(file.downloadable_at);
            const downloadableDate = new Date(dateStr);

            if (nowJstForBulk < downloadableDate) {
                // ダウンロード可能日時前のファイルはスキップ
                skippedFiles.push(file.file_name);
                continue;
            }
        }
        try {
            // R2からファイルを取得
            const object = await c.env.FILES_BUCKET.get(file.file_path);

            if (!object) {
                console.warn(`File not found in R2: ${file.file_path}`);
                continue;
            }

            const arrayBuffer = await object.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);

            totalSize += uint8Array.length;

            // メモリ制限チェック（100MB）
            if (totalSize > 100 * 1024 * 1024) {
                throw new HTTPException(413, { message: 'ファイルサイズの合計が大きすぎます' });
            }

            // ファイル名の重複処理
            let safeFileName = file.file_name;
            const count = fileNameCounts.get(file.file_name) || 0;

            if (count > 0) {
                // 重複がある場合のみ番号を付ける
                const nameParts = file.file_name.split('.');
                if (nameParts.length > 1) {
                    const ext = nameParts.pop();
                    const baseName = nameParts.join('.');
                    safeFileName = `${baseName}_${count}.${ext}`;
                } else {
                    safeFileName = `${file.file_name}_${count}`;
                }
            }

            fileNameCounts.set(file.file_name, count + 1);
            zipContents[safeFileName] = uint8Array;
        } catch (error) {
            console.error(`Error fetching file ${file.id}:`, error);
        }
    }

    if (Object.keys(zipContents).length === 0) {
        // 全てのファイルがダウンロード不可の場合
        if (skippedFiles.length > 0) {
            throw new HTTPException(403, {
                message: `選択されたファイルはまだダウンロード可能日時に達していません`,
            });
        }
        throw new HTTPException(404, { message: 'ダウンロード可能なファイルがありません' });
    }

    // ZIPファイルを生成
    const zipped = zipSync(zipContents, {
        level: 6, // 圧縮レベル（0-9、6がデフォルト）
    });

    // ファイル名を生成（タイムスタンプ付き）
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `bulk_download_${timestamp}.zip`;

    // Responseオブジェクトを返す
    return new Response(zipped, {
        status: 200,
        headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Length': zipped.length.toString(),
        },
    });
});

export default files;
