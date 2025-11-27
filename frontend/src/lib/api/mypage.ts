import { apiClient } from '@/lib/api/client';
import { extractDataFromResponse } from './utils';

// APIから受け取るイベントの型を定義
type RawEvent = {
    id: number | string;
    event_name?: string;
    event_details?: string;
    event_reference_url?: string;
    event_closing_day?: string;
    event_displaying_day?: string;
    event_type?: string;
    created_at?: string;
    updated_at?: string;
    is_active?: boolean;
};

/**
 * マイページ：チームファイル取得API
 */
export const fetchMyTeamFiles = async () => {
    const response = await apiClient.get<{ files: any[] }>('/api/v1/mypage/team');
    // apiClientはエラー時に例外を投げるので、ここでは成功時の処理のみ記述
    return response.data.files || [];
};

/**
 * マイページ：マッチファイル取得API
 */
export const fetchMyMatchFiles = async () => {
    const response = await apiClient.get<{ files: any[] }>('/api/v1/mypage/match');
    return response.data.files || [];
};

/**
 * マイページ：イベント削除API
 */
export const deleteMyEvent = async (id: string | number) => {
    const response = await apiClient.post<{ deleted: boolean; error?: string }>(
        '/api/v1/delete/usersRegisteredCloumn',
        { id }
    );

    if (!response.data.deleted) {
        throw new Error(response.data.error || '削除に失敗しました');
    }
    return response.data;
};

/**
 * マイページ：ファイル削除API
 */
export const deleteMyFile = async (id: string | number) => {
    const response = await apiClient.post<{ message?: string }>(
        '/api/v1/delete/myFile',
        { id }
    );
    return response.data;
};

/**
 * マイページ：イベント取得API
 */
export const fetchMyEvents = async () => {
    const response = await apiClient.get<unknown>('/api/v1/mypage/events');

    const events = extractDataFromResponse<RawEvent>(response, 'events');

    // スネークケース→キャメルケース変換
    return events.map((event: RawEvent) => ({
        id: String(event.id),
        name: event.event_name ?? '',
        details: event.event_details ?? '',
        url: event.event_reference_url ?? '',
        deadline: event.event_closing_day ?? '',
        endDisplayDate: event.event_displaying_day ?? '',
        type: event.event_type ?? '',
        registeredDate: event.created_at ? event.created_at.slice(0, 10) : '',
        created_at: event.created_at,
        updatedAt: event.updated_at,
        isActive: event.is_active,
    }));
};
