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
  const params = new URLSearchParams({ id: uuid, api_key: API_KEY, locale });
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

  // eslint-disable-next-line no-console
  console.log(
    '[preflight][mas] scanned %d fragment(s); %d unpublished: %o',
    uuids.length,
    unpublished.length,
    unpublished.map((u) => u.uuid),
  );

  return { unpublished, scanned: uuids.length };
}

export function runChecks({ area = document, locale, delayMs = HYDRATION_DELAY_MS } = {}) {
  return [(async () => {
    if (delayMs > 0) {
      await new Promise((resolve) => { setTimeout(resolve, delayMs); });
    }
    const { unpublished, scanned } = await checkUnpublishedFragments({ area, locale });
    const failed = unpublished.length > 0;
    return {
      name: 'M@S Unpublished Fragments',
      status: failed ? 'fail' : 'pass',
      severity: SEVERITY.CRITICAL,
      details: failed ? { unpublished, scanned } : { scanned },
    };
  })()];
}
