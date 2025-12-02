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
    } catch (error) {
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
