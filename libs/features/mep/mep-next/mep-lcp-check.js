/* eslint-disable no-console */
import { getConfig, isTrustedUrl } from '../../../utils/utils.js';
import { normalizePath } from '../../personalization/personalization.js';

export const NEAR_DUP_MAX_DISTANCE = 8;
const MAX_CONCURRENT = 4;
const MAX_FRAGMENT_DEPTH = 2;
const HASH_IMAGE_PARAMS = 'width=64&format=png&optimize=medium';
const MEDIA_RE = /media_[0-9a-f]+\.[a-z0-9]+/i;
const NON_CONTENT_ACTIONS = ['remove', 'updateattribute'];
const LOG_TITLE = 'MEP LCP image checks';
const FIRST_SECTION_RE = /^main>div(:first-child|:first-of-type|:nth-child\(1\)|:nth-of-type\(1\))?(?=$|[\s>])/;

const checkedManifests = new Set();
const reportedHidden = new Set();
const fragmentCache = new Map();
const hashCache = new Map();

export const getMediaName = (url) => url?.match(MEDIA_RE)?.[0].toLowerCase() || null;

export function createLimiter(max = MAX_CONCURRENT) {
  let active = 0;
  const queue = [];
  const next = () => {
    if (active >= max || !queue.length) return;
    active += 1;
    const { fn, resolve, reject } = queue.shift();
    fn().then(resolve, reject).finally(() => {
      active -= 1;
      next();
    });
  };
  return (fn) => new Promise((resolve, reject) => {
    queue.push({ fn, resolve, reject });
    next();
  });
}

const limit = createLimiter();

export function computeDHash(img) {
  const canvas = document.createElement('canvas');
  canvas.width = 9;
  canvas.height = 8;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, 9, 8);
  ctx.drawImage(img, 0, 0, 9, 8);
  const { data } = ctx.getImageData(0, 0, 9, 8);
  const gray = [];
  for (let i = 0; i < data.length; i += 4) {
    gray.push(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
  }
  const bits = [];
  for (let y = 0; y < 8; y += 1) {
    for (let x = 0; x < 8; x += 1) {
      bits.push(gray[y * 9 + x + 1] > gray[y * 9 + x] ? 1 : 0);
    }
  }
  return bits;
}

export const getHammingDistance = (a, b) => a
  .reduce((sum, bit, i) => sum + (bit !== b[i] ? 1 : 0), 0);

export function getHashUrl(src) {
  const url = new URL(src, window.location.href);
  if (/\.(aem|hlx)\.(page|live)$/.test(url.hostname) && url.origin !== window.location.origin) {
    url.host = window.location.host;
    url.protocol = window.location.protocol;
  }
  url.search = HASH_IMAGE_PARAMS;
  url.hash = '';
  return url.href;
}

const loadImage = (src) => new Promise((resolve, reject) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => resolve(img);
  img.onerror = () => reject(new Error(`Unable to load ${src}`));
  img.src = src;
});

export function getImageHash(src) {
  const key = getMediaName(src) || src;
  if (!hashCache.has(key)) {
    hashCache.set(key, limit(async () => {
      try {
        return { hash: computeDHash(await loadImage(getHashUrl(src))) };
      } catch (e) {
        return { error: e.message };
      }
    }));
  }
  return hashCache.get(key);
}

const getSrcsetUrl = (srcset) => srcset?.split(',')[0]?.trim().split(/\s+/)[0];

export function getMediaUrls(root, baseUrl) {
  const srcs = [
    ...[...root.querySelectorAll('img[src]')].map((img) => img.getAttribute('src')),
    ...[...root.querySelectorAll('source[srcset]')].map((s) => getSrcsetUrl(s.getAttribute('srcset'))),
  ];
  const byName = new Map();
  srcs.forEach((src) => {
    const name = getMediaName(src);
    if (!name || byName.has(name)) return;
    try {
      byName.set(name, new URL(src, baseUrl).href);
    } catch {
      // ignore malformed src
    }
  });
  return [...byName.values()];
}

export const getFragmentLinks = (root, baseUrl) => [...root.querySelectorAll('a[href*="/fragments/"]')]
  .map((a) => {
    try {
      return new URL(a.getAttribute('href'), baseUrl).href;
    } catch {
      return null;
    }
  })
  .filter(Boolean);

export function getFragmentUrl(path) {
  if (!path) return null;
  try {
    const normalized = normalizePath(path);
    if (!isTrustedUrl(normalized)) return null;
    const url = new URL(normalized, window.location.origin);
    url.hash = '';
    url.search = '';
    return url.href.replace(/\.(plain\.)?html$/, '');
  } catch {
    return null;
  }
}

function fetchFragmentDoc(fragmentUrl) {
  if (!fragmentCache.has(fragmentUrl)) {
    fragmentCache.set(fragmentUrl, limit(async () => {
      try {
        const resp = await fetch(`${fragmentUrl}.plain.html`);
        if (!resp.ok) return null;
        const type = resp.headers.get('content-type') || '';
        if (!type.includes('text/html')) return null;
        return new DOMParser().parseFromString(await resp.text(), 'text/html');
      } catch {
        return null;
      }
    }));
  }
  return fragmentCache.get(fragmentUrl);
}

export async function getFragmentImages(fragmentUrl, root, depth = 0) {
  let el = root;
  if (!el) el = (await fetchFragmentDoc(fragmentUrl))?.body;
  if (!el) return [];
  const images = getMediaUrls(el, `${fragmentUrl}.plain.html`);
  if (depth >= MAX_FRAGMENT_DEPTH - 1) return images;
  const nested = await Promise.all(getFragmentLinks(el, fragmentUrl)
    .map(getFragmentUrl)
    .filter(Boolean)
    .map((url) => getFragmentImages(url, null, depth + 1)));
  return [...images, ...nested.flat()];
}

export function getLcpSnapshot(lcpSection) {
  if (!lcpSection?.clone) return null;
  const { original, clone } = lcpSection;
  const toUrl = (src) => new URL(src, window.location.href).href;
  const sources = [...clone.querySelectorAll('source[srcset*="media_"]')]
    .map((s) => toUrl(s.getAttribute('srcset').split(',')[0].trim().split(/\s+/)[0]));
  return {
    section: original,
    images: [...[...clone.querySelectorAll('img[src*="media_"]')].map((img) => toUrl(img.getAttribute('src'))), ...sources],
    fragments: [...clone.querySelectorAll('a[href*="/fragments/"]')].map((a) => toUrl(a.getAttribute('href'))),
  };
}

export async function getPageLcpImages(snapshot) {
  if (!snapshot) return [];
  const nested = await Promise.all(snapshot.fragments
    .map(getFragmentUrl)
    .filter(Boolean)
    .map((url) => getFragmentImages(url, null, 1)));
  const byName = new Map();
  [...snapshot.images, ...nested.flat()].forEach((src) => {
    const name = getMediaName(src);
    if (name && !byName.has(name)) byName.set(name, src);
  });
  return [...byName.values()];
}

const getPathname = (url) => {
  try {
    return new URL(url, window.location.origin).pathname.replace(/\.(plain\.)?html$/, '');
  } catch {
    return null;
  }
};

export function isHeroSelector(selector, pageFragments = []) {
  const sel = selector?.split(/\s+#_/)[0].trim().toLowerCase();
  if (!sel) return false;
  if (sel.startsWith('/') || sel.startsWith('http')) {
    const paths = [normalizePath(sel, false), normalizePath(sel, true)].map(getPathname);
    return pageFragments.some((frag) => paths.includes(getPathname(frag)));
  }
  const compact = sel.replace(/\s*>\s*/g, '>').replace(/^body>/, '');
  if (FIRST_SECTION_RE.test(compact)) return true;
  const first = compact.replace(/^main>?/, '').split(/[\s>]+/)[0];
  const num = first.match(/\d+$/)?.[0];
  if (num && num !== '1') return false;
  const term = first.replace(/\d+$/, '');
  return term === 'section' || term.replace(/^\./, '').includes('marquee');
}

export function getHeroCandidates(experiment, pageFragments = []) {
  const { variants, manifestPath } = experiment;
  if (!variants) return [];
  const candidates = [];
  Object.entries(variants).forEach(([variant, info]) => {
    info.commands?.forEach(({ action, selector, content }) => {
      if (NON_CONTENT_ACTIONS.includes(action)) return;
      if (!/^\s*(\/|http)/.test(content) || !isHeroSelector(selector, pageFragments)) return;
      const fragmentUrl = getFragmentUrl(content);
      if (!fragmentUrl) return;
      candidates.push({ variant, action, selector, fragmentUrl });
    });
    info.fragments?.forEach(({ action, selector, val }) => {
      if (NON_CONTENT_ACTIONS.includes(action)) return;
      if (!isHeroSelector(selector, pageFragments)) return;
      const fragmentUrl = getFragmentUrl(val);
      if (fragmentUrl) candidates.push({ variant, action, selector, fragmentUrl });
    });
    info.replacepage?.forEach(({ val }) => {
      const fragmentUrl = getFragmentUrl(val);
      if (fragmentUrl) {
        candidates.push({ variant, action: 'replacepage', selector: '', fragmentUrl, replacePage: true });
      }
    });
  });
  return candidates.map((c) => ({ ...c, manifestPath }));
}

async function getCandidateImages({ fragmentUrl, replacePage }) {
  if (!replacePage) return getFragmentImages(fragmentUrl);
  const doc = await fetchFragmentDoc(fragmentUrl);
  const firstSection = doc?.body.querySelector(':scope > div');
  return firstSection ? getFragmentImages(fragmentUrl, firstSection) : [];
}

export async function compareImages(fragmentImage, pageImages) {
  const pageNames = pageImages.map(getMediaName);
  if (pageNames.includes(getMediaName(fragmentImage))) return null;
  const fragHash = await getImageHash(fragmentImage);
  if (fragHash.error) return { unable: [fragHash.error] };
  const results = await Promise.all(pageImages.map(async (pageImage) => {
    const pageHash = await getImageHash(pageImage);
    if (pageHash.error) return { error: pageHash.error };
    return { pageImage, distance: getHammingDistance(fragHash.hash, pageHash.hash) };
  }));
  const unable = results.filter((r) => r.error).map((r) => r.error);
  const best = results
    .filter((r) => !r.error)
    .sort((a, b) => a.distance - b.distance)[0];
  if (best && best.distance <= NEAR_DUP_MAX_DISTANCE) return { ...best, unable };
  return { unable };
}

export async function findNearDuplicates(experiments, snapshot) {
  const findings = [];
  const unable = new Set();
  const pageImages = await getPageLcpImages(snapshot);
  if (!pageImages.length) return { findings, unable: [] };
  const candidates = experiments.flatMap((exp) => getHeroCandidates(exp, snapshot.fragments));
  await Promise.all(candidates.map(async (candidate) => {
    const images = await getCandidateImages(candidate);
    await Promise.all(images.map(async (fragmentImage) => {
      const result = await compareImages(fragmentImage, pageImages);
      if (!result) return;
      result.unable?.forEach((msg) => unable.add(msg));
      if (result.distance === undefined) return;
      const { variant, action, selector, fragmentUrl, manifestPath } = candidate;
      findings.push({
        type: 'near-duplicate',
        manifestPath,
        variant,
        action,
        selector,
        fragmentUrl,
        fragmentImage,
        pageImage: result.pageImage,
        distance: result.distance,
      });
    }));
  }));
  return { findings, unable: [...unable] };
}

const isRendered = (el) => el.getClientRects().length > 0;

const wasRequested = (name) => performance.getEntriesByType('resource')
  .some((entry) => getMediaName(entry.name) === name);

const getLcpAreaSections = (originalSection) => {
  const sections = [...document.querySelectorAll('body > main > div')];
  return sections.slice(0, Math.max(sections.indexOf(originalSection), 0) + 1);
};

// sections (including fragment sections) stay display:none while data-status is set
const isSettled = (sections) => sections.every((section) => section.classList.contains('section')
  && !section.dataset.status && !section.querySelector('.section[data-status]'));

export const whenLcpAreaSettled = (originalSection, timeout = 10000, interval = 200) => (
  new Promise((resolve) => {
    const start = Date.now();
    const check = () => {
      if (isSettled(getLcpAreaSections(originalSection))) resolve(true);
      else if (Date.now() - start >= timeout) resolve(false);
      else setTimeout(check, interval);
    };
    check();
  }));

export function findHiddenHeroImages(pageImageNames, originalSection) {
  const scanned = getLcpAreaSections(originalSection);
  const manifests = [...new Set(scanned.flatMap((section) => [
    section.dataset.manifestId,
    ...[...section.querySelectorAll('[data-manifest-id]')].map((el) => el.dataset.manifestId),
  ]).filter(Boolean))];
  if (!manifests.length) return [];
  const images = scanned.flatMap((section) => [...section.querySelectorAll('img[src*="media_"]')]);
  // responsive marquees hide per-viewport copies of media that is also shown visibly
  const visibleNames = new Set(images.filter(isRendered)
    .map((img) => getMediaName(img.getAttribute('src'))));
  const findings = [];
  scanned.forEach((section) => {
    section.querySelectorAll('img[src*="media_"]').forEach((img) => {
      const name = getMediaName(img.getAttribute('src'));
      const block = img.closest('main > div > div') || section;
      if (isRendered(block) || visibleNames.has(name) || !wasRequested(name)) return;
      const label = img.closest('[data-path]')?.dataset.path
        || img.closest('[class*="marquee"]')?.classList[0]
        || block.classList[0]
        || 'section';
      const key = `${name}|${label}`;
      if (reportedHidden.has(key)) return;
      reportedHidden.add(key);
      findings.push({
        type: 'hidden-image',
        source: pageImageNames.includes(name) ? 'page' : 'inserted',
        image: img.currentSrc || img.src,
        block: label,
        manifests,
      });
    });
  });
  return findings;
}

export function logFindings({ findings, unable }) {
  if (!findings.length && !unable.length) return;
  console.groupCollapsed(`${LOG_TITLE} (${findings.length})`);
  findings.filter((f) => f.type === 'hidden-image').forEach((f) => console.warn(
    `Hidden ${f.source} image in the LCP area still downloads: ${f.image}\n`
    + `  hidden block: ${f.block}\n`
    + `  manifests in LCP area: ${f.manifests.join(', ') || 'unknown'}\n`
    + '  remove the hidden content instead of hiding it with CSS, or reuse the visible hero image',
  ));
  findings.filter((f) => f.type === 'near-duplicate').forEach((f) => console.warn(
    `${f.manifestPath} | variant "${f.variant}" | ${f.action} "${f.selector}"\n`
    + `  fragment: ${f.fragmentUrl}\n`
    + `  fragment image: ${f.fragmentImage}\n`
    + `  page image: ${f.pageImage}\n`
    + `  distance: ${f.distance} (<= ${NEAR_DUP_MAX_DISTANCE} is a near-duplicate; reuse ${getMediaName(f.pageImage)} from the page)`,
  ));
  unable.forEach((msg) => console.info(`Unable to compare: ${msg}`));
  console.groupEnd();
}

const whenIdle = () => new Promise((resolve) => {
  const run = () => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(resolve, { timeout: 5000 });
    else setTimeout(resolve);
  };
  if (document.readyState === 'complete') run();
  else window.addEventListener('load', run, { once: true });
});

export default async function init() {
  const { mep } = getConfig();
  if (!mep?.preview || !mep.lcpSection) return [];
  const experiments = (mep.lcpExperiments || []).filter((exp) => {
    if (!exp?.variants || checkedManifests.has(exp.manifestPath)) return false;
    checkedManifests.add(exp.manifestPath);
    return true;
  });
  if (!experiments.length) return mep.lcpFindings || [];
  await whenIdle();
  mep.lcpSnapshot ??= getLcpSnapshot(mep.lcpSection);
  const result = await findNearDuplicates(experiments, mep.lcpSnapshot);
  const pageImageNames = (await getPageLcpImages(mep.lcpSnapshot)).map(getMediaName);
  if (await whenLcpAreaSettled(mep.lcpSnapshot.section)) {
    result.findings.push(...findHiddenHeroImages(pageImageNames, mep.lcpSnapshot.section));
  }
  mep.lcpFindings = [...(mep.lcpFindings || []), ...result.findings];
  logFindings(result);
  return mep.lcpFindings;
}
