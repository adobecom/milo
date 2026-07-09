/**
 * forge-toolbar-section — a Milo C2 block for the "Feds Promobar" toolbar section.
 *
 * DA serializes the authored block to a FLAT, class-less run of semantic nodes in
 * document order — a single heading (the toolbar title) followed by N text
 * paragraphs (the action-button labels). The rich toolbar layout the Figma comp
 * shows (a rounded bar containing the title and a right-hand cluster of pill
 * buttons, the last one dark/primary) does NOT survive as markup: there are no
 * `.feds-toolbar` / `.action-button` wrappers at runtime. So this init() PROBES by
 * content shape (never by an authored class or a fixed index) and RECONSTRUCTS the
 * toolbar with createElement, stamping its own `.forge-toolbar-section`-scoped
 * classes that the co-located CSS keys on.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
const BLOCK = 'forge-toolbar-section';
const SVG_NS = 'http://www.w3.org/2000/svg';

// MEP / personalization markers Milo stamps on the row/cell wrapper. A rebuild
// that drops them silently disables Target/MEP — copy any present marker onto the
// destination node before the source is discarded.
const MEP_ATTRS = ['data-manifest-id', 'data-adobe-target-testid'];
function preserveMepAttrs(from, to) {
  if (!from || !to || from.getAttribute == null) return;
  for (const attr of MEP_ATTRS) {
    const v = from.getAttribute(attr);
    if (v != null) to.setAttribute(attr, v);
  }
  for (const a of [...(from.attributes || [])]) {
    if (a.name.startsWith('data-mep-')) to.setAttribute(a.name, a.value);
  }
}

// A stable, short analytics label derived from the visible text.
function ll(text, i) {
  const slug = (text || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return (slug || `button-${i + 1}`).slice(0, 24);
}

// Decorative corner triangle mnemonic the comp paints in the button's SE corner.
function cornerTri(fill) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'corner-tri');
  svg.setAttribute('width', '5');
  svg.setAttribute('height', '5');
  svg.setAttribute('viewBox', '0 0 5 5');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', 'M5 0 L5 5 L0 5 Z');
  path.setAttribute('fill', fill);
  svg.appendChild(path);
  return svg;
}

export default async function init(el) {
  if (!el) return;
  el.setAttribute('daa-lh', BLOCK);

  // EDS wraps a single-cell block's content in extra row/cell divs
  // (block > div > div > content). Probe for that inner cell so we read the real
  // content nodes; fall back to the block root if the wrapper is absent.
  const inner = el.querySelector(':scope > div > div') || el;
  preserveMepAttrs(inner.parentElement || inner, el);

  // Probe by content shape (C2/C24): the first heading is the toolbar title; every
  // text-bearing paragraph after it is a button label. Never index a fixed shape.
  const title = inner.querySelector('h1, h2, h3, h4, h5, h6');
  let labelEls = [...inner.querySelectorAll('p')].filter((p) => p.textContent.trim());
  if (!labelEls.length) {
    // Ragged fallback: any leaf element carrying text that is not the title.
    labelEls = [...inner.querySelectorAll('*')].filter((n) => n !== title
      && !n.querySelector('*')
      && n.textContent.trim()
      && !/^(picture|source|img|svg|path)$/i.test(n.tagName));
  }

  // Build the reconstructed toolbar.
  const sectionInner = document.createElement('div');
  sectionInner.className = 'section-inner';

  const toolbar = document.createElement('div');
  toolbar.className = 'feds-toolbar';
  sectionInner.appendChild(toolbar);

  if (title) {
    const heading = document.createElement('h2');
    heading.className = 'toolbar-title type-heading-28';
    preserveMepAttrs(title, heading);
    while (title.firstChild) heading.appendChild(title.firstChild);
    toolbar.appendChild(heading);
  }

  if (labelEls.length) {
    const group = document.createElement('div');
    group.className = 'toolbar-buttons';
    // Preserve the authored cadence: every button is light except the LAST, which
    // is the dark/primary action (as the comp specifies). Derived from count, not
    // a hard-coded index, so N labels → N buttons and the last is always primary.
    labelEls.forEach((src, i) => {
      const isDark = i === labelEls.length - 1;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `action-button ${isDark ? 'is-dark' : 'is-light'}`;
      btn.setAttribute('daa-ll', ll(src.textContent, i));
      preserveMepAttrs(src, btn);
      const span = document.createElement('span');
      span.className = 'type-body-14';
      span.textContent = src.textContent.trim();
      btn.appendChild(span);
      btn.appendChild(cornerTri(isDark ? '#ffffff' : '#292929'));
      group.appendChild(btn);
    });
    toolbar.appendChild(group);
  }

  // Single wipe-and-replace at the end (C3: never innerHTML="" mid-build).
  el.replaceChildren(sectionInner);
  el.dataset.forgeAuthored = BLOCK;
}
