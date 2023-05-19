/* eslint-disable class-methods-use-this */
import {
  getNextVisibleItemPosition,
  getPreviousVisibleItemPosition,
  getOpenPopup,
  selectors,
} from './utils.js';
import { closeAllDropdowns } from '../utilities.js';

const getState = ({ e } = {}) => {
  const popupEl = getOpenPopup();
  if (!popupEl) return {};
  const popupItems = [...popupEl.querySelectorAll(selectors.popupItems)];
  const curr = popupItems.findIndex((el) => el === e.target);
  const prev = getPreviousVisibleItemPosition(curr, popupItems);
  const next = getNextVisibleItemPosition(curr, popupItems);
  const column = document.activeElement.closest(selectors.column);
  const visibleColumns = [...popupEl.querySelectorAll(selectors.column)];
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

  addEventListeners = () => {
    document.querySelector(selectors.globalNav).addEventListener('keydown', (e) => {
      const popupEl = getOpenPopup();
      if (!e.target.closest(selectors.popup) || !popupEl || !this.desktop.matches) return;
      e.preventDefault();
      e.stopPropagation();
      const { popupItems, prev, next, prevColumn, nextColumn } = getState({ e });

      switch (e.code) {
        case 'Tab': {
          if (e.shiftKey) {
            if (prev === -1) {
              this.mainNav.items[this.mainNav.curr].focus();
              break;
            }
            popupItems[prev].focus();
          } else {
            if (next === -1) {
              this.mainNav.focusNext();
              this.mainNav.open({});
              break;
            }
            popupItems[next].focus();
          }

          break;
        }
        case 'Escape': {
          closeAllDropdowns();
          this.mainNav.items[this.mainNav.curr].focus();
          break;
        }
        case 'ArrowLeft': {
          const noPrev = (document.dir !== 'rtl' && prevColumn === -1);
          const noNext = (document.dir === 'rtl' && nextColumn === -1);
          if (noPrev || noNext) {
            this.mainNav.items[this.mainNav.curr].focus();
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
            this.mainNav.items[this.mainNav.curr].focus();
            break;
          }
          popupItems[prev].focus();
          break;
        }
        case 'ArrowRight': {
          const noNext = document.dir !== 'rtl' && nextColumn === -1;
          const noPrev = document.dir === 'rtl' && prevColumn === -1;
          if (noNext || noPrev) {
            this.mainNav.items[this.mainNav.curr].focus();
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
            this.mainNav.focusNext();
            this.mainNav.open();
            break;
          }
          popupItems[next].focus();
          break;
        }
        default:
          break;
      }
    });
  };
}

export default Popup;
