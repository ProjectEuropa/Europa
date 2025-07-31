/**
 * ユーザー関連の型定義
 */

import type { DateString, ID } from './utils';

export interface User {
  id: ID;
  name: string;
  email: string;
  createdAt: DateString;
  updatedAt?: DateString;
  lastLoginAt?: DateString;
  role?: UserRole;
  preferences?: UserPreferences;
}

export type UserRole = 'user' | 'admin' | 'moderator';

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  emailNotifications?: boolean;
  language?: 'ja' | 'en';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  token: string;
  user: User;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetResponse {
  status?: string;
  error?: string;
}

export interface PasswordResetTokenCheck {
  token: string;
  email: string;
}

export interface PasswordResetTokenResponse {
  valid: boolean;
  message?: string;
}

export interface PasswordResetData {
  token: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface PasswordResetResult {
  message?: string;
  error?: string;
}

export interface UserUpdateData {
  name: string;
}

// マイページ関連の型定義
export interface ProfileData {
  name: string;
  email: string;
  joinDate: string;
}

export interface MyPageFile {
  id: string;
  name: string;
  uploadDate: string;
  downloadableAt?: string | null;
  comment?: string;
  type: 'team' | 'match';
}

export interface MyPageEvent {
  id: string;
  name: string;
  details: string;
  url: string;
  deadline: string;
  endDisplayDate: string;
  type: 'tournament' | 'announcement' | 'other';
  registeredDate: string;
}

export type MyPageTab = 'profile' | 'teams' | 'matches' | 'events';

export interface MyPageState {
  activeTab: MyPageTab;
  profile: ProfileData | null;
  files: MyPageFile[];
  events: MyPageEvent[];
  loading: {
    profile: boolean;
    teams: boolean;
    matches: boolean;
    events: boolean;
  };
  error: string | null;
}
