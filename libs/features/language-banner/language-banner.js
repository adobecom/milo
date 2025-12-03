import { getConfig, createTag, loadStyle } from '../../utils/utils.js';
import getAkamaiCode from '../../utils/geo.js';

const COOKIE_NAME = 'lingo-banner-dismissed';

const getCookie = (name) => document.cookie
  .split('; ')
  .find((row) => row.startsWith(`${name}=`))
  ?.split('=')[1];

const setCookie = (name, value) => {
  const domain = window.location.host.endsWith('.adobe.com') ? 'domain=adobe.com;' : '';
  document.cookie = `${name}=${value};path=/;${domain}`;
};

/**
 * Gets the user's preferred language, falling back from cookie to browser language.
 * @param {object} locales - The locales object from the Milo config.
 * @returns {string|null} The two-letter language code.
 */
function getPreferredLanguage(locales) {
  const cookie = getCookie('international');
  if (cookie && cookie !== 'us') {
    const locale = locales[cookie];
    const langFromCookie = locale?.ietf
      ? locale.ietf.split('-')[0]
      : cookie.split('_')[0];
    return langFromCookie;
  }
  const browserLang = navigator.language?.split('-')[0];
  return browserLang || null;
}

/**
 * Verifies if the translated version of the current page exists.
 * @param {string} marketPrefix - The market prefix from the supported markets config.
 * @param {object} config - The Milo config object.
 * @returns {Promise<string|null>} The URL of the page if it exists, otherwise null.
 */
async function getTranslatedPage(marketPrefix, config) {
  const { pathname } = window.location;
  const currentPrefix = config.locale.prefix;

  const pagePath = currentPrefix ? pathname.replace(currentPrefix, '') : pathname;
  const translatedUrl = marketPrefix
    ? `${window.location.origin}/${marketPrefix}${pagePath}`
    : `${window.location.origin}${pagePath}`;

  try {
    const response = await fetch(translatedUrl, { method: 'HEAD' });
    if (response.ok) {
      return translatedUrl;
    }
  } catch (e) {
    console.warn(`Failed to check for translated page at ${translatedUrl}`, e);
  }
  return null;
}

function buildBanner(market, translatedUrl) {
  const banner = createTag('div', { class: 'language-banner' });
  const messageContainer = createTag('div', { class: 'language-banner-content' });
  const messageText = createTag('span', { class: 'language-banner-text' }, `${market.text} `);
  const link = createTag('a', { class: 'language-banner-link', href: translatedUrl }, market.languageName);
  const closeButton = createTag('button', { class: 'language-banner-close', 'aria-label': 'Close' });

  messageContainer.append(messageText, link);
  banner.append(messageContainer, closeButton);
  return banner;
}

async function showBanner(market, config) {
  const translatedUrl = await getTranslatedPage(market.prefix, config);
  if (!translatedUrl) return;

  const banner = buildBanner(market, translatedUrl);
  document.body.prepend(banner);
  const { codeRoot, miloLibs } = config;
  const base = miloLibs || codeRoot;
  loadStyle(`${base}/features/language-banner/language-banner.css`);

  banner.querySelector('.language-banner-link').addEventListener('click', async (e) => {
    e.preventDefault();
    const { setInternational } = await import('../../utils/utils.js');
    setInternational(market.prefix);
    window.location.href = translatedUrl;
  });

  banner.querySelector('.language-banner-close').addEventListener('click', () => {
    const pageLangPrefix = config.locale.prefix?.replace('/', '') || '';
    const domain = window.location.host.endsWith('.adobe.com') ? 'domain=adobe.com;' : '';
    document.cookie = `international=${pageLangPrefix};path=/;${domain}`;
    setCookie(COOKIE_NAME, config.locale.ietf.split('-')[0]);
    banner.remove();
  });
}

/**
 * Initializes the language banner feature.
 * @returns {Promise<boolean>} Returns true if the logic was handled, false if it should delegate.
 */
export default async function init(jsonPromise) {
  const config = getConfig();

  const pageLang = config.locale.ietf.split('-')[0];
  if (getCookie(COOKIE_NAME) === pageLang) return;

  const prefLang = getPreferredLanguage(config.locales);

  const marketsConfigPromise = jsonPromise
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null);

  const [akamaiCode, marketsConfig] = await Promise.all([
    getAkamaiCode(),
    marketsConfigPromise,
  ]);

  if (!akamaiCode || !marketsConfig) return;

  let geoIp = akamaiCode.toLowerCase();
  if (geoIp === 'gb') geoIp = 'uk';

  marketsConfig.data.forEach((market) => {
    market.supportedRegions = market.supportedRegions.split(',').map((r) => r.trim().toLowerCase());
  });

  const pageMarket = marketsConfig.data.find((m) => m.prefix === (config.locale.prefix?.replace('/', '') || ''));
  const isSupportedMarket = pageMarket?.supportedRegions.includes(geoIp);

  if (isSupportedMarket) {
    if (!prefLang || pageLang === prefLang) return;

    const prefMarket = marketsConfig.data.find((m) => m.lang === prefLang && m.supportedRegions.includes(geoIp));
    if (prefMarket) {
      await showBanner(prefMarket, config);
    }
    return;
  }

  // Unsupported Market Path
  const marketsForGeo = marketsConfig.data.filter((m) => m.supportedRegions.includes(geoIp));
  if (!marketsForGeo.length) return;

  if (prefLang) {
    const prefMarketForGeo = marketsForGeo.find((m) => m.lang === prefLang);
    if (prefMarketForGeo) {
      await showBanner(prefMarketForGeo, config);
      return;
    }
  }

  await showBanner(marketsForGeo[0], config);
}
