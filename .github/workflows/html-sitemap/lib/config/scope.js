/**
 * @typedef {import('./config.js').HtmlSitemapConfig} HtmlSitemapConfig
 * @typedef {import('./config.js').QueryIndexMapRow} QueryIndexMapRow
 */

/**
 * @typedef {Object} ExtractUnit
 * @property {string} subdomain
 * @property {string} domain
 * @property {string} hostSite
 * @property {string} extendedSitemap
 * @property {string} template
 * @property {string} baseGeo
 * @property {string} language
 * @property {string[]} extendedGeos
 * @property {boolean} deploy
 * @property {QueryIndexMapRow[]} queryIndexRows
 */

/**
 * @param {HtmlSitemapConfig} config
 * @param {{ subdomainFilter?: string, geoFilter?: string }} [options]
 * @returns {ExtractUnit[]}
 */
export function planExtractUnits(
  config,
  { subdomainFilter, geoFilter } = {},
) {
  const domainRows = config.domains.filter((row) => !subdomainFilter || row.subdomain === subdomainFilter);
  if (!domainRows.length) {
    throw new Error(`No config rows matched subdomain filter: ${subdomainFilter}`);
  }

  /** @type {ExtractUnit[]} */
  const units = [];
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

/**
 * @param {HtmlSitemapConfig} config
 * @param {Pick<ExtractUnit, 'subdomain' | 'extendedSitemap' | 'extendedGeos'>} unit
 * @returns {string[]}
 */
export function relevantExtendedGeos(
  config,
  unit,
) {
  if (unit.extendedSitemap === 'all') {
    return [...new Set(
      config.geoMap
        .filter((row) => row.subdomain === unit.subdomain)
        .flatMap((row) => row.extendedGeos),
    )];
  }
  return [...new Set(unit.extendedGeos)];
}
