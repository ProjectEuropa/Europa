/**
 * ファイル関連のAPI関数
 */

import type {
  FileDeleteRequest,
  FileDeleteResponse,
  FileDownloadResult,
  FileUploadOptions,
  FileUploadResponse,
  MatchFile,
  MyFilesResponse,
  SumDownloadRequest,
  TeamFile,
} from '@/types/file';
import type {
  MatchSearchResult,
  SearchParams,
  TeamSearchResult,
} from '@/types/search';
import { apiClient } from './client';

// 検索関連
export const searchTeams = async (params: SearchParams): Promise<TeamSearchResult> => {
  const url = `/api/v1/search/team?keyword=${encodeURIComponent(params.keyword)}&page=${params.page || 1}`;

  const response = await apiClient.get<any>(url);

  // APIレスポンスを変換（スネークケース → キャメルケース + エイリアス）
  // response は既にJSONパース済みなので、response.data ではなく response を使用
  const rawData = response.data || response;

  // APIレスポンスが配列として直接返される場合と、dataプロパティに含まれる場合の両方に対応
  let dataArray = [];
  if (Array.isArray(rawData)) {
    dataArray = rawData;
  } else if (Array.isArray(rawData.data)) {
    dataArray = rawData.data;
  } else {
    dataArray = [];
  }

  const transformedData = dataArray.map((item: any) => ({
    ...item,
    // エイリアスを追加
    name: item.file_name || '',
    ownerName: item.upload_owner_name || '',
    comment: item.file_comment || '',
    downloadableAt: item.downloadable_at || '',
    created_at: item.created_at || '',
    updatedAt: item.updated_at,
    searchTag1: item.search_tag1,
    searchTag2: item.search_tag2,
    searchTag3: item.search_tag3,
    searchTag4: item.search_tag4,
    uploadType: item.upload_type,
    type: 'team' as const,
  }));

  const result = {
    data: transformedData,
    meta: {
      currentPage: response.current_page || 1,
      lastPage: response.last_page || 1,
      perPage: response.per_page || 10,
      total: response.total || 0,
    },
  };

  return result;
};

export const searchMatches = async (params: SearchParams): Promise<MatchSearchResult> => {
  const url = `/api/v1/search/match?keyword=${encodeURIComponent(params.keyword)}&page=${params.page || 1}`;

  const response = await apiClient.get<any>(url);

  // APIレスポンスを変換（スネークケース → キャメルケース + エイリアス）
  const rawData = response.data || response;

  // APIレスポンスが配列として直接返される場合と、dataプロパティに含まれる場合の両方に対応
  let dataArray = [];
  if (Array.isArray(rawData)) {
    dataArray = rawData;
  } else if (Array.isArray(rawData.data)) {
    dataArray = rawData.data;
  } else {
    dataArray = [];
  }

  const transformedData = dataArray.map((item: any) => ({
    ...item,
    // エイリアスを追加
    name: item.file_name || '',
    ownerName: item.upload_owner_name || '',
    comment: item.file_comment || '',
    downloadableAt: item.downloadable_at || '',
    created_at: item.created_at || '',
    updatedAt: item.updated_at,
    searchTag1: item.search_tag1,
    searchTag2: item.search_tag2,
    searchTag3: item.search_tag3,
    searchTag4: item.search_tag4,
    uploadType: item.upload_type,
    type: 'match' as const,
  }));

  const result = {
    data: transformedData,
    meta: {
      currentPage: response.current_page || 1,
      lastPage: response.last_page || 1,
      perPage: response.per_page || 10,
      total: response.total || 0,
    },
  };

  return result;
};

// 一括ダウンロード用検索
export const sumDLSearchTeam = async (params: SearchParams): Promise<TeamSearchResult> => {
  const response = await apiClient.get<any>(
    `/api/v1/sumDLSearch/team?keyword=${encodeURIComponent(params.keyword)}&page=${params.page || 1}`
  );

  // APIレスポンスをキャメルケースに変換
  return {
    data: response.data.data || [],
    meta: {
      currentPage: response.data.current_page || 1,
      lastPage: response.data.last_page || 1,
      perPage: response.data.per_page || 10,
      total: response.data.total || 0,
    },
  };
};

export const sumDLSearchMatch = async (params: SearchParams): Promise<MatchSearchResult> => {
  const response = await apiClient.get<any>(
    `/api/v1/sumDLSearch/match?keyword=${encodeURIComponent(params.keyword)}&page=${params.page || 1}`
  );

  // APIレスポンスをキャメルケースに変換
  return {
    data: response.data.data || [],
    meta: {
      currentPage: response.data.current_page || 1,
      lastPage: response.data.last_page || 1,
      perPage: response.data.per_page || 10,
      total: response.data.total || 0,
    },
  };
};

// アップロード関連
export const uploadTeamFile = async (
  file: File,
  isAuthenticated: boolean,
  options?: FileUploadOptions
): Promise<FileUploadResponse> => {
  const endpoint = isAuthenticated
    ? '/api/v1/team/upload'
    : '/api/v1/team/simpleupload';
  const formData = new FormData();

  formData.append('teamFile', file);
  if (options?.ownerName) formData.append('teamOwnerName', options.ownerName);
  if (options?.comment) formData.append('teamComment', options.comment);
  if (options?.deletePassword)
    formData.append('teamDeletePassWord', options.deletePassword);
  if (options?.downloadDate)
    formData.append('teamDownloadableAt', options.downloadDate);
  if (options?.tags && Array.isArray(options.tags)) {
    formData.append('teamSearchTags', options.tags.join(','));
  }

  const response = await apiClient.upload<FileUploadResponse>(
    endpoint,
    formData
  );
  return response.data;
};

export const uploadMatchFile = async (
  file: File,
  isAuthenticated: boolean,
  options?: FileUploadOptions
): Promise<FileUploadResponse> => {
  const endpoint = isAuthenticated
    ? '/api/v1/match/upload'
    : '/api/v1/match/simpleupload';
  const formData = new FormData();

  formData.append('matchFile', file);
  if (options?.ownerName)
    formData.append('matchOwnerName', options.ownerName);
  if (options?.comment) formData.append('matchComment', options.comment);
  if (options?.deletePassword)
    formData.append('matchDeletePassWord', options.deletePassword);
  if (options?.downloadDate)
    formData.append('matchDownloadableAt', options.downloadDate);
  if (options?.tags && Array.isArray(options.tags)) {
    formData.append('matchSearchTags', options.tags.join(','));
  }

  const response = await apiClient.upload<FileUploadResponse>(
    endpoint,
    formData
  );
  return response.data;
};

// ダウンロード関連
export const tryDownloadTeamFile = async (teamId: number): Promise<FileDownloadResult> => {
  try {
    // ブラウザで直接ダウンロードを開く
    // apiClientのbaseURLを使用して一貫性を保つ
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/download/${teamId}`;

    // window.openを使用してダウンロードを試行
    // ブラウザが自動的にcredentials（Cookie）を送信し、
    // サーバー側でCSRF検証とダウンロード処理が行われる
    window.open(url, '_blank');

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'ダウンロード通信エラー'
    };
  }
};

export const sumDownload = async (request: SumDownloadRequest): Promise<void> => {
  try {
    const { blob, filename } = await apiClient.download('/api/v1/sumDownload', request);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'sum.zip'; // サーバーからのファイル名を優先
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 100);
  } catch (error) {
    console.error('Download failed:', error);
    throw error; // 元のエラーをそのまま再スロー（スタックトレース保持）
  }
};

// 削除関連
export const deleteSearchFile = async (
  request: FileDeleteRequest
): Promise<FileDeleteResponse> => {
  const response = await apiClient.post<FileDeleteResponse>(
    '/api/v1/delete/searchFile',
    {
      id: request.id,
      deletePassword: request.deletePassword || '',
    }
  );
  return response.data;
};

export const deleteMyFile = async (id: string | number): Promise<FileDeleteResponse> => {
  const response = await apiClient.post<FileDeleteResponse>(
    '/api/v1/delete/myFile',
    { id }
  );
  return response.data;
};

// マイページ関連
// 柔軟なレスポンス構造に対応するための型定義
interface FlexibleResponse<T> {
  data?: Record<string, T[] | undefined>;
  [key: string]: unknown;
}

/**
 * APIレスポンスから配列データを安全に抽出するヘルパー関数
 * @param response APIレスポンス
 * @param key データが含まれるプロパティ名（例: 'files', 'events'）
 */
export function extractDataFromResponse<T>(response: unknown, key: string): T[] {
  if (!response || typeof response !== 'object') {
    return [];
  }

  const flexibleResponse = response as FlexibleResponse<T>;

  // 1. response[key] をチェック
  if (Array.isArray(flexibleResponse[key])) {
    return flexibleResponse[key] as T[];
  }

  // 2. response.data[key] をチェック
  if (flexibleResponse.data && Array.isArray(flexibleResponse.data[key])) {
    return flexibleResponse.data[key];
  }

  return [];
}

export const fetchMyTeamFiles = async (): Promise<TeamFile[]> => {
  const response = await apiClient.get<unknown>(
    '/api/v1/mypage/team'
  );
  return extractDataFromResponse<TeamFile>(response, 'files');
};

export const fetchMyMatchFiles = async (): Promise<MatchFile[]> => {
  const response = await apiClient.get<unknown>(
    '/api/v1/mypage/match'
  );
  return extractDataFromResponse<MatchFile>(response, 'files');
};

// ファイル削除（検索結果からの削除）
export const deleteFile = async (
  id: number,
  deletePassword?: string
): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>(
    '/api/v1/delete/searchFile',
    {
      id,
      deletePassword: deletePassword || '',
    }
  );
  return response.data;
};

export const filesApi = {
  searchTeams,
  searchMatches,
  sumDLSearchTeam,
  sumDLSearchMatch,
  uploadTeamFile,
  uploadMatchFile,
  tryDownloadTeamFile,
  sumDownload,
  deleteSearchFile,
  deleteMyFile,
  fetchMyTeamFiles,
  fetchMyMatchFiles,
  deleteFile,
};

