/**
 * Geo-code → display label helpers. Uses `Intl.DisplayNames` so labels are
 * locale-aware. Disambiguates same-region multi-language entries by
 * appending the language qualifier (e.g. `Belgium (french)` vs
 * `Belgium (dutch)`).
 */

/**
 * @typedef {Object} GeoLabelInventoryEntry
 * @property {string} geo
 * @property {string} [language]
 */

/**
 * Look up a region or language display name in English via Intl, falling
 * back to the raw code when the runtime cannot resolve it.
 * @param {'region' | 'language'} kind
 * @param {string} code
 * @returns {string}
 */
function displayName(kind, code) {
  try {
    const formatter = new Intl.DisplayNames(['en'], { type: kind });
    return formatter.of(code.toUpperCase()) || code;
  } catch {
    return code;
  }
}

/**
 * Format a geo code (`fr`, `ca_fr`) as a display label with an unconditional
 * language qualifier when present. Returns `Global` for the empty geo.
 * @param {string} geo
 * @returns {string}
 */
export function formatGeoLabel(geo) {
  if (!geo) return 'Global';
  const [region, language] = geo.split('_');
  const regionLabel = displayName('region', region);
  if (!language) return regionLabel;
  const languageLabel = displayName('language', language);
  return `${regionLabel} (${languageLabel.toLowerCase()})`;
}

/**
 * Like `formatGeoLabel`, but only adds the language qualifier when the
 * inventory shows the region has multiple language variants (so a unique
 * region renders cleanly without `(language)` noise).
 * @param {string} geo
 * @param {GeoLabelInventoryEntry[]} inventory
 * @returns {string}
 */
export function formatGeoLabelFromInventory(
  geo,
  inventory,
) {
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
