/* eslint-disable no-console */
/**
 * Per-site page-list loader for the screenshot-diff runner.
 *
 * Prefers the list published from SharePoint as JSON (Helix "publish as JSON"),
 * so changing which pages run needs no code commit; falls back to the committed
 * local `sot.<site>.yml` when the sheet is missing, unpublished or unreachable.
 *
 * Both sources resolve to the same object shape `yaml.load` produced, so the
 * runner is unchanged downstream:
 *   { __config__?: { waitStrategy }, '<key>': '<url>' | { a, b }, ... }
 *
 * Sheet columns (case-insensitive headers): key | a | b | waitStrategy
 *   - milolibs mode : key + a           (b blank)      -> value is the `a` string
 *   - explicit pair : key + a + b                      -> value is { a, b }
 *   - site config   : key '__config__' + waitStrategy  -> { __config__: { waitStrategy } }
 */
const https = require('https');
const fs = require('fs');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const yaml = require('js-yaml');
const config = require('./config.js');

// GET + parse JSON over https. Works on node 14 -> 25 (no global fetch needed).
function fetchJson(url, timeoutMs, redirectsLeft) {
  const left = redirectsLeft === undefined ? 5 : redirectsLeft;
  return new Promise((resolve, reject) => {
    const reqOpts = { timeout: timeoutMs, headers: { accept: 'application/json,*/*' } };
    const req = https.get(url, reqOpts, (res) => {
      const { statusCode, headers } = res;
      if ([301, 302, 303, 307, 308].includes(statusCode) && headers.location && left > 0) {
        res.resume();
        fetchJson(new URL(headers.location, url).href, timeoutMs, left - 1).then(resolve, reject);
        return;
      }
      if (statusCode !== 200) {
        res.resume();
        reject(new Error(`HTTP ${statusCode}`));
        return;
      }
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error('invalid JSON'));
        }
      });
    });
    req.on('timeout', () => req.destroy(new Error(`timeout after ${timeoutMs}ms`)));
    req.on('error', reject);
  });
}

// Pull the row array from a Helix sheet JSON (single-sheet or multi-sheet workbook).
function extractRows(json, sheetName) {
  if (json && json[':type'] === 'multi-sheet') {
    const names = json[':names'] || [];
    const sheet = json[sheetName || names[0]];
    return sheet && Array.isArray(sheet.data) ? sheet.data : [];
  }
  return json && Array.isArray(json.data) ? json.data : [];
}

// Case-insensitive column read; an empty/whitespace cell is treated as absent.
function col(row, name) {
  const key = Object.keys(row).find((k) => k.trim().toLowerCase() === name);
  const value = key === undefined ? '' : row[key];
  return value === null || value === undefined ? '' : String(value).trim();
}

// Convert sheet rows to the object shape produced by `yaml.load(sot.<site>.yml)`.
function rowsToSiteData(rows) {
  const out = {};
  rows.forEach((row) => {
    const key = col(row, 'key');
    if (!key) return;
    if (key.startsWith('__')) {
      const cfg = {};
      const waitStrategy = col(row, 'waitstrategy');
      if (waitStrategy) cfg.waitStrategy = waitStrategy;
      out[key] = cfg;
      return;
    }
    const a = col(row, 'a') || col(row, 'url');
    const b = col(row, 'b');
    if (a || b) out[key] = b ? { a, b } : a;
  });
  return out;
}

// Load a site's page list: published sheet first, committed local yml as fallback.
async function loadSiteData(site, options) {
  const opts = options || {};
  const base = opts.baseUrl || config.dataBaseUrl;
  const prefix = opts.pathPrefix || config.dataPathPrefix;
  const url = `${base}${prefix}/${site}.json`;
  try {
    const json = await fetchJson(url, opts.timeoutMs || 15000);
    const data = rowsToSiteData(extractRows(json, opts.sheet));
    const count = Object.keys(data).filter((k) => !k.startsWith('__')).length;
    if (count > 0) {
      console.log(`▶ Page list: ${count} URLs from published sheet ${url}`);
      return data;
    }
    console.warn(`⚠ Published sheet ${url} had no usable rows — using local yml`);
  } catch (err) {
    console.warn(`⚠ Could not read published sheet ${url} (${err.message}) — using local yml`);
  }
  const localPath = path.join(opts.dir || __dirname, `sot.${site}.yml`);
  if (!fs.existsSync(localPath)) {
    throw new Error(`No published sheet and no local data file at ${localPath}`);
  }
  console.log(`▶ Page list: local ${localPath}`);
  return yaml.load(fs.readFileSync(localPath, 'utf8'));
}

module.exports = { loadSiteData, rowsToSiteData, extractRows, fetchJson };
