// One-time content entrances. CSS owns the motion; this file only decides when each item
// plays. It runs once per section after all of the section's blocks have loaded.

// CSS decides what animates (see "Entrance roles" in libs/c2/styles/styles.css); this file
// only reads each element's --c2-entrance role and the scroll-driven --c2-entrance-off flag.
const ENTRANCE_ROLES = ['content', 'self', 'stagger', 'stagger-rtl'];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const states = new WeakMap();
const sections = new Set();
// Everything that starts together plays as one cascade, across sources and sections:
// eyebrow, headline, body, then the tiles, each one step after the previous.
const CASCADE_STEP = 100;
let cascadeEnd = 0;
const ABOVE_VIEWPORT = 1e6;

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

// Items that trigger in the same task (each observer calls back separately) join one batch,
// cascaded in page order, then each source's own order (right-to-left staggers).
let batch;
const inPageOrder = (a, b) => {
  if (a.state !== b.state) {
    /* eslint-disable-next-line no-bitwise */
    return a.state.source.compareDocumentPosition(b.state.source) & Node.DOCUMENT_POSITION_FOLLOWING
      ? -1 : 1;
  }
  return a.state.order.indexOf(a.item) - b.state.order.indexOf(b.item);
};

function cascade(state, items) {
  const now = performance.now();
  if (!batch || now - batch.now > CASCADE_STEP / 2) {
    batch = { now, start: Math.max(now, cascadeEnd), entries: [] };
    const current = batch;
    setTimeout(() => { if (batch === current) batch = undefined; });
  }
  batch.entries.push(...items.map((item) => ({ state, item })));
  batch.entries.sort(inPageOrder).forEach(({ item }, index) => {
    const delay = batch.start + index * CASCADE_STEP - batch.now;
    item.style.setProperty('--c2-entrance-delay', `${Math.round(delay)}ms`);
  });
  cascadeEnd = batch.start + batch.entries.length * CASCADE_STEP;
}

function reveal(state, items, settled) {
  const revealed = state.order.filter((item) => items.includes(item) && state.pending.delete(item));
  if (settled) {
    revealed.forEach((item) => item.classList.add('c2-entrance-played', 'c2-entrance-settled'));
  } else if (revealed.length) {
    cascade(state, revealed);
    revealed.forEach((item) => {
      item.classList.add('c2-entrance-played');
      if (item === state.source) settleWhenDone(item, state.abort.signal);
    });
  }
  if (!state.pending.size) state.observer?.disconnect();
}

const rowsOf = (items) => items.reduce((rows, item) => {
  const last = rows[rows.length - 1];
  if (last && Math.abs(last[0].offsetTop - item.offsetTop) < 2) last.push(item);
  else rows.push([item]);
  return rows;
}, []);

// Staggered grids enter row by row as each row scrolls in, so rows below the fold never
// play unseen and every row cascades from its first column.
function updateOrder(state) {
  state.byRow = isStagger(state.role);
  const pending = state.items.filter((item) => state.pending.has(item));
  const rows = rowsOf(pending);
  state.rows = rows;
  const groups = state.byRow ? rows : [pending];
  const inOrder = (group) => (state.role === 'stagger-rtl' ? [...group].reverse() : group);
  state.order = groups.flatMap((group) => {
    const ordered = inOrder(group);
    ordered.forEach((item, index) => {
      item.style.setProperty('--c2-entrance-index', String(index));
      item.style.setProperty('--c2-entrance-count', String(ordered.length));
    });
    return ordered;
  });
  // Columns drive the stagger's stepped rise distance, so every row steps the same way.
  rows.forEach((row) => inOrder(row).forEach((item, column) => {
    item.style.setProperty('--c2-entrance-column', String(column));
  }));
}

// Content in view (or already scrolled past) when it is set up is part of the page as
// loaded, so it shows without playing; only content scrolled into view animates.
const isShown = (el) => {
  const rect = el.getBoundingClientRect();
  return (rect.width || rect.height) && rect.top < window.innerHeight;
};

function setup(source, role) {
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
  const shown = [...anchors].filter(([anchor]) => isShown(anchor)).map(([, item]) => item);
  // A row enters together once any of its items reaches the line.
  const rowsWith = (hits) => state.rows
    .filter((row) => row.some((item) => hits.includes(item))).flat();
  if (shown.length) reveal(state, state.byRow ? rowsWith(shown) : items, true);
  if (!state.pending.size) {
    state.abort.abort();
    return;
  }
  // The root reaches far above the viewport, so content jumped past (in-page links, End key,
  // the page growing under a fast scroll) still counts as reached and never stays hidden.
  state.observer = new IntersectionObserver((entries) => {
    const hits = entries.filter((entry) => entry.isIntersecting)
      .map((entry) => anchors.get(entry.target));
    if (hits.length) reveal(state, state.byRow ? rowsWith(hits) : [...state.pending], false);
  }, { rootMargin: `${ABOVE_VIEWPORT}px 0px -${100 - trigger}% 0px` });
  anchors.forEach((item, anchor) => state.observer.observe(anchor));
  source.addEventListener('focusin', () => reveal(state, [...state.pending], true), { signal: state.abort.signal });
}

function clear(source) {
  const state = states.get(source);
  state.observer?.disconnect();
  state.abort.abort();
  state.items.forEach((item) => {
    item.classList.remove('c2-entrance-item', 'c2-entrance-played', 'c2-entrance-settled');
    ['index', 'count', 'column', 'delay'].forEach((name) => item.style.removeProperty(`--c2-entrance-${name}`));
  });
  source.classList.remove('c2-entrance-group', 'c2-entrance-effect');
  states.delete(source);
}

// After a resize, responsive authoring may have changed the section's classes and grids
// may have new rows.
function refresh(section) {
  const sources = sourcesIn(section);
  const current = [...section.querySelectorAll('.c2-entrance-group')];
  if (section.classList.contains('c2-entrance-group')) current.unshift(section);
  current.filter((source) => states.has(source) && !sources.has(source)).forEach(clear);
  sources.forEach((role, source) => {
    const state = states.get(source);
    if (!state) {
      setup(source, role);
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
    if (section.isConnected) refresh(section);
    else sections.delete(section);
  });
}

export default function initContentAnimations(section) {
  if (reducedMotion.matches || !section?.isConnected) return;
  refresh(section);
  sections.add(section);
  if (listening) return;
  listening = true;
  window.addEventListener('resize', () => {
    if (!frame) frame = requestAnimationFrame(onResize);
  });
}
