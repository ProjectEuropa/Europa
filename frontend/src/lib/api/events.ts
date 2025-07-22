/**
 * イベント関連のAPI関数
 */

import { apiClient } from './client';
import type {
  Event,
  EventFormData,
  EventResponse,
  EventDeleteResponse,
  EventRegistrationData,
  MyEventsResponse,
} from '@/types/event';

export const eventsApi = {
  async registerEvent(formData: EventFormData): Promise<Event> {
    const registrationData: EventRegistrationData = {
      eventName: formData.name,
      eventDetails: formData.details,
      eventReferenceUrl: formData.url,
      eventClosingDay: formData.deadline,
      eventDisplayingDay: formData.endDisplayDate,
      eventType: formData.type,
    };

    const response = await apiClient.post<Event>('/api/v1/eventNotice', registrationData);
    return response.data;
  },

  async fetchEvents(): Promise<Event[]> {
    const response = await apiClient.get<EventResponse>('/api/v1/event');
    return response.data.data;
  },

  async fetchMyEvents(): Promise<Event[]> {
    const response = await apiClient.get<MyEventsResponse>('/api/v1/mypage/events');

    // スネークケース→キャメルケース変換
    return (response.data.events ?? []).map((event: any) => {
      // 型安全な変換
      const transformedEvent: Event = {
        id: String(event.id),
        name: event.event_name ?? '',
        details: event.event_details ?? '',
        url: event.event_reference_url ?? '',
        deadline: event.event_closing_day ?? '',
        endDisplayDate: event.event_displaying_day ?? '',
        type: (event.event_type as Event['type']) ?? 'other',
        registeredDate: event.created_at ? event.created_at.slice(0, 10) : '',
        createdAt: event.created_at ?? '',
        updatedAt: event.updated_at ?? '',
        isActive: event.is_active ?? true
      };

      return transformedEvent;
    });
  },

  async deleteMyEvent(id: string | number): Promise<EventDeleteResponse> {
    const response = await apiClient.post<EventDeleteResponse>('/api/v1/delete/usersRegisteredCloumn', { id });

    if (!response.data.deleted) {
      throw new Error(response.data.error || '削除に失敗しました');
    }

    return response.data;
  },
};
