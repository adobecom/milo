// import { getMetadata } from "../../../../../utils/utils";
import { 
  trigger,
  yieldToMain,
  toFragment,
  decorateCta,
  logErrorFor,
  getActiveLink,
  getAnalyticsValue,
  fetchAndProcessPlainHtml,
  addMepHighlightAndTargetId,
} from "../../utilities/utilities.js";

import { CONFIG } from "../../global-navigation.js"

  // eslint-disable-next-line class-methods-use-this
  const getMainNavItemType = (item) => {
    const itemTopParent = item.closest('div');
    const isLinkGroup = !!item.closest('.link-group');
    const hasSyncDropdown = itemTopParent instanceof HTMLElement
      && !isLinkGroup && itemTopParent.childElementCount > 1;
    if (hasSyncDropdown) return 'syncDropdownTrigger';
    const hasAsyncDropdown = itemTopParent instanceof HTMLElement
      && itemTopParent.closest('.large-menu') instanceof HTMLElement;
    if (hasAsyncDropdown) return 'asyncDropdownTrigger';
    const isPrimaryCta = item.closest('strong') instanceof HTMLElement;
    if (isPrimaryCta) return 'primaryCta';
    const isSecondaryCta = item.closest('em') instanceof HTMLElement;
    if (isSecondaryCta) return 'secondaryCta';
    const isText = !(item.querySelector('a') instanceof HTMLElement);
    if (isText) return 'text';
    return 'link';
  };

const decorateMainNavItem = (item, index) => {
  debugger
  const itemType = getMainNavItemType(item);

  const itemHasActiveLink = ['syncDropdownTrigger', 'link'].includes(itemType)
    && getActiveLink(item.closest('div')) instanceof HTMLElement;
  const activeModifier = itemHasActiveLink ? ` ${selectors.activeNavItem.slice(1)}` : '';

  const makeTabActive = (popup) => {
    const tabbuttons = popup.querySelectorAll('.global-navigation .tabs button');
    const tabpanels = popup.querySelectorAll('.global-navigation .tab-content [role="tabpanel"]');
    closeAllTabs(tabbuttons, tabpanels);
    const { origin, pathname } = window.location;
    const url = `${origin}${pathname}`;
    setTimeout(() => {
      const activeLink = [
        ...popup.querySelectorAll('a:not([data-modal-hash])'),
      ].find((el) => (el.href === url || el.href.startsWith(`${url}?`) || el.href.startsWith(`${url}#`)));
      const tabIndex = activeLink ? +activeLink.parentNode.id : 0;
      const selectTab = popup.querySelectorAll('.tab')[tabIndex];
      const daallTab = selectTab.getAttribute('daa-ll');
      selectTab.setAttribute('daa-ll', `${daallTab.replace('click', 'open')}`);
      selectTab?.click();
      selectTab.setAttribute('daa-ll', `${daallTab.replace('open', 'click')}`);
      selectTab?.focus();
    }, 100);
  };
  function observeDropdown(dropdownTrigger) {
    const observer = new MutationObserver(() => {
      const isExpanded = dropdownTrigger.getAttribute('aria-expanded') === 'true';
      const analyticsValue = `header|${isExpanded ? 'Close' : 'Open'}`;
      dropdownTrigger.setAttribute('daa-lh', analyticsValue);
    });
    observer.observe(dropdownTrigger, { attributeFilter: ['aria-expanded'] });
  }

  // Copying dropdown contents to localNav items
  const decorateLocalNavItems = (navItem, template) => {
    const elements = [...document.querySelectorAll('.feds-localnav .feds-navItem')].find(
      (el) => {
        const link = el.querySelector('a, button');
        return link.dataset.title?.trim() === navItem.textContent;
      },
    );
    if (elements) {
      const dropdownBtn = elements.querySelector('button');
      elements.innerHTML = template.innerHTML;
      // To override the textcontent of button of first item of localnav
      if (dropdownBtn) {
        elements.querySelector('button').textContent = dropdownBtn.textContent;
      }
      // Reattach click events & mutation observers, as cloned elem don't retain event listeners
      elements.querySelector('.feds-localnav-items button')?.addEventListener('click', (e) => {
        trigger({ element: e.currentTarget, event: e, type: 'localNavItem' });
      });

      const dropdownTrigger = elements.querySelector('.feds-localnav-items button[aria-expanded]');
      if (dropdownTrigger) observeDropdown(dropdownTrigger);

      elements.querySelectorAll('.feds-menu-headline').forEach((elem) => {
        // Reattach click event listener to headlines
        elem?.setAttribute('role', 'button');
        elem?.setAttribute('tabindex', 0);
        elem?.removeAttribute('aria-level');
        elem?.setAttribute('aria-haspopup', true);
        elem?.setAttribute('aria-expanded', false);
        elem?.addEventListener('click', (e) => {
          trigger({ element: e.currentTarget, event: e, type: 'headline' });
        });
      });
    }
  };

  // All dropdown decoration is delayed
  const delayDropdownDecoration = ({ template } = {}) => {
    let decorationTimeout;

    const decorateDropdown = () => logErrorFor(async () => {
      template.removeEventListener('click', decorateDropdown);
      clearTimeout(decorationTimeout);

      const menuLogic = await loadDecorateMenu();

      await menuLogic.decorateMenu({
        item,
        template,
        type: itemType,
      });

      // if (this.newMobileNav) {
      //   const popup = template.querySelector('.feds-popup');
      //   let originalContent = popup.innerHTML;

      //   if (!isDesktop.matches && popup) {
      //     originalContent = await transformTemplateToMobile(popup, item, this.isLocalNav());
      //     popup.querySelector('.close-icon')?.addEventListener('click', this.toggleMenuMobile);
      //   }
      //   isDesktop.addEventListener('change', async () => {
      //     enableMobileScroll();
      //     if (isDesktop.matches) {
      //       popup.innerHTML = originalContent;
      //       this.block.classList.remove('new-nav');
      //     } else {
      //       originalContent = await transformTemplateToMobile(popup, item, this.isLocalNav());
      //       popup.querySelector('.close-icon')?.addEventListener('click', this.toggleMenuMobile);
      //       this.block.classList.add('new-nav');
      //     }
      //   });
      //   if (this.isLocalNav()) {
      //     decorateLocalNavItems(item, template);
      //   }
      // }
    }, 'Decorate dropdown failed', 'gnav', 'info');

    template.addEventListener('click', decorateDropdown);
    decorationTimeout = setTimeout(decorateDropdown, CONFIG.delays.mainNavDropdowns);
  };

  // Decorate item based on its type
  switch (itemType) {
    case 'syncDropdownTrigger':
    case 'asyncDropdownTrigger': {
      const dropdownTrigger = toFragment`<button
        class="feds-navLink feds-navLink--hoverCaret"
        aria-expanded="false"
        aria-haspopup="true"
        daa-ll="${getAnalyticsValue(item.textContent, index + 1)}"
        daa-lh="header|Open">
          ${item.textContent.trim()}
        </button>`;

      const isSectionMenu = item.closest('.section') instanceof HTMLElement;
      const tag = isSectionMenu ? 'section' : 'div';
      const sectionModifier = isSectionMenu ? ' feds-navItem--section' : '';
      const sectionDaaLh = isSectionMenu ? ` daa-lh='${getAnalyticsValue(item.textContent)}'` : '';
      const triggerTemplate = toFragment`
        <${tag} role="listitem" class="feds-navItem${sectionModifier}${activeModifier}" ${sectionDaaLh}>
          ${dropdownTrigger}
        </${tag}>`;

      // Toggle trigger's dropdown on click
      // dropdownTrigger.addEventListener('click', (e) => {
        // if (!isDesktop.matches && this.newMobileNav && isSectionMenu) {
        //   const popup = dropdownTrigger.nextElementSibling;
        //   // document.body.style.top should always be set
        //   // at this point by calling disableMobileScroll
        //   if (popup && this.isLocalNav()) {
        //     this.updatePopupPosition(popup);
        //   }
        //   makeTabActive(popup);
        // } else if (isDesktop.matches && this.newMobileNav && isSectionMenu) {
        //   const popup = dropdownTrigger.nextElementSibling;
        //   if (popup) popup.style.removeProperty('top');
        // }
        // trigger({ element: dropdownTrigger, event: e, type: 'dropdown' });
        // setActiveDropdown(dropdownTrigger);
      // });

      // Update analytics value when dropdown is expanded/collapsed
      // observeDropdown(dropdownTrigger);

      // delayDropdownDecoration({ template: triggerTemplate });
      return addMepHighlightAndTargetId(triggerTemplate, item);
    }
    case 'primaryCta':
    case 'secondaryCta':
      // Remove its 'em' or 'strong' wrapper
      item.parentElement.replaceWith(item);

      return addMepHighlightAndTargetId(toFragment`<div class="feds-navItem feds-navItem--centered" role="listitem">
          ${decorateCta({ elem: item, type: itemType, index: index + 1 })}
        </div>`, item);
    case 'link': {
      let customLinkModifier = '';
      let removeCustomLink = false;
      const linkElem = item.querySelector('a');
      const customLinksSection = item.closest('.link-group');
      linkElem.className = 'feds-navLink';
      linkElem.setAttribute('daa-ll', getAnalyticsValue(linkElem.textContent, index + 1));

      if (customLinksSection) {
        const removeLink = () => {
          const url = new URL(linkElem.href);
          linkElem.setAttribute('href', `${url.origin}${url.pathname}${url.search}`);
          if (isActiveLink(linkElem)) {
            linkElem.removeAttribute('href');
          }
          const linkHash = url.hash.slice(2);
          return !this.customLinks.includes(linkHash);
        };
        [...customLinksSection.classList].splice(1).forEach((className) => {
          customLinkModifier = ` feds-navItem--${className}`;
        });
        removeCustomLink = removeLink();
      } else if (itemHasActiveLink) {
        linkElem.removeAttribute('href');
        linkElem.setAttribute('role', 'link');
        linkElem.setAttribute('aria-disabled', 'true');
        linkElem.setAttribute('aria-current', 'page');
        linkElem.setAttribute('tabindex', 0);
      }

      const linkTemplate = toFragment`
        <div class="feds-navItem${activeModifier}${customLinkModifier}" role="listitem">
          ${linkElem}
        </div>`;
      return removeCustomLink ? '' : addMepHighlightAndTargetId(linkTemplate, item);
    }
    case 'text':
      return addMepHighlightAndTargetId(toFragment`<div class="feds-navItem feds-navItem--centered">
          ${item.textContent}
        </div>`, item);
    default:
      /* c8 ignore next 3 */
      return addMepHighlightAndTargetId(toFragment`<div class="feds-navItem feds-navItem--centered">
          ${item}
        </div>`, item);
  }
}


export default async function init(el, lnavSource) {
  try {
    const content = await fetchAndProcessPlainHtml({ url: lnavSource });
    if (!content) {
      lanaLog({ e, message: 'Localnav content not found', tags: 'gnav-localnav', errorType: 'error' });
    }
    const items = [...content.querySelectorAll('h2, p:only-child > strong > a, p:only-child > em > a')]
    .filter((item) => CONFIG.features.every((feature) => !item.closest(`.${feature}`)));
    for await (const [index, item] of items.entries()) {
      await yieldToMain();
      const mainNavItem = decorateMainNavItem(item, index);
      debugger
      if (mainNavItem) {
        el.appendChild(mainNavItem);
      }
    }
    // el.append(content)
  } catch (e) {
    lanaLog({ e, message: 'Localnav failed rendering', tags: 'gnav-localnav', errorType: 'error' });
    return null;
  }
}
