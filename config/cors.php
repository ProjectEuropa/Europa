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

    'allowed_origins' => array_filter([
        'http://localhost:3000',              // Next.js開発用
        'http://localhost:3002',              // Next.js開発用（別ポート）
        env('FRONTEND_URL_PRE'),              // プレ環境
        env('FRONTEND_URL_STG'),              // ステージング環境
        env('FRONTEND_URL_PROD'),             // 本番環境
        ...explode(',', env('CORS_ALLOWED_ORIGINS', '')), // 追加設定
    ]),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['Content-Type', 'X-Requested-With', 'Authorization', 'X-XSRF-TOKEN', 'Accept'],

    'exposed_headers' => ['Content-Type', 'Authorization', 'X-Requested-With', 'X-XSRF-TOKEN'],

    'max_age' => 0,

    'supports_credentials' => true,
];
