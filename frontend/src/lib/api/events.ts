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

interface ApiEvent {
  id: number | string;
  event_name?: string | null;
  event_details?: string | null;
  event_reference_url?: string | null;
  event_closing_day?: string | null;
  event_displaying_day?: string | null;
  event_type?: string | null;
  created_at: string;
  updated_at?: string | null;
}

interface EventsResponse {
  events?: ApiEvent[];
}

const normalizeEventType = (type?: string | null): EventType => {
  if (type === '1' || type === 'tournament') {
    return 'tournament';
  }
  if (type === '2' || type === 'announcement') {
    return 'announcement';
  }
  if (type === '3' || type === 'other') {
    return 'other';
  }
  return 'other';
};

/**
 * イベント登録API
 */
export const registerEvent = async (formData: EventFormData) => {
  // イベントタイプの変換
  let type = '3'; // デフォルト: その他
  if (formData.type === 'tournament') {
    type = '1';
  } else if (formData.type === 'announcement') {
    type = '2';
  }

  // 日付の変換 (YYYY-MM-DD -> ISO 8601)
  // 締切と表示期限は、その日の終わり(23:59:59)とする
  const deadline = new Date(`${formData.deadline}T23:59:59`).toISOString();
  const endDisplayDate = new Date(
    `${formData.endDisplayDate}T23:59:59`
  ).toISOString();

  return apiClient.post('/api/v2/events', {
    name: formData.name,
    details: formData.details,
    url: formData.url,
    type: type,
    deadline: deadline,
    endDisplayDate: endDisplayDate,
  });
};

/**
 * イベント一覧取得API
 */
export const fetchEvents = async (): Promise<EventData[]> => {
  const response = await apiClient.get<EventsResponse>('/api/v2/events');

  // APIレスポンス: { data: { events: [...] } } 形式
  // Hono API v2 returns { data: { events: [...], pagination: {...} } }
  const rawEvents = response.data?.events ?? [];

  // スネークケース→キャメルケース変換
  const events = rawEvents.map(event => ({
    id: String(event.id),
    name: event.event_name ?? '',
    details: event.event_details ?? '',
    url: event.event_reference_url ?? '',
    deadline: event.event_closing_day ?? '',
    endDisplayDate: event.event_displaying_day ?? '',
    type: normalizeEventType(event.event_type),
    created_at: event.created_at,
    updatedAt: event.updated_at ?? '',
    isActive: true, // v2 API doesn't have is_active yet, assuming true
  }));

  return events;
};
