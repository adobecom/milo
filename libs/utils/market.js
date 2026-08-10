import { getConfig, getMarketsUrl, isBot, normCountryCode, resolveDetectedMarketCountry } from './utils.js';
import { parseMarketsLanguages, marketsLangForLocale, validateMarket } from '../blocks/merch/mas-geo.js';

export const norm = normCountryCode;
export { marketsLangForLocale };

export async function getMarketConfig() {
  try {
    const config = getConfig();
    if (!config.marketsConfig) {
      const resp = await fetch(getMarketsUrl());
      if (!resp.ok) throw new Error('Failed to load market config');
      config.marketsConfig = await resp.json();
    }
    return { languages: parseMarketsLanguages(config.marketsConfig) };
  } catch (e) {
    window.lana?.log(`Market Utils Error: ${e.message}`);
    return null;
  }
}

export async function isSupportedMarket(country) {
  if (!country) return false;
  const config = await getMarketConfig();
  if (!config) return false;
  const { locale } = getConfig();
  const currLang = marketsLangForLocale(config, locale);
  if (!currLang) return false;
  const supported = currLang.supportedRegions?.split(',').map((m) => m.trim().toLowerCase()) || [];
  return supported.includes(country.toLowerCase());
}

export async function getValidatedMarket() {
  if (isBot()) return null;
  const config = await getMarketConfig();
  const detectedMarket = await resolveDetectedMarketCountry();
  const { locale } = getConfig();
  return validateMarket(config, detectedMarket, locale);
}
