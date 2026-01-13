import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '@/lib/api/client';
import { filesApi } from '@/lib/api/files';
import type { FileUploadOptions } from '@/types/file';
import type { SearchParams } from '@/types/search';

// APIクライアントをモック
vi.mock("@/lib/api/client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    upload: vi.fn(),
    delete: vi.fn(),
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
          files: [
            { id: 1, file_name: "Team 1", upload_owner_name: "Owner 1" },
            { id: 2, file_name: "Team 2", upload_owner_name: "Owner 2" },
          ],
          pagination: { page: 1, limit: 10, total: 2 },
        },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await filesApi.searchTeams(params);

      expect(apiClient.get).toHaveBeenCalledWith(
        `/api/v2/files?data_type=1&page=1&limit=10&keyword=test&sort_order=desc`
      );
      expect(result).toEqual({
        data: [
          {
            id: 1,
            name: "Team 1",
            ownerName: "Owner 1",
            comment: "",
            downloadableAt: "",
            created_at: "",
            updatedAt: undefined,
            searchTag1: "",
            searchTag2: "",
            searchTag3: "",
            searchTag4: "",
            uploadType: "team",
            upload_type: "2",
            type: "team",
            file_path: undefined,
            file_size: undefined,
          },
          {
            id: 2,
            name: "Team 2",
            ownerName: "Owner 2",
            comment: "",
            downloadableAt: "",
            created_at: "",
            updatedAt: undefined,
            searchTag1: "",
            searchTag2: "",
            searchTag3: "",
            searchTag4: "",
            uploadType: "team",
            upload_type: "2",
            type: "team",
            file_path: undefined,
            file_size: undefined,
          },
        ],
        meta: {
          currentPage: 1,
          lastPage: 1,
          perPage: 10,
          total: 2,
        },
      });
    });

    it('should handle special characters in keyword', async () => {
      const params: SearchParams = { keyword: 'test & special', page: 1 };

      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: { data: [], meta: {} },
      });

      await filesApi.searchTeams(params);

      expect(apiClient.get).toHaveBeenCalledWith(
        `/api/v2/files?data_type=1&page=1&limit=10&keyword=test%20%26%20special&sort_order=desc`
      );
    });
  });

  describe('searchTeams with sortOrder', () => {
    it('should include sort_order parameter when provided', async () => {
      const params: SearchParams = { keyword: 'test', page: 1, sortOrder: 'asc' };
      const mockResponse = {
        data: {
          files: [
            { id: 1, file_name: "Team 1", upload_owner_name: "Owner 1" },
          ],
          pagination: { page: 1, limit: 10, total: 1 },
        },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      await filesApi.searchTeams(params);

      expect(apiClient.get).toHaveBeenCalledWith(
        `/api/v2/files?data_type=1&page=1&limit=10&keyword=test&sort_order=asc`
      );
    });

    it('should default to desc when sortOrder is not provided', async () => {
      const params: SearchParams = { keyword: 'test', page: 1 };
      const mockResponse = {
        data: {
          files: [],
          pagination: { page: 1, limit: 10, total: 0 },
        },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      await filesApi.searchTeams(params);

      expect(apiClient.get).toHaveBeenCalledWith(
        `/api/v2/files?data_type=1&page=1&limit=10&keyword=test&sort_order=desc`
      );
    });

    it('should handle sortOrder desc correctly', async () => {
      const params: SearchParams = { keyword: 'test', page: 1, sortOrder: 'desc' };
      const mockResponse = {
        data: {
          files: [],
          pagination: { page: 1, limit: 10, total: 0 },
        },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      await filesApi.searchTeams(params);

      expect(apiClient.get).toHaveBeenCalledWith(
        `/api/v2/files?data_type=1&page=1&limit=10&keyword=test&sort_order=desc`
      );
    });
  });

  describe('searchMatches', () => {
    it('should search matches successfully', async () => {
      const params: SearchParams = { keyword: 'match', page: 2 };
      const mockResponse = {
        data: {
          files: [{ id: 1, file_name: "Match 1", upload_owner_name: "Owner 1" }],
          pagination: { page: 2, limit: 10, total: 30 },
        },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await filesApi.searchMatches(params);

      expect(apiClient.get).toHaveBeenCalledWith(
        `/api/v2/files?data_type=2&page=2&limit=10&keyword=match&sort_order=desc`
      );
      expect(result).toEqual({
        data: [
          {
            id: 1,
            name: "Match 1",
            ownerName: "Owner 1",
            comment: "",
            downloadableAt: "",
            created_at: "",
            updatedAt: undefined,
            searchTag1: "",
            searchTag2: "",
            searchTag3: "",
            searchTag4: "",
            uploadType: "match",
            upload_type: "2",
            type: "match",
            file_path: undefined,
            file_size: undefined,
          },
        ],
        meta: {
          currentPage: 2,
          lastPage: 3,
          perPage: 10,
          total: 30,
        },
      });
    });
  });

  describe('searchMatches with sortOrder', () => {
    it('should include sort_order parameter when provided', async () => {
      const params: SearchParams = { keyword: 'match', page: 1, sortOrder: 'asc' };
      const mockResponse = {
        data: {
          files: [
            { id: 1, file_name: "Match 1", upload_owner_name: "Owner 1" },
          ],
          pagination: { page: 1, limit: 10, total: 1 },
        },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      await filesApi.searchMatches(params);

      expect(apiClient.get).toHaveBeenCalledWith(
        `/api/v2/files?data_type=2&page=1&limit=10&keyword=match&sort_order=asc`
      );
    });

    it('should default to desc when sortOrder is not provided', async () => {
      const params: SearchParams = { keyword: 'match', page: 1 };
      const mockResponse = {
        data: {
          files: [],
          pagination: { page: 1, limit: 10, total: 0 },
        },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      await filesApi.searchMatches(params);

      expect(apiClient.get).toHaveBeenCalledWith(
        `/api/v2/files?data_type=2&page=1&limit=10&keyword=match&sort_order=desc`
      );
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
        data: { file: { id: 123, file_name: 'test.txt', file_comment: 'Test comment', created_at: '2024-01-01' } },
      };

      vi.mocked(apiClient.upload).mockResolvedValueOnce(mockResponse);

      const result = await filesApi.uploadTeamFile(file, true, options);

      expect(apiClient.upload).toHaveBeenCalledWith(
        `/api/v2/files`,
        expect.any(FormData)
      );
      expect(result).toEqual({
        id: 123,
        name: "test.txt",
        comment: "Test comment",
        created_at: "2024-01-01",
      });
    });

    it('should upload team file for unauthenticated user', async () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const options: FileUploadOptions = {
        ownerName: 'Test Owner',
        deletePassword: 'password123',
      };

      const mockResponse = {
        data: { file: { id: 123, file_name: 'test.txt' } },
      };

      vi.mocked(apiClient.upload).mockResolvedValueOnce(mockResponse);

      const result = await filesApi.uploadTeamFile(file, false, options);

      expect(apiClient.upload).toHaveBeenCalledWith(
        `/api/v2/files`,
        expect.any(FormData)
      );
      expect(result).toEqual({
        id: 123,
        name: "test.txt",
        comment: undefined,
        created_at: undefined,
      });
    });

    it('should upload team file without options', async () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });

      const mockResponse = {
        data: { file: { id: 123, file_name: 'test.txt' } },
      };

      vi.mocked(apiClient.upload).mockResolvedValueOnce(mockResponse);

      const result = await filesApi.uploadTeamFile(file, true);

      expect(apiClient.upload).toHaveBeenCalledWith(
        `/api/v2/files`,
        expect.any(FormData)
      );
      expect(result).toEqual({
        id: 123,
        name: "test.txt",
        comment: undefined,
        created_at: undefined,
      });
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
        data: { file: { id: 456, file_name: 'test.txt' } },
      };

      vi.mocked(apiClient.upload).mockResolvedValueOnce(mockResponse);

      const result = await filesApi.uploadMatchFile(file, true, options);

      expect(apiClient.upload).toHaveBeenCalledWith(
        `/api/v2/files`,
        expect.any(FormData)
      );
      expect(result).toEqual({
        id: 456,
        name: "test.txt",
        comment: undefined,
        created_at: undefined,
      });
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
      expect(window.open).toHaveBeenCalledWith(
        'https://test-api.com/api/v1/download/123',
        '_blank'
      );
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
        message: 'File deleted' ,
      };

      vi.mocked(apiClient.delete).mockResolvedValueOnce(mockResponse as any);

      const result = await filesApi.deleteSearchFile(request);

      expect(apiClient.delete).toHaveBeenCalledWith(`/api/v2/files/123`, { body: JSON.stringify({ deletePassword: 'password123' }) });
      expect(result).toEqual(mockResponse);
    });

    it('should delete search file without password', async () => {
      const request = { id: 123 };
      const mockResponse = {
        message: 'File deleted',
      };

      vi.mocked(apiClient.delete).mockResolvedValueOnce(mockResponse as any);

      const result = await filesApi.deleteSearchFile(request);

      expect(apiClient.delete).toHaveBeenCalledWith(`/api/v2/files/123`, { body: JSON.stringify({ deletePassword: undefined }) });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('fetchMyTeamFiles', () => {
    it('should fetch my team files successfully', async () => {
      const mockFiles = [
        { id: 1, file_name: "Team File 1", upload_owner_name: "Owner 1" },
        { id: 2, file_name: "Team File 2", upload_owner_name: "Owner 2" },
      ];

      const mockResponse = {
        data: { files: mockFiles },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await filesApi.fetchMyTeamFiles();

      expect(apiClient.get).toHaveBeenCalledWith('/api/v2/files?data_type=1&mine=true');
      expect(result).toEqual(mockResponse.data.files.map((f: any) => ({ id: f.id, name: f.file_name, comment: f.file_comment, created_at: f.created_at })));
    });
  });

  describe('fetchMyMatchFiles', () => {
    it('should fetch my match files successfully', async () => {
      const mockFiles = [{ id: 1, file_name: "Match File 1", upload_owner_name: "Owner 1" }];

      const mockResponse = {
        data: { files: mockFiles },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await filesApi.fetchMyMatchFiles();

      expect(apiClient.get).toHaveBeenCalledWith('/api/v2/files?data_type=2&mine=true');
      expect(result).toEqual(mockResponse.data.files.map((f: any) => ({ id: f.id, name: f.file_name, comment: f.file_comment, created_at: f.created_at })));
    });
  });
});
