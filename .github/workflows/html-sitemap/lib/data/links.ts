import fs from 'node:fs/promises';
import path from 'node:path';
import {
  formatGeoLabelFromInventory,
  normalizeQueryIndexData,
  type GeoLabelInventoryEntry,
  type NormalizedLink,
} from './normalize.ts';
import { relevantExtendedGeos, type ExtractUnit } from '../config/scope.ts';
import type { HtmlSitemapConfig } from '../config/config.ts';
import { getBaseGeoExtractDir, getExtendedGeoDir } from '../util/files.ts';
import type { RegionLabelMap } from '../sources/regions.ts';

export type OtherSitemapLink = {
  geo: string;
  title: string;
  url: string;
};

export type ExtendedGeoGroup = {
  geo: string;
  title: string;
  links: NormalizedLink[];
};

function buildGeoLabelInventory(config: HtmlSitemapConfig, subdomain: string): GeoLabelInventoryEntry[] {
  const entries = new Map<string, GeoLabelInventoryEntry>();

  for (const row of config.geoMap.filter((entry) => entry.subdomain === subdomain)) {
    if (!entries.has(row.baseGeo)) {
      entries.set(row.baseGeo, { geo: row.baseGeo, language: row.language });
    }

    for (const extendedGeo of row.extendedGeos) {
      if (!entries.has(extendedGeo)) {
        const [, extendedLanguage] = extendedGeo.split('_');
        entries.set(extendedGeo, {
          geo: extendedGeo,
          language: extendedLanguage || row.language,
        });
      }
    }
  }

  return [...entries.values()];
}

function normalizeRegionLabel(
  _geo: string,
  label: string,
  _inventory: GeoLabelInventoryEntry[],
): string {
  const normalized = label.replace(/\s+/g, ' ').trim();
  return normalized.replace(/\s+-\s+.+$/u, '').trim();
}

function resolveGeoLabel(
  geo: string,
  inventory: GeoLabelInventoryEntry[],
  regionLabels: RegionLabelMap,
): string {
  if (!geo) return 'Global';
  const regionLabel = regionLabels[geo];
  if (regionLabel) return normalizeRegionLabel(geo, regionLabel, inventory);
  return formatGeoLabelFromInventory(geo, inventory);
}

function canonicalizePathForGeo(pathname: string, geo: string): string {
  if (!geo) return pathname;
  const prefix = `/${geo}`;
  if (pathname === prefix) return '/';
  if (pathname.startsWith(`${prefix}/`)) {
    return pathname.slice(prefix.length) || '/';
  }
  return pathname;
}

function sitemapUrl(domain: string, geo: string): string {
  const prefix = geo ? `/${geo}` : '';
  return `https://${domain}${prefix}/sitemap.html`;
}

export function buildOtherSitemapLinks(
  config: HtmlSitemapConfig,
  unit: ExtractUnit,
  regionLabels: RegionLabelMap,
): OtherSitemapLink[] {
  const geoLabelInventory = buildGeoLabelInventory(config, unit.subdomain);
  return config.geoMap
    .filter((row) => row.subdomain === unit.subdomain)
    .filter((row) => row.baseGeo !== unit.baseGeo)
    .filter((row) => row.deploy)
    .map((row) => ({
      geo: row.baseGeo,
      title: resolveGeoLabel(row.baseGeo, geoLabelInventory, regionLabels),
      url: sitemapUrl(unit.domain, row.baseGeo),
    }));
}

async function loadExtendedQueryIndexLinks(
  outputDir: string,
  config: HtmlSitemapConfig,
  unit: ExtractUnit,
  geo: string,
): Promise<NormalizedLink[]> {
  const siteDirs = await fs.readdir(getExtendedGeoDir(outputDir, unit.subdomain, unit.baseGeo, geo)).catch(() => []);
  const links = await Promise.all(siteDirs.map(async (siteDir) => {
    const json = JSON.parse(await fs.readFile(path.join(getExtendedGeoDir(outputDir, unit.subdomain, unit.baseGeo, geo), siteDir, 'query-index.json'), 'utf8'));
    return normalizeQueryIndexData(json, unit.domain, config.siteDomains);
  }));
  return links.flat();
}

export async function buildExtendedGeoLinks(
  outputDir: string,
  config: HtmlSitemapConfig,
  unit: ExtractUnit,
  regionLabels: RegionLabelMap,
): Promise<ExtendedGeoGroup[]> {
  const geoLabelInventory = buildGeoLabelInventory(config, unit.subdomain);
  const baseExtractDir = getBaseGeoExtractDir(outputDir, unit.subdomain, unit.baseGeo);
  const baseSiteDirs = await fs.readdir(baseExtractDir).catch(() => []);
  const basePaths = new Set<string>();

  await Promise.all(baseSiteDirs
    .filter((entry) => entry !== 'gnav' && entry !== 'extended' && !entry.endsWith('.json') && !entry.endsWith('.html'))
    .map(async (siteDir) => {
      const json = JSON.parse(await fs.readFile(path.join(baseExtractDir, siteDir, 'query-index.json'), 'utf8'));
      normalizeQueryIndexData(json, unit.domain, config.siteDomains)
        .forEach((link) => basePaths.add(canonicalizePathForGeo(link.path, unit.baseGeo)));
    }));

  const groups = await Promise.all(
    relevantExtendedGeos(config, unit).map(async (geo): Promise<ExtendedGeoGroup | null> => {
      const links = await loadExtendedQueryIndexLinks(outputDir, config, unit, geo);
      const seen = new Set<string>();
      const deduped = links.filter((link) => {
        const canonicalPath = canonicalizePathForGeo(link.path, geo);
        if (basePaths.has(canonicalPath) || seen.has(canonicalPath)) return false;
        seen.add(canonicalPath);
        return true;
      });
      if (!deduped.length) return null;
      return {
        geo,
        title: resolveGeoLabel(geo, geoLabelInventory, regionLabels),
        links: deduped,
      };
    }),
  );

  return groups.filter(Boolean) as ExtendedGeoGroup[];
}
