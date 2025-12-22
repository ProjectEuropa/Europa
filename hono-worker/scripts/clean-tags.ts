import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

/**
 * タグクリーニングスクリプト
 *
 * 機能:
 * 1. スペース区切りで登録されたタグを分割
 *    例: "フリーOKE ハデス 多脚" → "フリーOKE", "ハデス", "多脚"
 * 2. 重複タグの統合（大文字小文字・全角半角を考慮）
 * 3. 空白のみのタグを削除
 *
 * 使い方:
 *   npx tsx scripts/clean-tags.ts --env staging           # ドライラン（変更なし）
 *   npx tsx scripts/clean-tags.ts --env staging --execute # 実際に実行
 *   npx tsx scripts/clean-tags.ts --env production --execute
 */

// 環境変数読み込み
const args = process.argv.slice(2);
const envIndex = args.indexOf('--env');
const environment = envIndex !== -1 ? args[envIndex + 1] : 'staging';
const dryRun = !args.includes('--execute');
const envFile = environment === 'production'
  ? '.env.production.migration'
  : '.env.migration';

console.log('='.repeat(60));
console.log('タグクリーニングスクリプト');
console.log('='.repeat(60));
console.log(`環境: ${environment}`);
console.log(`設定ファイル: ${envFile}`);
console.log(`モード: ${dryRun ? 'ドライラン（変更なし）' : '実行モード'}`);
console.log('='.repeat(60));
console.log('');

dotenv.config({ path: envFile });

if (!process.env.NEON_DATABASE_URL) {
  console.error('エラー: 環境変数 NEON_DATABASE_URL が設定されていません。');
  process.exit(1);
}

const sql = neon(process.env.NEON_DATABASE_URL);

interface Tag {
  id: number;
  tag_name: string;
  file_count: number;
}

interface FileTag {
  file_id: number;
  tag_id: number;
}

interface CleanupResult {
  tagsToSplit: Array<{
    original: Tag;
    splitInto: string[];
  }>;
  tagsToDelete: Tag[];
  duplicatesToMerge: Array<{
    keep: Tag;
    remove: Tag[];
  }>;
}

/**
 * タグ名を正規化（比較用）
 */
function normalizeTagName(tagName: string): string {
  return tagName
    .trim()
    .normalize('NFKC') // Unicode正規化
    .toLowerCase()
    // 全角英数字を半角に
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
    )
    // 全角スペースを半角に
    .replace(/　/g, ' ');
}

/**
 * タグにスペースが含まれているか判定
 */
function hasMultipleTags(tagName: string): boolean {
  const normalized = tagName.replace(/　/g, ' ').trim();
  return normalized.split(/\s+/).filter(t => t).length > 1;
}

/**
 * タグを分割
 */
function splitTagName(tagName: string): string[] {
  return tagName
    .replace(/　/g, ' ') // 全角スペースを半角に
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length > 0);
}

/**
 * 現在のタグ一覧を取得（使用回数付き）
 */
async function fetchAllTags(): Promise<Tag[]> {
  return await sql<Tag[]>`
    SELECT
      t.id,
      t.tag_name,
      COUNT(ft.file_id) as file_count
    FROM tags t
    LEFT JOIN file_tags ft ON t.id = ft.tag_id
    GROUP BY t.id, t.tag_name
    ORDER BY t.tag_name
  `;
}

/**
 * クリーンアップ対象を分析
 */
function analyzeCleanup(tags: Tag[]): CleanupResult {
  const result: CleanupResult = {
    tagsToSplit: [],
    tagsToDelete: [],
    duplicatesToMerge: [],
  };

  // 1. スペース区切りタグを検出
  for (const tag of tags) {
    if (hasMultipleTags(tag.tag_name)) {
      result.tagsToSplit.push({
        original: tag,
        splitInto: splitTagName(tag.tag_name),
      });
    }
  }

  // 2. 空白のみ or 空のタグを検出
  for (const tag of tags) {
    if (tag.tag_name.trim().length === 0) {
      result.tagsToDelete.push(tag);
    }
  }

  // 3. 正規化後に重複するタグを検出
  const normalizedMap = new Map<string, Tag[]>();
  for (const tag of tags) {
    const normalized = normalizeTagName(tag.tag_name);
    if (!normalizedMap.has(normalized)) {
      normalizedMap.set(normalized, []);
    }
    normalizedMap.get(normalized)!.push(tag);
  }

  for (const [, duplicates] of normalizedMap) {
    if (duplicates.length > 1) {
      // 使用回数が多いものを残す
      const sorted = duplicates.sort((a, b) => b.file_count - a.file_count);
      result.duplicatesToMerge.push({
        keep: sorted[0],
        remove: sorted.slice(1),
      });
    }
  }

  return result;
}

/**
 * 分析結果を表示
 */
function printAnalysis(result: CleanupResult): void {
  console.log('\n📊 分析結果\n');

  // スペース区切りタグ
  console.log('【1. スペース区切りタグ（分割対象）】');
  if (result.tagsToSplit.length === 0) {
    console.log('   なし\n');
  } else {
    for (const item of result.tagsToSplit) {
      console.log(`   "${item.original.tag_name}" (使用: ${item.original.file_count}件)`);
      console.log(`     → 分割後: ${item.splitInto.map(t => `"${t}"`).join(', ')}`);
    }
    console.log('');
  }

  // 空のタグ
  console.log('【2. 空白/空タグ（削除対象）】');
  if (result.tagsToDelete.length === 0) {
    console.log('   なし\n');
  } else {
    for (const tag of result.tagsToDelete) {
      console.log(`   "${tag.tag_name}" (ID: ${tag.id}, 使用: ${tag.file_count}件)`);
    }
    console.log('');
  }

  // 重複タグ
  console.log('【3. 重複タグ（統合対象）】');
  if (result.duplicatesToMerge.length === 0) {
    console.log('   なし\n');
  } else {
    for (const merge of result.duplicatesToMerge) {
      console.log(`   残す: "${merge.keep.tag_name}" (使用: ${merge.keep.file_count}件)`);
      for (const remove of merge.remove) {
        console.log(`     → 統合: "${remove.tag_name}" (使用: ${remove.file_count}件)`);
      }
    }
    console.log('');
  }

  // サマリ
  console.log('='.repeat(60));
  console.log('📈 サマリ');
  console.log(`   分割対象タグ: ${result.tagsToSplit.length}件`);
  console.log(`   削除対象タグ: ${result.tagsToDelete.length}件`);
  console.log(`   統合対象グループ: ${result.duplicatesToMerge.length}件`);
  console.log('='.repeat(60));
}

/**
 * タグを分割して新しいタグを作成
 */
async function splitTags(
  tagsToSplit: CleanupResult['tagsToSplit'],
  dryRun: boolean
): Promise<void> {
  if (tagsToSplit.length === 0) return;

  console.log('\n🔧 タグ分割処理...');

  for (const item of tagsToSplit) {
    console.log(`\n処理中: "${item.original.tag_name}"`);

    // 関連するファイルを取得
    const fileTagsResult = await sql<FileTag[]>`
      SELECT file_id FROM file_tags WHERE tag_id = ${item.original.id}
    `;
    const fileIds = fileTagsResult.map(ft => ft.file_id);

    console.log(`  関連ファイル: ${fileIds.length}件`);

    if (!dryRun) {
      await sql.transaction(async (tx) => {
        // 各分割後タグを処理
        for (const newTagName of item.splitInto) {
          // 新しいタグを挿入（既存なら取得）
          const insertResult = await tx<{ id: number }[]>`
            INSERT INTO tags (tag_name)
            VALUES (${newTagName})
            ON CONFLICT (tag_name) DO NOTHING
            RETURNING id
          `;

          let newTagId: number;
          if (insertResult.length > 0) {
            newTagId = insertResult[0].id;
          } else {
            // 既存のタグIDを取得
            const existing = await tx<{ id: number }[]>`
              SELECT id FROM tags WHERE tag_name = ${newTagName}
            `;
            if (!existing || existing.length === 0) {
              throw new Error(`Failed to insert/retrieve tag: ${newTagName}`);
            }
            newTagId = existing[0].id;
          }

          // ファイルとの関連を一括作成
          if (fileIds.length > 0) {
            await tx`
              INSERT INTO file_tags (file_id, tag_id)
              SELECT unnest(${fileIds}::int[]), ${newTagId}
              ON CONFLICT (file_id, tag_id) DO NOTHING
            `;
          }
          console.log(`  → "${newTagName}" (ID: ${newTagId}) に関連付け完了`);
        }

        // 元のタグとの関連を削除
        await tx`DELETE FROM file_tags WHERE tag_id = ${item.original.id}`;

        // 元のタグを削除
        await tx`DELETE FROM tags WHERE id = ${item.original.id}`;
        console.log(`  → 元タグ "${item.original.tag_name}" を削除`);
      });
    } else {
      console.log(`  [ドライラン] 分割先: ${item.splitInto.join(', ')}`);
    }
  }
}

/**
 * 空のタグを削除
 */
async function deleteEmptyTags(
  tagsToDelete: Tag[],
  dryRun: boolean
): Promise<void> {
  if (tagsToDelete.length === 0) return;

  console.log('\n🗑️ 空タグ削除処理...');

  for (const tag of tagsToDelete) {
    console.log(`処理中: "${tag.tag_name}" (ID: ${tag.id})`);

    if (!dryRun) {
      await sql.transaction(async (tx) => {
        await tx`DELETE FROM file_tags WHERE tag_id = ${tag.id}`;
        await tx`DELETE FROM tags WHERE id = ${tag.id}`;
        console.log(`  → 削除完了`);
      });
    } else {
      console.log(`  [ドライラン] 削除予定`);
    }
  }
}

/**
 * 重複タグを統合
 */
async function mergeDuplicateTags(
  duplicatesToMerge: CleanupResult['duplicatesToMerge'],
  dryRun: boolean
): Promise<void> {
  if (duplicatesToMerge.length === 0) return;

  console.log('\n🔗 重複タグ統合処理...');

  for (const merge of duplicatesToMerge) {
    console.log(`\n統合先: "${merge.keep.tag_name}" (ID: ${merge.keep.id})`);

    for (const remove of merge.remove) {
      console.log(`  統合元: "${remove.tag_name}" (ID: ${remove.id})`);

      if (!dryRun) {
        await sql.transaction(async (tx) => {
          // 統合元のファイル関連を統合先に一括移動
          await tx`
            INSERT INTO file_tags (file_id, tag_id)
            SELECT file_id, ${merge.keep.id} FROM file_tags WHERE tag_id = ${remove.id}
            ON CONFLICT (file_id, tag_id) DO NOTHING
          `;

          // 統合元のタグ関連を削除
          await tx`DELETE FROM file_tags WHERE tag_id = ${remove.id}`;

          // 統合元のタグを削除
          await tx`DELETE FROM tags WHERE id = ${remove.id}`;
          console.log(`    → 統合完了・削除`);
        });
      } else {
        console.log(`    [ドライラン] 統合予定`);
      }
    }
  }
}

/**
 * メイン処理
 */
async function main(): Promise<void> {
  try {
    // 1. 現在のタグを取得
    console.log('📚 タグ一覧を取得中...');
    const tags = await fetchAllTags();
    console.log(`取得完了: ${tags.length}件のタグ`);

    // 2. 分析
    console.log('\n🔍 クリーンアップ対象を分析中...');
    const result = analyzeCleanup(tags);

    // 3. 分析結果を表示
    printAnalysis(result);

    // 4. 処理対象がない場合は終了
    const hasWork =
      result.tagsToSplit.length > 0 ||
      result.tagsToDelete.length > 0 ||
      result.duplicatesToMerge.length > 0;

    if (!hasWork) {
      console.log('\n✅ クリーンアップ対象はありません。');
      return;
    }

    // 5. ドライランの場合は実行せずに終了
    if (dryRun) {
      console.log('\n⚠️ ドライランモードです。実際に変更を適用するには --execute フラグを追加してください。');
      console.log(`   npx tsx scripts/clean-tags.ts --env ${environment} --execute`);
      return;
    }

    // 6. 実際に処理を実行
    console.log('\n🚀 クリーンアップを実行します...');

    await splitTags(result.tagsToSplit, dryRun);
    await deleteEmptyTags(result.tagsToDelete, dryRun);
    await mergeDuplicateTags(result.duplicatesToMerge, dryRun);

    console.log('\n✅ クリーンアップ完了!');

    // 7. 処理後の状態を表示
    const tagsAfter = await fetchAllTags();
    console.log(`\n📊 処理後のタグ数: ${tagsAfter.length}件`);

  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

main();
