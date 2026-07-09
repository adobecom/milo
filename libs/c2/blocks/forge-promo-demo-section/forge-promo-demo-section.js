/**
 * forge-promo-demo-section — a Milo C2 block for a distinctive "promo demo" section:
 * a promo bar (dark banner with body copy, an outlined "See offers" CTA carrying
 * leading/trailing icon glyphs, and a close control) sitting atop a framed
 * product-screenshot canvas.
 *
 * DA strips authored classes and serializes the block as a FLAT, class-less run of
 * semantic nodes in document order — here: <p> (promo body), <a> (CTA: picture +
 * text + picture) and a standalone <picture> (the close glyph). This decorator
 * PROBES that flat content by shape (never by an authored class or fixed index),
 * then RECONSTRUCTS the rich frame/bar/copy/cta/close/screenshot structure with
 * createElement + moved nodes, stamping its OWN scoped classes the CSS keys on.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: from libs/c2/blocks/<name>/ to libs/utils/ is THREE hops up
// (blocks -> c2 -> libs). Do NOT "correct" this to two hops.
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const BLOCK = 'forge-promo-demo-section';

// MEP / personalization markers Milo stamps on the row/cell wrapper. Un-wrapping
// discards that wrapper, so copy any present marker onto the block root first — a
// node swap that drops them silently disables Target/MEP on the section.
const MEP_ATTRS = ['data-manifest-id', 'data-adobe-target-testid'];
function preserveMepAttrs(from, to) {
  if (!from || !to) return;
  for (const attr of MEP_ATTRS) {
    const v = from.getAttribute?.(attr);
    if (v != null) to.setAttribute(attr, v);
  }
  for (const a of [...(from.attributes || [])]) {
    if (a.name.startsWith('data-mep-')) to.setAttribute(a.name, a.value);
  }
}

const tag = (name, className) => {
  const node = document.createElement(name);
  if (className) node.className = className;
  return node;
};

export default async function init(el) {
  if (!el) return;
  el.setAttribute('daa-lh', BLOCK);

  try {
    // Un-wrap: EDS nests a single-cell block as block > div > div > content.
    // Lift the content cell's children to the block root, carrying MEP markers up.
    const inner = el.querySelector(':scope > div > div');
    if (inner) {
      preserveMepAttrs(inner.parentElement, el);
      while (inner.firstChild) el.appendChild(inner.firstChild);
      inner.parentElement?.remove();
    }

    // Promote text semantics via Milo's own service BEFORE we move nodes around
    // (adds body-* to the copy; decorateButtons is a no-op on the bare anchor).
    // Best-effort: never let a service hiccup abort the reconstruction below.
    try {
      if (typeof decorateViewportContent === 'function') {
        decorateViewportContent(el, (scope) => decorateBlockText(scope));
      } else {
        decorateBlockText(el);
      }
    } catch (svcErr) {
      window.lana?.log?.(`${BLOCK} text decorate skipped: ${svcErr?.message || svcErr}`, { tags: BLOCK });
    }

    // PROBE by content shape (never by index / authored class).
    const body = el.querySelector('p');
    const link = el.querySelector('a[href]');
    const linkPictures = link ? [...link.querySelectorAll('picture')] : [];
    const closePicture = [...el.querySelectorAll('picture')]
      .find((pic) => !link || !link.contains(pic));

    // RECONSTRUCT the rich structure.
    const frame = tag('div', 'promo-frame');
    const bar = tag('div', 'promo-bar');
    const copy = tag('div', 'promo-copy');

    if (body) {
      body.classList.add('promo-body');
      copy.appendChild(body);
    }

    if (link) {
      const cta = tag('div', 'promo-cta');
      link.classList.add('see-offers-btn');
      link.setAttribute('daa-ll', link.textContent.trim() || 'See offers');

      // Wrap the bare CTA label text in a styled span, keeping the moved
      // leading/trailing <picture> icons (attributes intact) in document order.
      const label = link.textContent.trim();
      [...link.childNodes].forEach((n) => { if (n.nodeType === 3) n.remove(); });
      const span = tag('span', 'see-offers-label');
      span.textContent = label || 'See offers';
      if (linkPictures[0]) linkPictures[0].after(span);
      else link.prepend(span);
      linkPictures.forEach((pic) => {
        pic.classList.add('ic-cta');
        pic.querySelector('img')?.setAttribute('daa-im', 'true');
      });

      cta.appendChild(link);
      copy.appendChild(cta);
    }

    bar.appendChild(copy);

    if (closePicture) {
      const closeBtn = tag('button', 'promo-close');
      closeBtn.type = 'button';
      closeBtn.setAttribute('aria-label', 'Close');
      closeBtn.setAttribute('daa-ll', 'Close');
      closePicture.classList.add('ic-close');
      closePicture.querySelector('img')?.setAttribute('daa-im', 'true');
      closeBtn.appendChild(closePicture);
      bar.appendChild(closeBtn);
    }

    frame.appendChild(bar);
    // The framed product canvas below the bar (empty screenshot placeholder in
    // the source) — flexes to fill the frame so the section keeps its height.
    frame.appendChild(tag('div', 'promo-screenshot'));

    el.replaceChildren(frame);
    el.dataset.forgeAuthored = BLOCK;
  } catch (e) {
    // Never leave the section half-built; surface for observability.
    window.lana?.log?.(`${BLOCK} init failed: ${e?.message || e}`, { tags: BLOCK });
    el.dataset.forgeAuthored = BLOCK;
  }
}
