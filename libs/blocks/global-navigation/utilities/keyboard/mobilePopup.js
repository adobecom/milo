/* eslint-disable class-methods-use-this */
import {
  getNextVisibleItemPosition,
  getPreviousVisibleItemPosition,
  isElementVisible,
  getOpenPopup,
  selectors,
} from './utils.js';
import {
  closeAllDropdowns,
  removeA11YMobileDropdowns,
  dropWhile,
  logErrorFor,
  setActiveDropdown,
  takeWhile,
  isDesktopForContext,
} from '../utilities.js';

const closeHeadlines = () => {
  const open = [...document.querySelectorAll(`${selectors.headline}[aria-expanded="true"]`)];
  open.forEach((el) => el.setAttribute('aria-expanded', 'false'));
  // Shift active class back to the parent of the first closed headline
  setActiveDropdown(open[0]);
};

const openHeadline = ({ headline, focus } = {}) => {
  closeHeadlines();
  if (headline.getAttribute('aria-haspopup') === 'true') {
    headline.setAttribute('aria-expanded', 'true');
    setActiveDropdown(headline);
    const section = headline.closest(selectors.section)
      || headline.closest(selectors.column) || headline.closest(selectors.featuredProducts);
    const items = [...section.querySelectorAll(selectors.popupItems)]
      .filter((el) => isElementVisible(el));
    if (focus === 'first') items[0].focus();
    if (focus === 'last') items[items.length - 1].focus();
  }
};

const getState = (element = getOpenPopup()) => {
  if (!element) return { popupItems: [] };
  const popupItems = [...element.querySelectorAll(selectors.popupItems)];
  // In the markup either a section OR column can contain a expandable headline
  // which is what we are interested in - so we can treat them both as sections.
  const section = document.activeElement.closest(selectors.section)
    || document.activeElement.closest(selectors.column);
  let allSections = [...element.querySelectorAll(selectors.section)];
  if (!allSections.length) allSections = [...element.querySelectorAll(selectors.column)];
  const visibleSections = allSections.filter((el) => isElementVisible(el));
  const currentSection = visibleSections.findIndex((node) => node.isEqualNode(section));
  const firstHeadline = visibleSections[0]?.querySelector(selectors.headline);
  const lastHeadline = visibleSections[visibleSections.length - 1]
    ?.querySelector(selectors.headline);
  const prevHeadline = visibleSections[currentSection - 1]
    ?.querySelector(selectors.headline);
  const nextHeadline = visibleSections[currentSection + 1]
    ?.querySelector(selectors.headline);
  return {
    visibleSections,
    currentSection,
    firstHeadline,
    lastHeadline,
    prevHeadline,
    nextHeadline,
    popupItems,
  };
};

class Popup {
  constructor({ mainNav }) {
    this.mainNav = mainNav;
    this.addEventListeners();
    this.desktop = window.matchMedia('(min-width: 900px)');
  }

  open({ focus } = {}) {
    const { firstHeadline, lastHeadline, popupItems } = getState();
    if (!popupItems.length) return;

    const headline = focus === 'last' ? lastHeadline : firstHeadline;

    if (headline && headline.getAttribute('aria-haspopup') === 'true') {
      closeHeadlines();
      headline.setAttribute('aria-expanded', 'true');
    }

    const first = getNextVisibleItemPosition(-1, popupItems);
    const last = getPreviousVisibleItemPosition(popupItems.length, popupItems);
    if (focus === 'first') popupItems[first].focus();
    if (focus === 'last') popupItems[last].focus();
    setActiveDropdown(focus === 'first' ? popupItems[first] : popupItems[last]);
  }

  mobileArrowUp = ({ prev, curr, element, isFooter, newNav }) => {
    // Case 1: First item in the list - Move focus to the headline that opened it
    if (isFooter && curr === 0) {
      const headline = document.activeElement.closest(selectors.section)
        ?.querySelector(selectors.headline)
        || document.activeElement.closest(selectors.column)?.querySelector(selectors.headline);
      if (headline) {
        headline.focus();
        return;
      }
    }

    // Case 2: Move focus to the previous item
    const state = getState(element);
    const { currentSection } = state;
    const popupItems = newNav && !isFooter ? this.popupItems() : state.popupItems;
    if (prev !== -1 && curr - 1 === prev) {
      popupItems[prev].focus();
      if (currentSection !== getState(element).currentSection) closeHeadlines();
      return;
    }

    // Case 3: No headline + no previous item, move to the main nav
    const { prevHeadline } = getState(element);
    if (!prevHeadline && !newNav && !isFooter) {
      this.focusMainNav(isFooter);
      return;
    }

    if (!prevHeadline && isFooter) {
      const prevElement = element?.previousElementSibling;
      const allHeadlines = [...prevElement.querySelectorAll(selectors.headline)];
      if (allHeadlines.length && allHeadlines[allHeadlines.length - 1]) {
        closeHeadlines();
        openHeadline({ headline: allHeadlines[allHeadlines.length - 1], focus: 'last' });
      }
      return;
    }

    // Case 4: Open the previous headline
    if (newNav && !isFooter) popupItems?.[popupItems.length - 1]?.focus();
    else openHeadline({ headline: prevHeadline, focus: 'last' });
  };

  mobileArrowDown = ({ next, element, isFooter, newNav }) => {
    // Case 0: Last item in the list - Move focus to the next global headline
    if (isFooter) {
      const { popupItems } = getState(element);
      if (next === -1 || next >= popupItems.length) {
        // We are at the end of the current list.
        // Even if we are inside a section, we want to jump to the NEXT HEADLINE.
        const currentHeadline = document.activeElement.closest(selectors.section)
          ?.querySelector(selectors.headline)
          || document.activeElement.closest(selectors.column)
            ?.querySelector(selectors.headline);

        if (currentHeadline) {
          const footer = document.querySelector(selectors.globalFooter);
          const allHeadlines = [...footer.querySelectorAll(selectors.headline)]
            .filter((h) => isElementVisible(h));
          const idx = allHeadlines.indexOf(currentHeadline);
          if (idx !== -1 && idx < allHeadlines.length - 1) {
            const nextHeadline = allHeadlines[idx + 1];
            openHeadline({ headline: nextHeadline, focus: null });
            nextHeadline.focus();
            return;
          }
        }
      }
    }

    // Case 1: Move focus to the next item
    const state = getState(element);
    const { currentSection } = state;
    const popupItems = newNav && !isFooter ? this.popupItems() : state.popupItems;
    if (next !== -1) {
      popupItems[next].focus();
      if (currentSection !== getState(element).currentSection) closeHeadlines();
      return;
    }
    // Case 2: No headline + no next item, move to the main nav
    const { nextHeadline } = getState(element);
    if (!nextHeadline && !newNav && !isFooter) {
      closeHeadlines();
      this.focusMainNavNext(isFooter);
      return;
    }

    if (!nextHeadline && isFooter) {
      const nextElement = element?.nextElementSibling;
      const headline = nextElement && nextElement.querySelector('.feds-menu-headline');
      closeHeadlines();
      if (headline) {
        openHeadline({ headline, focus: 'first' });
      } else {
        nextElement?.querySelector('a')?.focus();
      }
      return;
    }

    // Case 3: Open the next headline
    if (newNav && !isFooter) popupItems?.[0]?.focus();
    else openHeadline({ headline: nextHeadline, focus: 'first' });
  };

  focusMainNav = (isFooter) => {
    if (isFooter) return;
    this.mainNav.focusCurr();
  };

  focusMainNavNext = (isFooter) => {
    if (isFooter) return;
    this.mainNav.focusNext();
    this.mainNav.open();
  };

  popupItems = () => {
    const activePopup = document.querySelector(selectors.activePopup);
    if (!activePopup) return [];
    const tabs = [...activePopup.querySelectorAll(selectors.tab)];
    const activeTab = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true');
    const anteActiveTab = takeWhile(tabs, (tab) => tab !== activeTab);
    const postActiveTab = dropWhile(tabs, (tab) => tab !== activeTab).slice(1);
    const activeLinks = [...activePopup.querySelectorAll(selectors.activeLinks)];
    const stickyCTA = activePopup.querySelector(selectors.stickyCta);
    const topBarLinks = activePopup.querySelectorAll(selectors.topBarLinks);
    const closeIcon = activePopup.querySelector(selectors.closeLink);
    const breadcrumbLinks = activePopup.querySelectorAll(selectors.breadCrumbItems);
    return [
      ...anteActiveTab,
      activeTab,
      ...activeLinks,
      stickyCTA,
      ...postActiveTab,
      ...topBarLinks,
      closeIcon,
      ...breadcrumbLinks,
    ].filter(Boolean);
  };

  handleKeyDown = ({ e, element, isFooter }) => {
    const newNav = !!document.querySelector('header.new-nav');
    const isLocalNav = !!document.querySelector('header.local-nav');
    const popupItems = newNav && !isFooter
      ? this.popupItems()
      : [...element.querySelectorAll(selectors.popupItems)];
    const curr = popupItems.findIndex((el) => el === e.target);
    const prev = getPreviousVisibleItemPosition(curr, popupItems);
    const next = getNextVisibleItemPosition(curr, popupItems);

    if (e.code === 'Tab') return;

    e.preventDefault();
    e.stopPropagation();

    switch (e.code) {
      case 'Enter':
      case 'Space': {
        if (isFooter) {
          const headline = e.target.closest(selectors.headline);

          if (headline) {
            const isExpanded = headline.getAttribute('aria-expanded') === 'true';
            if (isExpanded) {
              closeHeadlines();
            } else {
              openHeadline({ headline, focus: null });
            }
          }
        }
        break;
      }
      case 'Escape': {
        closeAllDropdowns();
        this.focusMainNav(isFooter);
        if (newNav && isLocalNav && !isFooter) {
          removeA11YMobileDropdowns();
          const toggle = document.querySelector('header.new-nav .feds-toggle');
          toggle?.click();
          toggle?.focus();
        }
        break;
      }
      case 'ArrowLeft': {
        if (newNav) break;
        const { prevHeadline, nextHeadline } = getState(element);
        const headline = document.dir !== 'rtl' ? prevHeadline : nextHeadline;
        if (!headline) {
          if (!isFooter) closeHeadlines();
          if (document.dir !== 'rtl') {
            this.focusMainNav(isFooter);
          } else {
            this.focusMainNavNext(isFooter);
          }
          break;
        }
        openHeadline({ headline, focus: 'first' });
        break;
      }
      case 'ArrowUp': {
        if (newNav && !isFooter) break;
        if (isFooter && e.target.closest(selectors.headline)) {
          const { prevHeadline } = getState(element);
          if (prevHeadline) {
            prevHeadline.focus();
            break;
          }
          const footer = document.querySelector(selectors.globalFooter);
          const allHeadlines = [...footer.querySelectorAll(selectors.headline)]
            .filter((h) => isElementVisible(h));
          const current = e.target.closest(selectors.headline);
          const idx = allHeadlines.indexOf(current);
          if (idx > 0) {
            const previousHeadline = allHeadlines[idx - 1];
            openHeadline({ headline: previousHeadline, focus: 'last' });
            break;
          }
          break;
        }
        this.mobileArrowUp({ prev, curr, element, isFooter });
        break;
      }
      case 'ArrowRight': {
        if (newNav) break;
        const { prevHeadline, nextHeadline } = getState(element);
        const headline = document.dir !== 'rtl' ? nextHeadline : prevHeadline;
        if (!headline) {
          if (!isFooter) closeHeadlines();
          if (document.dir !== 'rtl') {
            this.focusMainNavNext(isFooter);
          } else {
            this.focusMainNav(isFooter);
          }
          break;
        }
        openHeadline({ headline, focus: 'first' });
        break;
      }
      case 'ArrowDown': {
        if (newNav && !isFooter) break;
        if (isFooter && e.target.closest(selectors.headline)) {
          const headline = e.target.closest(selectors.headline);
          const expanded = headline.getAttribute('aria-expanded') === 'true';

          // Case 1: If headline is expanded, focus the first link
          if (expanded) {
            const section = headline.closest(selectors.section)
              || headline.closest(selectors.column);
            // Default popupItems selector might not work here as it's scoped to class methods
            // We use the same selectors found in utils or assume standard link classes
            const firstLink = section?.querySelector(
              '.feds-navLink, .feds-cta--button, .feds-cta--link',
            );
            if (firstLink) {
              firstLink.focus();
              break;
            }
          }

          // Case 2: Navigate by Headline (Local or Global)
          const { nextHeadline } = getState(element);
          if (nextHeadline) {
            nextHeadline.focus();
            break;
          }
          const footer = document.querySelector(selectors.globalFooter);
          const allHeadlines = [...footer.querySelectorAll(selectors.headline)]
            .filter((h) => isElementVisible(h));
          const current = e.target.closest(selectors.headline);
          const idx = allHeadlines.indexOf(current);
          if (idx !== -1 && idx < allHeadlines.length - 1) {
            allHeadlines[idx + 1].focus();
            break;
          }
          break;
        }
        this.mobileArrowDown({ next, element, isFooter });
        break;
      }
      default:
        break;
    }
  };

  addEventListeners = () => {
    document.querySelector(selectors.globalNavTag)
      ?.addEventListener('keydown', (e) => logErrorFor(() => {
        if (!e.target.closest(selectors.globalNav)) return;
        const element = getOpenPopup();
        if (!e.target.closest(selectors.popup) || !element || this.desktop.matches) return;
        this.handleKeyDown({ e, element, popupEl: element, isFooter: false });
      }, `popup key failed ${e.code}`, 'gnav-keyboard', 'e'));

    document.addEventListener('keydown', (e) => logErrorFor(() => {
      if (!e.target.closest(selectors.globalFooter)) return;

      const element = e.target.closest(selectors.menuContent)
        || e.target.closest(selectors.featuredProducts);
      if (!element || isDesktopForContext('footer')) return;

      const firstNavLink = element.querySelector(selectors.popupItems);
      const firstHeadline = element.querySelector(selectors.headline);
      const isFirstNavlink = e.target === firstNavLink;
      const isFirstHeadline = e.target === firstHeadline;
      const shiftTabOutOfFooter = e.shiftKey
        && (isFirstNavlink || isFirstHeadline)
        && !e.target.closest(selectors.featuredProducts);
      if (shiftTabOutOfFooter) return;

      this.handleKeyDown({
        e,
        element,
        isFooter: true,
      });
    }, `footer key failed ${e.code}`, 'gnav-keyboard', 'e'));
  };
}

export default Popup;
