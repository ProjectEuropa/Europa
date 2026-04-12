import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '@/lib/api/client';
import { fetchEvents, registerEvent } from '@/lib/api/events';
import { ApiErrorClass } from '@/types/api';
import type { Event } from '@/types/event';

// APIクライアントをモック
vi.mock('@/lib/api/client', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('events API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('registerEvent', () => {
    it('should register event successfully', async () => {
      const mockResponse = {
        message: 'Event created successfully',
        data: { event: { id: 1 } },
      };
      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await registerEvent({
        name: 'テストイベント',
        details: 'テストイベントの詳細です',
        url: 'https://example.com',
        deadline: '2024-12-31',
        endDisplayDate: '2025-01-31',
        type: 'tournament',
      });

      expect(apiClient.post).toHaveBeenCalledWith('/api/v2/events', {
        name: 'テストイベント',
        details: 'テストイベントの詳細です',
        url: 'https://example.com',
        type: '1',
        deadline: new Date('2024-12-31T23:59:59').toISOString(),
        endDisplayDate: new Date('2025-01-31T23:59:59').toISOString(),
      });
      expect(result).toBe(mockResponse);
    });

    it('should throw API errors so React Query can call onError', async () => {
      const apiError = new ApiErrorClass(400, {
        message: 'Validation failed',
        errors: { endDisplayDate: ['End display date must be after deadline'] },
      });
      vi.mocked(apiClient.post).mockRejectedValueOnce(apiError);

      await expect(
        registerEvent({
          name: 'テストイベント',
          details: 'テストイベントの詳細です',
          url: '',
          deadline: '2025-01-31',
          endDisplayDate: '2024-12-31',
          type: 'other',
        })
      ).rejects.toBe(apiError);
    });
  });

  describe('fetchEvents', () => {
    it('should fetch events successfully', async () => {
      const mockEvents = [
        {
          id: 1,
          event_name: 'Event 1',
          event_details: 'Details 1',
          event_reference_url: 'https://example1.com',
          event_closing_day: '2024-12-31',
          event_displaying_day: '2024-12-31',
          event_type: 'tournament',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          is_active: true,
        },
        {
          id: 2,
          event_name: 'Event 2',
          event_details: 'Details 2',
          event_reference_url: 'https://example2.com',
          event_closing_day: '2024-12-31',
          event_displaying_day: '2024-12-31',
          event_type: 'other',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          is_active: true,
        },
      ];

      const expectedEvents: Event[] = [
        {
          id: '1',
          name: 'Event 1',
          details: 'Details 1',
          url: 'https://example1.com',
          deadline: '2024-12-31',
          endDisplayDate: '2024-12-31',
          type: 'tournament',
          registeredDate: undefined, // fetchEvents does not map registeredDate
          created_at: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          isActive: true,
        },
        {
          id: '2',
          name: 'Event 2',
          details: 'Details 2',
          url: 'https://example2.com',
          deadline: '2024-12-31',
          endDisplayDate: '2024-12-31',
          type: 'other',
          registeredDate: undefined,
          created_at: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          isActive: true,
        },
      ];

      const mockResponse = { data: { events: mockEvents } };
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await fetchEvents();

      expect(apiClient.get).toHaveBeenCalledWith('/api/v2/events');
      expect(result).toEqual(expectedEvents);
    });
  });
});
