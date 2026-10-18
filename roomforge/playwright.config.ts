import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'url';

const cwd = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npx next start -p 3000',
    cwd,
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 45000,
  },
});
