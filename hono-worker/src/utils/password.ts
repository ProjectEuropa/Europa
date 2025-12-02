/**
 * パスワードハッシュユーティリティ
 * 
 * 注意: Cloudflare Workersではbcryptが使えないため、
 * Web Crypto APIを使用した代替実装を提供します。
 * 本番環境ではより強力なハッシュアルゴリズムの使用を検討してください。
 */

const SALT_ROUNDS = 10;

/**
 * パスワードをハッシュ化
 * 
 * bcrypt互換のハッシュを生成（簡易版）
 * 本番環境では@noble/hashesなどのライブラリ使用を推奨
 */
export async function hashPassword(password: string): Promise<string> {
    // ソルトを生成
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');

    // パスワード + ソルトをハッシュ化
    const encoder = new TextEncoder();
    const data = encoder.encode(password + saltHex);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // bcrypt風のフォーマット: $2a$10$<salt><hash>
    return `$2a$${SALT_ROUNDS}$${saltHex}${hashHex}`;
}

/**
 * パスワードを検証
 */
export async function verifyPassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    try {
        // ハッシュからソルトを抽出
        const parts = hashedPassword.split('$');
        if (parts.length !== 4) return false;

        const saltAndHash = parts[3];
        const salt = saltAndHash.substring(0, 32); // 16バイト = 32文字（hex）
        const storedHash = saltAndHash.substring(32);

        // 入力パスワードを同じソルトでハッシュ化
        const encoder = new TextEncoder();
        const data = encoder.encode(password + salt);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const computedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // 定数時間比較
        return timingSafeEqual(computedHash, storedHash);
    } catch (error) {
        return false;
    }
}

/**
 * タイミング攻撃を防ぐための定数時間比較
 */
function timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false;

    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
}
