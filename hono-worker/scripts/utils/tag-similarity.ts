/**
 * タグ類似度計算ユーティリティ
 *
 * 機能:
 * - 小書き文字の正規化（ァ→ア、ャ→ヤ等）
 * - レーベンシュタイン距離による類似度計算
 * - 表記揺れの検出
 */

/**
 * 小書き文字（捨て仮名）の正規化マッピング
 */
export const KOGAKI_NORMALIZATION: Record<string, string> = {
    // カタカナ小書き → 通常
    ァ: 'ア',
    ィ: 'イ',
    ゥ: 'ウ',
    ェ: 'エ',
    ォ: 'オ',
    ヵ: 'カ',
    ヶ: 'ケ',
    ッ: 'ツ',
    ャ: 'ヤ',
    ュ: 'ユ',
    ョ: 'ヨ',
    ヮ: 'ワ',
    // ひらがな小書き → 通常
    ぁ: 'あ',
    ぃ: 'い',
    ぅ: 'う',
    ぇ: 'え',
    ぉ: 'お',
    っ: 'つ',
    ゃ: 'や',
    ゅ: 'ゆ',
    ょ: 'よ',
    ゎ: 'わ',
};

/**
 * 長音記号のバリエーション
 */
export const LONG_VOWEL_CHARS = ['ー', '－', '‐', '─', '―', '～', '〜'];

export interface SimilarityResult {
    distance: number;
    similarity: number; // 0.0 - 1.0
    normalizedMatch: boolean; // 正規化後に完全一致
}

/**
 * 基本的な正規化（既存のclean-tags.tsと同じ）
 */
export function normalizeTagName(tagName: string): string {
    return (
        tagName
            .trim()
            .normalize('NFKC') // Unicode正規化
            .toLowerCase()
            // 全角英数字を半角に
            .replace(/[Ａ-Ｚａ-ｚ０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
            // 全角スペースを半角に
            .replace(/　/g, ' ')
    );
}

/**
 * 比較用の拡張正規化（小書き文字・長音記号を含む）
 */
export function normalizeForComparison(tagName: string): string {
    let result = normalizeTagName(tagName);

    // 小書き文字の正規化
    for (const [kogaki, normal] of Object.entries(KOGAKI_NORMALIZATION)) {
        result = result.split(kogaki.toLowerCase()).join(normal.toLowerCase());
    }

    // 長音記号の統一（すべて「ー」に）
    for (const longVowel of LONG_VOWEL_CHARS) {
        result = result.split(longVowel).join('ー');
    }

    return result;
}

/**
 * レーベンシュタイン距離を計算
 */
export function levenshteinDistance(str1: string, str2: string): number {
    const m = str1.length;
    const n = str2.length;

    // 空文字列のケース
    if (m === 0) return n;
    if (n === 0) return m;

    // DPテーブル（メモリ効率のため2行のみ使用）
    let prevRow = Array.from({ length: n + 1 }, (_, i) => i);
    let currRow = new Array<number>(n + 1);

    for (let i = 1; i <= m; i++) {
        currRow[0] = i;

        for (let j = 1; j <= n; j++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            currRow[j] = Math.min(
                prevRow[j] + 1, // 削除
                currRow[j - 1] + 1, // 挿入
                prevRow[j - 1] + cost // 置換
            );
        }

        [prevRow, currRow] = [currRow, prevRow];
    }

    return prevRow[n];
}

/**
 * 2つのタグの類似度を計算
 */
export function calculateSimilarity(tag1: string, tag2: string): SimilarityResult {
    // 正規化（小書き文字を含む）
    const norm1 = normalizeForComparison(tag1);
    const norm2 = normalizeForComparison(tag2);

    // 正規化後に完全一致
    if (norm1 === norm2) {
        return { distance: 0, similarity: 1.0, normalizedMatch: true };
    }

    // レーベンシュタイン距離
    const distance = levenshteinDistance(norm1, norm2);
    const maxLength = Math.max(norm1.length, norm2.length);
    const similarity = maxLength === 0 ? 1.0 : 1 - distance / maxLength;

    return { distance, similarity, normalizedMatch: false };
}

/**
 * 類似タグのペア
 */
export interface SimilarTagPair {
    tag1: {
        id: number;
        tag_name: string;
        file_count: number;
    };
    tag2: {
        id: number;
        tag_name: string;
        file_count: number;
    };
    similarity: SimilarityResult;
}

/**
 * タグリストから類似ペアを検出
 */
export function findSimilarPairs(
    tags: Array<{ id: number; tag_name: string; file_count: number }>,
    threshold: number = 0.7
): {
    normalizedMatches: SimilarTagPair[];
    similarPairs: SimilarTagPair[];
} {
    const normalizedMatches: SimilarTagPair[] = [];
    const similarPairs: SimilarTagPair[] = [];

    // 正規化後の文字列でグルーピング（O(n^2) を避ける最適化）
    const normalizedMap = new Map<
        string,
        Array<{ id: number; tag_name: string; file_count: number }>
    >();

    for (const tag of tags) {
        const normalized = normalizeForComparison(tag.tag_name);
        if (!normalizedMap.has(normalized)) {
            normalizedMap.set(normalized, []);
        }
        normalizedMap.get(normalized)!.push(tag);
    }

    // 正規化後に完全一致するグループを抽出
    for (const group of Array.from(normalizedMap.values())) {
        if (group.length > 1) {
            // 使用回数順にソート
            const sorted = group.sort((a, b) => b.file_count - a.file_count || a.id - b.id);
            const primary = sorted[0];

            for (let i = 1; i < sorted.length; i++) {
                normalizedMatches.push({
                    tag1: sorted[i],
                    tag2: primary,
                    similarity: { distance: 0, similarity: 1.0, normalizedMatch: true },
                });
            }
        }
    }

    // 正規化後に一致しないが類似度が高いペアを検出
    const normalizedKeys = Array.from(normalizedMap.keys());
    for (let i = 0; i < normalizedKeys.length; i++) {
        for (let j = i + 1; j < normalizedKeys.length; j++) {
            const key1 = normalizedKeys[i];
            const key2 = normalizedKeys[j];

            const similarity = calculateSimilarity(key1, key2);

            if (!similarity.normalizedMatch && similarity.similarity >= threshold) {
                const group1 = normalizedMap.get(key1)!;
                const group2 = normalizedMap.get(key2)!;

                // 各グループの代表（使用回数最多）を比較
                const rep1 = group1.sort((a, b) => b.file_count - a.file_count || a.id - b.id)[0];
                const rep2 = group2.sort((a, b) => b.file_count - a.file_count || a.id - b.id)[0];

                similarPairs.push({
                    tag1: rep1,
                    tag2: rep2,
                    similarity,
                });
            }
        }
    }

    // 類似度順にソート
    similarPairs.sort((a, b) => b.similarity.similarity - a.similarity.similarity);

    return { normalizedMatches, similarPairs };
}
