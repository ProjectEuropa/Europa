import { Client } from 'pg';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

// 環境変数読み込み
// --env フラグで環境を指定（staging, production）
const args = process.argv.slice(2);
const envIndex = args.indexOf('--env');
const environment = envIndex !== -1 ? args[envIndex + 1] : 'staging';
const envFile = environment === 'production'
    ? '.env.production.migration'
    : '.env.migration';

console.log(`環境: ${environment}`);
console.log(`設定ファイル: ${envFile}\n`);

dotenv.config({ path: envFile });

interface FileRecord {
    id: number;
    file_name: string;
    file_data: Buffer;
    file_size: number;
    upload_user_id: number;
    upload_owner_name: string;
    file_comment: string;
    data_type: string;
    search_tag1: string;
    search_tag2: string;
    search_tag3: string;
    search_tag4: string;
    downloadable_at: Date | null;
    created_at: Date;
    updated_at: Date;
}

class FileMigrator {
    private oldDb: Client;
    private newDb: ReturnType<typeof neon>;
    private s3: S3Client;
    private bucketName: string;
    private dryRun: boolean;

    constructor(dryRun = false) {
        this.dryRun = dryRun;

        // 環境変数のバリデーション
        const requiredEnvVars = [
            'OLD_DB_DATABASE', 'OLD_DB_USERNAME', 'OLD_DB_PASSWORD',
            'NEON_DATABASE_URL', 'R2_ENDPOINT', 'R2_ACCESS_KEY_ID',
            'R2_SECRET_ACCESS_KEY', 'R2_BUCKET_NAME'
        ];
        for (const envVar of requiredEnvVars) {
            if (!process.env[envVar]) {
                console.error(`エラー: 環境変数 ${envVar} が設定されていません。`);
                process.exit(1);
            }
        }

        // 旧DB（Docker PostgreSQL）
        this.oldDb = new Client({
            host: process.env.OLD_DB_HOST || 'localhost',
            port: parseInt(process.env.OLD_DB_PORT || '5432'),
            database: process.env.OLD_DB_DATABASE!,
            user: process.env.OLD_DB_USERNAME!,
            password: process.env.OLD_DB_PASSWORD!,
        });

        // 新DB（Neon）
        this.newDb = neon(process.env.NEON_DATABASE_URL!);

        // R2（S3互換）
        this.s3 = new S3Client({
            region: 'auto',
            endpoint: process.env.R2_ENDPOINT!,
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID!,
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
            },
        });

        this.bucketName = process.env.R2_BUCKET_NAME!;
    }

    async connect() {
        await this.oldDb.connect();
        console.log('✓ 旧DB接続成功');
    }

    async disconnect() {
        await this.oldDb.end();
        console.log('✓ DB接続終了');
    }

    async getFileCount(): Promise<number> {
        const result = await this.oldDb.query(
            'SELECT COUNT(*) as count FROM files WHERE file_data IS NOT NULL'
        );
        return parseInt(result.rows[0].count);
    }

    async migrateFiles(batchSize = 10) {
        console.log('\n=== ファイル移行開始 ===\n');

        const totalCount = await this.getFileCount();
        console.log(`移行対象: ${totalCount}件\n`);

        if (this.dryRun) {
            console.log('⚠️  ドライランモード（実際には移行しません）\n');
        }

        let offset = 0;
        let successCount = 0;
        let failCount = 0;
        const errors: { id: number; error: string }[] = [];

        while (offset < totalCount) {
            const result = await this.oldDb.query<FileRecord>(
                `SELECT id, file_name, file_data, upload_user_id, upload_owner_name,
                file_comment, data_type, search_tag1, search_tag2, search_tag3, search_tag4,
                downloadable_at, created_at, updated_at
         FROM files 
         WHERE file_data IS NOT NULL
         ORDER BY id
         LIMIT $1 OFFSET $2`,
                [batchSize, offset]
            );

            for (const file of result.rows) {
                try {
                    await this.migrateFile(file);
                    successCount++;

                    if (successCount % 100 === 0) {
                        console.log(`進捗: ${successCount}/${totalCount} (${Math.round(successCount / totalCount * 100)}%)`);
                    }
                } catch (error) {
                    failCount++;
                    errors.push({
                        id: file.id,
                        error: error instanceof Error ? error.message : String(error)
                    });
                    console.error(`✗ ファイル ${file.id} の移行失敗: ${error}`);
                }
            }

            offset += batchSize;
        }

        console.log('\n=== 移行完了 ===');
        console.log(`成功: ${successCount}件`);
        console.log(`失敗: ${failCount}件`);

        if (errors.length > 0) {
            console.log('\n失敗したファイル:');
            errors.forEach(({ id, error }) => {
                console.log(`  ID ${id}: ${error}`);
            });
        }

        return { successCount, failCount, errors };
    }

    private async migrateFile(file: FileRecord) {
        const key = `files/${file.id}/${file.file_name}`;

        if (!this.dryRun) {
            // 1. R2にアップロード
            const fileSize = file.file_data.length;

            await this.s3.send(new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: file.file_data,
                ContentLength: fileSize,
                ContentType: this.getContentType(file.file_name),
                Metadata: {
                    originalId: file.id.toString(),
                    uploadedAt: new Date().toISOString(),
                },
            }));

            // 2. Neonにメタデータ挿入
            // upload_user_idが存在するか確認（存在しない場合はNULL）
            let validUserId: number | null = file.upload_user_id;
            if (file.upload_user_id) {
                const userCheck = await this.newDb`
          SELECT id FROM users WHERE id = ${file.upload_user_id}
        `;
                if (Array.isArray(userCheck) && userCheck.length === 0) {
                    validUserId = null;
                }
            }

            // ファイルメタデータを挿入
            await this.newDb`
        INSERT INTO files (
          id, upload_user_id, upload_owner_name, file_name, file_path, file_size,
          file_comment, data_type, downloadable_at, created_at, updated_at
        ) VALUES (
          ${file.id}, ${validUserId}, ${file.upload_owner_name || 'Anonymous'}, ${file.file_name}, ${key}, ${fileSize},
          ${file.file_comment}, ${file.data_type}, ${file.downloadable_at}, ${file.created_at}, ${file.updated_at}
        )
        ON CONFLICT (id) DO UPDATE SET
          file_path = EXCLUDED.file_path,
          upload_owner_name = EXCLUDED.upload_owner_name,
          data_type = EXCLUDED.data_type,
          updated_at = NOW()
      `;

            // 3. タグを処理
            const tags = [
                file.search_tag1,
                file.search_tag2,
                file.search_tag3,
                file.search_tag4
            ].filter(tag => tag && tag.trim() !== '');

            for (const tagName of tags) {
                const normalizedTag = this.normalizeSearchTag(tagName);
                if (!normalizedTag) continue;

                // タグを取得または作成
                const tagResult = await this.newDb`
          INSERT INTO tags (tag_name)
          VALUES (${normalizedTag})
          ON CONFLICT (tag_name) DO UPDATE SET tag_name = EXCLUDED.tag_name
          RETURNING id
        `;

                if (!Array.isArray(tagResult) || tagResult.length === 0) continue;
                const tagId = (tagResult as any[])[0]?.id;
                if (!tagId) continue;

                // file_tagsに関連付け
                await this.newDb`
          INSERT INTO file_tags (file_id, tag_id)
          VALUES (${file.id}, ${tagId})
          ON CONFLICT (file_id, tag_id) DO NOTHING
        `;
            }
        }

        // ドライランでも表示
        console.log(`✓ ${file.file_name} (ID: ${file.id}, ${this.formatBytes(file.file_data.length)})`);
    }

    private normalizeSearchTag(tag: string | null | undefined): string | null {
        if (!tag) return null;

        // トリミング
        const trimmed = tag.trim();

        // 空文字列の場合はNULL
        if (trimmed === '') return null;

        // 小文字に統一（オプション: 必要に応じてコメントアウト）
        // return trimmed.toLowerCase();

        return trimmed;
    }

    private getContentType(filename: string): string {
        const ext = filename.split('.').pop()?.toLowerCase();
        const types: Record<string, string> = {
            'pdf': 'application/pdf',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'txt': 'text/plain',
            'zip': 'application/zip',
        };
        return types[ext || ''] || 'application/octet-stream';
    }

    private formatBytes(bytes: number): string {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
}

// メイン実行
async function main() {
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');

    const migrator = new FileMigrator(dryRun);

    try {
        await migrator.connect();
        const result = await migrator.migrateFiles(10); // 10件ずつバッチ処理

        if (result.failCount > 0) {
            process.exit(1);
        }
    } catch (error) {
        console.error('移行エラー:', error);
        process.exit(1);
    } finally {
        await migrator.disconnect();
    }
}

main();
