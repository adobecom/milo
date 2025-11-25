import { getConfig, getMetadata, createTag, loadStyle } from '../../utils/utils.js';
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
    if (locale?.ietf) {
      return locale.ietf.split('-')[0];
    }
    return cookie.split('_')[0];
  }
  const browserLang = navigator.language?.split('-')[0];
  return browserLang || null;
}

/**
 * Verifies if the translated version of the current page exists.
 * @param {string} marketPrefix - The market prefix from the supported markets config.
 * @returns {Promise<string|null>} The URL of the page if it exists, otherwise null.
 */
async function getTranslatedPage(marketPrefix) {
  const { pathname } = window.location;
  const config = getConfig();
  const currentPrefix = config.locale.prefix;

  const pagePath = currentPrefix ? pathname.replace(currentPrefix, '') : pathname;
  const translatedUrl = marketPrefix
    ? `${window.location.origin}/${marketPrefix}${pagePath}`
    : `${window.location.origin}${pagePath}`;

  try {
    const response = await fetch(translatedUrl, { method: 'HEAD' });
    // if (response.ok) {
      return translatedUrl;
    // }
  } catch (e) {
    console.warn(`Failed to check for translated page at ${translatedUrl}`, e);
  }
  return null;
}

function buildBanner(market, translatedUrl) {
  const banner = createTag('div', { class: 'language-banner' });
  const messageContainer = createTag('div', { class: 'language-banner-content' });
  const messageText = createTag('span', { class: 'language-banner-text' }, `${market.text} `);
  const link = createTag('a', { class: 'language-banner-link', href: translatedUrl }, market.language);
  const closeButton = createTag('button', { class: 'language-banner-close', 'aria-label': 'Close' });

  messageContainer.append(messageText, link);
  banner.append(messageContainer, closeButton);
  return banner;
}

async function showBanner(market) {
  const translatedUrl = await getTranslatedPage(market.prefix);
  if (!translatedUrl) return;

  const banner = buildBanner(market, translatedUrl);
  document.body.prepend(banner);
  loadStyle('/libs/features/language-banner/language-banner.css');

  banner.querySelector('.language-banner-link').addEventListener('click', async (e) => {
    e.preventDefault();
    const { setInternational } = await import('../../utils/utils.js');
    setInternational(market.prefix);
    window.location.href = translatedUrl;
  });

  banner.querySelector('.language-banner-close').addEventListener('click', () => {
    const config = getConfig();
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
export default async function init() {
  const config = getConfig();

  const pageLang = config.locale.ietf.split('-')[0];
  if (getCookie(COOKIE_NAME) === pageLang) return;

  const prefLang = getPreferredLanguage(config.locales);
  const [geoIp, marketsConfig] = await Promise.all([
    getAkamaiCode(),
    fetch(`${config.contentRoot ?? ''}/supported-markets.json`).then((res) => res.json()).catch(() => null),
  ]);

  if (!geoIp || !marketsConfig) return;

  const pageMarket = marketsConfig.data.find((m) => m.prefix === (config.locale.prefix?.replace('/', '') || ''));
  const isSupportedMarket = pageMarket?.supportedRegions.map((r) => r.toLowerCase()).includes(geoIp.toLowerCase());

  if (isSupportedMarket) {
    if (!prefLang || pageLang === prefLang) return;

    const prefMarket = marketsConfig.data.find((m) => m.lang === prefLang && m.supportedRegions.map((r) => r.toLowerCase()).includes(geoIp.toLowerCase()));
    if (prefMarket) {
      await showBanner(prefMarket);
    }
    return;
  }

  // Unsupported Market Path
  const marketsForGeo = marketsConfig.data.filter((m) => m.supportedRegions.map((r) => r.toLowerCase()).includes(geoIp.toLowerCase()));
  if (!marketsForGeo.length) return;

  if (prefLang) {
    const prefMarketForGeo = marketsForGeo.find((m) => m.lang === prefLang);
    if (prefMarketForGeo) {
      await showBanner(prefMarketForGeo); // Show Banner with recommendation based on PREF-LANG and GeoIP
      return;
    }
  }

  await showBanner(marketsForGeo[0]);
}
