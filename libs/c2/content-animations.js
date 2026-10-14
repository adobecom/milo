// One-time content entrances. CSS owns the motion; this file only decides when each item
// plays. It runs once per section after all of the section's blocks have loaded.

// CSS decides what animates (see "Entrance roles" in libs/c2/styles/styles.css); this file
// only reads each element's --c2-entrance role and the scroll-driven --c2-entrance-off flag.
const ENTRANCE_ROLES = ['content', 'self', 'stagger', 'stagger-rtl'];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const singleColumn = window.matchMedia('(width < 768px)');
const states = new WeakMap();
const sections = new Set();

const styleValue = (el, name) => getComputedStyle(el).getPropertyValue(name).trim();
const roleOf = (el) => styleValue(el, '--c2-entrance');
const isStagger = (role) => role.startsWith('stagger');
const isLoaded = (el) => !el || !el.dataset.blockStatus || el.dataset.blockStatus === 'loaded';
const childItems = (el) => [...el.children].filter((child) => !child.matches('[class*="section-"], .aria-live-container'));
// Content running any other animation keeps its own motion untouched.
const hasOtherAnimation = (el) => getComputedStyle(el).animationName.split(', ').some((name) => name !== 'none');

const playsInPlace = (role) => role === 'effect' || role === 'block';

function itemsOf(source, role) {
  if (role === 'content') return [...source.querySelector('.content')?.children ?? []];
  if (role === 'self' || playsInPlace(role)) return [source];
  return childItems(source);
}

// Nothing inside a block gets its own entrance; entrances inside an entrance play with it.
function skippedByParent(el, role) {
  for (let parent = el.parentElement; parent; parent = parent.parentElement) {
    const parentRole = roleOf(parent);
    if (parentRole === 'block') return true;
    if (ENTRANCE_ROLES.includes(role) && ENTRANCE_ROLES.includes(parentRole)) return true;
  }
  return false;
}

// Returns each source in the section with its role.
function sourcesIn(section) {
  const sources = new Map();
  [section, ...section.querySelectorAll('[class]')].forEach((el) => {
    const role = roleOf(el);
    if (!role || styleValue(el, '--c2-entrance-off')) return;
    if (!isLoaded(el.closest('[data-block-status]'))) return;
    if (skippedByParent(el, role)) return;
    sources.set(el, role);
  });
  return sources;
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
  state.byRow = isStagger(state.role)
    && (source.classList.contains('masonry-layout') || singleColumn.matches);
  const groups = [];
  state.items.filter((item) => state.pending.has(item)).forEach((item) => {
    const last = groups[groups.length - 1];
    if (last && (!state.byRow || Math.abs(last[0].offsetTop - item.offsetTop) < 2)) last.push(item);
    else groups.push([item]);
  });
  groups.forEach((group) => {
    const ordered = state.role === 'stagger-rtl' ? group.reverse() : group;
    ordered.forEach((item, index) => {
      item.style.setProperty('--c2-entrance-index', String(index));
      item.style.setProperty('--c2-entrance-count', String(ordered.length));
    });
  });
}

function setup(source, role, settleVisible) {
  const items = itemsOf(source, role).filter((item) => isLoaded(item) && !hasOtherAnimation(item));
  if (!items.length) return;
  source.classList.add('c2-entrance-group');
  source.classList.toggle('c2-entrance-effect', playsInPlace(role));
  items.forEach((item) => item.classList.add('c2-entrance-item'));
  const state = { source, role, items, pending: new Set(items), abort: new AbortController() };
  states.set(source, state);
  updateOrder(state);

  const trigger = Number.parseFloat(getComputedStyle(source).getPropertyValue('--c2-entrance-trigger')) || 90;
  // An item starts when its marked child (--c2-entrance-anchor, e.g. the FAQ question) or the
  // item itself reaches the trigger line.
  const anchorOf = (item) => [...item.children].find((child) => styleValue(child, '--c2-entrance-anchor')) ?? item;
  const anchors = new Map(items.map((item) => [anchorOf(item), item]));
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
  sources.forEach((role, source) => {
    const state = states.get(source);
    if (!state) {
      setup(source, role, settleVisible);
      return;
    }
    state.role = role;
    updateOrder(state);
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
