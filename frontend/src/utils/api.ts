/**
 * @deprecated このファイルは廃止予定です。
 * 新しいAPIクライアント（@/lib/api/*）を使用してください。
 */

import { apiClient } from '@/lib/api/client';
import { searchTeams, searchMatch } from '@/lib/api/search';
import {
  tryDownloadTeamFile,
  deleteSearchFile as deleteFile,
  uploadTeamFile,
  uploadMatchFile,
  filesApi,
} from '@/lib/api/files';
import { registerEvent, fetchEvents } from '@/lib/api/events';
import {
  fetchMyTeamFiles,
  fetchMyMatchFiles,
  deleteMyEvent,
  deleteMyFile,
  fetchMyEvents,
} from '@/lib/api/mypage';
import { updateUserName } from '@/lib/api/user';
import { sumDLSearchTeam, sumDLSearchMatch, sumDownload } from '@/lib/api/sumdownload';
import { authApi } from '@/lib/api/auth';

// 後方互換性のための再エクスポート
export {
  searchTeams,
  searchMatch,
  tryDownloadTeamFile,
  uploadTeamFile,
  uploadMatchFile,
  registerEvent,
  fetchEvents,
  fetchMyTeamFiles,
  fetchMyMatchFiles,
  deleteMyEvent,
  deleteMyFile,
  fetchMyEvents,
  updateUserName,
  sumDLSearchTeam,
  sumDLSearchMatch,
  sumDownload,
};

// 古い関数名のエイリアス
export const deleteSearchFile = deleteFile;

// 認証関連の再エクスポート（authApiを使用）
export const login = async (email: string, password: string) => {
  return authApi.login({ email, password });
};

export const register = async (
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string
) => {
  return authApi.register({
    name,
    email,
    password,
    passwordConfirmation,
  });
};

export const sendPasswordResetLink = async (email: string) => {
  return authApi.sendPasswordResetLink({ email });
};

export const checkResetPasswordToken = async (token: string, email: string) => {
  return authApi.checkResetPasswordToken({ token, email });
};

export const resetPassword = async (
  token: string,
  email: string,
  password: string,
  passwordConfirmation: string
) => {
  return authApi.resetPassword({
    token,
    email,
    password,
    passwordConfirmation,
  });
};

// apiRequestは非推奨だが、移行期間中は残す必要があるかもしれない。
// ただし、すべての呼び出し元を修正する方針なので、ここではエラーを投げるようにするか、
// 最小限の実装を残す。
// 今回は完全に移行することを目指すため、削除したいが、
// まだ移行していないファイルがあるかもしれないので、警告を出す。
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  console.warn('Deprecated apiRequest called. Please use apiClient instead.');
  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body as string) : undefined;

  if (method === 'GET') {
    return apiClient.get(endpoint, options);
  } else if (method === 'POST') {
    return apiClient.post(endpoint, body, options);
  } else {
    return apiClient.request(endpoint, options);
  }
};
