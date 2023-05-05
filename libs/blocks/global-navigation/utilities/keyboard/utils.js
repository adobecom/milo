const selectors = {
  mainNavItems:
    '.feds-navItem > a, .feds-navItem > .feds-cta-wrapper > .feds-cta',
  brand: '.feds-brand',
  mainNavToggle: '.gnav-toggle',
  searchTrigger: '.feds-search-trigger',
  searchField: '.feds-search-input',
  signIn: '.feds-signin',
  profileButton: '.feds-profile-button, .feds-signIn',
  logo: '.gnav-logo',
  breadCrumbItems: '.feds-breadcrumbs li > a',
  expandedPopupTrigger: '.feds-navLink[aria-expanded = "true"]',
  navLink: '.feds-navLink',
  promoLink: '.feds-promo-link',
  imagePromo: 'a.feds-promo-image',
  fedsNav: '.feds-nav',
  popup: '.feds-popup',
  headline: '.feds-popup-headline',
  section: '.feds-popup-section',
  column: '.feds-popup-column',
  cta: '.feds-cta',
  curtain: '.feds-curtain',
  openSearch: '.feds-search-trigger[aria-expanded = "true"]',
  globalNav: '.global-navigation',
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
