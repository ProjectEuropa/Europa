import { apiClient } from '@/lib/api/client';

/**
 * ユーザー名更新API
 */
export const updateUserName = async (name: string) => {
    await apiClient.post('/api/v1/user/update', { name });
};
