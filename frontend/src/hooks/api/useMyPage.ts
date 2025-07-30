import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  MyPageEvent,
  MyPageFile,
  ProfileData,
  UserUpdateData,
} from '@/types/user';
import {
  deleteMyFile,
  fetchMyEvents,
  fetchMyMatchFiles,
  fetchMyTeamFiles,
  updateUserName,
} from '@/utils/api';
import { useAuthStore } from '@/stores/authStore';

// プロフィール取得
export const useProfile = () => {
  // authStoreからユーザー情報を取得
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async (): Promise<ProfileData> => {
      if (!user) {
        throw new Error('User not found');
      }

      return {
        name: user.name,
        email: user.email,
        joinDate: user.createdAt
          ? user.createdAt.slice(0, 10).replace(/-/g, '/')
          : '',
      };
    },
    enabled: !!user, // ユーザーが存在する場合のみクエリを実行
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  });
};

// プロフィール更新
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (data: UserUpdateData) => {
      return updateUserName(data.name);
    },
    onSuccess: () => {
      // ユーザーIDを含むプロフィールクエリを無効化
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
      }
      // 全てのプロフィールクエリを無効化（フォールバック）
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
      toast.success('プロフィールを更新しました');
    },
    onError: error => {
      console.error('Profile update error:', error);
      toast.error('プロフィールの更新に失敗しました');
    },
  });
};

// チームファイル取得
export const useMyTeamFiles = () => {
  return useQuery({
    queryKey: ['mypage', 'teams'],
    queryFn: async (): Promise<MyPageFile[]> => {
      const data = await fetchMyTeamFiles();
      return data.map((item: any) => ({
        id: item.id,
        name: item.name ?? item.file_name ?? '',
        uploadDate: item.uploadDate ?? item.created_at ?? '',
        downloadableAt: item.downloadableAt ?? item.downloadable_at ?? '',
        comment: item.comment ?? item.file_comment ?? '',
        type: 'team' as const,
      }));
    },
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  });
};

// マッチファイル取得
export const useMyMatchFiles = () => {
  return useQuery({
    queryKey: ['mypage', 'matches'],
    queryFn: async (): Promise<MyPageFile[]> => {
      const data = await fetchMyMatchFiles();
      return data.map((item: any) => ({
        id: item.id,
        name: item.name ?? item.file_name ?? '',
        uploadDate: item.uploadDate ?? item.created_at ?? '',
        downloadableAt: item.downloadableAt ?? item.downloadable_at ?? '',
        comment: item.comment ?? item.file_comment ?? '',
        type: 'match' as const,
      }));
    },
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  });
};

// イベント取得
export const useMyEvents = () => {
  return useQuery({
    queryKey: ['mypage', 'events'],
    queryFn: async (): Promise<MyPageEvent[]> => {
      const data = await fetchMyEvents();
      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        details: item.details,
        url: item.url,
        deadline: item.deadline,
        endDisplayDate: item.endDisplayDate,
        type:
          item.type === '大会'
            ? 'tournament'
            : item.type === '告知'
              ? 'announcement'
              : 'other',
        registeredDate: item.registeredDate,
      }));
    },
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  });
};

// ファイル削除
export const useDeleteFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fileId: string) => {
      return deleteMyFile(fileId);
    },
    onSuccess: () => {
      // 関連するクエリを無効化
      queryClient.invalidateQueries({ queryKey: ['mypage', 'teams'] });
      queryClient.invalidateQueries({ queryKey: ['mypage', 'matches'] });
      toast.success('ファイルを削除しました');
    },
    onError: error => {
      console.error('File deletion error:', error);
      toast.error('ファイルの削除に失敗しました');
    },
  });
};

// イベント削除
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const { deleteMyEvent } = await import('@/utils/api');
      return deleteMyEvent(eventId);
    },
    onSuccess: () => {
      // イベントクエリを無効化
      queryClient.invalidateQueries({ queryKey: ['mypage', 'events'] });
      toast.success('イベントを削除しました');
    },
    onError: error => {
      console.error('Event deletion error:', error);
      toast.error('イベントの削除に失敗しました');
    },
  });
};
