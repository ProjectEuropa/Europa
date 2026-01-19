import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { neon } from '@neondatabase/serverless';
import type { Env } from '../types/bindings';
import {
    InteractionType,
    InteractionResponseType,
    type DiscordInteraction,
    type InteractionResponse,
    type ModalSubmitInteractionData,
} from '../types/discord';
import { verifyDiscordSignature } from '../services/discord/verify';
import {
    createEventRegistrationModal,
    extractModalValues,
    validateEventFormData,
    MODAL_IDS,
} from '../services/discord/modals';
import { postMessage, createMessageLink } from '../services/discord/api';
import { createEventMessage, createSuccessMessage, createErrorMessage } from '../services/discord/embed';

const discord = new Hono<{ Bindings: Env }>();

// Message Flags
const EPHEMERAL = 1 << 6; // 64 - Only visible to the user who triggered the interaction

/**
 * POST /api/v2/discord/interactions
 * Discord Interactions Endpoint
 */
discord.post('/interactions', async (c) => {
    // 署名検証
    const signature = c.req.header('X-Signature-Ed25519');
    const timestamp = c.req.header('X-Signature-Timestamp');
    const rawBody = await c.req.text();

    if (!signature || !timestamp) {
        throw new HTTPException(401, { message: 'Missing signature headers' });
    }

    const isValid = await verifyDiscordSignature(
        c.env.DISCORD_PUBLIC_KEY,
        signature,
        timestamp,
        rawBody
    );

    if (!isValid) {
        throw new HTTPException(401, { message: 'Invalid signature' });
    }

    // リクエストボディをパース
    const interaction: DiscordInteraction = JSON.parse(rawBody);

    // PING応答（Discord検証用）
    if (interaction.type === InteractionType.PING) {
        return c.json({ type: InteractionResponseType.PONG });
    }

    // スラッシュコマンド処理
    if (interaction.type === InteractionType.APPLICATION_COMMAND) {
        const data = interaction.data as { name: string };

        if (data.name === '大会登録') {
            // Modal表示
            const response = createEventRegistrationModal();
            return c.json(response);
        }

        // 未知のコマンド
        const response: InteractionResponse = {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: '❌ 不明なコマンドです',
                flags: EPHEMERAL,
            },
        };
        return c.json(response);
    }

    // Modal送信処理
    if (interaction.type === InteractionType.MODAL_SUBMIT) {
        const modalData = interaction.data as ModalSubmitInteractionData;

        if (modalData.custom_id === MODAL_IDS.EVENT_REGISTRATION) {
            try {
                // フォームデータを抽出
                const formData = extractModalValues(modalData.components);

                // バリデーション
                const validation = validateEventFormData(formData);
                if (!validation.valid) {
                    const response: InteractionResponse = {
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: {
                            content: createErrorMessage(validation.errors),
                            flags: EPHEMERAL,
                        },
                    };
                    return c.json(response);
                }

                // ユーザー情報
                const user = interaction.member?.user || interaction.user;
                const username = user?.global_name || user?.username || 'Unknown';

                // Discordチャンネルに投稿
                const message = createEventMessage({
                    eventName: formData.eventName,
                    eventDetails: formData.eventDetails,
                    eventDeadline: formData.eventDeadline,
                    eventDisplayEnd: formData.eventDisplayEnd,
                    registeredBy: username,
                });

                const postedMessage = await postMessage(
                    c.env.DISCORD_BOT_TOKEN,
                    c.env.DISCORD_CHANNEL_ID,
                    message
                );

                // メッセージリンクを生成
                const messageLink = createMessageLink(
                    c.env.DISCORD_GUILD_ID,
                    c.env.DISCORD_CHANNEL_ID,
                    postedMessage.id
                );

                // Europaのeventsテーブルに登録
                const sql = neon(c.env.DATABASE_URL);

                // 日付をISO形式に変換（23:59:59を追加）
                const deadline = new Date(`${formData.eventDeadline}T23:59:59`).toISOString();
                const displayEnd = new Date(`${formData.eventDisplayEnd}T23:59:59`).toISOString();

                await sql`
                    INSERT INTO events (
                        register_user_id,
                        event_name,
                        event_details,
                        event_reference_url,
                        event_type,
                        event_closing_day,
                        event_displaying_day
                    ) VALUES (
                        NULL,
                        ${formData.eventName},
                        ${formData.eventDetails},
                        ${messageLink},
                        '1',
                        ${deadline}::timestamptz AT TIME ZONE 'Asia/Tokyo',
                        ${displayEnd}::timestamptz AT TIME ZONE 'Asia/Tokyo'
                    )
                `;

                // 成功レスポンス
                const response: InteractionResponse = {
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: createSuccessMessage(formData.eventName),
                        flags: EPHEMERAL,
                    },
                };
                return c.json(response);

            } catch (error) {
                console.error('Event registration failed:', error);
                const response: InteractionResponse = {
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: createErrorMessage(['サーバーエラーが発生しました。しばらく後にお試しください。']),
                        flags: EPHEMERAL,
                    },
                };
                return c.json(response);
            }
        }
    }

    // 未対応のInteractionタイプ
    const response: InteractionResponse = {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: '❌ このInteractionには対応していません',
            flags: EPHEMERAL,
        },
    };
    return c.json(response);
});

/**
 * POST /api/v2/discord/register-commands
 * スラッシュコマンドを登録（手動実行用）
 */
discord.post('/register-commands', async (c) => {
    const { registerGuildCommands } = await import('../services/discord/api');

    try {
        await registerGuildCommands(
            c.env.DISCORD_BOT_TOKEN,
            c.env.DISCORD_APPLICATION_ID,
            c.env.DISCORD_GUILD_ID
        );

        return c.json({ message: 'Commands registered successfully' });
    } catch (error) {
        console.error('Failed to register commands:', error);
        throw new HTTPException(500, { message: 'Failed to register commands' });
    }
});

export default discord;
