/*
 * tabs - consonant v6
 * https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Tab_Role
 */
import { createTag, MILO_EVENTS, getConfig, localizeLinkAsync } from '../../../utils/utils.js';
import { processTrackingLabels } from '../../../martech/attributes.js';

const PADDLE = '<svg aria-hidden="true" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.50001 13.25C1.22022 13.25 0.939945 13.1431 0.726565 12.9292C0.299315 12.5019 0.299315 11.8096 0.726565 11.3823L5.10938 7L0.726565 2.61768C0.299315 2.19043 0.299315 1.49805 0.726565 1.0708C1.15333 0.643068 1.84669 0.643068 2.27345 1.0708L7.4297 6.22656C7.63478 6.43164 7.75001 6.70996 7.75001 7C7.75001 7.29004 7.63478 7.56836 7.4297 7.77344L2.27345 12.9292C2.06007 13.1431 1.7798 13.2495 1.50001 13.25Z" fill="currentColor"/></svg>';
const tabColor = {};
const linkedTabs = {};
const tabChangeEvent = new Event('milo:tab:changed');
let isMobileAccordion = false;

const isTabInTabListView = (tab) => {
  const tabList = tab.closest('[role="tablist"], [role="radiogroup"]');
  const tabRect = tab.getBoundingClientRect();
  const tabListRect = tabList.getBoundingClientRect();

  const tabLeft = Math.round(tabRect.left);
  const tabRight = Math.round(tabRect.right);
  const tabListLeft = Math.round(tabListRect.left);
  const tabListRight = Math.round(tabListRect.right);

  return (tabLeft >= tabListLeft && tabRight <= tabListRight);
};

const scrollTabIntoView = (e, inline = 'center') => {
  const isElInView = isTabInTabListView(e);
  if (!isElInView) e.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline });
};

const setAttributes = (el, attrs) => {
  Object.keys(attrs).forEach((key) => el.setAttribute(key, attrs[key]));
};

const removeAttributes = (el, attrsKeys) => {
  attrsKeys.forEach((key) => el.removeAttribute(key));
};

const scrollStackedMobile = (content) => {
  if (!window.matchMedia('(max-width: 600px)').matches) return;
  const rects = content.getBoundingClientRect();
  const stickyTop = document.querySelector('.feds-localnav') ?? document.querySelector('.global-navigation, .gnav');
  const navHeight = stickyTop?.scrollHeight || 0;
  const topOffset = rects.top + window.scrollY - navHeight - 1;
  window.scrollTo({ top: topOffset, behavior: 'smooth' });
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

function getContentElement(parent, traversalDepth) {
  let element = parent;
  for (let i = 0; i < traversalDepth; i += 1) {
    element = element.parentNode;
    if (!element) return null;
  }
  return element.lastElementChild;
}

function changeTabs(e, config) {
  const { target } = e;
  const targetId = target.getAttribute('id');
  const redirectionUrl = getRedirectionUrl(linkedTabs, targetId);
  /* c8 ignore next 4 */
  if (redirectionUrl) {
    window.location.assign(redirectionUrl);
    return;
  }
  const parent = target.parentNode;
  const tabsBlock = target.closest('.tabs');
  const hasSegmentedControl = tabsBlock.classList.contains('segmented-control');
  const content = hasSegmentedControl ? getContentElement(parent, 3) : getContentElement(parent, 2);
  const blockId = tabsBlock.id;
  const isRadio = target.getAttribute('role') === 'radio';
  const attributeName = isRadio ? 'aria-checked' : 'aria-selected';

  let targetContent;
  if (isRadio) {
    targetContent = content.querySelector(`#${target.getAttribute('data-control-id')}`);
  } else {
    targetContent = content.querySelector(`#${target.getAttribute('aria-controls')}`);
  }

  parent
    .querySelectorAll(`[${attributeName}="true"][data-block-id="${blockId}"]`)
    .forEach((t) => {
      t.setAttribute(attributeName, false);
      t.setAttribute('tabindex', '-1');
      if (Object.keys(tabColor).length) {
        t.removeAttribute('style', 'backgroundColor');
      }
    });
  target.setAttribute(attributeName, true);
  target.setAttribute('tabindex', '0');
  if (tabColor[targetId]) {
    target.style.backgroundColor = tabColor[targetId];
  }
  scrollTabIntoView(target);
  content
    .querySelectorAll(`.tabpanel[data-block-id="${blockId}"]`)
    .forEach((p) => p.setAttribute('hidden', true));
  targetContent?.removeAttribute('hidden');
  if (tabsBlock.classList.contains('stacked-mobile')) scrollStackedMobile(targetContent);
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

  if (config['active-tab']) {
    const id = `#tab-${CSS.escape(config['tab-id'])}-${CSS.escape(getStringKeyName(config['active-tab']))}`;
    const sel = rootElem.querySelector(id);
    if (sel) {
      sel.addEventListener('click', (e) => e.stopPropagation(), { once: true });
      sel.click();
    }
  }
}

function initTabs(elm, config, rootElem) {
  const tabs = elm.querySelectorAll('[role="tab"], [role="radio"]');
  const tabLists = elm.querySelectorAll('[role="tablist"], [role="radiogroup"]');
  let tabFocus = 0;

  tabLists.forEach((tabList) => {
    tabList.addEventListener('keydown', (e) => {
      const isRtl = document.dir === 'rtl';
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        if (e.key === (isRtl ? 'ArrowLeft' : 'ArrowRight')) {
          tabFocus += 1;
          /* c8 ignore next */
          if (tabFocus >= tabs.length) tabFocus = 0;
        } else if (e.key === (isRtl ? 'ArrowRight' : 'ArrowLeft')) {
          tabFocus -= 1;
          /* c8 ignore next */
          if (tabFocus < 0) tabFocus = tabs.length - 1;
        }
        tabs.forEach((t) => t.setAttribute('tabindex', '-1'));
        tabs[tabFocus].setAttribute('tabindex', '0');
        tabs[tabFocus].focus();
      }
    });
  });
  tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => changeTabs(e, config));
    if (elm?.classList.contains('segmented-control')) {
      tab.addEventListener('focus', () => scrollTabIntoView(tab));
    }
  });
  if (config) configTabs(config, rootElem);
}

function previousTab(current, i, arr) {
  const next = arr[i + 1];
  // The tab before the first visible tab
  return (next && !isTabInTabListView(current) && isTabInTabListView(next));
}

function nextTab(current, i, arr) {
  const previous = arr[i - 1];
  // The tab after the last visible tab
  return (previous && isTabInTabListView(previous) && !isTabInTabListView(current));
}

function initPaddles(tabList, left, right, isRadio) {
  const tabListItems = tabList.querySelectorAll(isRadio ? '[role="radio"]' : '[role="tab"]');
  const tabListItemsArray = [...tabListItems];
  const firstTab = tabListItemsArray[0];
  const lastTab = tabListItemsArray[tabListItemsArray.length - 1];

  left.addEventListener('click', () => {
    const previous = tabListItemsArray.find(previousTab);
    if (previous) {
      scrollTabIntoView(previous, 'end');
    } else {
      /* c8 ignore next 3 */
      const { width } = tabList.getBoundingClientRect();
      tabList.scrollBy({ left: -(width / 2), behavior: 'smooth' });
    }
  });
  right.addEventListener('click', () => {
    const next = tabListItemsArray.find(nextTab);
    if (next) {
      scrollTabIntoView(next, 'start');
    } else {
      /* c8 ignore next 3 */
      const { width } = tabList.getBoundingClientRect();
      tabList.scrollBy({ left: width / 2, behavior: 'smooth' });
    }
  });

  const options = {
    root: tabList,
    rootMargin: '0px',
    threshold: 0.9,
  };

  const callback = (entries) => {
    entries.forEach((entry) => {
      if (entry.target === firstTab) {
        if (entry.isIntersecting) {
          setAttributes(left, { disabled: '', 'aria-hidden': true });
        } else {
          removeAttributes(left, ['disabled', 'aria-hidden']);
        }
      } else if (entry.target === lastTab) {
        if (entry.isIntersecting) {
          setAttributes(right, { disabled: '', 'aria-hidden': true });
        } else {
          removeAttributes(right, ['disabled', 'aria-hidden']);
        }
      }
    });
  };

  const observer = new IntersectionObserver(callback, options);

  observer.observe(firstTab);
  observer.observe(lastTab);
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

const handlePillSize = (pill) => {
  const sizes = ['s', 'm', 'l'];
  const variant = pill.substring(0, pill.indexOf('-pill'));
  const size = sizes.findIndex((tshirt) => variant.startsWith(tshirt));
  return `${sizes[size]?.[0] ?? sizes[1]}-pill`;
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

// mWeb specific
const hideAllTabs = () => {
  [...document.querySelectorAll('.tab-content-container .tabpanel.mobile-show')]
    .forEach((panel) => panel.classList.remove('mobile-show'));
};

const toggleMobileTab = (button) => () => {
  const currentPanel = button.closest('.tabpanel');
  const isHidden = !currentPanel.classList.contains('mobile-show');
  hideAllTabs();
  if (isHidden) currentPanel.classList.add('mobile-show');
  else currentPanel.classList.remove('mobile-show');

  setTimeout(() => {
    currentPanel.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }, 250);
};

const createMobileAccordionItem = (button) => {
  const iconPlus = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none" class="icon icon-plus">
      <circle cx = "14" cy = "14" r = "12" fill = "#F8F8F8" />
      <path d="M14 26C7.38258 26 2 20.6174 2 14C2 7.38258 7.38258 2 14 2C20.6174 2 26 7.38258 26 14C26 20.6174 20.6174 26 14 26ZM14 4.05714C8.51696 4.05714 4.05714 8.51696 4.05714 14C4.05714 19.483 8.51696 23.9429 14 23.9429C19.483 23.9429 23.9429 19.483 23.9429 14C23.9429 8.51696 19.483 4.05714 14 4.05714Z" fill="#292929"/>
      <path d="M15.0496 18.5499L15.0496 15.0499L18.5496 15.0499C19.1293 15.0499 19.5996 14.5796 19.5996 13.9999C19.5996 13.4202 19.1293 12.9499 18.5496 12.9499L15.0496 12.9499L15.0496 9.4499C15.0496 8.87022 14.5793 8.3999 13.9996 8.3999C13.4199 8.3999 12.9496 8.87022 12.9496 9.4499L12.9496 12.9499L9.44961 12.9499C8.86993 12.9499 8.39961 13.4202 8.39961 13.9999C8.39961 14.5796 8.86993 15.0499 9.44961 15.0499L12.9496 15.0499L12.9496 18.5499C12.9496 19.1296 13.4199 19.5999 13.9996 19.5999C14.5793 19.5999 15.0496 19.1296 15.0496 18.5499Z" fill="#292929"/>
    </svg >`;
  const iconMinus = `
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none" class="icon icon-minus">
    <circle cx="14" cy="14" r="12" fill="#F8F8F8"/>
    <rect x="8.40002" y="12.9102" width="11.2" height="2.1806" rx="1.0903" fill="#292929"/>
  </svg>
  `;
  const btn = createTag('button', {
    class: 'tab-mobile-accordion section-metadata',
    tabindex: 0,
    'aria-selected': false,
    'da-ll': button.getAttribute('da-ll'),
  }, `${button.innerText}${iconPlus}${iconMinus}`);
  btn.addEventListener('click', toggleMobileTab(btn));
  return btn;
};

const init = async (block) => {
  const rootElem = block.closest('.fragment') || document;
  const rows = block.querySelectorAll(':scope > div');
  const parentSection = block.closest('.section');
  isMobileAccordion = block.classList.contains('mobile-accordion');
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

  const isRadio = block.classList.contains('radio');
  // Tab List
  const tabList = rows[0];
  tabList.classList.add('tabList');
  tabList.setAttribute('role', isRadio ? 'radiogroup' : 'tablist');
  const tabListContainer = tabList.querySelector(':scope > div');
  tabListContainer.classList.add('tab-list-container');
  const tabListLabel = config.pretext;
  if (tabListLabel) tabList.setAttribute('aria-label', tabListLabel);

  const tabListItems = rows[0].querySelectorAll(':scope li');
  if (tabListItems) {
    const pillVariant = [...block.classList].find((variant) => variant.includes('pill'));
    const btnClass = (pillVariant && handlePillSize(pillVariant))
      || (block.classList.contains('segmented-control') && 'heading-xxs')
      || 'heading-xs';
    tabListItems.forEach((item, i) => {
      const tabName = config.id ? i + 1 : getStringKeyName(item.textContent);
      const controlId = `tab-panel-${tabId}-${tabName}`;
      const tabBtnAttributes = {
        role: isRadio ? 'radio' : 'tab',
        class: btnClass,
        id: `tab-${tabId}-${tabName}`,
        tabindex: (i === 0) ? '0' : '-1',
        [isRadio ? 'aria-checked' : 'aria-selected']: (i === 0) ? 'true' : 'false',
        'data-block-id': `tabs-${tabId}`,
        'daa-state': 'true',
        'daa-ll': `tab-${tabId}-${tabName}`,
        ...(isRadio ? { 'data-control-id': controlId } : { 'aria-controls': controlId }),
      };
      const tabBtn = createTag('button', tabBtnAttributes);
      tabBtn.innerText = item.textContent;
      tabListContainer.append(tabBtn);

      const tabContentAttributes = {
        id: `tab-panel-${tabId}-${tabName}`,
        ...(isRadio ? {} : { role: 'tabpanel' }),
        class: 'tabpanel',
        'aria-labelledby': `tab-${tabId}-${tabName}`,
        'data-block-id': `tabs-${tabId}`,
      };
      const tabListContent = createTag('div', tabContentAttributes);
      tabListContent.setAttribute('aria-labelledby', `tab-${tabId}-${tabName}`);
      tabListContent.setAttribute('hidden', '');
      tabContentContainer.append(tabListContent);
    });
    tabListItems[0].parentElement.remove();
    tabListContainer.dataset.pretext = config.pretext;
  }

  // For segmented-control variant, wrap tabList in tabs-wrapper container
  if (block.classList.contains('segmented-control')) {
    const tabsWrapper = createTag('div', { class: 'tabs-wrapper' });
    tabList.insertAdjacentElement('beforebegin', tabsWrapper);
    tabsWrapper.append(tabList);
  }

  // Tab Paddles
  const paddleLeft = createTag('button', { class: 'paddle paddle-left', disabled: '', 'aria-hidden': true, 'aria-label': 'Scroll tabs to left' }, PADDLE);
  const paddleRight = createTag('button', { class: 'paddle paddle-right', disabled: '', 'aria-hidden': true, 'aria-label': 'Scroll tabs to right' }, PADDLE);
  // For segmented-control variant, do not add paddles relative to tab-list-container
  if (!block.classList.contains('segmented-control')) {
    tabList.insertAdjacentElement('afterend', paddleRight);
    block.prepend(paddleLeft);
  }
  initPaddles(tabList, paddleLeft, paddleRight, isRadio);

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
    const assotiatedTabButton = rootElem.querySelector(`#tab-${val}`);
    assotiatedTabButton?.setAttribute('data-deeplink', metaSettings.deeplink);
    let assocTabItem = rootElem.querySelector(`#tab-panel-${id}-${val}`);
    if (config.id) {
      const values = metaSettings.tab.split(',');
      [id] = values;
      val = getStringKeyName(String(values[1]));
      assocTabItem = rootElem.querySelector(`#tab-panel-${id}-${val}`);
    }
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
      if (isMobileAccordion) {
        section.prepend(createMobileAccordionItem(assotiatedTabButton));
      }
      assocTabItem.append(section);
    }
  }));
  handleDeferredImages(block);
  initTabs(block, config, rootElem);
};

export default init;
