import type { HtmlSitemapConfig, QueryIndexMapRow } from './config.ts';

export type ExtractUnit = {
  subdomain: string;
  domain: string;
  hostSite: string;
  extendedSitemap: string;
  template: string;
  baseGeo: string;
  language: string;
  extendedGeos: string[];
  deploy: boolean;
  queryIndexRows: QueryIndexMapRow[];
};

export function planExtractUnits(
  config: HtmlSitemapConfig,
  { subdomainFilter, geoFilter }: { subdomainFilter?: string; geoFilter?: string } = {},
): ExtractUnit[] {
  const domainRows = config.domains.filter((row) => !subdomainFilter || row.subdomain === subdomainFilter);
  if (!domainRows.length) {
    throw new Error(`No config rows matched subdomain filter: ${subdomainFilter}`);
  }

  const units: ExtractUnit[] = [];
  domainRows.forEach((domainRow) => {
    const geoRows = config.geoMap
      .filter((row) => row.subdomain === domainRow.subdomain)
      .filter((row) => geoFilter === undefined || row.baseGeo === geoFilter);
    if (!geoRows.length) {
      if (geoFilter !== undefined) {
        throw new Error(`No geo-map rows matched ${domainRow.subdomain}/${geoFilter}`);
      }
      return;
    }

    const queryIndexRows = config.queryIndexMap.filter((row) => row.subdomain === domainRow.subdomain);
    geoRows.forEach((geoRow) => {
      units.push({
        subdomain: domainRow.subdomain,
        domain: domainRow.domain,
        hostSite: domainRow.site,
        extendedSitemap: domainRow.extendedSitemap,
        template: domainRow.template,
        baseGeo: geoRow.baseGeo,
        language: geoRow.language,
        extendedGeos: geoRow.extendedGeos,
        deploy: geoRow.deploy,
        queryIndexRows,
      });
    });
  });

  return units;
}

export function relevantExtendedGeos(
  config: HtmlSitemapConfig,
  unit: Pick<ExtractUnit, 'subdomain' | 'extendedSitemap' | 'extendedGeos'>,
): string[] {
  if (unit.extendedSitemap === 'all') {
    return [...new Set(
      config.geoMap
        .filter((row) => row.subdomain === unit.subdomain)
        .flatMap((row) => row.extendedGeos),
    )];
  }
  return [...new Set(unit.extendedGeos)];
}
