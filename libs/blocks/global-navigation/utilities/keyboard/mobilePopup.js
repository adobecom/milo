/* eslint-disable class-methods-use-this */
import {
  getNextVisibleItemPosition,
  getPreviousVisibleItemPosition,
  isElementVisible,
  getOpenPopup,
  selectors,
} from './utils.js';
import { closeAllDropdowns, logErrorFor, setActiveDropdown } from '../utilities.js';

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
      || headline.closest(selectors.column);
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

  mobileArrowUp = ({ prev, curr, element, isFooter }) => {
    // Case 1:  Move focus to the previous item
    if (prev !== -1 && curr - 1 === prev) {
      const { currentSection, popupItems } = getState(element);
      popupItems[prev].focus();
      if (currentSection !== getState(element).currentSection) closeHeadlines();
      return;
    }

    // Case 2: No headline + no previous item, move to the main nav
    const { prevHeadline } = getState(element);
    if (!prevHeadline) {
      this.focusMainNav(isFooter);
      return;
    }

    // Case 3: Open the previous headline
    openHeadline({ headline: prevHeadline, focus: 'last' });
  };

  mobileArrowDown = ({ next, element, isFooter }) => {
    // Case 1: Move focus to the next item
    if (next !== -1) {
      const { currentSection, popupItems } = getState(element);
      popupItems[next].focus();
      if (currentSection !== getState(element).currentSection) closeHeadlines();
      return;
    }
    // Case 2: No headline + no next item, move to the main nav
    const { nextHeadline } = getState(element);
    if (!nextHeadline) {
      closeHeadlines();
      this.focusMainNavNext(isFooter);
      return;
    }

    // Case 3: Open the next headline
    openHeadline({ headline: nextHeadline, focus: 'first' });
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

  handleKeyDown = ({ e, element, isFooter }) => {
    const popupItems = [...element.querySelectorAll(selectors.popupItems)];
    const curr = popupItems.findIndex((el) => el === e.target);
    const prev = getPreviousVisibleItemPosition(curr, popupItems);
    const next = getNextVisibleItemPosition(curr, popupItems);

    e.preventDefault();
    e.stopPropagation();

    switch (e.code) {
      case 'Tab': {
        if (e.shiftKey) {
          this.mobileArrowUp({ prev, curr, element, isFooter });
        } else {
          this.mobileArrowDown({ curr, next, element, isFooter });
        }
        break;
      }
      case 'Escape': {
        closeAllDropdowns();
        this.focusMainNav(isFooter);
        break;
      }
      case 'ArrowLeft': {
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
        this.mobileArrowUp({ prev, curr, element, isFooter });
        break;
      }
      case 'ArrowRight': {
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
        this.mobileArrowDown({ next, element, isFooter });
        break;
      }
      default:
        break;
    }
  };

  addEventListeners = () => {
    document.querySelector(selectors.globalNav)
      ?.addEventListener('keydown', (e) => logErrorFor(() => {
        const element = getOpenPopup();
        if (!e.target.closest(selectors.popup) || !element || this.desktop.matches) return;
        this.handleKeyDown({ e, element, popupEl: element, isFooter: false });
      }, `popup key failed ${e.code}`, 'errorType=error,module=gnav-keyboard'));

    document.querySelector(selectors.globalFooter)
      ?.addEventListener('keydown', (e) => logErrorFor(() => {
        const element = e.target.closest(selectors.menuContent);
        if (!element || this.desktop.matches) return;

        const firstNavLink = element.querySelector(selectors.popupItems);
        const firstHeadline = element.querySelector(selectors.headline);
        const isFirstNavlink = e.target === firstNavLink;
        const isFirstHeadline = e.target === firstHeadline;
        const shiftTabOutOfFooter = e.shiftKey && (isFirstNavlink || isFirstHeadline);
        if (shiftTabOutOfFooter) return;

        // special case, the first dropdown needs some special logic to allow opening.
        if (e.target.closest(selectors.headline)) {
          openHeadline({ headline: e.target.closest(selectors.headline), focus: 'first' });
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        this.handleKeyDown({
          e,
          element,
          isFooter: true,
        });
      }, `footer key failed ${e.code}`, 'errorType=error,module=gnav-keyboard'));
  };
}

export default Popup;
