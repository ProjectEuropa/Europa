/**
 * ファイル関連の型定義
 */

import type { DateString } from './utils';

export interface BaseFile {
  id: number;
  name: string;
  ownerName: string;
  comment: string;
  tags: string[];
  downloadableAt: DateString;
  createdAt: DateString;
  updatedAt?: DateString;
  size?: number;
  downloadCount?: number;
  isCommentVisible?: boolean;
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
