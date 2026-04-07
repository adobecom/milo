import fs from 'node:fs/promises';
import path from 'node:path';
import { getBaseGeoDir, getBaseGeoExtractDir, pathExists } from '../util/files.ts';
import type { ExtractUnit } from './scope.ts';

export function makeBaseGeoKey(subdomain: string, baseGeo: string): string {
  return `${subdomain}:${baseGeo}`;
}

export async function hasSitemapDataDocument(
  outputDir: string,
  subdomain: string,
  baseGeo: string,
): Promise<boolean> {
  return pathExists(path.join(getBaseGeoDir(outputDir, subdomain, baseGeo), 'sitemap.json'));
}

export async function hasExtractedInput(
  outputDir: string,
  subdomain: string,
  baseGeo: string,
): Promise<boolean> {
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

export async function collectTransformableBaseGeos(
  outputDir: string,
  units: Pick<ExtractUnit, 'subdomain' | 'baseGeo'>[],
): Promise<Set<string>> {
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
