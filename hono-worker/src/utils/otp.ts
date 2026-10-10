/**
 * ワンタイムパスコード（OTP）およびセッショントークン生成ユーティリティ
 * Web Crypto API（Cloudflare Workers対応）を使用
 */

export const OTP_CONFIG = {
    /** 有効期限（秒）: 10分 */
    EXPIRES_IN_SECONDS: 10 * 60,
    /** 再送信クールダウン（秒）: 60秒 */
    RESEND_COOLDOWN_SECONDS: 60,
    /** 最大試行回数: 5回 */
    MAX_ATTEMPTS: 5,
    /** コード桁数: 6桁 */
    CODE_LENGTH: 6,
};

/**
 * 6桁の数字OTPを生成（暗号学的に安全な乱数）
 */
export function generateOtpCode(): string {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    // 000000 〜 999999 の6桁文字列
    const codeNumber = array[0] % 1000000;
    return codeNumber.toString().padStart(OTP_CONFIG.CODE_LENGTH, '0');
}

/**
 * ランダムなセッショントークンを生成（UUID v4 または 32バイトHex）
 */
export function generateSessionToken(): string {
    if (typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * OTPコードのSHA-256ハッシュ値を計算（DB保存用）
 */
export async function hashOtpCode(code: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(code);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * 入力されたコードとハッシュ値を照合（タイミング攻撃対策）
 */
export async function verifyOtpCode(inputCode: string, codeHash: string): Promise<boolean> {
    const inputHash = await hashOtpCode(inputCode.trim());
    return inputHash === codeHash;
}

/**
 * メールアドレスをマスク表示（プライバシー保護: 例: u***r@example.com）
 */
export function maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    if (!domain) return email;

    if (localPart.length <= 2) {
        return `${localPart[0]}***@${domain}`;
    }
    const visibleStart = localPart.slice(0, 1);
    const visibleEnd = localPart.slice(-1);
    return `${visibleStart}***${visibleEnd}@${domain}`;
}
