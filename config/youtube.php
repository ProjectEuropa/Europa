<?php

return [

    /**
     * Application Name.
     */
    'application_name' => 'Project Europa',

    /**
     * Client ID.
     */
    'client_id' => getenv('GOOGLE_CLIENT_ID', null),

    /**
     * Client Secret.
     */
    'client_secret' => getenv('GOOGLE_CLIENT_SECRET', null),

    /**
     * Access Type
     */
    'access_type' => 'offline',

    /**
     * Approval Prompt
     */
    'approval_prompt' => 'force',

    /**
     * Scopes.
     */
    'scopes' => [
        'https://www.googleapis.com/auth/youtube',
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube.readonly'
    ],

    /**
     * Developer key.
     */
    'developer_key' => getenv('GOOGLE_DEVELOPER_KEY', null),

    'key' => getenv('GOOGLE_API_KEY', null),

    /**
     * Route URI's
     */
    'routes' => [

        /**
         * The prefix for the below URI's
         */
        'prefix' => 'youtube',

        /**
         * Redirect URI
         */
        'redirect_uri' => 'callback',

        /**
         * The autentication URI
         */
        'authentication_uri' => 'auth',

    ]

];