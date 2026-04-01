import { createTag, getConfig, getMetadata, decorateLinksAsync } from '../../utils/utils.js';

async function fetchFragment(url) {
  const res = await fetch(`${url}.plain.html`);
  if (!res.ok) return null;
  const html = await res.text();
  return new DOMParser().parseFromString(html, 'text/html');
}

function getGnavOrigin() {
  const { origin } = window.location;
  if (origin.includes('localhost') || origin.includes('.aem.')) return origin;
  return origin;
}

async function fetchGnavSection(origin, sectionPath) {
  const doc = await fetchFragment(`${origin}${sectionPath}`);
  if (!doc) return [];
  return [...doc.querySelectorAll('a[href]')];
}

async function buildFromGnav(el) {
  const { locale } = getConfig();
  const prefix = locale?.prefix || '';
  const origin = getGnavOrigin();
  const gnavSource = getMetadata('gnav-source') || `${prefix}/gnav`;
  const gnavUrl = gnavSource.startsWith('http') ? gnavSource : `${origin}${gnavSource}`;

  const gnavDoc = await fetchFragment(gnavUrl);
  if (!gnavDoc) return;

  // GNAV fragments vary: some use headings with links, others use plain <a> in the body.
  // Try headings first (federal pattern), then fall back to top-level links (da-bacom pattern).
  let sections = [...gnavDoc.querySelectorAll('h1, h2, h3, h4, h5, h6')]
    .filter((h) => h.querySelector('a[href]'))
    .map((h) => {
      const link = h.querySelector('a[href]');
      return { heading: link.textContent.trim(), sectionPath: new URL(link.href).pathname };
    });

  if (!sections.length) {
    // Flat link structure (e.g. da-bacom): each <a> points to a section fragment
    const navLinks = [...gnavDoc.querySelectorAll('a[href]')]
      .filter((a) => a.pathname?.startsWith('/fragments/') || a.pathname?.startsWith(`${prefix}/fragments/`));
    sections = navLinks.map((a) => ({
      heading: a.textContent.trim(),
      sectionPath: new URL(a.href).pathname,
    }));
  }

  if (!sections.length) return;

  el.innerHTML = '';

  const sectionData = await Promise.all(
    sections.map(async ({ heading, sectionPath }) => {
      const links = await fetchGnavSection(origin, sectionPath);
      return { heading, links };
    }),
  );

  sectionData.forEach(({ heading, links }) => {
    const filtered = links.filter((a) => a.textContent.trim() && !a.href.includes('#_inline'));
    if (!filtered.length) return;

    const ul = createTag('ul');
    filtered.forEach((a) => {
      const li = createTag('li');
      const link = createTag('a', { href: a.href }, a.textContent.trim());
      li.append(link);
      ul.append(li);
    });

    const inner = createTag('div');
    inner.append(createTag('h3', {}, heading));
    inner.append(ul);

    const item = createTag('div');
    item.append(inner);
    el.append(item);
  });
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
}
