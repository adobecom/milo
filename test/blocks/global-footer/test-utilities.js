import { setViewport } from '@web/test-runner-commands';
import { setConfig } from '../../../libs/utils/utils.js';
import { config, loadStyles, viewports } from '../global-navigation/test-utilities.js';
import { waitForElement } from '../../helpers/waitfor.js';

export const containerSelector = '.global-footer';

export const allSelectors = {
  footerIcons: '.feds-footer-icons',
  footerWrapper: '.feds-footer-wrapper',
  menuContent: '.feds-menu-content',
  menuColumn: '.feds-menu-column',
  menuSection: '.feds-menu-section',
  menuHeadline: '.feds-menu-headline',
  menuItems: '.feds-menu-items',
  featuredProducts: '.feds-featuredProducts',
  featuredProductsLabel: '.feds-featuredProducts-label',
  navLink: '.feds-navLink',
  navLinkImage: '.feds-navLink-image',
  navLinkContent: '.feds-navLink-content',
  navLinkTitle: '.feds-navLink-title',
  social: '.feds-social',
  socialItem: '.feds-social-item',
  regionPickerWrapper: '.feds-regionPicker-wrapper',
  legalWrapper: '.feds-footer-legalWrapper',
  privacySection: '.feds-footer-privacySection',
  copyright: '.feds-footer-copyright',
  privacyLink: '.feds-footer-privacyLink',
};

export const visibleSelectorsMobile = Object.fromEntries(
  Object.entries(allSelectors).filter(([key]) => ![
    'footerIcons',
    'featuredProducts',
    'featuredProductsLabel',
    'navLink',
    'navLinkImage',
    'navLinkContent',
    'navLinkTitle',
    'menuItems',
    'menuHeadline',
  ].includes(key)),
);

// for small desktop and above
export const visibleSelectorsDesktop = Object.fromEntries(
  Object.entries(allSelectors).filter(([key]) => !['footerIcons'].includes(key)),
);

export const isElementVisible = (elem) => {
  const computedStyle = window.getComputedStyle(elem);
  return !!(
    (elem.offsetWidth && elem.offsetHeight)
  && elem.getClientRects().length
  && computedStyle.getPropertyValue('visibility') !== 'hidden')
  && computedStyle.getPropertyValue('opacity') > 0;
};

export const allElementsVisible = (givenSelectors, parentEl) => Object
  .keys(givenSelectors)
  .map((key) => isElementVisible(parentEl.querySelector(givenSelectors[key])))
  .every((el) => el);

export const waitForFooterToDecorate = () => Promise.all(
  Object
    .keys(allSelectors)
    .map((key) => waitForElement(allSelectors[key])),
);

export const createFullGlobalFooter = async ({ waitForDecoration, viewport = 'desktop' }) => {
  await setViewport(viewports[viewport]);
  setConfig(config);
  // we need to import the footer class in here so it can use the config we have set above
  // if we import it at the top of the file, an empty config will be defined and used by the footer
  const { default: initFooter } = await import(
    '../../../libs/blocks/global-footer/global-footer.js'
  );

  await Promise.all([
    loadStyles('../../../../libs/styles/styles.css'),
    loadStyles('../../../../libs/blocks/global-footer/global-footer.css'),
  ]);

  const instance = initFooter(document.querySelector('footer'));
  if (waitForDecoration) await waitForFooterToDecorate();
  return instance;
};

export const insertDummyElementOnTop = ({ height }) => {
  const dummyElement = document.createElement('div');
  dummyElement.style.height = `${height}px`;
  document.body.insertBefore(dummyElement, document.body.firstChild);
};
