import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

// API URL for E2E tests (Hono Worker)
// In CI with Neon branch: E2E_API_URL is set to localhost:8787
// Otherwise: use staging API
const apiBaseUrl =
  process.env.E2E_API_URL ||
  (isCI
    ? 'https://hono-worker-staging.m2delta29.workers.dev'
    : 'http://localhost:8787');

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [['html'], ['github']] : 'html',
  use: {
    baseURL: isCI ? 'http://localhost:3000' : 'http://localhost:3002',
    trace: 'on-first-retry',
    // Pass API URL to tests via extraHTTPHeaders or use in test fixtures
    extraHTTPHeaders: {
      'X-E2E-API-URL': apiBaseUrl,
    },
  },
  projects: [
    // Desktop tests (default)
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/*.spec.ts',
      testIgnore: '**/*.mobile.spec.ts',
    },
    // Mobile tests (separate files)
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
      testMatch: '**/*.mobile.spec.ts',
    },
  ],
  webServer: {
    // output: 'export' の静的ビルドには serve を使用
    command: isCI ? 'npx serve out -l 3000' : 'npm run dev',
    url: isCI ? 'http://localhost:3000' : 'http://localhost:3002',
    reuseExistingServer: !isCI,
    timeout: 120000,
  },
});
