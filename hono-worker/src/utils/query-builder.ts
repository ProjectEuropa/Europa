/**
 * クエリビルダーユーティリティ
 * ファイル一覧取得のWHERE句を動的に構築する
 */

export interface FileQueryFilters {
  data_type?: string;
  targetUserId?: number;
  keyword?: string;
  tagFilteredFileIds?: number[];
}

export interface QueryResult {
  whereClause: string;
  whereParams: (string | number | number[])[];
}

/**
 * ファイル検索用のWHERE句とパラメータを構築する
 * @param filters - 検索フィルター条件
 * @returns WHERE句の文字列とパラメータ配列
 */
export function buildFileQueryWhere(filters: FileQueryFilters): QueryResult {
  const whereConditions: string[] = [];
  const whereParams: (string | number | number[])[] = [];

  if (filters.data_type) {
    whereConditions.push(`data_type = $${whereParams.length + 1}`);
    whereParams.push(filters.data_type);
  }

  if (filters.targetUserId) {
    whereConditions.push(`upload_user_id = $${whereParams.length + 1}`);
    whereParams.push(filters.targetUserId);
  }

  if (filters.keyword) {
    // ILIKEパターンをSQL側で構築 - keywordパラメータを3回使用するため3回pushする
    const keywordIdx1 = whereParams.length + 1;
    const keywordIdx2 = whereParams.length + 2;
    const keywordIdx3 = whereParams.length + 3;
    whereConditions.push(
      `(file_name ILIKE '%' || $${keywordIdx1} || '%' OR file_comment ILIKE '%' || $${keywordIdx2} || '%' OR upload_owner_name ILIKE '%' || $${keywordIdx3} || '%')`
    );
    whereParams.push(filters.keyword, filters.keyword, filters.keyword);

    // キーワード検索時は、ダウンロード可能な日時のチェックも追加
    whereConditions.push(`(downloadable_at IS NULL OR downloadable_at <= NOW())`);
  }

  if (filters.tagFilteredFileIds && filters.tagFilteredFileIds.length > 0) {
    whereConditions.push(`id = ANY($${whereParams.length + 1})`);
    whereParams.push(filters.tagFilteredFileIds);
  }

  // WHERE句を構築（条件がない場合は空）
  const whereClause = whereConditions.length > 0
    ? `WHERE ${whereConditions.join(' AND ')}`
    : '';

  return { whereClause, whereParams };
}
