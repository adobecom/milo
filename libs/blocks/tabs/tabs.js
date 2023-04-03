/*
 * tabs - consonant v6
 * https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Tab_Role
 */
import { createTag } from '../../utils/utils.js';

const isElementInContainerView = (targetEl) => {
  const rect = targetEl.getBoundingClientRect();
  const docEl = document.documentElement;
  return (
    rect.top >= 0
    && rect.left >= 0
    && rect.bottom <= (window.innerHeight || /* c8 ignore next */ docEl.clientHeight)
    && rect.right <= (window.innerWidth || /* c8 ignore next */ docEl.clientWidth)
  );
};

const scrollTabIntoView = (e) => {
  const isElInView = isElementInContainerView(e);
  /* c8 ignore next */
  if (!isElInView) e.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
};

function changeTabs(e) {
  const { target } = e;
  const parent = target.parentNode;
  const grandparent = parent.parentNode.nextElementSibling;
  parent
    .querySelectorAll('[aria-selected="true"]')
    .forEach((t) => t.setAttribute('aria-selected', false));
  target.setAttribute('aria-selected', true);
  scrollTabIntoView(target);
  grandparent
    .querySelectorAll('[role="tabpanel"]')
    .forEach((p) => p.setAttribute('hidden', true));
  grandparent.parentNode
    .querySelector(`#${target.getAttribute('aria-controls')}`)
    .removeAttribute('hidden');
}

function getStringKeyName(str) {
  /*
  The [^...] character class is used to match any character that is not a valid CSS selector character.
  The \p{L} and \p{N} Unicode properties are used to match any letter or digit character in any language.
  */
  const regex = /[^\p{L}\p{N}_-]/gu;
  return str.trim().toLowerCase().replace(/\s+/g, '-').replace(regex, '');
}

function getUniqueId(el, rootElem) {
  const tabs = rootElem.querySelectorAll('.tabs');
  return [...tabs].indexOf(el) + 1;
}

function configTabs(config, rootElem) {
  if (config['active-tab']) {
    const id = `#tab-${CSS.escape(config['tab-id'])}-${CSS.escape(getStringKeyName(config['active-tab']))}`;
    const sel = rootElem.querySelector(id);
    if (sel) sel.click();
  }
}

function initTabs(elm, config, rootElem) {
  const tabs = elm.querySelectorAll('[role="tab"]');
  const tabLists = elm.querySelectorAll('[role="tablist"]');
  tabLists.forEach((tabList) => {
    let tabFocus = 0;
    tabList.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        if (e.key === 'ArrowRight') {
          tabFocus += 1;
          /* c8 ignore next */
          if (tabFocus >= tabs.length) tabFocus = 0;
        } else if (e.key === 'ArrowLeft') {
          tabFocus -= 1;
          /* c8 ignore next */
          if (tabFocus < 0) tabFocus = tabs.length - 1;
        }
        tabs[tabFocus].setAttribute('tabindex', 0);
        tabs[tabFocus].focus();
      }
    });
  });
  tabs.forEach((tab) => {
    tab.addEventListener('click', changeTabs);
  });
  if (config) configTabs(config, rootElem);
}

function handleDeferredImages(e) {
  const images = e.querySelectorAll('img[loading="lazy"]');
  images.forEach((img) => {
    /* c8 ignore next */
    img.removeAttribute('loading');
  });
  e.removeEventListener('milo:deferred', handleDeferredImages, true);
}

const init = (block) => {
  const rootElem = block.closest('.fragment') || document;
  const rows = block.querySelectorAll(':scope > div');
  const parentSection = block.closest('.section');
  /* c8 ignore next */
  if (!rows.length) return;
  block.addEventListener('milo:deferred', handleDeferredImages(block), true);

  // Tab Config
  const config = {};
  const configRows = [].slice.call(rows);
  configRows.splice(0, 1);
  if (configRows) {
    configRows.forEach((row) => {
      console.log('config row', row.children[0].textContent);
      const rowKey = getStringKeyName(row.children[0].textContent);
      console.log('config rowKEY', rowKey);
      const rowVal = row.children[1].textContent.trim();
      config[rowKey] = rowVal;
      row.remove();
    });
  }
  const tabsId = config.id ? config.id : getUniqueId(block, rootElem);
  config['tab-id'] = tabsId;
  block.id = `tabs-${tabsId}`;
  parentSection?.classList.add(`tablist-${tabsId}-section`);

  // Tab Content
  const tabContentContainer = createTag('div', { class: 'tabContent-container' });
  const tabContent = createTag('div', { class: 'tabContent' }, tabContentContainer);
  block.append(tabContent);

  // Tab List
  const tabList = rows[0];
  tabList.classList.add('tabList');
  tabList.setAttribute('role', 'tablist');
  const tabListContainer = tabList.querySelector(':scope > div');
  tabListContainer.classList.add('tabList-container');
  const tabListItems = rows[0].querySelectorAll(':scope li');
  if (tabListItems) {
    const btnClass = [...block.classList].includes('quiet') ? 'heading-xs' : 'heading-xs';
    tabListItems.forEach((item, i) => {
      const tabName = config.id ? i+1 : getStringKeyName(item.textContent);
      const tabBtnAttributes = {
        role: 'tab',
        class: btnClass,
        id: `tab-${tabsId}-${tabName}`,
        tabindex: '0',
        'aria-selected': (i === 0) ? 'true' : 'false',
        'aria-controls': `tab-panel-${tabsId}-${tabName}`,
      };
      const tabBtn = createTag('button', tabBtnAttributes);
      tabBtn.innerText = item.textContent;
      tabListContainer.append(tabBtn);

      const tabContentAttributes = {
        id: `tab-panel-${tabsId}-${tabName}`,
        role: 'tabpanel',
        class: 'tabpanel',
        tabindex: '0',
        'aria-labelledby': `tab-${tabsId}-${tabName}`,
      };
      const tabListContent = createTag('div', tabContentAttributes);
      tabListContent.setAttribute('aria-labelledby', `tab-${tabsId}-${tabName}`);
      if (i > 0) tabListContent.setAttribute('hidden', '');
      tabContentContainer.append(tabListContent);
    });
    tabListItems[0].parentElement.remove();
  }

  // Tab Sections
  const allSections = Array.from(rootElem.querySelectorAll('div.section'));
  allSections.forEach((e, i) => {
    const sectionMetadata = e.querySelector(':scope > .section-metadata');
    if (!sectionMetadata) return;
    const rows = sectionMetadata.querySelectorAll(':scope > div');
    rows.forEach((row) => {
      const key = getStringKeyName(row.children[0].textContent);
      if (key != 'tab') return;
      let val = getStringKeyName(row.children[1].textContent);
      if (!val) return;
      let id = tabsId;
      if (config.id) {
        const values = row.children[1].textContent.split(',');
        id = values[0];
        val = getStringKeyName(String(values[1]));
      }
      const section = sectionMetadata.closest('.section');
      const assocTabItem = rootElem.getElementById(`tab-panel-${id}-${val}`);
      if (assocTabItem) assocTabItem.append(section);
    });
  });
  initTabs(block, config, rootElem);
};

export default init;
