/**
 * APIエラーレスポンスの統一処理ユーティリティ
 * 既存のerrorMessages.tsと統合し、より包括的なエラーハンドリングを提供
 */

import type { ApiErrorClass } from '@/types/api';

export interface ProcessedError {
  message: string;
  fieldErrors: Record<string, string>;
  isValidationError: boolean;
  isNetworkError: boolean;
  isServerError: boolean;
  isAuthError: boolean;
}

// エラーメッセージの翻訳マップ
const ERROR_TRANSLATIONS = {
  // 一般的なエラーメッセージ
  'The given data was invalid.': '入力されたデータが無効です。',
  'Validation failed': 'バリデーションに失敗しました。',
  Unauthorized: 'メールアドレスまたはパスワードが正しくありません。',
  Forbidden: 'アクセスが拒否されました。',
  'Not Found': 'リソースが見つかりません。',
  'Internal Server Error': 'サーバーエラーが発生しました。',
  'Network Error': 'ネットワークエラーが発生しました。',
  'Request timeout': 'リクエストがタイムアウトしました。',

  // フィールド固有のエラーメッセージ
  'The email field is required.': 'メールアドレスは必須です。',
  'The email must be a valid email address.':
    '有効なメールアドレスを入力してください。',
  'The email has already been taken.':
    'このメールアドレスは既に使用されています。',
  'Email already exists': 'このメールアドレスは既に使用されています。',

  'The password field is required.': 'パスワードは必須です。',
  'The password must be at least 6 characters.':
    'パスワードは6文字以上で入力してください。',
  'The password must be at least 8 characters.':
    'パスワードは8文字以上で入力してください。',
  'The password confirmation does not match.': 'パスワードが一致しません。',

  'The name field is required.': '名前は必須です。',
  'The name must be at least 2 characters.':
    '名前は2文字以上で入力してください。',
  'The name may not be greater than 50 characters.':
    '名前は50文字以内で入力してください。',
} as const;

/**
 * エラーメッセージを日本語に翻訳する
 */
function translateErrorMessage(message: string): string {
  // 直接マッチする翻訳があるかチェック
  if (ERROR_TRANSLATIONS[message as keyof typeof ERROR_TRANSLATIONS]) {
    return ERROR_TRANSLATIONS[message as keyof typeof ERROR_TRANSLATIONS];
  }

  // 部分一致での翻訳を試行
  for (const [englishMessage, japaneseMessage] of Object.entries(
    ERROR_TRANSLATIONS
  )) {
    if (message.includes(englishMessage) || englishMessage.includes(message)) {
      return japaneseMessage;
    }
  }

  // 翻訳が見つからない場合は元のメッセージを返す
  return message;
}

/**
 * デフォルトエラー情報を取得
 */
function getDefaultError(): ProcessedError {
  return {
    message:
      '予期しないエラーが発生しました。しばらくしてから再試行してください。',
    fieldErrors: {},
    isValidationError: false,
    isNetworkError: false,
    isServerError: false,
    isAuthError: false,
  };
}

/**
 * バリデーションエラー（422）を処理
 */
function handleValidationError(apiError: ApiErrorClass): ProcessedError {
  const hasErrors = apiError.errors || apiError.data?.errors;

  if (!hasErrors) {
    return getDefaultError();
  }

  const fieldErrors: Record<string, string> = {};
  const errors = apiError.errors || apiError.data?.errors || {};

  Object.entries(errors).forEach(([field, messages]) => {
    if (Array.isArray(messages) && messages.length > 0) {
      const translatedMessage = translateErrorMessage(messages[0]);
      fieldErrors[field] = translatedMessage;
    }
  });

  const message =
    apiError.data?.message || apiError.message || 'The given data was invalid.';
  const translatedMessage = translateErrorMessage(message);

  return {
    message: translatedMessage,
    fieldErrors,
    isValidationError: true,
    isNetworkError: false,
    isServerError: false,
    isAuthError: false,
  };
}

/**
 * HTTPステータスエラーを処理
 */
function handleStatusError(status: number): ProcessedError {
  const defaultError = getDefaultError();

  if (status === 401) {
    return {
      ...defaultError,
      message: 'メールアドレスまたはパスワードが正しくありません。',
      isAuthError: true,
    };
  }

  if (status === 403) {
    return {
      ...defaultError,
      message: 'アクセスが拒否されました。',
    };
  }

  if (status === 404) {
    return {
      ...defaultError,
      message: '要求されたリソースが見つかりません。',
    };
  }

  if (status === 429) {
    return {
      ...defaultError,
      message: 'リクエストが多すぎます。しばらく待ってから再試行してください。',
    };
  }

  if (status >= 500) {
    return {
      ...defaultError,
      message:
        'サーバーで問題が発生しました。しばらくしてから再試行してください。',
      isServerError: true,
    };
  }

  return defaultError;
}

/**
 * APIエラーオブジェクトを処理
 */
function handleApiError(error: ApiErrorClass): ProcessedError {
  const status = error.status || 0;
  const defaultError = getDefaultError();

  if (status === 422) {
    return handleValidationError(error);
  }

  // 409 Conflict: バックエンドのメッセージを翻訳して返す
  if (status === 409) {
    const message =
      error.data?.message || error.message || 'Email already exists';
    return {
      ...defaultError,
      message: translateErrorMessage(message),
      isValidationError: true,
    };
  }

  const statusError = handleStatusError(status);
  if (statusError.message !== getDefaultError().message) {
    return statusError;
  }

  const message =
    error.data?.message || error.message || `エラーが発生しました（${status}）`;

  return {
    ...defaultError,
    message: translateErrorMessage(message),
  };
}

/**
 * 一般的なエラーオブジェクトからメッセージを抽出
 */
function extractErrorMessage(error: unknown): string {
  const defaultMessage = getDefaultError().message;

  if (typeof error === 'object' && error && 'message' in error) {
    return String(error.message);
  }

  if (
    typeof error === 'object' &&
    error &&
    'data' in error &&
    typeof error.data === 'object' &&
    error.data &&
    'message' in error.data
  ) {
    return String(error.data.message);
  }

  return defaultMessage;
}

/**
 * APIエラーを統一的に処理する関数
 */
export function processApiError(error: unknown): ProcessedError {
  const defaultError = getDefaultError();

  // ネットワークエラーやその他の非APIエラーの場合
  if (
    !error ||
    typeof error !== 'object' ||
    (!('status' in error) && !('name' in error))
  ) {
    return {
      ...defaultError,
      message: '接続に問題があります。しばらくしてから再試行してください。',
      isNetworkError: true,
    };
  }

  // ApiErrorClassのインスタンスの場合
  if (
    ('name' in error && error.name === 'ApiError') ||
    error instanceof Error
  ) {
    return handleApiError(error as ApiErrorClass);
  }

  // その他のエラー
  const message = extractErrorMessage(error);
  return {
    ...defaultError,
    message: translateErrorMessage(message),
  };
}

/**
 * フォームエラーを設定するヘルパー関数
 */
export function setFormErrors<_T extends Record<string, unknown>>(
  setError: (name: string, error: { message: string }) => void,
  fieldErrors: Record<string, string>
): void {
  Object.entries(fieldErrors).forEach(([field, message]) => {
    setError(field, { message });
  });
}

/**
 * 認証関連のエラーメッセージを取得（後方互換性のため）
 */
export function getAuthErrorMessage(error: unknown): string {
  const processed = processApiError(error);
  return processed.message;
}

/**
 * フォームフィールドのエラーメッセージを取得（後方互換性のため）
 */
export function getFieldErrorMessages(error: unknown): Record<string, string> {
  const processed = processApiError(error);
  return processed.fieldErrors;
}

/**
 * エラーメッセージの定数（後方互換性のため）
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '接続に問題があります。しばらくしてから再試行してください。',
  SERVER_ERROR:
    'サーバーで問題が発生しました。しばらくしてから再試行してください。',
  AUTH_ERROR: 'メールアドレスまたはパスワードが正しくありません。',
  PERMISSION_ERROR: 'アクセスが拒否されました。',
  NOT_FOUND_ERROR: '要求されたリソースが見つかりません。',
  VALIDATION_ERROR: '入力されたデータが無効です。',
  UNKNOWN_ERROR:
    '予期しないエラーが発生しました。しばらくしてから再試行してください。',
} as const;
