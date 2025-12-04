import { neon } from '@neondatabase/serverless';
import { S3Client, HeadObjectCommand } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.migration' });

async function verify() {
    const sql = neon(process.env.NEON_DATABASE_URL!);
    const s3 = new S3Client({
        region: 'auto',
        endpoint: process.env.R2_ENDPOINT,
        credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID!,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
        },
    });

    console.log('=== 移行検証 ===\n');

    // 1. Neonのファイル件数確認
    const fileCount = await sql`SELECT COUNT(*) as count FROM files WHERE file_path IS NOT NULL`;
    console.log(`Neon files.file_path設定数: ${fileCount[0].count}件`);

    // 2. ランダムに10件サンプリングして R2 存在確認
    const samples = await sql`
    SELECT id, file_name, file_path 
    FROM files 
    WHERE file_path IS NOT NULL 
    ORDER BY RANDOM() 
    LIMIT 10
  `;

    let existCount = 0;
    for (const file of samples) {
        try {
            await s3.send(new HeadObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME!,
                Key: file.file_path,
            }));
            console.log(`✓ ${file.file_name} (R2に存在)`);
            existCount++;
        } catch (error) {
            console.log(`✗ ${file.file_name} (R2に存在しない)`);
        }
    }

    console.log(`\nR2存在確認: ${existCount}/10件`);

    if (existCount === 10) {
        console.log('\n✅ 移行検証完了！');
    } else {
        console.log('\n⚠️  一部ファイルが見つかりません');
    }
}

verify();
