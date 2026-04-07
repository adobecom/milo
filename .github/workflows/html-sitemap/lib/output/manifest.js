import fs from 'node:fs/promises';
import { sha256 } from '../util/hash.js';
import {
  getBaseGeoHtmlFile,
  getSubdomainManifestJsonFile,
  getSubdomainManifestCsvFile,
  writeJson,
  writeText,
} from '../util/files.js';
import { readSitemapDataDocument } from '../data/sitemap.js';

/**
 * @typedef {import('../data/sitemap.js').SitemapDataDocument} SitemapDataDocument
 */

/**
 * @typedef {Object} ManifestPage
 * @property {string} baseGeo
 * @property {string} domain
 * @property {boolean} deploy
 * @property {string} sha256
 * @property {number} baseGeoSectionCount
 * @property {number} baseGeoLinkCount
 * @property {number} otherSitemapLinkCount
 * @property {number} extendedGeoGroupCount
 * @property {number} extendedGeoLinkCount
 * @property {number} totalLinkCount
 */

/**
 * @typedef {Object} SubdomainManifest
 * @property {string} subdomain
 * @property {number} pageCount
 * @property {ManifestPage[]} pages
 */

/**
 * @param {SitemapDataDocument} document
 * @returns {Pick<ManifestPage, 'baseGeoSectionCount' | 'baseGeoLinkCount' | 'otherSitemapLinkCount' | 'extendedGeoGroupCount' | 'extendedGeoLinkCount' | 'totalLinkCount'>}
 */
function countLinks(document) {
  const baseGeoSectionCount = document.sections.baseGeoLinks.length;
  const baseGeoLinkCount = document.sections.baseGeoLinks.reduce(
    (sum, section) => sum + section.groups.reduce((groupSum, group) => groupSum + group.links.length, 0),
    0,
  );
  const otherSitemapLinkCount = document.sections.otherSitemapLinks.length;
  const extendedGeoGroupCount = document.sections.extendedGeoLinks.length;
  const extendedGeoLinkCount = document.sections.extendedGeoLinks.reduce(
    (sum, group) => sum + group.links.length,
    0,
  );
  const totalLinkCount = baseGeoLinkCount + otherSitemapLinkCount + extendedGeoLinkCount;

  return {
    baseGeoSectionCount,
    baseGeoLinkCount,
    otherSitemapLinkCount,
    extendedGeoGroupCount,
    extendedGeoLinkCount,
    totalLinkCount,
  };
}

/**
 * @param {string} outputDir
 * @param {{ subdomain: string, baseGeo: string, domain: string, deploy: boolean }} entry
 * @returns {Promise<ManifestPage>}
 */
async function buildManifestPage(
  outputDir,
  entry,
) {
  const html = await fs.readFile(getBaseGeoHtmlFile(outputDir, entry.subdomain, entry.baseGeo), 'utf8');
  const document = await readSitemapDataDocument(outputDir, entry);

  return {
    baseGeo: entry.baseGeo,
    domain: entry.domain,
    deploy: entry.deploy,
    sha256: sha256(html),
    ...countLinks(document),
  };
}

/** @type {(keyof ManifestPage)[]} */
const CSV_COLUMNS = [
  'baseGeo',
  'domain',
  'deploy',
  'sha256',
  'baseGeoSectionCount',
  'baseGeoLinkCount',
  'otherSitemapLinkCount',
  'extendedGeoGroupCount',
  'extendedGeoLinkCount',
  'totalLinkCount',
];

/**
 * @param {ManifestPage[]} pages
 * @returns {string}
 */
function pagesToCsv(pages) {
  const header = CSV_COLUMNS.join(',');
  const rows = pages.map((page) => CSV_COLUMNS.map((col) => String(page[col])).join(','));
  return `${[header, ...rows].join('\n')}\n`;
}

/**
 * @param {string} outputDir
 * @param {Array<{ subdomain: string, baseGeo: string, domain: string, deploy: boolean }>} entries
 * @returns {Promise<void>}
 */
export async function writeSubdomainManifests(
  outputDir,
  entries,
) {
  const groups = new Map();
  for (const entry of entries) {
    const list = groups.get(entry.subdomain) || [];
    list.push(entry);
    groups.set(entry.subdomain, list);
  }

  for (const [subdomain, subdomainEntries] of groups) {
    const pages = await Promise.all(subdomainEntries.map((entry) => buildManifestPage(outputDir, entry)));
    pages.sort((a, b) => a.baseGeo.localeCompare(b.baseGeo));

    /** @type {SubdomainManifest} */
    const manifest = {
      subdomain,
      pageCount: pages.length,
      pages,
    };

    await writeJson(getSubdomainManifestJsonFile(outputDir, subdomain), manifest);
    await writeText(getSubdomainManifestCsvFile(outputDir, subdomain), pagesToCsv(pages));
  }
}
