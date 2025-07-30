import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '@/lib/api/client';
import type { User } from '@/types/user';

// APIクライアントをモック
vi.mock('@/lib/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

// ユーザーAPI関数（実際の実装がない場合の仮想的なAPI）
const userApi = {
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<{ user: User }>('/api/v1/user/me');
    return response.data.user;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.put<{ user: User }>(
      '/api/v1/user/profile',
      data
    );
    return response.data.user;
  },

  async getUserById(id: number): Promise<User> {
    const response = await apiClient.get<{ user: User }>(`/api/v1/user/${id}`);
    return response.data.user;
  },

  async deleteAccount(): Promise<{ success: boolean }> {
    const response = await apiClient.delete<{ success: boolean }>(
      '/api/v1/user/account'
    );
    return response.data;
  },
};

describe('userApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      const mockUser: User = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const mockResponse = {
        data: { user: mockUser },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await userApi.getCurrentUser();

      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/user/me');
      expect(result).toEqual(mockUser);
    });

    it('should handle error when getting current user', async () => {
      const error = new Error('Unauthorized');
      vi.mocked(apiClient.get).mockRejectedValueOnce(error);

      await expect(userApi.getCurrentUser()).rejects.toThrow('Unauthorized');
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const updateData = { name: 'Updated Name' };
      const mockUser: User = {
        id: 1,
        name: 'Updated Name',
        email: 'test@example.com',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      const mockResponse = {
        data: { user: mockUser },
      };

      vi.mocked(apiClient.put).mockResolvedValueOnce(mockResponse);

      const result = await userApi.updateProfile(updateData);

      expect(apiClient.put).toHaveBeenCalledWith(
        '/api/v1/user/profile',
        updateData
      );
      expect(result).toEqual(mockUser);
    });

    it('should handle validation error when updating profile', async () => {
      const updateData = { name: '' };
      const error = new Error('Validation failed');
      vi.mocked(apiClient.put).mockRejectedValueOnce(error);

      await expect(userApi.updateProfile(updateData)).rejects.toThrow(
        'Validation failed'
      );
    });
  });

  describe('getUserById', () => {
    it('should get user by ID successfully', async () => {
      const userId = 123;
      const mockUser: User = {
        id: userId,
        name: 'Other User',
        email: 'other@example.com',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const mockResponse = {
        data: { user: mockUser },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await userApi.getUserById(userId);

      expect(apiClient.get).toHaveBeenCalledWith(`/api/v1/user/${userId}`);
      expect(result).toEqual(mockUser);
    });

    it('should handle not found error when getting user by ID', async () => {
      const userId = 999;
      const error = new Error('User not found');
      vi.mocked(apiClient.get).mockRejectedValueOnce(error);

      await expect(userApi.getUserById(userId)).rejects.toThrow(
        'User not found'
      );
    });
  });

  describe('deleteAccount', () => {
    it('should delete account successfully', async () => {
      const mockResponse = {
        data: { success: true },
      };

      vi.mocked(apiClient.delete).mockResolvedValueOnce(mockResponse);

      const result = await userApi.deleteAccount();

      expect(apiClient.delete).toHaveBeenCalledWith('/api/v1/user/account');
      expect(result).toEqual({ success: true });
    });

    it('should handle error when deleting account', async () => {
      const error = new Error('Cannot delete account');
      vi.mocked(apiClient.delete).mockRejectedValueOnce(error);

      await expect(userApi.deleteAccount()).rejects.toThrow(
        'Cannot delete account'
      );
    });
  });
});
