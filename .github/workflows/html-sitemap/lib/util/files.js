import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * @param {string} outputDir
 * @param {string} subdomain
 * @param {string} baseGeo
 * @returns {string}
 */
export function getBaseGeoDir(outputDir, subdomain, baseGeo) {
  return baseGeo ? path.join(outputDir, subdomain, baseGeo) : path.join(outputDir, subdomain);
}

/**
 * @param {string} outputDir
 * @param {string} subdomain
 * @param {string} baseGeo
 * @returns {string}
 */
export function getBaseGeoExtractDir(outputDir, subdomain, baseGeo) {
  return path.join(getBaseGeoDir(outputDir, subdomain, baseGeo), '_extract');
}

/**
 * @param {string} outputDir
 * @param {string} subdomain
 * @param {string} baseGeo
 * @returns {string}
 */
export function getBaseGeoRegionsFile(outputDir, subdomain, baseGeo) {
  return path.join(getBaseGeoExtractDir(outputDir, subdomain, baseGeo), 'regions.html');
}

/**
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
 * @param {string} outputDir
 * @param {string} subdomain
 * @param {string} baseGeo
 * @returns {string}
 */
export function getBaseGeoDataFile(outputDir, subdomain, baseGeo) {
  return path.join(getBaseGeoDir(outputDir, subdomain, baseGeo), 'sitemap.json');
}

/**
 * @param {string} outputDir
 * @param {string} subdomain
 * @param {string} baseGeo
 * @returns {string}
 */
export function getBaseGeoHtmlFile(outputDir, subdomain, baseGeo) {
  return path.join(getBaseGeoDir(outputDir, subdomain, baseGeo), 'sitemap.html');
}

/**
 * @param {string} outputDir
 * @param {string} subdomain
 * @returns {string}
 */
export function getSubdomainManifestJsonFile(outputDir, subdomain) {
  return path.join(outputDir, subdomain, 'manifest.json');
}

/**
 * @param {string} outputDir
 * @param {string} subdomain
 * @returns {string}
 */
export function getSubdomainManifestCsvFile(outputDir, subdomain) {
  return path.join(outputDir, subdomain, 'manifest.csv');
}

/**
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
 * @param {string} dirPath
 * @returns {Promise<void>}
 */
export async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

/**
 * @param {string} filePath
 * @param {unknown} data
 * @returns {Promise<void>}
 */
export async function writeJson(filePath, data) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

/**
 * @param {string} filePath
 * @param {string} text
 * @returns {Promise<void>}
 */
export async function writeText(filePath, text) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, text, 'utf8');
}
