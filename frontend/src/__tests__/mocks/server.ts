import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// MSWサーバーのセットアップ
export const server = setupServer(...handlers);
