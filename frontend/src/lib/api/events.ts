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
  try {
    // イベントタイプの変換
    let type = '2'; // デフォルト: その他
    if (formData.type === 'tournament') {
      type = '1';
    } else if (formData.type === 'announcement' || formData.type === 'other') {
      type = '2';
    }

    // 日付の変換 (YYYY-MM-DD -> ISO 8601)
    // 締切と表示期限は、その日の終わり(23:59:59)とする
    const deadline = new Date(`${formData.deadline}T23:59:59`).toISOString();
    const endDisplayDate = new Date(`${formData.endDisplayDate}T23:59:59`).toISOString();

    const response = await apiClient.post('/api/v2/events', {
      name: formData.name,
      details: formData.details,
      url: formData.url,
      type: type,
      deadline: deadline,
      endDisplayDate: endDisplayDate,
    });
    return { status: 'success', data: response };
  } catch (error: any) {
    console.error('Failed to register event:', error);
    return {
      status: 'error',
      message: error.message || 'イベントの登録に失敗しました'
    };
  }
};

/**
 * イベント一覧取得API
 */
export const fetchEvents = async (): Promise<EventData[]> => {
  const response = await apiClient.get<any>('/api/v2/events');

  // APIレスポンス: { data: { events: [...] } } 形式
  // Hono API v2 returns { data: { events: [...], pagination: {...} } }
  const rawEvents = response.data?.events ?? [];

  // スネークケース→キャメルケース変換
  const events = rawEvents.map((event: any) => ({
    id: String(event.id),
    name: event.event_name ?? '',
    details: event.event_details ?? '',
    url: event.event_reference_url ?? '',
    deadline: event.event_closing_day ?? '',
    endDisplayDate: event.event_displaying_day ?? '',
    type: event.event_type ?? '',
    created_at: event.created_at,
    updatedAt: event.updated_at,
    isActive: true, // v2 API doesn't have is_active yet, assuming true
  }));

  return events;
};
