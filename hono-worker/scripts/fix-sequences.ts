/**
 * データベースのシーケンスを修正するスクリプト
 * 
 * 使用方法:
 * npx tsx scripts/fix-sequences.ts
 */

import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';

// .dev.vars から環境変数を読み込む
config({ path: resolve(__dirname, '../.dev.vars') });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL が設定されていません');
  process.exit(1);
}

async function fixSequences() {
  console.log('🔧 データベースシーケンスを修正しています...\n');

  const sql = neon(DATABASE_URL);

  try {
    // SQLファイルを読み込んで実行
    const sqlContent = readFileSync(resolve(__dirname, 'fix-sequences.sql'), 'utf-8');
    
    // セミコロンで分割して各クエリを実行
    const queries = sqlContent
      .split(';')
      .map(q => q.trim())
      .filter(q => q && !q.startsWith('--'));

    for (const query of queries) {
      if (query.toLowerCase().includes('select setval')) {
        const result = await sql(query);
        console.log('✅ シーケンスをリセット:', result);
      } else if (query.toLowerCase().includes('select')) {
        const result = await sql(query);
        console.log('\n📊 現在のシーケンス状態:');
        console.table(result);
      }
    }

    console.log('\n✅ シーケンスの修正が完了しました！');
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

fixSequences();
