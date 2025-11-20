<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or CORS. This determines which cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:3000',              // Next.js開発用
        'http://localhost:3002',              // Next.js開発用（別ポート）
        'https://pre.project-europa.work',    // プレ環境
        'https://stg.project-europa.work',    // ステージング環境
        'https://project-europa.work',        // 本番環境
        ...array_filter(explode(',', env('CORS_ALLOWED_ORIGINS', ''))), // 環境変数での追加設定
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Custom-Header'],

    'max_age' => 0,

    'supports_credentials' => true,
];
