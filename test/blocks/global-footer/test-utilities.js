import { setViewport } from '@web/test-runner-commands';
import { setConfig } from '../../../libs/utils/utils.js';
import { config, isElementVisible, loadStyles, viewports } from '../global-navigation/test-utilities.js';
import { waitForElement } from '../../helpers/waitfor.js';
import { selectors as keyboardSelectors } from '../../../libs/blocks/global-navigation/utilities/keyboard/utils.js';
import { selectors as gnavSelectors } from '../../../libs/blocks/global-navigation/utilities/utilities.js';

export const allSelectors = {
  container: keyboardSelectors.globalFooter,
  footerIcons: '.feds-footer-icons',
  footerWrapper: '.feds-footer-wrapper',
  menuContent: keyboardSelectors.menuContent,
  menuColumn: gnavSelectors.menuColumn,
  menuSection: gnavSelectors.menuSection,
  menuHeadline: '.feds-menu-headline',
  menuItems: '.feds-menu-items',
  featuredProducts: '.feds-featuredProducts',
  featuredProductsLabel: '.feds-featuredProducts-label',
  navLink: gnavSelectors.navLink,
  navLinkImage: '.feds-navLink-image',
  navLinkContent: '.feds-navLink-content',
  navLinkTitle: '.feds-navLink-title',
  social: '.feds-social',
  socialItem: '.feds-social-item',
  regionPickerWrapper: '.feds-regionPicker-wrapper',
  regionPicker: keyboardSelectors.regionPicker,
  legalWrapper: '.feds-footer-legalWrapper',
  privacySection: '.feds-footer-privacySection',
  copyright: '.feds-footer-copyright',
  privacyLink: keyboardSelectors.privacyLink,
};

const getMobileVisibleSelectors = () => {
  const {
    container,
    footerIcons,
    featuredProducts,
    featuredProductsLabel,
    navLink,
    navLinkImage,
    navLinkContent,
    navLinkTitle,
    menuItems,
    menuHeadline,
    ...mobileSelectors
  } = allSelectors;
  return mobileSelectors;
};

const getDesktopVisibleSelectors = () => {
  const { container, footerIcons, ...desktopSelectors } = allSelectors;
  return desktopSelectors;
};

export const visibleSelectorsMobile = getMobileVisibleSelectors();

// for small desktop and above
export const visibleSelectorsDesktop = getDesktopVisibleSelectors();

export const allElementsVisible = (givenSelectors, parentEl) => {
  if (typeof givenSelectors !== 'object' || givenSelectors === null || !(parentEl instanceof Element)) {
    console.warn('Invalid arguments passed to allElementsVisible');
    return false;
  }
  return Object
    .keys(givenSelectors)
    .map((key) => isElementVisible(parentEl.querySelector(givenSelectors[key])))
    .every((el) => el);
};

export const waitForFooterToDecorate = (targetedSelectors = allSelectors) => Promise.all(
  Object
    .keys(targetedSelectors)
    .map((key) => waitForElement(allSelectors[key])),
);

export const createFullGlobalFooter = async ({ waitForDecoration, viewport = 'desktop' }) => {
  await setViewport(viewports[viewport]);
  setConfig(config);
  // we need to import the footer class in here so it can use the config we have set above
  // if we import it at the top of the file, an empty config will be defined and used by the footer

  const [, , footerModule] = await Promise.all([
    loadStyles('../../../../libs/styles/styles.css'),
    loadStyles('../../../../libs/blocks/global-footer/global-footer.css'),
    import('../../../libs/blocks/global-footer/global-footer.js'),
  ]);

  const instance = footerModule.default(document.querySelector('footer'));
  if (waitForDecoration) await waitForFooterToDecorate();
  return instance;
};

export const insertDummyElementOnTop = ({ height }) => {
  const dummyElement = document.createElement('div');
  dummyElement.style.height = `${height}px`;
  document.body.prepend(dummyElement);
};
