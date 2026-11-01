/**
 * パスワードリセット用トークン生成・検証ユーティリティ
 */

/**
 * ランダムトークンを生成（32文字の英数字・暗号学的に安全な乱数を使用）
 */
export function generateResetToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomValues = new Uint32Array(32);
    crypto.getRandomValues(randomValues);
    let token = '';
    for (let i = 0; i < 32; i++) {
        token += chars.charAt(randomValues[i] % chars.length);
    }
    return token;
}

/**
 * トークンの有効期限チェック（1時間）
 * @param createdAt トークン作成日時
 * @returns true: 期限切れ, false: 有効
 */
export function isTokenExpired(createdAt: Date): boolean {
    const now = new Date();
    const diff = now.getTime() - createdAt.getTime();
    const oneHour = 60 * 60 * 1000;
    return diff > oneHour;
}
