// One-time content entrances. CSS owns the motion; this file only decides when each item
// plays. It runs once per section after all of the section's blocks have loaded.

// Rich Content text rises by default; heroes keep their own motion.
const ENTRANCE = '.rich-content:not(.hero), .parallax-stagger-ltr, .parallax-stagger-rtl, .parallax-move-up, .parallax-opacity';
// Scale, blur, clip, or block-owned motion (social-proof, carousels) play in place, even
// inside another entrance.
const EFFECT = '.parallax-scale-up, .parallax-scale-down, .parallax-scale-down-grid, .parallax-blur, '
  + '.parallax-featured-card-media, .social-proof, .carousel-c2, .elastic-carousel';
const SOURCES = `${ENTRANCE}, ${EFFECT}`;
const STAGGER = '.parallax-stagger-ltr, .parallax-stagger-rtl';
// Garage doors and sticky moments stay scroll-driven.
const SCROLL_DRIVEN = '.parallax-garage-door-reveal, .parallax-move-up-fast, .parallax-video-garage-door';
// Blocks that own their content motion; nested Rich Content stays with the block.
const OWNED = '.carousel-c2, .elastic-carousel';
// Keep in sync with the Rich Content + Split Aside rule in libs/c2/styles/styles.css.
const ASIDE_CONTENT = '.rich-content:not(.hero, .merch-moment, .media) + .split-aside-grid';
const ASIDE_SECTION = `.section.parallax-double-garage-door:has(> ${ASIDE_CONTENT})`;
const SUPPORTS_HAS = window.CSS?.supports?.('selector(:has(*))') ?? false;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const singleColumn = window.matchMedia('(width < 768px)');
const states = new WeakMap();
const sections = new Set();

const isEffectOnly = (source) => source.matches(EFFECT) && !source.matches(ENTRANCE);
const isLoaded = (el) => !el || !el.dataset.blockStatus || el.dataset.blockStatus === 'loaded';
const childItems = (el) => [...el.children].filter((child) => !child.matches('[class*="section-"], .aria-live-container'));
// Content running any other animation keeps its own motion untouched.
const hasOtherAnimation = (el) => getComputedStyle(el).animationName.split(', ').some((name) => name !== 'none');

function itemsOf(source) {
  if (isEffectOnly(source)) return [source];
  if (source.matches(STAGGER)) return childItems(source);
  if (source.matches('.parallax-move-up, .parallax-opacity')) return [source];
  if (source.matches('.rich-content')) return [...source.querySelector('.content')?.children ?? []];
  return childItems(source);
}

function sourcesIn(section) {
  const aside = SUPPORTS_HAS && section.matches(ASIDE_SECTION) ? section.querySelector(`:scope > ${ASIDE_CONTENT}`) : null;
  const found = [...section.querySelectorAll(SOURCES)];
  if (section.matches(SOURCES)) found.unshift(section);
  const sources = found.filter((source) => !source.closest(SCROLL_DRIVEN)
    && !source.parentElement?.closest(OWNED)
    && source !== aside?.previousElementSibling && !aside?.contains(source)
    && isLoaded(source.closest('[data-block-status]'))
    && !(source.matches(ENTRANCE) && source.parentElement?.closest(ENTRANCE)));
  // Under the aside's garage door, the hover list after it still gets a timed entrance.
  if (aside) sources.push(...section.querySelectorAll(':scope > .hover-list[data-block-status="loaded"]'));
  return new Set(sources);
}

// Block-owned motion must not replay when its markup is re-inserted (carousel clones),
// so settle once every timed animation in the block has finished.
function settleWhenDone(item, signal) {
  item.addEventListener('animationend', () => {
    const running = item.getAnimations({ subtree: true })
      .some((animation) => animation.timeline === document.timeline && animation.playState === 'running');
    if (!running) item.classList.add('c2-entrance-settled');
  }, { signal });
}

function reveal(state, items, settled) {
  items.forEach((item) => {
    if (!state.pending.delete(item)) return;
    item.classList.add('c2-entrance-played');
    if (settled) item.classList.add('c2-entrance-settled');
    else if (item === state.source) settleWhenDone(item, state.abort.signal);
  });
  if (!state.pending.size) state.observer.disconnect();
}

// Multi-column grids enter as one, like stage's shared section timeline. Masonry and
// single-column grids enter row by row, so each row gets its own stagger order.
function updateOrder(state) {
  const { source } = state;
  state.byRow = source.matches(STAGGER)
    && (source.classList.contains('masonry-layout') || singleColumn.matches);
  const groups = [];
  state.items.filter((item) => state.pending.has(item)).forEach((item) => {
    const last = groups[groups.length - 1];
    if (last && (!state.byRow || Math.abs(last[0].offsetTop - item.offsetTop) < 2)) last.push(item);
    else groups.push([item]);
  });
  groups.forEach((group) => {
    const ordered = source.classList.contains('parallax-stagger-rtl') ? group.reverse() : group;
    ordered.forEach((item, index) => {
      item.style.setProperty('--c2-entrance-index', String(index));
      item.style.setProperty('--c2-entrance-count', String(ordered.length));
    });
  });
}

function setup(source, settleVisible) {
  const items = itemsOf(source).filter((item) => isLoaded(item) && !hasOtherAnimation(item));
  if (!items.length) return;
  source.classList.add('c2-entrance-group');
  source.classList.toggle('c2-entrance-effect', isEffectOnly(source));
  items.forEach((item) => item.classList.add('c2-entrance-item'));
  const state = { source, items, pending: new Set(items), abort: new AbortController() };
  states.set(source, state);
  updateOrder(state);

  const trigger = Number.parseFloat(getComputedStyle(source).getPropertyValue('--c2-entrance-trigger')) || 90;
  // FAQ items start from their question, like stage.
  const anchors = new Map(items.map((item) => [item.querySelector(':scope > .faq-trigger') ?? item, item]));
  let firstReport = true;
  state.observer = new IntersectionObserver((entries) => {
    // Content at or above the trigger line plays; content already scrolled past
    // (deep links, reloads mid-page) is caught by the observer's first report.
    const hits = entries
      .filter((entry) => entry.isIntersecting || entry.boundingClientRect.bottom < 0)
      .map((entry) => anchors.get(entry.target));
    const batch = state.byRow ? hits : [...state.pending];
    if (hits.length) reveal(state, batch, settleVisible && firstReport);
    firstReport = false;
  }, { rootMargin: `0px 0px -${100 - trigger}% 0px` });
  anchors.forEach((item, anchor) => state.observer.observe(anchor));
  source.addEventListener('focusin', () => reveal(state, [...state.pending], true), { signal: state.abort.signal });
}

function clear(source) {
  const state = states.get(source);
  state.observer.disconnect();
  state.abort.abort();
  state.items.forEach((item) => {
    item.classList.remove('c2-entrance-item', 'c2-entrance-played', 'c2-entrance-settled');
    item.style.removeProperty('--c2-entrance-index');
    item.style.removeProperty('--c2-entrance-count');
  });
  source.classList.remove('c2-entrance-group', 'c2-entrance-effect');
  states.delete(source);
}

// After a resize, responsive authoring may have changed the section's classes and grids
// may have new rows. Content set up then that is already in view shows without playing.
function refresh(section, settleVisible) {
  const sources = sourcesIn(section);
  const current = [...section.querySelectorAll('.c2-entrance-group')];
  if (section.classList.contains('c2-entrance-group')) current.unshift(section);
  current.filter((source) => states.has(source) && !sources.has(source)).forEach(clear);
  sources.forEach((source) => {
    const state = states.get(source);
    if (state) updateOrder(state);
    else setup(source, settleVisible);
  });
}

let frame;
let listening = false;
function onResize() {
  frame = undefined;
  sections.forEach((section) => {
    if (section.isConnected) refresh(section, true);
    else sections.delete(section);
  });
}

export default function initContentAnimations(section) {
  if (reducedMotion.matches || !section?.isConnected) return;
  refresh(section, false);
  sections.add(section);
  if (listening) return;
  listening = true;
  window.addEventListener('resize', () => {
    if (!frame) frame = requestAnimationFrame(onResize);
  });
}
