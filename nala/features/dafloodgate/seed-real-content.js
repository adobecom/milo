#!/usr/bin/env node

/**
 * Seed real event content into the Floodgate test sandbox.
 *
 * Downloads 5 real event pages from da-bacom / da-events repos, extracts their
 * referenced fragments, rewrites URLs to point to the sandbox, and uploads
 * everything to /adobecom/da-events/drafts/nala-fg-test/.
 *
 * Uses nala/utils/auth.json for authentication (run da-login.js first).
 *
 * Usage:
 *   node nala/features/dafloodgate/seed-real-content.js [seed|verify|cleanup]
 */

/* eslint-disable no-console, no-await-in-loop, no-continue, no-cond-assign,
   no-use-before-define, no-inner-declarations, default-param-last, no-unused-vars */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const AUTH_FILE = path.resolve(__dirname, '../../utils/auth.json');
const DA_ADMIN = 'https://admin.da.live';

const TARGET_ORG = 'adobecom';
const TARGET_REPO = 'da-events';
// URL path (used in HTML href, no org/repo prefix since host implies them)
const SANDBOX_URL = '/drafts/nala-fg-test';
// DA path (used for API upload, includes org/repo)
const SANDBOX = `/${TARGET_ORG}/${TARGET_REPO}${SANDBOX_URL}`;

// Real event pages to seed. Each is given a short name and source location in DA.
// The script will download from {sourceOrg}/{sourceRepo}{sourcePath} and write
// to {SANDBOX}/events/{name}.html.
const PAGES = [
  {
    name: 'summit-london',
    sourceOrg: 'adobecom',
    sourceRepo: 'da-bacom',
    sourcePath: '/uk/resources/events/regional-summit-series/adobe-summit-london-2026/london/gb/2026-07-07',
    eventDate: '2026-07-07', // date-folder fragments loaded at runtime by chrono-box
    desc: 'UK Summit event (da-bacom) — standard event layout',
  },
  {
    name: 'summit-munich',
    sourceOrg: 'adobecom',
    sourceRepo: 'da-bacom',
    sourcePath: '/de/resources/events/regional-summit-series/adobe-summit-munich-2026/munchen/by/de/2026-07-14',
    eventDate: '2026-07-14',
    desc: 'DE Summit event (da-bacom) — multi-locale',
  },
  {
    name: 'creative-cafe-ny',
    sourceOrg: 'adobecom',
    sourceRepo: 'da-events',
    sourcePath: '/events/creative-cafe/adobe-creative-cafe-new-york/new-york/ny/us/2026-06-10',
    eventDate: '2026-06-10',
    desc: 'US Creative Cafe — has shared fragment reference',
  },
  {
    name: 'creator-live-london',
    sourceOrg: 'adobecom',
    sourceRepo: 'da-events',
    sourcePath: '/uk/events/creator-live/creator-live-london/london/gb/2026-03-17',
    eventDate: '2026-03-17',
    desc: 'UK Creator Live — largest event page (~68KB)',
  },
  {
    name: 'events-hub',
    sourceOrg: 'adobecom',
    sourceRepo: 'da-events',
    sourcePath: '/events',
    // no eventDate — hub page, not a date-based event
    desc: 'Events hub — contains CaaS dynamic blocks',
  },
];

// ---------------------------------------------------------------------------

function loadAuth() {
  if (!fs.existsSync(AUTH_FILE)) {
    console.error(`ERROR: ${AUTH_FILE} not found. Run \`node nala/utils/da-login.js\` first.`);
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

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

async function daFetch(page, urlPath, method = 'GET', token, opts = {}) {
  const url = urlPath.startsWith('http') ? urlPath : `${DA_ADMIN}${urlPath}`;
  const resp = await page.request.fetch(url, {
    method,
    headers: { ...authHeaders(token), ...(opts.headers || {}) },
    data: opts.data,
    multipart: opts.multipart,
  });
  return resp;
}

async function sourceGet(page, fullPath, token) {
  const resp = await daFetch(page, `/source${fullPath}.html`, 'GET', token);
  if (resp.status() !== 200) return null;
  return resp.text();
}

async function sourceExists(page, fullPath, token) {
  const resp = await daFetch(page, `/source${fullPath}`, 'HEAD', token);
  return resp.status() === 200;
}

async function uploadHtml(page, fullPath, html, token) {
  // Editable files need a version created first
  await daFetch(page, `/versionsource${fullPath}.html`, 'POST', token, {
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({ label: 'Seeded real content for Floodgate tests' }),
  });

  const resp = await daFetch(page, `/source${fullPath}.html`, 'POST', token, {
    multipart: {
      data: {
        name: 'data',
        mimeType: 'text/html',
        buffer: Buffer.from(html, 'utf-8'),
      },
    },
  });
  return resp.status();
}

async function deletePath(page, fullPath, token) {
  const resp = await daFetch(page, `/source${fullPath}`, 'DELETE', token);
  return resp.status();
}

async function listDir(page, fullPath, token) {
  const resp = await daFetch(page, `/list${fullPath}`, 'GET', token);
  if (resp.status() !== 200) return [];
  return resp.json();
}

// ---------------------------------------------------------------------------

/**
 * Find internal fragment references in HTML content.
 * Matches hrefs pointing to /{anything}/fragments/... in the same origin family.
 */
function extractFragmentPaths(html, sourceOrg, sourceRepo) {
  const frags = new Set();
  const fragmentRegex = new RegExp(
    `href="(?:https?://[^/]*--${sourceRepo}--${sourceOrg}\\.[^"/]+)?(/[^"]*?/fragments/[^"]+?)"`,
    'g',
  );
  let m;
  while ((m = fragmentRegex.exec(html)) !== null) {
    // Clean: strip query/hash, remove .html suffix, strip trailing slash
    const p = m[1].split('?')[0].split('#')[0].replace(/\.html$/, '').replace(/\/$/, '');
    frags.add(p);
  }
  return [...frags];
}

/**
 * Rewrite URLs in HTML:
 *  1. Replace host references {ref}--{sourceRepo}--{sourceOrg} with
 *     {ref}--{targetRepo}--{targetOrg}
 *  2. Rewrite fragment paths from their original location to the sandbox location.
 */
function rewriteContent(html, sourceOrg, sourceRepo, fragmentMap) {
  let out = html;
  // Swap host refs (main--da-bacom--adobecom -> main--da-events--adobecom)
  const hostRe = new RegExp(`(--)${sourceRepo}(--${sourceOrg}\\.)`, 'g');
  out = out.replace(hostRe, `$1${TARGET_REPO}$2`);

  // Rewrite fragment paths
  for (const [originalPath, sandboxPath] of Object.entries(fragmentMap)) {
    const esc = originalPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(esc, 'g');
    out = out.replace(re, sandboxPath);
  }
  return out;
}

// URL path: used in HTML href (e.g., /drafts/nala-fg-test/_fragments/...)
function sandboxFragmentUrlPath(originalFragPath) {
  // Strip leading org/repo: /adobecom/da-events/events/events-shared/fragments/...
  // -> /events/events-shared/fragments/...
  const parts = originalFragPath.split('/').filter(Boolean);
  const stripped = parts.slice(2).join('/');
  return `${SANDBOX_URL}/_fragments/${stripped}`;
}

// DA path: used for API upload (e.g., /adobecom/da-events/drafts/nala-fg-test/_fragments/...)
function sandboxFragmentDaPath(originalFragPath) {
  return `/${TARGET_ORG}/${TARGET_REPO}${sandboxFragmentUrlPath(originalFragPath)}`;
}

// ---------------------------------------------------------------------------

async function seedOne(page, token, pageCfg, seenFragments, log) {
  const src = `/${pageCfg.sourceOrg}/${pageCfg.sourceRepo}${pageCfg.sourcePath}`;
  log(`\n>> ${pageCfg.name}`);
  log(`   source: ${src}.html`);

  const html = await sourceGet(page, src, token);
  if (!html) {
    log('   ! failed to fetch source');
    return;
  }

  // Discover referenced fragments
  const fragPaths = extractFragmentPaths(html, pageCfg.sourceOrg, pageCfg.sourceRepo);
  log(`   fragments: ${fragPaths.length}`);

  // Fetch each fragment and compute both URL path (for HTML) and DA path (for upload)
  const fragmentMap = {};
  for (const fragPath of fragPaths) {
    const fullFragPath = fragPath.startsWith(`/${pageCfg.sourceOrg}/${pageCfg.sourceRepo}`)
      ? fragPath
      : `/${pageCfg.sourceOrg}/${pageCfg.sourceRepo}${fragPath}`;

    const urlPath = sandboxFragmentUrlPath(fullFragPath);
    const daPath = sandboxFragmentDaPath(fullFragPath);

    // Record for URL rewrite — map ALL possible original forms to the URL path
    fragmentMap[fragPath] = urlPath;
    fragmentMap[fullFragPath] = urlPath;

    if (seenFragments.has(daPath)) continue;
    seenFragments.add(daPath);

    const fragHtml = await sourceGet(page, fullFragPath, token);
    if (!fragHtml) {
      log(`   ! fragment missing: ${fullFragPath}`);
      continue;
    }
    // Fragment content: only rewrite host (fragments rarely reference other fragments)
    const rewrittenFrag = rewriteContent(fragHtml, pageCfg.sourceOrg, pageCfg.sourceRepo, {});
    const status = await uploadHtml(page, daPath, rewrittenFrag, token);
    log(`   frag [${status}]: ${urlPath}`);
  }

  // Rewrite main page HTML (uses URL paths) and upload to DA path
  const destDaPath = `${SANDBOX}/events/${pageCfg.name}`;
  const rewritten = rewriteContent(html, pageCfg.sourceOrg, pageCfg.sourceRepo, fragmentMap);
  const status = await uploadHtml(page, destDaPath, rewritten, token);
  log(`   page [${status}]: ${destDaPath}.html`);

  // Seed date-based runtime fragments (loaded dynamically by chrono-box block)
  // Source: {sourcePath}/fragments/{eventDate}/*
  // Dest  : {SANDBOX}/events/fragments/{eventDate}/*
  if (pageCfg.eventDate) {
    await seedDateFragments(page, token, pageCfg, log);
  }
}

async function seedDateFragments(page, token, pageCfg, log) {
  const srcDir = `/${pageCfg.sourceOrg}/${pageCfg.sourceRepo}${pageCfg.sourcePath.replace(/\/[^/]*$/, '')}/fragments/${pageCfg.eventDate}`;
  const destDir = `${SANDBOX}/events/fragments/${pageCfg.eventDate}`;

  const items = await listDir(page, srcDir, token);
  if (items.length === 0) {
    log(`   (no date fragments at ${srcDir})`);
    return;
  }

  log(`   date fragments (${items.length}) from ${pageCfg.eventDate}/`);
  for (const item of items) {
    if (!item.ext || item.ext !== 'html') continue;
    const srcPath = item.path.replace(/\.html$/, '');
    const destPath = `${destDir}/${item.name}`;

    const fragHtml = await sourceGet(page, srcPath, token);
    if (!fragHtml) {
      log(`   ! failed to fetch ${srcPath}`);
      continue;
    }
    // Rewrite host references (handles da-bacom -> da-events for Summit pages)
    const rewritten = rewriteContent(fragHtml, pageCfg.sourceOrg, pageCfg.sourceRepo, {});
    const status = await uploadHtml(page, destPath, rewritten, token);
    log(`     [${status}] ${item.name}.html`);
  }
}

async function seed(page, token) {
  console.log('\n=== Seeding real event content into sandbox ===');
  console.log(`    target: ${SANDBOX}/events/`);

  const seenFragments = new Set();
  for (const cfg of PAGES) {
    await seedOne(page, token, cfg, seenFragments, console.log);
  }
  console.log('\n=== Done ===\n');
}

async function verify(page, token) {
  console.log('\n=== Sandbox contents ===\n');

  async function recurse(dir, depth = 0) {
    const items = await listDir(page, dir, token);
    for (const item of items) {
      const pad = '  '.repeat(depth);
      if (item.ext) {
        console.log(`${pad}${item.name}.${item.ext}`);
      } else {
        console.log(`${pad}${item.name}/`);
        await recurse(item.path, depth + 1);
      }
    }
  }

  await recurse(SANDBOX);
  console.log('');
}

async function cleanup(page, token) {
  console.log('\n=== Cleaning up seeded content ===\n');
  // Only delete the /events/ and /_fragments/ subdirs we created
  // (events/ now contains both event pages and events/fragments/{date}/ subdirs)
  const toClean = [`${SANDBOX}/events`, `${SANDBOX}/_fragments`];
  for (const dir of toClean) {
    async function recurse(p) {
      const items = await listDir(page, p, token);
      for (const it of items) {
        if (it.ext) {
          const status = await deletePath(page, it.path, token);
          console.log(`  [${status}] ${it.path}`);
        } else {
          await recurse(it.path);
        }
      }
    }
    await recurse(dir);
  }
  console.log('\nNote: original test data (test1-*, test2-*, etc.) preserved.\n');
}

// ---------------------------------------------------------------------------

(async () => {
  const cmd = process.argv[2] || 'seed';
  if (!['seed', 'verify', 'cleanup'].includes(cmd)) {
    console.error(`Unknown command: ${cmd}`);
    console.error('Usage: node seed-real-content.js [seed|verify|cleanup]');
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

    if (cmd === 'seed') await seed(page, token);
    else if (cmd === 'verify') await verify(page, token);
    else if (cmd === 'cleanup') await cleanup(page, token);
  } catch (err) {
    console.error('FATAL:', err.message);
    console.error(err.stack);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
