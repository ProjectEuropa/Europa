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
  'Unauthorized': 'メールアドレスまたはパスワードが正しくありません。',
  'Forbidden': 'アクセスが拒否されました。',
  'Not Found': 'リソースが見つかりません。',
  'Internal Server Error': 'サーバーエラーが発生しました。',
  'Network Error': 'ネットワークエラーが発生しました。',
  'Request timeout': 'リクエストがタイムアウトしました。',

  // フィールド固有のエラーメッセージ
  'The email field is required.': 'メールアドレスは必須です。',
  'The email must be a valid email address.': '有効なメールアドレスを入力してください。',
  'The email has already been taken.': 'このメールアドレスは既に使用されています。',
  'メールアドレスの値は既に存在しています。': 'このメールアドレスは既に使用されています。',

  'The password field is required.': 'パスワードは必須です。',
  'The password must be at least 6 characters.': 'パスワードは6文字以上で入力してください。',
  'The password must be at least 8 characters.': 'パスワードは8文字以上で入力してください。',
  'The password confirmation does not match.': 'パスワードが一致しません。',

  'The name field is required.': '名前は必須です。',
  'The name must be at least 2 characters.': '名前は2文字以上で入力してください。',
  'The name may not be greater than 50 characters.': '名前は50文字以内で入力してください。',
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
  for (const [englishMessage, japaneseMessage] of Object.entries(ERROR_TRANSLATIONS)) {
    if (message.includes(englishMessage) || englishMessage.includes(message)) {
      return japaneseMessage;
    }
  }

  // 翻訳が見つからない場合は元のメッセージを返す
  return message;
}

/**
 * APIエラーを統一的に処理する関数
 */
export function processApiError(error: any): ProcessedError {
  // デフォルトのエラー情報
  const defaultError: ProcessedError = {
    message: '予期しないエラーが発生しました。しばらくしてから再試行してください。',
    fieldErrors: {},
    isValidationError: false,
    isNetworkError: false,
    isServerError: false,
    isAuthError: false,
  };

  // ネットワークエラーやその他の非APIエラーの場合
  if (!error || (!error.status && !error.name)) {
    return {
      ...defaultError,
      message: '接続に問題があります。しばらくしてから再試行してください。',
      isNetworkError: true,
    };
  }

  // ApiErrorClassのインスタンスの場合
  if (error.name === 'ApiError' || error instanceof Error) {
    const apiError = error as ApiErrorClass;
    const status = apiError.status || 0;

    // バリデーションエラー（422）の処理
    if (status === 422) {
      const hasErrors = apiError.errors || apiError.data?.errors;

      if (hasErrors) {
        const fieldErrors: Record<string, string> = {};
        const errors = apiError.errors || apiError.data?.errors || {};

      // Laravel形式のエラーレスポンス処理
      Object.entries(errors).forEach(([field, messages]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          const translatedMessage = translateErrorMessage(messages[0]);
          fieldErrors[field] = translatedMessage;
        }
      });

      const message = apiError.data?.message || apiError.message || 'The given data was invalid.';
      const translatedMessage = translateErrorMessage(message);

      const result = {
        message: translatedMessage,
        fieldErrors,
        isValidationError: true,
        isNetworkError: false,
        isServerError: false,
        isAuthError: false,
      };

      return result;
      } else {
      }
    }

    // 認証エラー（401）の処理
    if (status === 401) {
      return {
        ...defaultError,
        message: 'メールアドレスまたはパスワードが正しくありません。',
        isAuthError: true,
      };
    }

    // 権限エラー（403）の処理
    if (status === 403) {
      return {
        ...defaultError,
        message: 'アクセスが拒否されました。',
      };
    }

    // 見つからないエラー（404）の処理
    if (status === 404) {
      return {
        ...defaultError,
        message: '要求されたリソースが見つかりません。',
      };
    }

    // レート制限エラー（429）の処理
    if (status === 429) {
      return {
        ...defaultError,
        message: 'リクエストが多すぎます。しばらく待ってから再試行してください。',
      };
    }

    // サーバーエラー（500系）の処理
    if (status >= 500) {
      return {
        ...defaultError,
        message: 'サーバーで問題が発生しました。しばらくしてから再試行してください。',
        isServerError: true,
      };
    }

    // その他のAPIエラー
    const message = apiError.data?.message || apiError.message || `エラーが発生しました（${status}）`;
    return {
      ...defaultError,
      message: translateErrorMessage(message),
    };
  }

  // その他のエラー
  const message = error.message || error.data?.message || defaultError.message;
  return {
    ...defaultError,
    message: translateErrorMessage(message),
  };
}

/**
 * フォームエラーを設定するヘルパー関数
 */
export function setFormErrors<T extends Record<string, any>>(
  setError: (name: keyof T, error: { message: string }) => void,
  fieldErrors: Record<string, string>
): void {
  Object.entries(fieldErrors).forEach(([field, message]) => {
    setError(field as keyof T, { message });
  });
}

/**
 * 認証関連のエラーメッセージを取得（後方互換性のため）
 */
export function getAuthErrorMessage(error: any): string {
  const processed = processApiError(error);
  return processed.message;
}

/**
 * フォームフィールドのエラーメッセージを取得（後方互換性のため）
 */
export function getFieldErrorMessages(error: any): Record<string, string> {
  const processed = processApiError(error);
  return processed.fieldErrors;
}

/**
 * エラーメッセージの定数（後方互換性のため）
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '接続に問題があります。しばらくしてから再試行してください。',
  SERVER_ERROR: 'サーバーで問題が発生しました。しばらくしてから再試行してください。',
  AUTH_ERROR: 'メールアドレスまたはパスワードが正しくありません。',
  PERMISSION_ERROR: 'アクセスが拒否されました。',
  NOT_FOUND_ERROR: '要求されたリソースが見つかりません。',
  VALIDATION_ERROR: '入力されたデータが無効です。',
  UNKNOWN_ERROR: '予期しないエラーが発生しました。しばらくしてから再試行してください。',
} as const;
