import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { ApiClient } from '@/lib/api/client';
import { ApiErrorClass } from '@/types/api';

// MSWを無効化
vi.mock('msw', () => {
  return {};
});

// fetchのモック
const originalFetch = global.fetch;
const mockFetch = vi.fn();

// localStorageのモック
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

describe('ApiClient', () => {
  let apiClient: ApiClient;

  beforeEach(() => {
    // テスト前にfetchをモックに置き換え
    global.fetch = mockFetch;

    // localStorageのモック
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });

    apiClient = new ApiClient();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  afterAll(() => {
    // テスト後に元のfetchを復元
    global.fetch = originalFetch;
  });

  describe('constructor', () => {
    it('should use default baseURL when not provided', () => {
      const client = new ApiClient();
      expect(client).toBeInstanceOf(ApiClient);
    });

    it('should use custom baseURL when provided', () => {
      const customConfig = { baseURL: 'https://custom.api.com' };
      const client = new ApiClient(customConfig);
      expect(client).toBeInstanceOf(ApiClient);
    });
  });

  describe('request', () => {
    it('should make successful GET request', async () => {
      const mockResponse = { data: { id: 1, name: 'Test' } };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiClient.get('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'GET',
          credentials: 'include',
        })
      );
      expect(result).toEqual(mockResponse);
    });

    // it('should include authorization header when token exists', async () => {
    //   mockLocalStorage.getItem.mockReturnValue('test-token');
    //   mockFetch.mockResolvedValueOnce({
    //     ok: true,
    //     json: () => Promise.resolve({}),
    //   });

    //   await apiClient.get('/test');

    //   expect(mockFetch).toHaveBeenCalledWith(
    //     expect.any(String),
    //     expect.objectContaining({
    //       headers: expect.objectContaining({
    //         Authorization: 'Bearer test-token',
    //       }),
    //     })
    //   );
    // });

    it('should throw ApiErrorClass on HTTP error', async () => {
      const errorData = { message: 'Not found', errors: {} };
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve(errorData),
      });

      await expect(apiClient.get('/test')).rejects.toThrow(ApiErrorClass);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(apiClient.get('/test')).rejects.toThrow(ApiErrorClass);
    });
  });

  describe('HTTP methods', () => {
    it('should make POST request with data', async () => {
      const postData = { name: 'Test' };
      const mockResponse = { data: { id: 1, ...postData } };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiClient.post('/test', postData);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(postData),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should make DELETE request', async () => {
      const mockResponse = { data: { success: true } };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiClient.delete('/test/1');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/test/1'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('upload', () => {
    it('should upload FormData', async () => {
      const formData = new FormData();
      formData.append('file', new File(['test'], 'test.txt'));

      const mockResponse = { data: { success: true } };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiClient.upload('/upload', formData);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/upload'),
        expect.objectContaining({
          method: 'POST',
          body: formData,
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getCsrfCookie', () => {
    it('should return immediately (no-op for token-based auth)', async () => {
      // JWT + HttpOnly Cookie方式ではCSRF不要
      await apiClient.getCsrfCookie();

      // fetchが呼ばれないことを確認
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should include X-Requested-With header in requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await apiClient.get('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Requested-With': 'XMLHttpRequest',
          }),
        })
      );
    });
  });

  describe('Basic authentication header', () => {
    const originalUser = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
    const originalPassword = process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD;

    afterEach(() => {
      if (originalUser === undefined) {
        delete process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
      } else {
        process.env.NEXT_PUBLIC_BASIC_AUTH_USER = originalUser;
      }
      if (originalPassword === undefined) {
        delete process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD;
      } else {
        process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD = originalPassword;
      }
    });

    it('should include Authorization: Basic header when NEXT_PUBLIC_BASIC_AUTH_USER and PASSWORD are set', async () => {
      process.env.NEXT_PUBLIC_BASIC_AUTH_USER = 'stg-user';
      process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD = 'stg-password';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: {} }),
      });

      const client = new ApiClient();
      await client.get('/api/v2/files');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v2/files'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Basic ${btoa('stg-user:stg-password')}`,
          }),
        })
      );
    });

    it('should not include Authorization header when Basic auth env vars are not set', async () => {
      delete process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
      delete process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD;

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: {} }),
      });

      const client = new ApiClient();
      await client.get('/api/v2/files');

      const calledOptions = mockFetch.mock.calls[0][1];
      expect(calledOptions.headers.Authorization).toBeUndefined();
    });
  });
});
