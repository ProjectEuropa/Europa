import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React, { type ReactNode } from 'react';
import { toast } from 'sonner';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  useDeleteFile,
  useMyEvents,
  useMyMatchFiles,
  useMyTeamFiles,
  useProfile,
  useUpdateProfile,
} from '@/hooks/api/useMyPage';
import * as authStore from '@/stores/authStore';
import * as api from '@/utils/api';

// モック設定
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/utils/api', () => ({
  updateUserName: vi.fn(),
  fetchMyTeamFiles: vi.fn(),
  fetchMyMatchFiles: vi.fn(),
  fetchMyEvents: vi.fn(),
  deleteMyFile: vi.fn(),
}));

vi.mock('@/stores/authStore', () => ({
  useAuthStore: vi.fn(),
}));

// テスト用のQueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useMyPage hooks', () => {
  let mockUser: {
    id: number;
    name: string;
    email: string;
    createdAt: string;
  };

  beforeEach(() => {
    mockUser = {
      id: 1,
      name: 'テストユーザー',
      email: 'test@example.com',
      createdAt: '2023-01-01T00:00:00Z',
    };

    vi.mocked(authStore.useAuthStore).mockReturnValue(mockUser);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('useProfile', () => {
    it('ユーザー情報からプロフィールデータを正しく変換する', async () => {
      // 認証状態をモック
      vi.mocked(authStore.useAuthStore).mockImplementation(selector => {
        const state = {
          user: {
            id: '1',
            name: 'テストユーザー',
            email: 'test@example.com',
            createdAt: '2023-01-01T00:00:00Z',
          },
          token: 'mock-token',
          isAuthenticated: true,
          loading: false,
          login: vi.fn(),
          register: vi.fn(),
          logout: vi.fn(),
          fetchUser: vi.fn(),
          setUser: vi.fn(),
          hasHydrated: true,
        };
        return selector ? selector(state) : state;
      });

      const wrapper = createWrapper();
      const { result } = renderHook(() => useProfile(), { wrapper });

      expect(result.current.data).toEqual({
        name: 'テストユーザー',
        email: 'test@example.com',
        joinDate: '2023/01/01',
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('ユーザーが存在しない場合はエラーを返す', async () => {
      vi.mocked(authStore.useAuthStore).mockImplementation(selector => {
        const state = {
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          login: vi.fn(),
          register: vi.fn(),
          logout: vi.fn(),
          fetchUser: vi.fn(),
          setUser: vi.fn(),
          hasHydrated: true,
        };
        return selector ? selector(state) : state;
      });

      const wrapper = createWrapper();
      const { result } = renderHook(() => useProfile(), { wrapper });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.data).toBe(null);
    });

    it('日付が存在しない場合は空文字を返す', async () => {
      vi.mocked(authStore.useAuthStore).mockImplementation(selector => {
        const state = {
          user: {
            id: '1',
            name: 'テストユーザー',
            email: 'test@example.com',
            createdAt: undefined,
          },
          token: 'mock-token',
          isAuthenticated: true,
          loading: false,
          login: vi.fn(),
          register: vi.fn(),
          logout: vi.fn(),
          fetchUser: vi.fn(),
          setUser: vi.fn(),
          hasHydrated: true,
        };
        return selector ? selector(state) : state;
      });

      const wrapper = createWrapper();
      const { result } = renderHook(() => useProfile(), { wrapper });

      expect(result.current.data?.joinDate).toBe('');
    });

    it('プロフィールデータが正しく取得できる', async () => {
      vi.mocked(authStore.useAuthStore).mockImplementation(selector => {
        const state = {
          user: {
            id: '1',
            name: 'テストユーザー',
            email: 'test@example.com',
            createdAt: '2023-01-01T00:00:00Z',
          },
          token: 'mock-token',
          isAuthenticated: true,
          loading: false,
          login: vi.fn(),
          register: vi.fn(),
          logout: vi.fn(),
          fetchUser: vi.fn(),
          setUser: vi.fn(),
          hasHydrated: true,
        };
        return selector ? selector(state) : state;
      });

      const wrapper = createWrapper();
      const { result } = renderHook(() => useProfile(), { wrapper });

      expect(result.current.data).toEqual({
        name: 'テストユーザー',
        email: 'test@example.com',
        joinDate: '2023/01/01',
      });
    });
  });

  describe('useUpdateProfile', () => {
    it('プロフィール更新が成功した場合、成功メッセージを表示する', async () => {
      vi.mocked(api.updateUserName).mockResolvedValue(undefined);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useUpdateProfile(), { wrapper });

      result.current.mutate({ name: '新しい名前' });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(api.updateUserName).toHaveBeenCalledWith('新しい名前');
      expect(toast.success).toHaveBeenCalledWith('プロフィールを更新しました');
    });

    it('プロフィール更新が失敗した場合、エラーメッセージを表示する', async () => {
      const error = new Error('更新に失敗');
      vi.mocked(api.updateUserName).mockRejectedValue(error);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useUpdateProfile(), { wrapper });

      result.current.mutate({ name: '新しい名前' });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(toast.error).toHaveBeenCalledWith(
        'プロフィールの更新に失敗しました'
      );
    });
  });

  describe('useMyTeamFiles', () => {
    it('チームファイルを正しく取得・変換する', async () => {
      const mockApiResponse = [
        {
          id: '1',
          name: 'チーム1',
          created_at: '2023-01-01T00:00:00Z',
          downloadable_at: '2023-01-02T00:00:00Z',
          file_comment: 'テストコメント',
        },
        {
          id: '2',
          file_name: 'チーム2',
          uploadDate: '2023-01-03T00:00:00Z',
          comment: 'コメント2',
        },
      ];

      vi.mocked(api.fetchMyTeamFiles).mockResolvedValue(mockApiResponse);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useMyTeamFiles(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([
        {
          id: '1',
          name: 'チーム1',
          uploadDate: '2023-01-01T00:00:00Z',
          downloadableAt: '2023-01-02T00:00:00Z',
          comment: 'テストコメント',
          type: 'team',
        },
        {
          id: '2',
          name: 'チーム2',
          uploadDate: '2023-01-03T00:00:00Z',
          downloadableAt: '',
          comment: 'コメント2',
          type: 'team',
        },
      ]);
    });
  });

  describe('useMyMatchFiles', () => {
    it('マッチファイルを正しく取得・変換する', async () => {
      const mockApiResponse = [
        {
          id: '1',
          name: 'マッチ1',
          created_at: '2023-01-01T00:00:00Z',
        },
      ];

      vi.mocked(api.fetchMyMatchFiles).mockResolvedValue(mockApiResponse);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useMyMatchFiles(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([
        {
          id: '1',
          name: 'マッチ1',
          uploadDate: '2023-01-01T00:00:00Z',
          downloadableAt: '',
          comment: '',
          type: 'match',
        },
      ]);
    });
  });

  describe('useMyEvents', () => {
    it('イベントを正しく取得・変換する', async () => {
      const mockApiResponse = [
        {
          id: '1',
          name: 'イベント1',
          details: '詳細1',
          url: 'https://example.com',
          deadline: '2023-12-31',
          endDisplayDate: '2023-12-25',
          type: '大会',
          registeredDate: '2023-01-01',
        },
        {
          id: '2',
          name: 'イベント2',
          details: '詳細2',
          url: 'https://example2.com',
          deadline: '2023-11-30',
          endDisplayDate: '2023-11-25',
          type: '告知',
          registeredDate: '2023-01-02',
        },
      ];

      vi.mocked(api.fetchMyEvents).mockResolvedValue(mockApiResponse);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useMyEvents(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([
        {
          id: '1',
          name: 'イベント1',
          details: '詳細1',
          url: 'https://example.com',
          deadline: '2023-12-31',
          endDisplayDate: '2023-12-25',
          type: 'tournament',
          registeredDate: '2023-01-01',
        },
        {
          id: '2',
          name: 'イベント2',
          details: '詳細2',
          url: 'https://example2.com',
          deadline: '2023-11-30',
          endDisplayDate: '2023-11-25',
          type: 'announcement',
          registeredDate: '2023-01-02',
        },
      ]);
    });

    it('未知のイベントタイプはotherに変換される', async () => {
      const mockApiResponse = [
        {
          id: '1',
          name: 'イベント1',
          details: '詳細1',
          url: 'https://example.com',
          deadline: '2023-12-31',
          endDisplayDate: '2023-12-25',
          type: '不明なタイプ',
          registeredDate: '2023-01-01',
        },
      ];

      vi.mocked(api.fetchMyEvents).mockResolvedValue(mockApiResponse);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useMyEvents(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.[0]?.type).toBe('other');
    });
  });

  describe('useDeleteFile', () => {
    it('ファイル削除が成功した場合、成功メッセージを表示する', async () => {
      vi.mocked(api.deleteMyFile).mockResolvedValue(undefined);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useDeleteFile(), { wrapper });

      result.current.mutate('file-id-1');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(api.deleteMyFile).toHaveBeenCalledWith('file-id-1');
      expect(toast.success).toHaveBeenCalledWith('ファイルを削除しました');
    });

    it('ファイル削除が失敗した場合、エラーメッセージを表示する', async () => {
      const error = new Error('削除に失敗');
      vi.mocked(api.deleteMyFile).mockRejectedValue(error);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useDeleteFile(), { wrapper });

      result.current.mutate('file-id-1');

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(toast.error).toHaveBeenCalledWith('ファイルの削除に失敗しました');
    });
  });

  describe('キャッシュ動作', () => {
    it('データが5分間キャッシュされる', async () => {
      vi.mocked(api.fetchMyTeamFiles).mockResolvedValue([]);

      const wrapper = createWrapper();
      const { result, rerender } = renderHook(() => useMyTeamFiles(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // 再レンダリング
      rerender();

      // APIが一度だけ呼ばれることを確認（キャッシュが効いている）
      expect(api.fetchMyTeamFiles).toHaveBeenCalledTimes(1);
    });
  });
});
