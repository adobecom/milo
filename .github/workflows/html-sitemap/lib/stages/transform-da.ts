import fs from 'node:fs/promises';
import path from 'node:path';
import { DEFAULT_DA_TEMPLATE, loadConfig } from '../config/config.ts';
import { planExtractUnits } from '../config/scope.ts';
import { mapWithConcurrency } from '../util/concurrency.ts';
import { getBaseGeoExtractDir, getBaseGeoHtmlFile, writeText } from '../util/files.ts';
import { getPageCopy } from '../data/page-copy.ts';
import { hasSitemapDataDocument } from '../config/availability.ts';
import { readSitemapDataDocument, type SitemapDataDocument } from '../data/sitemap.ts';
import { formatStageGeo, getErrorMessage, type UnitStageEntry, type UnitStageResult } from '../util/stage.ts';
import { loadPlaceholderMap } from '../sources/placeholders.ts';
import { renderHtmlTemplate } from '../render/template.ts';
import { writeSubdomainManifests } from '../output/manifest.ts';

const UNIT_CONCURRENCY = 2;
const TEMPLATES_DIR_URL = new URL('../../templates/', import.meta.url);

type TransformDaSummary = {
  subdomain: string;
  baseGeo: string;
  wroteHtml: boolean;
  sectionCount: number;
};

type TransformDaResult = UnitStageResult<TransformDaSummary>;

const sitemapTemplatePromises = new Map<string, Promise<string>>();

function resolveTemplateName(template?: string): string {
  const name = (template || DEFAULT_DA_TEMPLATE).trim();
  if (!name) return DEFAULT_DA_TEMPLATE;
  if (name.includes('/') || name.includes('\\')) {
    throw new Error(`Template names must not include path separators: ${name}`);
  }
  return name;
}

async function loadSitemapTemplate(template?: string): Promise<string> {
  const name = resolveTemplateName(template);
  let promise = sitemapTemplatePromises.get(name);
  if (!promise) {
    promise = fs.readFile(new URL(name, TEMPLATES_DIR_URL), 'utf8');
    sitemapTemplatePromises.set(name, promise);
  }
  return promise;
}

type RenderLink = SitemapDataDocument['sections']['otherSitemapLinks'][number];
type RenderBaseGeoSection = SitemapDataDocument['sections']['baseGeoLinks'][number];
type RenderExtendedGeoGroup = SitemapDataDocument['sections']['extendedGeoLinks'][number];

type RenderModel = {
  pageTitle: string;
  pageDescription: string;
  locale: string;
  baseGeoSections: Array<{
    heading: RenderBaseGeoSection['heading'];
    groups: Array<{
      subheading: string;
      links: RenderBaseGeoSection['groups'][number]['links'];
    }>;
  }>;
  otherSitemapsHeading: string;
  otherSitemaps: RenderLink[];
  extendedPagesHeading: string;
  extendedGeoGroups: Array<{
    title: RenderExtendedGeoGroup['title'];
    links: RenderExtendedGeoGroup['links'];
  }>;
};

function buildRenderModel(document: SitemapDataDocument, copy: ReturnType<typeof getPageCopy>): RenderModel {
  const locale = document.baseGeo || 'global';

  return {
    pageTitle: copy.pageTitle,
    pageDescription: copy.pageDescription,
    locale,
    baseGeoSections: document.sections.baseGeoLinks.map((section) => ({
      heading: section.heading,
      groups: section.groups.map((group) => ({
        subheading: group.subheading || '',
        links: group.links,
      })),
    })),
    otherSitemapsHeading: copy.otherSitemapsHeading,
    otherSitemaps: document.sections.otherSitemapLinks,
    extendedPagesHeading: copy.extendedPagesHeading,
    extendedGeoGroups: document.sections.extendedGeoLinks.map((group) => ({
      title: group.title,
      links: group.links,
    })),
  };
}

async function renderDocument(
  document: SitemapDataDocument,
  copy: ReturnType<typeof getPageCopy>,
  templateName?: string,
): Promise<string> {
  const template = await loadSitemapTemplate(templateName);
  const model = buildRenderModel(document, copy);
  return `${renderHtmlTemplate(template, model)}\n`;
}

async function buildHtmlDocument(
  outputDir: string,
  config: Parameters<typeof getPageCopy>[0],
  unit: { subdomain: string; baseGeo: string; language: string; template?: string },
): Promise<TransformDaSummary> {
  const raw = await readSitemapDataDocument(outputDir, unit);
  const placeholders = await loadPlaceholderMap(path.join(
    getBaseGeoExtractDir(outputDir, unit.subdomain, unit.baseGeo),
    'placeholders.json',
  ));
  const copy = getPageCopy(config, unit, placeholders);
  const html = await renderDocument(raw, copy, unit.template);
  await writeText(getBaseGeoHtmlFile(outputDir, unit.subdomain, unit.baseGeo), html);

  return {
    subdomain: unit.subdomain,
    baseGeo: unit.baseGeo,
    wroteHtml: true,
    sectionCount:
      raw.sections.baseGeoLinks.length
      + (raw.sections.otherSitemapLinks.length ? 1 : 0)
      + (raw.sections.extendedGeoLinks.length ? 1 : 0),
  };
}

function printSummary(units: UnitStageEntry<TransformDaSummary>[]): void {
  const written = units.flatMap((entry) => entry.summary?.wroteHtml ? [formatStageGeo(entry.summary.baseGeo)] : []);
  const skipped = units.flatMap((entry) => !entry.summary?.wroteHtml ? [formatStageGeo(entry.unit.baseGeo)] : []);
  console.log(`[summary] Base geos rendered for DA: ${written.length}${written.length ? ` -> ${written.join(', ')}` : ''}`);
  if (skipped.length) {
    console.log(`[summary] Base geos skipped for DA: ${skipped.join(', ')}`);
  }
}

export async function runTransformDa({
  configRef,
  outputDir,
  subdomainFilter,
  geoFilter,
}: {
  configRef: string;
  outputDir: string;
  subdomainFilter?: string;
  geoFilter?: string;
}): Promise<TransformDaResult> {
  const config = await loadConfig(configRef);
  const units = planExtractUnits(config, { subdomainFilter, geoFilter });

  const settled = await mapWithConcurrency(units, UNIT_CONCURRENCY, async (unit) => {
    const renderable = await hasSitemapDataDocument(outputDir, unit.subdomain, unit.baseGeo);
    if (!renderable) {
      return {
        ok: true,
        unit,
        summary: {
          subdomain: unit.subdomain,
          baseGeo: unit.baseGeo,
          wroteHtml: false,
          sectionCount: 0,
        },
      };
    }

    try {
      console.log(`[transform:da] ${unit.subdomain}/${formatStageGeo(unit.baseGeo)}`);
      const summary = await buildHtmlDocument(outputDir, config, unit);
      return { ok: true, unit, summary };
    } catch (error) {
      console.error(`[error] transform:da ${unit.subdomain}/${formatStageGeo(unit.baseGeo)}: ${getErrorMessage(error)}`);
      return { ok: false, unit, error };
    }
  });

  printSummary(settled);

  const manifestEntries = settled
    .filter((entry) => entry.ok && entry.summary?.wroteHtml)
    .map((entry) => ({
      subdomain: entry.unit.subdomain,
      baseGeo: entry.unit.baseGeo,
      domain: entry.unit.domain,
      deploy: entry.unit.deploy,
    }));

  if (manifestEntries.length > 0) {
    await writeSubdomainManifests(outputDir, manifestEntries);
  }

  return {
    hadFailures: settled.some((entry) => !entry.ok),
    units: settled,
  };
}
