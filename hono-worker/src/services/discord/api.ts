// Discord REST APIクライアント

import type { CreateMessageRequest, DiscordMessage } from '../../types/discord';

const DISCORD_API_BASE = 'https://discord.com/api/v10';

// Discord APIタイムアウト（ミリ秒）
// Discord Interactionsは3秒以内に応答が必要なため、余裕を持って2秒
const DISCORD_API_TIMEOUT_MS = 2000;

/**
 * タイムアウト付きfetch
 */
async function fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeoutMs: number = DISCORD_API_TIMEOUT_MS
): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        return response;
    } finally {
        clearTimeout(timeoutId);
    }
}

/**
 * Discordチャンネルにメッセージを投稿
 * @param botToken Bot Token
 * @param channelId 投稿先チャンネルID
 * @param message メッセージ内容
 * @returns 投稿されたメッセージ
 */
export async function postMessage(
    botToken: string,
    channelId: string,
    message: CreateMessageRequest
): Promise<DiscordMessage> {
    const response = await fetchWithTimeout(`${DISCORD_API_BASE}/channels/${channelId}/messages`, {
        method: 'POST',
        headers: {
            Authorization: `Bot ${botToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Discord API error: ${response.status} - ${error}`);
    }

    return response.json();
}

/**
 * Discord メッセージリンクを生成
 * @param guildId サーバーID
 * @param channelId チャンネルID
 * @param messageId メッセージID
 * @returns メッセージへの直リンク
 */
export function createMessageLink(guildId: string, channelId: string, messageId: string): string {
    return `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
}

/**
 * Discordメッセージを削除
 * @param botToken Bot Token
 * @param channelId チャンネルID
 * @param messageId メッセージID
 */
export async function deleteMessage(
    botToken: string,
    channelId: string,
    messageId: string
): Promise<void> {
    const response = await fetchWithTimeout(
        `${DISCORD_API_BASE}/channels/${channelId}/messages/${messageId}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: `Bot ${botToken}`,
            },
        }
    );

    if (!response.ok && response.status !== 404) {
        const error = await response.text();
        throw new Error(`Failed to delete Discord message: ${response.status} - ${error}`);
    }
}

/**
 * スラッシュコマンドを登録（ギルドコマンド）
 * @param botToken Bot Token
 * @param applicationId Application ID
 * @param guildId Guild ID
 */
export async function registerGuildCommands(
    botToken: string,
    applicationId: string,
    guildId: string
): Promise<void> {
    const commands = [
        {
            name: '大会登録',
            description: 'Europaに大会情報を登録します',
            type: 1, // CHAT_INPUT
        },
    ];

    // コマンド登録は初期設定時のみなのでタイムアウトを長めに設定
    const response = await fetchWithTimeout(
        `${DISCORD_API_BASE}/applications/${applicationId}/guilds/${guildId}/commands`,
        {
            method: 'PUT',
            headers: {
                Authorization: `Bot ${botToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(commands),
        },
        10000 // 10秒
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to register commands: ${response.status} - ${error}`);
    }
}
