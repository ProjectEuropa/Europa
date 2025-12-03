/**
 * 日時フォーマット関数
 * ファイル一覧で使用される日時の表示フォーマットを提供
 */

/**
 * 日時フォーマットエラーの種類
 */
export enum DateFormatErrorType {
  EMPTY_STRING = 'EMPTY_STRING',
  INVALID_FORMAT = 'INVALID_FORMAT',
  PARSE_ERROR = 'PARSE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * 日時フォーマットエラー情報
 */
export interface DateFormatError {
  type: DateFormatErrorType;
  originalValue: string;
  message: string;
}

/**
 * 日時文字列の妥当性をチェックする
 * @param dateString - チェック対象の日時文字列
 * @returns エラー情報（妥当な場合はnull）
 */
const validateDateString = (dateString: string): DateFormatError | null => {
  if (!dateString || dateString.trim() === '') {
    return {
      type: DateFormatErrorType.EMPTY_STRING,
      originalValue: dateString,
      message: 'Date string is empty or null',
    };
  }

  // 数値のみの文字列をチェック
  if (/^\d+$/.test(dateString)) {
    return {
      type: DateFormatErrorType.INVALID_FORMAT,
      originalValue: dateString,
      message: 'Date string contains only numbers',
    };
  }

  // ISO 8601形式の基本的なパターンをチェック
  if (!dateString.includes('-') && !dateString.includes('T')) {
    return {
      type: DateFormatErrorType.INVALID_FORMAT,
      originalValue: dateString,
      message: 'Date string does not match expected ISO 8601 format',
    };
  }

  return null;
};

/**
 * 日時パースエラーをログに出力する
 * @param error - エラー情報
 * @param context - エラーが発生したコンテキスト
 */
const logDateFormatError = (error: DateFormatError, context: string): void => {
  const logMessage = `[${context}] Date format error: ${error.message} (Original value: "${error.originalValue}")`;

  switch (error.type) {
    case DateFormatErrorType.EMPTY_STRING:
      console.info(logMessage);
      break;
    case DateFormatErrorType.INVALID_FORMAT:
    case DateFormatErrorType.PARSE_ERROR:
      console.warn(logMessage);
      break;
    case DateFormatErrorType.UNKNOWN_ERROR:
      console.error(logMessage);
      break;
    default:
      console.warn(logMessage);
  }
};

/**
 * アクセシビリティ対応の日時表示情報を生成する
 * @param dateString - 日時文字列
 * @param formattedValue - フォーマット済みの表示値
 * @param context - コンテキスト（'download' | 'upload'）
 * @returns アクセシビリティ情報
 */
export const getAccessibilityDateInfo = (
  dateString: string | null,
  formattedValue: string,
  context: 'download' | 'upload'
): { ariaLabel: string; title: string } => {
  const contextLabel = context === 'download' ? 'ダウンロード' : 'アップロード';

  if (!dateString || formattedValue === '未設定') {
    return {
      ariaLabel: `${contextLabel}日時は未設定です`,
      title: `${contextLabel}日時が設定されていません`,
    };
  }

  if (formattedValue.includes('エラー')) {
    return {
      ariaLabel: `${contextLabel}日時の表示でエラーが発生しました`,
      title: `${contextLabel}日時の処理中にエラーが発生しました`,
    };
  }

  return {
    ariaLabel: `${contextLabel}日時: ${formattedValue}`,
    title: `${contextLabel}日時: ${formattedValue}`,
  };
};

/**
 * ダウンロード日時をフォーマットする
 * @param dateString - ISO 8601形式の日時文字列
 * @returns フォーマットされた日時文字列（YYYY/MM/DD HH:mm形式）または「未設定」
 */
export const formatDownloadDateTime = (dateString: string | null): string => {
  // null、undefined、空文字列の場合は「未設定」を返す
  if (!dateString || dateString.trim() === '') {
    return '未設定';
  }

  const validationError = validateDateString(dateString);
  if (validationError?.type === DateFormatErrorType.EMPTY_STRING) {
    return '未設定';
  }

  // その他の妥当性エラーがある場合
  if (validationError) {
    logDateFormatError(validationError, 'formatDownloadDateTime');
    return '日時形式エラー';
  }

  try {
    const date = new Date(dateString);

    // 日時パースに失敗した場合
    if (Number.isNaN(date.getTime())) {
      const parseError: DateFormatError = {
        type: DateFormatErrorType.PARSE_ERROR,
        originalValue: dateString,
        message: 'Failed to parse date string',
      };
      logDateFormatError(parseError, 'formatDownloadDateTime');
      return '日時解析エラー';
    }

    // DBに保存されたJST時刻をそのまま表示（タイムゾーン変換なし）
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
    });
  } catch (error) {
    // 予期しないエラーが発生した場合
    const unknownError: DateFormatError = {
      type: DateFormatErrorType.UNKNOWN_ERROR,
      originalValue: dateString,
      message:
        error instanceof Error ? error.message : 'Unknown error occurred',
    };
    logDateFormatError(unknownError, 'formatDownloadDateTime');
    return '日時処理エラー';
  }
};

/**
 * アップロード日時をフォーマットする
 * @param dateString - ISO 8601形式の日時文字列
 * @returns フォーマットされた日時文字列（YYYY/MM/DD HH:mm形式）または「-」
 */
export const formatUploadDateTime = (dateString: string): string => {
  // 空文字列や null/undefined の場合は「-」を返す
  const validationError = validateDateString(dateString);
  if (validationError?.type === DateFormatErrorType.EMPTY_STRING) {
    return '-';
  }

  // その他の妥当性エラーがある場合
  if (validationError) {
    logDateFormatError(validationError, 'formatUploadDateTime');
    return '日時形式エラー';
  }

  try {
    const date = new Date(dateString);

    // 日時パースに失敗した場合
    if (Number.isNaN(date.getTime())) {
      const parseError: DateFormatError = {
        type: DateFormatErrorType.PARSE_ERROR,
        originalValue: dateString,
        message: 'Failed to parse date string',
      };
      logDateFormatError(parseError, 'formatUploadDateTime');
      return '日時解析エラー';
    }

    // DBに保存されたJST時刻をそのまま表示（タイムゾーン変換なし）
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
    });
  } catch (error) {
    // 予期しないエラーが発生した場合
    const unknownError: DateFormatError = {
      type: DateFormatErrorType.UNKNOWN_ERROR,
      originalValue: dateString,
      message:
        error instanceof Error ? error.message : 'Unknown error occurred',
    };
    logDateFormatError(unknownError, 'formatUploadDateTime');
    return '日時処理エラー';
  }
};

/**
 * 汎用的な日時フォーマット関数
 * @param dateString - ISO 8601形式の日時文字列
 * @returns フォーマットされた日時文字列（YYYY/MM/DD HH:mm形式）
 */
export const formatDate = (dateString: string | null): string => {
  return formatDownloadDateTime(dateString);
};
