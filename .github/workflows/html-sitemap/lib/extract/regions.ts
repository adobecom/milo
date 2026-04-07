import fs from 'node:fs/promises';
import { parse } from 'parse5';
import { fetchText } from '../fetch.ts';

type ParsedNode = {
  tagName?: string;
  nodeName?: string;
  value?: string;
  attrs?: { name: string; value: string }[];
  childNodes?: ParsedNode[];
};

export type RegionLabelMap = Record<string, string>;

function getAttr(node: ParsedNode, name: string): string | undefined {
  return node.attrs?.find((attr) => attr.name === name)?.value;
}

function getText(node?: ParsedNode): string {
  if (!node) return '';
  if (node.nodeName === '#text') return node.value || '';
  return (node.childNodes || []).map((child) => getText(child)).join('');
}

function walk(node: ParsedNode, visit: (node: ParsedNode) => void): void {
  visit(node);
  (node.childNodes || []).forEach((child) => walk(child, visit));
}

function mapHrefToGeo(href: string): string | null {
  try {
    const parsed = new URL(href, 'https://www.adobe.com');
    if (parsed.hash === '#_dnt' || parsed.pathname === '/') return '';
    const [geo] = parsed.pathname.split('/').filter(Boolean);
    return geo || '';
  } catch {
    return null;
  }
}

export function getRegionsUrl(hostSite: string): string {
  const origin = `https://main--${hostSite}--adobecom.aem.live`;
  if (hostSite === 'da-cc') return `${origin}/cc-shared/fragments/regions`;
  return `${origin}/fragments/regions`;
}

export async function fetchRegionsHtml(
  hostSite: string,
  fetchImpl?: typeof fetch,
): Promise<{ ok: true; html: string } | { ok: false; status: number; statusText: string }> {
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

export function parseRegionLabels(html: string): RegionLabelMap {
  const document = parse(html) as ParsedNode;
  const labels = new Map<string, string>();

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

export async function loadRegionLabelMap(filePath: string): Promise<RegionLabelMap> {
  try {
    const html = await fs.readFile(filePath, 'utf8');
    return parseRegionLabels(html);
  } catch {
    return {};
  }
}
