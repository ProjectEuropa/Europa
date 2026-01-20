// Discord署名検証
// https://discord.com/developers/docs/interactions/receiving-and-responding#security-and-authorization

// リクエストの有効期限（5分）
const MAX_REQUEST_AGE_MS = 5 * 60 * 1000;

/**
 * Discord Interactionリクエストの署名を検証
 * @param publicKey Discord Application Public Key
 * @param signature X-Signature-Ed25519 ヘッダー値
 * @param timestamp X-Signature-Timestamp ヘッダー値
 * @param body リクエストボディ（生文字列）
 * @returns 署名が有効な場合true
 */
export async function verifyDiscordSignature(
    publicKey: string,
    signature: string,
    timestamp: string,
    body: string
): Promise<boolean> {
    try {
        // タイムスタンプの有効期限チェック（リプレイ攻撃対策）
        const requestTime = parseInt(timestamp, 10) * 1000;
        if (Number.isNaN(requestTime) || Date.now() - requestTime > MAX_REQUEST_AGE_MS) {
            console.warn('Discord request timestamp expired or invalid:', {
                timestamp,
                age: Date.now() - requestTime,
            });
            return false;
        }

        // 公開鍵をCryptoKeyに変換
        const keyData = hexToArrayBuffer(publicKey);
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'Ed25519' },
            false,
            ['verify']
        );

        // 署名をArrayBufferに変換
        const signatureData = hexToArrayBuffer(signature);

        // メッセージを作成（timestamp + body）
        const message = new TextEncoder().encode(timestamp + body);

        // 署名を検証
        const isValid = await crypto.subtle.verify(
            { name: 'Ed25519' },
            cryptoKey,
            signatureData,
            message
        );

        return isValid;
    } catch (error) {
        console.error('Signature verification failed:', error);
        return false;
    }
}

/**
 * 16進数文字列をArrayBufferに変換
 */
function hexToArrayBuffer(hex: string): ArrayBuffer {
    if (hex.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(hex)) {
        throw new Error('Invalid hex string');
    }
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return bytes.buffer as ArrayBuffer;
}
