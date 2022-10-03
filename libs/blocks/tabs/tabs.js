/*
 * tabs - consonant v5.1
 * https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Tab_Role
 */
import { createTag } from '../../utils/utils.js';

function initTabs(e) {
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

let initCount = 0;
const init = (e) => {
  const rows = e.querySelectorAll(':scope > div');
  const tabList = rows[0].querySelectorAll(':scope ul > li');
  rows[0].classList.add('tabList');
  const configRows = e.querySelectorAll(':scope > div:not([class])');
  const config = {};
  configRows?.forEach((row) => {
    const rowKey = row.children[0].textContent.trim().replace(' ', '-').toLowerCase();
    const rowVal = row.children[1].textContent.trim();
    config[rowKey] = rowVal;
  });
  console.log('init', {e}, 'tabList', {tabList}, 'configRows', {configRows}, 'config', config);

  const tabContentList = 'can we get tab content from sections?';
  console.log('tabContentList', {tabContentList});

}

const initOrig = (element) => {
  const rows = element.querySelectorAll(':scope > div');
  /* c8 ignore next */
  if(!rows.length) return;
  const tabList = createTag('div', {role: 'tablist'});
  const tabListContainer = createTag('div', {class: 'tabList-container container'});
  const containerWrapper = createTag('div', {class: 'container'});
  const tabContentContainer = createTag('div', {class: 'tabContent-container'}, containerWrapper);
  let btnClass = [...element.classList].includes('quiet') ? 'heading-XS' : 'heading-XS'; // tabList size
  let singleColRows = 0;
  rows.forEach((row) => { if (row.childElementCount === 1) singleColRows += 1; });
  if (singleColRows) {
    const rowHeadler = rows[0].querySelector('h1, h2, h3, h4, h5, h6');
    rows[0].classList.add('tab-headline', 'container');
    tabList.setAttribute('aria-label', rowHeadler.textContent);
  }
  const tabRows = element.querySelectorAll(':scope > div:not([class])');
  tabRows.forEach((row, i) => {
    const rowTitle = row.querySelector(':scope > div:nth-child(1)');
    const tabBtnAttributes = {
      role: 'tab',
      class: btnClass,
      id: `tab-${initCount}-${i}`,
      tabindex: (i > 0) ? '0' : '-1',
    }
    const tabBtn = createTag('button', tabBtnAttributes);
    tabBtn.setAttribute('aria-selected', (i === 0) ? 'true' : 'false');
    tabBtn.setAttribute('aria-controls', `panel-${initCount}-${i}`);
    tabBtn.innerText = rowTitle.textContent;
    tabListContainer.append(tabBtn);
    const rowContent = row.querySelector(':scope > div:nth-child(2)');
    const rowContentParent = rowContent.innerText !== '' ? rowContent.parentNode : createTag('div', {}, `<div data-failed="true">Data failed</label>`);
    rowContentParent.id = `panel-${initCount}-${i}`;
    rowContentParent.setAttribute('role', 'tabpanel');
    rowContentParent.setAttribute('tabindex', '0');
    rowContentParent.setAttribute('aria-labelledby', `tab-${initCount}-${i}`);
    if(i > 0) rowContentParent.setAttribute('hidden', '');
    containerWrapper.append(rowContentParent);
    rowTitle.remove();
  });
  tabList.append(tabListContainer);
  element.append(tabList);
  element.append(tabContentContainer);
  initCount++;
  initTabs(element);
};

export default init;
