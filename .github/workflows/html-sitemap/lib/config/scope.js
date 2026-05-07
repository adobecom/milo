/**
 * Scope planning. Joins config rows (config × geo-map × query-index-map)
 * into one `ExtractUnit` per (subdomain, baseGeo) the pipeline should
 * process, applying CLI `--subdomain` / `--geo` filters.
 *
 * In production runs (no `--geo` filter) only geos with a non-empty
 * `geo-map.stage` value are emitted. With a `--geo` filter the stage gate
 * is bypassed for that one geo so devs can extract any row.
 */

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
 * @property {string} stage
 * @property {QueryIndexMapRow[]} queryIndexRows
 */

/**
 * Build the list of `ExtractUnit`s the pipeline will process for this run,
 * honoring optional CLI `--subdomain` / `--geo` filters.
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
    const stagedGeoRows = geoFilter !== undefined ? geoRows : geoRows.filter((row) => row.stage);
    stagedGeoRows.forEach((geoRow) => {
      units.push({
        subdomain: domainRow.subdomain,
        domain: domainRow.domain,
        hostSite: domainRow.site,
        extendedSitemap: domainRow.extendedSitemap,
        template: domainRow.template,
        baseGeo: geoRow.baseGeo,
        language: geoRow.language,
        extendedGeos: geoRow.extendedGeos,
        stage: geoRow.stage,
        queryIndexRows,
      });
    });
  });

  return units;
}

/**
 * Resolve which extended geos this unit should pull pages from. When
 * `extendedSitemap: 'all'`, the union of every extended geo across the
 * subdomain. Otherwise, the unit's own configured extended geos.
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
