import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '@/lib/api/client';
import { fetchMyEvents, deleteMyEvent } from '@/lib/api/mypage';

// APIクライアントをモック
vi.mock('@/lib/api/client', () => ({
    apiClient: {
        post: vi.fn(),
        get: vi.fn(),
        delete: vi.fn(),
    },
}));

describe('mypage API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('fetchMyEvents', () => {
        it('should fetch and transform my events successfully', async () => {
            const mockApiResponse = {
                data: {
                    events: [
                        {
                            id: 1,
                            event_name: 'My Event 1',
                            event_details: 'My event details',
                            event_reference_url: 'https://example.com',
                            event_closing_day: '2024-12-31',
                            event_displaying_day: '2024-12-31',
                            event_type: 'tournament',
                            created_at: '2024-01-01T00:00:00Z',
                            updated_at: '2024-01-01T00:00:00Z',
                            is_active: true,
                        },
                        {
                            id: 2,
                            event_name: 'My Event 2',
                            event_details: 'My event details 2',
                            event_reference_url: 'https://example2.com',
                            event_closing_day: '2024-12-30',
                            event_displaying_day: '2024-12-30',
                            event_type: 'practice',
                            created_at: '2024-01-02T00:00:00Z',
                            updated_at: '2024-01-02T00:00:00Z',
                            is_active: false,
                        },
                    ],
                },
            };

            vi.mocked(apiClient.get).mockResolvedValueOnce(mockApiResponse);

            const result = await fetchMyEvents();

            expect(apiClient.get).toHaveBeenCalledWith('/api/v2/events/me');
            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({
                id: '1',
                name: 'My Event 1',
                details: 'My event details',
                url: 'https://example.com',
                deadline: '2024-12-31',
                endDisplayDate: '2024-12-31',
                type: 'tournament',
                registeredDate: '2024-01-01',
                created_at: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
                isActive: true,
            });
        });

        it('should handle empty events response', async () => {
            const mockApiResponse = { data: { events: null } };
            vi.mocked(apiClient.get).mockResolvedValueOnce(mockApiResponse);

            const result = await fetchMyEvents();

            expect(result).toEqual([]);
        });

        it('should handle missing events field', async () => {
            const mockApiResponse = { data: {} };
            vi.mocked(apiClient.get).mockResolvedValueOnce(mockApiResponse);

            const result = await fetchMyEvents();

            expect(result).toEqual([]);
        });
    });

    describe('deleteMyEvent', () => {
        it('should delete event successfully', async () => {
            const eventId = '1';
            const mockResponse = {
                data: {
                    message: 'Event deleted successfully',
                },
            };

            vi.mocked(apiClient.delete).mockResolvedValueOnce(mockResponse);

            const result = await deleteMyEvent(eventId);

            expect(apiClient.delete).toHaveBeenCalledWith(
                `/api/v2/events/${eventId}`
            );
            expect(result).toEqual(mockResponse);
        });

        it('should throw error when deletion fails', async () => {
            const eventId = '1';
            const mockError = new Error('Deletion failed');

            vi.mocked(apiClient.delete).mockRejectedValueOnce(mockError);

            await expect(deleteMyEvent(eventId)).rejects.toThrow(
                'Deletion failed'
            );
        });

        it('should throw default error message when no error provided', async () => {
            const eventId = '1';
            const mockError = new Error('削除に失敗しました');

            vi.mocked(apiClient.delete).mockRejectedValueOnce(mockError);

            await expect(deleteMyEvent(eventId)).rejects.toThrow(
                '削除に失敗しました'
            );
        });

        it('should handle numeric event ID', async () => {
            const eventId = 123;
            const mockResponse = {
                data: {
                    message: 'Event deleted successfully',
                },
            };

            vi.mocked(apiClient.delete).mockResolvedValueOnce(mockResponse);

            const result = await deleteMyEvent(eventId);

            expect(apiClient.delete).toHaveBeenCalledWith(
                `/api/v2/events/${eventId}`
            );
            expect(result).toEqual(mockResponse);
        });
    });
});
