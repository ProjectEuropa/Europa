import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

// 環境変数読み込み
dotenv.config({ path: '.env.migration' });

async function fixSequences() {
    if (!process.env.NEON_DATABASE_URL) {
        console.error('エラー: NEON_DATABASE_URLが設定されていません。');
        process.exit(1);
    }

    const sql = neon(process.env.NEON_DATABASE_URL);

    console.log('=== シーケンス修正開始 ===\n');

    try {
        // users
        console.log('usersテーブルのシーケンスを更新中...');
        await sql`SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))`;

        // events
        console.log('eventsテーブルのシーケンスを更新中...');
        await sql`SELECT setval('events_id_seq', (SELECT MAX(id) FROM events))`;

        // files
        console.log('filesテーブルのシーケンスを更新中...');
        await sql`SELECT setval('files_id_seq', (SELECT MAX(id) FROM files))`;

        // tags
        console.log('tagsテーブルのシーケンスを更新中...');
        await sql`SELECT setval('tags_id_seq', (SELECT MAX(id) FROM tags))`;

        console.log('\n✅ シーケンス修正完了');
    } catch (error) {
        console.error('エラーが発生しました:', error);
        process.exit(1);
    }
}

fixSequences();
