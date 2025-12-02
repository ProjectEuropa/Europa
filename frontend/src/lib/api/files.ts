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
import { extractDataFromResponse } from './utils';

// 検索関連
// 検索関連
export const searchTeams = async (params: SearchParams): Promise<TeamSearchResult> => {
  const url = `/api/v2/files?tag=team&page=${params.page || 1}&limit=10`;

  const response = await apiClient.get<any>(url);
  const rawData = response.data?.files || [];
  const pagination = response.data?.pagination || { page: 1, limit: 10, total: 0 };

  const transformedData = rawData.map((item: any) => ({
    id: item.id,
    name: item.file_name || '',
    ownerName: '', // v2 API doesn't return owner name yet (only upload_user_id)
    comment: item.file_comment || '',
    downloadableAt: item.downloadable_at || '',
    created_at: item.created_at || '',
    updatedAt: item.updated_at,
    searchTag1: item.tags?.[0] || '',
    searchTag2: item.tags?.[1] || '',
    searchTag3: item.tags?.[2] || '',
    searchTag4: item.tags?.[3] || '',
    uploadType: 'team',
    type: 'team' as const,
    file_path: item.file_path,
    file_size: item.file_size,
  }));

  const result = {
    data: transformedData,
    meta: {
      currentPage: pagination.page,
      lastPage: Math.ceil(pagination.total / pagination.limit),
      perPage: pagination.limit,
      total: pagination.total,
    },
  };

  return result;
};

export const searchMatches = async (params: SearchParams): Promise<MatchSearchResult> => {
  const url = `/api/v2/files?tag=match&page=${params.page || 1}&limit=10`;

  const response = await apiClient.get<any>(url);
  const rawData = response.data?.files || [];
  const pagination = response.data?.pagination || { page: 1, limit: 10, total: 0 };

  const transformedData = rawData.map((item: any) => ({
    id: item.id,
    name: item.file_name || '',
    ownerName: '', // v2 API doesn't return owner name yet
    comment: item.file_comment || '',
    downloadableAt: item.downloadable_at || '',
    created_at: item.created_at || '',
    updatedAt: item.updated_at,
    searchTag1: item.tags?.[0] || '',
    searchTag2: item.tags?.[1] || '',
    searchTag3: item.tags?.[2] || '',
    searchTag4: item.tags?.[3] || '',
    uploadType: 'match',
    type: 'match' as const,
    file_path: item.file_path,
    file_size: item.file_size,
  }));

  const result = {
    data: transformedData,
    meta: {
      currentPage: pagination.page,
      lastPage: Math.ceil(pagination.total / pagination.limit),
      perPage: pagination.limit,
      total: pagination.total,
    },
  };

  return result;
};

// 一括ダウンロード用検索
export const sumDLSearchTeam = async (params: SearchParams): Promise<TeamSearchResult> => {
  // TODO: v2 API実装待ち
  console.warn('sumDLSearchTeam is not implemented in v2 API yet');
  return { data: [], meta: { currentPage: 1, lastPage: 1, perPage: 10, total: 0 } };
};

export const sumDLSearchMatch = async (params: SearchParams): Promise<MatchSearchResult> => {
  // TODO: v2 API実装待ち
  console.warn('sumDLSearchMatch is not implemented in v2 API yet');
  return { data: [], meta: { currentPage: 1, lastPage: 1, perPage: 10, total: 0 } };
};

// アップロード関連
export const uploadTeamFile = async (
  file: File,
  isAuthenticated: boolean,
  options?: FileUploadOptions
): Promise<FileUploadResponse> => {
  const endpoint = '/api/v2/files';
  const formData = new FormData();

  formData.append('file', file);
  if (options?.comment) formData.append('comment', options.comment);

  // タグの構築
  const tags = ['team'];
  if (options?.tags && Array.isArray(options.tags)) {
    tags.push(...options.tags);
  }
  formData.append('tags', JSON.stringify(tags));

  const response = await apiClient.upload<any>(
    endpoint,
    formData
  );

  // v2 response format: { data: { file: {...} } }
  // Frontend expects FileUploadResponse (which might be different, let's adapt)
  const newFile = response.data.file;
  return {
    id: newFile.id,
    name: newFile.file_name,
    comment: newFile.file_comment,
    created_at: newFile.created_at,
    // ... map other fields as needed
  } as unknown as FileUploadResponse;
};

export const uploadMatchFile = async (
  file: File,
  isAuthenticated: boolean,
  options?: FileUploadOptions
): Promise<FileUploadResponse> => {
  const endpoint = '/api/v2/files';
  const formData = new FormData();

  formData.append('file', file);
  if (options?.comment) formData.append('comment', options.comment);

  // タグの構築
  const tags = ['match'];
  if (options?.tags && Array.isArray(options.tags)) {
    tags.push(...options.tags);
  }
  formData.append('tags', JSON.stringify(tags));

  const response = await apiClient.upload<any>(
    endpoint,
    formData
  );

  const newFile = response.data.file;
  return {
    id: newFile.id,
    name: newFile.file_name,
    comment: newFile.file_comment,
    created_at: newFile.created_at,
  } as unknown as FileUploadResponse;
};

// ダウンロード関連
export const tryDownloadTeamFile = async (teamId: number): Promise<FileDownloadResult> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/files/${teamId}`;

    // まずfetchでレスポンスを確認
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include', // Cookieを含める
    });

    // エラーレスポンスの場合
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error?.message || 'ダウンロードに失敗しました'
      };
    }

    // 成功の場合、Blobとしてダウンロード
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);

    // ダウンロード用のaタグを作成
    const a = document.createElement('a');
    a.href = downloadUrl;

    // Content-Dispositionヘッダーからファイル名を取得
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = `file_${teamId}`;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        const rawFilename = filenameMatch[1].replace(/['"]/g, '');
        try {
          // URLエンコードされたファイル名をデコード（日本語対応）
          filename = decodeURIComponent(rawFilename);
        } catch {
          // デコードに失敗した場合は、そのままの値を使用します
          filename = rawFilename;
        }
      }
    }
    a.download = filename;

    document.body.appendChild(a);
    a.click();

    // クリーンアップ
    setTimeout(() => {
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    }, 100);

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'ダウンロード通信エラー'
    };
  }
};

export const sumDownload = async (request: SumDownloadRequest): Promise<void> => {
  // TODO: v2 API実装待ち
  console.warn('sumDownload is not implemented in v2 API yet');
  throw new Error('Not implemented');
};

// 削除関連
export const deleteSearchFile = async (
  request: FileDeleteRequest
): Promise<FileDeleteResponse> => {
  const response = await apiClient.delete<FileDeleteResponse>(
    `/api/v2/files/${request.id}`
  );
  // v2 returns { message: "..." }
  return response as unknown as FileDeleteResponse;
};

export const deleteMyFile = async (id: string | number): Promise<FileDeleteResponse> => {
  const response = await apiClient.delete<FileDeleteResponse>(
    `/api/v2/files/${id}`
  );
  return response as unknown as FileDeleteResponse;
};

// マイページ関連

export const fetchMyTeamFiles = async (): Promise<TeamFile[]> => {
  const response = await apiClient.get<any>(
    '/api/v2/files?tag=team&mine=true'
  );
  // v2 returns { data: { files: [...] } }
  const rawFiles = response.data?.files || [];

  return rawFiles.map((file: any) => ({
    id: file.id,
    name: file.file_name,
    comment: file.file_comment,
    created_at: file.created_at,
    // map other fields
  })) as TeamFile[];
};

export const fetchMyMatchFiles = async (): Promise<MatchFile[]> => {
  const response = await apiClient.get<any>(
    '/api/v2/files?tag=match&mine=true'
  );
  const rawFiles = response.data?.files || [];

  return rawFiles.map((file: any) => ({
    id: file.id,
    name: file.file_name,
    comment: file.file_comment,
    created_at: file.created_at,
    // map other fields
  })) as MatchFile[];
};

// ファイル削除（検索結果からの削除）
export const deleteFile = async (
  id: number,
  deletePassword?: string
): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(
    `/api/v2/files/${id}`
  );
  return response as unknown as { message: string };
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

