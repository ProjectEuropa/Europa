// Cloudflare Workers環境変数の型定義

export interface Env {
    // 環境識別子
    ENVIRONMENT: 'development' | 'staging' | 'production';

    // APIバージョン
    API_VERSION: string;

    // ログレベル
    LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';

    // データベース（Neon）
    DATABASE_URL: string;

    // JWT認証
    JWT_SECRET: string;

    // メール送信（Resend）
    RESEND_API_KEY?: string;
    RESEND_FROM_EMAIL?: string;

    // フロントエンドURL（CORS用）
    FRONTEND_URL?: string;

    // R2 Bucket
    FILES_BUCKET: R2Bucket;

    // Discord連携
    DISCORD_APPLICATION_ID: string;
    DISCORD_PUBLIC_KEY: string;
    DISCORD_BOT_TOKEN: string;
    DISCORD_GUILD_ID: string;
    DISCORD_CHANNEL_ID: string;
}
