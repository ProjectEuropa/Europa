import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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

  describe('request', () => {
    it('should throw ApiErrorClass on HTTP error', async () => {
      const errorData = { message: 'Not found', errors: {} };
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve(errorData),
      });

      await expect(apiClient.get('/test')).rejects.toThrow(ApiErrorClass);
    });
  });
});
