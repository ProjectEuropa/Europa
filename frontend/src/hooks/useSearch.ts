import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { filesApi } from '@/lib/api/files';
import type { FileDeleteRequest } from '@/types/file';
import type { SearchParams } from '@/types/search';

/**
 * 検索機能用のカスタムフック
 * React Queryを使用した検索状態管理
 */

// クエリキー定数
export const SEARCH_QUERY_KEYS = {
  teams: (params: SearchParams) => ['search', 'teams', params] as const,
  matches: (params: SearchParams) => ['search', 'matches', params] as const,
  sumDLTeams: (params: SearchParams) =>
    ['search', 'sumDL', 'teams', params] as const,
  sumDLMatches: (params: SearchParams) =>
    ['search', 'sumDL', 'matches', params] as const,
} as const;

/**
 * チーム検索フック
 */
export function useTeamSearch(params: SearchParams) {
  return useQuery({
    queryKey: SEARCH_QUERY_KEYS.teams(params),
    queryFn: () => filesApi.searchTeams(params),
    enabled: true, // 常に実行（空のキーワードでも検索）
    staleTime: 2 * 60 * 1000, // 2分間キャッシュ
    gcTime: 5 * 60 * 1000, // 5分間保持
  });
}

/**
 * マッチ検索フック
 */
export function useMatchSearch(params: SearchParams) {
  return useQuery({
    queryKey: SEARCH_QUERY_KEYS.matches(params),
    queryFn: () => filesApi.searchMatches(params),
    enabled: true, // 常に実行（空のキーワードでも検索）
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * 一括ダウンロード用チーム検索フック
 */
export function useSumDLTeamSearch(params: SearchParams) {
  return useQuery({
    queryKey: SEARCH_QUERY_KEYS.sumDLTeams(params),
    queryFn: () => filesApi.sumDLSearchTeam(params),
    enabled: !!params.keyword.trim(),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * 一括ダウンロード用マッチ検索フック
 */
export function useSumDLMatchSearch(params: SearchParams) {
  return useQuery({
    queryKey: SEARCH_QUERY_KEYS.sumDLMatches(params),
    queryFn: () => filesApi.sumDLSearchMatch(params),
    enabled: !!params.keyword.trim(),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * ファイル削除ミューテーションフック
 */
export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: FileDeleteRequest) =>
      filesApi.deleteSearchFile(request),
    onSuccess: () => {
      // 検索結果のキャッシュを無効化
      queryClient.invalidateQueries({
        queryKey: ['search'],
      });
    },
  });
}

/**
 * 検索結果のキャッシュを手動で無効化するフック
 */
export function useInvalidateSearch() {
  const queryClient = useQueryClient();

  return useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ['search'],
    });
  }, [queryClient]);
}

/**
 * 検索結果のプリフェッチフック
 */
export function usePrefetchSearch() {
  const queryClient = useQueryClient();

  const prefetchTeamSearch = useCallback(
    (params: SearchParams) => {
      if (!params.keyword.trim()) return;

      queryClient.prefetchQuery({
        queryKey: SEARCH_QUERY_KEYS.teams(params),
        queryFn: () => filesApi.searchTeams(params),
        staleTime: 2 * 60 * 1000,
      });
    },
    [queryClient]
  );

  const prefetchMatchSearch = useCallback(
    (params: SearchParams) => {
      if (!params.keyword.trim()) return;

      queryClient.prefetchQuery({
        queryKey: SEARCH_QUERY_KEYS.matches(params),
        queryFn: () => filesApi.searchMatches(params),
        staleTime: 2 * 60 * 1000,
      });
    },
    [queryClient]
  );

  return {
    prefetchTeamSearch,
    prefetchMatchSearch,
  };
}
