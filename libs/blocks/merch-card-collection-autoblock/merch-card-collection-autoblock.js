import { createTag, getConfig, loadStyle, localizeLinkAsync } from '../../utils/utils.js';
import { debounce } from '../../utils/action.js';
import { postProcessAutoblock, handleCustomAnalyticsEvent } from '../merch/autoblock.js';
import { mepMasStudioUrls } from '../merch/mas-mep-utils.js';
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

// Plans (product-pricing) uses a plain-HTML filter bar + left drawer instead of
// the SWC sidenav. Both write filter/types to the URL hash; the collection
// re-filters via its own hashchange listener. Group cards, pills, and filter
// wiring are added in later phases.
const SLIDERS_ICON = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 4h6M12 4h2M2 8h2M8 8h6M2 12h6M12 12h2" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="10" cy="4" r="1.5" fill="currentColor"/><circle cx="6" cy="8" r="1.5" fill="currentColor"/><circle cx="10" cy="12" r="1.5" fill="currentColor"/></svg>';
const CLOSE_ICON = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.5"/></svg>';
const CHEVRON_ICON = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>';
const SEARCH_ICON = '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M11 11l4 4" stroke="currentColor" stroke-width="1.5"/></svg>';

const svgIcon = (markup) => createTag('span', { class: 'icon' }, markup);

// Dispatched by the collection after each render; detail.resultCount is the
// full filtered set size (before pagination).
const COLLECTION_LITERALS_CHANGED = 'merch-card-collection:literals-changed';

// Count of active filters shown as "N Applied" and in the trigger label.
// The default category (and 'all') do not count.
export function countApplied(defaultFilter = 'all') {
  const params = new URLSearchParams(window.location.hash.slice(1));
  const filter = params.get('filter');
  const category = filter && filter !== defaultFilter && filter !== 'all' ? 1 : 0;
  const types = (params.get('types') || '').split(',').filter(Boolean).length;
  const pricing = params.get('pricing') ? 1 : 0;
  return category + types + pricing;
}

// Normalize collection data into filter groups the drawer and bar both render.
// Category comes from the single-select hierarchy (deeplink 'filter'); each
// tagFilter is a multi-select group (deeplink 'types').
export function plansFilterGroups(data) {
  const { hierarchy = [], sidenavSettings = {}, placeholders = {} } = data;
  const groups = [];
  if (hierarchy.length) {
    groups.push({
      title: placeholders.sidenavFilterCategories || 'Category',
      deeplink: 'filter',
      multi: false,
      options: hierarchy.map((node) => ({
        value: node.queryLabel || node.label.toLowerCase(),
        label: node.label,
      })),
    });
  }
  (sidenavSettings.tagFilters || [])
    .filter((group) => group.checkboxes?.length)
    .forEach((group) => groups.push({
      title: group.title || group.label || group.deeplink,
      deeplink: group.deeplink,
      // types combines (multi); other tag groups (e.g. pricing) are exclusive.
      multi: group.deeplink === 'types',
      options: group.checkboxes.map((cb) => ({ value: cb.name, label: cb.label })),
    }));
  return groups;
}

// Pill toggle. A delegated click handler reads these data attributes and
// writes the URL hash; selected state reflects aria-pressed.
function buildPill({ value, label }, group) {
  const attrs = {
    class: 'plans-pill',
    type: 'button',
    'aria-pressed': 'false',
    'data-deeplink': group.deeplink,
    'data-value': value,
    'data-multi': String(group.multi),
  };
  return createTag('button', attrs, label);
}

// filter is single-select (radio); types is a comma-joined multi-select list.
// MAS's own hashchange listener re-filters the grid when the hash changes.
export function toggleFilterHash(deeplink, value, multi) {
  const params = new URLSearchParams(window.location.hash.slice(1));
  if (multi) {
    const values = (params.get(deeplink) || '').split(',').filter(Boolean);
    const idx = values.indexOf(value);
    if (idx >= 0) values.splice(idx, 1);
    else values.push(value);
    if (values.length) params.set(deeplink, values.join(','));
    else params.delete(deeplink);
  } else if (params.get(deeplink) === value && deeplink !== 'filter') {
    params.delete(deeplink); // exclusive group: re-click clears it
  } else {
    params.set(deeplink, value);
  }
  params.sort();
  window.location.hash = params.toString();
}

function setHashParam(key, value) {
  const params = new URLSearchParams(window.location.hash.slice(1));
  if (value) params.set(key, value);
  else params.delete(key);
  params.sort();
  window.location.hash = params.toString();
}

export function syncPills(root) {
  const params = new URLSearchParams(window.location.hash.slice(1));
  root.querySelectorAll('.plans-pill').forEach((pill) => {
    const raw = params.get(pill.dataset.deeplink) || '';
    const active = pill.dataset.multi === 'true'
      ? raw.split(',').includes(pill.dataset.value)
      : raw === pill.dataset.value;
    pill.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

function buildGroupCard(group) {
  const heading = createTag('button', { class: 'plans-group-header', type: 'button', 'aria-expanded': 'true' }, [createTag('span', {}, group.title), svgIcon(CHEVRON_ICON)]);
  const body = createTag('div', { class: 'plans-group-pills' }, group.options.map((opt) => buildPill(opt, group)));
  heading.addEventListener('click', () => {
    const expanded = heading.getAttribute('aria-expanded') === 'true';
    heading.setAttribute('aria-expanded', String(!expanded));
    body.hidden = expanded;
  });
  return createTag('div', { class: 'plans-group' }, [heading, body]);
}

function buildPlansDrawer(collection, groups) {
  const { placeholders = {} } = collection.data;
  const label = (key, fallback) => placeholders[key] || fallback;

  const title = createTag('h2', { class: 'plans-drawer-title' }, label('allFilters', 'All Filters'));
  const closeBtn = createTag('button', { class: 'plans-drawer-close', type: 'button', 'aria-label': label('catalogSidenavClose', 'Close') }, svgIcon(CLOSE_ICON));
  const header = createTag('div', { class: 'plans-drawer-header' }, [title, closeBtn]);

  const applied = createTag('span', { class: 'plans-drawer-applied' });
  const results = createTag('span', { class: 'plans-drawer-results' });
  const counts = createTag('div', { class: 'plans-drawer-counts' }, [applied, results]);
  const reset = createTag('button', { class: 'plans-drawer-reset', type: 'button' }, label('reset', 'Reset'));
  const subRow = createTag('div', { class: 'plans-drawer-subrow' }, [counts, reset]);

  const groupsEl = createTag('div', { class: 'plans-drawer-groups' }, groups.map(buildGroupCard));

  // Inner wrapper so backdrop clicks target the dialog while content clicks don't.
  const inner = createTag('div', { class: 'plans-drawer-inner' }, [header, subRow, groupsEl]);
  // <dialog> gives focus trap, Esc-to-close, inert background, and focus restore.
  return createTag('dialog', { class: 'plans-drawer', 'aria-label': label('allFilters', 'All Filters') }, inner);
}

function buildPlansBar(collection, groups) {
  const { placeholders = {} } = collection.data;
  const label = (key, fallback) => placeholders[key] || fallback;

  const triggerLabel = createTag('span', { class: 'plans-trigger-label' }, label('allFilters', 'All Filters'));
  const triggerAttrs = { class: 'plans-filter-trigger', type: 'button', 'aria-haspopup': 'dialog', 'aria-expanded': 'false' };
  const trigger = createTag('button', triggerAttrs, [svgIcon(SLIDERS_ICON), triggerLabel]);

  // Quick pills mirror the Category options; multi-select groups stay in the drawer.
  const category = groups[0];
  const quickPills = category
    ? category.options.map((opt) => buildPill(opt, category))
    : [];
  const pills = createTag('div', { class: 'plans-filter-pills' }, quickPills);

  const searchInput = createTag('input', { class: 'plans-filter-search-input', type: 'search', placeholder: label('searchText', 'Search') });
  const search = createTag('div', { class: 'plans-filter-search' }, [searchInput, svgIcon(SEARCH_ICON)]);

  return createTag('div', { class: 'plans-filter-bar' }, [trigger, pills, search]);
}

function mountPlansFilter(collection, container) {
  // preview re-renders the collection; mount once per element.
  if (collection.plansFilterMounted) return;
  collection.plansFilterMounted = true;
  const { base } = getConfig();
  loadStyle(`${base}/blocks/merch-card-collection-autoblock/merch-card-collection-autoblock.css`);

  const groups = plansFilterGroups(collection.data);
  const drawer = buildPlansDrawer(collection, groups);
  const bar = buildPlansBar(collection, groups);
  const trigger = bar.querySelector('.plans-filter-trigger');
  const open = () => { drawer.showModal(); trigger.setAttribute('aria-expanded', 'true'); };
  const close = () => drawer.close();
  trigger.addEventListener('click', open);
  drawer.querySelector('.plans-drawer-close').addEventListener('click', close);
  drawer.addEventListener('close', () => trigger.setAttribute('aria-expanded', 'false'));
  // Backdrop clicks target the dialog element; content clicks do not.
  drawer.addEventListener('click', (e) => { if (e.target === drawer) close(); });

  const surfaces = [bar, drawer];

  const { placeholders = {} } = collection.data;
  const allFiltersLabel = placeholders.allFilters || 'All Filters';
  const appliedEl = drawer.querySelector('.plans-drawer-applied');
  const resultsEl = drawer.querySelector('.plans-drawer-results');
  const triggerLabelEl = bar.querySelector('.plans-trigger-label');
  const searchInput = bar.querySelector('.plans-filter-search-input');
  const defaultFilter = groups[0]?.options?.[0]?.value;
  let resultCount;
  const updateCounts = () => {
    const applied = countApplied(defaultFilter);
    appliedEl.textContent = `${applied} ${placeholders.applied || 'Applied'}`;
    triggerLabelEl.textContent = `${allFiltersLabel} (${applied})`;
    resultsEl.textContent = resultCount == null ? '' : `${resultCount} ${placeholders.results || 'Results'}`;
  };
  const sync = () => {
    surfaces.forEach(syncPills);
    updateCounts();
    const term = new URLSearchParams(window.location.hash.slice(1)).get('search') || '';
    if (document.activeElement !== searchInput) searchInput.value = term;
  };
  searchInput.addEventListener('input', debounce(() => setHashParam('search', searchInput.value.trim())));

  surfaces.forEach((root) => root.addEventListener('click', (e) => {
    const pill = e.target.closest('.plans-pill');
    if (!pill) return;
    toggleFilterHash(pill.dataset.deeplink, pill.dataset.value, pill.dataset.multi === 'true');
  }));
  drawer.querySelector('.plans-drawer-reset').addEventListener('click', () => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    params.set('filter', defaultFilter || 'all');
    params.delete('types');
    params.delete('pricing');
    params.delete('search');
    params.sort();
    window.location.hash = params.toString();
  });
  collection.addEventListener(COLLECTION_LITERALS_CHANGED, (e) => {
    resultCount = e.detail?.resultCount;
    updateCounts();
  });
  window.addEventListener('hashchange', sync);
  // Default to the first category (e.g. Featured) when no filter is deep-linked.
  if (defaultFilter && !new URLSearchParams(window.location.hash.slice(1)).get('filter')) {
    setHashParam('filter', defaultFilter);
  }
  sync();

  container.prepend(bar);
  container.append(drawer);
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
  let name = card.querySelector('h3')?.textContent;
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
      mountPlansFilter(collection, container);
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
