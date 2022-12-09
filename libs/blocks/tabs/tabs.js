/*
 * tabs - consonant v5.1
 * https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Tab_Role
 */
import { createTag } from '../../utils/utils.js';

function getStringKeyName(str) {
  return str.trim().replaceAll(' ', '-').toLowerCase();
}

function initTabs(e, config) {
  const tabs = e.querySelectorAll('[role="tab"]');
  const tabLists = e.querySelectorAll('[role="tablist"]');
  tabLists.forEach( tabList => {
    let tabFocus = 0;
    tabList.addEventListener("keydown", (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        tabs[tabFocus].setAttribute("tabindex", -1);
        if (e.key === 'ArrowRight') {
          tabFocus++;
          /* c8 ignore next */
          if (tabFocus >= tabs.length) tabFocus = 0;
        } else if (e.key === 'ArrowLeft') {
          tabFocus--;
          /* c8 ignore next */
          if (tabFocus < 0) tabFocus = tabs.length - 1;
        }
        tabs[tabFocus].setAttribute("tabindex", 0);
        tabs[tabFocus].focus();
      }
    });
  });
  tabs.forEach(tab => {
    tab.addEventListener("click", changeTabs);
  });
  if(config) configTabs(config);
}

function changeTabs(e) {
  const target = e.target;
  const parent = target.parentNode;
  const grandparent = parent.parentNode.nextElementSibling;
  parent
    .querySelectorAll('[aria-selected="true"]')
    .forEach(t => t.setAttribute("aria-selected", false));
  target.setAttribute("aria-selected", true);
  scrollTabIntoView(target);
  grandparent
    .querySelectorAll('[role="tabpanel"]')
    .forEach(p => p.setAttribute("hidden", true));
  grandparent.parentNode
    .querySelector(`#${target.getAttribute("aria-controls")}`)
    .removeAttribute("hidden");
}

function configTabs(config) {
  if(config['active-tab']) {
    const id = `tab-${config['tab-id']}-${getStringKeyName(config['active-tab'])}`;
    const sel = document.getElementById(id);
    if(sel) sel.click();
  }
}

const isElementInContainerView = (targetEl) => {
  const rect = targetEl.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || /* c8 ignore next */ document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || /* c8 ignore next */ document.documentElement.clientWidth)
  );
};

const scrollTabIntoView = (e) => {
  const isElInView = isElementInContainerView(e);
  /* c8 ignore next */
  if (!isElInView) e.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
};

let initCount = 0;
const init = (e) => {
  const rows = e.querySelectorAll(':scope > div');
  /* c8 ignore next */
  if(!rows.length) return;

  // Tab Content
  const tabContentContainer = createTag('div', {class: 'tabContent-container'});
  const tabContent = createTag('div', {class: 'tabContent'}, tabContentContainer);
  e.append(tabContent);

  // Tab List
  const tabList = rows[0];
  const tabId = `tabs-${initCount}`;
  e.id = tabId;
  tabList.classList.add('tabList');
  tabList.setAttribute('role', 'tablist');
  const tabListContainer = tabList.querySelector(':scope > div');
  tabListContainer.classList.add('tabList-container');
  const tabListItems = rows[0].querySelectorAll(':scope li');
  if (tabListItems) {
    let btnClass = [...e.classList].includes('quiet') ? 'heading-XS' : 'heading-XS';
    tabListItems.forEach((item, i) => {
      const tabName = getStringKeyName(item.textContent);
      const tabBtnAttributes = {
        role: 'tab',
        class: btnClass,
        id: `tab-${initCount}-${tabName}`,
        tabindex: (i > 0) ? '0' : '-1',
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
      if(i > 0) tabListContent.setAttribute('hidden', '');
      tabContentContainer.append(tabListContent);
    });
    tabListItems[0].parentElement.remove();
  }

  // Tab Config
  const config = { 'tab-id': initCount };
  var configRows = [].slice.call(rows);
  configRows.splice(0, 1);
  if(configRows) {
    configRows.forEach((row) => {
      const rowKey = getStringKeyName(row.children[0].textContent);
      const rowVal = row.children[1].textContent.trim();
      config[rowKey] = rowVal;
      row.remove();
    });
  }

  // Tab Sections
  const allSections = Array.from(document.querySelectorAll('div.section'));
  allSections.forEach((e, i) => {
    const sectionMetadata = e.querySelector(':scope > .section-metadata');
    if (!sectionMetadata) return;
    const metadata = sectionMetadata.querySelectorAll(':scope > div');
    [...metadata].filter((d) => getStringKeyName(d.children[0].textContent) === 'tab')
      .map((d) => {
        const metaValue = getStringKeyName(d.children[1].textContent);
        const section = sectionMetadata.closest('.section');
        const assocTabItem = document.getElementById(`tab-panel-${initCount}-${metaValue}`);
        if (assocTabItem) assocTabItem.append(section);
      });
  });
  initTabs(e, config);
  initCount++;
}

export default init;
