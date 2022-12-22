/*
 * tabs - consonant v5.1
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
  return str.trim().toLowerCase().replace(/[^\w ]/g, '').replace(/ +/g, '-');
}

function configTabs(config) {
  if (config['active-tab']) {
    const id = `tab-${config['tab-id']}-${getStringKeyName(config['active-tab'])}`;
    const sel = document.getElementById(id);
    if (sel) sel.click();
  }
}

function initTabs(elm, config) {
  const tabs = elm.querySelectorAll('[role="tab"]');
  const tabLists = elm.querySelectorAll('[role="tablist"]');
  tabLists.forEach((tabList) => {
    let tabFocus = 0;
    tabList.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        tabs[tabFocus].setAttribute('tabindex', -1);
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
  if (config) configTabs(config);
}

let initCount = 0;
const init = (block) => {
  const rows = block.querySelectorAll(':scope > div');
  /* c8 ignore next */
  if (!rows.length) return;

  // Tab Content
  const tabContentContainer = createTag('div', { class: 'tabContent-container' });
  const tabContent = createTag('div', { class: 'tabContent' }, tabContentContainer);
  block.append(tabContent);

  // Tab List
  const tabList = rows[0];
  const tabId = `tabs-${initCount}`;
  block.id = tabId;
  tabList.classList.add('tabList');
  tabList.setAttribute('role', 'tablist');
  const tabListContainer = tabList.querySelector(':scope > div');
  tabListContainer.classList.add('tabList-container');
  const tabListItems = rows[0].querySelectorAll(':scope li');
  if (tabListItems) {
    const btnClass = [...block.classList].includes('quiet') ? 'heading-XS' : 'heading-XS';
    tabListItems.forEach((item, i) => {
      const tabName = getStringKeyName(item.textContent);
      const tabBtnAttributes = {
        role: 'tab',
        class: btnClass,
        id: `tab-${initCount}-${tabName}`,
        tabindex: '0',
        'aria-selected': (i === 0) ? 'true' : 'false',
        'aria-controls': `tab-panel-${initCount}-${tabName}`,
      };
      const tabBtn = createTag('button', tabBtnAttributes);
      tabBtn.innerText = item.textContent;
      tabListContainer.append(tabBtn);

      const tabContentAttributes = {
        id: `tab-panel-${initCount}-${tabName}`,
        role: 'tabpanel',
        class: 'tabpanel',
        tabindex: '0',
        'aria-labelledby': `tab-${initCount}-${tabName}`,
      };
      const tabListContent = createTag('div', tabContentAttributes);
      tabListContent.setAttribute('aria-labelledby', `tab-${initCount}-${tabName}`);
      if (i > 0) tabListContent.setAttribute('hidden', '');
      tabContentContainer.append(tabListContent);
    });
    tabListItems[0].parentElement.remove();
  }

  // Tab Config
  const config = { 'tab-id': initCount };
  const configRows = [].slice.call(rows);
  configRows.splice(0, 1);
  if (configRows) {
    configRows.forEach((row) => {
      const rowKey = getStringKeyName(row.children[0].textContent);
      const rowVal = row.children[1].textContent.trim();
      config[rowKey] = rowVal;
      row.remove();
    });
  }

  // Tab Sections
  const allSections = Array.from(document.querySelectorAll('div.section'));
  allSections.forEach((e) => {
    const sectionMetadata = e.querySelector(':scope > .section-metadata');
    if (!sectionMetadata) return;
    const metadata = sectionMetadata.querySelectorAll(':scope > div');
    [...metadata].filter((d) => getStringKeyName(d.children[0].textContent) === 'tab')
      .forEach((d) => {
        const metaValue = getStringKeyName(d.children[1].textContent);
        const section = sectionMetadata.closest('.section');
        const assocTabItem = document.getElementById(`tab-panel-${initCount}-${metaValue}`);
        if (assocTabItem) assocTabItem.append(section);
      });
  });
  initTabs(block, config);
  initCount += 1;
};

export default init;
