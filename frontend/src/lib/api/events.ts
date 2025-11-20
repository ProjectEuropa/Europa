import { apiClient } from '@/lib/api/client';

import type { EventType } from '@/schemas/event';

export interface EventData {
  id: string;
  name: string;
  details: string;
  url: string;
  deadline: string;
  endDisplayDate: string;
  type: EventType; // EventTypeを使用して型安全性を確保
  created_at: string;
  updatedAt: string;
  isActive: boolean;
}

export interface EventFormData {
  name: string;
  details: string;
  url?: string;
  deadline: string;
  endDisplayDate: string;
  type: string;
}

/**
 * イベント登録API
 */
export const registerEvent = async (formData: EventFormData) => {
  const response = await apiClient.post('/api/v1/eventNotice', {
    eventName: formData.name,
    eventDetails: formData.details,
    eventReferenceUrl: formData.url,
    eventClosingDay: formData.deadline,
    eventDisplayingDay: formData.endDisplayDate,
    eventType: formData.type,
  });
  return response;
};

/**
 * イベント一覧取得API
 */
export const fetchEvents = async (): Promise<EventData[]> => {
  const response = await apiClient.get<{ data: any[] }>('/api/v1/event');

  // スネークケース→キャメルケース変換
  const events = (response.data.data ?? []).map((event: any) => ({
    id: String(event.id),
    name: event.event_name ?? '',
    details: event.event_details ?? '',
    url: event.event_reference_url ?? '',
    deadline: event.event_closing_day ?? '',
    endDisplayDate: event.event_displaying_day ?? '',
    type: event.event_type ?? '',
    created_at: event.created_at,
    updatedAt: event.updated_at,
    isActive: event.is_active,
  }));

  return events; // 配列を直接返す
};

