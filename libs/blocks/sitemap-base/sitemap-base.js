import { createTag, getConfig, getMetadata, getFederatedContentRoot, getFedsPlaceholderConfig, decorateLinksAsync } from '../../utils/utils.js';
import { replaceText } from '../../features/placeholders.js';

const FEDERAL_GNAV_PATH = '/federal/globalnav/acom/acom-gnav';
const EXCLUDED_SECTIONS = ['section-menu-dx'];

async function fetchFragment(url) {
  const res = await fetch(`${url}.plain.html`);
  if (!res.ok) return null;
  const html = await res.text();
  return new DOMParser().parseFromString(html, 'text/html');
}

function extractContent(doc) {
  const items = [];
  const body = doc.querySelector('body') || doc.documentElement;
  const seen = new Set();

  // Walk the DOM in document order to preserve heading/link interleaving
  const walker = document.createTreeWalker(body, NodeFilter.SHOW_ELEMENT);
  let node = walker.nextNode();
  while (node) {
    if (/^H[1-6]$/.test(node.tagName) && !seen.has(node)) {
      const text = node.textContent.trim();
      if (text) items.push({ type: 'subheading', text });
      seen.add(node);
    } else if (node.tagName === 'A' && node.href && !seen.has(node)) {
      // Only include links that are direct content (inside .link-group or top-level <p>)
      const inLinkGroup = node.closest('.link-group');
      const inTopP = node.parentElement?.tagName === 'P' || node.parentElement?.tagName === 'STRONG';
      if (inLinkGroup || inTopP) {
        const text = node.textContent.trim();
        if (text) items.push({ type: 'link', href: node.href, text });
        seen.add(node);
      }
    }
    node = walker.nextNode();
  }

  return items;
}

async function fetchGnavSection(origin, sectionPath) {
  const url = sectionPath.startsWith('http') ? sectionPath : `${origin}${sectionPath}`;
  const doc = await fetchFragment(url);
  if (!doc) return [];

  // Check for #_inline fragment references (federal column pattern)
  const inlineRefs = [...doc.querySelectorAll('a[href*="#_inline"]')]
    .filter((a) => !a.href.includes('promo'));

  if (inlineRefs.length) {
    const columnDocs = await Promise.all(
      inlineRefs.map((a) => {
        const colPath = new URL(a.href).pathname;
        return fetchFragment(`${origin}${colPath}`);
      }),
    );
    return columnDocs.filter(Boolean).flatMap((d) => extractContent(d));
  }

  return extractContent(doc);
}

async function resolveGnav(prefix) {
  const gnavSource = getMetadata('gnav-source');

  // 1. Explicit gnav-source metadata
  if (gnavSource) {
    const url = gnavSource.startsWith('http') ? gnavSource : `${window.location.origin}${gnavSource}`;
    const doc = await fetchFragment(url);
    if (doc) return { doc, origin: new URL(url).origin };
  }

  // 2. Site-local /gnav (e.g. da-bacom)
  const localUrl = `${window.location.origin}${prefix}/gnav`;
  const localDoc = await fetchFragment(localUrl);
  if (localDoc) return { doc: localDoc, origin: window.location.origin };

  // 3. Federal GNAV fallback (e.g. da-cc/www)
  const fedRoot = getFederatedContentRoot();
  const fedUrl = `${fedRoot}${prefix}${FEDERAL_GNAV_PATH}`;
  const fedDoc = await fetchFragment(fedUrl);
  if (fedDoc) return { doc: fedDoc, origin: fedRoot };

  return null;
}

function isExcludedSection(path) {
  return EXCLUDED_SECTIONS.some((s) => path.includes(s));
}

function parseSections(gnavDoc) {
  // Try headings with links first (federal pattern)
  const fromHeadings = [...gnavDoc.querySelectorAll('h1, h2, h3, h4, h5, h6')]
    .filter((h) => h.querySelector('a[href]'))
    .map((h) => {
      const link = h.querySelector('a[href]');
      return { heading: link.textContent.trim(), sectionPath: new URL(link.href).pathname };
    })
    .filter(({ sectionPath }) => !isExcludedSection(sectionPath));
  if (fromHeadings.length) return fromHeadings;

  // Flat link structure (e.g. da-bacom): <a> pointing to /fragments/gnav/*
  const navLinks = [...gnavDoc.querySelectorAll('a[href]')]
    .filter((a) => {
      const path = a.pathname || '';
      return path.includes('/fragments/');
    });
  return navLinks.map((a) => ({
    heading: a.textContent.trim(),
    sectionPath: new URL(a.href).pathname,
  }));
}

async function buildFromGnav(el) {
  const { locale } = getConfig();
  const prefix = locale?.prefix || '';

  const resolved = await resolveGnav(prefix);
  if (!resolved) return;
  const { doc: gnavDoc, origin } = resolved;

  const sections = parseSections(gnavDoc);
  if (!sections.length) return;

  el.innerHTML = '';

  const sectionData = await Promise.all(
    sections.map(async ({ heading, sectionPath }) => {
      const links = await fetchGnavSection(origin, sectionPath);
      return { heading, links };
    }),
  );

  const placeholderConfig = getFedsPlaceholderConfig();

  sectionData.forEach(({ heading, links: items }) => {
    const filtered = items.filter((item) => {
      if (!item.text) return false;
      if (item.type === 'link' && (item.href.includes('#_inline') || item.href.includes('bookmark://'))) return false;
      return true;
    });
    if (!filtered.length) return;

    const ul = createTag('ul');
    filtered.forEach((item) => {
      const li = createTag('li');
      if (item.type === 'link') {
        li.append(createTag('a', { href: item.href }, item.text));
      } else {
        li.append(createTag('strong', {}, item.text));
      }
      ul.append(li);
    });

    const inner = createTag('div');
    inner.append(createTag('h3', {}, heading));
    inner.append(ul);

    const item = createTag('div');
    item.append(inner);
    el.append(item);
  });

  // Resolve {{placeholder}} tokens in rendered content
  el.innerHTML = await replaceText(el.innerHTML, placeholderConfig);
}

const HEADING_CLASS_MAP = {
  H1: 'heading-xl',
  H2: 'heading-l',
  H3: 'heading-m',
  H4: 'heading-s',
  H5: 'heading-xs',
  H6: 'heading-xs',
};

function alignItems(el) {
  const items = [...el.querySelectorAll(':scope > .sitemap-base-item')];
  const heading = items
    .map((item) => item.querySelector('h1, h2, h3, h4, h5, h6'))
    .find(Boolean);
  if (!heading) return;

  const headingClass = HEADING_CLASS_MAP[heading.tagName];
  const style = window.getComputedStyle(heading);
  const marginBlock = `${style.marginBlockStart} ${style.marginBlockEnd}`;

  items.forEach((item) => {
    if (!item.querySelector('h1, h2, h3, h4, h5, h6')) {
      const spacer = createTag('div', {
        class: `sitemap-base-spacer ${headingClass}`,
        style: `margin-block: ${marginBlock}`,
        'aria-hidden': 'true',
      }, '\u00a0');
      const target = item.querySelector(':scope > div') || item;
      target.prepend(spacer);
    }
  });
}

export default async function init(el) {
  const params = new URLSearchParams(window.location.search);
  if (params.get('sitemap-source') === 'gnav') {
    await buildFromGnav(el);
  }

  const items = el.querySelectorAll(':scope > div');

  items.forEach((item, index) => {
    item.classList.add('sitemap-base-item', `sitemap-base-item-${index + 1}`);
  });

  if (el.classList.contains('align-headings')) alignItems(el);

  await decorateLinksAsync(el);

  if (params.get('sitemap-source') === 'gnav') {
    // Clean up images added by decorateLinksAsync (e.g. SVG icons turned into <picture>)
    el.querySelectorAll('picture, img, svg').forEach((img) => img.closest('li')?.remove() || img.remove());
  }
}
