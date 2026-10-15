/* eslint-disable no-console */
import { getConfig, isTrustedUrl } from '../../../utils/utils.js';
import { normalizePath } from '../../personalization/personalization.js';

export const NEAR_DUP_MAX_DISTANCE = 8;
export const NEAR_DUP_REVIEW_DISTANCE = 12;
const VIEWPORTS = ['phone', 'tablet', 'desktop'];
// mirrors decorateBlockBg: 1 cell = all viewports, 2 = phone | tablet+desktop, 3 = one each
const BG_CELL_VIEWPORTS = {
  1: [VIEWPORTS],
  2: [['phone'], ['tablet', 'desktop']],
  3: [['phone'], ['tablet'], ['desktop']],
};
const HIDDEN_MEDIA_CLASSES = {
  phone: 'media-hidden-mobile',
  tablet: 'media-hidden-tablet',
  desktop: 'media-hidden-desktop',
};
const DEVICE_VIEWPORTS = {
  phone: ['phone'],
  tablet: ['tablet'],
  desktop: ['desktop'],
  'mobile-device': ['phone', 'tablet'],
};
const MAX_CONCURRENT = 4;
const MAX_FRAGMENT_DEPTH = 2;
const HASH_IMAGE_PARAMS = 'width=64&format=png&optimize=medium';
const MEDIA_RE = /media_[0-9a-f]+\.[a-z0-9]+/i;
const NON_CONTENT_ACTIONS = ['remove', 'updateattribute'];
const LOG_TITLE = 'MEP LCP image checks';
const FIRST_SECTION_RE = /^main>div(:first-child|:first-of-type|:nth-child\(1\)|:nth-of-type\(1\))?(?=$|[\s>])/;

const checkedVariants = new Set();
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
    root: clone,
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

export const findHeroBlock = (root) => root?.querySelector('.marquee, .hero-marquee') || null;

const isPoster = (img) => (img.getAttribute('alt') || '').includes('.mp4')
  || !!img.closest('div')?.querySelector('a[href*=".mp4"]');

export function getViewportImages(block, baseUrl) {
  const byViewport = Object.fromEntries(VIEWPORTS.map((vp) => [vp, []]));
  const add = (img, viewports, role) => {
    let src;
    try {
      src = new URL(img.getAttribute('src'), baseUrl).href;
    } catch {
      return;
    }
    const name = getMediaName(src);
    if (name) viewports.forEach((vp) => byViewport[vp].push({ src, name, role }));
  };
  const rows = [...block.children];
  let fgRows = rows;
  const [bgRow] = rows;
  if (rows.length > 1 && (bgRow.textContent.trim() || bgRow.querySelector('img'))) {
    const cells = [...bgRow.children];
    const count = Math.min(Math.max(cells.length, 1), 3);
    const targets = cells.length > 1 ? cells.slice(0, 3) : [bgRow];
    targets.forEach((cell, i) => cell.querySelectorAll('img[src*="media_"]')
      .forEach((img) => add(img, BG_CELL_VIEWPORTS[count][i], `background cell ${i + 1} of ${count}`)));
    fgRows = rows.slice(1);
  }
  const shown = VIEWPORTS.filter((vp) => !block.classList.contains(HIDDEN_MEDIA_CLASSES[vp]));
  fgRows.forEach((row) => row.querySelectorAll('img[src*="media_"]')
    .forEach((img) => add(img, shown, isPoster(img) ? 'foreground video poster' : 'foreground image')));
  return byViewport;
}

export function getHeroLayout(block) {
  const byViewport = getViewportImages(block, window.location.href);
  return VIEWPORTS
    .map((vp) => `${vp}: ${byViewport[vp].map(({ role }) => role).join(', ') || 'none'}`)
    .join('; ');
}

export async function getPageHero(snapshot) {
  const block = findHeroBlock(snapshot?.root);
  if (block) return { block, baseUrl: window.location.href };
  const fragments = await Promise.all((snapshot?.fragments || [])
    .map(getFragmentUrl)
    .filter(Boolean)
    .map(async (url) => ({
      block: findHeroBlock((await fetchFragmentDoc(url))?.body),
      baseUrl: `${url}.plain.html`,
    })));
  return fragments.find((frag) => frag.block) || null;
}

async function getCandidateRoot({ fragmentUrl, replacePage }) {
  const body = (await fetchFragmentDoc(fragmentUrl))?.body;
  if (!replacePage) return body;
  return body?.querySelector(':scope > div') || null;
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
  if (best && best.distance <= NEAR_DUP_REVIEW_DISTANCE) return { ...best, unable };
  return { unable };
}

// variant names use MEP syntax: "," is OR, "&" is AND, "not " negates
export function getVariantViewports(variant = '') {
  if (variant.startsWith('target-')) return VIEWPORTS;
  const viewports = new Set();
  variant.split(/,(?![^(]*\))/).forEach((term) => {
    let allowed = VIEWPORTS;
    term.split('&').map((token) => token.trim().toLowerCase()).forEach((token) => {
      const negated = token.startsWith('not ');
      const device = DEVICE_VIEWPORTS[negated ? token.slice(4).trim() : token];
      if (device) allowed = allowed.filter((vp) => device.includes(vp) !== negated);
    });
    allowed.forEach((vp) => viewports.add(vp));
  });
  return VIEWPORTS.filter((vp) => viewports.has(vp));
}

async function compareByViewport(fragmentBlock, candidate, pageHero) {
  const pageByViewport = getViewportImages(pageHero.block, pageHero.baseUrl);
  const fragByViewport = getViewportImages(fragmentBlock, `${candidate.fragmentUrl}.plain.html`);
  const pageLayout = getHeroLayout(pageHero.block);
  const fragmentLayout = getHeroLayout(fragmentBlock);
  const layout = pageLayout === fragmentLayout
    ? null
    : { page: pageLayout, fragment: fragmentLayout };
  const matches = new Map();
  const unable = [];
  await Promise.all(getVariantViewports(candidate.variant).flatMap((vp) => fragByViewport[vp]
    .map(async (fragImg) => {
      const pageImages = pageByViewport[vp];
      if (!pageImages.length) return;
      const result = await compareImages(fragImg.src, pageImages.map(({ src }) => src));
      if (!result) return;
      unable.push(...result.unable);
      if (result.distance === undefined) return;
      const pageImg = pageImages.find(({ src }) => src === result.pageImage);
      // a page may reuse one file in several cells (e.g. tablet background + desktop foreground)
      const key = `${fragImg.name}|${fragImg.role}|${pageImg.name}`;
      if (!matches.has(key)) {
        matches.set(key, {
          fragmentImage: fragImg.src,
          fragmentRole: fragImg.role,
          pageImage: pageImg.src,
          pageRoles: [],
          distance: result.distance,
          viewports: [],
          layout,
        });
      }
      const match = matches.get(key);
      match.viewports.push(vp);
      if (!match.pageRoles.includes(pageImg.role)) match.pageRoles.push(pageImg.role);
    })));
  const byOrder = (a, b) => VIEWPORTS.indexOf(a) - VIEWPORTS.indexOf(b);
  matches.forEach((match) => match.viewports.sort(byOrder));
  return { matches: [...matches.values()], unable };
}

async function compareAnyImage(root, fragmentUrl, pageImages) {
  const images = root ? await getFragmentImages(fragmentUrl, root) : [];
  const results = await Promise.all(images.map(async (fragmentImage) => {
    const result = await compareImages(fragmentImage, pageImages);
    return result && { ...result, fragmentImage };
  }));
  const valid = results.filter(Boolean);
  return {
    matches: valid
      .filter((r) => r.distance !== undefined)
      .map(({ fragmentImage, pageImage, distance }) => ({ fragmentImage, pageImage, distance })),
    unable: valid.flatMap((r) => r.unable),
  };
}

export async function findNearDuplicates(experiments, snapshot) {
  const findings = [];
  const unable = new Set();
  const [pageImages, pageHero] = await Promise.all([
    getPageLcpImages(snapshot),
    getPageHero(snapshot),
  ]);
  if (!pageImages.length) return { findings, unable: [] };
  const candidates = experiments.flatMap((exp) => getHeroCandidates(exp, snapshot.fragments));
  await Promise.all(candidates.map(async (candidate) => {
    const { variant, action, selector, fragmentUrl, manifestPath } = candidate;
    const root = await getCandidateRoot(candidate);
    const fragmentBlock = findHeroBlock(root);
    const { matches, unable: missed } = pageHero && fragmentBlock
      ? await compareByViewport(fragmentBlock, candidate, pageHero)
      : await compareAnyImage(root, fragmentUrl, pageImages);
    missed.forEach((msg) => unable.add(msg));
    matches.forEach((match) => findings.push({
      type: 'near-duplicate',
      match: match.distance <= NEAR_DUP_MAX_DISTANCE ? 'near-duplicate' : 'possible',
      manifestPath,
      variant,
      action,
      selector,
      fragmentUrl,
      viewports: null,
      ...match,
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

const describeVerdict = (f) => (f.match === 'possible'
  ? `possible near-duplicate (distance ${f.distance}, ${NEAR_DUP_MAX_DISTANCE + 1}-${NEAR_DUP_REVIEW_DISTANCE}: check visually)`
  : `near-duplicate (distance ${f.distance}, <= ${NEAR_DUP_MAX_DISTANCE})`);

const describeImageFix = (f, i) => {
  const fragName = getMediaName(f.fragmentImage);
  const pageName = getMediaName(f.pageImage);
  if (!f.viewports) {
    return [
      `  ${i}. fragment image: ${f.fragmentImage}`,
      `     page image: ${f.pageImage}`,
      `     ${describeVerdict(f)}, viewport unknown (no marquee found to map cells)`,
      `     fix: reuse ${pageName} from the page hero instead of ${fragName}`,
    ];
  }
  return [
    `  ${i}. ${f.viewports.join(', ')}: fragment ${f.fragmentRole} ${fragName} is a ${describeVerdict(f)}`,
    `     of page ${f.pageRoles.join(' and ')} ${pageName}`,
    `     fix: copy the image from the page hero ${f.pageRoles[0]} into the fragment hero ${f.fragmentRole} so both use ${pageName}`,
  ];
};

const describeNearDuplicates = (group) => {
  const [first] = group;
  const lines = [
    `${first.manifestPath} | variant "${first.variant}" | ${first.action} "${first.selector}"`,
    `  fragment: ${first.fragmentUrl}`,
    ...group.flatMap((f, i) => describeImageFix(f, i + 1)),
  ];
  const { layout } = group.find((f) => f.layout) || {};
  if (layout) {
    lines.push(
      '  note: hero layouts differ, so match images by viewport, not by cell position',
      `    page: ${layout.page}`,
      `    fragment: ${layout.fragment}`,
    );
  }
  return lines.join('\n');
};

const groupByFragment = (findings) => {
  const groups = new Map();
  findings.forEach((f) => {
    const key = [f.manifestPath, f.variant, f.action, f.selector, f.fragmentUrl].join('|');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(f);
  });
  return [...groups.values()];
};

export function logFindings({ findings, unable }) {
  if (!findings.length && !unable.length) return;
  console.groupCollapsed(`${LOG_TITLE} (${findings.length})`);
  findings.filter((f) => f.type === 'hidden-image').forEach((f) => console.log(
    `Hidden ${f.source} image in the LCP area still downloads: ${f.image}\n`
    + `  hidden block: ${f.block}\n`
    + `  manifests in LCP area: ${f.manifests.join(', ') || 'unknown'}\n`
    + '  remove the hidden content instead of hiding it with CSS, or reuse the visible hero image',
  ));
  groupByFragment(findings.filter((f) => f.type === 'near-duplicate'))
    .forEach((group) => console.log(describeNearDuplicates(group)));
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

const isFromTargetOrAjo = (exp) => !!exp.source?.some((src) => src === 'target' || src === 'ajo');

// target- variants only run when Target/AJO or a ?mep= override picks them
export function getVariantsToCheck(experiments = [], variantOverride = {}) {
  const byPath = new Map();
  experiments.forEach((exp) => {
    if (!exp?.variants || !exp.manifestPath) return;
    const fromTarget = isFromTargetOrAjo(exp);
    const forced = variantOverride?.[exp.manifestPath];
    Object.entries(exp.variants).forEach(([name, info]) => {
      if (!fromTarget && name.toLowerCase().startsWith('target-') && name !== forced) return;
      const key = `${exp.manifestPath}|${name}`;
      if (checkedVariants.has(key)) return;
      checkedVariants.add(key);
      if (!byPath.has(exp.manifestPath)) byPath.set(exp.manifestPath, { ...exp, variants: {} });
      byPath.get(exp.manifestPath).variants[name] = info;
    });
  });
  return [...byPath.values()];
}

export default async function init() {
  const { mep } = getConfig();
  if (!mep?.preview || !mep.lcpSection) return [];
  const experiments = getVariantsToCheck(mep.lcpExperiments, mep.variantOverride);
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
