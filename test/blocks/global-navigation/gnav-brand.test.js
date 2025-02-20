/* eslint-disable no-restricted-syntax */
import { expect } from '@esm-bundle/chai';
import {
  createFullGlobalNavigation,
  selectors,
  isElementVisible,
  unavVersion,
} from './test-utilities.js';
import logoOnlyNav from './mocks/global-navigation-only-logo.plain.js';
import brandOnlyNav from './mocks/global-navigation-only-brand.plain.js';
import nonSvgBrandOnlyNav from './mocks/global-navigation-only-non-svg-brand.plain.js';
import noLogoBrandOnlyNav from './mocks/global-navigation-only-brand-no-image.plain.js';
import noBrandImageOnlyNav from './mocks/global-navigation-only-brand-no-explicit-image.js';

describe('brand', () => {
  before(() => {
    document.head.innerHTML = `
    <link rel="icon" href="/libs/img/favicons/favicon.ico" size="any">
    <script type="importmap">
      {
        "imports": {
          "https://auth.services.adobe.com/imslib/imslib.min.js": "./mocks/imslib-mock.js",
          "https://stage.adobeccstatic.com/unav/${unavVersion}/UniversalNav.js": "./mocks/unav-mock.js"
        }
      }
    </script>
  `;
  });

  describe('desktop', () => {
    it('should render the whole block', async () => {
      await createFullGlobalNavigation();

      const container = document.querySelector(selectors.brandContainer);
      const image = container.querySelector(selectors.brandImage);
      const brandText = container.querySelector(selectors.brandLabel);

      expect(isElementVisible(image)).to.equal(true);
      expect(isElementVisible(brandText)).to.equal(true);
      expect(brandText.innerText).to.equal('Adobe');
    });

    it('should not render the brand block if it was not authored', async () => {
      await createFullGlobalNavigation({ globalNavigation: logoOnlyNav });

      const container = document.querySelector(selectors.brandContainer);
      const image = container.querySelector(selectors.brandImage);
      const brandText = container.querySelector(selectors.brandLabel);

      expect(isElementVisible(image)).to.equal(false);
      expect(isElementVisible(brandText)).to.equal(false);
    });

    it('should only render the brand block', async () => {
      await createFullGlobalNavigation({ globalNavigation: brandOnlyNav });

      expect(isElementVisible(document.querySelector(selectors.brandContainer))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.logo))).to.equal(false);
      expect(isElementVisible(document.querySelector(selectors.search))).to.equal(false);
      expect(isElementVisible(document.querySelector(selectors.profile))).to.equal(false);
      expect(document.querySelectorAll(selectors.navItem).length).to.equal(0);
    });

    it('should add an alt text if one is set', async () => {
      await createFullGlobalNavigation({ globalNavigation: nonSvgBrandOnlyNav });
      const brandImage = document.querySelector(`${selectors.brandImage} img`);
      expect(isElementVisible(brandImage)).to.equal(true);
      expect(brandImage.getAttribute('alt')).to.equal('Alternative text');
    });

    it('should not render an image if the "no-logo" modifier is used', async () => {
      await createFullGlobalNavigation({ globalNavigation: noLogoBrandOnlyNav });
      const brandImage = document.querySelector(`${selectors.brandImage}`);
      expect(isElementVisible(brandImage)).to.equal(false);
    });

    it('should render a default image if the one defined is invalid', async () => {
      await createFullGlobalNavigation({ globalNavigation: noBrandImageOnlyNav });
      const brandImage = document.querySelector(`${selectors.brandImage}`);
      expect(isElementVisible(brandImage)).to.equal(true);
    });
  });

  describe('small desktop', () => {
    it('should render the logo', async () => {
      await createFullGlobalNavigation({ viewport: 'smallDesktop' });

      const container = document.querySelector(selectors.brandContainer);
      const image = container.querySelector(selectors.brandImage);
      const brandText = container.querySelector(selectors.brandLabel);

      expect(isElementVisible(image)).to.equal(true);
      expect(isElementVisible(brandText)).to.equal(false);
      expect(brandText.innerText).to.equal('Adobe');
    });
  });

  describe('mobile', () => {
    it('mobile - should render the logo', async () => {
      await createFullGlobalNavigation({ viewport: 'mobile' });

      const container = document.querySelector(selectors.brandContainer);
      const image = container.querySelector(selectors.brandImage);
      const brandText = container.querySelector(selectors.brandLabel);

      expect(isElementVisible(image)).to.equal(true);
      expect(isElementVisible(brandText)).to.equal(true);
      expect(brandText.innerText).to.equal('Adobe');
    });
  });
});
