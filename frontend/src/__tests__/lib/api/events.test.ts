import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '@/lib/api/client';
import { eventsApi } from '@/lib/api/events';
import type { Event, EventFormData } from '@/types/event';

// APIクライアントをモック
vi.mock('@/lib/api/client', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('eventsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('registerEvent', () => {
    it('should register event successfully', async () => {
      const formData: EventFormData = {
        name: 'Test Event',
        details: 'Test event details',
        url: 'https://example.com',
        deadline: '2024-12-31',
        endDisplayDate: '2024-12-31',
        type: 'match',
      };

      const mockEvent: Event = {
        id: '1',
        name: 'Test Event',
        details: 'Test event details',
        url: 'https://example.com',
        deadline: '2024-12-31',
        endDisplayDate: '2024-12-31',
        type: 'match',
        registeredDate: '2024-01-01',
        created_at: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        isActive: true,
      };

      const mockResponse = { data: mockEvent };
      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await eventsApi.registerEvent(formData);

      expect(apiClient.post).toHaveBeenCalledWith('/api/v1/eventNotice', {
        eventName: formData.name,
        eventDetails: formData.details,
        eventReferenceUrl: formData.url,
        eventClosingDay: formData.deadline,
        eventDisplayingDay: formData.endDisplayDate,
        eventType: formData.type,
      });
      expect(result).toEqual(mockEvent);
    });
  });

  describe('fetchEvents', () => {
    it('should fetch events successfully', async () => {
      const mockEvents: Event[] = [
        {
          id: '1',
          name: 'Event 1',
          details: 'Details 1',
          url: 'https://example1.com',
          deadline: '2024-12-31',
          endDisplayDate: '2024-12-31',
          type: 'match',
          registeredDate: '2024-01-01',
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
          type: 'practice',
          registeredDate: '2024-01-01',
          created_at: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          isActive: true,
        },
      ];

      const mockResponse = { data: { data: mockEvents } };
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await eventsApi.fetchEvents();

      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/event');
      expect(result).toEqual(mockEvents);
    });
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
              event_type: 'match',
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

      const result = await eventsApi.fetchMyEvents();

      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/mypage/events');
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: '1',
        name: 'My Event 1',
        details: 'My event details',
        url: 'https://example.com',
        deadline: '2024-12-31',
        endDisplayDate: '2024-12-31',
        type: 'match',
        registeredDate: '2024-01-01',
        created_at: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        isActive: true,
      });
    });

    it('should handle empty events response', async () => {
      const mockApiResponse = { data: { events: null } };
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockApiResponse);

      const result = await eventsApi.fetchMyEvents();

      expect(result).toEqual([]);
    });

    it('should handle missing events field', async () => {
      const mockApiResponse = { data: {} };
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockApiResponse);

      const result = await eventsApi.fetchMyEvents();

      expect(result).toEqual([]);
    });
  });

  describe('deleteMyEvent', () => {
    it('should delete event successfully', async () => {
      const eventId = '1';
      const mockResponse = {
        data: {
          deleted: true,
          message: 'Event deleted successfully',
        },
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await eventsApi.deleteMyEvent(eventId);

      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/v1/delete/usersRegisteredCloumn',
        { id: eventId }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error when deletion fails', async () => {
      const eventId = '1';
      const mockResponse = {
        data: {
          deleted: false,
          error: 'Deletion failed',
        },
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      await expect(eventsApi.deleteMyEvent(eventId)).rejects.toThrow(
        'Deletion failed'
      );
    });

    it('should throw default error message when no error provided', async () => {
      const eventId = '1';
      const mockResponse = {
        data: {
          deleted: false,
        },
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      await expect(eventsApi.deleteMyEvent(eventId)).rejects.toThrow(
        '削除に失敗しました'
      );
    });

    it('should handle numeric event ID', async () => {
      const eventId = 123;
      const mockResponse = {
        data: {
          deleted: true,
          message: 'Event deleted successfully',
        },
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await eventsApi.deleteMyEvent(eventId);

      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/v1/delete/usersRegisteredCloumn',
        { id: eventId }
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
});
