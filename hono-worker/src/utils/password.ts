/**
 * パスワードハッシュユーティリティ
 * 
 * 既存のbcryptハッシュと新しいカスタムハッシュの両方に対応
 */

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * パスワードをハッシュ化（bcrypt使用）
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * パスワードを検証
 * 既存のbcryptハッシュと新しいカスタムハッシュの両方に対応
 */
export async function verifyPassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    try {
        // bcryptハッシュの検証を試行
        if (hashedPassword.startsWith('$2a$') || hashedPassword.startsWith('$2b$') || hashedPassword.startsWith('$2y$')) {
            return bcrypt.compare(password, hashedPassword);
        }

        // カスタムハッシュの検証（後方互換性のため残す）
        return verifyCustomHash(password, hashedPassword);
    } catch (_error) {
        return false;
    }
}

/**
 * カスタムハッシュの検証（レガシー対応）
 */
async function verifyCustomHash(password: string, hashedPassword: string): Promise<boolean> {
    try {
        const parts = hashedPassword.split('$');
        if (parts.length !== 4) return false;

        const saltAndHash = parts[3];
        const salt = saltAndHash.substring(0, 32);
        const storedHash = saltAndHash.substring(32);

        const encoder = new TextEncoder();
        const data = encoder.encode(password + salt);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const computedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        return timingSafeEqual(computedHash, storedHash);
    } catch (_error) {
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

/**
 * ランダムな削除パスワードを生成（8文字の英数字）
 * 匿名ユーザーのファイル削除用
 */
export function generateDeletePassword(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'; // 紛らわしい文字を除外
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

/**
 * 削除パスワードをハッシュ化
 * bcryptを使用（より安全で環境非依存）
 * Workers環境での互換性のため同期メソッドを使用
 */
export async function hashDeletePassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * 旧SHA-256ハッシュ化（後方互換性用）
 */
async function hashDeletePasswordSHA256(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

/**
 * 削除パスワードを検証
 * @returns { isValid: 検証結果, needsUpgrade: ハッシュの更新が必要かどうか }
 */
export async function verifyDeletePassword(
    password: string,
    hashedPassword: string
): Promise<{ isValid: boolean; needsUpgrade: boolean }> {
    // bcryptハッシュかチェック
    if (hashedPassword.startsWith('$2')) {
        const isValid = await bcrypt.compare(password, hashedPassword);
        return { isValid, needsUpgrade: false };
    }

    // 旧SHA-256ハッシュの検証
    const hash = await hashDeletePasswordSHA256(password);
    const isValid = timingSafeEqual(hash, hashedPassword);

    // SHA-256で検証成功した場合、bcryptへの移行が必要
    return { isValid, needsUpgrade: isValid };
}
