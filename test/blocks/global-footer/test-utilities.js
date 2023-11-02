import { setViewport } from '@web/test-runner-commands';
import { setConfig } from '../../../libs/utils/utils.js';
import { config, isElementVisible, loadStyles, viewports } from '../global-navigation/test-utilities.js';
import { waitForElement } from '../../helpers/waitfor.js';

export const containerSelector = '.global-footer';

export const baseSelectors = {
  footerIcons: '.feds-footer-icons',
  footerWrapper: '.feds-footer-wrapper',
};

export const menuSelectors = {
  menuContent: '.feds-menu-content',
  menuColumn: '.feds-menu-column',
  menuSection: '.feds-menu-section',
  menuHeadline: '.feds-menu-headline',
  menuItems: '.feds-menu-items',
};

export const featuredProductsSelectors = {
  featuredProducts: '.feds-featuredProducts',
  featuredProductsLabel: '.feds-featuredProducts-label',
  navLink: '.feds-navLink',
  navLinkImage: '.feds-navLink-image',
  navLinkContent: '.feds-navLink-content',
  navLinkTitle: '.feds-navLink-title',
};

export const socialLinksSelectors = {
  social: '.feds-social',
  socialItem: '.feds-social-item',
};

export const regionPickerSelectors = { regionPickerWrapper: '.feds-regionPicker-wrapper' };

export const legalSelectors = {
  legalWrapper: '.feds-footer-legalWrapper',
  privacySection: '.feds-footer-privacySection',
  copyright: '.feds-footer-copyright',
  privacyLink: '.feds-footer-privacyLink',
};

export const selectors = {
  ...baseSelectors,
  ...menuSelectors,
  ...featuredProductsSelectors,
  ...socialLinksSelectors,
  ...regionPickerSelectors,
  ...legalSelectors,
};

export const alwaysVisibleSelectorsMobile = {
  footerWrapper: '.feds-footer-wrapper',
  menuContent: '.feds-menu-content',
  menuColumn: '.feds-menu-column',
  menuSection: '.feds-menu-section',
  ...socialLinksSelectors,
  ...regionPickerSelectors,
  ...legalSelectors,
};

// for small desktop and above
export const alwaysVisibleSelectorsDesktop = {
  footerWrapper: '.feds-footer-wrapper',
  menuContent: '.feds-menu-content',
  menuColumn: '.feds-menu-column',
  menuSection: '.feds-menu-section',
  ...featuredProductsSelectors,
  ...socialLinksSelectors,
  ...regionPickerSelectors,
  ...legalSelectors,
};

export const allElementsVisible = (givenSelectors, parentEl) => {
  const waitForElements = [];

  const selectorsKeys = Object.keys(givenSelectors);
  for (const selectorKey of selectorsKeys) {
    const targetEl = parentEl.querySelector(givenSelectors[selectorKey]);
    waitForElements.push(isElementVisible(targetEl));
  }

  return waitForElements.every((el) => el);
};

export const waitForFooterToDecorate = async () => {
  const waitForElements = [];

  const selectorsKeys = Object.keys(selectors);
  for (const selectorKey of selectorsKeys) {
    waitForElements.push(waitForElement(selectors[selectorKey]));
  }
  const elementsAreRendered = await Promise.all(waitForElements);
  return !!elementsAreRendered;
};

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
  if (waitForDecoration) {
    await waitForFooterToDecorate();
  }

  return instance;
};

export const insertDummyElementOnTop = ({ height }) => {
  const { firstChild } = document.body;
  const dummyElement = document.createElement('div');
  dummyElement.style.height = `${height}px`;
  document.body.insertBefore(dummyElement, firstChild);
};
