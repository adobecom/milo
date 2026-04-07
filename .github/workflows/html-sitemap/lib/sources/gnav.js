import path from 'node:path';
import { parse } from 'parse5';
import { fetchText } from '../util/fetch.js';

const FEDERAL_GNAV_PATH = '/federal/globalnav/acom/acom-gnav';
const FEDERAL_ORIGIN = 'https://main--federal--adobecom.aem.live';
const EXCLUDED_SECTIONS = ['section-menu-dx'];

/**
 * @typedef {Object} ParsedNode
 * @property {string} [tagName]
 * @property {string} [nodeName]
 * @property {string} [value]
 * @property {{ name: string, value: string }[]} [attrs]
 * @property {ParsedNode[]} [childNodes]
 */

/**
 * @typedef {Object} GnavArtifact
 * @property {string} file
 * @property {'top-level' | 'section' | 'inline-column'} kind
 * @property {string} sourceUrl
 * @property {string} sourcePath
 * @property {string | null} parentFile
 * @property {string} [heading]
 * @property {string} content
 */

/**
 * @typedef {{ ok: false, warning: string } | { ok: true, sourceOrigin: string, artifacts: GnavArtifact[] }} GnavExtractResult
 */

/**
 * @param {string} baseGeo
 * @returns {string}
 */
function getGeoPrefix(baseGeo) {
  return baseGeo ? `/${baseGeo}` : '';
}

/**
 * @param {string} baseGeo
 * @param {string} resourcePath
 * @returns {string}
 */
function prefixLocalizedPath(baseGeo, resourcePath) {
  if (!baseGeo || !resourcePath.startsWith('/')) return resourcePath;
  const prefix = getGeoPrefix(baseGeo);
  if (resourcePath === prefix || resourcePath.startsWith(`${prefix}/`)) return resourcePath;
  return `${prefix}${resourcePath}`;
}

/**
 * @param {ParsedNode} node
 * @param {string} name
 * @returns {string | undefined}
 */
function getAttr(node, name) {
  return node.attrs?.find((attr) => attr.name === name)?.value;
}

/**
 * @param {ParsedNode} [node]
 * @returns {string}
 */
function getText(node) {
  if (!node) return '';
  if (node.nodeName === '#text') {
    return node.value || '';
  }
  return (node.childNodes || []).map((child) => getText(child)).join('');
}

/**
 * @param {ParsedNode} node
 * @param {(node: ParsedNode) => void} visitor
 * @returns {void}
 */
function traverse(node, visitor) {
  visitor(node);
  (node.childNodes || []).forEach((child) => traverse(child, visitor));
}

/**
 * @param {ParsedNode} document
 * @returns {{ heading: string, href: string }[]}
 */
function collectHeadingLinks(document) {
  /** @type {{ heading: string, href: string }[]} */
  const headings = [];
  traverse(document, (node) => {
    if (!/^h[1-6]$/.test(node.tagName || '')) return;
    const anchor = (node.childNodes || []).find((child) => child.tagName === 'a' && getAttr(child, 'href'));
    if (!anchor) return;
    const href = getAttr(anchor, 'href');
    if (!href) return;
    headings.push({
      heading: getText(anchor).trim(),
      href,
    });
  });
  return headings;
}

/**
 * @param {ParsedNode} document
 * @returns {{ heading: string, href: string }[]}
 */
function collectFragmentLinks(document) {
  /** @type {{ heading: string, href: string }[]} */
  const links = [];
  traverse(document, (node) => {
    if (node.tagName !== 'a') return;
    const href = getAttr(node, 'href');
    if (!href) return;
    links.push({
      heading: getText(node).trim(),
      href,
    });
  });
  return links;
}

/**
 * @param {string} href
 * @param {string} origin
 * @returns {string}
 */
function toPathname(href, origin) {
  return new URL(href, origin).pathname;
}

/**
 * @param {string} sectionPath
 * @returns {boolean}
 */
function isExcludedSection(sectionPath) {
  return EXCLUDED_SECTIONS.some((value) => sectionPath.includes(value));
}

/**
 * @param {string} html
 * @param {string} origin
 * @returns {{ heading: string, sectionPath: string }[]}
 */
export function parseTopLevelSections(html, origin) {
  const document = parse(html);
  const headingSections = collectHeadingLinks(document)
    .map((entry) => ({
      heading: entry.heading,
      sectionPath: toPathname(entry.href, origin),
    }))
    .filter((entry) => !isExcludedSection(entry.sectionPath));
  if (headingSections.length) return headingSections;

  return collectFragmentLinks(document)
    .map((entry) => ({
      heading: entry.heading,
      sectionPath: toPathname(entry.href, origin),
    }))
    .filter((entry) => entry.sectionPath.includes('/fragments/'));
}

/**
 * @param {string} html
 * @param {string} origin
 * @returns {string[]}
 */
export function parseInlineFragmentPaths(html, origin) {
  const document = parse(html);
  /** @type {string[]} */
  const paths = [];
  traverse(document, (node) => {
    if (node.tagName !== 'a') return;
    const href = getAttr(node, 'href');
    if (!href || !href.includes('#_inline') || href.includes('promo')) return;
    paths.push(toPathname(href, origin));
  });
  return paths;
}

/**
 * @param {string} sourcePath
 * @returns {string}
 */
function makeSafeBaseName(sourcePath) {
  const base = path.posix.basename(sourcePath).replace(/[^a-zA-Z0-9._-]/g, '-');
  return base || 'fragment';
}

/**
 * @param {GnavArtifact['kind']} kind
 * @param {string} sourcePath
 * @param {Map<string, number>} counts
 * @returns {string}
 */
function assignLocalFileName(
  kind,
  sourcePath,
  counts,
) {
  const base = makeSafeBaseName(sourcePath).replace(/\.plain\.html$/i, '').replace(/\.html$/i, '');
  const key = `${kind}:${base}`;
  const count = (counts.get(key) || 0) + 1;
  counts.set(key, count);

  if (kind === 'top-level') return 'gnav.html';
  if (count === 1) return `${base}.html`;
  return `${base}-${count}.html`;
}

/**
 * @param {string} url
 * @param {{ fetchImpl?: typeof fetch }} runtimeOptions
 * @returns {Promise<{ ok: false, status: number, statusText: string } | { ok: true, text: string }>}
 */
async function fetchPlainHtml(
  url,
  runtimeOptions,
) {
  const response = await fetchText(`${url}.plain.html`, {}, runtimeOptions);
  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      statusText: response.statusText,
    };
  }
  return {
    ok: true,
    text: await response.text(),
  };
}

/**
 * @param {{ hostSite: string, baseGeo: string, fetchImpl?: typeof fetch }} options
 * @returns {Promise<GnavExtractResult>}
 */
export async function extractGnavArtifacts(
  { hostSite, baseGeo, fetchImpl },
) {
  const geoPrefix = getGeoPrefix(baseGeo);
  const localOrigin = `https://main--${hostSite}--adobecom.aem.live`;
  const localUrl = `${localOrigin}${geoPrefix}/gnav`;
  const federalUrl = `${FEDERAL_ORIGIN}${geoPrefix}${FEDERAL_GNAV_PATH}`;
  const runtimeOptions = { fetchImpl };

  const localResult = await fetchPlainHtml(localUrl, runtimeOptions);
  const resolved = localResult.ok ? {
    kind: 'local',
    origin: localOrigin,
    sourceUrl: localUrl,
    html: localResult.text,
  } : null;

  const federalResult = resolved ? null : await fetchPlainHtml(federalUrl, runtimeOptions);
  const fallback = !resolved && federalResult?.ok ? {
    kind: 'federal',
    origin: FEDERAL_ORIGIN,
    sourceUrl: federalUrl,
    html: federalResult.text,
  } : null;

  const source = resolved || fallback;
  if (!source) {
    return {
      ok: false,
      warning: `[warn] Skipping GNAV for ${hostSite}/${baseGeo || '(default)'} because neither ${localUrl}.plain.html nor ${federalUrl}.plain.html resolved`,
    };
  }

  const sections = parseTopLevelSections(source.html, source.origin);
  /** @type {GnavArtifact[]} */
  const artifacts = [];
  const counts = new Map();

  const topLevelPath = new URL(source.sourceUrl).pathname;
  artifacts.push({
    file: assignLocalFileName('top-level', topLevelPath, counts),
    kind: 'top-level',
    sourceUrl: `${source.sourceUrl}.plain.html`,
    sourcePath: topLevelPath,
    parentFile: null,
    content: source.html,
  });

  for (const section of sections) {
    const localizedSectionPath = prefixLocalizedPath(baseGeo, section.sectionPath);
    const sectionUrl = `${source.origin}${localizedSectionPath}`;
    const sectionResult = await fetchPlainHtml(sectionUrl, runtimeOptions);
    if (!sectionResult.ok) {
      console.warn(`[warn] Skipping GNAV section ${localizedSectionPath} for ${hostSite}/${baseGeo || '(default)'}: ${sectionResult.status} ${sectionResult.statusText}`);
      continue;
    }

    const sectionFile = assignLocalFileName('section', localizedSectionPath, counts);
    artifacts.push({
      file: sectionFile,
      kind: 'section',
      sourceUrl: `${sectionUrl}.plain.html`,
      sourcePath: localizedSectionPath,
      parentFile: 'gnav.html',
      heading: section.heading,
      content: sectionResult.text,
    });

    const inlinePaths = parseInlineFragmentPaths(sectionResult.text, source.origin);
    for (const inlinePath of inlinePaths) {
      const localizedInlinePath = prefixLocalizedPath(baseGeo, inlinePath);
      const inlineUrl = `${source.origin}${localizedInlinePath}`;
      const inlineResult = await fetchPlainHtml(inlineUrl, runtimeOptions);
      if (!inlineResult.ok) {
        console.warn(`[warn] Skipping GNAV inline fragment ${localizedInlinePath} for ${hostSite}/${baseGeo || '(default)'}: ${inlineResult.status} ${inlineResult.statusText}`);
        continue;
      }

      artifacts.push({
        file: assignLocalFileName('inline-column', localizedInlinePath, counts),
        kind: 'inline-column',
        sourceUrl: `${inlineUrl}.plain.html`,
        sourcePath: localizedInlinePath,
        parentFile: sectionFile,
        content: inlineResult.text,
      });
    }
  }

  return {
    ok: true,
    sourceOrigin: source.origin,
    artifacts,
  };
}

/**
 * @param {string} baseGeo
 * @returns {string}
 */
export function getPlaceholdersUrl(baseGeo) {
  const geoPrefix = getGeoPrefix(baseGeo);
  return `${FEDERAL_ORIGIN}${geoPrefix}/federal/globalnav/placeholders.json`;
}
