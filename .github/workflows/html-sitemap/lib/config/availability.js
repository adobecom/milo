import fs from 'node:fs/promises';
import path from 'node:path';
import { getBaseGeoDir, getBaseGeoExtractDir, pathExists } from '../util/files.js';

/**
 * @typedef {import('./scope.js').ExtractUnit} ExtractUnit
 */

/**
 * @param {string} subdomain
 * @param {string} baseGeo
 * @returns {string}
 */
export function makeBaseGeoKey(subdomain, baseGeo) {
  return `${subdomain}:${baseGeo}`;
}

/**
 * @param {string} outputDir
 * @param {string} subdomain
 * @param {string} baseGeo
 * @returns {Promise<boolean>}
 */
export async function hasSitemapDataDocument(
  outputDir,
  subdomain,
  baseGeo,
) {
  return pathExists(path.join(getBaseGeoDir(outputDir, subdomain, baseGeo), 'sitemap.json'));
}

/**
 * @param {string} outputDir
 * @param {string} subdomain
 * @param {string} baseGeo
 * @returns {Promise<boolean>}
 */
export async function hasExtractedInput(
  outputDir,
  subdomain,
  baseGeo,
) {
  try {
    const extractDir = getBaseGeoExtractDir(outputDir, subdomain, baseGeo);
    const entries = await fs.readdir(extractDir, { withFileTypes: true });
    const siteDirs = entries.filter(
      (entry) => entry.isDirectory() && entry.name !== 'gnav' && entry.name !== 'extended',
    );
    const checks = await Promise.all(
      siteDirs.map((entry) => pathExists(path.join(extractDir, entry.name, 'query-index.json'))),
    );
    return checks.some(Boolean);
  } catch {
    return false;
  }
}

/**
 * @param {string} outputDir
 * @param {Pick<ExtractUnit, 'subdomain' | 'baseGeo'>[]} units
 * @returns {Promise<Set<string>>}
 */
export async function collectTransformableBaseGeos(
  outputDir,
  units,
) {
  const results = await Promise.all(units.map(async (unit) => ({
    key: makeBaseGeoKey(unit.subdomain, unit.baseGeo),
    transformable: await hasExtractedInput(outputDir, unit.subdomain, unit.baseGeo),
  })));

  return new Set(
    results
      .filter((entry) => entry.transformable)
      .map((entry) => entry.key),
  );
}
