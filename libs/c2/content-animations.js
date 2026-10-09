const ENTRANCE_SELECTOR = '.parallax-line-height, .parallax-stagger-ltr, .parallax-stagger-rtl, .parallax-move-up, .parallax-opacity';
const SPECIALTY_SELECTOR = '.parallax-garage-door-reveal, .parallax-move-up-fast, .parallax-video-garage-door';
const ASIDE_SELECTOR = '.section.parallax-double-garage-door:has(> .rich-content:not(.hero, .merch-moment, .media) + .split-aside-grid)';
const groups = new WeakMap();
const sections = new WeakSet();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function reveal(state, indices, observer, settled = reducedMotion.matches) {
  indices.forEach((index) => {
    state.played.add(index);
    state.items[index]?.classList.add('c2-entrance-played');
    if (settled) state.items[index]?.classList.add('c2-entrance-settled');
  });
  observer?.disconnect();
}

function clearEntrance(source) {
  const state = groups.get(source);
  if (!state) return;
  state.observers.forEach((observer) => observer.disconnect());
  state.items.forEach((item) => {
    item.classList.remove('c2-entrance-item', 'c2-entrance-played', 'c2-entrance-settled');
    delete item.dataset.c2EntranceStep;
  });
  source.classList.remove('c2-entrance-group');
  groups.delete(source);
}

function addEntrance(source, items, rows = false) {
  if (!items.length) return;
  const ready = items.map((item) => !item.hasAttribute('data-block-status') || item.dataset.blockStatus === 'loaded');
  const rowTops = rows ? items.map((item) => item.offsetTop) : null;
  let state = groups.get(source);
  if (state && state.items.length === items.length
    && state.items.every((item, index) => (
      item === items[index] && state.ready[index] === ready[index]
    )) && (!rows || state.rowTops?.every((top, index) => top === rowTops[index]))) return;
  const previousItems = state?.items;
  state?.observers.forEach((observer) => observer.disconnect());
  state = {
    items,
    ready,
    rowTops,
    played: state?.played ?? new Set(),
    observers: [],
  };
  groups.set(source, state);
  source.classList.add('c2-entrance-group');

  const batches = [];
  items.forEach((item, index) => {
    if (!ready[index]) return;
    const previous = batches[batches.length - 1];
    if (!rows || (previous && Math.abs(items[previous[0]].offsetTop - item.offsetTop) < 2)) {
      if (previous) previous.push(index);
      else batches.push([index]);
    } else batches.push([index]);
  });

  batches.forEach((indices) => {
    const ordered = source.classList.contains('parallax-stagger-rtl') ? [...indices].reverse() : indices;
    ordered.forEach((index, order) => {
      items[index].dataset.c2EntranceStep = order;
      items[index].classList.add('c2-entrance-item');
      if (state.played.has(index)) {
        items[index].classList.add('c2-entrance-played');
        if (previousItems[index] !== items[index]) items[index].classList.add('c2-entrance-settled');
      }
    });
    const pending = indices.filter((index) => !state.played.has(index));
    if (!pending.length) return;
    if (reducedMotion.matches) {
      reveal(state, pending);
      return;
    }

    const item = rows ? items[indices[0]] : source;
    const anchor = item.querySelector(':scope > .faq-trigger') ?? item;
    const style = getComputedStyle(item);
    const trigger = Number.parseFloat(style.getPropertyValue('--c2-entrance-trigger')) / 100;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) reveal(state, pending, observer);
    }, { rootMargin: `0px 0px ${Math.round(-window.innerHeight * (1 - trigger))}px 0px` });
    state.observers.push(observer);
    observer.observe(anchor);
    const rect = anchor.getBoundingClientRect();
    // Deep-linked content above the viewport must not remain hidden.
    if (rect.height && rect.width && rect.top <= window.innerHeight * trigger) {
      reveal(state, pending, observer);
    }
    source.addEventListener('focusin', () => reveal(state, pending, observer, true), { once: true });
  });
}

function directContent(el) {
  return [...el.children].filter((child) => !child.matches('[class*="section-"], .aria-live-container'));
}

function entranceGroups(section) {
  const sources = [...section.querySelectorAll('.c2-entrance-group')];
  if (section.classList.contains('c2-entrance-group')) sources.unshift(section);
  return sources;
}

function initEntrances(section) {
  if (section.matches('[data-status="pending"], [data-status="decorated"]')) return;
  const isAside = section.matches(ASIDE_SELECTOR);
  const aside = isAside
    ? section.querySelector(':scope > .rich-content:not(.hero, .merch-moment, .media) + .split-aside-grid') : null;
  const rich = aside?.previousElementSibling;
  entranceGroups(section).forEach((source) => {
    const isAsideHoverList = isAside && source.matches('.hover-list');
    if ((!source.matches(ENTRANCE_SELECTOR) && !isAsideHoverList)
      || source === rich || aside?.contains(source)
      || source.closest(SPECIALTY_SELECTOR)) clearEntrance(source);
  });
  const sources = [...section.querySelectorAll(ENTRANCE_SELECTOR)];
  if (section.matches(ENTRANCE_SELECTOR)) sources.unshift(section);
  sources.forEach((source) => {
    if (source.closest(SPECIALTY_SELECTOR)) return;
    if (source === rich || aside?.contains(source)) return;
    const block = source.closest('[data-block-status]');
    if (block && block.dataset.blockStatus !== 'loaded') return;
    if (source.parentElement?.closest(ENTRANCE_SELECTOR)) return;

    if (source.matches('.rich-content')) {
      addEntrance(source, [...source.querySelector('.content')?.children ?? []]);
    } else if (source.matches('.hover-list, .faq')) {
      addEntrance(source, directContent(source));
    } else if (source.matches('.parallax-stagger-ltr, .parallax-stagger-rtl')) {
      addEntrance(source, directContent(source), true);
    } else {
      addEntrance(source, [source]);
    }
  });

  if (isAside) {
    section.querySelectorAll(':scope > .hover-list[data-block-status="loaded"]').forEach((source) => {
      addEntrance(source, directContent(source));
    });
  }
}

export default function initContentAnimations(block) {
  const section = block.closest('.section');
  if (!section) return;
  initEntrances(section);
  if (sections.has(section)) return;
  sections.add(section);
  const observer = new MutationObserver((mutations) => {
    if (!section.isConnected) return;
    if (mutations.some(({ type, target }) => type === 'childList'
      || target === section || target.hasAttribute('data-block-status'))) initEntrances(section);
  });
  observer.observe(section, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'data-status'] });
  window.addEventListener('resize', () => {
    if (!section.isConnected) return;
    entranceGroups(section).forEach((source) => {
      const state = groups.get(source);
      if (!state || state.played.size === state.items.length) return;
      state.observers.forEach((entryObserver) => entryObserver.disconnect());
      state.items = [];
    });
    initEntrances(section);
  });
  reducedMotion.addEventListener('change', () => {
    if (!reducedMotion.matches || !section.isConnected) return;
    entranceGroups(section).forEach((source) => {
      const state = groups.get(source);
      if (!state) return;
      state.observers.forEach((entryObserver) => entryObserver.disconnect());
      reveal(state, state.items.map((item, index) => index));
    });
  });
}
