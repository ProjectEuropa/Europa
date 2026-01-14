import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { SumDownloadItem } from '@/components/features/sumdownload';
import {
  type SumDownloadSearchResponse,
  sumDLSearchMatch,
  sumDLSearchTeam,
  sumDownload,
} from '@/lib/api/sumdownload';

interface SumDownloadSearchParams {
  keyword: string;
  page: number;
  sortOrder?: 'asc' | 'desc';
}

// チーム検索フック
export const useSumDownloadTeamSearch = (params: SumDownloadSearchParams) => {
  return useQuery({
    queryKey: ['sumdownload', 'team', params.keyword, params.page, params.sortOrder],
    queryFn: () => sumDLSearchTeam(params.keyword, params.page, params.sortOrder),
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
    retry: (failureCount, error: any) => {
      // 認証エラーの場合はリトライしない
      if (error?.status === 401 || error?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// マッチ検索フック
export const useSumDownloadMatchSearch = (params: SumDownloadSearchParams) => {
  return useQuery({
    queryKey: ['sumdownload', 'match', params.keyword, params.page, params.sortOrder],
    queryFn: () => sumDLSearchMatch(params.keyword, params.page, params.sortOrder),
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
    retry: (failureCount, error: any) => {
      // 認証エラーの場合はリトライしない
      if (error?.status === 401 || error?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// ダウンロードフック
export const useSumDownload = () => {
  return useMutation({
    mutationFn: (checkedIds: number[]) => sumDownload(checkedIds),
    onSuccess: () => {
      toast.success('ダウンロードが開始されました');
    },
    onError: (error: Error) => {
      console.error('Download error:', error);
      toast.error(error.message || 'ダウンロードに失敗しました');
    },
  });
};
