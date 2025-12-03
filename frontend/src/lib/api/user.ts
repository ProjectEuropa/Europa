import { apiClient } from '@/lib/api/client';

/**
 * ユーザー名更新API
 */
export const updateUserName = async (name: string) => {
    await apiClient.put('/api/v2/auth/me', { name });
};
