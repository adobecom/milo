import { createTag, getConfig } from '../../utils/utils.js';
import { postProcessAutoblock, handleCustomAnalyticsEvent } from '../merch/autoblock.js';
import '../../deps/mas/merch-card.js';
import '../../deps/mas/merch-quantity-select.js';
import {
  initService,
  getOptions,
  MEP_SELECTOR,
  overrideOptions,
  updateModalState,
  loadLitDependency,
  loadMasComponent,
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

function getTimeoutPromise(timeout) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(false), timeout);
  });
}

async function loadDependencies(options) {
  /** Load lit first as it's needed by MAS components */
  await loadLitDependency();

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
      window.lana?.log(`Invalid URL - ${iconPath}: ${e.toString()}`);
    }
  }
  return iconPath;
}

function getSidenav(collection) {
  if (!collection.data) return null;
  const { hierarchy, placeholders } = collection.data;
  if (!hierarchy?.length) return null;

  const titleKey = `${collection.variant}SidenavTitle`;
  const sidenav = createTag('merch-sidenav', { sidenavTitle: placeholders?.[titleKey] || '' });

  /* Search */
  const searchText = placeholders?.searchText;
  if (searchText) {
    const spectrumSearch = createTag('sp-search', { placeholder: searchText });
    const search = createTag('merch-search', { deeplink: 'search' });
    search.append(spectrumSearch);
    sidenav.append(search);
  }

  /* Filters */
  const spSidenav = createTag('sp-sidenav', { manageTabIndex: true });
  spSidenav.setAttribute('manageTabIndex', true);
  const sidenavList = createTag('merch-sidenav-list', { deeplink: 'filter' }, spSidenav);

  sidenavList.updateComplete.then(() => {
    sidenavList.querySelector('sp-sidenav')?.setAttribute('role', 'tablist');
    sidenavList.querySelectorAll('sp-sidenav-item').forEach((item) => {
      item.removeAttribute('role');
      item.shadowRoot?.querySelector('a')?.setAttribute('role', 'tab');
    });
  });

  let multilevel = false;
  function generateLevelItems(level, parent) {
    for (const node of level) {
      const value = node.queryLabel || node.label.toLowerCase();
      const item = createTag('sp-sidenav-item', { label: node.label, value });
      const iconPath = localizeIconPath(node.icon);
      if (iconPath) {
        createTag('img', { src: iconPath, slot: 'icon', alt: '' }, null, { parent: item });
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

  return sidenav;
}

function enableSidenavAnalytics(el) {
  el.sidenav?.addEventListener('merch-sidenav:select', ({ target }) => {
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

export const enableModalOpeningOnPageLoad = () => {
  window.addEventListener('mas:ready', ({ target }) => {
    target.querySelectorAll('[is="checkout-link"][data-modal-id]').forEach((cta) => {
      if (!cta.closest('.tabpanel[hidden]')) updateModalState({ cta });
    });
  });
};

export async function createCollection(el, options) {
  const aemFragment = createTag('aem-fragment', { fragment: options.fragment });
  // Get MEP overrides if available
  const { mep } = getConfig();
  const mepFragments = mep?.inBlock?.[MEP_SELECTOR]?.fragments || {};
  // Create attributes object only if we have fragments
  let attributes;
  if (Object.keys(mepFragments).length > 0) {
    const overrides = Object.entries(mepFragments)
      .map(([fragment, data]) => `${fragment}:${data.content}`)
      .join(',');
    attributes = { overrides };
  }
  const collection = createTag('merch-card-collection', attributes, aemFragment);
  const container = createTag('div', null, collection);
  let toReplace = el;
  const contentParent = el.closest('.content');
  const paragraph = contentParent?.querySelector(':scope > p');
  if (paragraph) toReplace = paragraph;
  toReplace.replaceWith(container);

  const success = await collection.checkReady();
  if (!success) {
    const { env } = getConfig();
    if (env.name !== 'prod') {
      collection.prepend(createTag('div', { }, 'Failed to load. Please check your VPN connection.'));
    }
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
    const sidenav = getSidenav(collection);
    if (sidenav) {
      collection.attachSidenav(sidenav);
    }
  }

  await postProcessAutoblock(collection, false);
  collection.requestUpdate();
  // card analytics is enabled in postProcessAutoblock
  enableSidenavAnalytics(collection);
}

export default async function init(el) {
  let options = { ...DEFAULT_OPTIONS, ...getOptions(el) };
  if (!options.fragment) return;
  enableModalOpeningOnPageLoad();
  options = overrideOptions(options.fragment, options);
  await loadDependencies(options);
  await createCollection(el, options);
}
