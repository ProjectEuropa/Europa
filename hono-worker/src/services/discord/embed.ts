// Discord Embed生成

import type { CreateMessageRequest, DiscordEmbed } from '../../types/discord';

// 色定義
const COLORS = {
    PRIMARY: 0x5865f2, // Discord Blurple
    SUCCESS: 0x57f287, // 緑
    WARNING: 0xfee75c, // 黄
    DANGER: 0xed4245, // 赤
} as const;

export interface EventEmbedData {
    eventName: string;
    eventDetails: string;
    eventDeadline: string;
    eventDisplayEnd: string;
    registeredBy: string;
}

/**
 * Discordマークダウンをエスケープ
 * ユーザー入力をメッセージに含める際にインジェクションを防止
 */
function escapeDiscordMarkdown(text: string): string {
    // Discord マークダウン特殊文字をエスケープ
    return text.replace(/([*_`~|\\])/g, '\\$1');
}

/**
 * イベント告知用のEmbedを生成
 * ユーザー入力値はエスケープしてマークダウンインジェクションを防止
 */
export function createEventEmbed(data: EventEmbedData): DiscordEmbed {
    return {
        title: `🎮 ${escapeDiscordMarkdown(data.eventName)}`,
        description: escapeDiscordMarkdown(data.eventDetails),
        color: COLORS.PRIMARY,
        fields: [
            {
                name: '📅 締切日',
                value: escapeDiscordMarkdown(data.eventDeadline),
                inline: true,
            },
            {
                name: '📆 表示最終日',
                value: escapeDiscordMarkdown(data.eventDisplayEnd),
                inline: true,
            },
        ],
        footer: {
            text: `登録者: ${escapeDiscordMarkdown(data.registeredBy)}`,
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
    const sanitizedName = escapeDiscordMarkdown(eventName);
    return `✅ 「${sanitizedName}」を登録しました！\nDiscordチャンネルとEuropaに投稿されました。`;
}

/**
 * エラーメッセージを生成（ephemeral用）
 * 注意: errorsはシステムが生成した安全なメッセージのみを想定
 */
export function createErrorMessage(errors: string[]): string {
    // エラーメッセージは内部で生成されるためサニタイズ不要
    // ただし念のため長さを制限
    const MAX_ERROR_LENGTH = 200;
    const sanitizedErrors = errors.map(e =>
        e.length > MAX_ERROR_LENGTH ? e.substring(0, MAX_ERROR_LENGTH) + '...' : e
    );
    return `❌ 登録に失敗しました:\n${sanitizedErrors.map(e => `• ${e}`).join('\n')}`;
}
