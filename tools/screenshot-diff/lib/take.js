/**
 * Take a screenshot of the current page (no navigation).
 * @param {Page} page - Playwright Page object
 * @param {string} folderPath - Folder to save the screenshot, e.g. screenshots/milo
 * @param {string} fileName - File name (without extension)
 * @param {object} options - Playwright screenshot options. `selector` (optional)
 *   restricts capture to a single locator.
 * @returns {{a: string, urls: string}} The local path and the source URL
 */
async function take(page, folderPath, fileName, options = {}) {
  const urls = [];
  const result = {};
  const name = `${folderPath}/${fileName}.png`;
  urls.push(page.url());
  options.path = name;
  if (options.selector) {
    await page.locator(options.selector).screenshot(options);
  } else {
    await page.screenshot(options);
  }
  result.a = name;
  result.urls = urls.join(' | ');
  return result;
}

/**
 * Navigate to a URL and capture a single screenshot.
 * @param {Page} page
 * @param {string} url
 * @param {Function} [callback] - Optional setup hook executed after navigation
 *   and before capture (e.g. dismiss cookie banner)
 * @param {string} folderPath
 * @param {string} fileName
 * @param {object} options - Playwright screenshot options
 * @returns {{order: number, a: string, urls: string}}
 */
async function takeOne(page, url, callback, folderPath, fileName, options = {}) {
  const urls = [];
  const result = {};

  console.info(`[Test Page]: ${url}`);
  await page.goto(url);
  urls.push(url);
  if (typeof callback === 'function') { await callback(); }
  const name = `${folderPath}/${fileName}.png`;
  options.path = name;
  if (options.selector) {
    await page.locator(options.selector).screenshot(options);
  } else {
    await page.screenshot(options);
  }

  result.order = 1;
  result.a = name;
  result.urls = urls.join(' | ');
  return result;
}

/**
 * Capture two pages (stable + beta) for side-by-side diff.
 * Files are written as `${fileName}-a.png` and `${fileName}-b.png`.
 * @param {Page} page
 * @param {string} urlStable
 * @param {Function} [callbackStable]
 * @param {string} urlBeta
 * @param {Function} [callbackBeta]
 * @param {string} folderPath
 * @param {string} fileName
 * @param {object} options - Playwright screenshot options
 * @returns {{order: number, a: string, b: string, urls: string}}
 */
async function takeTwo(
  page,
  urlStable,
  callbackStable,
  urlBeta,
  callbackBeta,
  folderPath,
  fileName,
  options = {},
  beforeBeta,
) {
  const urls = [];
  const result = {};

  console.info(`[Test Page]: ${urlStable}`);
  await page.goto(urlStable);
  urls.push(urlStable);
  if (typeof callbackStable === 'function') { await callbackStable(); }
  const nameStable = `${folderPath}/${fileName}-a.png`;
  options.path = nameStable;
  if (options.selector) {
    await page.locator(options.selector).screenshot(options);
  } else {
    await page.screenshot(options);
  }
  result.order = 1;
  result.a = nameStable;

  // Optional hook to reset state (clear cookies / storage) before B's goto,
  // so server-side personalization doesn't carry over from A's response.
  if (typeof beforeBeta === 'function') { await beforeBeta(); }

  console.info(`[Test Page]: ${urlBeta}`);
  await page.goto(urlBeta);
  urls.push(urlBeta);
  if (typeof callbackBeta === 'function') { await callbackBeta(); }
  const nameBeta = `${folderPath}/${fileName}-b.png`;
  options.path = nameBeta;
  if (options.selector) {
    await page.locator(options.selector).screenshot(options);
  } else {
    await page.screenshot(options);
  }

  result.b = nameBeta;
  result.urls = urls.join(' | ');
  return result;
}

module.exports = { take, takeOne, takeTwo };
