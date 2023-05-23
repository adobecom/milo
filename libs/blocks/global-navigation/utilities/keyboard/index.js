/* eslint-disable class-methods-use-this */
import { getNextVisibleItemPosition, getPreviousVisibleItemPosition, selectors } from './utils.js';
import MainNav from './mainNav.js';
import { lanaLog, logErrorFor } from '../utilities.js';

const cycleOnOpenSearch = ({ e, isDesktop }) => {
  const withoutBreadcrumbs = [
    ...document.querySelectorAll(`
      ${selectors.brand}, 
      ${selectors.mainNavToggle},
      ${selectors.mainNavItems},
      ${selectors.searchTrigger},
      ${selectors.searchField},
      ${selectors.signIn},
      ${selectors.profileButton},
      ${selectors.logo}
  `),
  ];
  const first = getNextVisibleItemPosition(-1, withoutBreadcrumbs);
  const last = getPreviousVisibleItemPosition(withoutBreadcrumbs.length, withoutBreadcrumbs);
  const openSearch = isDesktop && document.querySelector(selectors.openSearch);
  if (openSearch && document.activeElement === withoutBreadcrumbs[e.shiftKey ? first : last]) {
    e.preventDefault();
    withoutBreadcrumbs[e.shiftKey ? last : first].focus();
  }
};

class KeyboardNavigation {
  constructor() {
    try {
      this.addEventListeners();
      this.mainNav = new MainNav();
      this.desktop = window.matchMedia('(min-width: 900px)');
    } catch (e) {
      lanaLog({ message: 'Keyboard Navigation failed to load', e });
    }
  }

  addEventListeners = () => {
    document.querySelector(selectors.globalNav).addEventListener('keydown', (e) => logErrorFor(() => {
      switch (e.code) {
        case 'Tab': {
          cycleOnOpenSearch({ e, isDesktop: this.desktop.matches });
          break;
        }
        case 'Enter': {
          if (e.target.closest(selectors.searchField)) return;
          e.stopPropagation();
          e.preventDefault();
          e.target.click();
          break;
        }
        case 'Space': {
          if (e.target.closest(selectors.searchField)) return;
          e.stopPropagation();
          e.preventDefault();
          e.target.click();
          break;
        }
        default:
          break;
      }
    }, `KeyboardNavigation index failed. ${e.code}`));
  };
}

export default KeyboardNavigation;
