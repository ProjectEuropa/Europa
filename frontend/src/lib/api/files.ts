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
    const url = `/api/v1/search/team?keyword=${encodeURIComponent(params.keyword)}&page=${params.page || 1}`;
    console.log('API Request URL:', url);

    const response = await apiClient.get<any>(url);

    console.log('API Response:', response);
    console.log('API Response Data:', response.data);
    console.log('API Response Type:', typeof response);
    console.log('API Response Data Type:', typeof response.data);
    console.log('API Response Keys:', Object.keys(response));
    console.log('API Response Data Keys:', response.data ? Object.keys(response.data) : 'no data');

    // APIレスポンスを変換（スネークケース → キャメルケース + エイリアス）
    // response は既にJSONパース済みなので、response.data ではなく response を使用
    const rawData = response.data || response;
    console.log('Raw Data:', rawData);
    console.log('Raw Data Type:', typeof rawData);
    console.log('Raw Data Keys:', Object.keys(rawData));
    console.log('Raw Data.data:', rawData.data);
    console.log('Raw Data.data Type:', typeof rawData.data);
    console.log('Raw Data.data Length:', Array.isArray(rawData.data) ? rawData.data.length : 'not array');

    // APIレスポンスが配列として直接返される場合と、dataプロパティに含まれる場合の両方に対応
    let dataArray = [];
    if (Array.isArray(rawData)) {
      console.log('Raw data is array, using directly');
      dataArray = rawData;
    } else if (Array.isArray(rawData.data)) {
      console.log('Raw data.data is array, using rawData.data');
      dataArray = rawData.data;
    } else {
      console.log('No array found in response');
      dataArray = [];
    }

    console.log('Data Array:', dataArray);
    console.log('Data Array Length:', dataArray.length);

    const transformedData = dataArray.map((item: any) => ({
      ...item,
      // エイリアスを追加
      name: item.file_name || '',
      ownerName: item.upload_owner_name || '',
      comment: item.file_comment || '',
      downloadableAt: item.downloadable_at || '',
      createdAt: item.created_at || '',
      updatedAt: item.updated_at,
      searchTag1: item.search_tag1,
      searchTag2: item.search_tag2,
      searchTag3: item.search_tag3,
      searchTag4: item.search_tag4,
      upload_type: item.upload_type,
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

    console.log('Transformed Result:', result);
    return result;
  },

  async searchMatches(params: SearchParams): Promise<MatchSearchResult> {
    const url = `/api/v1/search/match?keyword=${encodeURIComponent(params.keyword)}&page=${params.page || 1}`;
    console.log('API Request URL (Match):', url);

    const response = await apiClient.get<any>(url);

    console.log('API Response (Match):', response);
    console.log('API Response Data (Match):', response.data);
    console.log('API Response Type (Match):', typeof response);
    console.log('API Response Data Type (Match):', typeof response.data);
    console.log('API Response Keys (Match):', Object.keys(response));
    console.log('API Response Data Keys (Match):', response.data ? Object.keys(response.data) : 'no data');

    // APIレスポンスを変換（スネークケース → キャメルケース + エイリアス）
    const rawData = response.data || response;
    console.log('Raw Data (Match):', rawData);
    console.log('Raw Data Type (Match):', typeof rawData);
    console.log('Raw Data Keys (Match):', Object.keys(rawData));
    console.log('Raw Data.data (Match):', rawData.data);
    console.log('Raw Data.data Type (Match):', typeof rawData.data);
    console.log('Raw Data.data Length (Match):', Array.isArray(rawData.data) ? rawData.data.length : 'not array');

    // APIレスポンスが配列として直接返される場合と、dataプロパティに含まれる場合の両方に対応
    let dataArray = [];
    if (Array.isArray(rawData)) {
      console.log('Raw data is array (Match), using directly');
      dataArray = rawData;
    } else if (Array.isArray(rawData.data)) {
      console.log('Raw data.data is array (Match), using rawData.data');
      dataArray = rawData.data;
    } else {
      console.log('No array found in response (Match)');
      dataArray = [];
    }

    console.log('Data Array (Match):', dataArray);
    console.log('Data Array Length (Match):', dataArray.length);

    const transformedData = dataArray.map((item: any) => ({
      ...item,
      // エイリアスを追加
      name: item.file_name || '',
      ownerName: item.upload_owner_name || '',
      comment: item.file_comment || '',
      downloadableAt: item.downloadable_at || '',
      createdAt: item.created_at || '',
      updatedAt: item.updated_at,
      searchTag1: item.search_tag1,
      searchTag2: item.search_tag2,
      searchTag3: item.search_tag3,
      searchTag4: item.search_tag4,
      upload_type: item.upload_type,
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

    console.log('Transformed Result (Match):', result);
    return result;
  },

  // 一括ダウンロード用検索
  async sumDLSearchTeam(params: SearchParams): Promise<TeamSearchResult> {
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
  },

  async sumDLSearchMatch(params: SearchParams): Promise<MatchSearchResult> {
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
