/**
 * 日時フォーマット関数
 * ファイル一覧で使用される日時の表示フォーマットを提供
 */

/**
 * ダウンロード日時をフォーマットする
 * @param dateString - ISO 8601形式の日時文字列
 * @returns フォーマットされた日時文字列（YYYY/MM/DD HH:mm形式）または「未設定」
 */
export const formatDownloadDateTime = (dateString: string): string => {
  if (!dateString) return '未設定';

  try {
    // 数値のみの文字列や明らかに無効な形式をチェック
    if (/^\d+$/.test(dateString) || !dateString.includes('-')) {
      console.warn('Invalid date string:', dateString);
      return '-';
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString);
      return '-';
    }

    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return '-';
  }
};

/**
 * アップロード日時をフォーマットする
 * @param dateString - ISO 8601形式の日時文字列
 * @returns フォーマットされた日時文字列（YYYY/MM/DD HH:mm形式）または「-」
 */
export const formatUploadDateTime = (dateString: string): string => {
  if (!dateString) return '-';

  try {
    // 数値のみの文字列や明らかに無効な形式をチェック
    if (/^\d+$/.test(dateString) || !dateString.includes('-')) {
      console.warn('Invalid date string:', dateString);
      return '-';
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString);
      return '-';
    }

    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return '-';
  }
};
