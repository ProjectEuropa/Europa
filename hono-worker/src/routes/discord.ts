import { neon } from '@neondatabase/serverless';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { createMessageLink, deleteMessage, postMessage } from '../services/discord/api';
import {
    createErrorMessage,
    createEventMessage,
    createSuccessMessage,
} from '../services/discord/embed';
import {
    createEventRegistrationModal,
    extractModalValues,
    MODAL_IDS,
    validateEventFormData,
} from '../services/discord/modals';
import { verifyDiscordSignature } from '../services/discord/verify';
import type { Env } from '../types/bindings';
import {
    type DiscordInteraction,
    EVENT_TYPES,
    type InteractionResponse,
    InteractionResponseType,
    InteractionType,
    MESSAGE_FLAGS,
    type ModalSubmitInteractionData,
} from '../types/discord';

const discord = new Hono<{ Bindings: Env }>();

// Discord環境変数の必須チェック
const REQUIRED_DISCORD_ENV = [
    'DISCORD_PUBLIC_KEY',
    'DISCORD_BOT_TOKEN',
    'DISCORD_CHANNEL_ID',
    'DISCORD_GUILD_ID',
    'DISCORD_APPLICATION_ID',
] as const;

/**
 * POST /api/v2/discord/interactions
 * Discord Interactions Endpoint
 */
discord.post('/interactions', async c => {
    // 環境変数の検証
    for (const key of REQUIRED_DISCORD_ENV) {
        if (!c.env[key]) {
            console.error(`Missing required environment variable: ${key}`);
            throw new HTTPException(500, { message: 'Server configuration error' });
        }
    }

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
                flags: MESSAGE_FLAGS.EPHEMERAL,
            },
        };
        return c.json(response);
    }

    // Modal送信処理
    if (interaction.type === InteractionType.MODAL_SUBMIT) {
        const modalData = interaction.data as ModalSubmitInteractionData;

        if (modalData.custom_id === MODAL_IDS.EVENT_REGISTRATION) {
            // ユーザー情報（ログ用に先に取得）
            const user = interaction.member?.user || interaction.user;
            const username = user?.global_name || user?.username || 'Unknown';

            try {
                // フォームデータを抽出
                const formData = extractModalValues(modalData.components);

                // バリデーション
                const validation = validateEventFormData(formData);
                if (!validation.valid) {
                    // バリデーションエラーをログに記録（デバッグ用）
                    console.warn('Event form validation failed:', {
                        errors: validation.errors,
                        userId: user?.id,
                        username: user?.username,
                    });
                    const response: InteractionResponse = {
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: {
                            content: createErrorMessage(validation.errors),
                            flags: MESSAGE_FLAGS.EPHEMERAL,
                        },
                    };
                    return c.json(response);
                }

                // コマンドが実行されたチャンネルに投稿
                const channelId = interaction.channel_id || c.env.DISCORD_CHANNEL_ID;
                const guildId = interaction.guild_id || c.env.DISCORD_GUILD_ID;

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
                    channelId,
                    message
                );

                // メッセージリンクを生成
                const messageLink = createMessageLink(guildId, channelId, postedMessage.id);

                // Europaのeventsテーブルに登録
                const sql = neon(c.env.DATABASE_URL);

                /**
                 * 日付をJST形式でDBに保存
                 *
                 * タイムゾーンの想定:
                 * - ユーザー入力: YYYY-MM-DD形式（JST日付を想定）
                 * - 締切時刻: その日の23:59:59 JST（日本時間の1日の終わり）
                 * - DB保存: AT TIME ZONE 'Asia/Tokyo' でJSTとして保存
                 *
                 * 既存のevents.tsのPOST /api/v2/eventsと同じ形式で保存
                 * ※ timestamptz型だが、AT TIME ZONEでJSTとして解釈される
                 */
                const deadline = `${formData.eventDeadline}T23:59:59`;
                const displayEnd = `${formData.eventDisplayEnd}T23:59:59`;

                try {
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
                            ${EVENT_TYPES.TOURNAMENT},
                            ${deadline}::timestamptz AT TIME ZONE 'Asia/Tokyo',
                            ${displayEnd}::timestamptz AT TIME ZONE 'Asia/Tokyo'
                        )
                    `;
                } catch (dbError) {
                    // DB挿入失敗時はDiscord投稿を削除（ロールバック）
                    console.error('DB insert failed, attempting rollback:', dbError);
                    try {
                        await deleteMessage(c.env.DISCORD_BOT_TOKEN, channelId, postedMessage.id);
                        console.info('Rollback successful: Discord message deleted');
                    } catch (deleteError) {
                        // ロールバック失敗は重大なエラー（データ不整合の可能性）
                        console.error(
                            'CRITICAL: Rollback failed - Discord message remains but DB insert failed:',
                            {
                                messageId: postedMessage.id,
                                channelId,
                                dbError,
                                deleteError,
                            }
                        );
                    }
                    throw dbError;
                }

                // 成功レスポンス
                const response: InteractionResponse = {
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: createSuccessMessage(formData.eventName),
                        flags: MESSAGE_FLAGS.EPHEMERAL,
                    },
                };
                return c.json(response);
            } catch (error) {
                console.error('Event registration failed:', error);
                const response: InteractionResponse = {
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: createErrorMessage([
                            'サーバーエラーが発生しました。しばらく後にお試しください。',
                        ]),
                        flags: MESSAGE_FLAGS.EPHEMERAL,
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
            flags: MESSAGE_FLAGS.EPHEMERAL,
        },
    };
    return c.json(response);
});

/**
 * POST /api/v2/discord/register-commands
 * スラッシュコマンドを登録（手動実行用・内部API）
 * INTERNAL_API_SECRET ヘッダーで保護
 */
discord.post('/register-commands', async c => {
    // 内部APIシークレットによる保護
    const secret = c.req.header('X-Internal-Secret');
    if (!c.env.INTERNAL_API_SECRET || secret !== c.env.INTERNAL_API_SECRET) {
        throw new HTTPException(403, { message: 'Forbidden' });
    }

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
