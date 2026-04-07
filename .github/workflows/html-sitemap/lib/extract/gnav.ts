import path from 'node:path';
import { parse } from 'parse5';
import { fetchText } from '../fetch.ts';

const FEDERAL_GNAV_PATH = '/federal/globalnav/acom/acom-gnav';
const FEDERAL_ORIGIN = 'https://main--federal--adobecom.aem.live';
const EXCLUDED_SECTIONS = ['section-menu-dx'];

type ParsedNode = {
  tagName?: string;
  nodeName?: string;
  value?: string;
  attrs?: { name: string; value: string }[];
  childNodes?: ParsedNode[];
};

export type GnavArtifact = {
  file: string;
  kind: 'top-level' | 'section' | 'inline-column';
  sourceUrl: string;
  sourcePath: string;
  parentFile: string | null;
  heading?: string;
  content: string;
};

type GnavExtractResult =
  | { ok: false; warning: string }
  | { ok: true; sourceOrigin: string; artifacts: GnavArtifact[] };

function getGeoPrefix(baseGeo: string): string {
  return baseGeo ? `/${baseGeo}` : '';
}

function prefixLocalizedPath(baseGeo: string, resourcePath: string): string {
  if (!baseGeo || !resourcePath.startsWith('/')) return resourcePath;
  const prefix = getGeoPrefix(baseGeo);
  if (resourcePath === prefix || resourcePath.startsWith(`${prefix}/`)) return resourcePath;
  return `${prefix}${resourcePath}`;
}

function getAttr(node: ParsedNode, name: string): string | undefined {
  return node.attrs?.find((attr) => attr.name === name)?.value;
}

function getText(node?: ParsedNode): string {
  if (!node) return '';
  if (node.nodeName === '#text') {
    return node.value || '';
  }
  return (node.childNodes || []).map((child) => getText(child)).join('');
}

function traverse(node: ParsedNode, visitor: (node: ParsedNode) => void): void {
  visitor(node);
  (node.childNodes || []).forEach((child) => traverse(child, visitor));
}

function collectHeadingLinks(document: ParsedNode): { heading: string; href: string }[] {
  const headings: { heading: string; href: string }[] = [];
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

function collectFragmentLinks(document: ParsedNode): { heading: string; href: string }[] {
  const links: { heading: string; href: string }[] = [];
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

function toPathname(href: string, origin: string): string {
  return new URL(href, origin).pathname;
}

function isExcludedSection(sectionPath: string): boolean {
  return EXCLUDED_SECTIONS.some((value) => sectionPath.includes(value));
}

export function parseTopLevelSections(html: string, origin: string): { heading: string; sectionPath: string }[] {
  const document = parse(html) as ParsedNode;
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

export function parseInlineFragmentPaths(html: string, origin: string): string[] {
  const document = parse(html) as ParsedNode;
  const paths: string[] = [];
  traverse(document, (node) => {
    if (node.tagName !== 'a') return;
    const href = getAttr(node, 'href');
    if (!href || !href.includes('#_inline') || href.includes('promo')) return;
    paths.push(toPathname(href, origin));
  });
  return paths;
}

function makeSafeBaseName(sourcePath: string): string {
  const base = path.posix.basename(sourcePath).replace(/[^a-zA-Z0-9._-]/g, '-');
  return base || 'fragment';
}

function assignLocalFileName(
  kind: GnavArtifact['kind'],
  sourcePath: string,
  counts: Map<string, number>,
): string {
  const base = makeSafeBaseName(sourcePath).replace(/\.plain\.html$/i, '').replace(/\.html$/i, '');
  const key = `${kind}:${base}`;
  const count = (counts.get(key) || 0) + 1;
  counts.set(key, count);

  if (kind === 'top-level') return 'gnav.html';
  if (count === 1) return `${base}.html`;
  return `${base}-${count}.html`;
}

async function fetchPlainHtml(
  url: string,
  runtimeOptions: { fetchImpl?: typeof fetch },
): Promise<{ ok: false; status: number; statusText: string } | { ok: true; text: string }> {
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

export async function extractGnavArtifacts(
  { hostSite, baseGeo, fetchImpl }: { hostSite: string; baseGeo: string; fetchImpl?: typeof fetch },
): Promise<GnavExtractResult> {
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
  const artifacts: GnavArtifact[] = [];
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

export function getPlaceholdersUrl(baseGeo: string): string {
  const geoPrefix = getGeoPrefix(baseGeo);
  return `${FEDERAL_ORIGIN}${geoPrefix}/federal/globalnav/placeholders.json`;
}
