/**
 * ファイル関連のAPI関数
 */

import { apiClient } from './client';
import type {
  TeamFile,
  MatchFile,
  FileUploadOptions,
  FileUploadResponse,
  FileDeleteRequest,
  FileDeleteResponse,
  FileDownloadResult,
  MyFilesResponse,
  SumDownloadRequest,
} from '@/types/file';
import type { SearchParams, TeamSearchResult, MatchSearchResult } from '@/types/search';

export const filesApi = {
  // 検索関連
  async searchTeams(params: SearchParams): Promise<TeamSearchResult> {
    const response = await apiClient.get<TeamSearchResult>(
      `/api/v1/search/team?keyword=${encodeURIComponent(params.keyword)}&page=${params.page || 1}`
    );
    return response.data;
  },

  async searchMatches(params: SearchParams): Promise<MatchSearchResult> {
    const response = await apiClient.get<MatchSearchResult>(
      `/api/v1/search/match?keyword=${encodeURIComponent(params.keyword)}&page=${params.page || 1}`
    );
    return response.data;
  },

  // 一括ダウンロード用検索
  async sumDLSearchTeam(params: SearchParams): Promise<TeamSearchResult> {
    const response = await apiClient.get<TeamSearchResult>(
      `/api/v1/sumDLSearch/team?keyword=${encodeURIComponent(params.keyword)}&page=${params.page || 1}`
    );
    return response.data;
  },

  async sumDLSearchMatch(params: SearchParams): Promise<MatchSearchResult> {
    const response = await apiClient.get<MatchSearchResult>(
      `/api/v1/sumDLSearch/match?keyword=${encodeURIComponent(params.keyword)}&page=${params.page || 1}`
    );
    return response.data;
  },

  // アップロード関連
  async uploadTeamFile(
    file: File,
    isAuthenticated: boolean,
    options?: FileUploadOptions
  ): Promise<FileUploadResponse> {
    const endpoint = isAuthenticated ? '/api/v1/team/upload' : '/api/v1/team/simpleupload';
    const formData = new FormData();

    formData.append('teamFile', file);
    if (options?.ownerName) formData.append('teamOwnerName', options.ownerName);
    if (options?.comment) formData.append('teamComment', options.comment);
    if (options?.deletePassword) formData.append('teamDeletePassWord', options.deletePassword);
    if (options?.downloadDate) formData.append('teamDownloadableAt', options.downloadDate);
    if (options?.tags && Array.isArray(options.tags)) {
      formData.append('teamSearchTags', options.tags.join(','));
    }

    const response = await apiClient.upload<FileUploadResponse>(endpoint, formData);
    return response.data;
  },

  async uploadMatchFile(
    file: File,
    isAuthenticated: boolean,
    options?: FileUploadOptions
  ): Promise<FileUploadResponse> {
    const endpoint = isAuthenticated ? '/api/v1/match/upload' : '/api/v1/match/simpleupload';
    const formData = new FormData();

    formData.append('matchFile', file);
    if (options?.ownerName) formData.append('matchOwnerName', options.ownerName);
    if (options?.comment) formData.append('matchComment', options.comment);
    if (options?.deletePassword) formData.append('matchDeletePassWord', options.deletePassword);
    if (options?.downloadDate) formData.append('matchDownloadableAt', options.downloadDate);
    if (options?.tags && Array.isArray(options.tags)) {
      formData.append('matchSearchTags', options.tags.join(','));
    }

    const response = await apiClient.upload<FileUploadResponse>(endpoint, formData);
    return response.data;
  },

  // ダウンロード関連
  async tryDownloadTeamFile(teamId: number): Promise<FileDownloadResult> {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/download/${teamId}`;

    try {
      const res = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });

      const contentType = res.headers.get('Content-Type') || '';

      if (!res.ok) {
        if (contentType.includes('application/json')) {
          const data = await res.json();
          return {
            success: false,
            error: data.error || `ダウンロードできません (${res.status})`,
          };
        } else {
          return { success: false, error: `ダウンロード失敗 (${res.status})` };
        }
      }

      if (contentType.includes('application/json')) {
        const data = await res.json();
        return { success: false, error: data.error || 'ダウンロードできません' };
      }

      window.open(url, '_blank');
      return { success: true };
    } catch (e) {
      return { success: false, error: 'ダウンロード通信エラー' };
    }
  },

  async sumDownload(request: SumDownloadRequest): Promise<void> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/sumDownload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(request),
      credentials: 'include',
    });

    if (!response.ok) throw new Error('ダウンロード失敗');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sum.zip';
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 100);
  },

  // 削除関連
  async deleteSearchFile(request: FileDeleteRequest): Promise<FileDeleteResponse> {
    const response = await apiClient.post<FileDeleteResponse>('/api/v1/delete/searchFile', {
      id: request.id,
      deletePassword: request.deletePassword || '',
    });
    return response.data;
  },

  async deleteMyFile(id: string | number): Promise<FileDeleteResponse> {
    const response = await apiClient.post<FileDeleteResponse>('/api/v1/delete/myFile', { id });
    return response.data;
  },

  // マイページ関連
  async fetchMyTeamFiles(): Promise<TeamFile[]> {
    const response = await apiClient.get<MyFilesResponse>('/api/v1/mypage/team');
    return response.data.files as TeamFile[];
  },

  async fetchMyMatchFiles(): Promise<MatchFile[]> {
    const response = await apiClient.get<MyFilesResponse>('/api/v1/mypage/match');
    return response.data.files as MatchFile[];
  },
};
