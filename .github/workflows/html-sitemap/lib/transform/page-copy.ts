import type { HtmlSitemapConfig } from '../planning/config.ts';
import { resolvePlaceholders, type PlaceholderMap } from '../extract/placeholders.ts';

export type PageCopy = {
  pageTitle: string;
  pageDescription: string;
  otherSitemapsHeading: string;
  extendedPagesHeading: string;
};

function resolvePageCopy(copy: PageCopy, placeholders: PlaceholderMap): PageCopy {
  return {
    pageTitle: resolvePlaceholders(copy.pageTitle, placeholders),
    pageDescription: resolvePlaceholders(copy.pageDescription, placeholders),
    otherSitemapsHeading: resolvePlaceholders(copy.otherSitemapsHeading, placeholders),
    extendedPagesHeading: resolvePlaceholders(copy.extendedPagesHeading, placeholders),
  };
}

export function getPageCopy(
  config: HtmlSitemapConfig,
  unit: { subdomain: string; baseGeo: string; language: string },
  placeholders: PlaceholderMap = {},
): PageCopy {
  const row = config.pageCopy.find((entry) => entry.subdomain === unit.subdomain && entry.baseGeo === unit.baseGeo);
  if (!row) {
    console.warn(`[warn] No page-copy row for ${unit.subdomain}/${unit.baseGeo || '(default)'}; using defaults`);
  }
  const copy = {
    pageTitle: row?.pageTitle || 'Sitemap',
    pageDescription: row?.pageDescription || '',
    otherSitemapsHeading: row?.otherSitemapsHeading || '',
    extendedPagesHeading: row?.extendedPagesHeading || '',
  };
  return resolvePageCopy(copy, placeholders);
}
