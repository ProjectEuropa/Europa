import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  // Local dev server (Turbopack) can be unstable with many parallel connections
  // Use limited workers locally to avoid net::ERR_ABORTED errors
  workers: isCI ? 1 : 2,
  reporter: isCI
    ? [
        ['html'],
        ['github'],
        // JSON report in test-results/ for CI artifact download
        // Note: outputFile is relative to working directory, not outputDir
        ['json', { outputFile: 'test-results/test-results.json' }],
      ]
    : 'html',
  use: {
    baseURL: isCI ? 'http://localhost:3000' : 'http://localhost:3002',
    trace: 'on-first-retry',
    // Record video on failure for debugging (especially useful in CI)
    video: 'retain-on-failure',
  },
  // Output directory for test artifacts (videos, traces, screenshots)
  outputDir: 'test-results',
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
