const ENTRANCE_SELECTOR = '.parallax-line-height, .parallax-stagger-ltr, .parallax-stagger-rtl, .parallax-move-up, .parallax-opacity';
// Scale, blur, clip, or block-owned motion (social-proof) play in place, even inside
// another entrance.
const EFFECT_SELECTOR = '.parallax-scale-up, .parallax-scale-down, .parallax-blur, '
  + '.parallax-featured-card-media, .social-proof';
const SOURCE_SELECTOR = `${ENTRANCE_SELECTOR}, ${EFFECT_SELECTOR}`;
const SPECIALTY_SELECTOR = '.parallax-garage-door-reveal, .parallax-move-up-fast, .parallax-video-garage-door';
// Keep in sync with the Rich Content + Split Aside rule in libs/c2/styles/styles.css.
const ASIDE_CONTENT = '.rich-content:not(.hero, .merch-moment, .media) + .split-aside-grid';
const ASIDE_SELECTOR = `.section.parallax-double-garage-door:has(> ${ASIDE_CONTENT})`;
const SUPPORTS_HAS = window.CSS?.supports?.('selector(:has(*))') ?? false;
const groups = new WeakMap();
const sections = new Map();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const isEffectOnly = (source) => source.matches(EFFECT_SELECTOR)
  && !source.matches(ENTRANCE_SELECTOR);

// Content running any other animation keeps its own motion untouched.
function hasOtherAnimation(item) {
  return getComputedStyle(item).animationName.split(', ').some((name) => name !== 'none');
}

function reveal(state, indices, observer, settled = reducedMotion.matches) {
  indices.forEach((index) => {
    state.played.add(index);
    state.items[index]?.classList.add('c2-entrance-played');
    if (settled) state.items[index]?.classList.add('c2-entrance-settled');
  });
  observer?.disconnect();
}

function clearItem(item) {
  item.classList.remove('c2-entrance-item', 'c2-entrance-played', 'c2-entrance-settled');
  item.style.removeProperty('--c2-entrance-index');
  item.style.removeProperty('--c2-entrance-count');
}

function clearEntrance(source) {
  const state = groups.get(source);
  if (!state) return;
  state.observers.forEach((observer) => observer.disconnect());
  state.listeners.abort();
  state.items.forEach(clearItem);
  source.classList.remove('c2-entrance-group', 'c2-entrance-effect');
  groups.delete(source);
}

function observeBatch(state, source, indices, rows) {
  const timed = indices.filter((index) => !state.played.has(index) && !state.skipped[index]);
  if (!timed.length) return;
  // Like the prototype, trigger on the first visible item rather than the padded block.
  const first = timed.map((index) => state.items[index])
    .find((item) => item.offsetWidth || item.offsetHeight) ?? state.items[timed[0]];
  const anchor = first.querySelector(':scope > .faq-trigger') ?? first;
  const trigger = Number.parseFloat(getComputedStyle(rows ? first : source).getPropertyValue('--c2-entrance-trigger')) / 100;
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) reveal(state, timed, observer);
  }, { rootMargin: `0px 0px ${Math.round(-window.innerHeight * (1 - trigger))}px 0px` });
  state.observers.push(observer);
  observer.observe(anchor);
  const rect = anchor.getBoundingClientRect();
  // Deep-linked content above the viewport must not remain hidden.
  if (rect.height && rect.width && rect.top <= window.innerHeight * trigger) {
    reveal(state, timed, observer);
  }
}

function addEntrance(source, items, rows = false) {
  if (!items.length) return;
  const ready = items.map((item) => !item.hasAttribute('data-block-status') || item.dataset.blockStatus === 'loaded');
  const rowTops = rows ? items.map((item) => item.offsetTop) : null;
  let state = groups.get(source);
  if (state && !state.stale && state.items.length === items.length
    && state.items.every((item, index) => (
      item === items[index] && state.ready[index] === ready[index]
    )) && (!rows || state.rowTops?.every((top, index) => top === rowTops[index]))) return;
  const previousItems = state?.items;
  const skipped = items.map((item, index) => {
    if (previousItems?.[index] === item
      && ((!state.stale && state.ready[index] === ready[index]) || state.played.has(index))) {
      return state.skipped[index];
    }
    item.classList.remove('c2-entrance-item');
    return hasOtherAnimation(item);
  });
  state?.observers.forEach((observer) => observer.disconnect());
  state?.listeners.abort();
  previousItems?.filter((item) => !items.includes(item)).forEach(clearItem);
  const played = state?.played ?? new Set();
  if (previousItems?.[0] === source && played.has(0)) {
    items.forEach((item, index) => played.add(index));
  } else if (items[0] === source && played.size) played.add(0);
  state = {
    items,
    ready,
    rowTops,
    skipped,
    played,
    observers: [],
    listeners: new AbortController(),
  };
  groups.set(source, state);
  source.classList.add('c2-entrance-group');
  source.classList.toggle('c2-entrance-effect', isEffectOnly(source));

  const batches = [];
  items.forEach((item, index) => {
    if (!ready[index]) return;
    const previous = batches[batches.length - 1];
    if (previous && (!rows || Math.abs(items[previous[0]].offsetTop - item.offsetTop) < 2)) {
      previous.push(index);
    } else batches.push([index]);
  });

  batches.forEach((indices) => {
    const ordered = source.classList.contains('parallax-stagger-rtl') ? [...indices].reverse() : indices;
    ordered.forEach((index, order) => {
      if (!state.played.has(index) || previousItems?.[index] !== items[index]) {
        items[index].style.setProperty('--c2-entrance-index', String(order));
        items[index].style.setProperty('--c2-entrance-count', String(ordered.length));
      }
      items[index].classList.toggle('c2-entrance-item', !skipped[index]);
      if (state.played.has(index)) {
        items[index].classList.add('c2-entrance-played');
        if (previousItems[index] !== items[index]) items[index].classList.add('c2-entrance-settled');
      }
    });
    if (reducedMotion.matches) reveal(state, indices.filter((index) => !state.played.has(index)));
    else observeBatch(state, source, indices, rows);
  });
  source.addEventListener('focusin', () => {
    reveal(state, items.map((item, index) => index), undefined, true);
    state.observers.forEach((observer) => observer.disconnect());
  }, { once: true, signal: state.listeners.signal });
}

function directContent(el) {
  return [...el.children].filter((child) => !child.matches('[class*="section-"], .aria-live-container'));
}

function entranceGroups(section) {
  const sources = [...section.querySelectorAll('.c2-entrance-group')];
  if (section.classList.contains('c2-entrance-group')) sources.unshift(section);
  return sources;
}

function entranceItems(source) {
  if (isEffectOnly(source)) return [source];
  if (source.matches('.parallax-stagger-ltr, .parallax-stagger-rtl')) return directContent(source);
  if (source.matches('.parallax-move-up, .parallax-opacity')) return [source];
  if (source.matches('.rich-content')) return [...source.querySelector('.content')?.children ?? []];
  if (source.matches('.hover-list, .faq')) return directContent(source);
  return [source];
}

function initEntrances(section) {
  if (reducedMotion.matches) return;
  if (section.matches('[data-status="pending"], [data-status="decorated"]')) return;
  const isAside = SUPPORTS_HAS && section.matches(ASIDE_SELECTOR);
  const aside = isAside ? section.querySelector(`:scope > ${ASIDE_CONTENT}`) : null;
  const rich = aside?.previousElementSibling;
  entranceGroups(section).forEach((source) => {
    const isAsideHoverList = isAside && source.matches('.hover-list');
    if ((!source.matches(SOURCE_SELECTOR) && !isAsideHoverList)
      || source === rich || aside?.contains(source)
      || source.closest(SPECIALTY_SELECTOR)) clearEntrance(source);
  });
  const sources = [...section.querySelectorAll(SOURCE_SELECTOR)];
  if (section.matches(SOURCE_SELECTOR)) sources.unshift(section);
  sources.forEach((source) => {
    if (source.closest(SPECIALTY_SELECTOR)) return;
    if (source === rich || aside?.contains(source)) return;
    const block = source.closest('[data-block-status]');
    if (block && block.dataset.blockStatus !== 'loaded') return;
    const isEntrance = source.matches(ENTRANCE_SELECTOR);
    if (isEntrance && source.parentElement?.closest(ENTRANCE_SELECTOR)) return;
    addEntrance(source, entranceItems(source), source.matches('.parallax-stagger-ltr, .parallax-stagger-rtl'));
  });

  if (isAside) {
    section.querySelectorAll(':scope > .hover-list[data-block-status="loaded"]').forEach((source) => {
      addEntrance(source, directContent(source));
    });
  }
}

function authoredClasses(value) {
  return (value ?? '').split(/\s+/).filter((name) => name && !name.startsWith('c2-entrance-')).sort().join(' ');
}

// Ignore class changes this module makes itself so reveals don't rescan the section.
function needsRefresh(section, { type, target, attributeName, oldValue }) {
  if (type === 'childList') return true;
  if (target !== section && !target.hasAttribute('data-block-status')) return false;
  return attributeName !== 'class' || authoredClasses(oldValue) !== authoredClasses(target.className);
}

function trackedSections() {
  sections.forEach((observer, section) => {
    if (section.isConnected) return;
    observer.disconnect();
    sections.delete(section);
  });
  return [...sections.keys()];
}

let resizeFrame;
function refreshAfterResize() {
  resizeFrame = undefined;
  trackedSections().forEach((section) => {
    entranceGroups(section).forEach((source) => {
      const state = groups.get(source);
      if (state && state.played.size < state.items.length) state.stale = true;
    });
    initEntrances(section);
  });
}

function refreshMotionPreference() {
  trackedSections().forEach((section) => {
    if (!reducedMotion.matches) {
      initEntrances(section);
      return;
    }
    entranceGroups(section).forEach((source) => {
      const state = groups.get(source);
      if (!state) return;
      state.observers.forEach((observer) => observer.disconnect());
      reveal(state, state.items.map((item, index) => index));
    });
  });
}

let listening = false;
function listenOnce() {
  if (listening) return;
  listening = true;
  window.addEventListener('resize', () => {
    if (!resizeFrame) resizeFrame = requestAnimationFrame(refreshAfterResize);
  });
  reducedMotion.addEventListener('change', refreshMotionPreference);
}

export default function initContentAnimations(block) {
  const section = block.closest('.section');
  if (!section) return;
  initEntrances(section);
  if (trackedSections().includes(section)) return;
  const observer = new MutationObserver((mutations) => {
    if (!section.isConnected) return;
    if (mutations.some((mutation) => needsRefresh(section, mutation))) initEntrances(section);
  });
  observer.observe(section, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ['class', 'data-status'],
  });
  listenOnce();
  sections.set(section, observer);
}
