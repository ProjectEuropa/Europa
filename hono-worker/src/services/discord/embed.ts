// Discord Embed生成

import type { DiscordEmbed, CreateMessageRequest } from '../../types/discord';

// 色定義
const COLORS = {
    PRIMARY: 0x5865F2,    // Discord Blurple
    SUCCESS: 0x57F287,    // 緑
    WARNING: 0xFEE75C,    // 黄
    DANGER: 0xED4245,     // 赤
} as const;

export interface EventEmbedData {
    eventName: string;
    eventDetails: string;
    eventDeadline: string;
    eventDisplayEnd: string;
    registeredBy: string;
}

/**
 * イベント告知用のEmbedを生成
 */
export function createEventEmbed(data: EventEmbedData): DiscordEmbed {
    return {
        title: `🎮 ${data.eventName}`,
        description: data.eventDetails,
        color: COLORS.PRIMARY,
        fields: [
            {
                name: '📅 締切日',
                value: data.eventDeadline,
                inline: true,
            },
            {
                name: '📆 表示最終日',
                value: data.eventDisplayEnd,
                inline: true,
            },
        ],
        footer: {
            text: `登録者: ${data.registeredBy}`,
        },
        timestamp: new Date().toISOString(),
    };
}

/**
 * イベント告知メッセージを生成
 */
export function createEventMessage(data: EventEmbedData): CreateMessageRequest {
    return {
        content: '📢 **新しい大会が登録されました！**',
        embeds: [createEventEmbed(data)],
    };
}

/**
 * 成功メッセージを生成（ephemeral用）
 */
export function createSuccessMessage(eventName: string): string {
    return `✅ 「${eventName}」を登録しました！\nDiscordチャンネルとEuropaに投稿されました。`;
}

/**
 * エラーメッセージを生成（ephemeral用）
 */
export function createErrorMessage(errors: string[]): string {
    return `❌ 登録に失敗しました:\n${errors.map(e => `• ${e}`).join('\n')}`;
}
