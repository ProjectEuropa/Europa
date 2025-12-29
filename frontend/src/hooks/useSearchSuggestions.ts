'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchTags } from '@/lib/api/files';

/**
 * 検索サジェスション用のカスタムフック
 * タグベースのオートコンプリート機能を提供
 */

// クエリキー
export const SUGGESTION_QUERY_KEYS = {
  tags: ['suggestions', 'tags'] as const,
} as const;

interface UseSearchSuggestionsOptions {
  /** 検索クエリ */
  query: string;
  /** 有効/無効フラグ */
  enabled?: boolean;
  /** 最大表示件数 */
  limit?: number;
  /** 最小入力文字数 */
  minQueryLength?: number;
}

export interface SearchSuggestion {
  /** サジェスションの値 */
  value: string;
  /** サジェスションのタイプ */
  type: 'tag' | 'history' | 'popular';
  /** マッチスコア（ソート用） */
  score: number;
}

/**
 * 全タグを取得するフック（キャッシュ付き）
 */
export function useAllTags(enabled = true) {
  return useQuery({
    queryKey: SUGGESTION_QUERY_KEYS.tags,
    queryFn: fetchTags,
    enabled,
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
    gcTime: 10 * 60 * 1000, // 10分間保持
  });
}

/**
 * 検索サジェスションフック
 * クエリに基づいてタグをフィルタリング・ソート
 */
export function useSearchSuggestions({
  query,
  enabled = true,
  limit = 8,
  minQueryLength = 1,
}: UseSearchSuggestionsOptions) {
  const { data: allTags = [], isLoading, error } = useAllTags(enabled);

  // クエリに基づいてサジェスションをフィルタリング・生成
  const filteredSuggestions = useMemo((): SearchSuggestion[] => {
    const trimmedQuery = query.trim().toLowerCase();

    // 最小文字数未満は空配列
    if (trimmedQuery.length < minQueryLength) {
      return [];
    }

    // タグをフィルタリング・スコアリング
    const scoredTags: SearchSuggestion[] = allTags
      .map((tag) => {
        const lowerTag = tag.toLowerCase();
        let score = 0;

        // 完全一致は最高スコア
        if (lowerTag === trimmedQuery) {
          score = 100;
        }
        // 前方一致は高スコア
        else if (lowerTag.startsWith(trimmedQuery)) {
          score = 80 + trimmedQuery.length; // 長いクエリほど高スコア（より具体的）
        }
        // 部分一致
        else if (lowerTag.includes(trimmedQuery)) {
          score = 50 - lowerTag.indexOf(trimmedQuery); // 前方にあるほど高スコア
        }
        // マッチなし
        else {
          score = -1;
        }

        return {
          value: tag,
          type: 'tag' as const,
          score,
        };
      })
      .filter((item) => item.score >= 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return scoredTags;
  }, [query, allTags, limit, minQueryLength]);

  // 人気タグ（クエリが空の時に表示）
  const popularSuggestions = useMemo((): SearchSuggestion[] => {
    if (query.trim().length > 0) {
      return [];
    }

    return allTags.slice(0, limit).map((tag, index) => ({
      value: tag,
      type: 'popular' as const,
      score: limit - index, // インデックス順でスコア付け
    }));
  }, [query, allTags, limit]);

  return {
    /** フィルタリングされたサジェスション */
    suggestions: query.trim().length >= minQueryLength ? filteredSuggestions : popularSuggestions,
    /** 人気タグ（フォーカス時に表示用） */
    popularSuggestions,
    /** ローディング状態 */
    isLoading,
    /** エラー */
    error,
    /** サジェスションが存在するか */
    hasSuggestions: filteredSuggestions.length > 0 || popularSuggestions.length > 0,
  };
}

/**
 * サジェスション内のマッチ部分をハイライト用に分割
 */
export function highlightMatch(
  text: string,
  query: string
): { text: string; isMatch: boolean }[] {
  if (!query.trim()) {
    return [{ text, isMatch: false }];
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase().trim();
  const matchIndex = lowerText.indexOf(lowerQuery);

  if (matchIndex === -1) {
    return [{ text, isMatch: false }];
  }

  const result: { text: string; isMatch: boolean }[] = [];

  // マッチ前の部分
  if (matchIndex > 0) {
    result.push({
      text: text.slice(0, matchIndex),
      isMatch: false,
    });
  }

  // マッチ部分
  result.push({
    text: text.slice(matchIndex, matchIndex + lowerQuery.length),
    isMatch: true,
  });

  // マッチ後の部分
  if (matchIndex + lowerQuery.length < text.length) {
    result.push({
      text: text.slice(matchIndex + lowerQuery.length),
      isMatch: false,
    });
  }

  return result;
}
