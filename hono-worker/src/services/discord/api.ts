// Discord REST APIクライアント

import type { CreateMessageRequest, DiscordMessage } from '../../types/discord';

const DISCORD_API_BASE = 'https://discord.com/api/v10';

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
    const response = await fetch(`${DISCORD_API_BASE}/channels/${channelId}/messages`, {
        method: 'POST',
        headers: {
            'Authorization': `Bot ${botToken}`,
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

    const response = await fetch(
        `${DISCORD_API_BASE}/applications/${applicationId}/guilds/${guildId}/commands`,
        {
            method: 'PUT',
            headers: {
                'Authorization': `Bot ${botToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(commands),
        }
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to register commands: ${response.status} - ${error}`);
    }
}
