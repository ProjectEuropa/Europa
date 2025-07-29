/**
 * ファイル関連の型定義
 */

import type { DateString } from './utils';

export interface BaseFile {
  id: number;
  file_name: string;
  upload_owner_name: string;
  file_comment: string;
  downloadable_at: DateString;
  created_at: DateString;
  updated_at?: DateString;
  search_tag1?: string | null;
  search_tag2?: string | null;
  search_tag3?: string | null;
  search_tag4?: string | null;
  size?: number;
  downloadCount?: number;
  isCommentVisible?: boolean;
  upload_type?: string; // アップロードタイプ（'1': 認証アップロード, '2': 簡易アップロード）

  // 互換性のためのエイリアス
  name: string;
  ownerName: string;
  comment: string;
  downloadableAt: DateString;
  createdAt: DateString;
  updatedAt?: DateString;
  searchTag1?: string | null;
  searchTag2?: string | null;
  searchTag3?: string | null;
  searchTag4?: string | null;
}

export interface TeamFile extends BaseFile {
  type: 'team';
  teamId?: string;
  teamName?: string;
  // チーム固有のプロパティ
  teamRank?: string;
  teamLevel?: number;
}

export interface MatchFile extends BaseFile {
  type: 'match';
  matchId?: string;
  matchName?: string;
  // マッチ固有のプロパティ
  matchResult?: 'win' | 'lose' | 'draw';
  matchDate?: DateString;
  opponentName?: string;
}

export interface FileUploadOptions {
  ownerName?: string;
  comment?: string;
  tags?: string[];
  deletePassword?: string;
  downloadDate?: string;
}

export interface FileUploadResponse {
  success: boolean;
  message?: string;
  error?: string;
  file?: BaseFile;
}

export interface FileDeleteRequest {
  id: number;
  deletePassword?: string;
}

export interface FileDeleteResponse {
  message: string;
}

export interface FileDownloadResult {
  success: boolean;
  error?: string;
}

export interface MyFilesResponse {
  files: BaseFile[];
}

export interface SumDownloadRequest {
  checkedId: number[];
}
