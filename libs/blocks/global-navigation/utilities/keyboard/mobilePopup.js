/* eslint-disable class-methods-use-this */
import {
  getNextVisibleItemPosition,
  getPreviousVisibleItemPosition,
  isElementVisible,
  getOpenPopup,
  selectors,
} from './utils.js';
import { closeAllDropdowns, logErrorFor } from '../utilities.js';

const closeHeadlines = () => {
  const open = [...document.querySelectorAll(`${selectors.headline}[aria-expanded="true"]`)];
  open.forEach((el) => el.setAttribute('aria-expanded', 'false'));
};

const openHeadline = ({ headline, focus } = {}) => {
  closeHeadlines();
  if (headline.getAttribute('aria-haspopup') === 'true') {
    headline.setAttribute('aria-expanded', 'true');
    const section = headline.closest(selectors.section)
      || headline.closest(selectors.column);
    const items = [...section.querySelectorAll(selectors.popupItems)]
      .filter((el) => isElementVisible(el));
    if (focus === 'first') items[0].focus();
    if (focus === 'last') items[items.length - 1].focus();
  }
};

const getState = () => {
  const popupEl = getOpenPopup();
  if (!popupEl) return { popupItems: [] };
  const popupItems = [...popupEl.querySelectorAll(selectors.popupItems)];
  // In the markup either a section OR column can contain a expandable headline
  // which is what we are interested in - so we can treat them both as sections.
  const section = document.activeElement.closest(selectors.section)
    || document.activeElement.closest(selectors.column);
  let allSections = [...popupEl.querySelectorAll(selectors.section)];
  if (!allSections.length) allSections = [...popupEl.querySelectorAll(selectors.column)];
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
  }

  mobileArrowUp = ({ prev, curr }) => {
    // Case 1:  Move focus to the previous item
    if (prev !== -1 && curr - 1 === prev) {
      const { currentSection, popupItems } = getState();
      popupItems[prev].focus();
      if (currentSection !== getState().currentSection) closeHeadlines();
      return;
    }

    // Case 2: No headline + no previous item, move to the main nav
    const { prevHeadline } = getState();
    if (!prevHeadline) {
      this.mainNav.items[this.mainNav.curr].focus();
      return;
    }

    // Case 3: Open the previous headline
    openHeadline({ headline: prevHeadline, focus: 'last' });
  };

  mobileArrowDown = ({ next }) => {
    // Case 1: Move focus to the next item
    if (next !== -1) {
      const { currentSection, popupItems } = getState();
      popupItems[next].focus();
      if (currentSection !== getState().currentSection) closeHeadlines();
      return;
    }
    // Case 2: No headline + no next item, move to the main nav
    const { nextHeadline } = getState();
    if (!nextHeadline) {
      closeHeadlines();
      this.mainNav.focusNext();
      this.mainNav.open();
      return;
    }

    // Case 3: Open the next headline
    openHeadline({ headline: nextHeadline, focus: 'first' });
  };

  addEventListeners = () => {
    document.querySelector(selectors.globalNav).addEventListener('keydown', (e) => logErrorFor(() => {
      const popupEl = getOpenPopup();
      if (!e.target.closest(selectors.popup) || !popupEl || this.desktop.matches) return;
      e.preventDefault();
      e.stopPropagation();
      const popupItems = [...popupEl.querySelectorAll(selectors.popupItems)];
      const curr = popupItems.findIndex((el) => el === e.target);
      const prev = getPreviousVisibleItemPosition(curr, popupItems);
      const next = getNextVisibleItemPosition(curr, popupItems);

      switch (e.code) {
        case 'Tab': {
          if (e.shiftKey) {
            this.mobileArrowUp({ prev, curr });
          } else {
            this.mobileArrowDown({ next });
          }
          break;
        }
        case 'Escape': {
          closeAllDropdowns();
          this.mainNav.items[this.mainNav.curr].focus();
          break;
        }
        case 'ArrowLeft': {
          const { prevHeadline, nextHeadline } = getState();
          const headline = document.dir !== 'rtl' ? prevHeadline : nextHeadline;
          if (!headline) {
            closeHeadlines();
            if (document.dir !== 'rtl') {
              this.mainNav.items[this.mainNav.curr].focus();
            } else {
              this.mainNav.focusNext();
              this.mainNav.open();
            }
            break;
          }
          openHeadline({ headline, focus: 'first' });
          break;
        }
        case 'ArrowUp': {
          this.mobileArrowUp({ prev, curr });
          break;
        }
        case 'ArrowRight': {
          const { prevHeadline, nextHeadline } = getState();
          const headline = document.dir !== 'rtl' ? nextHeadline : prevHeadline;
          if (!headline) {
            closeHeadlines();
            if (document.dir !== 'rtl') {
              this.mainNav.focusNext();
              this.mainNav.open();
            } else {
              this.mainNav.items[this.mainNav.curr].focus();
            }
            break;
          }
          openHeadline({ headline, focus: 'first' });
          break;
        }
        case 'ArrowDown': {
          this.mobileArrowDown({ next });
          break;
        }
        default:
          break;
      }
    }, `mobile popup key failed ${e.code}`));
  };
}

export default Popup;
