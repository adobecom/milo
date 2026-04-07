import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

export type DomainConfigRow = {
  subdomain: string;
  domain: string;
  site: string;
  extendedSitemap: string;
  template: string;
};

export type QueryIndexMapRow = {
  subdomain: string;
  site: string;
  queryIndexPath: string;
  enabled: boolean;
};

export type GeoMapRow = {
  subdomain: string;
  baseGeo: string;
  language: string;
  extendedGeos: string[];
  deploy: boolean;
};

export type PageCopyRow = {
  subdomain: string;
  baseGeo: string;
  pageTitle: string;
  pageDescription: string;
  otherSitemapsHeading: string;
  extendedPagesHeading: string;
};

export type HtmlSitemapConfig = {
  raw: Record<string, unknown>;
  domains: DomainConfigRow[];
  queryIndexMap: QueryIndexMapRow[];
  geoMap: GeoMapRow[];
  pageCopy: PageCopyRow[];
  siteDomains: Record<string, string>;
};

export const DEFAULT_DA_TEMPLATE = 'da-sitemap.html';

type MultiSheetJson = Record<string, { data?: Record<string, string>[] }>;

function isUrl(value: string): boolean {
  return /^https?:\/\//.test(value);
}

function requireSheet(json: MultiSheetJson, name: string): Record<string, string>[] {
  const rows = json?.[name]?.data;
  if (!Array.isArray(rows)) {
    throw new Error(`Config is missing required sheet: ${name}`);
  }
  return rows;
}

function validateRequiredFields(
  sheetName: string,
  rows: Record<string, string>[],
  requiredFields: string[],
  alternateFields?: Record<string, string>,
): void {
  rows.forEach((row, index) => {
    for (const field of requiredFields) {
      const alt = alternateFields?.[field];
      if (!(field in row) && !(alt && alt in row)) {
        const label = alt ? `"${field}" or "${alt}"` : `"${field}"`;
        throw new Error(`Config sheet "${sheetName}" row ${index}: missing required field ${label}`);
      }
    }
  });
}

function parseExtendedGeos(value?: string): string[] {
  if (!value) return [];
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

function normalizeBaseGeo(value?: string): string {
  return value || '';
}

function parseBooleanFlag(value?: string): boolean {
  if (value === undefined || value === null || value === '') return false;
  return ['true', '1', 'yes', 'on'].includes(String(value).trim().toLowerCase());
}

export async function loadJsonRef(
  ref: string,
  { fetchImpl = fetch }: { fetchImpl?: typeof fetch } = {},
): Promise<MultiSheetJson> {
  if (isUrl(ref)) {
    const response = await fetchImpl(ref, {
      headers: { accept: 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Failed to load config: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  const filePath = path.resolve(process.cwd(), ref);
  const content = await fs.readFile(filePath, 'utf8');
  return JSON.parse(content);
}

export async function loadConfig(
  ref: string,
  options: { fetchImpl?: typeof fetch } = {},
): Promise<HtmlSitemapConfig> {
  const json = await loadJsonRef(ref, options);

  const configRows = requireSheet(json, 'config');
  const qimRows = requireSheet(json, 'query-index-map');
  const geoRows = requireSheet(json, 'geo-map');
  const copyRows = requireSheet(json, 'page-copy');

  const subdomainAlt = { subdomain: 'domain' };
  validateRequiredFields('config', configRows, ['subdomain', 'domain', 'site', 'extendedSitemap']);
  validateRequiredFields('query-index-map', qimRows, ['subdomain', 'site', 'queryIndexPath'], subdomainAlt);
  validateRequiredFields('geo-map', geoRows, ['subdomain', 'language'], subdomainAlt);
  validateRequiredFields('page-copy', copyRows, ['subdomain', 'pageTitle', 'pageDescription'], subdomainAlt);

  const domains = configRows.map((row) => ({
    subdomain: row.subdomain,
    domain: row.domain,
    site: row.site,
    extendedSitemap: row.extendedSitemap,
    template: row.template || DEFAULT_DA_TEMPLATE,
  })).filter((row) => row.subdomain && row.domain && row.site);

  const queryIndexMap = qimRows.map((row) => ({
    subdomain: row.subdomain || row.domain,
    site: row.site,
    queryIndexPath: row.queryIndexPath,
    enabled: parseBooleanFlag(row.enabled),
  })).filter((row) => row.subdomain && row.site && row.queryIndexPath && row.enabled);

  const geoMap = geoRows.map((row) => ({
    subdomain: row.subdomain || row.domain,
    baseGeo: normalizeBaseGeo(row.baseGeo),
    language: row.language,
    extendedGeos: parseExtendedGeos(row.extendedGeos),
    deploy: parseBooleanFlag(row.deploy),
  })).filter((row) => row.subdomain && row.language !== undefined);

  const pageCopy = copyRows.map((row) => ({
    subdomain: row.subdomain || row.domain,
    baseGeo: normalizeBaseGeo(row.baseGeo),
    pageTitle: row.pageTitle || '',
    pageDescription: row.pageDescription || '',
    otherSitemapsHeading: row.otherSitemapsHeading || '',
    extendedPagesHeading: row.extendedPagesHeading || '',
  })).filter((row) => row.subdomain);

  const domainBySubdomain = new Map(domains.map((row) => [row.subdomain, row.domain]));
  const siteDomains = Object.fromEntries([
    ...domains.map((row) => [row.site, row.domain]),
    ...queryIndexMap.flatMap((row) => {
      const domain = domainBySubdomain.get(row.subdomain);
      return domain ? [[row.site, domain]] : [];
    }),
  ]);

  return {
    raw: json,
    domains,
    queryIndexMap,
    geoMap,
    pageCopy,
    siteDomains,
  };
}
