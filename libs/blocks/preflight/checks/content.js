import { getConfig } from '../../../utils/utils.js';
import { replaceText } from '../../../features/placeholders.js';
import { getPageStatus, isCrossRepo } from './adminStatus.js';
import { isConfirmedUnpublished } from './diff/versionHelpers.js';
import { SEVERITY, STATUS } from './constants.js';

// Same pattern placeholders.js uses to decorate the page.
const PLACEHOLDER_REGEX = /{{(.*?)}}|%7B%7B(.*?)%7D%7D/g;
const RENDERED_PAGE = 'rendered page';
const SKIPPED_TAGS = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE'];

const CHECKS = {
  fragments: { checkId: 'unpublished-fragments', title: 'Unpublished fragments' },
  placeholders: { checkId: 'unresolved-placeholders', title: 'Unresolved placeholders' },
};

const count = (n, noun) => `${n} ${noun}${n === 1 ? '' : 's'}`;

const result = (check, status, description, details) => (
  { ...CHECKS[check], severity: SEVERITY.CRITICAL, status, description, details });

function toRef(path, failed) {
  let url;
  try {
    url = new URL(path, window.location.origin);
  } catch {
    return null;
  }
  if (!url.protocol.startsWith('http')) return null;
  const isSameOrigin = url.origin === window.location.origin;
  return { path: isSameOrigin ? url.pathname : `${url.origin}${url.pathname}`, url, failed };
}

// Loaded fragments (incl. inline and nested) keep data-path; modal fragments only load
// on click so they stay links; an autoblock link still classed .fragment never loaded.
export function findFragments(area) {
  const root = area.querySelector('main') ?? area;
  const refs = [
    ...[...root.querySelectorAll('[data-path]')].map((el) => toRef(el.dataset.path, false)),
    ...[...root.querySelectorAll('a[data-modal-path]')].map((a) => toRef(a.dataset.modalPath, false)),
    ...[...root.querySelectorAll('a.fragment:not([data-modal-path])')].map((a) => toRef(a.href, true)),
  ].filter(Boolean);
  const byPath = new Map();
  refs.forEach((ref) => {
    if (!byPath.has(ref.path) || ref.failed) byPath.set(ref.path, ref);
  });
  return [...byPath.values()];
}

const getPublishStatus = (url) => getPageStatus(url).catch(() => null);

export async function checkUnpublishedFragments(area) {
  const fragments = findFragments(area);
  if (!fragments.length) return result('fragments', STATUS.PASS, 'No fragments on this page.', { items: [], unchecked: [] });

  const loaded = fragments.filter(({ failed }) => !failed);
  const statuses = await Promise.all(loaded.map(({ url }) => getPublishStatus(url)));
  const unchecked = loaded.filter((_, i) => !statuses[i]).map(({ path }) => path);
  const items = [
    ...loaded.filter((_, i) => statuses[i] && isConfirmedUnpublished({ status: statuses[i] }))
      .map(({ path }) => ({ path, reason: 'unpublished' })),
    ...fragments.filter(({ failed }) => failed).map(({ path }) => ({ path, reason: 'failed-to-load' })),
  ];

  const details = { items, unchecked };
  const unpublished = items.filter(({ reason }) => reason === 'unpublished').length;
  const failed = items.length - unpublished;
  const uncheckedText = unchecked.length ? ` Couldn't check the publish status of ${count(unchecked.length, 'fragment')}.` : '';
  if (items.length) {
    const description = [
      unpublished && `${count(unpublished, 'fragment')} ${unpublished === 1 ? "isn't published, so it" : "aren't published, so they"} will be missing on the live page.`,
      failed && `${count(failed, 'fragment')} failed to load on this page.`,
    ].filter(Boolean).join(' ');
    return result('fragments', STATUS.FAIL, `${description}${uncheckedText}`, details);
  }
  if (unchecked.length) {
    return result('fragments', STATUS.LIMBO, `${uncheckedText.trim()} You may not be signed in to Sidekick, or the server is busy. Run Preflight again.`, details);
  }
  return result('fragments', STATUS.PASS, `Every fragment is published (${fragments.length} checked).`, details);
}

const extractKeys = (text) => [...text.matchAll(PLACEHOLDER_REGEX)]
  .map((match) => match[1] || match[2]).filter(Boolean);

function findRawKeys(area) {
  const roots = [...area.querySelectorAll('main, header, footer')];
  return (roots.length ? roots : [area]).flatMap((root) => {
    const keys = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ALL);
    for (let node = walker.currentNode; node; node = walker.nextNode()) {
      if (node.nodeType === Node.TEXT_NODE) {
        const isSkipped = SKIPPED_TAGS.includes(node.parentElement?.nodeName);
        if (!isSkipped) keys.push(...extractKeys(node.nodeValue));
      } else {
        [...(node.attributes ?? [])].forEach(({ value }) => keys.push(...extractKeys(value)));
      }
    }
    return keys;
  });
}

const sourceUrl = (url) => `${url.origin}${url.pathname.endsWith('/') ? `${url.pathname}index` : url.pathname}.plain.html`;

async function fetchSourceKeys({ path, url }) {
  const resp = await fetch(sourceUrl(url)).catch(() => null);
  if (!resp?.ok) return { path, failed: true, keys: [] };
  return { path, keys: extractKeys(await resp.text()) };
}

// A missing key renders as the key with spaces (placeholders.js keyToStr), so that is the
// tell; keys present in a loaded sheet (window.mph) whose value happens to match are fine.
async function isMissing(key) {
  const config = getConfig();
  const value = await replaceText(`{{${key}}}`, config);
  if (value !== key.replaceAll('-', ' ')) return false;
  return typeof window.mph?.[key] !== 'string' && typeof config.placeholders?.[key] !== 'string';
}

export async function checkUnresolvedPlaceholders(area) {
  const page = toRef(window.location.pathname, false);
  const fragments = findFragments(area)
    .filter(({ url, failed }) => !failed && url.origin === window.location.origin
      && !isCrossRepo(url.pathname));
  const sources = await Promise.all([page, ...fragments].map(fetchSourceKeys));
  const authored = sources.flatMap(({ path, keys }) => keys
    .filter((key) => !key.endsWith('-geo-ip'))
    .map((key) => ({ key, where: path })));
  const raw = findRawKeys(area).map((key) => ({ key, where: RENDERED_PAGE }));
  const unique = [...new Map([...authored, ...raw]
    .map((item) => [`${item.key} ${item.where}`, item])).values()];
  const missing = await Promise.all(unique.map(({ key, where }) => (
    where === RENDERED_PAGE || isMissing(key))));
  const items = unique.filter((_, i) => missing[i]);
  const unloaded = sources.filter(({ failed }) => failed).length;
  const details = { items };

  if (items.length) {
    return result('placeholders', STATUS.FAIL, `${count(items.length, 'placeholder')} ${items.length === 1 ? "doesn't" : "don't"} resolve, so the page shows the key text instead of a value.`, details);
  }
  if (unloaded) {
    return result('placeholders', STATUS.LIMBO, `Couldn't load ${count(unloaded, 'page or fragment source')} to check placeholders. Try running Preflight again.`, details);
  }
  if (!unique.length) return result('placeholders', STATUS.PASS, 'No placeholders on this page.', details);
  return result('placeholders', STATUS.PASS, `Every placeholder resolves (${new Set(unique.map(({ key }) => key)).size} checked).`, details);
}

const runSafely = (check, run) => run().catch((e) => result(check, STATUS.LIMBO, `Couldn't run this check: ${e.message}`, { items: [] }));

export function runChecks({ area = document } = {}) {
  return [
    runSafely('fragments', () => checkUnpublishedFragments(area)),
    runSafely('placeholders', () => checkUnresolvedPlaceholders(area)),
  ];
}
