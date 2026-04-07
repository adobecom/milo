export type GeoLabelInventoryEntry = {
  geo: string;
  language?: string;
};

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
