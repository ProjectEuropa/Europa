/**
 * ファイルのダウンロード可能日時に基づくマスク処理ユーティリティ
 */

/**
 * ダウンロード可能日時が過ぎていない場合、コメント・タグをマスクする
 * @param file ファイルオブジェクト
 * @returns マスク処理されたファイルオブジェクト
 */
export function maskFileIfNotDownloadable(file: Record<string, unknown>): Record<string, unknown> {
    const now = new Date();
    const downloadableAt = file.downloadable_at ? new Date(file.downloadable_at as string) : null;

    // downloadable_atが設定されていない、または過ぎている場合はそのまま返す
    if (!downloadableAt || now >= downloadableAt) {
        return file;
    }

    // マスク処理
    return {
        ...file,
        file_comment: 'ダウンロード可能日時が過ぎていないためコメントは非表示です',
        search_tag1: null,
        search_tag2: null,
        search_tag3: null,
        search_tag4: null,
        tags: [],
    };
}

/**
 * ファイル配列に対してマスク処理を適用
 * @param files ファイルオブジェクトの配列
 * @returns マスク処理されたファイルオブジェクトの配列
 */
export function maskFilesIfNotDownloadable(files: Record<string, unknown>[]): Record<string, unknown>[] {
    return files.map(maskFileIfNotDownloadable);
}
