import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '@/lib/api/client';

// APIクライアントをモック
vi.mock('@/lib/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

// 仮想的な検索API
const searchApi = {
  async searchFiles(query: string, filters?: {
    type?: string;
    dateFrom?: string;
    dateTo?: string;
    size?: { min?: number; max?: number };
  }) {
    const params = new URLSearchParams();
    params.append('q', query);

    if (filters?.type) params.append('type', filters.type);
    if (filters?.dateFrom) params.append('date_from', filters.dateFrom);
    if (filters?.dateTo) params.append('date_to', filters.dateTo);
    if (filters?.size?.min) params.append('size_min', filters.size.min.toString());
    if (filters?.size?.max) params.append('size_max', filters.size.max.toString());

    const response = await apiClient.get(`/api/v1/search/files?${params.toString()}`);
    return response.data;
  },

  async searchUsers(query: string, limit = 10) {
    const response = await apiClient.get(`/api/v1/search/users?q=${encodeURIComponent(query)}&limit=${limit}`);
    return response.data;
  },

  async getSearchSuggestions(query: string) {
    const response = await apiClient.get(`/api/v1/search/suggestions?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  async saveSearch(query: string, filters?: any) {
    const response = await apiClient.post('/api/v1/search/save', {
      query,
      filters,
    });
    return response.data;
  },

  async getSavedSearches() {
    const response = await apiClient.get('/api/v1/search/saved');
    return response.data;
  },

  async deleteSavedSearch(id: number) {
    const response = await apiClient.post(`/api/v1/search/saved/${id}/delete`);
    return response.data;
  },
};

describe('searchApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('searchFiles', () => {
    it('should search files with query only', async () => {
      const mockResponse = {
        data: {
          files: [
            { id: 1, name: 'test.pdf', type: 'application/pdf' },
            { id: 2, name: 'document.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
          ],
          total: 2,
        },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await searchApi.searchFiles('test document');

      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/search/files?q=test+document');
      expect(result).toEqual(mockResponse.data);
    });

    it('should search files with filters', async () => {
      const mockResponse = {
        data: {
          files: [{ id: 1, name: 'image.jpg', type: 'image/jpeg' }],
          total: 1,
        },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const filters = {
        type: 'image',
        dateFrom: '2024-01-01',
        dateTo: '2024-12-31',
        size: { min: 1024, max: 1048576 },
      };

      const result = await searchApi.searchFiles('vacation photos', filters);

      expect(apiClient.get).toHaveBeenCalledWith(
        '/api/v1/search/files?q=vacation+photos&type=image&date_from=2024-01-01&date_to=2024-12-31&size_min=1024&size_max=1048576'
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle empty search results', async () => {
      const mockResponse = {
        data: {
          files: [],
          total: 0,
        },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await searchApi.searchFiles('nonexistent');

      expect(result.files).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should handle search errors', async () => {
      const error = new Error('Search service unavailable');
      vi.mocked(apiClient.get).mockRejectedValueOnce(error);

      await expect(searchApi.searchFiles('test')).rejects.toThrow('Search service unavailable');
    });
  });

  describe('searchUsers', () => {
    it('should search users with default limit', async () => {
      const mockResponse = {
        data: {
          users: [
            { id: 1, name: 'John Doe', email: 'john@example.com' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
          ],
        },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await searchApi.searchUsers('john');

      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/search/users?q=john&limit=10');
      expect(result).toEqual(mockResponse.data);
    });

    it('should search users with custom limit', async () => {
      const mockResponse = {
        data: { users: [] },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      await searchApi.searchUsers('test', 5);

      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/search/users?q=test&limit=5');
    });

    it('should handle special characters in query', async () => {
      const mockResponse = {
        data: { users: [] },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      await searchApi.searchUsers('user@domain.com');

      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/search/users?q=user%40domain.com&limit=10');
    });
  });

  describe('getSearchSuggestions', () => {
    it('should get search suggestions', async () => {
      const mockResponse = {
        data: {
          suggestions: ['test document', 'test file', 'testing'],
        },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await searchApi.getSearchSuggestions('test');

      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/search/suggestions?q=test');
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle empty suggestions', async () => {
      const mockResponse = {
        data: { suggestions: [] },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await searchApi.getSearchSuggestions('xyz');

      expect(result.suggestions).toHaveLength(0);
    });
  });

  describe('saveSearch', () => {
    it('should save search without filters', async () => {
      const mockResponse = {
        data: { id: 1, query: 'important documents', saved: true },
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await searchApi.saveSearch('important documents');

      expect(apiClient.post).toHaveBeenCalledWith('/api/v1/search/save', {
        query: 'important documents',
        filters: undefined,
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should save search with filters', async () => {
      const mockResponse = {
        data: { id: 2, query: 'images', saved: true },
      };

      const filters = { type: 'image', dateFrom: '2024-01-01' };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await searchApi.saveSearch('images', filters);

      expect(apiClient.post).toHaveBeenCalledWith('/api/v1/search/save', {
        query: 'images',
        filters,
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getSavedSearches', () => {
    it('should get saved searches', async () => {
      const mockResponse = {
        data: {
          searches: [
            { id: 1, query: 'important documents', createdAt: '2024-01-01T00:00:00Z' },
            { id: 2, query: 'images', filters: { type: 'image' }, createdAt: '2024-01-02T00:00:00Z' },
          ],
        },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await searchApi.getSavedSearches();

      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/search/saved');
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle empty saved searches', async () => {
      const mockResponse = {
        data: { searches: [] },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await searchApi.getSavedSearches();

      expect(result.searches).toHaveLength(0);
    });
  });

  describe('deleteSavedSearch', () => {
    it('should delete saved search', async () => {
      const mockResponse = {
        data: { success: true },
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await searchApi.deleteSavedSearch(1);

      expect(apiClient.post).toHaveBeenCalledWith('/api/v1/search/saved/1/delete');
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle delete errors', async () => {
      const error = new Error('Search not found');
      vi.mocked(apiClient.post).mockRejectedValueOnce(error);

      await expect(searchApi.deleteSavedSearch(999)).rejects.toThrow('Search not found');
    });
  });
});
