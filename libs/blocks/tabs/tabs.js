// Tabs JS
// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Tab_Role

function initTabs(e) {
  const tabs = e.querySelectorAll('[role="tab"]');
  const tabLists = e.querySelectorAll('[role="tablist"]');

  tabLists.forEach( tabList => {
    let lastKnownScrollPosition = 0, ticking = false;
    tabList.addEventListener('scroll', () => {
      lastKnownScrollPosition = tabList.scrollLeft;
      if (!ticking) {
        window.requestAnimationFrame(function() {
          doSomething(lastKnownScrollPosition, tabList.scrollWidth, tabList.offsetWidth);
          ticking = false;
        });
        ticking = true;
      }
    });

    // Enable arrow navigation between tabs in the tab list
    let tabFocus = 0;

    tabList.addEventListener("keydown", () => {
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

const doSomething = (scrollPos, scrollWidth, offsetWidth) => {
  // let tabListBound = horizontallyBound(tabsListContainer, tabIt);
  console.log('scrollPos, scrollWidth, offsetWidth');
  console.log(scrollPos, scrollWidth, offsetWidth);
  let offsetUnit = 28;
  let check = (offsetWidth + scrollPos) + offsetUnit;
  if(check >= scrollWidth) {
    console.log('End in [', scrollWidth-(offsetWidth + scrollPos), ']px');
  }

  if(scrollPos <= offsetUnit) {
    console.log('Start in [-',scrollPos,']px');
  }
  // scrolled to end of Y
  if(offsetWidth+scrollPos === scrollWidth) {
    console.log('END');
  }else if(scrollPos === 0) {
    console.log('BEGINNING');
  }else {
    console.log('MIDDLE');
  }
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

let initCount = 0;

const init = (element) => {
  // const tabListBg = element.querySelector(':scope > div:first-of-type > div');
  // tabListBg.classList.add('tabListBg');
  // const bgImg = tabListBg.querySelector(':scope img');
  // if (!bgImg) {
  //   const bgColor = tabListBg.textContent;
  //   tabListBg.style = `background: ${bgColor}`;
  //   tabListBg.innerHTML = '';
  // }
  // create the tabs list container div
  const rows = element.querySelectorAll(':scope > div');
  if(rows.length) {
    const tabList = document.createElement('div');
    tabList.setAttribute('role', 'tablist');
    tabList.setAttribute('aria-label', 'TODO: ACC Tab Title');

    const tabListContainer = document.createElement('div');
    tabListContainer.classList.add('tabList-container', 'container');
    const tabContentContainer = document.createElement('div');
    tabContentContainer.classList.add('tabContent-container', 'container');

    rows.forEach((row, i) => {
      const rowTitle = row.querySelector(':scope > div:nth-child(1)');
      const rowContent = row.querySelector(':scope > div:nth-child(2)');
      const tabBtn = document.createElement('button');
      tabBtn.setAttribute('role', 'tab');
      tabBtn.setAttribute('aria-selected', (i === 0) ? 'true' : 'false');
      tabBtn.setAttribute('aria-controls', `panel-${initCount}-${i}`);
      tabBtn.setAttribute('tabindex', (i > 0) ? '0' : '-1');
      tabBtn.id = `tab-${initCount}-${i}`;
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
      tabContentContainer.append(rowContentParent);
    });
    tabList.append(tabListContainer);
    element.prepend(tabList);
    element.append(tabContentContainer);
  }
  initCount++;
  initTabs(element);
};

export default init;


