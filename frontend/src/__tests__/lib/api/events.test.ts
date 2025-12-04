import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '@/lib/api/client';
import { registerEvent, fetchEvents } from '@/lib/api/events';
import type { Event, EventFormData } from '@/types/event';

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
    it.skip('should register event successfully (Not implemented in v2)', async () => {
      // Skipped
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
