// Tabs JS
// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Tab_Role

import { createTag } from '../../utils/utils.js';

function initTabs(e) {
  const tabs = e.querySelectorAll('[role="tab"]');
  const tabLists = e.querySelectorAll('[role="tablist"]');
  tabLists.forEach( tabList => {
    // Enable arrow navigation between tabs in the tab list
    let tabFocus = 0;
    tabList.addEventListener("keydown", (e) => {
      // Move right
      if (e.keyCode === 39 || e.keyCode === 37) {
        tabs[tabFocus].setAttribute("tabindex", -1);
        if (e.keyCode === 39) {
          tabFocus++;
          // If we're at the end, go to the start
          if (tabFocus >= tabs.length) {
            tabFocus = 0;
          }
          // Move left
        } else if (e.keyCode === 37) {
          tabFocus--;
          // If we're at the start, move to the end
          if (tabFocus < 0) {
            tabFocus = tabs.length - 1;
          }
        }
        tabs[tabFocus].setAttribute("tabindex", 0);
        tabs[tabFocus].focus();
      }
    });
  });
  // Add a click event handler to each tab
  tabs.forEach(tab => {
    tab.addEventListener("click", changeTabs);
  });
}

const isElementInContainerView = (targetEl) => {
  const rect = targetEl.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

const scrollTabIntoView = (e) => {
  const isElInView = isElementInContainerView(e);
  if (!isElInView) {
    e.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
};

const horizontallyBound = (parentDiv, childDiv) => {
  const parentRect = parentDiv.getBoundingClientRect();
  const childRect = childDiv.getBoundingClientRect();

  return parentRect.left <= childRect.left && parentRect.right >= childRect.right;
}

function changeTabs(e) {
  const target = e.target;
  const parent = target.parentNode;
  const grandparent = parent.parentNode.nextElementSibling;

  // Remove all current selected tabs
  parent
    .querySelectorAll('[aria-selected="true"]')
    .forEach(t => t.setAttribute("aria-selected", false));

  // Set this tab as selected
  target.setAttribute("aria-selected", true);

  // Scroll tab into view if off Viewport
  scrollTabIntoView(target);

  // Hide all tab panels
  grandparent
    .querySelectorAll('[role="tabpanel"]')
    .forEach(p => p.setAttribute("hidden", true));

  // Show the selected panel
  grandparent.parentNode
    .querySelector(`#${target.getAttribute("aria-controls")}`)
    .removeAttribute("hidden");
}

function decorateTabBg(el, target1, target2) {
  const values = el.querySelectorAll(':scope > div > p');
  if (!values) return;
  const activeTabColor = '#ffffff';
  target1.style.background = values[0].textContent;
  if (values.length === 2) target2.style.background = values[1].textContent;
  el.remove();
}

let initCount = 0;
const init = (element) => {
  const rows = element.querySelectorAll(':scope > div');
  console.log(rows);
  if(!rows.length) return;
  const tabList = createTag('div', {role: 'tablist'});
  const tabListContainer = createTag('div', {class: 'tabList-container container'});
  const tabContentContainerContainer = createTag('div', {class: 'container'});
  const tabContentContainer = createTag('div', {class: 'tabContent-container'}, tabContentContainerContainer);
  let btnClass = [...element.classList].includes('quiet') ? 'heading-XS' : 'heading-XS'; // tabList size

  // indicates bg decorator and/or title row(s)
  let singleColRows = 0;
  rows.forEach((row) => { if (row.childElementCount === 1) singleColRows += 1; });
  if (singleColRows) {
    if (singleColRows === 1) {
      const rowHeadler = rows[0].querySelector('h1, h2, h3, h4, h5, h6');
      rows[0].classList.add(rowHeadler ? 'tab-headline' : 'background');
    } else if (singleColRows && singleColRows === 2) {
      rows[0].classList.add('background');
      rows[1].classList.add('tab-headline');
    }
    const bgRow = element.querySelector(':scope > div.background');
    const tabHeadline = element.querySelector(':scope > div.tab-headline');
    if (tabHeadline) {
      tabHeadline.classList.add('container');
      const headlineHeader = tabHeadline.querySelector('h1, h2, h3, h4, h5, h6');
      if (headlineHeader) tabList.setAttribute('aria-label', headlineHeader.textContent);
    }
    if (bgRow) decorateTabBg(bgRow, tabList, tabContentContainer);
  }

  const tabRows = element.querySelectorAll(':scope > div:not([class])');
  tabRows.forEach((row, i) => {
    const rowTitle = row.querySelector(':scope > div:nth-child(1)');
    const rowContent = row.querySelector(':scope > div:nth-child(2)');
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
    rowTitle.remove();
    tabListContainer.append(tabBtn);

    const rowContentParent = rowContent.parentNode;
    rowContentParent.id = `panel-${initCount}-${i}`;
    rowContentParent.setAttribute('role', 'tabpanel');
    rowContentParent.setAttribute('tabindex', '0');
    rowContentParent.setAttribute('aria-labelledby', `tab-${initCount}-${i}`);
    if(i > 0) {
      rowContentParent.setAttribute('hidden', '');
    }
    tabContentContainerContainer.append(rowContentParent);
  });
  tabList.append(tabListContainer);
  // element.prepend(tabListBg);
  element.append(tabList);
  element.append(tabContentContainer);

  initCount++;
  initTabs(element);
};

export default init;


