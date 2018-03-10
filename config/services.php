<?php

switch (getenv('PHP_ENV')) {
    case 'production'://本番用
        $twitter_client_id = getenv("TWITTER_ID");
        $twitter_client_secret = getenv("TWITTER_SECRET");
        $twitter_redirect = getenv('CALLBACK_URL');
        $google_client_id = getenv('GOOGLE_ID');
        $google_client_secret = getenv('GOOGLE_SECRET');
        $google_redirect = getenv('GOOGLE_CALLBACKURL');
        break;
    default:// ローカル用
        $twitter_client_id = env("TWITTER_ID");
        $twitter_client_secret = env("TWITTER_SECRET");
        $twitter_redirect = env('CALLBACK_URL');
        $google_client_id = env('GOOGLE_ID');
        $google_client_secret = env('GOOGLE_SECRET');
        $google_redirect = env('GOOGLE_CALLBACKURL');
        break;
}

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Stripe, Mailgun, SparkPost and others. This file provides a sane
    | default location for this type of information, allowing packages
    | to have a conventional place to find your various credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
    ],

    'ses' => [
        'key' => env('SES_KEY'),
        'secret' => env('SES_SECRET'),
        'region' => 'us-east-1',
    ],

    'sparkpost' => [
        'secret' => env('SPARKPOST_SECRET'),
    ],

    'stripe' => [
        'model' => App\User::class,
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
    ],

    'twitter' => [
        'client_id' => $twitter_client_id,
        'client_secret' => $twitter_client_secret,
        'redirect' => $twitter_redirect,
    ],
    'google' => [
        'client_id' => $google_client_id,
        'client_secret' => $google_client_secret,
        'redirect' => $google_redirect,
    ],
];
