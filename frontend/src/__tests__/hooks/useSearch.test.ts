import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  SEARCH_QUERY_KEYS,
  useDeleteFile,
  useMatchSearch,
  useTeamSearch,
} from '@/hooks/useSearch';
import { filesApi } from '@/lib/api/files';
import type {
  MatchSearchResult,
  SearchParams,
  TeamSearchResult,
} from '@/types/search';

// APIをモック
vi.mock('@/lib/api/files', () => ({
  filesApi: {
    searchTeams: vi.fn(),
    searchMatches: vi.fn(),
    sumDLSearchTeam: vi.fn(),
    sumDLSearchMatch: vi.fn(),
    deleteSearchFile: vi.fn(),
  },
}));

// テスト用のQueryClientプロバイダー
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  };

  return Wrapper;
};

describe('useSearch hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('SEARCH_QUERY_KEYS', () => {
    it('should generate correct query keys', () => {
      const params: SearchParams = { keyword: 'test', page: 1 };

      expect(SEARCH_QUERY_KEYS.teams(params)).toEqual([
        'search',
        'teams',
        params,
      ]);
      expect(SEARCH_QUERY_KEYS.matches(params)).toEqual([
        'search',
        'matches',
        params,
      ]);
      expect(SEARCH_QUERY_KEYS.sumDLTeams(params)).toEqual([
        'search',
        'sumDL',
        'teams',
        params,
      ]);
      expect(SEARCH_QUERY_KEYS.sumDLMatches(params)).toEqual([
        'search',
        'sumDL',
        'matches',
        params,
      ]);
    });
  });

  describe('useTeamSearch', () => {
    it('should fetch team search results successfully', async () => {
      const mockResult: TeamSearchResult = {
        data: [
          {
            id: 1,
            name: 'test-team.oke',
            ownerName: 'testuser',
            comment: 'Test team file',
            downloadableAt: '2024-01-01T00:00:00Z',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            searchTag1: 'team',
            searchTag2: null,
            searchTag3: null,
            searchTag4: null,
            type: 'team',
          },
        ],
        meta: {
          currentPage: 1,
          lastPage: 1,
          perPage: 10,
          total: 1,
        },
      };

      vi.mocked(filesApi.searchTeams).mockResolvedValueOnce(mockResult);

      const { result } = renderHook(
        () => useTeamSearch({ keyword: 'test', page: 1 }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResult);
      expect(filesApi.searchTeams).toHaveBeenCalledWith({
        keyword: 'test',
        page: 1,
      });
    });

    it('should fetch even when keyword is empty', async () => {
      const mockResult: TeamSearchResult = {
        data: [],
        meta: {
          currentPage: 1,
          lastPage: 1,
          perPage: 10,
          total: 0,
        },
      };

      vi.mocked(filesApi.searchTeams).mockResolvedValueOnce(mockResult);

      const { result } = renderHook(
        () => useTeamSearch({ keyword: '', page: 1 }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResult);
      expect(filesApi.searchTeams).toHaveBeenCalledWith({
        keyword: '',
        page: 1,
      });
    });

    it('should handle search errors', async () => {
      const error = new Error('Search failed');
      vi.mocked(filesApi.searchTeams).mockRejectedValueOnce(error);

      const { result } = renderHook(
        () => useTeamSearch({ keyword: 'test', page: 1 }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useMatchSearch', () => {
    it('should fetch match search results successfully', async () => {
      const mockResult: MatchSearchResult = {
        data: [
          {
            id: 1,
            name: 'test-match.oke',
            ownerName: 'testuser',
            comment: 'Test match file',
            downloadableAt: '2024-01-01T00:00:00Z',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            searchTag1: 'match',
            searchTag2: null,
            searchTag3: null,
            searchTag4: null,
            type: 'match',
          },
        ],
        meta: {
          currentPage: 1,
          lastPage: 1,
          perPage: 10,
          total: 1,
        },
      };

      vi.mocked(filesApi.searchMatches).mockResolvedValueOnce(mockResult);

      const { result } = renderHook(
        () => useMatchSearch({ keyword: 'test', page: 1 }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResult);
      expect(filesApi.searchMatches).toHaveBeenCalledWith({
        keyword: 'test',
        page: 1,
      });
    });
  });

  describe('useDeleteFile', () => {
    it('should delete file successfully', async () => {
      const mockResponse = { success: true, message: 'File deleted' };
      vi.mocked(filesApi.deleteSearchFile).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useDeleteFile(), {
        wrapper: createWrapper(),
      });

      const deleteRequest = { id: 1, deletePassword: 'password123' };

      await result.current.mutateAsync(deleteRequest);

      expect(filesApi.deleteSearchFile).toHaveBeenCalledWith(deleteRequest);
    });

    it('should handle delete errors', async () => {
      const error = new Error('Delete failed');
      vi.mocked(filesApi.deleteSearchFile).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useDeleteFile(), {
        wrapper: createWrapper(),
      });

      const deleteRequest = { id: 1, deletePassword: 'password123' };

      await expect(result.current.mutateAsync(deleteRequest)).rejects.toThrow(
        'Delete failed'
      );
    });
  });

  describe('caching behavior', () => {
    it('should cache search results', async () => {
      const mockResult: TeamSearchResult = {
        data: [],
        meta: {
          currentPage: 1,
          lastPage: 1,
          perPage: 10,
          total: 0,
        },
      };

      vi.mocked(filesApi.searchTeams).mockResolvedValueOnce(mockResult);

      const wrapper = createWrapper();

      // 最初のレンダリング
      const { result: result1 } = renderHook(
        () => useTeamSearch({ keyword: 'test', page: 1 }),
        { wrapper }
      );

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
      });

      // 同じパラメータで2回目のレンダリング
      const { result: result2 } = renderHook(
        () => useTeamSearch({ keyword: 'test', page: 1 }),
        { wrapper }
      );

      // キャッシュから取得されるため、APIは1回だけ呼ばれる
      expect(filesApi.searchTeams).toHaveBeenCalledTimes(1);
      expect(result2.current.data).toEqual(mockResult);
    });
  });
});
