import { getFederatedContentRoot } from './utils.js';

let marketsPromise;

export function appendCountryParam(urlString, countryCode) {
  if (!countryCode || !urlString) return urlString;
  try {
    const u = new URL(urlString);
    u.searchParams.set('country', countryCode);
    return u.toString();
  } catch {
    return urlString;
  }
}

function normalizeMarketLabelPrefix(prefix) {
  if (prefix == null || prefix === '') return '';
  return String(prefix).replace(/^\//, '').trim().toLowerCase();
}

export function getMarketLabel(market, langKey, prefix) {
  if (!market) return '';
  const key = typeof langKey === 'string' ? langKey.trim().toLowerCase() : '';
  const normPrefix = normalizeMarketLabelPrefix(prefix);
  const prefLangLabel = key
    ? (market[key] || (normPrefix ? market[`${key}-${normPrefix}`] : ''))
    : '';
  if (typeof prefLangLabel === 'string' && prefLangLabel.trim()) return prefLangLabel.trim();
  const enLabel = market.en;
  if (typeof enLabel === 'string' && enLabel.trim()) return enLabel.trim();
  return market.marketName || '';
}

export default async function loadMarketsData() {
  if (!marketsPromise) {
    const url = `${getFederatedContentRoot()}/federal/assets/markets.json`;
    marketsPromise = fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`markets.json fetch failed with status ${res.status}`);
        return res.json();
      })
      .then((json) => (Array.isArray(json?.data) ? json.data : []))
      .catch((e) => {
        window.lana?.log(`marketHelper: failed to load markets data: ${e?.message}`);
        return [];
      });
  }
  return marketsPromise;
}
