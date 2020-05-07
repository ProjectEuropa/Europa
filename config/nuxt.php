<?php
return [
    /**
     * In production, the SPA page will be located in the filesystem.
     * The location can be set by env variable NUXT_OUTPUT_PATH or falls back to a static file location
     *
     * In development, the SPA page will be fetched from the nuxt development server.
     * The nuxt server URL will be passed by overwriting the env variable NUXT_OUTPUT_PATH.
     */
    'page' => getenv('NUXT_OUTPUT_PATH') ?: public_path('app/index.html'),
];
