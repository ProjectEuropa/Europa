import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

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
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: isCI ? 'npm run start' : 'npm run dev',
    url: isCI ? 'http://localhost:3000' : 'http://localhost:3002',
    reuseExistingServer: !isCI,
    timeout: 120000,
  },
});
