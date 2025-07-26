/**
 * APIエラーメッセージを日本語に翻訳するユーティリティ
 */

interface ErrorTranslation {
  [key: string]: string;
}

// 一般的なエラーメッセージの翻訳
const commonErrorTranslations: ErrorTranslation = {
  'The given data was invalid.': '入力されたデータが無効です。',
  'Validation failed': 'バリデーションに失敗しました。',
  'Unauthorized': '認証に失敗しました。',
  'Forbidden': 'アクセスが拒否されました。',
  'Not Found': 'リソースが見つかりません。',
  'Internal Server Error': 'サーバーエラーが発生しました。',
  'Network Error': 'ネットワークエラーが発生しました。',
  'Request timeout': 'リクエストがタイムアウトしました。',
};

// フィールド固有のエラーメッセージの翻訳
const fieldErrorTranslations: ErrorTranslation = {
  // メールアドレス関連
  'The email field is required.': 'メールアドレスは必須です。',
  'The email must be a valid email address.': '有効なメールアドレスを入力してください。',
  'The email has already been taken.': 'このメールアドレスは既に使用されています。',
  'メールアドレスの値は既に存在しています。': 'このメールアドレスは既に使用されています。',

  // パスワード関連
  'The password field is required.': 'パスワードは必須です。',
  'The password must be at least 6 characters.': 'パスワードは6文字以上で入力してください。',
  'The password must be at least 8 characters.': 'パスワードは8文字以上で入力してください。',
  'The password confirmation does not match.': 'パスワードが一致しません。',

  // 名前関連
  'The name field is required.': '名前は必須です。',
  'The name must be at least 2 characters.': '名前は2文字以上で入力してください。',
  'The name may not be greater than 50 characters.': '名前は50文字以内で入力してください。',
};

/**
 * エラーメッセージを日本語に翻訳する
 */
export function translateErrorMessage(message: string): string {
  // フィールド固有のエラーメッセージを優先的にチェック
  if (fieldErrorTranslations[message]) {
    return fieldErrorTranslations[message];
  }

  // 一般的なエラーメッセージをチェック
  if (commonErrorTranslations[message]) {
    return commonErrorTranslations[message];
  }

  // 部分一致での翻訳を試行
  for (const [englishMessage, japaneseMessage] of Object.entries(fieldErrorTranslations)) {
    if (message.includes(englishMessage) || englishMessage.includes(message)) {
      return japaneseMessage;
    }
  }

  // 翻訳が見つからない場合は元のメッセージを返す
  return message;
}

/**
 * APIエラーレスポンスを処理して適切な日本語メッセージを返す
 */
export function processApiError(error: any): {
  message: string;
  fieldErrors?: Record<string, string>;
} {
  // ネットワークエラーの場合
  if (!error.status && error.message) {
    return {
      message: translateErrorMessage(error.message),
    };
  }

  // HTTPステータスコード別の処理
  switch (error.status) {
    case 401:
      return {
        message: 'メールアドレスまたはパスワードが正しくありません。',
      };

    case 403:
      return {
        message: 'アクセスが拒否されました。',
      };

    case 404:
      return {
        message: 'リソースが見つかりません。',
      };

    case 422:
      // バリデーションエラーの場合
      if (error.data?.errors) {
        const fieldErrors: Record<string, string> = {};

        for (const [field, messages] of Object.entries(error.data.errors)) {
          if (Array.isArray(messages) && messages.length > 0) {
            fieldErrors[field] = translateErrorMessage(messages[0]);
          }
        }

        return {
          message: translateErrorMessage(error.data.message || 'The given data was invalid.'),
          fieldErrors,
        };
      }
      break;

    case 429:
      return {
        message: 'リクエストが多すぎます。しばらく待ってから再試行してください。',
      };

    case 500:
    case 502:
    case 503:
    case 504:
      return {
        message: 'サーバーエラーが発生しました。しばらく待ってから再試行してください。',
      };

    default:
      break;
  }

  // デフォルトのエラーメッセージ
  const message = error.data?.message || error.message || 'エラーが発生しました。';
  return {
    message: translateErrorMessage(message),
  };
}

/**
 * 認証関連のエラーメッセージを取得
 */
export function getAuthErrorMessage(error: any): string {
  const processed = processApiError(error);
  return processed.message;
}

/**
 * フォームフィールドのエラーメッセージを取得
 */
export function getFieldErrorMessages(error: any): Record<string, string> {
  const processed = processApiError(error);
  return processed.fieldErrors || {};
}
