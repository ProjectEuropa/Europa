import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  sumDLSearchTeam,
  sumDLSearchMatch,
  sumDownload,
} from '@/lib/api/sumdownload';
import { apiClient } from '@/lib/api/client';

// apiClientをモック
vi.mock('@/lib/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    download: vi.fn(),
  },
}));

describe('sumdownload API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('sumDLSearchTeam', () => {
    it('should search team data successfully', async () => {
      const mockResponse = {
        files: [
          {
            id: 1,
            file_name: 'テストファイル1',
            upload_owner_name: 'テストオーナー',
            created_at: '2024-01-01T10:00:00Z',
            file_comment: 'テストコメント',
            downloadable_at: '2024-01-01T10:00:00Z',
            search_tag1: 'タグ1',
            search_tag2: null,
            search_tag3: null,
            search_tag4: null,
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
        },
      };

      // apiClient.get はレスポンスデータを直接返すようにモックする（実装依存）
      // 実装では response.data || response を返している
      (apiClient.get as any).mockResolvedValueOnce({ data: mockResponse });

      const result = await sumDLSearchTeam('テスト', 1);

      expect(apiClient.get).toHaveBeenCalledWith(
        `/api/v2/files?data_type=1&limit=50&page=1&keyword=${encodeURIComponent("テスト")}&sort_order=desc`
      );
      expect(result).toEqual({
        data: [
          {
            id: 1,
            file_name: 'テストファイル1',
            upload_owner_name: 'テストオーナー',
            created_at: '2024-01-01T10:00:00Z',
            file_comment: 'テストコメント',
            downloadable_at: '2024-01-01T10:00:00Z',
            file_size: undefined,
          },
        ],
        current_page: 1,
        last_page: 1,
        total: 1,
      });
    });

    it('should handle search errors', async () => {
      (apiClient.get as any).mockRejectedValue(new Error('Server Error'));

      await expect(sumDLSearchTeam('テスト', 1)).rejects.toThrow();
    });
  });

  describe('sumDLSearchTeam with sortOrder', () => {
    it('should include sort_order parameter when provided', async () => {
      const mockResponse = {
        files: [
          {
            id: 1,
            file_name: 'テストファイル1',
            upload_owner_name: 'テストオーナー',
            created_at: '2024-01-01T10:00:00Z',
            file_comment: 'テストコメント',
            downloadable_at: '2024-01-01T10:00:00Z',
            search_tag1: 'タグ1',
          },
        ],
        pagination: {
          page: 1,
          limit: 50,
          total: 1,
        },
      };

      (apiClient.get as any).mockResolvedValueOnce({ data: mockResponse });

      await sumDLSearchTeam('テスト', 1, 'asc');

      expect(apiClient.get).toHaveBeenCalledWith(
        `/api/v2/files?data_type=1&limit=50&page=1&keyword=${encodeURIComponent("テスト")}&sort_order=asc`
      );
    });

    it('should default to desc when sortOrder is not provided', async () => {
      const mockResponse = {
        files: [],
        pagination: { page: 1, limit: 50, total: 0 },
      };

      (apiClient.get as any).mockResolvedValueOnce({ data: mockResponse });

      await sumDLSearchTeam('テスト', 1);

      expect(apiClient.get).toHaveBeenCalledWith(
        `/api/v2/files?data_type=1&limit=50&page=1&keyword=${encodeURIComponent("テスト")}&sort_order=desc`
      );
    });
  });

  describe('sumDLSearchMatch', () => {
    it('should search match data successfully', async () => {
      const mockResponse = {
        files: [
          {
            id: 3,
            file_name: 'テストマッチ1',
            upload_owner_name: 'テストオーナー3',
            created_at: '2024-01-03T10:00:00Z',
            file_comment: 'マッチコメント1',
            downloadable_at: '2024-01-03T10:00:00Z',
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
        },
      };

      (apiClient.get as any).mockResolvedValueOnce({ data: mockResponse });

      const result = await sumDLSearchMatch('マッチテスト', 1);

      expect(apiClient.get).toHaveBeenCalledWith(
        `/api/v2/files?data_type=2&limit=50&page=1&keyword=${encodeURIComponent("マッチテスト")}&sort_order=desc`
      );
      expect(result).toEqual({
        data: [
          {
            id: 3,
            file_name: 'テストマッチ1',
            upload_owner_name: 'テストオーナー3',
            created_at: '2024-01-03T10:00:00Z',
            file_comment: 'マッチコメント1',
            downloadable_at: '2024-01-03T10:00:00Z',
            file_size: undefined,
            search_tag1: undefined,
            search_tag2: undefined,
            search_tag3: undefined,
            search_tag4: undefined,
          },
        ],
        current_page: 1,
        last_page: 1,
        total: 1,
      });
    });
  });

  describe('sumDLSearchMatch with sortOrder', () => {
    it('should include sort_order parameter when provided', async () => {
      const mockResponse = {
        files: [
          {
            id: 3,
            file_name: 'テストマッチ1',
            upload_owner_name: 'テストオーナー3',
            created_at: '2024-01-03T10:00:00Z',
            file_comment: 'マッチコメント1',
            downloadable_at: '2024-01-03T10:00:00Z',
          },
        ],
        pagination: {
          page: 1,
          limit: 50,
          total: 1,
        },
      };

      (apiClient.get as any).mockResolvedValueOnce({ data: mockResponse });

      await sumDLSearchMatch('マッチ', 1, 'asc');

      expect(apiClient.get).toHaveBeenCalledWith(
        `/api/v2/files?data_type=2&limit=50&page=1&keyword=${encodeURIComponent("マッチ")}&sort_order=asc`
      );
    });

    it('should default to desc when sortOrder is not provided', async () => {
      const mockResponse = {
        files: [],
        pagination: { page: 1, limit: 50, total: 0 },
      };

      (apiClient.get as any).mockResolvedValueOnce({ data: mockResponse });

      await sumDLSearchMatch('マッチ', 1);

      expect(apiClient.get).toHaveBeenCalledWith(
        `/api/v2/files?data_type=2&limit=50&page=1&keyword=${encodeURIComponent("マッチ")}&sort_order=desc`
      );
    });
  });

  describe('sumDownload', () => {
    beforeEach(() => {
      // DOMのモック設定
      Object.defineProperty(window, 'URL', {
        value: {
          createObjectURL: vi.fn(() => 'blob:mock-url'),
          revokeObjectURL: vi.fn(),
        },
        writable: true,
      });

      // document.createElementとaddEventListenerのモック
      const mockElement = {
        href: '',
        download: '',
        click: vi.fn(),
        style: {
          display: '',
        },
        parentNode: document.documentElement,
      };

      vi.spyOn(document, 'createElement').mockReturnValue(mockElement as any);
      vi.spyOn(document.body, 'appendChild').mockImplementation(
        () => mockElement as any
      );
      vi.spyOn(document.body, 'removeChild').mockImplementation(
        () => mockElement as any
      );
      vi.spyOn(document.documentElement, 'appendChild').mockImplementation(
        () => mockElement as any
      );
    });

    it('should handle empty file ids', async () => {
      await expect(sumDownload([])).rejects.toThrow(
        'ダウンロードするファイルを選択してください'
      );
    });

    it('should handle too many file ids', async () => {
      const tooManyIds = Array.from({ length: 51 }, (_, i) => i + 1);
      await expect(sumDownload(tooManyIds)).rejects.toThrow(
        '一度に選択できるファイルは50個までです'
      );
    });

    it('should successfully download files', async () => {
      const mockBlob = new Blob(['test file content'], {
        type: 'application/zip',
      });

      // apiClient.downloadは現在DownloadResultを返す
      (apiClient.download as any).mockResolvedValue({
        blob: mockBlob,
        filename: 'test_files.zip',
        headers: new Headers(),
      });

      const fileIds = [1, 2, 3];
      await sumDownload(fileIds);

      expect(apiClient.download).toHaveBeenCalledWith("/api/v2/files/bulk-download", {
        fileIds: fileIds,
      });

      // ダウンロード処理が実行されることを確認
      expect(window.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(document.documentElement.appendChild).toHaveBeenCalled();
    });

    it('should handle download API errors', async () => {
      (apiClient.download as any).mockRejectedValue(new Error('Download failed'));

      await expect(sumDownload([1, 2])).rejects.toThrow('Download failed');
    });
  });
});

