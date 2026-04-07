export type NormalizedLink = {
  title: string;
  url: string;
  path: string;
};

export type SiteDomainMap = Record<string, string>;
export type GeoLabelInventoryEntry = {
  geo: string;
  language?: string;
};

type QueryIndexRow = {
  path?: string;
  url?: string;
  title?: string;
  robots?: string;
};

function titleFromSlug(pathname: string): string {
  const slug = (pathname.split('/').filter(Boolean).pop() || 'untitled')
    .replace(/\.[a-z0-9]+$/i, '');
  return slug.split('-').filter(Boolean).map((part) => part[0].toUpperCase() + part.slice(1)).join(' ');
}

export function cleanTitle(title: string): string {
  return title
    .replace(/\s*[-|]\s*Adobe\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function mapRepoHost(hostname: string, siteDomainMap: SiteDomainMap): string | null {
  const match = hostname.match(/^main--([a-z0-9-]+)--adobecom\.aem\.(live|page)$/);
  if (!match) return null;
  const domain = siteDomainMap[match[1]];
  return domain ? `https://${domain}` : null;
}

export function toProductionUrl(
  value: string,
  fallbackDomain: string,
  siteDomainMap: SiteDomainMap = {},
): string {
  if (value.startsWith('/')) {
    return `https://${fallbackDomain}${value}`;
  }

  try {
    const parsed = new URL(value);
    const mappedOrigin = mapRepoHost(parsed.hostname, siteDomainMap);
    if (!mappedOrigin) return parsed.toString();
    return new URL(`${parsed.pathname}${parsed.search}${parsed.hash}`, mappedOrigin).toString();
  } catch {
    return `https://${fallbackDomain}/${value.replace(/^\/+/, '')}`;
  }
}

function isIndexable(robots?: string): boolean {
  if (!robots) return true;
  const normalized = robots.toLowerCase();
  return !normalized.includes('noindex') && !normalized.includes('nofollow');
}

export function normalizeQueryIndexData(
  raw: unknown,
  fallbackDomain: string,
  siteDomainMap: SiteDomainMap = {},
): NormalizedLink[] {
  const rows = Array.isArray((raw as { data?: unknown[] })?.data)
    ? ((raw as { data: unknown[] }).data as QueryIndexRow[])
    : [];

  return rows.flatMap((row): NormalizedLink[] => {
    const source = row.path || row.url;
    if (!source || !isIndexable(row.robots)) return [];

    const url = toProductionUrl(String(source), fallbackDomain, siteDomainMap);
    const parsed = new URL(url);
    const path = parsed.pathname;
    const rawTitle = String(row.title || '').trim();
    const title = cleanTitle(rawTitle || titleFromSlug(path));

    return [{ title, url, path }];
  });
}

function displayName(kind: 'region' | 'language', code: string): string {
  try {
    const formatter = new Intl.DisplayNames(['en'], { type: kind });
    return formatter.of(code.toUpperCase()) || code;
  } catch {
    return code;
  }
}

export function formatGeoLabel(geo: string): string {
  if (!geo) return 'Global';
  const [region, language] = geo.split('_');
  const regionLabel = displayName('region', region);
  if (!language) return regionLabel;
  const languageLabel = displayName('language', language);
  return `${regionLabel} (${languageLabel.toLowerCase()})`;
}

export function formatGeoLabelFromInventory(
  geo: string,
  inventory: GeoLabelInventoryEntry[],
): string {
  if (!geo) return 'Global';

  const [region, geoLanguage] = geo.split('_');
  const regionEntries = new Set(
    inventory
      .map((entry) => entry.geo)
      .filter(Boolean)
      .filter((entryGeo) => entryGeo.split('_')[0] === region),
  );
  const includeLanguage = regionEntries.size > 1;
  if (!includeLanguage) return displayName('region', region);

  const explicitLanguage = inventory.find((entry) => entry.geo === geo)?.language;
  const language = explicitLanguage || geoLanguage;
  if (!language) return displayName('region', region);

  return `${displayName('region', region)} (${displayName('language', language).toLowerCase()})`;
}
