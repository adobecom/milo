import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import {
  getBaseGeoHtmlFile,
  getSubdomainManifestJsonFile,
  getSubdomainManifestCsvFile,
  writeJson,
  writeText,
} from '../files.ts';
import { readSitemapDataDocument, type SitemapDataDocument } from './sitemap-data.ts';

export type ManifestPage = {
  baseGeo: string;
  domain: string;
  deploy: boolean;
  sha256: string;
  baseGeoSectionCount: number;
  baseGeoLinkCount: number;
  otherSitemapLinkCount: number;
  extendedGeoGroupCount: number;
  extendedGeoLinkCount: number;
  totalLinkCount: number;
};

export type SubdomainManifest = {
  subdomain: string;
  pageCount: number;
  pages: ManifestPage[];
};

function sha256(content: string): string {
  return createHash('sha256').update(content, 'utf8').digest('hex');
}

function countLinks(document: SitemapDataDocument): Pick<
  ManifestPage,
  'baseGeoSectionCount' | 'baseGeoLinkCount' | 'otherSitemapLinkCount' | 'extendedGeoGroupCount' | 'extendedGeoLinkCount' | 'totalLinkCount'
> {
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

async function buildManifestPage(
  outputDir: string,
  entry: { subdomain: string; baseGeo: string; domain: string; deploy: boolean },
): Promise<ManifestPage> {
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

const CSV_COLUMNS: (keyof ManifestPage)[] = [
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

function pagesToCsv(pages: ManifestPage[]): string {
  const header = CSV_COLUMNS.join(',');
  const rows = pages.map((page) => CSV_COLUMNS.map((col) => String(page[col])).join(','));
  return `${[header, ...rows].join('\n')}\n`;
}

export async function writeSubdomainManifests(
  outputDir: string,
  entries: Array<{ subdomain: string; baseGeo: string; domain: string; deploy: boolean }>,
): Promise<void> {
  const groups = new Map<string, typeof entries>();
  for (const entry of entries) {
    const list = groups.get(entry.subdomain) || [];
    list.push(entry);
    groups.set(entry.subdomain, list);
  }

  for (const [subdomain, subdomainEntries] of groups) {
    const pages = await Promise.all(subdomainEntries.map((entry) => buildManifestPage(outputDir, entry)));
    pages.sort((a, b) => a.baseGeo.localeCompare(b.baseGeo));

    const manifest: SubdomainManifest = {
      subdomain,
      pageCount: pages.length,
      pages,
    };

    await writeJson(getSubdomainManifestJsonFile(outputDir, subdomain), manifest);
    await writeText(getSubdomainManifestCsvFile(outputDir, subdomain), pagesToCsv(pages));
  }
}
