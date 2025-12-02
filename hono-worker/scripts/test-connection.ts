import { neon } from '@neondatabase/serverless';
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.migration' });

async function testConnection() {
    console.log('=== 接続テスト開始 ===\n');

    // 1. Neon接続テスト
    console.log('1. Neon (PostgreSQL) 接続テスト...');
    try {
        if (!process.env.NEON_DATABASE_URL || process.env.NEON_DATABASE_URL.includes('npg_xxxx')) {
            throw new Error('NEON_DATABASE_URL が設定されていないか、プレースホルダーのままです。');
        }
        const sql = neon(process.env.NEON_DATABASE_URL);
        const result = await sql`SELECT version()`;
        console.log(`  ✓ 成功: ${result[0].version}\n`);
    } catch (error) {
        console.error(`  ✗ 失敗: ${error instanceof Error ? error.message : String(error)}\n`);
    }

    // 2. R2接続テスト
    console.log('2. R2 (S3互換) 接続テスト...');
    try {
        if (!process.env.R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID.includes('xxxxxxxx')) {
            throw new Error('R2_ACCESS_KEY_ID が設定されていないか、プレースホルダーのままです。');
        }
        const s3 = new S3Client({
            region: 'auto',
            endpoint: process.env.R2_ENDPOINT,
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID!,
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
            },
        });
        const { Buckets } = await s3.send(new ListBucketsCommand({}));
        console.log('  ✓ 成功: バケット一覧取得');
        Buckets?.forEach(b => console.log(`    - ${b.Name}`));
        console.log('');
    } catch (error) {
        console.error(`  ✗ 失敗: ${error instanceof Error ? error.message : String(error)}\n`);
    }
}

testConnection();
