/**
 * API関連のユーティリティ関数
 */

/**
 * APIレスポンスから配列データを安全に抽出するヘルパー関数
 * @param response APIレスポンス
 * @param key データが含まれるプロパティ名（例: 'files', 'events'）
 */
export function extractDataFromResponse<T>(response: unknown, key: string): T[] {
    if (!response || typeof response !== 'object') {
        return [];
    }

    const responseObject = response as Record<string, unknown>;

    // 1. response[key] をチェック
    if (Array.isArray(responseObject[key])) {
        return responseObject[key] as T[];
    }

    // 2. response.data[key] をチェック
    if (responseObject.data && typeof responseObject.data === 'object' && !Array.isArray(responseObject.data)) {
        const dataObject = responseObject.data as Record<string, unknown>;
        if (Array.isArray(dataObject[key])) {
            return dataObject[key] as T[];
        }
    }

    return [];
}
