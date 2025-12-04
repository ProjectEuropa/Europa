import { Client } from 'pg';
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

// 環境変数読み込み
const args = process.argv.slice(2);
const envIndex = args.indexOf('--env');
const environment = envIndex !== -1 ? args[envIndex + 1] : 'staging';
const envFile = environment === 'production'
    ? '.env.production.migration'
    : '.env.migration';

console.log(`環境: ${environment}`);
console.log(`設定ファイル: ${envFile}\n`);

dotenv.config({ path: envFile });

async function migrateMetadata() {
    const oldDb = new Client({
        host: process.env.OLD_DB_HOST || 'localhost',
        port: parseInt(process.env.OLD_DB_PORT || '5432'),
        database: process.env.OLD_DB_DATABASE,
        user: process.env.OLD_DB_USERNAME,
        password: process.env.OLD_DB_PASSWORD,
    });

    try {
        await oldDb.connect();

        const newDb = neon(process.env.NEON_DATABASE_URL!);

        console.log('=== メタデータ移行開始 ===\n');

        // 1. users テーブル移行
        console.log('1. users テーブル移行中...');
        const users = await oldDb.query('SELECT * FROM users ORDER BY id');

        for (const user of users.rows) {
            // emailがNULLの場合はダミー値を設定
            const email = user.email || `user${user.id}@placeholder.local`;
            const password = user.password || '';

            await newDb`
                INSERT INTO users (id, name, email, password, remember_token, created_at, updated_at)
                VALUES (${user.id}, ${user.name}, ${email}, ${password}, ${user.remember_token}, ${user.created_at}, ${user.updated_at})
                ON CONFLICT (id) DO NOTHING
            `;
        }
        console.log(`  ✓ ${users.rows.length}件移行完了\n`);

        // 2. events テーブル移行
        console.log('2. events テーブル移行中...');
        const events = await oldDb.query('SELECT * FROM events ORDER BY id');

        for (const event of events.rows) {
            await newDb`
                INSERT INTO events (
                    id, register_user_id, event_name, event_details, event_reference_url, event_type,
                    event_closing_day, event_displaying_day, created_at, updated_at
                )
                VALUES (
                    ${event.id}, ${event.register_user_id}, ${event.event_name}, ${event.event_details},
                    ${event.event_reference_url}, ${event.event_type}, ${event.event_closing_day},
                    ${event.event_displaying_day}, ${event.created_at}, ${event.updated_at}
                )
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

        console.log('=== メタデータ移行完了 ===');
    } catch (error) {
        console.error('移行エラー:', error);
        process.exit(1);
    } finally {
        await oldDb.end();
        console.log('✓ DB接続終了');
    }
}

migrateMetadata();
