import { type NeonQueryFunction, neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import {
    findSimilarPairs,
    normalizeForComparison,
    type SimilarTagPair,
} from './utils/tag-similarity';

/**
 * タグ統合スクリプト
 *
 * 機能:
 * 1. find-similar: 類似タグをリストアップ
 * 2. merge: 手動でタグを統合（source → target）
 * 3. suggest: 高類似度のペアを自動提案
 *
 * 使い方:
 *   npx tsx scripts/merge-tags.ts find-similar --env staging
 *   npx tsx scripts/merge-tags.ts merge "チァーイカ" "チャーイカ" --env staging
 *   npx tsx scripts/merge-tags.ts merge "チァーイカ" "チャーイカ" --env staging --execute
 *   npx tsx scripts/merge-tags.ts suggest --env staging --threshold 0.8
 */

// ========================================
// CLI引数のパース
// ========================================

interface CliArgs {
    command: 'find-similar' | 'merge' | 'suggest' | 'help';
    environment: 'staging' | 'production';
    dryRun: boolean;
    threshold: number;
    sourceTag?: string;
    targetTag?: string;
}

function parseArgs(): CliArgs {
    const args = process.argv.slice(2);
    const command = args[0] as CliArgs['command'] | undefined;

    if (!command || command === 'help' || args.includes('--help')) {
        return { command: 'help', environment: 'staging', dryRun: true, threshold: 0.7 };
    }

    const envIndex = args.indexOf('--env');
    const environment =
        envIndex !== -1 && args[envIndex + 1]
            ? (args[envIndex + 1] as CliArgs['environment'])
            : 'staging';

    const thresholdIndex = args.indexOf('--threshold');
    const threshold =
        thresholdIndex !== -1 && args[thresholdIndex + 1]
            ? parseFloat(args[thresholdIndex + 1])
            : 0.7;

    const dryRun = !args.includes('--execute');

    // merge コマンドの引数を取得
    let sourceTag: string | undefined;
    let targetTag: string | undefined;

    if (command === 'merge') {
        // merge "source" "target" の形式
        // オプションとその値を除外してタグ名を取得
        const optionValues = new Set([environment, String(threshold)]);
        const mergeArgs = args
            .slice(1)
            .filter(arg => !arg.startsWith('--') && !optionValues.has(arg));
        sourceTag = mergeArgs[0];
        targetTag = mergeArgs[1];
    }

    return {
        command: command as CliArgs['command'],
        environment,
        dryRun,
        threshold,
        sourceTag,
        targetTag,
    };
}

function printHelp(): void {
    console.log(`
タグ統合スクリプト

使い方:
  npx tsx scripts/merge-tags.ts <command> [options]

コマンド:
  find-similar              類似タグを検出して表示
  merge <source> <target>   タグを統合（source → target）
  suggest                   自動提案モード（高類似度のペアを表示）
  help                      このヘルプを表示

オプション:
  --env <staging|production>   環境指定（デフォルト: staging）
  --execute                    実際に実行（デフォルトはドライラン）
  --threshold <0.0-1.0>        類似度の閾値（デフォルト: 0.7）

例:
  # 類似タグの一覧表示（ドライラン）
  npx tsx scripts/merge-tags.ts find-similar --env staging

  # 類似度閾値を下げて検索
  npx tsx scripts/merge-tags.ts find-similar --env staging --threshold 0.6

  # 手動統合（ドライラン）
  npx tsx scripts/merge-tags.ts merge "チァーイカ" "チャーイカ" --env staging

  # 手動統合（実行）
  npx tsx scripts/merge-tags.ts merge "チァーイカ" "チャーイカ" --env staging --execute
`);
}

// ========================================
// DB接続
// ========================================

interface Tag {
    id: number;
    tag_name: string;
    file_count: number;
}

function setupDatabase(environment: string): NeonQueryFunction<false, false> {
    const envFile = environment === 'production' ? '.env.production.migration' : '.env.migration';

    dotenv.config({ path: envFile });

    if (!process.env.NEON_DATABASE_URL) {
        console.error('エラー: 環境変数 NEON_DATABASE_URL が設定されていません。');
        console.error(`設定ファイル: ${envFile}`);
        process.exit(1);
    }

    return neon(process.env.NEON_DATABASE_URL);
}

async function fetchAllTags(sql: NeonQueryFunction<false, false>): Promise<Tag[]> {
    return (await sql`
    SELECT
      t.id,
      t.tag_name,
      COUNT(ft.file_id)::int as file_count
    FROM tags t
    LEFT JOIN file_tags ft ON t.id = ft.tag_id
    GROUP BY t.id, t.tag_name
    ORDER BY t.tag_name
  `) as Tag[];
}

async function fetchTagByName(
    sql: NeonQueryFunction<false, false>,
    tagName: string
): Promise<Tag | null> {
    const result = (await sql`
    SELECT
      t.id,
      t.tag_name,
      COUNT(ft.file_id)::int as file_count
    FROM tags t
    LEFT JOIN file_tags ft ON t.id = ft.tag_id
    WHERE t.tag_name = ${tagName}
    GROUP BY t.id, t.tag_name
  `) as Tag[];

    return result.length > 0 ? result[0] : null;
}

// ========================================
// find-similar コマンド
// ========================================

async function commandFindSimilar(
    sql: NeonQueryFunction<false, false>,
    threshold: number
): Promise<void> {
    console.log('📚 タグ一覧を取得中...');
    const tags = await fetchAllTags(sql);
    console.log(`取得完了: ${tags.length}件のタグ\n`);

    console.log('🔍 類似タグを検出中...');
    const { normalizedMatches, similarPairs } = findSimilarPairs(tags, threshold);

    printSimilarityReport(normalizedMatches, similarPairs, threshold);
}

function printSimilarityReport(
    normalizedMatches: SimilarTagPair[],
    similarPairs: SimilarTagPair[],
    threshold: number
): void {
    console.log('\n' + '='.repeat(60));
    console.log('📊 類似タグ分析結果');
    console.log('='.repeat(60));

    // 正規化で一致するタグ
    console.log('\n【小書き文字の正規化で一致するタグ】');
    if (normalizedMatches.length === 0) {
        console.log('  なし');
    } else {
        for (const pair of normalizedMatches) {
            const source = pair.tag1;
            const target = pair.tag2;
            console.log(
                `  ✓ "${source.tag_name}" (使用: ${source.file_count}件) → "${target.tag_name}" (使用: ${target.file_count}件)`
            );
        }
    }

    // 高類似度タグ
    console.log(`\n【高類似度タグ（${threshold}以上）】`);
    if (similarPairs.length === 0) {
        console.log('  なし');
    } else {
        for (const pair of similarPairs) {
            const sim = (pair.similarity.similarity * 100).toFixed(0);
            console.log(
                `  ⚠️ "${pair.tag1.tag_name}" (使用: ${pair.tag1.file_count}件) ↔ "${pair.tag2.tag_name}" (使用: ${pair.tag2.file_count}件) [類似度: ${sim}%]`
            );
        }
    }

    // サマリ
    console.log('\n' + '='.repeat(60));
    console.log('📈 サマリ');
    console.log(`  小書き文字の正規化一致: ${normalizedMatches.length}件`);
    console.log(`  高類似度ペア: ${similarPairs.length}件`);
    console.log('='.repeat(60));
}

// ========================================
// merge コマンド
// ========================================

interface MergeResult {
    sourceTag: Tag;
    targetTag: Tag;
    affectedFiles: number;
    duplicateSkipped: number;
}

async function commandMerge(
    sql: NeonQueryFunction<false, false>,
    sourceTagName: string,
    targetTagName: string,
    dryRun: boolean
): Promise<MergeResult | null> {
    console.log('🔍 タグを検索中...\n');

    // 両方のタグを取得
    const [sourceTag, targetTag] = await Promise.all([
        fetchTagByName(sql, sourceTagName),
        fetchTagByName(sql, targetTagName),
    ]);

    if (!sourceTag) {
        console.error(`❌ 統合元タグが見つかりません: "${sourceTagName}"`);

        // 類似タグを提案
        const tags = await fetchAllTags(sql);
        const normalized = normalizeForComparison(sourceTagName);
        const candidates = tags.filter(t => normalizeForComparison(t.tag_name) === normalized);
        if (candidates.length > 0) {
            console.log('\n💡 類似タグが見つかりました:');
            for (const c of candidates) {
                console.log(`   "${c.tag_name}" (使用: ${c.file_count}件)`);
            }
        }
        return null;
    }

    if (!targetTag) {
        console.error(`❌ 統合先タグが見つかりません: "${targetTagName}"`);

        // 類似タグを提案
        const tags = await fetchAllTags(sql);
        const normalized = normalizeForComparison(targetTagName);
        const candidates = tags.filter(t => normalizeForComparison(t.tag_name) === normalized);
        if (candidates.length > 0) {
            console.log('\n💡 類似タグが見つかりました:');
            for (const c of candidates) {
                console.log(`   "${c.tag_name}" (使用: ${c.file_count}件)`);
            }
        }
        return null;
    }

    if (sourceTag.id === targetTag.id) {
        console.error('❌ 統合元と統合先が同じタグです');
        return null;
    }

    console.log('📋 統合情報');
    console.log('='.repeat(40));
    console.log(
        `  統合元: "${sourceTag.tag_name}" (ID: ${sourceTag.id}, 使用: ${sourceTag.file_count}件)`
    );
    console.log(
        `  統合先: "${targetTag.tag_name}" (ID: ${targetTag.id}, 使用: ${targetTag.file_count}件)`
    );
    console.log('='.repeat(40));

    // 統合元タグに関連するファイルを取得
    const sourceFileTags = (await sql`
    SELECT file_id FROM file_tags WHERE tag_id = ${sourceTag.id}
  `) as Array<{ file_id: number }>;

    // 既に統合先タグを持つファイルを確認
    const targetFileTags = (await sql`
    SELECT file_id FROM file_tags WHERE tag_id = ${targetTag.id}
  `) as Array<{ file_id: number }>;

    const targetFileIds = new Set(targetFileTags.map(ft => ft.file_id));
    const toMove = sourceFileTags.filter(ft => !targetFileIds.has(ft.file_id));
    const duplicates = sourceFileTags.length - toMove.length;

    console.log(`\n📊 影響範囲`);
    console.log(`  移動するファイル関連: ${toMove.length}件`);
    console.log(`  重複スキップ: ${duplicates}件`);

    if (!dryRun) {
        console.log('\n🚀 統合を実行中...');

        // file_tagsを統合先に移動
        if (toMove.length > 0) {
            const fileIds = toMove.map(ft => ft.file_id);
            await sql`
        INSERT INTO file_tags (file_id, tag_id, created_at)
        SELECT unnest(${fileIds}::int[]), ${targetTag.id}, NOW()
        ON CONFLICT (file_id, tag_id) DO NOTHING
      `;
            console.log(`  ✓ ${toMove.length}件のファイル関連を移動`);
        }

        // 統合元タグを削除（CASCADE制約でfile_tagsも自動削除）
        await sql`DELETE FROM tags WHERE id = ${sourceTag.id}`;
        console.log(`  ✓ 統合元タグ "${sourceTag.tag_name}" を削除`);

        console.log(`\n✅ 統合完了: "${sourceTag.tag_name}" → "${targetTag.tag_name}"`);
    } else {
        console.log(
            '\n⚠️ ドライランモードです。実際に統合するには --execute フラグを追加してください。'
        );
    }

    return {
        sourceTag,
        targetTag,
        affectedFiles: toMove.length,
        duplicateSkipped: duplicates,
    };
}

// ========================================
// suggest コマンド
// ========================================

async function commandSuggest(
    sql: NeonQueryFunction<false, false>,
    threshold: number,
    dryRun: boolean
): Promise<void> {
    console.log('📚 タグ一覧を取得中...');
    const tags = await fetchAllTags(sql);
    console.log(`取得完了: ${tags.length}件のタグ\n`);

    console.log('🔍 類似タグを検出中...');
    const { normalizedMatches, similarPairs } = findSimilarPairs(tags, threshold);

    printSimilarityReport(normalizedMatches, similarPairs, threshold);

    // 正規化で一致するタグを自動統合
    if (normalizedMatches.length > 0) {
        console.log('\n🔧 小書き文字の正規化一致タグを統合中...\n');

        for (const pair of normalizedMatches) {
            const source = pair.tag1;
            const target = pair.tag2;

            console.log(`  "${source.tag_name}" → "${target.tag_name}"`);

            if (!dryRun) {
                await commandMerge(sql, source.tag_name, target.tag_name, false);
            }
        }

        if (dryRun) {
            console.log(
                '\n⚠️ ドライランモードです。実際に統合するには --execute フラグを追加してください。'
            );
        }
    }

    // 高類似度タグについてはアドバイスを表示
    if (similarPairs.length > 0) {
        console.log('\n💡 高類似度タグは手動で確認してください:');
        for (const pair of similarPairs) {
            console.log(
                `   npx tsx scripts/merge-tags.ts merge "${pair.tag1.tag_name}" "${pair.tag2.tag_name}" --env <env> --execute`
            );
        }
    }
}

// ========================================
// メイン処理
// ========================================

async function main(): Promise<void> {
    const args = parseArgs();

    if (args.command === 'help') {
        printHelp();
        return;
    }

    console.log('='.repeat(60));
    console.log('タグ統合スクリプト');
    console.log('='.repeat(60));
    console.log(`コマンド: ${args.command}`);
    console.log(`環境: ${args.environment}`);
    console.log(`モード: ${args.dryRun ? 'ドライラン' : '実行モード'}`);
    console.log(`類似度閾値: ${args.threshold}`);
    console.log('='.repeat(60));
    console.log('');

    const sql = setupDatabase(args.environment);

    try {
        switch (args.command) {
            case 'find-similar':
                await commandFindSimilar(sql, args.threshold);
                break;

            case 'merge':
                if (!args.sourceTag || !args.targetTag) {
                    console.error('❌ 統合元と統合先のタグ名を指定してください。');
                    console.error(
                        '   例: npx tsx scripts/merge-tags.ts merge "チァーイカ" "チャーイカ" --env staging'
                    );
                    process.exit(1);
                }
                await commandMerge(sql, args.sourceTag, args.targetTag, args.dryRun);
                break;

            case 'suggest':
                await commandSuggest(sql, args.threshold, args.dryRun);
                break;

            default:
                console.error(`❌ 不明なコマンド: ${args.command}`);
                printHelp();
                process.exit(1);
        }
    } catch (error) {
        console.error('\n❌ エラーが発生しました:', error);
        process.exit(1);
    }
}

main();
