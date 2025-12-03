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

// APIから受け取るファイルの型を定義
type RawFile = {
    id: number | string;
    file_name?: string;
    name?: string;
    upload_owner_name?: string;
    ownerName?: string;
    file_comment?: string;
    comment?: string;
    created_at?: string;
    uploadDate?: string;
    downloadable_at?: string;
    downloadableAt?: string;
    search_tag1?: string;
    search_tag2?: string;
    search_tag3?: string;
    search_tag4?: string;
};

/**
 * マイページ：チームファイル取得API
 */
/**
 * マイページ：チームファイル取得API
 */
export const fetchMyTeamFiles = async (): Promise<RawFile[]> => {
    const response = await apiClient.get<any>('/api/v2/files?data_type=1&mine=true&limit=1000');
    const rawFiles = response.data?.files || [];

    return rawFiles.map((file: any) => ({
        id: file.id,
        file_name: file.file_name,
        name: file.file_name,
        file_comment: file.file_comment,
        comment: file.file_comment,
        created_at: file.created_at,
        uploadDate: file.created_at,
        downloadable_at: file.downloadable_at,
        downloadableAt: file.downloadable_at,
        // tags mapping if needed
    }));
};

/**
 * マイページ：マッチファイル取得API
 */
export const fetchMyMatchFiles = async (): Promise<RawFile[]> => {
    const response = await apiClient.get<any>('/api/v2/files?data_type=2&mine=true&limit=1000');
    const rawFiles = response.data?.files || [];

    return rawFiles.map((file: any) => ({
        id: file.id,
        file_name: file.file_name,
        name: file.file_name,
        file_comment: file.file_comment,
        comment: file.file_comment,
        created_at: file.created_at,
        uploadDate: file.created_at,
        downloadable_at: file.downloadable_at,
        downloadableAt: file.downloadable_at,
    }));
};

/**
 * マイページ：イベント削除API
 */
export const deleteMyEvent = async (id: string | number) => {
    // TODO: v2 API実装待ち
    console.warn('deleteMyEvent is not implemented in v2 API yet');
    throw new Error('Not implemented');
    /*
    const response = await apiClient.post<{ deleted: boolean; error?: string }>(
        '/api/v1/delete/usersRegisteredCloumn',
        { id }
    );

    if (!response.data.deleted) {
        throw new Error(response.data.error || '削除に失敗しました');
    }
    return response.data;
    */
};

/**
 * マイページ：ファイル削除API
 */
export const deleteMyFile = async (id: string | number) => {
    const response = await apiClient.delete<{ message?: string }>(
        `/api/v2/files/${id}`
    );
    return response;
};

/**
 * マイページ：イベント取得API
 */
export const fetchMyEvents = async () => {
    // 認証済みユーザーのイベントのみを取得する専用エンドポイントを使用
    const response = await apiClient.get<any>('/api/v2/events/me');
    const rawEvents = response.data?.events || [];

    // スネークケース→キャメルケース変換
    return rawEvents.map((event: any) => ({
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
        isActive: true, // v2 API doesn't have is_active yet
    }));
};
