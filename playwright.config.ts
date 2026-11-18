import { defineConfig, devices } from '@playwright/test';

/**
 * Test runner config for Web (browser) and API (request).
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 2,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'web',
      testDir: './tests/web',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        // Local lab provider (npm run provider:start) — stable for CI
        baseURL: process.env.PROVIDER_BASE_URL || 'http://127.0.0.1:4010',
      },
    },
  ],
});
