import { getConfig } from '../../../utils/utils.js';
import { SEVERITY } from './constants.js';

const API_BASE = 'https://www.adobe.com/mas/io/fragment';
const API_KEY = 'wcms-commerce-ims-ro-user-milo';
const HYDRATION_DELAY_MS = 3000;

export function findFragmentElements(area = document) {
  const els = area.querySelectorAll('aem-fragment[fragment]');
  const entries = [];
  els.forEach((el) => {
    const uuid = el.getAttribute('fragment');
    if (!uuid) return;
    const card = el.closest('merch-card, merch-card-collection, mas-field') || el;
    entries.push({ uuid, el, card });
  });
  return entries;
}

export async function checkFragmentPublished(uuid, locale) {
  const params = new URLSearchParams({ id: uuid, api_key: API_KEY, locale, source: 'preflight' });
  const url = `${API_BASE}?${params.toString()}`;
  try {
    const res = await fetch(url);
    return { uuid, httpStatus: res.status, published: res.status === 200 };
  } catch {
    return { uuid, httpStatus: 0, published: false };
  }
}

function resolveLocale(locale) {
  if (locale) return locale;
  const ietf = getConfig()?.locale?.ietf || 'en-US';
  return ietf.replace('-', '_');
}

export async function checkUnpublishedFragments({ area = document, locale } = {}) {
  const resolvedLocale = resolveLocale(locale);
  const entries = findFragmentElements(area);
  const byUuid = new Map();
  entries.forEach((entry) => {
    if (!byUuid.has(entry.uuid)) byUuid.set(entry.uuid, []);
    byUuid.get(entry.uuid).push(entry);
  });

  const uuids = [...byUuid.keys()];
  const results = await Promise.all(
    uuids.map((uuid) => checkFragmentPublished(uuid, resolvedLocale)),
  );

  const unpublished = results
    .filter((r) => !r.published)
    .map((r) => {
      const group = byUuid.get(r.uuid);
      return {
        uuid: r.uuid,
        httpStatus: r.httpStatus,
        elements: group.map((g) => g.el),
        cards: group.map((g) => g.card),
      };
    });

  if (unpublished.length > 0) {
    window.lana?.log?.(`[preflight][mas] ${unpublished.length} unpublished fragment(s) out of ${uuids.length} scanned: ${unpublished.map((u) => u.uuid).join(', ')}`, { tags: 'preflight', errorType: 'i' });
  }

  return { unpublished, scanned: uuids.length };
}

const RENDERED_BY_OST_OR_MAS = '[data-wcs-osi], [is="inline-price"], [is="checkout-link"], [is="checkout-button"], merch-card, merch-card-collection, merch-offer, merch-offer-select, merch-quantity-select, mas-field, aem-fragment';
const NOT_AUTHORED_TEXT = `script, style, noscript, template, ${RENDERED_BY_OST_OR_MAS}`;

const SYMBOL_BEFORE_AMOUNT = String.raw`(?:USD\$|US\$|A\$|AU\$|C\$|CA\$|NZ\$|HK\$|S\$|SG\$|MX\$|R\$|NT\$|\$|€|£|¥|￥|₩|₹|₺|₽|₪|฿|₱|₫|₴|zł|kr|Kč|Ft|lei|RM|Rp|ر\.س|د\.إ)`;
const SYMBOL_AFTER_AMOUNT = String.raw`(?:€|£|¥|₩|₹|₺|₽|₪|₫|₴|zł|kr|Kč|Ft|lei|円|원|元|руб\.?|TL|Fr\.)`;
const CURRENCY_CODE = String.raw`(?:USD|EUR|GBP|JPY|KRW|INR|AUD|CAD|NZD|BRL|MXN|CHF|SEK|NOK|DKK|PLN|CZK|HUF|TRY|RUB|ILS|THB|PHP|IDR|MYR|SGD|HKD|TWD|CNY|ZAR|AED|SAR|UAH|RON)`;
const AMOUNT = String.raw`\d{1,3}(?:[.,\u00a0\u202f ']\d{3})+(?:[.,](?:\d{1,2}|[–-]))?|\d+(?:[.,](?:\d{1,2}|[–-]))?`;
const PER_PERIOD = String.raw`(?:\s?\/\s?(?:mo|month|yr|year|mes|mês|mois|an|ano|año|Monat|Jahr|mån|år|kk|月|年|월|년)\.?|\s(?:per|a|\/)\s(?:month|year))`;
const ENDS_WITHOUT_MAGNITUDE = String.raw`(?![.,]?\d)(?!\s?(?:K|M|B|bn|k|[Mm]illions?|[Bb]illions?|[Tt]rillions?|Mio\.?|Mrd\.?|milliards?|万|億|억|만)(?!\p{L}))`;
const NOT_AFTER_LATIN_OR_DIGIT = String.raw`(?<![A-Za-z\d])`;
const NOT_AFTER_LATIN_DIGIT_OR_SEPARATOR = String.raw`(?<![A-Za-z\d.,])`;
const NOT_BEFORE_LETTER = String.raw`(?!\p{L})`;
const PRICE_PATTERNS = [
  `${NOT_AFTER_LATIN_OR_DIGIT}${SYMBOL_BEFORE_AMOUNT}\\s?(?:${AMOUNT})${ENDS_WITHOUT_MAGNITUDE}(?:${PER_PERIOD})?`,
  `${NOT_AFTER_LATIN_DIGIT_OR_SEPARATOR}(?:${AMOUNT})\\s?${SYMBOL_AFTER_AMOUNT}${NOT_BEFORE_LETTER}(?:${PER_PERIOD})?`,
  `${NOT_AFTER_LATIN_OR_DIGIT}${CURRENCY_CODE}\\s?(?:${AMOUNT})${ENDS_WITHOUT_MAGNITUDE}(?:${PER_PERIOD})?`,
  `${NOT_AFTER_LATIN_DIGIT_OR_SEPARATOR}(?:${AMOUNT})\\s?${CURRENCY_CODE}${NOT_BEFORE_LETTER}(?:${PER_PERIOD})?`,
  `${NOT_AFTER_LATIN_DIGIT_OR_SEPARATOR}\\d+[.,]\\d{2}${PER_PERIOD}`,
];
let priceRegex;

function getPriceRegexIfSupported() {
  if (priceRegex === undefined) {
    try {
      priceRegex = new RegExp(PRICE_PATTERNS.join('|'), 'gu');
    } catch {
      priceRegex = null;
    }
  }
  return priceRegex;
}

const isHidden = (el) => (typeof el.checkVisibility === 'function'
  ? !el.checkVisibility({ checkVisibilityCSS: true, visibilityProperty: true })
  : !el.getClientRects().length);

const SNIPPET_CONTEXT = 30;

export function findStaticPrices(area = document) {
  const re = getPriceRegexIfSupported();
  if (!re) return [];
  const root = area.querySelector('main') || area;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => (/\d/.test(node.nodeValue) && !node.parentElement?.closest(NOT_AUTHORED_TEXT)
      ? NodeFilter.FILTER_ACCEPT
      : NodeFilter.FILTER_REJECT),
  });
  const prices = [];
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const { nodeValue, parentElement: element } = node;
    const matches = [...nodeValue.matchAll(re)];
    if (matches.length) {
      const hidden = isHidden(element);
      matches.forEach(({ 0: text, index }) => {
        const snippet = nodeValue
          .slice(Math.max(0, index - SNIPPET_CONTEXT), index + text.length + SNIPPET_CONTEXT)
          .replace(/\s+/g, ' ')
          .trim();
        prices.push({ text: text.trim(), snippet, hidden, element });
      });
    }
  }
  return prices;
}

function checkStaticPrices(area) {
  const base = { checkId: 'static-prices', title: 'Static prices', severity: SEVERITY.CRITICAL };
  if (!getPriceRegexIfSupported()) {
    return { ...base, status: 'limbo', description: "This browser can't run the static price check. Use a current Chrome.", details: { prices: [] } };
  }
  const prices = findStaticPrices(area);
  const failed = prices.length > 0;
  return {
    ...base,
    status: failed ? 'fail' : 'pass',
    description: failed
      ? `${prices.length} static price${prices.length === 1 ? '' : 's'} found. Replace them with OST or M@S prices.`
      : 'No static prices found.',
    details: { prices },
  };
}

export function runChecks({ area = document, locale, delayMs = HYDRATION_DELAY_MS } = {}) {
  const pricesRendered = new Promise((resolve) => { setTimeout(resolve, delayMs); });
  return [
    pricesRendered.then(async () => {
      const { unpublished, scanned } = await checkUnpublishedFragments({ area, locale });
      const failed = unpublished.length > 0;
      return {
        name: 'M@S Unpublished Fragments',
        status: failed ? 'fail' : 'pass',
        severity: SEVERITY.CRITICAL,
        details: failed ? { unpublished, scanned } : { scanned },
      };
    }),
    pricesRendered.then(() => checkStaticPrices(area)),
  ];
}
