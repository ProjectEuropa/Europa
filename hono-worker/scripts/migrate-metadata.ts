import { Client } from 'pg';
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.migration' });

async function migrateMetadata() {
    const oldDb = new Client({
        host: process.env.OLD_DB_HOST || 'localhost',
        port: parseInt(process.env.OLD_DB_PORT || '5432'),
        database: process.env.OLD_DB_DATABASE,
        user: process.env.OLD_DB_USERNAME,
        password: process.env.OLD_DB_PASSWORD,
    });
    await oldDb.connect();

    const newDb = neon(process.env.NEON_DATABASE_URL!);

    console.log('=== メタデータ移行開始 ===\n');

    // 1. users テーブル移行
    console.log('1. users テーブル移行中...');
    const users = await oldDb.query('SELECT * FROM users ORDER BY id');

    for (const user of users.rows) {
        await newDb`
      INSERT INTO users (id, name, email, password, created_at, updated_at)
      VALUES (${user.id}, ${user.name}, ${user.email}, ${user.password}, ${user.created_at}, ${user.updated_at})
      ON CONFLICT (id) DO NOTHING
    `;
    }
    console.log(`  ✓ ${users.rows.length}件移行完了\n`);

    // 2. events テーブル移行
    console.log('2. events テーブル移行中...');
    const events = await oldDb.query('SELECT * FROM events ORDER BY id');

    for (const event of events.rows) {
        await newDb`
      INSERT INTO events (id, event_title, event_closing_day, event_displaying_day, created_at, updated_at)
      VALUES (${event.id}, ${event.event_name}, ${event.event_closing_day}, ${event.event_displaying_day}, ${event.created_at}, ${event.updated_at})
      ON CONFLICT (id) DO NOTHING
    `;
    }
    console.log(`  ✓ ${events.rows.length}件移行完了\n`);

    // 3. password_resets テーブル移行（オプション）
    console.log('3. password_resets テーブル移行中...');
    try {
        const resets = await oldDb.query('SELECT * FROM password_resets');
        for (const reset of resets.rows) {
            await newDb`
        INSERT INTO password_resets (email, token, created_at)
        VALUES (${reset.email}, ${reset.token}, ${reset.created_at})
        ON CONFLICT DO NOTHING
        `;
        }
        console.log(`  ✓ ${resets.rows.length}件移行完了\n`);
    } catch (e) {
        console.log('  ! password_resetsテーブルが見つからないか、エラーが発生しました（スキップします）');
    }

    await oldDb.end();
    console.log('=== メタデータ移行完了 ===');
}

migrateMetadata();
