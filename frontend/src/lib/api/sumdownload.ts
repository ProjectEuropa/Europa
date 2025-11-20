import { apiClient } from '@/lib/api/client';
import type { SumDownloadItem } from '@/components/features/sumdownload';

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
  const response = await apiClient.get<any>(
    `/api/v1/sumDLSearch/team?keyword=${encodeURIComponent(keyword)}&page=${page}`
  );

  // レスポンス構造の調整
  // apiClientはApiResponse<T>を返すが、ここではサーバーが返す生のJSON構造に依存
  // サーバーが { data: { data: [], ... } } のように返しているか、
  // { data: [], current_page: ... } のように返しているか確認が必要だが、
  // utils/api.tsの実装を見ると res.json() をそのまま返しているので、
  // apiClient.get の戻り値（response.data または response そのもの）を返す

  // apiClientの実装では、response.json()の結果を返している。
  // サーバーがLaravelのPaginatedResourceResponseを返している場合、
  // { data: [...], meta: {...}, links: {...} } または
  // { data: [...], current_page: ..., ... } (Paginator)

  return response as unknown as SumDownloadSearchResponse;
};

/**
 * マッチ一括ダウンロード用の検索API
 */
export const sumDLSearchMatch = async (
  keyword: string = '',
  page: number = 1
): Promise<SumDownloadSearchResponse> => {
  const response = await apiClient.get<any>(
    `/api/v1/sumDLSearch/match?keyword=${encodeURIComponent(keyword)}&page=${page}`
  );
  return response as unknown as SumDownloadSearchResponse;
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
    // apiClient.downloadメソッドを使用
    const blob = await apiClient.download('/api/v1/sumDownload', { checkedId: checkedIds });

    // ファイル名の生成（サーバーからのヘッダー取得はapiClient.downloadでは難しいので、デフォルト名を使用）
    // 必要であればapiClient.downloadを拡張してResponseオブジェクトへのアクセスを提供するべきだが、
    // ここでは簡易的にタイムスタンプ付きファイル名を使用
    const filename = `${Date.now()}_bulk_download.zip`;

    return performBrowserDownload(blob, filename);
  } catch (error) {
    console.error('Download failed:', error);
    throw new Error('Download failed');
  }
};

