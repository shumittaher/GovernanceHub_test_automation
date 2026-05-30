import { defineConfig, devices } from '@playwright/test';
import { config } from './utils/config';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: config.frontendUrl,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'setup: super admin',
      testMatch: /superadmin\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/superadmin.json',
      },
      dependencies: ['setup: super admin'],
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/superadmin.json',
      },
      dependencies: ['setup: super admin'],
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: 'playwright/.auth/superadmin.json',
      },
      dependencies: ['setup: super admin'],
    },
  ],
});
