/**
 * Centralized config for screenshot-diff tool.
 * All values are overridable via environment variables.
 */

module.exports = {
  s3: {
    region: process.env.S3_REGION || 'us-west-1',
    endpoint: process.env.S3_ENDPOINT || 'https://s3-sj3.corp.adobe.com',
    bucket: process.env.S3_BUCKET || 'milo',
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  // Base URL for reading published artifacts (used by compare to fetch the
  // baseline image). Defaults to the public read path of the configured bucket.
  publicReadUrl:
    process.env.S3_PUBLIC_READ_URL
    || `${process.env.S3_ENDPOINT || 'https://s3-sj3.corp.adobe.com'}/${process.env.S3_BUCKET || 'milo'}`,
  // Path traversal guard. Only paths under this directory are accepted by
  // utils.validatePath.
  baseDir: process.env.SCREENSHOT_BASE_DIR || 'screenshots',
  // Per-site page lists published from SharePoint as JSON (Helix "publish as JSON"),
  // read by lib/load-data.js. milo.adobe.com is the public origin that serves
  // published drafts; *.hlx.live / *.aem.page are not reliably reachable from CI.
  dataBaseUrl: process.env.SCREENSHOT_DATA_BASE_URL || 'https://milo.adobe.com',
  dataPathPrefix: process.env.SCREENSHOT_DATA_PATH_PREFIX || '/drafts/nala/screenshotdiff/data',
};
