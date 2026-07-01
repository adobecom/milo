/* eslint-disable import/no-extraneous-dependencies */
// Forge E2E config — two modes controlled by FORGE_TEST_MODE env var:
//
//   demo (default)  — Vite dev server, FORGE_MOCK=true, demoApi fixtures.
//                     Fast (~30s), no backend, no API key. UI iteration.
//
//   real            — Vite dev server, FORGE_MOCK=false, real milo-logs-deploy.
//                     Requires FORGE_SERVER_URL (default http://localhost:8080)
//                     and a running backend with ANTHROPIC_API_KEY set.
//                     Sessions take 20-30 min; set TEST_TIMEOUT_MS accordingly.
//
// Usage:
//   npm run nala:forge                        # demo mode
//   FORGE_TEST_MODE=real npm run nala:forge   # real backend

const { devices } = require('@playwright/test');
const path = require('path');

const MODE = process.env.FORGE_TEST_MODE || 'demo';
const isReal = MODE === 'real';

const FORGE_PORT = parseInt(process.env.FORGE_PORT || '5173', 10);
const BASE_URL = `http://localhost:${FORGE_PORT}`;

// Real mode: sessions take up to 30 min; override with TEST_TIMEOUT_MS.
const TIMEOUT = isReal
  ? parseInt(process.env.TEST_TIMEOUT_MS || String(35 * 60 * 1000), 10)
  : 60 * 1000;

const config = {
  testDir: './nala/tools/forge',
  testMatch: ['**/*.test.js', '**/*.e2e.js'],
  timeout: TIMEOUT,
  expect: { timeout: isReal ? 5 * 60 * 1000 : 30 * 1000 },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  outputDir: './test-results/forge',
  reporter: [
    ['html', { open: 'never', outputFolder: 'test-results/forge-report' }],
    ['list'],
  ],

  use: {
    baseURL: BASE_URL,
    video: 'on',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    viewport: { width: 1280, height: 900 },
    headless: process.env.CI ? true : false,
  },

  webServer: {
    // Real mode: FORGE_MOCK=false so the frontend talks to the real backend.
    command: isReal
      ? 'FORGE_MOCK=false npm run dev'
      : 'npm run dev',
    cwd: path.join(__dirname, 'tools', 'forge'),
    url: `${BASE_URL}/tools/forge.html`,
    reuseExistingServer: !process.env.CI,
    timeout: 60 * 1000,
    stdout: 'pipe',
    env: {
      // Pass through the current env so the vite process sees PATH etc.
      ...process.env,
      // Explicitly set the flag for the vite process (shell may not inherit it).
      FORGE_MOCK: isReal ? 'false' : 'true',
    },
  },

  projects: [
    {
      name: 'forge-chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },
  ],
};

module.exports = config;
