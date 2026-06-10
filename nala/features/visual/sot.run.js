#!/usr/bin/env node
/**
 * SOT visual regression runner.
 *
 * Reads `sot.<SITE>.yml` from this directory (e.g. sot.bacom.yml, sot.cc.yml).
 * For each URL: captures the URL twice — unmodified and with MILO_LIBS appended
 * (default `?milolibs=stage`) — across the requested viewports, computes
 * pixel diffs, writes results.json, and (if S3 creds are present) uploads to
 * internal S3 under screenshots/<site>/.
 *
 * Required env vars:
 *   SITE                    — e.g. bacom (selects sot.<site>.yml)
 *
 * Optional env vars:
 *   MILO_LIBS               — default '?milolibs=stage'
 *   VIEWPORTS               — comma-separated; default 'chrome'
 *                             (chrome | ipad | iphone)
 *   S3_ACCESS_KEY_ID
 *   S3_SECRET_ACCESS_KEY    — set both to upload; otherwise skipped
 *
 * Invocation:
 *   SITE=bacom VIEWPORTS=chrome,ipad,iphone node nala/features/visual/sot.run.js
 *
 * Dependencies are isolated in tools/screenshot-diff/ — that's where the
 * lib and node_modules live. This script imports via relative paths.
 */

// eslint-disable-next-line import/no-extraneous-dependencies
const { chromium, devices } = require('playwright');
// eslint-disable-next-line import/no-extraneous-dependencies
const { getComparator } = require('playwright-core/lib/utils');
const fs = require('fs');
const { takeTwo } = require('../../../tools/screenshot-diff/lib/take.js');
const { validatePath } = require('../../../tools/screenshot-diff/lib/utils.js');
const { uploadResultsDir } = require('../../../tools/screenshot-diff/lib/upload-s3.js');
const { loadSiteData } = require('../../../tools/screenshot-diff/lib/load-data.js');
const config = require('../../../tools/screenshot-diff/lib/config.js');

// All viewports run on Chromium. We still apply Playwright's iPad / iPhone
// `devices` preset (UA, viewport, isMobile, hasTouch, devicePixelRatio) so
// the page sees a mobile/tablet client and serves the right responsive
// layout — we just don't pay the WebKit engine's startup + per-capture
// overhead. BACOM team has run regression this way for 1+ year without
// missing real Safari-only bugs in practice.
const VIEWPORTS = {
  chrome: { engine: chromium, device: 'Desktop Chrome', viewport: { width: 1920, height: 1080 } },
  ipad: { engine: chromium, device: 'iPad Mini', viewport: null },
  iphone: { engine: chromium, device: 'iPhone X', viewport: null },
};

// Pixel comparator tolerance — matches nala/configs/visual.config.js
// (toHaveScreenshot.maxDiffPixelRatio: 0.2). Without these the comparator
// flags any single-pixel anti-aliasing variance as a diff, drowning real
// layout changes in noise.
const COMPARE_OPTS = {
  threshold: 0.2,           // per-pixel color tolerance (0 = strict, 1 = anything goes)
  maxDiffPixelRatio: 0.01,  // page-level: less than 1% pixels differ → not a diff
};

/**
 * Wait until the page is "settled" before taking the screenshot.
 *
 * Two strategies, opt-in per site via yaml `__config__.waitStrategy`:
 *
 *   'footer'   (default) — only wait for FEDS footer visibility.
 *                          Fast (~0 ms extra). Works for static pages
 *                          where the bulk of content is in the initial
 *                          HTML (BACOM marketing pages).
 *
 *   'scroll'             — footer + slow bottom-scroll + networkidle.
 *                          ~4 s slower per capture. Needed for pages
 *                          with Intersection-Observer-driven lazy
 *                          sections (graybox PoC customer-story cards,
 *                          data feeds, hero hydration).
 */
async function waitForPageReady(page, strategy) {
  // Always wait for footer (cheap, no-op for non-FEDS pages after 20 s)
  await page.locator('.feds-footer-privacyLink').first()
    .waitFor({ state: 'visible', timeout: 20_000 })
    .catch(() => {});

  if (strategy !== 'scroll') return;

  // Slow scroll wakes Intersection Observers across the whole page
  await page.evaluate(async () => {
    const step = 600;
    const delay = 100;
    let y = 0;
    const max = document.body.scrollHeight;
    while (y < max) {
      window.scrollTo(0, y);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, delay));
      y += step;
    }
    window.scrollTo(0, 0);
  });

  // Wait for any lazy AJAX/image fetches kicked off by the scroll
  await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
}

async function captureViewport(viewportName, urls, folderPath, milolibs, waitStrategy) {
  const preset = VIEWPORTS[viewportName];
  console.log(`\n▶ Viewport: ${viewportName} (${preset.device})  ·  wait: ${waitStrategy}`);
  const browser = await preset.engine.launch();
  const ctxOpts = devices[preset.device] ? { ...devices[preset.device] } : {};
  if (preset.viewport) ctxOpts.viewport = preset.viewport;
  // Honor prefers-reduced-motion so CSS animations / transitions don't
  // make the pixel diff race the carousel frame.
  ctxOpts.reducedMotion = 'reduce';
  const context = await browser.newContext(ctxOpts);
  const page = await context.newPage();

  // Clear cookies + storage to give A and B identical visitor state for
  // server-side personalization (rotating banners, A/B test bucketing,
  // sign-in promos). Without this, A's response cookies are sent on B's
  // request → different content → false-positive diff.
  const resetState = async () => {
    await context.clearCookies();
    await page.evaluate(() => {
      try { localStorage.clear(); sessionStorage.clear(); } catch (e) { /* opaque origin */ }
    }).catch(() => {});
  };

  // Smart query-string append: if url already has `?...`, use `&` to join.
  // Otherwise keep the leading `?` from milolibs.
  // Example: appendQuery('https://x.com/?mep=off', '?milolibs=stage')
  //   →     'https://x.com/?mep=off&milolibs=stage'  (not '...?mep=off?milolibs=stage')
  const appendQuery = (url, qs) => {
    if (!qs) return url;
    const stripped = qs.startsWith('?') ? qs.slice(1) : qs;
    if (!stripped) return url;
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}${stripped}`;
  };

  const results = {};
  for (const [key, value] of Object.entries(urls)) {
    // Two yaml formats:
    //   1. `key: 'https://url'`           → milolibs mode (A = url, B = url + MILO_LIBS)
    //   2. `key: { a: 'https://...', b: 'https://...' }` → explicit pair mode
    //      (e.g. graybox: aem.reviews preview vs business-graybox publish)
    const urlA = typeof value === 'string' ? value : value.a;
    const urlB = typeof value === 'string' ? appendQuery(value, milolibs) : value.b;
    const name = `${key}-${viewportName}`;
    console.log(`  [${name}] ${urlA}  vs  ${urlB}`);
    try {
      await resetState(); // before A's goto
      const result = await takeTwo(
        page,
        urlA, () => waitForPageReady(page, waitStrategy),
        urlB, () => waitForPageReady(page, waitStrategy),
        folderPath, name,
        { fullPage: true },
        resetState, // beforeBeta hook — reset between A capture and B goto
      );
      results[name] = [result];
    } catch (err) {
      console.warn(`  ⚠ ${name} failed: ${err.message}`);
      results[name] = [{ error: err.message }];
    }
  }
  await browser.close();
  return results;
}

function diffResults(folderPath, allResults, resultsFile) {
  console.log('\n▶ Computing pixel diffs');
  const comparator = getComparator('image/png');
  const diffed = {};

  for (const [key, entries] of Object.entries(allResults)) {
    diffed[key] = entries.map((entry) => {
      if (entry.error || !entry.a || !entry.b) return entry;
      try {
        const a = fs.readFileSync(validatePath(entry.a));
        const b = fs.readFileSync(validatePath(entry.b));
        const diff = comparator(a, b, COMPARE_OPTS);
        if (diff) {
          const diffName = entry.b.replace('.png', '-diff.png');
          fs.writeFileSync(validatePath(diffName, { forWriting: true }), diff.diff);
          return { ...entry, diff: diffName };
        }
        return entry;
      } catch (err) {
        console.warn(`  ⚠ diff failed for ${key}: ${err.message}`);
        return entry;
      }
    });
  }

  const resultsPath = `${folderPath}/${resultsFile}`;
  fs.writeFileSync(
    validatePath(resultsPath, { forWriting: true }),
    JSON.stringify(diffed, null, 2),
  );
  console.log(`  Wrote ${resultsPath}`);
  return diffed;
}

async function main() {
  const site = process.env.SITE;
  if (!site) {
    console.error('SITE env var is required (e.g. SITE=bacom)');
    process.exit(1);
  }

  const milolibs = process.env.MILO_LIBS || '?milolibs=stage';
  const viewports = (process.env.VIEWPORTS || 'chrome').split(',').filter(Boolean);
  const invalid = viewports.filter((v) => !VIEWPORTS[v]);
  if (invalid.length) {
    console.error(`Unknown viewport(s): ${invalid.join(', ')}. Valid: ${Object.keys(VIEWPORTS).join(', ')}`);
    process.exit(1);
  }

  // Page list comes from the SharePoint-published sheet when reachable, otherwise
  // the committed local sot.<site>.yml. See tools/screenshot-diff/lib/load-data.js.
  const raw = await loadSiteData(site, { dir: __dirname });
  // `__config__` is a reserved top-level key for per-site options.
  // Everything else is a URL entry.
  const yamlConfig = raw.__config__ || {};
  const allEntries = Object.entries(raw).filter(([k]) => !k.startsWith('__'));
  // Resolution order: WAIT_STRATEGY env > yaml __config__.waitStrategy > 'footer'
  const waitStrategy = process.env.WAIT_STRATEGY || yamlConfig.waitStrategy || 'footer';

  // SHARD env (e.g. "1/2") splits the URL list across matrix jobs. Each
  // shard gets a contiguous slice. Default "1/1" → no split.
  const shardSpec = process.env.SHARD || '1/1';
  const [shardIdx, shardTotal] = shardSpec.split('/').map(Number);
  if (!Number.isInteger(shardIdx) || !Number.isInteger(shardTotal) || shardTotal < 1 || shardIdx < 1 || shardIdx > shardTotal) {
    console.error(`Invalid SHARD='${shardSpec}'. Use 'X/Y' with 1 ≤ X ≤ Y.`);
    process.exit(1);
  }
  const sliceFrom = Math.floor((shardIdx - 1) * allEntries.length / shardTotal);
  const sliceTo = Math.floor(shardIdx * allEntries.length / shardTotal);
  const urls = Object.fromEntries(allEntries.slice(sliceFrom, sliceTo));

  console.log(`▶ Site: ${site}  ·  URLs: ${Object.keys(urls).length}/${allEntries.length} (shard ${shardSpec}, slice [${sliceFrom},${sliceTo}))  ·  Viewports: ${viewports.join(',')}`);
  console.log(`▶ MILO_LIBS: ${milolibs}  ·  wait: ${waitStrategy}`);

  // SHARD_NAME enables parallel-matrix mode: each matrix job writes its
  // own results-<shard>.json so they don't overwrite each other on S3.
  // A fan-in merge job later consolidates them into results.json.
  const shard = process.env.SHARD_NAME;
  const resultsFile = shard ? `results-${shard}.json` : 'results.json';
  const timestampType = shard ? `-${shard}` : '';

  const folderPath = `${config.baseDir}/${site}`;
  validatePath(`${folderPath}/.touch`, { forWriting: true });

  const allResults = {};
  for (const vp of viewports) {
    const vpResults = await captureViewport(vp, urls, folderPath, milolibs, waitStrategy);
    Object.assign(allResults, vpResults);
  }

  const diffed = diffResults(folderPath, allResults, resultsFile);

  if (config.s3.accessKeyId && config.s3.secretAccessKey) {
    console.log(`\n▶ Uploading to ${config.s3.endpoint}/${config.s3.bucket}/${folderPath}/`);
    await uploadResultsDir(folderPath, { resultsFile, type: timestampType });
    console.log('✓ Uploaded');
  } else {
    console.log('\n⚠ Skipping S3 upload (S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY not set)');
  }

  const diffCount = Object.values(diffed).flat().filter((e) => e.diff).length;
  console.log(`\n✓ Done.  Captures: ${Object.keys(diffed).length}  ·  With diffs: ${diffCount}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
