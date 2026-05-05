import fs from 'node:fs/promises';
import path from 'node:path';
import { DEFAULT_DA_TEMPLATE, loadConfig } from '../config/config.js';
import { planExtractUnits } from '../config/scope.js';
import { mapWithConcurrency } from '../util/concurrency.js';
import { getBaseGeoExtractDir, getBaseGeoHtmlFile, writeText } from '../util/files.js';
import { getPageCopy } from '../data/page-copy.js';
import { hasSitemapDataDocument } from '../config/availability.js';
import { readSitemapDataDocument } from '../data/sitemap.js';
import { formatStageGeo, getErrorMessage } from '../util/stages.js';
import { loadPlaceholderMap } from '../sources/placeholders.js';
import { renderHtmlTemplate } from '../render/template.js';
import { writeSubdomainManifests } from '../output/manifest.js';

/**
 * @typedef {import('../data/sitemap.js').SitemapDataDocument} SitemapDataDocument
 * @typedef {import('../util/stages.js').UnitStageEntry} UnitStageEntry
 * @typedef {import('../util/stages.js').UnitStageResult} UnitStageResult
 */

const UNIT_CONCURRENCY = 2;
const TEMPLATES_DIR_URL = new URL('../../templates/', import.meta.url);

/**
 * @typedef {Object} TransformDaSummary
 * @property {string} subdomain
 * @property {string} baseGeo
 * @property {boolean} wroteHtml
 * @property {number} sectionCount
 */

/** @type {Map<string, Promise<string>>} */
const sitemapTemplatePromises = new Map();

/**
 * @param {string} [template]
 * @returns {string}
 */
function resolveTemplateName(template) {
  const name = (template || DEFAULT_DA_TEMPLATE).trim();
  if (!name) return DEFAULT_DA_TEMPLATE;
  if (name.includes('/') || name.includes('\\')) {
    throw new Error(`Template names must not include path separators: ${name}`);
  }
  return name;
}

/**
 * @param {string} [template]
 * @returns {Promise<string>}
 */
async function loadSitemapTemplate(template) {
  const name = resolveTemplateName(template);
  let promise = sitemapTemplatePromises.get(name);
  if (!promise) {
    promise = fs.readFile(new URL(name, TEMPLATES_DIR_URL), 'utf8');
    sitemapTemplatePromises.set(name, promise);
  }
  return promise;
}

/**
 * @param {SitemapDataDocument} document
 * @param {ReturnType<typeof getPageCopy>} copy
 * @returns {Object}
 */
function buildRenderModel(document, copy) {
  const locale = document.baseGeo || 'global';

  return {
    pageTitle: copy.pageTitle,
    locale,
    baseGeoSections: document.sections.baseGeoLinks.map((section) => ({
      heading: section.heading,
      groups: section.groups.map((group) => ({
        subheading: group.subheading || '',
        links: group.links,
      })),
    })),
    extendedGeoGroups: document.sections.extendedGeoLinks.map((group) => ({
      title: group.title,
      links: group.links,
    })),
  };
}

/**
 * @param {SitemapDataDocument} document
 * @param {ReturnType<typeof getPageCopy>} copy
 * @param {string} [templateName]
 * @returns {Promise<string>}
 */
async function renderDocument(
  document,
  copy,
  templateName,
) {
  const template = await loadSitemapTemplate(templateName);
  const model = buildRenderModel(document, copy);
  return `${renderHtmlTemplate(template, model)}\n`;
}

/**
 * @param {string} outputDir
 * @param {Parameters<typeof getPageCopy>[0]} config
 * @param {{ subdomain: string, baseGeo: string, language: string, template?: string }} unit
 * @returns {Promise<TransformDaSummary>}
 */
async function buildHtmlDocument(
  outputDir,
  config,
  unit,
) {
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
      + (raw.sections.extendedGeoLinks.length ? 1 : 0),
  };
}

/**
 * @param {UnitStageEntry[]} units
 * @returns {void}
 */
function printSummary(units) {
  const written = units.flatMap((entry) => entry.summary?.wroteHtml ? [formatStageGeo(entry.summary.baseGeo)] : []);
  const skipped = units.flatMap((entry) => !entry.summary?.wroteHtml ? [formatStageGeo(entry.unit.baseGeo)] : []);
  console.log(`[summary] Base geos rendered for DA: ${written.length}${written.length ? ` -> ${written.join(', ')}` : ''}`);
  if (skipped.length) {
    console.log(`[summary] Base geos skipped for DA: ${skipped.join(', ')}`);
  }
}

/**
 * @param {{ configRef: string, outputDir: string, subdomainFilter?: string, geoFilter?: string }} options
 * @returns {Promise<UnitStageResult>}
 */
export async function runTransformDa({
  configRef,
  outputDir,
  subdomainFilter,
  geoFilter,
}) {
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
      stage: entry.unit.stage,
    }));

  if (manifestEntries.length > 0) {
    await writeSubdomainManifests(outputDir, manifestEntries);
  }

  return {
    hadFailures: settled.some((entry) => !entry.ok),
    units: settled,
  };
}
