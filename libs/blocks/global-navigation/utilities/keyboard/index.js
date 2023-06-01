/* eslint-disable class-methods-use-this */
import { getNextVisibleItemPosition, getPreviousVisibleItemPosition, selectors } from './utils.js';
import MainNav from './mainNav.js';
import { closeAllDropdowns, lanaLog, logErrorFor } from '../utilities.js';

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

const openProfile = ({ e, el }) => {
  const button = e.target.closest(`${selectors.signIn}, ${selectors.profileButton}`);
  if (button && button.getAttribute('aria-expanded') === 'false') {
    e.target.click();
    el.querySelector(selectors.profileDropdown).focus();
    return true;
  }
  return false;
};

const getProfileItems = ({ e }) => {
  const focusableElements = document.querySelectorAll(selectors.profileDropdown);
  if (!focusableElements.length) return { next: -1, prev: -1, items: [] };
  const items = [...focusableElements];
  const curr = items.findIndex((element) => element === e.target);
  const next = curr + 1;
  const prev = curr - 1;
  return { next, prev, items };
};
const focusNextProfileItem = ({ e }) => {
  const { items, next } = getProfileItems({ e });
  if (items[next]) {
    items[next].focus();
  }
};

const closeProfile = () => {
  closeAllDropdowns();
  document.querySelector(`${selectors.profileButton}, ${selectors.signIn}`)?.focus();
};

const focusPrevProfileItem = ({ e }) => {
  const { items, prev } = getProfileItems({ e });
  if (items[prev]) {
    items[prev].focus();
    return;
  }

  closeProfile();
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
    [...document.querySelectorAll(`${selectors.globalNav}, ${selectors.globalFooter}`)]
      .forEach((el) => {
        el.addEventListener('keydown', (e) => logErrorFor(() => {
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
            case 'ArrowDown': {
              if (e.target.closest(selectors.profile)) {
                if (openProfile({ e, el })) break;
                focusNextProfileItem({ e });
              }
              break;
            }
            case 'ArrowUp': {
              if (e.target.closest(selectors.profile)) {
                focusPrevProfileItem({ e });
              }
              break;
            }
            default:
              break;
          }
        }, `KeyboardNavigation index failed. ${e.code}`));
      });
  };
}

export default KeyboardNavigation;
