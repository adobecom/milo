/**
 * @typedef {Object} GeoLabelInventoryEntry
 * @property {string} geo
 * @property {string} [language]
 */

/**
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
