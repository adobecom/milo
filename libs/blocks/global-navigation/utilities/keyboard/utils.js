import { selectors as baseSelectors } from '../utilities.js';

const selectors = {
  ...baseSelectors,
  mainNavItems:
    '.feds-navItem > a, .feds-navItem > .feds-cta-wrapper > .feds-cta',
  brand: '.feds-brand',
  mainNavToggle: '.feds-toggle',
  searchTrigger: '.feds-search-trigger',
  searchField: '.feds-search-input',
  signIn: '.feds-signIn',
  profileButton: '.feds-profile-button, .feds-signIn',
  logo: '.feds-logo',
  breadCrumbItems: '.feds-breadcrumbs li > a',
  expandedPopupTrigger: '.feds-navLink[aria-expanded = "true"]',
  promoLink: '.feds-promo-link',
  imagePromo: 'a.feds-promo-image',
  fedsNav: '.feds-nav',
  popup: '.feds-popup',
  headline: '.feds-menu-headline',
  section: '.feds-menu-section',
  column: '.feds-menu-column',
  cta: '.feds-cta',
  openSearch: '.feds-search-trigger[aria-expanded = "true"]',
};

selectors.popupItems = `
  ${selectors.navLink},
  ${selectors.promoLink},
  ${selectors.imagePromo},
  ${selectors.cta}
`;

const isElementVisible = (elem) => !!(
  elem
    && elem instanceof HTMLElement
    && (elem.offsetWidth && elem.offsetHeight)
    && window.getComputedStyle(elem).getPropertyValue('visibility') !== 'hidden'
);

const getNextVisibleItemPosition = (position, items) => {
  for (let newPosition = position + 1; newPosition < items.length; newPosition += 1) {
    if (isElementVisible(items[newPosition])) return newPosition;
  }
  return -1;
};

const getPreviousVisibleItemPosition = (position, items) => {
  for (let newPosition = position - 1; newPosition >= 0; newPosition -= 1) {
    if (isElementVisible(items[newPosition])) return newPosition;
  }
  return -1;
};

const getOpenPopup = () => document.querySelector(selectors.expandedPopupTrigger)
  ?.parentElement.querySelector(selectors.popup);

export {
  isElementVisible,
  getNextVisibleItemPosition,
  getPreviousVisibleItemPosition,
  selectors,
  getOpenPopup,
};
