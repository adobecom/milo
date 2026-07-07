import { createTag } from '../../../utils/utils.js';

// Row/item heights from Figma (px)
const ITEM_H = { S: 32, M: 56, L: 92 };
const CAT_H = { S: 33, M: 35, L: 35 };

function getBreakpoint() {
  const w = window.innerWidth;
  if (w < 768) return 'S';
  if (w < 1280) return 'M';
  return 'L';
}

// Parse the EDS block rows into structured data
function parseBlock(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  let eyebrow = null;
  let heading = null;
  const items = [];

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const h2 = row.querySelector('h2');
    const h6 = row.querySelector('h6');
    const p = row.querySelector('p');

    // Row 0: eyebrow (p) + heading (h2) in same cell
    if (h2) {
      heading = h2;
      eyebrow = p || null;
      return;
    }

    // Category row: single cell with h6
    if (h6 && cells.length === 1) {
      items.push({ type: 'category', text: h6.textContent.trim() });
      return;
    }

    // Product row: two cells — name + picture
    if (cells.length >= 2) {
      const name = cells[0].textContent.trim();
      const picture = cells[1].querySelector('picture');
      if (name && picture) {
        items.push({ type: 'product', text: name, picture });
      }
    }
  });

  return { eyebrow, heading, items };
}

function buildDOM(el, eyebrow, heading, items) {
  // Sticky stage — 100lvh, everything positioned within
  const stage = createTag('div', { class: 'roller-stage' });

  // Headline: eyebrow + h2, always visible at top-left
  const headlineEl = createTag('div', { class: 'roller-headline' });
  if (eyebrow) {
    headlineEl.append(createTag('p', { class: 'roller-eyebrow' }, eyebrow.textContent.trim()));
  }
  if (heading) {
    const h = heading.cloneNode(true);
    headlineEl.append(h);
  }
  stage.append(headlineEl);

  // Media wrapper — right side, image snaps per active product
  const mediaWrapper = createTag('div', { class: 'roller-media-wrapper', 'aria-hidden': 'true' });
  const mediaInner = createTag('div', { class: 'roller-media' });
  mediaWrapper.append(mediaInner);
  stage.append(mediaWrapper);

  // Single fixed category label — text updated by JS, never scrolls
  const categoryLabelEl = createTag('span', { class: 'roller-category-label' });
  const categoryEl = createTag('div', { class: 'roller-category', 'aria-live': 'polite', 'aria-atomic': 'true' });
  categoryEl.append(
    categoryLabelEl,
    createTag('hr', { class: 'roller-divider', 'aria-hidden': 'true' }),
  );
  stage.append(categoryEl);

  // Roller track — product items only, translated by JS
  const trackWrapper = createTag('div', { class: 'roller-track-wrapper', 'aria-label': 'Product list', role: 'list' });
  const track = createTag('div', { class: 'roller-track' });

  const productEls = []; // { el, picture }
  const productCategoryMap = []; // productIdx → category name
  let currentCategory = '';

  items.forEach((item) => {
    if (item.type === 'category') {
      currentCategory = item.text;
    } else {
      const idx = productEls.length;
      const itemEl = createTag('div', {
        class: 'roller-item',
        role: 'listitem',
        'data-idx': idx,
        'aria-label': item.text,
      });
      itemEl.append(createTag('span', { 'aria-hidden': 'true' }, item.text));
      track.append(itemEl);
      productEls.push({ el: itemEl, picture: item.picture });
      productCategoryMap.push(currentCategory);
    }
  });

  trackWrapper.append(track);
  stage.append(trackWrapper);
  el.replaceChildren(stage);

  return { stage, track, mediaInner, productEls, categoryLabelEl, productCategoryMap };
}

function setActiveImage(mediaInner, picture) {
  if (!picture) return;
  const clone = picture.cloneNode(true);
  // Ensure eager loading for the active image
  clone.querySelectorAll('img').forEach((img) => {
    img.removeAttribute('loading');
    img.setAttribute('loading', 'eager');
  });
  mediaInner.replaceChildren(clone);
}

function updateItemStates(productEls, activeIdx) {
  productEls.forEach(({ el: itemEl }, i) => {
    const dist = Math.abs(i - activeIdx);
    itemEl.setAttribute('data-dist', Math.min(dist, 5));
    itemEl.classList.toggle('is-active', dist === 0);
  });
}

export default function init(el) {
  const { eyebrow, heading, items } = parseBlock(el);
  const products = items.filter((i) => i.type === 'product');
  if (!products.length) return;

  const { stage, track, mediaInner, productEls } = buildDOM(el, eyebrow, heading, items);

  // --- Estimate block height before measurement (prevents layout jump) ---
  function estimateBlockHeight() {
    const bp = getBreakpoint();
    let h = 0;
    items.forEach((item) => { h += item.type === 'product' ? ITEM_H[bp] : CAT_H[bp]; });
    return h;
  }
  el.style.minHeight = `calc(100lvh + ${estimateBlockHeight()}px)`;

  // Show first image immediately
  setActiveImage(mediaInner, productEls[0]?.picture);
  updateItemStates(productEls, 0);

  // --- Scroll state ---
  let initialised = false;
  let initialOffset = 0; // translateY offset so first product aligns with active zone
  let productTriggers = []; // scroll amount (px) when product[i] reaches active zone
  let lastActiveIdx = 0;
  let frameId = null;

  function computeLayout() {
    const stageRect = stage.getBoundingClientRect();
    const mediaRect = mediaInner.getBoundingClientRect();
    const bp = getBreakpoint();

    // Active zone Y relative to stage top — where a product becomes "active"
    let activeZoneY;
    if (bp === 'L') {
      // Desktop: first product aligns with the bottom of the image
      activeZoneY = mediaRect.bottom - stageRect.top;
    } else if (bp === 'M') {
      // Tablet: first product aligns with the top of the image
      activeZoneY = mediaRect.top - stageRect.top;
    } else {
      // Mobile: slightly below the top of the image
      activeZoneY = mediaRect.top - stageRect.top + 24;
    }

    // Measure each product's natural center Y within the stage (before any transform)
    const naturalYs = productEls.map(({ el: itemEl }) => {
      const r = itemEl.getBoundingClientRect();
      return r.top + r.height / 2 - stageRect.top;
    });

    // initialOffset: push track down so product[0] sits exactly at activeZoneY
    initialOffset = activeZoneY - naturalYs[0];

    // productTriggers[i] = scroll amount when product[i] hits activeZoneY
    productTriggers = naturalYs.map((y) => y - naturalYs[0]);

    // Refine block height: scroll range = distance between first and last product trigger
    const totalScroll = productTriggers[productTriggers.length - 1] + ITEM_H[bp];
    el.style.minHeight = `calc(100lvh + ${totalScroll}px)`;

    initialised = true;
  }

  function tick() {
    frameId = null;
    const blockRect = el.getBoundingClientRect();

    // Not yet scrolled to block — nothing to do
    if (blockRect.top > 1) return;

    const scrolled = Math.max(0, Math.min(-blockRect.top, blockRect.height - window.innerHeight));

    // Measure once at first sticky contact
    if (!initialised) computeLayout();

    // Translate track upward as page scrolls
    track.style.transform = `translateY(${initialOffset - scrolled}px)`;

    // Determine active product: last one whose trigger ≤ scrolled
    let activeIdx = 0;
    for (let i = 0; i < productTriggers.length; i += 1) {
      if (scrolled >= productTriggers[i]) activeIdx = i;
      else break;
    }
    activeIdx = Math.min(activeIdx, productEls.length - 1);

    if (activeIdx !== lastActiveIdx) {
      lastActiveIdx = activeIdx;
      setActiveImage(mediaInner, productEls[activeIdx].picture);
      updateItemStates(productEls, activeIdx);
    }
  }

  function onScroll() {
    if (frameId) return;
    frameId = requestAnimationFrame(tick);
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Re-measure on resize (breakpoint may change)
  const ro = new ResizeObserver(() => {
    initialised = false;
    el.style.minHeight = `calc(100lvh + ${estimateBlockHeight()}px)`;
    onScroll();
  });
  ro.observe(stage);

  // Initial render
  requestAnimationFrame(tick);

  // Cleanup when block is removed from DOM
  new MutationObserver((_, obs) => {
    if (!document.contains(el)) {
      window.removeEventListener('scroll', onScroll);
      ro.disconnect();
      if (frameId) cancelAnimationFrame(frameId);
      obs.disconnect();
    }
  }).observe(document.body, { childList: true, subtree: true });
}
