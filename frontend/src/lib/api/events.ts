import { apiClient } from '@/lib/api/client';

export interface EventData {
  id: string;
  name: string;
  details: string;
  url: string;
  deadline: string;
  endDisplayDate: string;
  type: string;
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
export const fetchEvents = async () => {
  const response = await apiClient.get<{ data: any[] }>('/api/v1/event');

  // スネークケース→キャメルケース変換
  // apiClientはレスポンスボディをそのまま返すので、ここで変換を行う
  // ただし、apiClient.getの戻り値はApiResponse<T>型だが、
  // 実装では response.json() を返しているため、サーバーのレスポンス構造に依存する。
  // ここではサーバーが { data: [...] } を返すと仮定。

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

  return { data: events };
};
