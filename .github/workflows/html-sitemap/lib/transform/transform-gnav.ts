import fs from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'parse5';
import { resolvePlaceholders, type PlaceholderMap } from '../extract/placeholders.ts';
import { cleanTitle, toProductionUrl, type NormalizedLink, type SiteDomainMap } from './query-index-normalize.ts';

type ParsedNode = {
  tagName?: string;
  nodeName?: string;
  value?: string;
  attrs?: { name: string; value: string }[];
  childNodes?: ParsedNode[];
};

type ManifestFile = {
  file: string;
  kind: 'top-level' | 'section' | 'inline-column';
  sourceUrl: string;
  sourcePath: string;
  parentFile: string | null;
  heading: string | null;
};

type Manifest = {
  files: ManifestFile[];
};

export type GnavSectionGroup = {
  subheading: string | null;
  links: NormalizedLink[];
};

export type GnavSection = {
  heading: string;
  groups: GnavSectionGroup[];
};

type ParsedItem =
  | { type: 'subheading'; text: string }
  | { type: 'link'; href: string; text: string };

function isDecorativeAssetHref(href: string): boolean {
  return /\.(svg|png|jpe?g|gif|webp|avif)(?:[?#].*)?$/i.test(href);
}

function getAttr(node: ParsedNode, name: string): string | undefined {
  return node.attrs?.find((attr) => attr.name === name)?.value;
}

function getText(node?: ParsedNode): string {
  if (!node) return '';
  if (node.nodeName === '#text') return node.value || '';
  return (node.childNodes || []).map((child) => getText(child)).join('');
}

function hasClass(node: ParsedNode, className: string): boolean {
  const classes = (getAttr(node, 'class') || '').split(/\s+/).filter(Boolean);
  return classes.includes(className);
}

function walk(node: ParsedNode, ancestors: ParsedNode[], visit: (node: ParsedNode, ancestors: ParsedNode[]) => void): void {
  visit(node, ancestors);
  (node.childNodes || []).forEach((child) => walk(child, [...ancestors, node], visit));
}

function parseSectionItems(html: string): ParsedItem[] {
  const document = parse(html) as ParsedNode;
  const items: ParsedItem[] = [];

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
    items.push({ type: 'link', href, text });
  });

  return items;
}

function groupItems(
  items: ParsedItem[],
  placeholders: PlaceholderMap,
  fallbackDomain: string,
  siteDomainMap: SiteDomainMap,
): GnavSectionGroup[] {
  const groups: GnavSectionGroup[] = [];
  let current: GnavSectionGroup = { subheading: null, links: [] };

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
    current.links.push({
      title: cleanTitle(resolvePlaceholders(item.text, placeholders)),
      url: normalizedUrl,
      path: new URL(normalizedUrl).pathname,
    });
  }

  if (current.links.length || current.subheading) groups.push(current);
  return groups.filter((group) => group.links.length > 0);
}

export async function buildBaseGeoLinks(
  gnavDir: string,
  placeholders: PlaceholderMap,
  fallbackDomain: string,
  siteDomainMap: SiteDomainMap = {},
): Promise<GnavSection[]> {
  const manifest = JSON.parse(await fs.readFile(path.join(gnavDir, 'manifest.json'), 'utf8')) as Manifest;
  const sectionFiles = manifest.files.filter((file) => file.kind === 'section');

  const sections = await Promise.all(sectionFiles.map(async (file): Promise<GnavSection | null> => {
    const inlineChildren = manifest.files.filter((entry) => entry.kind === 'inline-column' && entry.parentFile === file.file);
    const htmlSources = inlineChildren.length ? inlineChildren : [file];
    const items = (
      await Promise.all(htmlSources.map(async (source) => parseSectionItems(await fs.readFile(path.join(gnavDir, source.file), 'utf8'))))
    ).flat();

    const groups = groupItems(items, placeholders, fallbackDomain, siteDomainMap);
    if (!groups.length) return null;

    return {
      heading: resolvePlaceholders(file.heading || '', placeholders),
      groups,
    };
  }));

  return sections.filter(Boolean) as GnavSection[];
}
