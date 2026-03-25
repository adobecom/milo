import { createTag, getConfig } from '../../utils/utils.js';
import { debounce } from '../../utils/action.js';
import { postProcessAutoblock, handleCustomAnalyticsEvent } from '../merch/autoblock.js';
import {
  initService,
  getOptions,
  MEP_SELECTOR,
  overrideOptions,
  updateModalState,
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

function getSidenav(collection) {
  if (!collection.data) return null;
  const { hierarchy, placeholders, sidenavSettings } = collection.data;
  if (!hierarchy?.length) return null;

  const titleKey = `${collection.variant}SidenavTitle`;
  const sidenav = createTag('merch-sidenav', { sidenavTitle: placeholders?.[titleKey] || '' });

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
    const resourcesSpSidenav = createTag('sp-sidenav', { manageTabIndex: true, label: placeholders?.sidenavResources || '' });
    resourcesSpSidenav.classList.add('resources');

    const resourcesList = createTag('merch-sidenav-list', {
      sidenavListTitle: sidenavSettings.linksTitle,
      'daa-ll': `${sidenavSettings.linksTitle}--resources`,
    }, resourcesSpSidenav);

    const resourceItem = createTag('sp-sidenav-item', {
      href: sidenavSettings.link,
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
  enableAnalytics(collection);
}

export default async function init(el) {
  let options = { ...DEFAULT_OPTIONS, ...getOptions(el) };
  if (!options.fragment) return;
  enableModalOpeningOnPageLoad();
  options = overrideOptions(options.fragment, options);
  await loadDependencies(options);
  await createCollection(el, options);
}
