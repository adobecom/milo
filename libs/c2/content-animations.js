const ENTRANCE_SELECTOR = '.parallax-line-height, .parallax-stagger-ltr, .parallax-stagger-rtl, .parallax-move-up, .parallax-opacity';
const SPECIALTY_SELECTOR = '.parallax-garage-door-reveal, .parallax-move-up-fast, .parallax-video-garage-door';
const ASIDE_SELECTOR = '.section.parallax-double-garage-door:has(> .rich-content:not(.hero, .merch-moment, .media) + .split-aside-grid)';
const ORIGINAL_ENTRANCES = new Set(['enable-parallax', 'enable-parallax-stagger', 'enable-grid-parallax']);
const groups = new WeakMap();
const sections = new WeakSet();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function preserveOtherAnimations(item) {
  const names = getComputedStyle(item).animationName.split(', ');
  if (names.some((name) => name !== 'none')) {
    item.style.setProperty(
      '--c2-entrance-remaining-animations',
      names.map((name) => (ORIGINAL_ENTRANCES.has(name) ? 'none' : name)).join(', '),
    );
  }
}

function reveal(state, indices, observer, settled = reducedMotion.matches) {
  indices.forEach((index) => {
    state.played.add(index);
    if (settled && state.original[index]) preserveOtherAnimations(state.items[index]);
    state.items[index]?.classList.add('c2-entrance-played');
    if (settled) state.items[index]?.classList.add('c2-entrance-settled');
  });
  observer?.disconnect();
}

function clearItem(item) {
  item.classList.remove('c2-entrance-item', 'c2-entrance-original', 'c2-entrance-played', 'c2-entrance-settled');
  item.style.removeProperty('--c2-entrance-index');
  item.style.removeProperty('--c2-entrance-count');
  item.style.removeProperty('--c2-entrance-remaining-animations');
}

function clearEntrance(source) {
  const state = groups.get(source);
  if (!state) return;
  state.observers.forEach((observer) => observer.disconnect());
  state.listeners.abort();
  state.items.forEach(clearItem);
  source.classList.remove('c2-entrance-group', 'c2-entrance-original');
  groups.delete(source);
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
  source.classList.add('c2-entrance-original');
  const original = items.map((item, index) => {
    if (previousItems?.[index] === item
      && ((!state.stale && state.ready[index] === ready[index]) || state.played.has(index))) {
      return state.original[index];
    }
    item.classList.remove('c2-entrance-item');
    return getComputedStyle(item).animationName.split(', ').some((name) => name !== 'none');
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
    original,
    played,
    observers: [],
    listeners: new AbortController(),
  };
  groups.set(source, state);
  source.classList.toggle('c2-entrance-original', original.some(Boolean));
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
      if (!state.played.has(index) || previousItems?.[index] !== items[index]) {
        items[index].style.setProperty('--c2-entrance-index', String(order));
        items[index].style.setProperty('--c2-entrance-count', String(ordered.length));
      }
      items[index].classList.add('c2-entrance-item');
      items[index].classList.toggle('c2-entrance-original', original[index]);
      if (original[index]) preserveOtherAnimations(items[index]);
      if (state.played.has(index)) {
        items[index].classList.add('c2-entrance-played');
        if (previousItems[index] !== items[index]) items[index].classList.add('c2-entrance-settled');
      } else if (original[index] && !reducedMotion.matches) {
        // Keep the original CSS range; only latch its first forward completion.
        items[index].getAnimations()
          .filter((animation) => ORIGINAL_ENTRANCES.has(animation.animationName))
          .forEach((animation) => {
            const finish = () => {
              if (animation.playState === 'finished'
                && items[index].getAnimations()
                  .filter((effect) => ORIGINAL_ENTRANCES.has(effect.animationName))
                  .every((effect) => effect.playState === 'finished')) {
                reveal(state, [index], undefined, true);
              }
            };
            animation.addEventListener('finish', finish, { signal: state.listeners.signal });
            finish();
          });
      }
    });
    const pending = indices.filter((index) => !state.played.has(index));
    if (!pending.length) return;
    if (reducedMotion.matches) {
      reveal(state, pending);
      return;
    }
    const timed = pending.filter((index) => !original[index]);
    if (!timed.length) return;

    const item = rows ? items[indices[0]] : source;
    const anchor = item.querySelector(':scope > .faq-trigger') ?? item;
    const style = getComputedStyle(item);
    const trigger = Number.parseFloat(style.getPropertyValue('--c2-entrance-trigger')) / 100;
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

function initEntrances(section) {
  if (reducedMotion.matches) return;
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

    if (source.matches('.parallax-stagger-ltr, .parallax-stagger-rtl')) {
      addEntrance(source, directContent(source), true);
    } else if (source.matches('.parallax-move-up, .parallax-opacity')) {
      addEntrance(source, [source]);
    } else if (source.matches('.rich-content')) {
      addEntrance(source, [...source.querySelector('.content')?.children ?? []]);
    } else if (source.matches('.hover-list, .faq')) {
      addEntrance(source, directContent(source));
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
      state.stale = true;
    });
    initEntrances(section);
  });
  reducedMotion.addEventListener('change', () => {
    if (!section.isConnected) return;
    if (!reducedMotion.matches) {
      initEntrances(section);
      return;
    }
    entranceGroups(section).forEach((source) => {
      const state = groups.get(source);
      if (!state) return;
      state.observers.forEach((entryObserver) => entryObserver.disconnect());
      reveal(state, state.items.map((item, index) => index));
    });
  });
}
