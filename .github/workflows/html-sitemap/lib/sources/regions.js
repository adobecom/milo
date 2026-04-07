import fs from 'node:fs/promises';
import { parse } from 'parse5';
import { fetchText } from '../util/fetch.js';

/**
 * @typedef {Object} ParsedNode
 * @property {string} [tagName]
 * @property {string} [nodeName]
 * @property {string} [value]
 * @property {{ name: string, value: string }[]} [attrs]
 * @property {ParsedNode[]} [childNodes]
 */

/**
 * @typedef {Record<string, string>} RegionLabelMap
 */

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
 * @param {(node: ParsedNode) => void} visit
 * @returns {void}
 */
function walk(node, visit) {
  visit(node);
  (node.childNodes || []).forEach((child) => walk(child, visit));
}

/**
 * @param {string} href
 * @returns {string | null}
 */
function mapHrefToGeo(href) {
  try {
    const parsed = new URL(href, 'https://www.adobe.com');
    if (parsed.hash === '#_dnt' || parsed.pathname === '/') return '';
    const [geo] = parsed.pathname.split('/').filter(Boolean);
    return geo || '';
  } catch {
    return null;
  }
}

/**
 * @param {string} hostSite
 * @returns {string}
 */
export function getRegionsUrl(hostSite) {
  const origin = `https://main--${hostSite}--adobecom.aem.live`;
  if (hostSite === 'da-cc') return `${origin}/cc-shared/fragments/regions`;
  return `${origin}/fragments/regions`;
}

/**
 * @param {string} hostSite
 * @param {typeof fetch} [fetchImpl]
 * @returns {Promise<{ ok: true, html: string } | { ok: false, status: number, statusText: string }>}
 */
export async function fetchRegionsHtml(
  hostSite,
  fetchImpl,
) {
  const response = await fetchText(getRegionsUrl(hostSite), {}, { fetchImpl });
  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      statusText: response.statusText,
    };
  }

  return {
    ok: true,
    html: await response.text(),
  };
}

/**
 * @param {string} html
 * @returns {RegionLabelMap}
 */
export function parseRegionLabels(html) {
  const document = parse(html);
  const labels = new Map();

  walk(document, (node) => {
    if (node.tagName !== 'a') return;
    const href = getAttr(node, 'href');
    if (!href) return;
    const geo = mapHrefToGeo(href);
    if (geo === null) return;
    const text = getText(node).replace(/\s+/g, ' ').trim();
    if (!text) return;
    labels.set(geo, text);
  });

  return Object.fromEntries(labels);
}

/**
 * @param {string} filePath
 * @returns {Promise<RegionLabelMap>}
 */
export async function loadRegionLabelMap(filePath) {
  try {
    const html = await fs.readFile(filePath, 'utf8');
    return parseRegionLabels(html);
  } catch {
    return {};
  }
}
