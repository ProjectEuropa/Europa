import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { filesApi } from '@/lib/api/files';
import { apiClient } from '@/lib/api/client';
import type { SearchParams } from '@/types/search';
import type { FileUploadOptions } from '@/types/file';

// APIクライアントをモック
vi.mock('@/lib/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    upload: vi.fn(),
  },
}));

// グローバルfetchをモック
const mockFetch = vi.fn();
global.fetch = mockFetch;

// localStorageのモック
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

// window.openをモック
Object.defineProperty(window, 'open', {
  value: vi.fn(),
  writable: true,
});

// URL.createObjectURLをモック
Object.defineProperty(window.URL, 'createObjectURL', {
  value: vi.fn(() => 'mock-url'),
  writable: true,
});

Object.defineProperty(window.URL, 'revokeObjectURL', {
  value: vi.fn(),
  writable: true,
});

// document.createElementをモック
const mockAnchor = {
  href: '',
  download: '',
  click: vi.fn(),
};
Object.defineProperty(document, 'createElement', {
  value: vi.fn(() => mockAnchor),
  writable: true,
});

Object.defineProperty(document.body, 'appendChild', {
  value: vi.fn(),
  writable: true,
});

Object.defineProperty(document.body, 'removeChild', {
  value: vi.fn(),
  writable: true,
});

describe('filesApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_API_BASE_URL = 'https://test-api.com';
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('searchTeams', () => {
    it('should search teams successfully', async () => {
      const params: SearchParams = { keyword: 'test', page: 1 };
      const mockResponse = {
        data: {
          data: [
            { id: 1, file_name: 'Team 1', upload_owner_name: 'Owner 1' },
            { id: 2, file_name: 'Team 2', upload_owner_name: 'Owner 2' },
          ],
          meta: { currentPage: 1, lastPage: 1, total: 2 },
        },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await filesApi.searchTeams(params);

      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/search/team?keyword=test&page=1');
      expect(result).toEqual({
        data: [
          {
            id: 1,
            file_name: 'Team 1',
            upload_owner_name: 'Owner 1',
            name: 'Team 1',
            ownerName: 'Owner 1',
            comment: '',
            downloadableAt: '',
            createdAt: '',
            updatedAt: undefined,
            searchTag1: undefined,
            searchTag2: undefined,
            searchTag3: undefined,
            searchTag4: undefined,
            upload_type: undefined,
            type: 'team',
          },
          {
            id: 2,
            file_name: 'Team 2',
            upload_owner_name: 'Owner 2',
            name: 'Team 2',
            ownerName: 'Owner 2',
            comment: '',
            downloadableAt: '',
            createdAt: '',
            updatedAt: undefined,
            searchTag1: undefined,
            searchTag2: undefined,
            searchTag3: undefined,
            searchTag4: undefined,
            upload_type: undefined,
            type: 'team',
          },
        ],
        meta: {
          currentPage: 1,
          lastPage: 1,
          perPage: 10,
          total: 0,
        },
      });
    });

    it('should handle special characters in keyword', async () => {
      const params: SearchParams = { keyword: 'test & special', page: 1 };

      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: { data: [], meta: {} } });

      await filesApi.searchTeams(params);

      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/search/team?keyword=test%20%26%20special&page=1');
    });
  });

  describe('searchMatches', () => {
    it('should search matches successfully', async () => {
      const params: SearchParams = { keyword: 'match', page: 2 };
      const mockResponse = {
        data: {
          data: [{ id: 1, file_name: 'Match 1', upload_owner_name: 'Owner 1' }],
          meta: { currentPage: 2, lastPage: 3, total: 10 },
        },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await filesApi.searchMatches(params);

      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/search/match?keyword=match&page=2');
      expect(result).toEqual({
        data: [
          {
            id: 1,
            file_name: 'Match 1',
            upload_owner_name: 'Owner 1',
            name: 'Match 1',
            ownerName: 'Owner 1',
            comment: '',
            downloadableAt: '',
            createdAt: '',
            updatedAt: undefined,
            searchTag1: undefined,
            searchTag2: undefined,
            searchTag3: undefined,
            searchTag4: undefined,
            upload_type: undefined,
            type: 'match',
          },
        ],
        meta: {
          currentPage: 1,
          lastPage: 1,
          perPage: 10,
          total: 0,
        },
      });
    });
  });

  describe('uploadTeamFile', () => {
    it('should upload team file for authenticated user', async () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const options: FileUploadOptions = {
        ownerName: 'Test Owner',
        comment: 'Test comment',
        tags: ['tag1', 'tag2'],
        downloadDate: '2024-12-31',
      };

      const mockResponse = {
        data: { success: true, fileId: 123 },
      };

      vi.mocked(apiClient.upload).mockResolvedValueOnce(mockResponse);

      const result = await filesApi.uploadTeamFile(file, true, options);

      expect(apiClient.upload).toHaveBeenCalledWith('/api/v1/team/upload', expect.any(FormData));
      expect(result).toEqual(mockResponse.data);
    });

    it('should upload team file for unauthenticated user', async () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const options: FileUploadOptions = {
        ownerName: 'Test Owner',
        deletePassword: 'password123',
      };

      const mockResponse = {
        data: { success: true, fileId: 123 },
      };

      vi.mocked(apiClient.upload).mockResolvedValueOnce(mockResponse);

      const result = await filesApi.uploadTeamFile(file, false, options);

      expect(apiClient.upload).toHaveBeenCalledWith('/api/v1/team/simpleupload', expect.any(FormData));
      expect(result).toEqual(mockResponse.data);
    });

    it('should upload team file without options', async () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });

      const mockResponse = {
        data: { success: true, fileId: 123 },
      };

      vi.mocked(apiClient.upload).mockResolvedValueOnce(mockResponse);

      const result = await filesApi.uploadTeamFile(file, true);

      expect(apiClient.upload).toHaveBeenCalledWith('/api/v1/team/upload', expect.any(FormData));
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('uploadMatchFile', () => {
    it('should upload match file for authenticated user', async () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const options: FileUploadOptions = {
        ownerName: 'Test Owner',
        comment: 'Test comment',
      };

      const mockResponse = {
        data: { success: true, fileId: 456 },
      };

      vi.mocked(apiClient.upload).mockResolvedValueOnce(mockResponse);

      const result = await filesApi.uploadMatchFile(file, true, options);

      expect(apiClient.upload).toHaveBeenCalledWith('/api/v1/match/upload', expect.any(FormData));
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe.skip('tryDownloadTeamFile', () => {
    it('should download file successfully', async () => {
      const mockResponse = {
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue('application/octet-stream'),
        },
      };
      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await filesApi.tryDownloadTeamFile(123);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(window.open).toHaveBeenCalledWith('https://test-api.com/api/v1/download/123', '_blank');
      expect(result).toEqual({ success: true });
    });

    it('should handle download error with JSON response', async () => {
      const mockJsonResponse = { error: 'File not found' };
      const mockResponse = {
        ok: false,
        status: 404,
        headers: {
          get: vi.fn().mockReturnValue('application/json'),
        },
        json: vi.fn().mockResolvedValue(mockJsonResponse),
      };
      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await filesApi.tryDownloadTeamFile(123);

      expect(result).toEqual({
        success: false,
        error: 'File not found',
      });
    });

    it('should handle download error without JSON response', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        headers: {
          get: vi.fn().mockReturnValue('text/html'),
        },
      };
      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await filesApi.tryDownloadTeamFile(123);

      expect(result).toEqual({
        success: false,
        error: 'ダウンロード失敗 (500)',
      });
    });

    it('should handle network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await filesApi.tryDownloadTeamFile(123);

      expect(result).toEqual({
        success: false,
        error: 'ダウンロード通信エラー',
      });
    });
  });

  describe('deleteSearchFile', () => {
    it('should delete search file successfully', async () => {
      const request = { id: 123, deletePassword: 'password123' };
      const mockResponse = {
        data: { success: true, message: 'File deleted' },
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await filesApi.deleteSearchFile(request);

      expect(apiClient.post).toHaveBeenCalledWith('/api/v1/delete/searchFile', {
        id: 123,
        deletePassword: 'password123',
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should delete search file without password', async () => {
      const request = { id: 123 };
      const mockResponse = {
        data: { success: true, message: 'File deleted' },
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await filesApi.deleteSearchFile(request);

      expect(apiClient.post).toHaveBeenCalledWith('/api/v1/delete/searchFile', {
        id: 123,
        deletePassword: '',
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('fetchMyTeamFiles', () => {
    it('should fetch my team files successfully', async () => {
      const mockFiles = [
        { id: 1, name: 'Team File 1', ownerName: 'Owner 1' },
        { id: 2, name: 'Team File 2', ownerName: 'Owner 2' },
      ];

      const mockResponse = {
        data: { files: mockFiles },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await filesApi.fetchMyTeamFiles();

      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/mypage/team');
      expect(result).toEqual(mockFiles);
    });
  });

  describe('fetchMyMatchFiles', () => {
    it('should fetch my match files successfully', async () => {
      const mockFiles = [
        { id: 1, name: 'Match File 1', ownerName: 'Owner 1' },
      ];

      const mockResponse = {
        data: { files: mockFiles },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await filesApi.fetchMyMatchFiles();

      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/mypage/match');
      expect(result).toEqual(mockFiles);
    });
  });
});
