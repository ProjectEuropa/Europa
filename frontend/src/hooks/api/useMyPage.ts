import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { getEventTypeFromDisplay, type EventType } from '@/schemas/event';
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

// プロフィール取得
export const useProfile = () => {
  // authStoreからユーザー情報を直接取得
  const user = useAuthStore(state => state.user);

  // ユーザーが存在しない場合のエラー処理
  if (!user) {
    return {
      data: null,
      isLoading: false,
      error: new Error('User not found'),
    };
  }

  // authStoreのデータをそのまま返す（React Queryは不要）
  const profileData: ProfileData = {
    name: user.name,
    email: user.email,
    joinDate: user.created_at
      ? user.created_at.slice(0, 10).replace(/-/g, '/')
      : '',
  };

  return {
    data: profileData,
    isLoading: false,
    error: null,
  };
};

// プロフィール更新
export const useUpdateProfile = () => {
  const { user, setUser } = useAuthStore();

  return useMutation({
    mutationFn: async (data: UserUpdateData) => {
      return updateUserName(data.name);
    },
    onSuccess: (_, variables) => {
      // authStore内のユーザー情報を即座に更新
      if (user) {
        const updatedUser = { ...user, name: variables.name };
        setUser(updatedUser);
      }
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
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  return useQuery({
    queryKey: ['mypage', 'teams', user?.id],
    queryFn: async (): Promise<MyPageFile[]> => {
      try {
        const data = await fetchMyTeamFiles();
        return data.map((item: any) => ({
          id: String(item.id),
          name: item.file_name ?? item.name ?? '',
          uploadDate: item.created_at ?? item.uploadDate ?? '',
          downloadableAt: item.downloadable_at ?? item.downloadableAt ?? '',
          comment: item.file_comment ?? item.comment ?? '',
          type: 'team' as const,
        }));
      } catch (error: any) {
        // 401エラーの場合は自動ログアウト
        if (
          error.status === 401 ||
          error.message?.includes('Unauthorized') ||
          error.message?.includes('Unauthenticated')
        ) {
          console.warn('Authentication failed, logging out user');
          logout(() => {
            window.location.href = '/login';
          });
          return [];
        }
        throw error;
      }
    },
    enabled: !!user, // ユーザーが認証されている場合のみクエリを実行
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  });
};

// マッチファイル取得
export const useMyMatchFiles = () => {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  return useQuery({
    queryKey: ['mypage', 'matches', user?.id],
    queryFn: async (): Promise<MyPageFile[]> => {
      try {
        const data = await fetchMyMatchFiles();
        return data.map((item: any) => ({
          id: String(item.id),
          name: item.file_name ?? item.name ?? '',
          uploadDate: item.created_at ?? item.uploadDate ?? '',
          downloadableAt: item.downloadable_at ?? item.downloadableAt ?? '',
          comment: item.file_comment ?? item.comment ?? '',
          type: 'match' as const,
        }));
      } catch (error: any) {
        // 401エラーの場合は自動ログアウト
        if (
          error.status === 401 ||
          error.message?.includes('Unauthorized') ||
          error.message?.includes('Unauthenticated')
        ) {
          logout(() => {
            window.location.href = '/login';
          });
          return [];
        }
        throw error;
      }
    },
    enabled: !!user, // ユーザーが認証されている場合のみクエリを実行
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  });
};

// イベント取得
export const useMyEvents = () => {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  return useQuery({
    queryKey: ['mypage', 'events', user?.id],
    queryFn: async (): Promise<MyPageEvent[]> => {
      try {
        const data = await fetchMyEvents();
        return data.map((item: any) => {
          // APIから返される日本語の値を内部値に変換
          let eventType: EventType = 'other';
          const typeValue = item.type || item.event_type || '';
          
          if (typeValue === '大会' || typeValue === 'tournament') {
            eventType = 'tournament';
          } else if (typeValue === '告知' || typeValue === 'announcement') {
            eventType = 'announcement';
          } else {
            eventType = 'other';
          }

          return {
            id: String(item.id),
            name: item.name || item.event_name || '',
            details: item.details || item.event_details || '',
            url: item.url || item.event_reference_url || '',
            deadline: item.deadline || item.event_closing_day || '',
            endDisplayDate:
              item.endDisplayDate || item.event_displaying_day || '',
            type: eventType,
            registeredDate:
              item.registeredDate || item.created_at?.slice(0, 10) || '',
          };
        });
      } catch (error: any) {
        // 401エラーの場合は自動ログアウト
        if (
          error.status === 401 ||
          error.message?.includes('Unauthorized') ||
          error.message?.includes('Unauthenticated')
        ) {
          logout(() => {
            window.location.href = '/login';
          });
          return [];
        }

        throw error;
      }
    },
    enabled: !!user, // ユーザーが認証されている場合のみクエリを実行
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
