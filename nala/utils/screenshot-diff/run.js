/**
 * Standalone driver for the screenshot-diff tool.
 *
 * Takes two URLs and a viewport, captures both with Playwright, computes a
 * pixel diff, and uploads the artifacts to S3. Designed to be invoked from
 * the GitHub Actions workflow with inputs forwarded as env vars.
 *
 * Required env vars:
 *   URL_A      — Stable URL
 *   URL_B      — Beta URL
 *
 * Optional env vars:
 *   PROJECT    — Subfolder name in S3 (default: 'adhoc')
 *   VIEWPORT   — chrome | ipad | iphone (default: 'chrome')
 *   FULL_PAGE  — 'true' (default) to capture full scroll height, 'false' for viewport
 *
 * For S3 upload also set:
 *   S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY (see lib/config.js for full list)
 */

// eslint-disable-next-line import/no-extraneous-dependencies
const { chromium, devices } = require('playwright');
// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions
const { getComparator } = require('playwright-core/lib/utils');
const fs = require('fs');
const { takeTwo } = require('./lib/take.js');
const { validatePath } = require('./lib/utils.js');
const { uploadResultsDir } = require('./lib/upload-s3.js');
const config = require('./lib/config.js');

// All viewports run on Chromium with Playwright's iPad/iPhone device
// presets (viewport, UA, isMobile, hasTouch, deviceScaleFactor). See
// nala/features/visual/sot.run.js for rationale.
const VIEWPORTS = {
  chrome: { engine: chromium, device: 'Desktop Chrome', viewport: { width: 1920, height: 1080 } },
  ipad: { engine: chromium, device: 'iPad Mini', viewport: null },
  iphone: { engine: chromium, device: 'iPhone X', viewport: null },
};

async function run() {
  const urlA = process.env.URL_A;
  const urlB = process.env.URL_B;
  const project = process.env.PROJECT || 'adhoc';
  const viewportName = process.env.VIEWPORT || 'chrome';
  const fullPage = process.env.FULL_PAGE !== 'false';

  if (!urlA || !urlB) {
    console.error('Missing URL_A or URL_B. Both are required.');
    process.exit(1);
  }

  const preset = VIEWPORTS[viewportName];
  if (!preset) {
    console.error(
      `Unknown VIEWPORT '${viewportName}'. Use one of: ${Object.keys(VIEWPORTS).join(', ')}`,
    );
    process.exit(1);
  }

  const folderPath = `${config.baseDir}/${project}`;
  // Ensure the folder exists; validatePath with forWriting creates parents.
  validatePath(`${folderPath}/.touch`, { forWriting: true });

  console.log(`▶ Launching ${preset.device} (${viewportName})`);
  const browser = await preset.engine.launch();
  const contextOptions = devices[preset.device] ? { ...devices[preset.device] } : {};
  if (preset.viewport) contextOptions.viewport = preset.viewport;
  // prefers-reduced-motion stops CSS animations / carousels from frame-
  // racing the screenshot capture.
  contextOptions.reducedMotion = 'reduce';
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();

  console.log(`▶ Capturing A: ${urlA}`);
  console.log(`▶ Capturing B: ${urlB}`);

  const result = await takeTwo(
    page,
    urlA,
    null,
    urlB,
    null,
    folderPath,
    'shot',
    { fullPage },
  );

  await browser.close();

  // Pixel diff (with nala-matching tolerances to skip anti-aliasing noise)
  console.log('▶ Comparing pixels');
  const comparator = getComparator('image/png');
  const aBuf = fs.readFileSync(validatePath(result.a));
  const bBuf = fs.readFileSync(validatePath(result.b));
  const diffImage = comparator(aBuf, bBuf, { threshold: 0.2, maxDiffPixelRatio: 0.01 });

  if (diffImage) {
    const diffPath = `${folderPath}/shot-diff.png`;
    fs.writeFileSync(validatePath(diffPath, { forWriting: true }), diffImage.diff);
    result.diff = diffPath;
    console.log('  → Differences found');
  } else {
    console.log('  → Pixel-perfect match');
  }

  // Build results.json (compatible with existing UI/lib schema)
  const key = `${urlA} vs ${urlB} (${viewportName})`;
  const results = { [key]: [{ ...result, viewport: viewportName }] };
  const resultsPath = `${folderPath}/results.json`;
  fs.writeFileSync(
    validatePath(resultsPath, { forWriting: true }),
    JSON.stringify(results, null, 2),
  );
  console.log(`▶ Wrote ${resultsPath}`);

  // Upload to S3 if credentials present
  if (config.s3.accessKeyId && config.s3.secretAccessKey) {
    console.log(`▶ Uploading to ${config.s3.endpoint}/${config.s3.bucket}/${folderPath}/`);
    await uploadResultsDir(folderPath);
    console.log('✓ Uploaded');
  } else {
    console.log('⚠ Skipping S3 upload (S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY not set)');
  }

  console.log(`\n✓ Done. ${result.diff ? 'DIFF' : 'MATCH'}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
