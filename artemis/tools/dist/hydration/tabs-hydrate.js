
    const tabColor = {};
const linkedTabs = {};
const isTabInTabListView = tab => {
  const tabList = tab.closest('[role="tablist"]');
  const tabRect = tab.getBoundingClientRect();
  const tabListRect = tabList.getBoundingClientRect();
  const tabLeft = Math.round(tabRect.left);
  const tabRight = Math.round(tabRect.right);
  const tabListLeft = Math.round(tabListRect.left);
  const tabListRight = Math.round(tabListRect.right);
  return tabLeft >= tabListLeft && tabRight <= tabListRight;
};
const scrollTabIntoView = (e, inline = 'center') => {
  const isElInView = isTabInTabListView(e);
  if (!isElInView) e.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline
  });
};
const scrollStackedMobile = content => {
  if (!window.matchMedia('(max-width: 600px)').matches) return;
  const rects = content.getBoundingClientRect();
  const stickyTop = document.querySelector('.feds-localnav') ?? document.querySelector('.global-navigation, .gnav');
  const navHeight = stickyTop?.scrollHeight || 0;
  const topOffset = rects.top + window.scrollY - navHeight - 1;
  window.scrollTo({
    top: topOffset,
    behavior: 'smooth'
  });
};
function getRedirectionUrl(linkedTabsList, targetId) {
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
function changeTabs(e) {
  const {
    target
  } = e;
  const targetId = target.getAttribute('id');
  const redirectionUrl = getRedirectionUrl(linkedTabs, targetId);
  /* c8 ignore next 4 */
  if (redirectionUrl) {
    window.location.assign(redirectionUrl);
    return;
  }
  const parent = target.parentNode;
  const content = parent.parentNode.parentNode.lastElementChild;
  const targetContent = content.querySelector(`#${target.getAttribute('aria-controls')}`);
  const tabsBlock = target.closest('.tabs');
  const blockId = tabsBlock.id;
  parent.querySelectorAll(`[aria-selected="true"][data-block-id="${blockId}"]`).forEach(t => {
    t.setAttribute('aria-selected', false);
    if (Object.keys(tabColor).length) {
      t.removeAttribute('style', 'backgroundColor');
    }
  });
  target.setAttribute('aria-selected', true);
  if (tabColor[targetId]) {
    target.style.backgroundColor = tabColor[targetId];
  }
  scrollTabIntoView(target);
  content.querySelectorAll(`[role="tabpanel"][data-block-id="${blockId}"]`).forEach(p => p.setAttribute('hidden', true));
  targetContent.removeAttribute('hidden');
  if (tabsBlock.classList.contains('stacked-mobile')) scrollStackedMobile(targetContent);
}
function previousTab(current, i, arr) {
  const next = arr[i + 1];
  // The tab before the first visible tab
  return next && !isTabInTabListView(current) && isTabInTabListView(next);
}
function nextTab(current, i, arr) {
  const previous = arr[i - 1];
  // The tab after the last visible tab
  return previous && isTabInTabListView(previous) && !isTabInTabListView(current);
}
    document.querySelectorAll('.tabs').forEach(block => {
      
        (function(){
        const conditionMethod = undefined || (() => true);
        const isSuccess = conditionMethod({block});
        if(!isSuccess) {
          return false;
        }

        const scopeResolver = () => ({
           tabFocus: function(){
            return 0;
          },
tabs: function(ob){
            return ob.block.querySelectorAll('[role="tab"]');
          }
        });
        const scopeObject = scopeResolver();
        const scopeResult = {};

        for (const key in scopeObject) {
          if (typeof scopeObject[key] === 'function') {
            scopeResult[key] = scopeObject[key]({block});
          }
        }
        const tabFocus= scopeResult['tabFocus'];
const tabs= scopeResult['tabs'];
        block.querySelectorAll('[role="tablist"]').forEach(el => {
          const paramResolver = () => ({
            
          });
          el.addEventListener('keyup', (e) => {
            const paramsObject = paramResolver();
            const result = {};

            for (const key in paramsObject) {
              if (typeof paramsObject[key] === 'function') {
                result[key] = paramsObject[key]({target:el, block}); // Execute function and store result
              }
            }

            
           (e => e.stopPropagation())(e);
          });
        });})();

        (function(){
        const conditionMethod = undefined || (() => true);
        const isSuccess = conditionMethod({block});
        if(!isSuccess) {
          return false;
        }

        const scopeResolver = () => ({
           
        });
        const scopeObject = scopeResolver();
        const scopeResult = {};

        for (const key in scopeObject) {
          if (typeof scopeObject[key] === 'function') {
            scopeResult[key] = scopeObject[key]({block});
          }
        }
        
        block.querySelectorAll('[role="tab"]').forEach(el => {
          const paramResolver = () => ({
            
          });
          el.addEventListener('click', (e) => {
            const paramsObject = paramResolver();
            const result = {};

            for (const key in paramsObject) {
              if (typeof paramsObject[key] === 'function') {
                result[key] = paramsObject[key]({target:el, block}); // Execute function and store result
              }
            }

            
           (e => {
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
})(e);
          });
        });})();

        (function(){
        const conditionMethod = undefined || (() => true);
        const isSuccess = conditionMethod({block});
        if(!isSuccess) {
          return false;
        }

        const scopeResolver = () => ({
           tabListItemsArray: function(ob) {
            return [...ob.block.querySelectorAll('[role="tab"]')]
          }
        });
        const scopeObject = scopeResolver();
        const scopeResult = {};

        for (const key in scopeObject) {
          if (typeof scopeObject[key] === 'function') {
            scopeResult[key] = scopeObject[key]({block});
          }
        }
        const tabListItemsArray= scopeResult['tabListItemsArray'];
        block.querySelectorAll('.paddle-left').forEach(el => {
          const paramResolver = () => ({
            
          });
          el.addEventListener('click', (e) => {
            const paramsObject = paramResolver();
            const result = {};

            for (const key in paramsObject) {
              if (typeof paramsObject[key] === 'function') {
                result[key] = paramsObject[key]({target:el, block}); // Execute function and store result
              }
            }

            
           (changeTabs)(e);
          });
        });})();

        (function(){
        const conditionMethod = undefined || (() => true);
        const isSuccess = conditionMethod({block});
        if(!isSuccess) {
          return false;
        }

        const scopeResolver = () => ({
           tabListItemsArray: function(ob) {
            return [...ob.block.querySelectorAll('[role="tab"]')]
          }
        });
        const scopeObject = scopeResolver();
        const scopeResult = {};

        for (const key in scopeObject) {
          if (typeof scopeObject[key] === 'function') {
            scopeResult[key] = scopeObject[key]({block});
          }
        }
        const tabListItemsArray= scopeResult['tabListItemsArray'];
        block.querySelectorAll('.paddle-right').forEach(el => {
          const paramResolver = () => ({
            
          });
          el.addEventListener('click', (e) => {
            const paramsObject = paramResolver();
            const result = {};

            for (const key in paramsObject) {
              if (typeof paramsObject[key] === 'function') {
                result[key] = paramsObject[key]({target:el, block}); // Execute function and store result
              }
            }

            
           (() => {
  const previous = tabListItemsArray.find(previousTab);
  if (previous) {
    scrollTabIntoView(previous, 'end');
  } else {
    /* c8 ignore next 3 */
    const {
      width
    } = tabList.getBoundingClientRect();
    tabList.scrollBy({
      left: -(width / 2),
      behavior: 'smooth'
    });
  }
})(e);
          });
        });})();
    });
  