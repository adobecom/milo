/**
 * Filesystem path helpers for the pipeline's local output tree.
 *
 * Output layout (rooted at `outputDir`):
 *   <outputDir>/<subdomain>/<baseGeo>/
 *     ├── sitemap.json, sitemap.html, sitemap-links.csv
 *     └── _extract/                     ← intermediate inputs
 *         └── extended/<extendedGeo>/
 *
 * Plus per-subdomain manifests at `<outputDir>/<subdomain>/manifest.{json,csv}`.
 */

import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Directory holding all artifacts for a base geo (default geo when empty).
 * @param {string} outputDir
 * @param {string} subdomain
 * @param {string} baseGeo
 * @returns {string}
 */
export function getBaseGeoDir(outputDir, subdomain, baseGeo) {
  return baseGeo ? path.join(outputDir, subdomain, baseGeo) : path.join(outputDir, subdomain);
}

/**
 * Directory holding intermediate extracted inputs for a base geo.
 * @param {string} outputDir
 * @param {string} subdomain
 * @param {string} baseGeo
 * @returns {string}
 */
export function getBaseGeoExtractDir(outputDir, subdomain, baseGeo) {
  return path.join(getBaseGeoDir(outputDir, subdomain, baseGeo), '_extract');
}

/**
 * Directory holding extracted inputs for an extended geo nested under its
 * owning base geo.
 * @param {string} outputDir
 * @param {string} subdomain
 * @param {string} baseGeo
 * @param {string} extendedGeo
 * @returns {string}
 */
export function getExtendedGeoDir(outputDir, subdomain, baseGeo, extendedGeo) {
  return path.join(getBaseGeoExtractDir(outputDir, subdomain, baseGeo), 'extended', extendedGeo);
}

/**
 * Path to the base geo's normalized sitemap data (`sitemap.json`).
 * @param {string} outputDir
 * @param {string} subdomain
 * @param {string} baseGeo
 * @returns {string}
 */
export function getBaseGeoDataFile(outputDir, subdomain, baseGeo) {
  return path.join(getBaseGeoDir(outputDir, subdomain, baseGeo), 'sitemap.json');
}

/**
 * Path to the base geo's rendered sitemap (`sitemap.html`).
 * @param {string} outputDir
 * @param {string} subdomain
 * @param {string} baseGeo
 * @returns {string}
 */
export function getBaseGeoHtmlFile(outputDir, subdomain, baseGeo) {
  return path.join(getBaseGeoDir(outputDir, subdomain, baseGeo), 'sitemap.html');
}

/**
 * Path to the base geo's flattened links CSV (`sitemap-links.csv`).
 * @param {string} outputDir
 * @param {string} subdomain
 * @param {string} baseGeo
 * @returns {string}
 */
export function getBaseGeoSitemapLinksFile(outputDir, subdomain, baseGeo) {
  return path.join(getBaseGeoDir(outputDir, subdomain, baseGeo), 'sitemap-links.csv');
}

/**
 * Path to the subdomain-level manifest in JSON form.
 * @param {string} outputDir
 * @param {string} subdomain
 * @returns {string}
 */
export function getSubdomainManifestJsonFile(outputDir, subdomain) {
  return path.join(outputDir, subdomain, 'manifest.json');
}

/**
 * Path to the subdomain-level manifest in CSV form.
 * @param {string} outputDir
 * @param {string} subdomain
 * @returns {string}
 */
export function getSubdomainManifestCsvFile(outputDir, subdomain) {
  return path.join(outputDir, subdomain, 'manifest.csv');
}

/**
 * True if the given filesystem path exists (file or directory).
 * @param {string} filePath
 * @returns {Promise<boolean>}
 */
export async function pathExists(filePath) {
  try {
    await fs.stat(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Recursive `mkdir -p`.
 * @param {string} dirPath
 * @returns {Promise<void>}
 */
export async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

/**
 * Write a value as pretty-printed JSON, creating parent directories as needed.
 * @param {string} filePath
 * @param {unknown} data
 * @returns {Promise<void>}
 */
export async function writeJson(filePath, data) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

/**
 * Write a UTF-8 text file, creating parent directories as needed.
 * @param {string} filePath
 * @param {string} text
 * @returns {Promise<void>}
 */
export async function writeText(filePath, text) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, text, 'utf8');
}
