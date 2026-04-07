import fs from 'node:fs/promises';
import path from 'node:path';
import { getBaseGeoDir, getBaseGeoExtractDir, pathExists } from '../files.ts';
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
    const siteDirs = await fs.readdir(getBaseGeoExtractDir(outputDir, subdomain, baseGeo));
    return siteDirs.some((entry) => entry !== 'gnav' && entry !== 'extended' && !entry.endsWith('.json'));
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
