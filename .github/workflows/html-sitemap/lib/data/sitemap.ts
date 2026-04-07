import fs from 'node:fs/promises';
import path from 'node:path';
import type { HtmlSitemapConfig } from '../config/config.ts';
import type { ExtractUnit } from '../config/scope.ts';
import { relevantExtendedGeos } from '../config/scope.ts';
import { getBaseGeoDataFile, getBaseGeoExtractDir, getBaseGeoRegionsFile, writeJson } from '../util/files.ts';
import { loadPlaceholderMap } from '../sources/placeholders.ts';
import { loadRegionLabelMap } from '../sources/regions.ts';
import { buildBaseGeoLinks } from './gnav-sections.ts';
import { buildExtendedGeoLinks, buildOtherSitemapLinks } from './links.ts';
import { normalizeQueryIndexData } from './normalize.ts';

export type TransformDataSummary = {
  subdomain: string;
  baseGeo: string;
  wroteData: boolean;
  baseGeoSectionCount: number;
  extendedGeoGroupCount: number;
  extendedGeoConsideredCount: number;
  extendedGeoWithRawLinksCount: number;
  extendedGeoRenderedCount: number;
  extendedGeoEmptyCount: number;
  extendedGeoDedupedAwayCount: number;
};

type ExtendedGeoSummary = Pick<
  TransformDataSummary,
  'extendedGeoConsideredCount'
  | 'extendedGeoWithRawLinksCount'
  | 'extendedGeoRenderedCount'
  | 'extendedGeoEmptyCount'
  | 'extendedGeoDedupedAwayCount'
>;

export type SitemapBaseGeoLinks = Awaited<ReturnType<typeof buildBaseGeoLinks>>;
export type SitemapOtherSitemapLinks = ReturnType<typeof buildOtherSitemapLinks>;
export type SitemapExtendedGeoLinks = Awaited<ReturnType<typeof buildExtendedGeoLinks>>;

export type SitemapSections = {
  baseGeoLinks: SitemapBaseGeoLinks;
  otherSitemapLinks: SitemapOtherSitemapLinks;
  extendedGeoLinks: SitemapExtendedGeoLinks;
};

export type SitemapDataDocument = {
  subdomain: string;
  baseGeo: string;
  domain: string;
  sections: SitemapSections;
};

export async function readSitemapDataDocument(
  outputDir: string,
  unit: Pick<ExtractUnit, 'subdomain' | 'baseGeo'>,
): Promise<SitemapDataDocument> {
  return JSON.parse(
    await fs.readFile(getBaseGeoDataFile(outputDir, unit.subdomain, unit.baseGeo), 'utf8'),
  ) as SitemapDataDocument;
}

async function summarizeExtendedGeoInputs(
  outputDir: string,
  config: HtmlSitemapConfig,
  unit: ExtractUnit,
  renderedGroups: { geo: string }[],
): Promise<ExtendedGeoSummary> {
  const geos = relevantExtendedGeos(config, unit);
  const rendered = new Set(renderedGroups.map((group) => group.geo));
  let withRawLinks = 0;
  let empty = 0;
  let dedupedAway = 0;

  await Promise.all(geos.map(async (geo) => {
    const geoDir = path.join(getBaseGeoExtractDir(outputDir, unit.subdomain, unit.baseGeo), 'extended', geo);
    const siteDirs = await fs.readdir(geoDir).catch(() => []);
    let rawCount = 0;

    await Promise.all(siteDirs.map(async (siteDir) => {
      const json = JSON.parse(await fs.readFile(path.join(geoDir, siteDir, 'query-index.json'), 'utf8'));
      rawCount += normalizeQueryIndexData(json, unit.domain, config.siteDomains).length;
    }));

    if (rawCount > 0) {
      withRawLinks += 1;
      if (!rendered.has(geo)) dedupedAway += 1;
      return;
    }

    empty += 1;
  }));

  return {
    extendedGeoConsideredCount: geos.length,
    extendedGeoWithRawLinksCount: withRawLinks,
    extendedGeoRenderedCount: rendered.size,
    extendedGeoEmptyCount: empty,
    extendedGeoDedupedAwayCount: dedupedAway,
  };
}

export async function buildSitemapDataDocument(
  outputDir: string,
  config: HtmlSitemapConfig,
  unit: ExtractUnit,
): Promise<TransformDataSummary> {
  const extractDir = getBaseGeoExtractDir(outputDir, unit.subdomain, unit.baseGeo);
  const placeholders = await loadPlaceholderMap(path.join(extractDir, 'placeholders.json'));
  const regionLabels = await loadRegionLabelMap(getBaseGeoRegionsFile(outputDir, unit.subdomain, unit.baseGeo));

  const baseGeoLinks = await buildBaseGeoLinks(
    path.join(extractDir, 'gnav'),
    placeholders,
    unit.domain,
    config.siteDomains,
  ).catch(() => []);
  const otherSitemapLinks = buildOtherSitemapLinks(config, unit, regionLabels);
  const extendedGeoLinks = await buildExtendedGeoLinks(outputDir, config, unit, regionLabels);
  const extendedGeoSummary = await summarizeExtendedGeoInputs(outputDir, config, unit, extendedGeoLinks);

  const document: SitemapDataDocument = {
    subdomain: unit.subdomain,
    baseGeo: unit.baseGeo,
    domain: unit.domain,
    sections: {
      baseGeoLinks,
      otherSitemapLinks,
      extendedGeoLinks,
    },
  };

  await writeJson(getBaseGeoDataFile(outputDir, unit.subdomain, unit.baseGeo), document);

  return {
    subdomain: unit.subdomain,
    baseGeo: unit.baseGeo,
    wroteData: true,
    baseGeoSectionCount: baseGeoLinks.length,
    extendedGeoGroupCount: extendedGeoLinks.length,
    ...extendedGeoSummary,
  };
}
