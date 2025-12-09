import { getConfig, createTag, loadStyle, getTargetMarket, getFederatedContentRoot } from '../../utils/utils.js';

/**
 * Fetches full market details (languageName and text) for a given market prefix.
 * @param {string} prefix - The market prefix.
 * @returns {Promise<object|null>} The full market details or null if not found.
 */
async function getMarketDetails(prefix) {
  const config = getConfig();
  const supportedMarketsPath = new URLSearchParams(window.location.search).get('supportedMarketsPath');
  try {
    const response = await fetch(
      supportedMarketsPath
        || `${getFederatedContentRoot()}/federal/supported-markets/supported-markets${config.marketsSource ? `-${config.marketsSource}` : ''}.json`,
    );
    if (response.ok) {
      const data = await response.json();
      return data.data.find((m) => m.prefix === prefix);
    }
  } catch (e) {
    return null;
  }
  return null;
}

/**
 * Verifies if the translated version of the current page exists.
 * @param {string} marketPrefix
 * @param {object} config
 * @returns {Promise<string|null>}
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
    console.warn(`Failed to check translated page: ${translatedUrl}`, e);
  }
  return null;
}

function buildBanner(market, translatedUrl) {
  const banner = document.body.querySelector('.language-banner') || createTag('div', { class: 'language-banner' });
  const messageContainer = createTag('div', { class: 'language-banner-content' });
  const messageText = createTag('span', { class: 'language-banner-text' }, `${market.text} ${market.languageName}.`);
  const link = createTag('a', { class: 'language-banner-link', href: translatedUrl }, market.continue || 'Continue');
  const closeButton = createTag('button', { class: 'language-banner-close', 'aria-label': 'Close' });
  closeButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 0.5C15.2467 0.5 19.5 4.75329 19.5 10C19.5 15.2467 15.2467 19.5 10 19.5C4.75329 19.5 0.5 15.2467 0.5 10C0.5 4.75329 4.75329 0.5 10 0.5Z" stroke="white"/>
      <path d="M6 14.0002L14 6.00024" stroke="white" stroke-width="2"/>
      <path d="M14 14.0002L6 6.00024" stroke="white" stroke-width="2"/>
    </svg>
  `;

  messageContainer.append(messageText, link);
  banner.append(messageContainer, closeButton);
  return banner;
}

async function showBanner(market, config) {
  const translatedUrl = await getTranslatedPage(market.prefix, config);
  if (!translatedUrl) return;

  const banner = buildBanner(market, translatedUrl);
  const { codeRoot, miloLibs } = config;
  loadStyle(`${miloLibs || codeRoot}/features/language-banner/language-banner.css`);

  banner.querySelector('.language-banner-link').addEventListener('click', async (e) => {
    e.preventDefault();
    const { setInternational } = await import('../../utils/utils.js');
    setInternational(market.prefix);
    window.location.href = translatedUrl;
  });

  banner.querySelector('.language-banner-close').addEventListener('click', () => {
    const pageLangPrefix = config.locale.prefix?.replace('/', '') || 'us';
    const domain = window.location.host.endsWith('.adobe.com') ? 'domain=adobe.com;' : '';
    document.cookie = `international=${pageLangPrefix};path=/;${domain}`;
    banner.remove();
  });
}

/**
 * Initializes the language banner feature.
 */
export default async function init() {
  const targetMarket = getTargetMarket();
  if (!targetMarket) return;

  const marketDetails = await getMarketDetails(targetMarket.prefix);
  if (!marketDetails) return;

  const fullMarket = { ...targetMarket, ...marketDetails };
  await showBanner(fullMarket, getConfig());
}
