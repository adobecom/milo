#!/usr/bin/env node

/**
 * Floodgate E2E Test Data — Inventory & Status
 *
 * The test sandbox at /adobecom/da-events/drafts/nala-fg-test/ is populated
 * via two sources:
 *   1. Simple test files — authored manually (test1-*, test2-*, etc.)
 *   2. Real event pages — seeded by seed-real-content.js
 *
 * This script verifies what's present and prints a summary.
 *
 * Usage:
 *   node nala/features/dafloodgate/setup-test-data.js           # verify
 *   node nala/features/dafloodgate/setup-test-data.js verify    # same
 *
 * For creating/removing content, use:
 *   node nala/features/dafloodgate/seed-real-content.js seed     # add real event pages
 *   node nala/features/dafloodgate/seed-real-content.js cleanup  # remove seeded content
 */

/* eslint-disable no-console, no-await-in-loop */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const AUTH_FILE = path.resolve(__dirname, '../../utils/auth.json');
const DA_ADMIN = 'https://admin.da.live';

const TEST_ORG = process.env.FG_ORG || 'adobecom';
const TEST_REPO = process.env.FG_REPO || 'da-events';
const FG_COLOR = process.env.FG_COLOR || 'pink';

const TEST_DIR = `/${TEST_ORG}/${TEST_REPO}/drafts/nala-fg-test`;
const FG_DIR = `/${TEST_ORG}/${TEST_REPO}-fg-${FG_COLOR}/drafts/nala-fg-test`;

// Tier-1 simple files (should always be present)
const SIMPLE_FILES = [
  `${TEST_DIR}/test1-single-block.html`,
  `${TEST_DIR}/test2-multiple-blocks.html`,
  `${TEST_DIR}/test3-sheet.json`,
  `${TEST_DIR}/test4-with-fragments.html`,
  `${TEST_DIR}/2024-11-14.html`,
  `${TEST_DIR}/fragments/test-fragment-1.html`,
  `${TEST_DIR}/assets/001.png`,
  `${TEST_DIR}/test1.png`,
  `${TEST_DIR}/test2.png`,
  `${TEST_DIR}/google.link`,
];

// Tier-2 seeded real event files (created by seed-real-content.js)
const EVENT_FILES = [
  `${TEST_DIR}/events/summit-london.html`,
  `${TEST_DIR}/events/summit-munich.html`,
  `${TEST_DIR}/events/creative-cafe-ny.html`,
  `${TEST_DIR}/events/creator-live-london.html`,
  `${TEST_DIR}/events/events-hub.html`,
];

function loadAuth() {
  if (!fs.existsSync(AUTH_FILE)) {
    console.error(`ERROR: ${AUTH_FILE} not found.`);
    console.error('Run `node nala/utils/da-login.js` first.');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'));
}

async function getToken(page) {
  await page.goto('https://da.live');
  await page.waitForLoadState('domcontentloaded');
  return page.evaluate(() => {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith('adobeid_ims_access_token')) {
        try { return JSON.parse(localStorage.getItem(key)).tokenValue; } catch { /* noop */ }
      }
    }
    return null;
  });
}

async function fileExists(page, filePath, token) {
  const resp = await page.request.head(`${DA_ADMIN}/source${filePath}`, { headers: { Authorization: `Bearer ${token}` } });
  return resp.status() === 200;
}

async function verify(page, token) {
  console.log('\n=== Floodgate Test Data Inventory ===');
  console.log(`    Source sandbox: ${TEST_DIR}`);
  console.log(`    FG sandbox    : ${FG_DIR}\n`);

  console.log('--- Tier 1: Simple test files (manually authored) ---');
  let simpleOk = 0;
  for (const f of SIMPLE_FILES) {
    const exists = await fileExists(page, f, token);
    console.log(`  ${exists ? '[OK]  ' : '[MISS]'} ${f}`);
    if (exists) simpleOk += 1;
  }
  console.log(`  -> ${simpleOk}/${SIMPLE_FILES.length} present`);

  console.log('\n--- Tier 2: Real event content (seeded) ---');
  let eventOk = 0;
  for (const f of EVENT_FILES) {
    const exists = await fileExists(page, f, token);
    console.log(`  ${exists ? '[OK]  ' : '[MISS]'} ${f}`);
    if (exists) eventOk += 1;
  }
  console.log(`  -> ${eventOk}/${EVENT_FILES.length} present`);

  console.log('\n--- FG repo (copies from prior tests) ---');
  const fgExists = await fileExists(page, `${FG_DIR}/test1-single-block.html`, token);
  console.log(`  ${fgExists ? '[has content]' : '[empty]'} ${FG_DIR}`);

  console.log('\n=== Summary ===');
  if (simpleOk < SIMPLE_FILES.length) {
    console.log('  Some simple test files missing. Create manually via da.live UI.');
  }
  if (eventOk < EVENT_FILES.length) {
    console.log('  Seeded content missing. Run:');
    console.log('    node nala/features/dafloodgate/seed-real-content.js seed');
  }
  if (simpleOk === SIMPLE_FILES.length && eventOk === EVENT_FILES.length) {
    console.log('  All test data present. Ready to run tests.');
  }
  console.log('');
}

(async () => {
  const cmd = process.argv[2] || 'verify';
  if (!['verify'].includes(cmd)) {
    console.error(`Unsupported command: ${cmd}`);
    console.error('This script only supports "verify". For seeding/cleanup, use seed-real-content.js');
    process.exit(1);
  }

  const storageState = loadAuth();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  try {
    const token = await getToken(page);
    if (!token) {
      console.error('ERROR: failed to extract DA access token. Re-run da-login.js.');
      process.exit(1);
    }
    await verify(page, token);
  } catch (err) {
    console.error('FATAL:', err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
