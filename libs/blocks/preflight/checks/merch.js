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

// Text inside these is rendered by OST / M@S, so it is a dynamic price or M@S-owned copy.
const DYNAMIC_PRICE_SELECTOR = '[data-wcs-osi], [is="inline-price"], [is="checkout-link"], [is="checkout-button"], merch-card, merch-card-collection, merch-offer, merch-offer-select, merch-quantity-select, mas-field, aem-fragment';
const NOT_PAGE_TEXT_SELECTOR = `script, style, noscript, template, ${DYNAMIC_PRICE_SELECTOR}`;

const SYM_PRE = String.raw`(?:USD\$|US\$|A\$|AU\$|C\$|CA\$|NZ\$|HK\$|S\$|SG\$|MX\$|R\$|NT\$|\$|€|£|¥|￥|₩|₹|₺|₽|₪|฿|₱|₫|₴|zł|CHF|kr|Kč|Ft|lei|RM|Rp|SAR|AED|ر\.س|د\.إ)`;
const SYM_POST = String.raw`(?:€|£|¥|₩|₹|₺|₽|₪|₫|₴|zł|kr|Kč|Ft|lei|円|원|元|руб\.?|TL|CHF|Fr\.|DKK|SEK|NOK)`;
const ISO = String.raw`(?:USD|EUR|GBP|JPY|KRW|INR|AUD|CAD|NZD|BRL|MXN|CHF|SEK|NOK|DKK|PLN|CZK|HUF|TRY|RUB|ILS|THB|PHP|IDR|MYR|SGD|HKD|TWD|CNY|ZAR|AED|SAR|UAH|RON)`;
// 1,234.56 | 1.234,56 | 1 234,56 | 1'234.56 | 22.99 | 20.– | 49
const AMT = String.raw`\d{1,3}(?:[.,\u00a0\u202f ']\d{3})+(?:[.,](?:\d{1,2}|[–-]))?|\d+(?:[.,](?:\d{1,2}|[–-]))?`;
const RECUR = String.raw`(?:\s?\/\s?(?:mo|month|yr|year|mes|mês|mois|an|ano|año|Monat|Jahr|mån|år|kk|月|年|월|년)\.?|\s(?:per|a|\/)\s(?:month|year))`;
// Amounts with a magnitude ("$54 billion", "$15K") are statistics, not prices.
const END = String.raw`(?![.,]?\d)(?!\s?(?:K|M|B|bn|k|[Mm]illions?|[Bb]illions?|[Tt]rillions?|Mio\.?|Mrd\.?|milliards?|万|億|억|만)(?!\p{L}))`;
// Lookbehinds are ASCII-only so a price glued to CJK text ("에₩30,300/월") still matches.
const PRICE_RE = new RegExp([
  String.raw`(?<![A-Za-z\d])${SYM_PRE}\s?(?:${AMT})${END}(?:${RECUR})?`,
  String.raw`(?<![A-Za-z\d.,])(?:${AMT})\s?${SYM_POST}(?!\p{L})(?:${RECUR})?`,
  String.raw`(?<![A-Za-z\d])${ISO}\s?(?:${AMT})${END}(?:${RECUR})?`,
  String.raw`(?<![A-Za-z\d.,])(?:${AMT})\s?${ISO}(?!\p{L})(?:${RECUR})?`,
  String.raw`(?<![A-Za-z\d.,])\d+[.,]\d{2}${RECUR}`,
].join('|'), 'gu');
const SNIPPET_CONTEXT = 30;

// Hidden text is scanned too: closed tabs and footnotes go live with the page.
export function findStaticPrices(area = document) {
  const root = area.querySelector('main') || area;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => (/\d/.test(node.nodeValue) && !node.parentElement?.closest(NOT_PAGE_TEXT_SELECTOR)
      ? NodeFilter.FILTER_ACCEPT
      : NodeFilter.FILTER_REJECT),
  });
  const prices = [];
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const { nodeValue, parentElement: element } = node;
    const matches = [...nodeValue.matchAll(PRICE_RE)];
    if (matches.length) {
      const hidden = !element.checkVisibility({ visibilityProperty: true });
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
  const prices = findStaticPrices(area);
  const failed = prices.length > 0;
  return {
    checkId: 'static-prices',
    title: 'Static prices',
    status: failed ? 'fail' : 'pass',
    severity: SEVERITY.CRITICAL,
    description: failed
      ? `${prices.length} static price${prices.length === 1 ? '' : 's'} found. Replace them with OST or M@S prices.`
      : 'No static prices found.',
    details: { prices },
  };
}

export function runChecks({ area = document, locale, delayMs = HYDRATION_DELAY_MS } = {}) {
  // Both checks wait for OST / M@S to render first.
  const hydrated = new Promise((resolve) => { setTimeout(resolve, delayMs); });
  return [
    hydrated.then(async () => {
      const { unpublished, scanned } = await checkUnpublishedFragments({ area, locale });
      const failed = unpublished.length > 0;
      return {
        name: 'M@S Unpublished Fragments',
        status: failed ? 'fail' : 'pass',
        severity: SEVERITY.CRITICAL,
        details: failed ? { unpublished, scanned } : { scanned },
      };
    }),
    hydrated.then(() => checkStaticPrices(area)),
  ];
}
