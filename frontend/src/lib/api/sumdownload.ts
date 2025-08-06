import type { SumDownloadItem } from '@/components/features/sumdownload';
import { apiRequest } from '@/utils/api';

export interface SumDownloadSearchResponse {
  data: SumDownloadItem[];
  current_page: number;
  last_page: number;
  total: number;
}

/**
 * チーム一括ダウンロード用の検索API
 */
export const sumDLSearchTeam = async (
  keyword: string = '',
  page: number = 1
): Promise<SumDownloadSearchResponse> => {
  try {
    const response = await apiRequest(
      `/api/v1/sumDLSearch/team?keyword=${encodeURIComponent(keyword)}&page=${page}`
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `チーム検索に失敗しました (${response.status})`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('チーム検索中に予期しないエラーが発生しました');
  }
};

/**
 * マッチ一括ダウンロード用の検索API
 */
export const sumDLSearchMatch = async (
  keyword: string = '',
  page: number = 1
): Promise<SumDownloadSearchResponse> => {
  try {
    const response = await apiRequest(
      `/api/v1/sumDLSearch/match?keyword=${encodeURIComponent(keyword)}&page=${page}`
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `マッチ検索に失敗しました (${response.status})`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('マッチ検索中に予期しないエラーが発生しました');
  }
};

/**
 * 一括ダウンロード実行API
 */
export const sumDownload = async (checkedIds: number[]): Promise<void> => {
  if (checkedIds.length === 0) {
    throw new Error('ダウンロードするファイルを選択してください');
  }

  if (checkedIds.length > 50) {
    throw new Error('一度に選択できるファイルは50個までです');
  }

  try {
    const response = await apiRequest('/api/v1/sumDownload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checkedId: checkedIds }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `ダウンロードに失敗しました (${response.status})`
      );
    }

    // ZIPファイルのダウンロード処理
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    // Content-Dispositionヘッダーからファイル名を取得
    const disposition = response.headers.get('content-disposition');
    let filename = `${Date.now()}_bulk_download.zip`; // フォールバック用のファイル名

    if (disposition) {
      const filenameMatch = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
        disposition
      );
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '');
        // URLデコードを試行
        try {
          filename = decodeURIComponent(filename);
        } catch {
          // デコードに失敗した場合はそのまま使用
        }
      }
    }

    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // クリーンアップ
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 100);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('ダウンロード中に予期しないエラーが発生しました');
  }
};
