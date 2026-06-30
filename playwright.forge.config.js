/* eslint-disable import/no-extraneous-dependencies */
const { devices } = require('@playwright/test');
const path = require('path');

const FORGE_PORT = parseInt(process.env.FORGE_PORT || '5173', 10);
const BASE_URL = `http://localhost:${FORGE_PORT}`;

const config = {
  testDir: './nala/tools/forge',
  testMatch: '**/*.test.js',
  timeout: 60 * 1000,   // demo run (~13s) + deploy (~8s) + buffer
  expect: { timeout: 30 * 1000 },
  fullyParallel: false,  // sessions share in-memory state, run serially
  retries: 0,
  workers: 1,
  outputDir: './test-results/forge',
  reporter: [
    ['html', { open: 'never', outputFolder: 'test-results/forge-report' }],
    ['list'],
  ],

  use: {
    baseURL: BASE_URL,
    // Record a video for every test — the deliverable the user asked for.
    video: 'on',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    viewport: { width: 1280, height: 900 },
    // Headed locally so the recording is meaningful; headless in CI.
    headless: process.env.CI ? true : false,
  },

  webServer: {
    command: 'npm run dev',
    cwd: path.join(__dirname, 'tools', 'forge'),
    url: `${BASE_URL}/tools/forge.html`,
    reuseExistingServer: !process.env.CI,
    timeout: 60 * 1000,
    stdout: 'pipe',
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
