/**
 * forge-adobe-is-transforming-the-world-s-biggest-brands
 *
 * A Milo C2 customer-proof section: a heading, a strip of customer logos, and a
 * single featured story card (brand logo + lead line + pull-quote + attribution
 * + "read the story" link).
 *
 * DA serializes this block's content as a FLAT, class-LESS run of semantic nodes
 * in document order — `<h2>`, then a consecutive run of `<picture>` logos, then
 * the story text (`<p>`, `<blockquote>`, `<p>`, `<a>`). NO grid/row/tile
 * wrappers and NONE of the authoring classes (`.logos`, `.story`, …) survive to
 * runtime. So `init()` MUST probe by CONTENT SHAPE (never by class) and
 * RECONSTRUCT the layout: the last `<picture>` before the first text node is the
 * story's brand logo; every `<picture>` before it is a customer logo.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// From libs/c2/blocks/<name>/ to libs/utils/ is THREE hops up (blocks -> c2 -> libs).
import { decorateBlockText } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

const BLOCK = 'forge-adobe-is-transforming-the-world-s-biggest-brands';
const MEP_ATTRS = ['data-manifest-id', 'data-adobe-target-testid'];

// Lift MEP/Target markers off a wrapper before it is discarded — a node swap
// that drops them silently disables personalization on the section (C11/L15).
function preserveMepAttrs(from, to) {
  if (!from || !to) return;
  MEP_ATTRS.forEach((attr) => {
    const v = from.getAttribute?.(attr);
    if (v != null) to.setAttribute(attr, v);
  });
  [...(from.attributes || [])].forEach((a) => {
    if (a.name.startsWith('data-mep-')) to.setAttribute(a.name, a.value);
  });
}

const isMedia = (n) => n?.nodeType === 1 && (n.matches('picture') || n.tagName === 'IMG');

function slug(text, fallback) {
  const s = String(text || '').trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
  return s || fallback;
}

function tagImage(host, fallback, cls) {
  const img = host?.matches?.('img') ? host : host?.querySelector?.('img');
  if (!img) return;
  if (cls) img.classList.add(cls);
  if (!img.hasAttribute('daa-im')) {
    img.setAttribute('daa-im', slug(img.getAttribute('alt'), fallback));
  }
}

export default async function init(el) {
  if (!el) return;
  el.setAttribute('daa-lh', BLOCK);

  // Un-wrap EDS row/cell wrappers so we read the flat authored content directly.
  const inner = el.querySelector(':scope > div > div');
  if (inner) {
    preserveMepAttrs(inner.parentElement, el);
    preserveMepAttrs(inner, el);
    while (inner.firstChild) el.appendChild(inner.firstChild);
    inner.parentElement?.remove();
  }

  // Probe by content shape (DA strips authored classes — never key on them).
  const kids = [...el.children].filter((n) => n.nodeType === 1);
  const heading = kids.find((n) => /^H[1-6]$/.test(n.tagName));
  const flow = kids.filter((n) => n !== heading);

  // Media leads (the logo strip); the story text follows. The LAST picture
  // before the first text node is the story's brand logo — split it out.
  const firstTextIdx = flow.findIndex((n) => !isMedia(n));
  const mediaEls = firstTextIdx === -1 ? flow.filter(isMedia) : flow.slice(0, firstTextIdx);
  const storyEls = firstTextIdx === -1 ? [] : flow.slice(firstTextIdx);
  const customerLogos = [...mediaEls];
  let storyLogo = null;
  if (storyEls.length && customerLogos.length > 1) storyLogo = customerLogos.pop();

  const rebuilt = [];

  // 1) Section heading.
  if (heading) {
    heading.classList.add('section-head__title');
    rebuilt.push(createTag('div', { class: 'section-head' }, heading));
  }

  // 2) Customer-logo strip.
  if (customerLogos.length) {
    const logos = createTag('div', { class: 'logos', role: 'list', 'aria-label': 'Customer logos' });
    customerLogos.forEach((pic) => {
      tagImage(pic, 'logo', 'logos__img');
      logos.appendChild(createTag('div', { class: 'logos__item', role: 'listitem' }, pic));
    });
    rebuilt.push(logos);
  }

  // 3) Featured story card.
  if (storyEls.length) {
    const story = createTag('div', { class: 'story' });
    if (storyLogo) {
      tagImage(storyLogo, 'story-logo', 'story__logo-img');
      story.appendChild(createTag('div', { class: 'story__logo' }, storyLogo));
    }
    const body = createTag('div', { class: 'story__body' });
    let seenQuote = false;
    storyEls.forEach((node) => {
      if (node.tagName === 'BLOCKQUOTE') {
        node.classList.add('story__quote');
        seenQuote = true;
      } else if (node.tagName === 'P') {
        node.classList.add(...(seenQuote ? ['story__cite', 'body-md'] : ['story__lead', 'body-sm']));
      } else if (node.tagName === 'A') {
        node.classList.add('story__link');
        if (!node.hasAttribute('daa-ll')) node.setAttribute('daa-ll', slug(node.textContent, 'read-story'));
      }
      body.appendChild(node);
    });
    story.appendChild(body);
    rebuilt.push(story);
  }

  // Swap in the rebuilt structure in one pass — never innerHTML-wipe (C3/L2).
  if (rebuilt.length) el.replaceChildren(...rebuilt);

  // Promote text to C2 typography with Milo's own decorator service (keeps the
  // analytics + a11y wiring that hand-rolled class-adding would drop).
  decorateBlockText(el, { heading: '2', body: 'md' });

  el.dataset.forgeAuthored = BLOCK;
}
