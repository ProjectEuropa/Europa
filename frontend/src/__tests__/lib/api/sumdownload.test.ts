import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sumDLSearchTeam, sumDLSearchMatch, sumDownload } from '@/lib/api/sumdownload';

// apiRequestをモック
vi.mock('@/utils/api', () => ({
  apiRequest: vi.fn(),
}));

const mockApiRequest = vi.mocked(await import('@/utils/api')).apiRequest;

describe('sumdownload API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sumDLSearchTeam', () => {
    it('should search team data successfully', async () => {
      const mockResponse = {
        data: [
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
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 1,
      };

      mockApiRequest.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await sumDLSearchTeam('テスト', 1);

      expect(mockApiRequest).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/sumDLSearch/team')
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle search errors', async () => {
      mockApiRequest.mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Server Error' }),
      });

      await expect(sumDLSearchTeam('テスト', 1)).rejects.toThrow();
    });
  });

  describe('sumDLSearchMatch', () => {
    it('should search match data successfully', async () => {
      const mockResponse = {
        data: [
          {
            id: 3,
            file_name: 'テストマッチ1',
            upload_owner_name: 'テストオーナー3',
            created_at: '2024-01-03T10:00:00Z',
            file_comment: 'マッチコメント1',
            downloadable_at: '2024-01-03T10:00:00Z',
          },
        ],
        current_page: 1,
        last_page: 1,
        total: 1,
      };

      mockApiRequest.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await sumDLSearchMatch('マッチテスト', 1);

      expect(mockApiRequest).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/sumDLSearch/match')
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('sumDownload', () => {
    it('should handle empty file ids', async () => {
      await expect(sumDownload([])).rejects.toThrow('ダウンロードするファイルを選択してください');
    });

    it('should handle too many file ids', async () => {
      const tooManyIds = Array.from({ length: 51 }, (_, i) => i + 1);
      await expect(sumDownload(tooManyIds)).rejects.toThrow('一度に選択できるファイルは50個までです');
    });
  });
});