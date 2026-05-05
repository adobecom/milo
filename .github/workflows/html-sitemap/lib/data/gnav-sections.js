import fs from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'parse5';
import { resolvePlaceholders } from '../sources/placeholders.js';
import { cleanTitle, toProductionUrl } from './normalize.js';

/**
 * @typedef {import('../sources/placeholders.js').PlaceholderMap} PlaceholderMap
 * @typedef {import('./normalize.js').NormalizedLink} NormalizedLink
 * @typedef {import('./normalize.js').SiteDomainMap} SiteDomainMap
 */

/**
 * @typedef {Object} ParsedNode
 * @property {string} [tagName]
 * @property {string} [nodeName]
 * @property {string} [value]
 * @property {{ name: string, value: string }[]} [attrs]
 * @property {ParsedNode[]} [childNodes]
 */

/**
 * @typedef {Object} ManifestFile
 * @property {string} file
 * @property {'top-level' | 'section' | 'inline-column'} kind
 * @property {string} sourceUrl
 * @property {string} sourcePath
 * @property {string | null} parentFile
 * @property {string | null} heading
 */

/**
 * @typedef {Object} Manifest
 * @property {ManifestFile[]} files
 */

/**
 * @typedef {Object} GnavSectionGroup
 * @property {string | null} subheading
 * @property {NormalizedLink[]} links
 */

/**
 * @typedef {Object} GnavSection
 * @property {string} heading
 * @property {GnavSectionGroup[]} groups
 */

/**
 * @typedef {{ type: 'subheading', text: string } | { type: 'link', href: string, text: string, sourceUrl?: string }} ParsedItem
 */

/**
 * @param {string} href
 * @returns {boolean}
 */
function isDecorativeAssetHref(href) {
  return /\.(svg|png|jpe?g|gif|webp|avif)(?:[?#].*)?$/i.test(href);
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
  if (node.nodeName === '#text') return node.value || '';
  return (node.childNodes || []).map((child) => getText(child)).join('');
}

/**
 * @param {ParsedNode} node
 * @param {string} className
 * @returns {boolean}
 */
function hasClass(node, className) {
  const classes = (getAttr(node, 'class') || '').split(/\s+/).filter(Boolean);
  return classes.includes(className);
}

/**
 * @param {ParsedNode} node
 * @param {ParsedNode[]} ancestors
 * @param {(node: ParsedNode, ancestors: ParsedNode[]) => void} visit
 * @returns {void}
 */
function walk(node, ancestors, visit) {
  visit(node, ancestors);
  (node.childNodes || []).forEach((child) => walk(child, [...ancestors, node], visit));
}

/**
 * @param {string} html
 * @param {string} [sourceUrl]
 * @returns {ParsedItem[]}
 */
function parseSectionItems(html, sourceUrl) {
  const document = parse(html);
  /** @type {ParsedItem[]} */
  const items = [];

  walk(document, [], (node, ancestors) => {
    if (/^h[1-6]$/.test(node.tagName || '')) {
      const text = getText(node).trim();
      if (text) items.push({ type: 'subheading', text });
      return;
    }

    if (node.tagName !== 'a') return;
    const href = getAttr(node, 'href');
    if (!href) return;

    const inLinkGroup = ancestors.some((ancestor) => hasClass(ancestor, 'link-group'));
    const parent = ancestors[ancestors.length - 1];
    const inList = ancestors.some((ancestor) => ancestor.tagName === 'li');
    const inParagraph = parent?.tagName === 'p' || parent?.tagName === 'strong';

    if (!inLinkGroup && !inList && !inParagraph) return;

    const text = getText(node).trim();
    if (!text) return;
    items.push({ type: 'link', href, text, sourceUrl });
  });

  return items;
}

/**
 * @param {ParsedItem[]} items
 * @param {PlaceholderMap} placeholders
 * @param {string} fallbackDomain
 * @param {SiteDomainMap} siteDomainMap
 * @returns {GnavSectionGroup[]}
 */
function groupItems(
  items,
  placeholders,
  fallbackDomain,
  siteDomainMap,
) {
  /** @type {GnavSectionGroup[]} */
  const groups = [];
  /** @type {GnavSectionGroup} */
  let current = { subheading: null, links: [] };

  for (const item of items) {
    if (item.type === 'subheading') {
      if (current.links.length || current.subheading) groups.push(current);
      current = {
        subheading: resolvePlaceholders(item.text, placeholders),
        links: [],
      };
      continue;
    }

    if (item.href.includes('#_inline') || item.href.includes('bookmark://')) continue;
    if (isDecorativeAssetHref(item.href)) continue;
    const resolvedHref = resolvePlaceholders(item.href, placeholders);
    const normalizedUrl = toProductionUrl(resolvedHref, fallbackDomain, siteDomainMap);
    const linkPath = new URL(normalizedUrl).pathname;
    const originalTitle = resolvePlaceholders(item.text, placeholders).replace(/\s+/g, ' ').trim();
    current.links.push({
      title: cleanTitle(originalTitle),
      originalTitle,
      url: normalizedUrl,
      path: linkPath,
      originalPath: linkPath,
      ...(item.sourceUrl ? { originUrl: item.sourceUrl } : {}),
    });
  }

  if (current.links.length || current.subheading) groups.push(current);
  return groups.filter((group) => group.links.length > 0);
}

/**
 * @param {string} gnavDir
 * @param {PlaceholderMap} placeholders
 * @param {string} fallbackDomain
 * @param {SiteDomainMap} [siteDomainMap]
 * @returns {Promise<GnavSection[]>}
 */
export async function buildBaseGeoLinks(
  gnavDir,
  placeholders,
  fallbackDomain,
  siteDomainMap = {},
) {
  /** @type {Manifest} */
  const manifest = JSON.parse(await fs.readFile(path.join(gnavDir, 'manifest.json'), 'utf8'));
  const sectionFiles = manifest.files.filter((file) => file.kind === 'section');

  const sections = await Promise.all(sectionFiles.map(async (file) => {
    const inlineChildren = manifest.files.filter((entry) => entry.kind === 'inline-column' && entry.parentFile === file.file);
    const htmlSources = inlineChildren.length ? inlineChildren : [file];
    const items = (
      await Promise.all(htmlSources.map(async (source) => parseSectionItems(await fs.readFile(path.join(gnavDir, source.file), 'utf8'), source.sourceUrl)))
    ).flat();

    const groups = groupItems(items, placeholders, fallbackDomain, siteDomainMap);
    if (!groups.length) return null;

    return {
      heading: resolvePlaceholders(file.heading || '', placeholders),
      groups,
    };
  }));

  return sections.filter(Boolean);
}
