// eslint-disable-next-line import/no-relative-packages
import { getFederatedUrl, getConfig } from '../../../../utils/utils.js';
// eslint-disable-next-line import/no-relative-packages
import { processTrackingLabels } from '../../../../martech/attributes.js';

import { escapeHtml, renderParagraphs, hangParagraphs, buildGlobeSkeleton, parseCommonRows } from '../../../../utils/globe/authoring.js';

function badgeSvgUrl(a) {
  const href = a.getAttribute('href') || '';
  if (href.includes('.svg')) return href;
  const text = a.textContent.trim();
  return text.includes('.svg') ? text : '';
}

function isSvgAnchor(a) {
  return !!badgeSvgUrl(a);
}

// Inline <picture> markup for a badge logo URL, or null.
function badgeIconHtml(url) {
  if (!url) return null;
  const src = getFederatedUrl(url);
  return `<picture class="globe-modal-badge-icon" aria-hidden="true"><img loading="lazy" src="${escapeHtml(src)}" alt=""></picture>`;
}

function parseArcCopy(row) {
  if (!row) return { title: '', body: [] };
  const heading = row.querySelector('h1,h2,h3,h4,h5,h6');
  const paras = [...row.querySelectorAll('p')]
    .filter((p) => !p.querySelector('picture,img') && p.textContent.trim());
  return {
    title: heading ? heading.textContent : paras.shift()?.textContent.trim() || '',
    body: paras,
  };
}

// The <em>/<strong> text, but only when it IS the whole paragraph.
function wholeParaChild(p, selector) {
  const child = p.querySelector(selector);
  const text = child?.textContent.trim();
  return text && text === p.textContent.trim() ? text : '';
}

function parseFragmentCardSegment(nodes) {
  let img = null;
  let role = ''; let name = '';
  const description = [];
  const badges = [];

  nodes.forEach((node) => {
    const tag = node.nodeName && node.nodeName.toUpperCase();
    if (!tag) return;

    if (/^H[1-6]$/.test(tag)) {
      if (!name) name = node.textContent.trim();
    } else if (tag === 'P') {
      const inlineImg = node.querySelector('img'); // <picture> or bare <img>; first wins
      if (inlineImg) {
        if (!img) img = inlineImg;
        return;
      }
      if (!role) {
        const em = wholeParaChild(node, 'em');
        if (em) { role = em; return; }
      }
      if (!name) {
        const strong = wholeParaChild(node, 'strong');
        if (strong) { name = strong; return; }
      }
      if (node.textContent.trim()) description.push(node); // everything else is description
    } else if (tag === 'PICTURE' || tag === 'IMG') {
      const bare = tag === 'IMG' ? node : node.querySelector('img');
      if (!img && bare) img = bare;
    } else if (tag === 'UL') {
      node.querySelectorAll(':scope > li').forEach((li) => {
        // Cloned, so the authored DOM is untouched.
        const row = li.cloneNode(true);
        const featureLi = row.querySelector(':scope > ul > li');
        row.querySelector(':scope > ul')?.remove();

        const anchors = [...row.querySelectorAll('a')];
        const svgAnchor = anchors.find(isSvgAnchor) || null;
        const linkAnchor = anchors.find((a) => a !== svgAnchor) || null;
        const icon = badgeIconHtml(
          svgAnchor ? badgeSvgUrl(svgAnchor) : row.querySelector('img')?.getAttribute('src'),
        );
        svgAnchor?.remove(); // its URL text is markup, never part of the name

        const badgeName = (linkAnchor ? linkAnchor.textContent : row.textContent).trim();
        if (badgeName) {
          badges.push({
            name: badgeName,
            role: featureLi?.textContent.trim() || '',
            href: linkAnchor?.getAttribute('href') || null,
            icon,
          });
        }
      });
    }
  });

  if (!img) {
    const label = nodes.map((n) => n.textContent || '').join(' ').trim().slice(0, 60);
    window.lana?.log?.(
      `globe-gallery: fragment section skipped, no image — "${label}"`,
      { tags: 'globe-gallery', severity: 'info' },
    );
    return null;
  }
  return {
    img: img.currentSrc || img.getAttribute('src') || img.src,
    alt: (img.getAttribute('alt') || '').trim(),
    name,
    role,
    description,
    badges,
  };
}

const CARD_CONTENT_TAGS = /^(P|UL|PICTURE|IMG|H[1-6])$/;

function parseFragmentCards(row) {
  const hasDirectContent = [...row.children].some((n) => CARD_CONTENT_TAGS.test(n.nodeName));

  if (!hasDirectContent) {
    const divs = [...row.querySelectorAll(':scope > div')];
    return divs.flatMap((div) => parseFragmentCards(div));
  }

  const segments = [];
  let current = [];
  [...row.childNodes].forEach((node) => {
    if (node.nodeName === 'HR') {
      if (current.length) { segments.push(current); current = []; }
    } else if (node.nodeType !== Node.TEXT_NODE || node.textContent.trim()) {
      current.push(node);
    }
  });
  if (current.length) segments.push(current);
  return segments.map((nodes) => parseFragmentCardSegment(nodes)).filter(Boolean);
}

export async function fetchFragmentCards(href) {
  try {
    const resp = await fetch(`${href}.plain.html`);
    if (!resp.ok) return null;
    const html = await resp.text();
    // DOMParser yields an inert document, so card <img>/<picture> never fetch here — only the
    // right-sized texture URL is downloaded.
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const cards = [...doc.body.querySelectorAll(':scope > div')]
      .flatMap((section) => parseFragmentCards(section))
      .filter(Boolean);
    return cards.length ? cards : null;
  } catch (e) {
    return null;
  }
}

// Cards ask by height, the modal by width; non-media URLs pass through.
export function optimizeImgUrl(src, px, axis = 'width') {
  if (!src) return src;
  try {
    const url = new URL(src, window.location.href);
    if (!/(^|\/)media_[0-9a-f]/i.test(url.pathname)) return src;
    return `${url.origin}${url.pathname}?${axis}=${Math.round(px)}&format=webply`;
  } catch (e) {
    return src;
  }
}

// Positional rows. Fragment links are authored with #_dnb so Milo skips auto-resolution;
// the hash is stripped before fetching.
export function parseAuthoredContent(el) {
  const [arcCopyRow, cardsRow, hintTextRow, a11yRow, pullQuoteRow] = [...el.children];
  const fragmentLink = cardsRow?.querySelector('a[href]');
  // Row 2 is two cells: the barrel's bottom-row copy, then the hint plane / cursor label.
  return {
    arcCopy: parseArcCopy(arcCopyRow),
    fragmentHref: fragmentLink ? fragmentLink.href.replace(/#.*$/, '') : null,
    ...parseCommonRows(hintTextRow, a11yRow, pullQuoteRow),
  };
}

// `gid` makes the modal's document-wide aria-labelledby/describedby id refs unique per instance.

const CANVAS_STYLE = 'position:fixed;top:0;left:0;width:100%;height:100vh;display:none;pointer-events:auto;touch-action:pan-y;';

const ARC_COPY_HTML = `  <div class="globe-arc-copy">
    <h2 class="globe-arc-copy-title"></h2>
    <div class="globe-arc-copy-body body-md"></div>
  </div>

`;

const modalInfoHtml = (gid) => `
    <div class="globe-modal-info" data-lenis-prevent>
      <h2 class="globe-modal-name" id="globe-modal-name-${gid}" tabindex="-1" autofocus aria-describedby="globe-modal-role-${gid} globe-modal-position-${gid}"></h2>
      <p class="globe-modal-role-label" id="globe-modal-role-${gid}"></p>
      <span class="globe-modal-position sr-only" id="globe-modal-position-${gid}" aria-hidden="true"></span>
      <div class="globe-modal-description" id="globe-modal-description-${gid}" role="document"></div>
      <ul class="globe-modal-badges"></ul>
    </div>
`;

export function buildGlobeDom(el, labels, { arcCopy, pullQuote, touchHint }) {
  const gid = buildGlobeSkeleton(el, 'globe-gallery', labels, {
    touchHint,
    pullQuote,
    canvasStyle: CANVAS_STYLE,
    arcCopyHtml: ARC_COPY_HTML,
    modalInfoHtml,
  });
  el.querySelector('.globe-arc-copy-title').textContent = arcCopy.title;
  renderParagraphs(el.querySelector('.globe-arc-copy-body'), arcCopy.body);
  return gid;
}

export function renderModalContent(targetEl, meta) {
  const roleLabelEl = targetEl.querySelector('.globe-modal-role-label');
  if (roleLabelEl) roleLabelEl.textContent = meta.role;
  targetEl.querySelector('.globe-modal-name').textContent = meta.name;
  const descEl = targetEl.querySelector('.globe-modal-description');
  renderParagraphs(descEl, meta.description);
  hangParagraphs(descEl);
  const badgesEl = targetEl.querySelector('.globe-modal-badges');
  badgesEl.innerHTML = '';
  const config = getConfig();
  meta.badges.forEach((b) => {
    const row = document.createElement('li');
    row.className = 'globe-modal-badge';
    // Labelled by product, not by card, and unindexed.
    const daall = `${processTrackingLabels(b.name, config, 20)}--globe_card_modal`;
    const nameHtml = b.href
      ? `<a class="globe-modal-badge-app globe-modal-badge-app-link" href="${escapeHtml(b.href)}" daa-ll="${escapeHtml(daall)}">${escapeHtml(b.name)}</a>`
      : `<span class="globe-modal-badge-app">${escapeHtml(b.name)}</span>`;
    // Rows without a logo just render the name — no empty chip.
    row.innerHTML = `<div class="globe-modal-badge-left">${b.icon || ''}${nameHtml}</div><span class="globe-modal-badge-role">${escapeHtml(b.role)}</span>`;
    badgesEl.appendChild(row);
  });
  return { descEl, speech: [[meta.name], [meta.role]] };
}
