#!/usr/bin/env node

/**
 * Shared DA Live login utility.
 * Opens a browser to da.live, waits for the user to complete IMS login,
 * and saves the session (cookies + localStorage) so Playwright tests
 * can reuse it via storageState.
 *
 * Usage:
 *   node nala/utils/da-login.js            # default: https://da.live
 *   npm run nala:login                      # same, via npm script
 *
 * Output:
 *   nala/utils/auth.json   (consumed by test.use({ storageState }))
 */

const { chromium } = require('playwright');
const path = require('path');

const AUTH_FILE = path.join(__dirname, 'auth.json');
const DA_LIVE_URL = 'https://da.live';

(async () => {
  console.log('\n--- DA Live Login ---\n');
  console.log('1. A Chrome browser will open to da.live');
  console.log('2. Click the Login button and complete Adobe IMS auth (Skyline Org)');
  console.log('3. Once you see the DA Live dashboard, come back here');
  console.log('4. Press ENTER to save the session\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(DA_LIVE_URL);
  await page.waitForLoadState('domcontentloaded');

  await new Promise((resolve) => {
    process.stdout.write('Press ENTER after login is complete... ');
    process.stdin.once('data', resolve);
  });

  await context.storageState({ path: AUTH_FILE });
  console.log(`\nAuth state saved to: ${AUTH_FILE}`);
  console.log('Tests will automatically pick this up. You can now run:\n');
  console.log('  LPB_REF=stage npm run nala local @lpb mode=headed\n');

  await browser.close();
  process.exit(0);
})();
