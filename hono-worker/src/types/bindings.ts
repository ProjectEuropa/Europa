import { KVNamespace, R2Bucket } from '@cloudflare/workers-types';

export type Bindings = {
    ENVIRONMENT: 'development' | 'staging' | 'production';
    API_VERSION: string;
    LOG_LEVEL: string;
    DATABASE_URL: string;
    JWT_SECRET: string;
    RESEND_API_KEY: string;
    R2_BUCKET: R2Bucket;
    KV: KVNamespace;
};
