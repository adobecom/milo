import { createTag, getConfig, loadStyle, localizeLinkAsync } from '../../utils/utils.js';
import { debounce } from '../../utils/action.js';
import { postProcessAutoblock, handleCustomAnalyticsEvent } from '../merch/autoblock.js';
import { mepMasStudioUrls } from '../merch/mas-mep-utils.js';
import { getMetadata } from '../section-metadata/section-metadata.js';
import {
  initService,
  createAemFragment,
  getOptions,
  MEP_SELECTOR,
  overrideOptions,
  updateModalState,
  loadMasComponent,
  createFragmentErrorEl,
  isMasErrorEnv,
  MAS_MERCH_CARD,
  MAS_MERCH_QUANTITY_SELECT,
  MAS_MERCH_CARD_COLLECTION,
  MAS_MERCH_SIDENAV,
} from '../merch/merch.js';

const DEPS_TIMEOUT = 10000;
const DEFAULT_OPTIONS = { sidenav: true };

// Map of single_app values to their corresponding filter values
const SINGLE_APP_FILTER_MAP = {
  illustrator: 'illustration',
  indesign: 'design',
  animate: 'video-audio',
  premiere: 'video-audio',
  aftereffects: 'video-audio',
  audition: 'video-audio',
  incopy: 'design',
  lightroom_1tb: 'photography',
};

function hasOnlyTargetContent(parent, target) {
  if (!parent || !target || target.parentElement !== parent) return false;
  return [...parent.childNodes].every((node) => {
    if (node === target) return true;
    return node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '';
  });
}

function getTimeoutPromise(timeout) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(false), timeout);
  });
}

async function loadDependencies(options) {
  /** Load lit first as it's needed by MAS components */

  /** Load service */
  const servicePromise = initService();
  const success = await Promise.race([servicePromise, getTimeoutPromise(DEPS_TIMEOUT)]);
  if (!success) {
    throw new Error('Failed to initialize mas commerce service');
  }

  const { base } = getConfig();
  const dependencyPromises = [
    loadMasComponent(MAS_MERCH_CARD),
    loadMasComponent(MAS_MERCH_QUANTITY_SELECT),
    loadMasComponent(MAS_MERCH_CARD_COLLECTION),
    import(`${base}/features/spectrum-web-components/dist/theme.js`),
    import(`${base}/features/spectrum-web-components/dist/button.js`),
    import(`${base}/features/spectrum-web-components/dist/action-button.js`),
    import(`${base}/features/spectrum-web-components/dist/action-menu.js`),
    import(`${base}/features/spectrum-web-components/dist/search.js`),
    import(`${base}/features/spectrum-web-components/dist/menu.js`),
    import(`${base}/features/spectrum-web-components/dist/overlay.js`),
    import(`${base}/features/spectrum-web-components/dist/tray.js`),
  ];
  if (options.sidenav) {
    dependencyPromises.push(...[
      loadMasComponent(MAS_MERCH_SIDENAV),
      import(`${base}/features/spectrum-web-components/dist/base.js`),
      import(`${base}/features/spectrum-web-components/dist/shared.js`),
      import(`${base}/features/spectrum-web-components/dist/sidenav.js`),
      import(`${base}/features/spectrum-web-components/dist/checkbox.js`),
      import(`${base}/features/spectrum-web-components/dist/dialog.js`),
      import(`${base}/features/spectrum-web-components/dist/link.js`),
    ]);
  }
  await Promise.all(dependencyPromises);
}

function localizeIconPath(iconPath) {
  if (window.location.hostname.endsWith('.adobe.com') && iconPath?.match(/http[s]?:\/\/\S*\.(hlx|aem).(page|live)\//)) {
    try {
      const url = new URL(iconPath);
      return `https://www.adobe.com${url.pathname}`;
    } catch (e) {
      window.lana?.log(`Invalid URL - ${iconPath}: ${e.toString()}`, {
        tags: 'merch-card-collection',
        severity: 'error',
      });
    }
  }
  return iconPath;
}

function generateCheckboxGroups(checkboxGroups) {
  if (!checkboxGroups?.length) return [];
  const groups = [];
  for (const group of checkboxGroups) {
    const { title, label, deeplink, checkboxes } = group;
    if (checkboxes?.length) {
      const checkboxGroup = createTag('merch-sidenav-checkbox-group', {
        sidenavCheckboxTitle: title,
        label: label || deeplink,
        deeplink,
      });
      for (const checkbox of checkboxes) {
        const spCheckbox = createTag('sp-checkbox', {
          emphasized: true,
          name: checkbox.name,
          'daa-ll': `${checkbox.label}--${group.deeplink}`,
        });
        spCheckbox.textContent = checkbox.label;
        checkboxGroup.append(spCheckbox);
      }
      groups.push(checkboxGroup);
    }
  }

  return groups;
}

// Product-pricing uses a plain-HTML filter bar + left drawer instead of the
// SWC sidenav. Both write the active filters to the URL hash; the collection
// re-filters via its own hashchange listener.
const SLIDERS_ICON = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M1.3998 5.41718H3.53476C3.80728 6.56132 4.83179 7.41718 6.058 7.41718C7.28422 7.41718 8.30874 6.56132 8.58124 5.41718H14.5998C14.931 5.41718 15.1998 5.14843 15.1998 4.81718C15.1998 4.48593 14.931 4.21718 14.5998 4.21718H8.58124C8.30873 3.07303 7.28422 2.21718 6.058 2.21718C4.83179 2.21718 3.80727 3.07303 3.53476 4.21718H1.3998C1.06856 4.21718 0.799805 4.48593 0.799805 4.81718C0.799805 5.14843 1.06856 5.41718 1.3998 5.41718ZM6.058 3.41718C6.82988 3.41718 7.458 4.04531 7.458 4.81718C7.458 5.58905 6.82988 6.21718 6.058 6.21718C5.28613 6.21718 4.658 5.58905 4.658 4.81718C4.658 4.04531 5.28613 3.41718 6.058 3.41718Z"/><path d="M14.5998 10.6172H12.5813C12.3087 9.47304 11.2842 8.61719 10.058 8.61719C8.8318 8.61719 7.80728 9.47304 7.53477 10.6172H1.3998C1.06856 10.6172 0.799805 10.8859 0.799805 11.2172C0.799805 11.5484 1.06856 11.8172 1.3998 11.8172H7.53476C7.80728 12.9613 8.83179 13.8172 10.058 13.8172C11.2842 13.8172 12.3087 12.9613 12.5812 11.8172H14.5998C14.931 11.8172 15.1998 11.5484 15.1998 11.2172C15.1998 10.8859 14.9311 10.6172 14.5998 10.6172ZM10.058 12.6172C9.28613 12.6172 8.658 11.9891 8.658 11.2172C8.658 10.4453 9.28613 9.81719 10.058 9.81719C10.8299 9.81719 11.458 10.4453 11.458 11.2172C11.458 11.9891 10.8299 12.6172 10.058 12.6172Z"/></svg>';
const CHEVRON_ICON = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>';
const CLOSE_ICON = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.5"/></svg>';
const SEARCH_ICON = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M11 11l4 4" stroke="currentColor" stroke-width="1.5"/></svg>';

const svgIcon = (markup) => createTag('span', { class: 'product-pricing-icon' }, markup);

// Dispatched by the collection after each render; detail.resultCount is the
// full filtered set size (before pagination).
const COLLECTION_LITERALS_CHANGED = 'merch-card-collection:literals-changed';

// "Show more" step. MAS defaults every collection to 27.
const PAGE_SIZE = 12;

const mountedCollections = new WeakSet();

const hashParams = () => new URLSearchParams(window.location.hash.slice(1));

// Sorted so a given filter set always produces the same hash.
function writeHash(params) {
  params.sort();
  window.location.hash = params.toString();
}

// A shopper's change goes back to page 1. Load-time params keep a deep-linked page.
const firstPage = (params) => {
  const next = new URLSearchParams(params);
  next.delete('page');
  return next;
};

// Every selected pill counts, including the default category, so Featured +
// Individuals reads "All Filters (2)". 'all' means unfiltered.
export function countApplied(params, groups = []) {
  return groups.reduce((total, { deeplink }) => {
    const raw = params.get(deeplink);
    return total + (raw && raw !== 'all' ? 1 : 0);
  }, 0);
}

// The one shape the bar and drawer both render.
// `default-<group>` in the section metadata names the option a group opens on.
export function productPricingFilterGroups(data, meta = {}) {
  const { hierarchy = [], sidenavSettings = {}, placeholders = {} } = data;
  const groups = [];
  const withDefault = (group) => {
    const named = meta[`default-${group.deeplink}`]?.text;
    const match = group.options.find((option) => option.value.toLowerCase() === named);
    return match ? { ...group, defaultValue: match.value } : group;
  };
  if (hierarchy.length) {
    groups.push(withDefault({
      title: placeholders.filtersCategory,
      deeplink: 'filter',
      optional: false,
      // Seeds the default filter and collapses to its active pill in the bar.
      category: true,
      options: hierarchy.map((node) => ({
        value: node.queryLabel || node.label.toLowerCase(),
        label: node.label,
      })),
    }));
  }
  (sidenavSettings.tagFilters || [])
    .filter((group) => group.checkboxes?.length)
    .forEach((group) => groups.push(withDefault({
      title: group.title || group.label || group.deeplink,
      deeplink: group.deeplink,
      // Every group is single-select. Only types can be cleared to none.
      optional: group.deeplink === 'types',
      options: group.checkboxes.map((cb) => ({ value: cb.name, label: cb.label })),
    })));
  return groups;
}

// Radios give exclusivity and arrow-key roving. Optional groups use checkboxes
// so the active pill can be cleared; the hash keeps them exclusive. `scope`
// keeps the bar and drawer copies of a group in separate radio groups.
function buildPill({ value, label }, group, scope) {
  const input = createTag('input', {
    type: group.optional ? 'checkbox' : 'radio',
    name: `${scope}-${group.deeplink}`,
    value,
    'data-deeplink': group.deeplink,
    'data-optional': String(group.optional),
  });
  return createTag('label', { class: 'product-pricing-pill' }, [input, label]);
}

// Selecting the active pill of an optional group clears it.
export function toggleParams(params, deeplink, value, optional) {
  const next = firstPage(params);
  if (optional && params.get(deeplink) === value) next.delete(deeplink);
  else next.set(deeplink, value);
  return next;
}

export function toggleFilterHash(deeplink, value, optional) {
  writeHash(toggleParams(hashParams(), deeplink, value, optional));
}

// MAS's own collection header never renders without an sp-sidenav, so the bar
// fills the authored <span data-placeholder="..."> holes itself. Only the empty
// case is needed, shown where the grid would be.
export function emptyResultsMarkup(placeholders = {}, values = {}) {
  const key = values.searchTerm ? 'noSearchResultsText' : 'noResultsText';
  const el = createTag('div', {}, placeholders[key] || '');
  el.querySelectorAll('[data-placeholder]').forEach((span) => {
    span.textContent = values[span.dataset.placeholder] ?? '';
  });
  return el.innerHTML;
}

// resultCount is undefined before the first render, 0 for an empty result set.
export function filterBarLabels(params, groups, placeholders, resultCount, categoryOff = false) {
  const applied = countApplied(params, categoryOff ? groups.filter((g) => !g.category) : groups);
  const category = groups.find((group) => group.category);
  const searchTerm = params.get('search') || '';
  const results = resultCount == null ? '' : `${resultCount} ${placeholders.filtersResults}`;
  return {
    applied: `${applied} ${placeholders.filtersApplied}`,
    trigger: `${placeholders.allFilters} (${applied})`,
    results,
    // Zero results is announced by the empty state.
    announce: resultCount ? results : '',
    empty: resultCount === 0 ? emptyResultsMarkup(placeholders, {
      resultCount,
      searchTerm,
      filter: category?.options.find((o) => o.value === params.get(category.deeplink))?.label || '',
    }) : '',
  };
}

// Tag pills that match no card, given the other groups' selections. Categories
// are never unavailable.
export function unavailablePills(cards, groups, params) {
  if (!cards.length) return new Set();
  const has = (card, { category, deeplink }, value) => (category
    ? value in card.filters
    : card.tags.includes(`${deeplink}:${value}`));
  const unavailable = new Set();
  groups.filter((group) => !group.category).forEach((group) => {
    const others = groups.filter((g) => g !== group && params.get(g.deeplink));
    group.options.forEach(({ value }) => {
      const matches = cards.some((card) => has(card, group, value)
        && others.every((other) => has(card, other, params.get(other.deeplink))));
      if (!matches) unavailable.add(`${group.deeplink}:${value}`);
    });
  });
  return unavailable;
}

const loadedCards = (collection) => [...collection.querySelectorAll(':scope > merch-card')]
  .filter((card) => !card.failed)
  .map((card) => ({
    filters: card.filters ?? {},
    tags: (card.getAttribute('filter-tags') || '').split(','),
    edu: card.getAttribute('size') === 'edu',
    // MAS hides filtered-out cards with an inline display:none.
    visible: card.style.display !== 'none',
  }));

// The EDU card is the only card showing.
export const eduOnly = (cards) => {
  const shown = cards.filter((card) => card.visible);
  return shown.length > 0 && shown.every((card) => card.edu);
};

const withoutGroups = (params, groups) => {
  const rest = new URLSearchParams(params);
  groups.forEach(({ deeplink }) => rest.delete(deeplink));
  return rest;
};

// A named default wins. Otherwise only the category opens on its first option.
const defaultValue = (group) => group.defaultValue
  ?? (group.category ? group.options[0]?.value : undefined);

// Required tag groups (pricing) follow the category.
const followsCategory = (group) => !group.category && !group.optional;

// Picking a category clears the groups that follow it.
export function selectCategory(params, groups, value) {
  const next = firstPage(params);
  groups.filter(followsCategory).forEach(({ deeplink }) => next.delete(deeplink));
  next.set(groups.find((group) => group.category).deeplink, value);
  return next;
}

// For each following group with no selection, its first option that a card of
// the category carries. A search selects nothing.
export function derivedSelections(cards, groups, params) {
  const category = groups.find((group) => group.category);
  const selected = params.get(category?.deeplink);
  if (!selected || params.has('search')) return [];
  const inCategory = cards.filter((card) => selected in card.filters);
  return groups.filter(followsCategory)
    .filter(({ deeplink }) => !params.get(deeplink))
    .flatMap(({ deeplink, options }) => {
      const first = options.find(({ value }) => inCategory
        .some((card) => card.tags.includes(`${deeplink}:${value}`)));
      return first ? [[deeplink, first.value]] : [];
    });
}

export function defaultParams(groups) {
  return groups
    .map((group) => [group.deeplink, defaultValue(group)])
    .filter(([, value]) => value);
}

// `category-off-for` lists group:tag pairs. Category is off while one is selected.
export const categoryOffTags = (meta) => (meta['category-off-for']?.text ?? '')
  .split(',').map((tag) => tag.trim()).filter(Boolean);

export const isCategoryOff = (params, tags) => tags.some((tag) => {
  const [group, value] = tag.split(':');
  return params.get(group) === value;
});

export function resetParams(params, groups) {
  const reset = withoutGroups(firstPage(params), groups);
  reset.delete('search');
  defaultParams(groups).forEach(([key, value]) => reset.set(key, value));
  return reset;
}

// Search runs over the whole catalog: category All, no other group.
export function scopeToSearch(params, groups) {
  const scoped = withoutGroups(params, groups);
  const category = groups.find((group) => group.category);
  if (category) scoped.set(category.deeplink, 'all');
  return scoped;
}

// The selections to restore when the search is cleared.
export function groupSelections(params, groups) {
  return groups
    .filter(({ deeplink }) => params.get(deeplink))
    .map(({ deeplink }) => [deeplink, params.get(deeplink)]);
}

// `saved` is undefined for a deep-linked search: fall back to the defaults.
export function leaveSearch(params, groups, saved = defaultParams(groups)) {
  const left = withoutGroups(params, groups);
  left.delete('search');
  saved.forEach(([key, value]) => left.set(key, value));
  return left;
}

// The URL after a search edit, and the selections to restore on clear.
// `params` is undefined when nothing changes.
export function searchTransition(params, term, saved, groups) {
  const searching = params.has('search');
  if (!term) {
    return searching
      ? { params: leaveSearch(firstPage(params), groups, saved), saved: undefined }
      : { params: undefined, saved };
  }
  // Only the first keystroke scopes, so pills picked during a search stick.
  const next = searching ? firstPage(params) : scopeToSearch(firstPage(params), groups);
  next.set('search', term);
  return { params: next, saved: searching ? saved : groupSelections(params, groups) };
}

// What a page load adds to the hash. A deep-linked search gets search scope, not defaults.
export function seedParams(params, groups) {
  const seeds = params.has('search')
    ? [...scopeToSearch(new URLSearchParams(), groups)]
    : defaultParams(groups);
  return seeds.filter(([key]) => !params.get(key));
}

export function syncPills(params, root) {
  root.querySelectorAll('.product-pricing-pill input').forEach((input) => {
    input.checked = params.get(input.dataset.deeplink) === input.value;
  });
}

// Optional groups (types) are drawer-only.
export function barGroups(groups) {
  return groups.filter((group) => !group.optional);
}

// Sections collapse on mobile only. The toggle is display:none above it, so
// desktop gets a plain heading. Optional groups get role=group because their
// pills are checkboxes, not radios.
function buildGroupCard(group) {
  const bodyId = `product-pricing-${group.deeplink}-pills`;
  const toggle = createTag('button', {
    class: 'product-pricing-group-toggle',
    type: 'button',
    'aria-expanded': 'true',
    'aria-controls': bodyId,
    'aria-label': group.title,
  }, svgIcon(CHEVRON_ICON));
  toggle.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', String(toggle.getAttribute('aria-expanded') !== 'true'));
  });
  const header = createTag('h3', { class: 'product-pricing-group-header' }, [createTag('span', {}, group.title), toggle]);
  const bodyAttrs = {
    id: bodyId,
    class: 'product-pricing-group-pills',
    role: group.optional ? 'group' : 'radiogroup',
    'aria-label': group.title,
  };
  const body = createTag('div', bodyAttrs, group.options.map((opt) => buildPill(opt, group, 'drawer')));
  return createTag('div', { class: 'product-pricing-group' }, [header, body]);
}

function buildProductPricingDrawer(collection, groups) {
  const { placeholders = {} } = collection.data;

  const title = createTag('h2', { class: 'product-pricing-drawer-title' }, placeholders.allFilters);
  const closeBtn = createTag('button', { class: 'product-pricing-drawer-close', type: 'button', 'aria-label': placeholders.catalogSidenavClose }, svgIcon(CLOSE_ICON));
  const header = createTag('div', { class: 'product-pricing-drawer-header' }, [title, closeBtn]);

  const applied = createTag('span', { class: 'product-pricing-drawer-applied' });
  const results = createTag('span', { class: 'product-pricing-drawer-results' });
  const counts = createTag('div', { class: 'product-pricing-drawer-counts' }, [applied, results]);
  const reset = createTag('button', { class: 'product-pricing-drawer-reset', type: 'button' }, placeholders.filtersReset);
  const subRow = createTag('div', { class: 'product-pricing-drawer-subrow' }, [counts, reset]);

  const groupsEl = createTag('div', { class: 'product-pricing-drawer-groups' }, groups.map(buildGroupCard));

  // Inner wrapper so backdrop clicks target the dialog while content clicks don't.
  const inner = createTag('div', { class: 'product-pricing-drawer-inner' }, [header, subRow, groupsEl]);
  // <dialog> gives focus trap, Esc-to-close, inert background, and focus restore.
  const root = createTag('dialog', { class: 'product-pricing-drawer', 'aria-label': placeholders.allFilters }, inner);
  return { root, closeBtn, reset, applied, results };
}

// One page = the row minus both fades, so the pill under the far fade lands
// just past the near one and nothing is skipped. Floor of half the row keeps
// a narrow row moving.
export function pageStep(rowWidth, fadeWidth) {
  return Math.max(rowWidth - 2 * fadeWidth, rowWidth / 2);
}

// Mirrors the CSS. The search is one MAS card wide: 3 columns (4 from 1440), 261px to 474px.
const PILL_GAP = 8;
const DESKTOP_MIN = 1280;
const XL_MIN = 1440;

export function searchWidth(viewport, barWidth) {
  const cols = viewport >= XL_MIN ? 4 : 3;
  return Math.min(474, Math.max(261, (barWidth - (cols - 1) * PILL_GAP) / cols));
}

// Uses the pills' own widths, so stacking cannot un-stack itself.
export function isStacked({ viewport, barWidth, pillWidths }) {
  const pills = pillWidths.reduce((sum, width) => sum + width + PILL_GAP, -PILL_GAP);
  return viewport < DESKTOP_MIN
    || pills + PILL_GAP + searchWidth(viewport, barWidth) > barWidth;
}

// Which edges have content past them. 1px slack absorbs subpixel widths.
// scrollLeft is negative in RTL, so measure from the start.
export function scrollEdges({ scrollLeft, scrollWidth, clientWidth }) {
  const fromStart = Math.abs(scrollLeft);
  return { prev: fromStart > 1, next: fromStart + clientWidth < scrollWidth - 1 };
}

// `next` scrolls toward the end of the row, which is left in RTL.
export function scrollOffset(dir, step, rtl) {
  return (dir === 'next') === rtl ? -step : step;
}

function buildProductPricingBar(collection, groups) {
  const { placeholders = {} } = collection.data;

  const triggerLabel = createTag('span', { class: 'product-pricing-trigger-label' }, placeholders.allFilters);
  const triggerAttrs = { class: 'product-pricing-filter-trigger', type: 'button', 'aria-haspopup': 'dialog', 'aria-expanded': 'false' };
  const trigger = createTag('button', triggerAttrs, [svgIcon(SLIDERS_ICON), triggerLabel]);

  const pillGroups = barGroups(groups).map((group) => createTag(
    'div',
    {
      // Collapsed to its active pill by CSS.
      class: `product-pricing-filter-group${group.category ? ' product-pricing-filter-group-active-only' : ''}`,
      role: 'radiogroup',
      'aria-label': group.title,
    },
    group.options.map((opt) => buildPill(opt, group, 'bar')),
  ));
  // Inside the scroller, so the trigger scrolls with the pills. Outside it, the
  // trigger would hold 141px of a 300px row on mobile.
  const pills = createTag('div', { class: 'product-pricing-filter-pills' }, [trigger, ...pillGroups]);
  // Over the edge fades, shown only while there is content past that edge, so
  // a tap there pages the row instead of hitting the half-hidden pill under it.
  // Pointer-only: keyboard focus already scrolls each pill into view.
  const scrollButton = (dir) => {
    const button = createTag('button', {
      class: `product-pricing-filter-scroll product-pricing-filter-scroll-${dir}`,
      type: 'button',
      tabindex: '-1',
      'aria-hidden': 'true',
    });
    button.addEventListener('click', () => {
      const step = pageStep(pills.clientWidth, button.offsetWidth);
      const rtl = getComputedStyle(pills).direction === 'rtl';
      pills.scrollBy({ left: scrollOffset(dir, step, rtl) });
    });
    return button;
  };
  const prev = scrollButton('prev');
  const next = scrollButton('next');
  const row = createTag('div', { class: 'product-pricing-filter-row' }, [prev, pills, next]);

  const searchInput = createTag('input', { class: 'product-pricing-filter-search-input', type: 'search', placeholder: placeholders.searchText, 'aria-label': placeholders.searchText });
  const search = createTag('div', { class: 'product-pricing-filter-search', role: 'search' }, [searchInput, svgIcon(SEARCH_ICON)]);

  const root = createTag('div', { class: 'product-pricing-filter-bar' }, [row, search]);
  const update = () => {
    const edges = scrollEdges(pills);
    prev.toggleAttribute('data-active', edges.prev);
    next.toggleAttribute('data-active', edges.next);
    root.toggleAttribute('data-stacked', isStacked({
      viewport: window.innerWidth,
      barWidth: root.clientWidth,
      pillWidths: [...pills.children].map((el) => el.offsetWidth).filter(Boolean),
    }));
  };
  pills.addEventListener('scroll', update, { passive: true });
  // The viewport or the active category pill can start or end the overflow.
  // Stacking resizes the bar, so update on the next frame.
  const resize = new ResizeObserver(() => requestAnimationFrame(update));
  [root, pills, ...pills.children].forEach((el) => resize.observe(el));
  return { root, trigger, triggerLabel, searchInput };
}

export function mountProductPricingFilter(collection, container) {
  // preview re-renders the collection; mount once per element.
  if (mountedCollections.has(collection)) return;
  mountedCollections.add(collection);
  collection.limit = PAGE_SIZE;
  const { base } = getConfig();
  loadStyle(`${base}/blocks/merch-card-collection-autoblock/merch-card-collection-autoblock.css`);

  const sectionMetadata = container.closest('.section')?.querySelector('.section-metadata');
  const meta = sectionMetadata ? getMetadata(sectionMetadata) : {};
  const groups = productPricingFilterGroups(collection.data, meta);
  const offTags = categoryOffTags(meta);
  const categoryDeeplink = groups.find((group) => group.category)?.deeplink;
  const drawer = buildProductPricingDrawer(collection, groups);
  const bar = buildProductPricingBar(collection, groups);
  const { trigger } = bar;
  const open = () => { drawer.root.showModal(); trigger.setAttribute('aria-expanded', 'true'); };
  const close = () => drawer.root.close();
  trigger.addEventListener('click', open);
  drawer.closeBtn.addEventListener('click', close);
  drawer.root.addEventListener('close', () => trigger.setAttribute('aria-expanded', 'false'));
  drawer.root.addEventListener('click', (e) => { if (e.target === drawer.root) close(); });

  const surfaces = [bar.root, drawer.root];

  const { placeholders = {} } = collection.data;
  const { searchInput } = bar;
  // Replaces the grid when a filter set matches nothing.
  const emptyEl = createTag('div', { class: 'product-pricing-results', role: 'status', 'aria-live': 'polite' });
  // Screen readers get the count, which the empty state does not cover.
  const countEl = createTag('div', { class: 'sr-only', role: 'status', 'aria-live': 'polite' });
  let resultCount;
  const renderLabels = (params) => {
    const off = isCategoryOff(params, offTags);
    const labels = filterBarLabels(params, groups, placeholders, resultCount, off);
    drawer.applied.textContent = labels.applied;
    bar.triggerLabel.textContent = labels.trigger;
    drawer.results.textContent = labels.results;
    emptyEl.innerHTML = labels.empty;
    // Same text again would be re-announced.
    if (countEl.textContent !== labels.announce) countEl.textContent = labels.announce;
  };
  // The selected pill stays live. Search is ignored.
  const renderAvailability = (params) => {
    const unavailable = unavailablePills(loadedCards(collection), groups, params);
    const categoryOff = isCategoryOff(params, offTags);
    surfaces.forEach((root) => root.querySelectorAll('.product-pricing-pill input').forEach((input) => {
      const offByCategory = categoryOff && input.dataset.deeplink === categoryDeeplink;
      input.disabled = offByCategory
        || (unavailable.has(`${input.dataset.deeplink}:${input.value}`) && !input.checked);
    }));
  };
  const render = (params) => {
    renderLabels(params);
    renderAvailability(params);
  };
  // Fills the following groups once cards load. True when it wrote the hash.
  const settle = () => {
    const missing = derivedSelections(loadedCards(collection), groups, hashParams());
    if (!missing.length) return false;
    const params = hashParams();
    missing.forEach(([key, value]) => params.set(key, value));
    writeHash(params);
    return true;
  };
  const sync = () => {
    if (settle()) return;
    const params = hashParams();
    surfaces.forEach((root) => syncPills(params, root));
    render(params);
    const term = params.get('search') || '';
    if (document.activeElement !== searchInput) searchInput.value = term;
  };
  // Selections to restore on clear. Undefined for a deep-linked search.
  let beforeSearch;
  searchInput.addEventListener('input', debounce(() => {
    const next = searchTransition(hashParams(), searchInput.value.trim(), beforeSearch, groups);
    beforeSearch = next.saved;
    if (next.params) writeHash(next.params);
  }));

  surfaces.forEach((root) => root.addEventListener('change', (e) => {
    const input = e.target.closest('.product-pricing-pill input');
    if (!input) return;
    if (input.dataset.deeplink === categoryDeeplink) {
      writeHash(selectCategory(hashParams(), groups, input.value));
    } else {
      toggleFilterHash(input.dataset.deeplink, input.value, input.dataset.optional === 'true');
    }
  }));
  drawer.reset.addEventListener('click', () => {
    beforeSearch = undefined;
    writeHash(resetParams(hashParams(), groups));
  });
  collection.addEventListener(COLLECTION_LITERALS_CHANGED, (e) => {
    resultCount = e.detail?.resultCount;
    settle();
    render(hashParams());
    collection.toggleAttribute('data-edu-only', eduOnly(loadedCards(collection)));
  });
  window.addEventListener('hashchange', sync);
  const initial = hashParams();
  const missing = seedParams(initial, groups);
  if (missing.length) {
    missing.forEach(([key, value]) => initial.set(key, value));
    writeHash(initial);
  }
  sync();

  container.prepend(bar.root, emptyEl, countEl);
  container.append(drawer.root);
}

async function getSidenav(collection) {
  if (!collection.data) return null;
  const { hierarchy, placeholders, sidenavSettings } = collection.data;
  if (!hierarchy?.length) return null;

  const titleKey = `${collection.variant}SidenavTitle`;
  const sidenav = createTag('merch-sidenav', { sidenavTitle: placeholders?.[titleKey] || '', 'close-text': placeholders?.catalogSidenavClose || '' });

  /* Search */
  const searchText = sidenavSettings?.searchText;
  if (searchText) {
    const spectrumSearch = createTag('sp-search', { placeholder: searchText });
    const search = createTag('merch-search', { deeplink: 'search' });
    search.append(spectrumSearch);
    sidenav.append(search);
  }

  /* Filters */
  const spSidenav = createTag('sp-sidenav', { manageTabIndex: true, label: placeholders?.sidenavFilterCategories || '' });
  spSidenav.setAttribute('manageTabIndex', true);
  const deeplink = collection.variant === 'catalog' ? 'category' : 'filter';
  const sidenavList = createTag('merch-sidenav-list', { deeplink }, spSidenav);

  // Filter items change page content rather than navigate, so button role fits better.
  sidenavList.updateComplete.then(() => {
    sidenavList.querySelectorAll('sp-sidenav-item:not([href])').forEach((item) => {
      item.shadowRoot?.querySelector('a')?.setAttribute('role', 'button');
    });
  });

  let multilevel = false;
  function generateLevelItems(level, parent) {
    for (const node of level) {
      const value = node.queryLabel || node.label.toLowerCase();
      const item = createTag('sp-sidenav-item', { label: node.label, value });
      let iconPath;
      if (node.icon?.startsWith('sp-icon-')) {
        createTag(node.icon, { slot: 'icon' }, null, { parent: item });
        iconPath = node.icon;
      } else {
        iconPath = localizeIconPath(node.icon);
        if (iconPath) {
          createTag('img', { src: iconPath, slot: 'icon', alt: '' }, null, { parent: item });
        }
      }
      if (node.iconLight || node.navigationLabel) {
        const attributes = { class: 'selection' };
        if (node.navigationLabel) attributes['data-selected-text'] = node.navigationLabel;
        if (node.iconLight) {
          attributes['data-light'] = localizeIconPath(node.iconLight);
          attributes['data-dark'] = iconPath;
        }
        createTag('var', attributes, null, { parent: item });
      }
      parent.append(item);
      if (node.collections) {
        multilevel = true;
        generateLevelItems(node.collections, item);
      }
    }
  }

  generateLevelItems(hierarchy, spSidenav);
  if (multilevel) spSidenav.setAttribute('variant', 'multilevel');

  sidenav.append(sidenavList);

  /* Checkbox Groups */
  const checkboxGroupElements = generateCheckboxGroups(sidenavSettings?.tagFilters);
  for (const group of checkboxGroupElements) {
    sidenav.append(group);
  }

  /* Resources List */
  if (sidenavSettings?.linksTitle && sidenavSettings?.link) {
    const localizedLink = await localizeLinkAsync(sidenavSettings.link);
    const resourcesSpSidenav = createTag('sp-sidenav', { manageTabIndex: true, label: placeholders?.sidenavResources || '' });
    resourcesSpSidenav.classList.add('resources');

    const resourcesList = createTag('merch-sidenav-list', {
      sidenavListTitle: sidenavSettings.linksTitle,
      'daa-ll': `${sidenavSettings.linksTitle}--resources`,
    }, resourcesSpSidenav);

    const resourceItem = createTag('sp-sidenav-item', {
      href: localizedLink,
      target: '_blank',
      'aria-label': placeholders?.catalogSpecialOffersAlt,
    });

    resourceItem.textContent = sidenavSettings.linkText || 'Link';

    if (sidenavSettings.linkIcon !== false) {
      const icon = createTag('sp-icon-link-out-light', {
        class: 'right',
        slot: 'icon',
        label: sidenavSettings.linkText || 'Link',
      });
      resourceItem.append(icon);
    }

    resourcesSpSidenav.append(resourceItem);
    sidenav.append(resourcesList);
  }

  return sidenav;
}

function generateCardName(card) {
  let name = card.querySelector('h1,h2,h3,h4,h5,h6')?.textContent;
  if (!name) return '';
  name = name.toLowerCase().replace(/[^0-9a-z]/gi, ' ').trim().replaceAll(' ', '-');
  while (name.includes('--')) {
    name = name.replaceAll('--', '-');
  }
  return name;
}

function enableSidenavAnalytics(el) {
  if (!el.sidenav) return;
  const snContainer = el.sidenav.closest('.collection-container');
  if (snContainer && !snContainer.getAttribute('daa-lh')) {
    const selectedValue = el.sidenav.querySelector('merch-sidenav-list')?.getAttribute('selected-value');
    snContainer.setAttribute('daa-lh', `${selectedValue || 'all'}--cat`);
  }
  el.sidenav.addEventListener('merch-sidenav:select', ({ target }) => {
    if (!target || target.oldValue === target.selectedValue) return;
    const container = target.closest('.collection-container');
    const updated = container.getAttribute('daa-lh')?.includes('--cat');
    container?.setAttribute('daa-lh', `${target.selectedValue}--cat`);
    if (updated) {
      handleCustomAnalyticsEvent('cat-changed', target);
    }
    target.oldValue = target.selectedValue;
  });
}

function enableAnalytics(el) {
  enableSidenavAnalytics(el);

  const header = el.parentElement.querySelector('merch-card-collection-header');
  header?.addEventListener('merch-card-collection:sort', ({ detail }) => {
    handleCustomAnalyticsEvent(`${detail?.value === 'authored' ? 'popularity' : detail?.value}--sort`, el);
  });

  el.sidenav?.search?.addEventListener('merch-search:change', debounce((e) => {
    handleCustomAnalyticsEvent(`${e.detail.value}--search`, el.sidenav.search);
  }, 1000));

  el.addEventListener('merch-card-collection:showmore', () => {
    handleCustomAnalyticsEvent('showmore', el);
  });

  el.addEventListener('merch-card:action-menu-toggle', ({ detail }) => {
    handleCustomAnalyticsEvent(`menu-toggle--${detail.card}`, el);
  });

  el.addEventListener('click', ({ target }) => {
    if (target.tagName === 'MERCH-ICON') {
      const card = target.closest('merch-card');
      handleCustomAnalyticsEvent(`merch-icon-click--${card?.name || generateCardName(card)}`, el);
    }
  });
}

export const enableModalOpeningOnPageLoad = () => {
  window.addEventListener('mas:ready', ({ target }) => {
    target.querySelectorAll('[is="checkout-link"][data-modal-id]').forEach((cta) => {
      if (!cta.closest('[role="tabpanel"][hidden]')) updateModalState({ cta });
    });
  });
};

function paintStPriceRed(collection, locale) {
  const tabsEl = collection.closest('.tab-content-container:not(.red-strikethrough-price)');
  if (collection.variant === 'plans' && tabsEl && locale?.prefix) {
    const prefix = locale.prefix.substring(1);
    const redStPriceGeos = ['gr_el', 'gr_en', 'lt', 'lv', 'pl', 'ro', 'si', 'bg', 'cz', 'ee', 'es', 'hu', 'pt', 'sk', 'hk_en', 'hk_zh', 'ph_en', 'ph_fil', 'th_en', 'th_th', 'tw', 'ng', 'vn_en', 'vn_vi', 'cr', 'ec', 'gt', 'at', 'dk', 'no', 'ca', 'ca_fr', 'ch_de', 'ch_fr', 'ch_it', 'de', 'fi', 'fr', 'nl', 'se', 'au', 'nz', 'uk', 'jp', 'it', 'br'];
    if (redStPriceGeos.includes(prefix)) tabsEl.classList.add('red-strikethrough-price');
  }
}

// MAS takes the variant from the first card, so a `pro` (EDU) card first makes the
// collection `plans`. Remove once MAS picks the variant from most cards.
export function fixProductPricingVariant(collection) {
  const cards = [...collection.querySelectorAll(':scope > merch-card')];
  if (collection.variant === 'product-pricing'
    || !cards.some((card) => card.variant === 'product-pricing')) return;
  collection.classList.remove(collection.variant, 'four-merch-cards');
  collection.classList.add('product-pricing');
  collection.variant = 'product-pricing';
}

export async function createCollection(el, options) {
  const aemFragment = createAemFragment(options);
  // Get MEP overrides if available
  const { mep, locale } = getConfig();
  const mepFragments = mep?.inBlock?.[MEP_SELECTOR]?.fragments || {};
  // Create attributes object only if we have fragments
  let attributes;
  if (Object.keys(mepFragments).length > 0) {
    const overrides = Object.entries(mepFragments)
      .filter(([, data]) => data['']?.content)
      .map(([fragment, data]) => `${fragment}:${data[''].content}`)
      .join(',');
    if (overrides) attributes = { overrides };
  }
  const collection = createTag('merch-card-collection', attributes, aemFragment);
  const container = createTag('div', null, collection);
  if (getConfig()?.mep?.preview) {
    mepMasStudioUrls.set(container, el.href);
    container.dataset.masBlock = 'collection';
    // Attach BEFORE the replaceWith below — M@S removes aem-fragment
    // immediately after dispatching aem:load. Dynamic import keeps
    // preview-only code out of the production bundle.
    const { attachAemLoadListener } = await import(
      '../../features/mep/mep-next/mep-mas-subcollection.js'
    );
    attachAemLoadListener(aemFragment, container);
  }
  const paragraph = el.parentElement;
  const toReplace = paragraph?.tagName === 'P' && hasOnlyTargetContent(paragraph, el)
    ? paragraph
    : el;
  toReplace.replaceWith(container);

  if (isMasErrorEnv()) {
    collection.addEventListener('aem:error', async (e) => {
      collection.prepend(await createFragmentErrorEl(options.fragment, 'Collection', e.detail?.status));
    }, { once: true });
  }

  const success = await collection.checkReady();
  if (!success && isMasErrorEnv() && !collection.querySelector('.mas-frag-error')) {
    collection.prepend(await createFragmentErrorEl(options.fragment, 'Collection'));
  }
  fixProductPricingVariant(collection);
  container.classList.add('collection-container', collection.variant);

  /* Sidenav */
  if (options.sidenav) {
    // Set filter based on single_app parameter if filter doesn't exist
    const urlParams = new URLSearchParams(window.location.search);
    const singleApp = urlParams.get('single_app');
    if (singleApp && !urlParams.get('filter') && SINGLE_APP_FILTER_MAP[singleApp]) {
      urlParams.set('filter', SINGLE_APP_FILTER_MAP[singleApp]);
      const newUrl = `${window.location.pathname}?${urlParams.toString()}${window.location.hash}`;
      window.history.pushState({}, '', newUrl);
    }
    if (collection.variant === 'product-pricing') {
      mountProductPricingFilter(collection, container);
    } else {
      const sidenav = await getSidenav(collection);
      if (sidenav) {
        collection.attachSidenav(sidenav);
      }
    }
  }

  await postProcessAutoblock(collection, false);
  collection.requestUpdate();
  // card analytics is enabled in postProcessAutoblock
  enableAnalytics(collection);
  paintStPriceRed(collection, locale);
}

export default async function init(el) {
  let options = { ...DEFAULT_OPTIONS, ...getOptions(el) };
  if (!options.fragment) return;
  enableModalOpeningOnPageLoad();
  options = overrideOptions(options.fragment, options);
  await loadDependencies(options);
  await createCollection(el, options);
}
