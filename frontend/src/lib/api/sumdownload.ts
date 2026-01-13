import { apiClient } from '@/lib/api/client';
import type { SumDownloadItem } from '@/components/features/sumdownload';

export interface SumDownloadSearchResponse {
  data: SumDownloadItem[];
  current_page: number;
  last_page: number;
  total: number;
}

/**
 * チーム一括ダウンロード用の検索API (v2)
 */
export const sumDLSearchTeam = async (
  keyword: string = '',
  page: number = 1,
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<SumDownloadSearchResponse> => {
  // v2 APIを使用、limit=50で一括ダウンロード用に多めに取得
  const response = await apiClient.get<any>(
    `/api/v2/files?data_type=1&limit=50&page=${page}&keyword=${encodeURIComponent(keyword)}&sort_order=${sortOrder}`
  );

  // v2 APIのレスポンス形式を一括ダウンロード用の形式に変換
  const files = response.data?.files || [];
  const pagination = response.data?.pagination || { page: 1, limit: 50, total: 0 };

  return {
    data: files.map((file: any) => ({
      id: file.id,
      file_name: file.file_name,
      upload_owner_name: file.upload_owner_name,
      file_comment: file.file_comment,
      created_at: file.created_at,
      file_size: file.file_size,
      downloadable_at: file.downloadable_at,
    })),
    current_page: pagination.page,
    last_page: Math.ceil(pagination.total / pagination.limit),
    total: pagination.total,
  };
};

/**
 * マッチ一括ダウンロード用の検索API (v2)
 */
export const sumDLSearchMatch = async (
  keyword: string = '',
  page: number = 1,
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<SumDownloadSearchResponse> => {
  // v2 APIを使用、limit=50で一括ダウンロード用に多めに取得
  const response = await apiClient.get<any>(
    `/api/v2/files?data_type=2&limit=50&page=${page}&keyword=${encodeURIComponent(keyword)}&sort_order=${sortOrder}`
  );

  // v2 APIのレスポンス形式を一括ダウンロード用の形式に変換
  const files = response.data?.files || [];
  const pagination = response.data?.pagination || { page: 1, limit: 50, total: 0 };

  return {
    data: files.map((file: any) => ({
      id: file.id,
      file_name: file.file_name,
      upload_owner_name: file.upload_owner_name,
      file_comment: file.file_comment,
      created_at: file.created_at,
      file_size: file.file_size,
      downloadable_at: file.downloadable_at,
    })),
    current_page: pagination.page,
    last_page: Math.ceil(pagination.total / pagination.limit),
    total: pagination.total,
  };
};

/**
 * 一括ダウンロード実行API
 */
// ブラウザ環境でのダウンロード処理をラップする関数
const performBrowserDownload = (blob: Blob, filename: string): (() => void) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    // テスト環境やSSR環境では何もしない
    return () => { };
  }

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.documentElement.appendChild(a);
  a.click();

  const cleanup = () => {
    try {
      if (typeof window !== 'undefined' && window.URL) {
        window.URL.revokeObjectURL(url);
      }
      if (a.parentNode) {
        a.parentNode.removeChild(a);
      }
    } catch (error) {
      console.error('Error during download cleanup:', error);
    }
  };

  // 100ms後に自動クリーンアップ
  const timeoutId = setTimeout(cleanup, 100);

  // 手動クリーンアップ関数を返す
  return () => {
    clearTimeout(timeoutId);
    cleanup();
  };
};

export const sumDownload = async (checkedIds: number[]): Promise<() => void> => {
  if (checkedIds.length === 0) {
    throw new Error('ダウンロードするファイルを選択してください');
  }

  if (checkedIds.length > 50) {
    throw new Error('一度に選択できるファイルは50個までです');
  }

  try {
    // v2 APIエンドポイントを使用
    const { blob, filename } = await apiClient.download('/api/v2/files/bulk-download', { fileIds: checkedIds });

    // サーバーからのファイル名を優先、なければタイムスタンプ付き
    const downloadFilename = filename || `bulk_download_${Date.now()}.zip`;

    return performBrowserDownload(blob, downloadFilename);
  } catch (error: any) {
    console.error('Download failed:', error);

    // APIエラーからメッセージを抽出
    if (error?.message) {
      throw new Error(error.message);
    }

    // ステータスコードに応じたメッセージ
    if (error?.status === 403) {
      throw new Error('選択されたファイルはまだダウンロード可能日時に達していません');
    } else if (error?.status === 404) {
      throw new Error('ダウンロード可能なファイルがありません');
    } else if (error?.status === 413) {
      throw new Error('ファイルサイズの合計が大きすぎます');
    }

    throw new Error('ダウンロードに失敗しました。しばらくしてから再度お試しください。');
  }
};

