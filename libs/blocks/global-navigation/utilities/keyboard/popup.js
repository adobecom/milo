/* eslint-disable class-methods-use-this */
import {
  getNextVisibleItemPosition,
  getPreviousVisibleItemPosition,
  getOpenPopup,
  selectors,
} from './utils.js';
import { closeAllDropdowns, logErrorFor } from '../utilities.js';

const getState = ({ e, element } = {}) => {
  if (!element) return {};
  const popupItems = [...element.querySelectorAll(selectors.popupItems)];
  const curr = popupItems.findIndex((el) => el === e.target);
  const prev = getPreviousVisibleItemPosition(curr, popupItems);
  const next = getNextVisibleItemPosition(curr, popupItems);
  const column = document.activeElement.closest(selectors.column);
  const visibleColumns = [...element.querySelectorAll(selectors.column)];
  const currentColumn = visibleColumns.findIndex((node) => node.isEqualNode(column));
  const prevColumn = visibleColumns[currentColumn - 1] || -1;
  const nextColumn = visibleColumns[currentColumn + 1] || -1;

  return {
    popupItems,
    curr,
    prev,
    next,
    prevColumn,
    nextColumn,
  };
};
class Popup {
  constructor({ mainNav }) {
    this.mainNav = mainNav;
    this.addEventListeners();
    this.desktop = window.matchMedia('(min-width: 900px)');
  }

  open({ focus } = {}) {
    const popupItems = [...(getOpenPopup()?.querySelectorAll(selectors.popupItems) || [])];
    if (!popupItems.length) return;
    const first = getNextVisibleItemPosition(-1, popupItems);
    const last = getPreviousVisibleItemPosition(popupItems.length, popupItems);
    if (focus === 'first') popupItems[first].focus();
    if (focus === 'last') popupItems[last].focus();
  }

  focusMainNav = (isFooter) => {
    if (isFooter) return; // There is no main nav for the footer, so we can ignore this
    this.mainNav.items[this.mainNav.curr].focus();
  };

  focusMainNavNext = (isFooter) => {
    if (isFooter) return;
    this.mainNav.focusNext();
    this.mainNav.open({});
  };

  handleKeyDown = ({ e, element, isFooter }) => {
    const { popupItems, prev, next, prevColumn, nextColumn } = getState({ e, element });

    const shiftTabOutOfFooter = isFooter && e.code === 'Tab' && e.shiftKey && prev === -1;
    const tabOutOfFooter = isFooter && e.code === 'Tab' && !e.shiftKey && next === -1;

    if (tabOutOfFooter || shiftTabOutOfFooter) return;

    e.preventDefault();
    e.stopPropagation();

    switch (e.code) {
      case 'Tab': {
        if (e.shiftKey) {
          if (prev === -1) {
            this.focusMainNav(isFooter);
            break;
          }
          popupItems[prev].focus();
        } else {
          if (next === -1) {
            this.focusMainNavNext(isFooter);
            break;
          }
          popupItems[next].focus();
        }

        break;
      }
      case 'Escape': {
        closeAllDropdowns();
        this.focusMainNav(isFooter);
        break;
      }
      case 'ArrowLeft': {
        const noPrev = (document.dir !== 'rtl' && prevColumn === -1);
        const noNext = (document.dir === 'rtl' && nextColumn === -1);
        if (noPrev || noNext) {
          this.focusMainNav(isFooter);
          break;
        }
        if (document.dir !== 'rtl') {
          prevColumn.querySelector(selectors.popupItems).focus();
        } else {
          nextColumn.querySelector(selectors.popupItems).focus();
        }
        break;
      }
      case 'ArrowUp': {
        if (prev === -1) {
          this.focusMainNav(isFooter);
          break;
        }
        popupItems[prev].focus();
        break;
      }
      case 'ArrowRight': {
        const noNext = document.dir !== 'rtl' && nextColumn === -1;
        const noPrev = document.dir === 'rtl' && prevColumn === -1;
        if (noNext || noPrev) {
          this.focusMainNav(isFooter);
          break;
        }
        if (document.dir !== 'rtl') {
          nextColumn.querySelector(selectors.popupItems).focus();
        } else {
          prevColumn.querySelector(selectors.popupItems).focus();
        }
        break;
      }
      case 'ArrowDown': {
        if (next === -1) {
          this.focusMainNavNext(isFooter);
          break;
        }
        popupItems[next].focus();
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
        if (!e.target.closest(selectors.popup) || !element || !this.desktop.matches) return;
        this.handleKeyDown({ e, element, isFooter: false });
      }, `popup key failed ${e.code}`));

    document.querySelector(selectors.globalFooter)
      ?.addEventListener('keydown', (e) => logErrorFor(() => {
        if (!this.desktop.matches) return;
        const element = e.target.closest(selectors.globalFooter);
        this.handleKeyDown({ e, element, isFooter: true });
      }, `footer key failed ${e.code}`));
  };
}

export default Popup;
