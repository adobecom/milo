/*
 * tabs - consonant v6
 * https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Tab_Role
 */
import { createTag, MILO_EVENTS, getConfig, localizeLinkAsync } from '../../../utils/utils.js';
import { processTrackingLabels } from '../../../martech/attributes.js';

const tabColor = {};
const linkedTabs = {};
const tabChangeEvent = new Event('milo:tab:changed');

const getScrollContainer = (tab) => {
  const tabList = tab.closest('[role="tablist"]');
  return tabList.scrollWidth > tabList.clientWidth ? tabList : tabList.parentElement;
};

const isTabInTabListView = (tab) => {
  const container = getScrollContainer(tab);
  const tabRect = tab.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  return (
    Math.round(tabRect.left) >= Math.round(containerRect.left)
    && Math.round(tabRect.right) <= Math.round(containerRect.right)
  );
};

const scrollTabIntoView = (tab) => {
  if (isTabInTabListView(tab)) return;
  const container = getScrollContainer(tab);
  const tabRect = tab.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const scrollLeft = container.scrollLeft + tabRect.left - containerRect.left
    - (containerRect.width - tabRect.width) / 2;
  container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
};

export function getRedirectionUrl(linkedTabsList, targetId) {
  if (!targetId || !linkedTabsList[targetId] || window.location.pathname === linkedTabsList[targetId]) return '';
  const currentUrl = new URL(window.location.href);
  /* c8 ignore next 4 */
  const tabParam = currentUrl.searchParams.get('tab');
  if (tabParam) {
    currentUrl.searchParams.set('tab', `${tabParam.split('-')[0]}-${targetId.split('-')[2]}`);
  }
  currentUrl.pathname = linkedTabsList[targetId];
  return currentUrl;
}

const generateStorageName = (tabId) => {
  const { pathname } = window.location;
  return `${pathname}/${tabId}-tab-state`;
};

const loadActiveTab = (config) => {
  if (config.remember !== 'on') return 0;

  const tabId = config['tab-id'];
  return sessionStorage.getItem(generateStorageName(tabId));
};

const saveActiveTabInStorage = (targetId, config) => {
  if (config.remember !== 'on') return;

  const delimiterIndex = targetId.lastIndexOf('-');
  const activeTabIndex = targetId.substring(delimiterIndex + 1);
  const storageName = generateStorageName(config['tab-id']);
  sessionStorage.setItem(storageName, activeTabIndex);
};

function triggerTabEnterAnimation(panel) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cards = [...panel.querySelectorAll('.section merch-card')];
  if (!cards.length) return;

  panel.classList.add('tab-entering');
  let remaining = cards.length;

  panel.addEventListener('animationend', function onAnimEnd(e) {
    if (!cards.includes(e.target)) return;
    remaining -= 1;
    if (remaining <= 0) {
      panel.classList.remove('tab-entering');
      panel.removeEventListener('animationend', onAnimEnd);
    }
  });
}

function moveIndicator(indicator, target, container) {
  const btnRect = target.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  indicator.style.width = `${btnRect.width}px`;
  indicator.style.transform = `translateX(${btnRect.left - containerRect.left + container.scrollLeft}px)`;
}

function changeTabs(e, config) {
  const { target } = e;
  if (target.getAttribute('aria-selected') === 'true') return;
  const targetId = target.getAttribute('id');
  const redirectionUrl = getRedirectionUrl(linkedTabs, targetId);
  /* c8 ignore next 4 */
  if (redirectionUrl) {
    window.location.assign(redirectionUrl);
    return;
  }
  const parent = target.closest('.tab-list-container');
  const tabsBlock = target.closest('.tabs');
  const content = tabsBlock.lastElementChild;
  const blockId = tabsBlock.id;

  const targetContent = content.querySelector(`#${target.getAttribute('aria-controls')}`);

  parent
    .querySelectorAll(`[aria-selected="true"][data-block-id="${blockId}"]`)
    .forEach((t) => {
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
      if (Object.keys(tabColor).length) {
        t.style.backgroundColor = '';
      }
    });
  target.setAttribute('aria-selected', 'true');
  target.setAttribute('tabindex', '0');

  const indicator = parent.querySelector('.tab-indicator');
  if (indicator) moveIndicator(indicator, target, parent);
  if (tabColor[targetId]) {
    target.style.backgroundColor = tabColor[targetId];
  }
  scrollTabIntoView(target);
  content
    .querySelectorAll(`.tabpanel[data-block-id="${blockId}"]`)
    .forEach((p) => {
      p.setAttribute('hidden', true);
      p.classList.remove('tab-entering');
    });
  targetContent?.removeAttribute('hidden');
  if (tabsBlock.classList.contains('staggered-intro-merch-cards') && targetContent) {
    triggerTabEnterAnimation(targetContent);
  }
  window.dispatchEvent(tabChangeEvent);
  saveActiveTabInStorage(targetId, config);
}

function getStringKeyName(str) {
  // The \p{L} and \p{N} Unicode props are used to match any letter or digit character in any lang.
  const regex = /[^\p{L}\p{N}_-]/gu;
  return str.trim().toLowerCase().replace(/\s+/g, '-').replace(regex, '');
}

function getUniqueId(el, rootElem) {
  const tabs = rootElem.querySelectorAll('.tabs');
  return [...tabs].indexOf(el) + 1;
}

function configTabs(config, rootElem) {
  const params = new URLSearchParams(window.location.search);
  // Deeplink with a custom id parameter, e.g. ?plans=edu
  const deeplinkParam = params.get(config.id);
  if (deeplinkParam) {
    const tabBtn = rootElem.querySelector(`[data-deeplink="${deeplinkParam}"]`);
    if (tabBtn) {
      tabBtn.click();
      if (config.remember === 'on') {
        const deeplinkUrl = new URL(window.location.href);
        deeplinkUrl.searchParams.delete(config.id);
        window.history.replaceState({}, null, deeplinkUrl);
      }
      return;
    }
  }
  // Deeplink with tab parameter, e.g. ?tab=plans-2
  const tabParam = params.get('tab');
  if (tabParam) {
    const dashIndex = tabParam.lastIndexOf('-');
    const [tabsId, tabIdx] = [tabParam.substring(0, dashIndex), tabParam.substring(dashIndex + 1)];
    if (tabsId === config.id) {
      const tabBtn = rootElem.querySelector(`#tab-${config.id}-${tabIdx}`);
      if (tabBtn) {
        tabBtn.click();
        return;
      }
    }
  }

  if (!config['active-tab']) return;
  const id = `#tab-${CSS.escape(config['tab-id'])}-${CSS.escape(getStringKeyName(config['active-tab']))}`;
  const sel = rootElem.querySelector(id);
  if (!sel) return;
  sel.addEventListener('click', (e) => e.stopPropagation(), { once: true });
  sel.click();
}

function initTabs(elm, config, rootElem) {
  const tabs = elm.querySelectorAll('[role="tab"]');
  const tabLists = elm.querySelectorAll('[role="tablist"]');
  let tabFocus = 0;
  tabLists.forEach((tabList) => {
    tabList.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const forward = e.key === (document.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight');
      tabFocus = (tabFocus + (forward ? 1 : -1) + tabs.length) % tabs.length;
      tabs.forEach((t) => t.setAttribute('tabindex', '-1'));
      tabs[tabFocus].setAttribute('tabindex', '0');
      tabs[tabFocus].focus();
    });
  });
  tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => changeTabs(e, config));
    tab.addEventListener('focus', () => scrollTabIntoView(tab));
  });
  configTabs(config, rootElem);
}

const handleDeferredImages = (block) => {
  /* c8 ignore next 6 */
  const loadLazyImages = () => {
    const images = block.querySelectorAll('img[loading="lazy"]');
    images.forEach((img) => {
      img.removeAttribute('loading');
    });
  };
  document.addEventListener(MILO_EVENTS.DEFERRED, loadLazyImages, { once: true, capture: true });
};

export async function assignLinkedTabs(linkedTabsList, metaSettings, id, val) {
  if (!metaSettings.link || !id || !val || !linkedTabsList) return;
  const { link } = metaSettings;

  try {
    const url = new URL(link);
    linkedTabsList[`tab-${id}-${val}`] = await localizeLinkAsync(link, url.hostname);
  } catch {
    // @see https://jira.corp.adobe.com/browse/MWPW-170787
    // TODO support for relative links to be removed after authoring makes full switch
    if (!/^\/(?:[a-zA-Z0-9-_]+(?:\/[a-zA-Z0-9-_]+)*)?$/.test(link)) return;
    linkedTabsList[`tab-${id}-${val}`] = link;
  }
}

const init = async (block) => {
  const rootElem = block.closest('.fragment') || document;
  const rows = block.querySelectorAll(':scope > div');
  const parentSection = block.closest('.section');
  /* c8 ignore next */
  if (!rows.length) return;

  // Tab Config
  const config = {};
  const configRows = [...rows];
  configRows.splice(0, 1);
  configRows.forEach((row) => {
    const rowKey = getStringKeyName(row.children[0].textContent);
    const rowVal = row.children[1].textContent.trim();
    config[rowKey] = rowVal;
    row.remove();
  });
  const tabId = config.id || getUniqueId(block, rootElem);
  config['tab-id'] = tabId;

  const activeTabIndex = loadActiveTab(config);
  if (activeTabIndex) config['active-tab'] = activeTabIndex;

  block.id = `tabs-${tabId}`;
  parentSection?.classList.add(`tablist-${tabId}-section`);

  // Tab Content
  const tabContentContainer = createTag('div', { class: 'tab-content-container' });
  const tabContent = createTag('div', { class: 'tab-content' }, tabContentContainer);
  block.append(tabContent);

  // Tab List
  const tabList = rows[0];
  tabList.classList.add('tab-list');
  tabList.setAttribute('role', 'tablist');
  const tabListContainer = tabList.querySelector(':scope > div');
  tabListContainer.classList.add('tab-list-container');
  const tabListLabel = config.pretext;
  if (tabListLabel) tabList.setAttribute('aria-label', tabListLabel);

  const tabListItems = rows[0].querySelectorAll(':scope li');

  if (tabListItems.length) {
    tabListItems.forEach((item, i) => {
      const tabName = config.id ? i + 1 : getStringKeyName(item.textContent);
      const controlId = `tab-panel-${tabId}-${tabName}`;
      const tabBtnAttributes = {
        role: 'tab',
        class: 'tab-button label',
        id: `tab-${tabId}-${tabName}`,
        tabindex: (i === 0) ? '0' : '-1',
        'aria-selected': (i === 0) ? 'true' : 'false',
        'data-block-id': `tabs-${tabId}`,
        'daa-state': 'true',
        'daa-ll': `tab-${tabId}-${tabName}`,
        'aria-controls': controlId,
      };
      const tabBtn = createTag('button', tabBtnAttributes, item.textContent);
      const btnWrapper = createTag('div', { class: 'btn-wrapper' });
      btnWrapper.append(tabBtn);
      tabListContainer.append(btnWrapper);

      const tabContentAttributes = {
        id: `tab-panel-${tabId}-${tabName}`,
        role: 'tabpanel',
        class: 'tabpanel',
        'aria-labelledby': `tab-${tabId}-${tabName}`,
        'data-block-id': `tabs-${tabId}`,
      };
      const tabListContent = createTag('div', tabContentAttributes);
      if (i > 0) tabListContent.setAttribute('hidden', '');
      tabContentContainer.append(tabListContent);
    });
    tabListItems[0].parentElement.remove();
  }

  const tabsWrapper = createTag('div', { class: 'tabs-wrapper' });
  tabList.insertAdjacentElement('beforebegin', tabsWrapper);
  tabsWrapper.append(tabList);

  // Tab indicator
  const indicator = createTag('div', { class: 'tab-indicator' });
  tabListContainer.prepend(indicator);

  // Tab Sections
  const allSections = Array.from(rootElem.querySelectorAll('div.section'));
  await Promise.all(allSections.map(async (e) => {
    const sectionMetadata = e.querySelector(':scope > .section-metadata');
    if (!sectionMetadata) return;
    const metaSettings = {};
    sectionMetadata.querySelectorAll(':scope > div').forEach((row) => {
      const key = getStringKeyName(row.children[0].textContent);
      if (!['tab', 'tab-background', 'link', 'deeplink'].includes(key)) return;
      const val = row.children[1].textContent;
      if (!val) return;
      metaSettings[key] = val;
    });
    if (!metaSettings.tab) return;
    let id = tabId;
    let val = getStringKeyName(metaSettings.tab);
    if (config.id) {
      const values = metaSettings.tab.split(',');
      [id] = values;
      val = getStringKeyName(String(values[1]));
    }
    const associatedTabButton = rootElem.querySelector(`#tab-${id}-${val}`);
    if (associatedTabButton && metaSettings.deeplink) {
      associatedTabButton.setAttribute('data-deeplink', metaSettings.deeplink);
    }
    const assocTabItem = rootElem.querySelector(`#tab-panel-${id}-${val}`);
    if (assocTabItem) {
      if (metaSettings['tab-background']) {
        tabColor[`tab-${id}-${val}`] = metaSettings['tab-background'];
      }
      await assignLinkedTabs(linkedTabs, metaSettings, id, val);
      const tabLabel = tabListItems[val - 1]?.innerText;
      if (tabLabel) {
        assocTabItem.setAttribute('data-nested-lh', `t${val}${processTrackingLabels(tabLabel, getConfig(), 3)}`);
      }
      const section = sectionMetadata.closest('.section');
      assocTabItem.append(section);
    }
  }));
  handleDeferredImages(block);
  initTabs(block, config, rootElem);

  requestAnimationFrame(() => {
    const activeTab = tabListContainer.querySelector('[aria-selected="true"]');
    if (activeTab) {
      indicator.style.transition = 'none';
      moveIndicator(indicator, activeTab, tabListContainer);
      scrollTabIntoView(activeTab);
      requestAnimationFrame(() => { indicator.style.transition = ''; });
    }
    if (block.classList.contains('staggered-intro-merch-cards')) {
      const activePanel = tabContentContainer.querySelector('[role="tabpanel"]:not([hidden])');
      if (activePanel) triggerTabEnterAnimation(activePanel);
    }
  });
};

export default init;
