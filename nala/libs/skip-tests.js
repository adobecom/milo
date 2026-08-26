/**
 * Returns Playwright test files to skip for a given browser.
 *
 * Supported repository variable formats:
 *   NALA_BROWSER_SKIP=actionitem
 *   NALA_BROWSER_SKIP=actionitem:chromium
 *   NALA_BROWSER_SKIP=actionitem;aside:webkit
 *
 * Supported PR labels:
 *   skip-actionitem
 *   skip-actionitem-chromium
 *   skip-aside-webkit
 *
 * Examples:
 *   actionitem                -> skip on all browsers
 *   actionitem:chromium       -> skip only on Chromium
 *   skip-actionitem           -> skip on all browsers
 *   skip-actionitem-webkit    -> skip only on WebKit
 *
 * @param {string} browser Browser name (chromium|firefox|webkit)
 * @returns {string[]} Playwright testIgnore file patterns
 */
function getSkipTestFiles(browser) {
  const skipEntries = [];

  // Repository-level skip configuration
  if (process.env.NALA_BROWSER_SKIP) {
    skipEntries.push(
      ...process.env.NALA_BROWSER_SKIP
        .split(';')
        .map((entry) => entry.trim())
        .filter(Boolean),
    );
  }

  // PR labels:
  //   skip-actionitem
  //   skip-actionitem-chromium
  if (process.env.labels) {
    skipEntries.push(
      ...process.env.labels
        .split(' ')
        .filter((label) => label.startsWith('skip-'))
        .map((label) => label.replace(/^skip-/, '')),
    );
  }

  const skipFiles = [];

  skipEntries.forEach((entry) => {
    // Skip on all browsers
    // Example: actionitem
    if (!entry.includes(':') && !entry.includes('-')) {
      skipFiles.push(`**/${entry}.test.js`);
      return;
    }

    // Skip on a specific browser
    // Example: actionitem:chromium
    if (entry.includes(':')) {
      const [block, targetBrowser] = entry.split(':');

      if (targetBrowser === browser) {
        skipFiles.push(`**/${block}.test.js`);
      }

      return;
    }

    // Browser-specific PR label
    // Example: actionitem-chromium
    const match = entry.match(/^(.*)-(chromium|firefox|webkit)$/);

    if (match) {
      const [, block, targetBrowser] = match;

      if (targetBrowser === browser) {
        skipFiles.push(`**/${block}.test.js`);
      }

      return;
    }

    // All-browser PR label
    // Example: actionitem
    skipFiles.push(`**/${entry}.test.js`);
  });

  const uniqueSkipFiles = [...new Set(skipFiles)];

  if (uniqueSkipFiles.length) {
    console.info(
      `[NALA Skip][${browser}] ${uniqueSkipFiles.join(', ')}`,
    );
  }

  return uniqueSkipFiles;
}

module.exports = { getSkipTestFiles };
