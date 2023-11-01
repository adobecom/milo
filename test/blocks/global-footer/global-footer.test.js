import { expect } from '@esm-bundle/chai';
import sinon, { stub } from 'sinon';
import {
  allElementsVisible,
  containerSelector,
  createFullGlobalFooter,
  featuredProductsSelectors,
  insertDummyElementOnTop,
  legalSelectors,
  menuSelectors,
  regionPickerSelectors,
  selectors,
  socialLinksSelectors,
  waitForFooterToDecorate,
} from './test-utilities.js';
import baseFooter from './mocks/base-footer.js';
import fetchedFooter from './mocks/fetched-footer.js';
import icons from './mocks/icons.js';
import { mockRes } from '../global-navigation/test-utilities.js';
import placeholders from './mocks/placeholders.js';

const originalFetch = window.fetch;
const allSelectorsKeys = Object.keys(selectors);

describe('global footer', () => {
  let clock = null;
  beforeEach(async () => {
    document.body.innerHTML = baseFooter;
    clock = sinon.useFakeTimers({
      toFake: ['setTimeout'],
      shouldAdvanceTime: true,
    });

    window.fetch = stub().callsFake((url) => {
      if (url.includes('/footer')) {
        return mockRes({ payload: fetchedFooter({ regionPickerHash: '/fragments/regions#langnav' }) });
      }

      if (url.includes('/placeholders')) {
        return mockRes({ payload: placeholders });
      }

      if (url.includes('icons.svg')) {
        return mockRes({ payload: icons });
      }

      return null;
    });
  });

  afterEach(() => {
    clock.restore();
    window.fetch = originalFetch;
  });

  describe('basic sanity tests', () => {
    it('should have footer', async () => {
      const footer = await createFullGlobalFooter({ waitForDecoration: true });
      expect(footer).to.exist;
      expect(document.querySelector('footer')).to.exist;
    });

    it('should have menu', async () => {
      const footer = await createFullGlobalFooter({ waitForDecoration: true });

      expect(footer).to.exist;

      const menuSelectorsKeys = Object.keys(menuSelectors);
      for (const selectorKey of menuSelectorsKeys) {
        const targetEl = document.querySelector(menuSelectors[selectorKey]);
        expect(!!targetEl).to.equal(true);
      }
    });

    it('should have featured products links', async () => {
      const footer = await createFullGlobalFooter({ waitForDecoration: true });

      expect(footer).to.exist;

      const featuredProductsSelectorsKeys = Object.keys(featuredProductsSelectors);
      for (const selectorKey of featuredProductsSelectorsKeys) {
        const targetEl = document.querySelector(featuredProductsSelectors[selectorKey]);
        expect(!!targetEl).to.equal(true);
      }
    });

    it('should have social links', async () => {
      const footer = await createFullGlobalFooter({ waitForDecoration: true });

      expect(footer).to.exist;

      const socialSelectorsKeys = Object.keys(socialLinksSelectors);
      for (const selectorKey of socialSelectorsKeys) {
        const targetEl = document.querySelector(socialLinksSelectors[selectorKey]);
        expect(!!targetEl).to.equal(true);
      }
    });

    it('should have region picker', async () => {
      const footer = await createFullGlobalFooter({ waitForDecoration: true });

      expect(footer).to.exist;

      const regionPickerSelectorsKeys = Object.keys(regionPickerSelectors);
      for (const selectorKey of regionPickerSelectorsKeys) {
        const targetEl = document.querySelector(regionPickerSelectors[selectorKey]);
        expect(!!targetEl).to.equal(true);
      }
    });

    it('should have legal section', async () => {
      const footer = await createFullGlobalFooter({ waitForDecoration: true });

      expect(footer).to.exist;

      const legalSectionSelectorsKeys = Object.keys(legalSelectors);
      for (const selectorKey of legalSectionSelectorsKeys) {
        const targetEl = document.querySelector(legalSelectors[selectorKey]);
        expect(!!targetEl).to.equal(true);
      }
    });

    it('should render the whole footer', async () => {
      const footer = await createFullGlobalFooter({ waitForDecoration: true });
      expect(footer).to.exist;

      for (const selectorKey of allSelectorsKeys) {
        const targetEl = document.querySelector(selectors[selectorKey]);
        expect(!!targetEl).to.equal(true);
      }
    });
  });

  describe('conditional render tests', () => {
    it('should render the footer when in viewport', async () => {
      const footer = await createFullGlobalFooter({ waitForDecoration: true });

      expect(footer).to.exist;

      for (const selectorKey of allSelectorsKeys) {
        const targetEl = document.querySelector(selectors[selectorKey]);
        expect(!!targetEl).to.equal(true);
      }

      const elementsAreVisible = await allElementsVisible(
        selectors,
        document.querySelector(containerSelector),
      );
      expect(elementsAreVisible).to.equal(true);
    });

    it('should render the footer after 3s when outside of the 300px range of the viewport', async () => {
      const viewportHeight = window.innerHeight;
      insertDummyElementOnTop({ height: viewportHeight + 400 });

      const footer = await createFullGlobalFooter({ waitForDecoration: false });

      expect(footer).to.exist;

      for (const selectorKey of allSelectorsKeys) {
        expect(!!document.querySelector(selectors[selectorKey])).to.equal(
          false,
        );
      }

      clock.tick(3000);
      await waitForFooterToDecorate();
      for (const selectorKey of allSelectorsKeys) {
        expect(!!document.querySelector(selectors[selectorKey])).to.equal(
          true,
        );
      }
    });

    it('should render the footer when outside of the viewport, but within 300px range', async () => {
      const viewportHeight = window.innerHeight;
      insertDummyElementOnTop({ height: viewportHeight + 200 });
      const startTime = performance.now();
      const footer = await createFullGlobalFooter({ waitForDecoration: true });
      const endTime = performance.now();
      const timeDiff = endTime - startTime;

      expect(footer).to.exist;
      for (const selectorKey of allSelectorsKeys) {
        expect(!!document.querySelector(selectors[selectorKey])).to.equal(
          true,
        );
      }
      // footer decoration should take less than 3s if within 300px range of viewport
      expect(timeDiff < 3000).to.equal(true);
    });

    it('should render the footer when outside of the 300px viewport range, but scrolled into view earlier than 3s', async () => {
      const viewportHeight = window.innerHeight;
      insertDummyElementOnTop({ height: viewportHeight + 400 });
      const startTime = performance.now();
      const footer = await createFullGlobalFooter({ waitForDecoration: false });

      expect(footer).to.exist;
      for (const selectorKey of allSelectorsKeys) {
        expect(!!document.querySelector(selectors[selectorKey])).to.equal(
          false,
        );
      }

      window.scrollBy(0, viewportHeight);
      await waitForFooterToDecorate();
      for (const selectorKey of allSelectorsKeys) {
        expect(!!document.querySelector(selectors[selectorKey])).to.equal(
          true,
        );
      }
      const endTime = performance.now();
      const timeDiff = endTime - startTime;
      // footer decoration should take less than 3s when scrolled into view
      expect(timeDiff < 3000).to.equal(true);

      const elementsAreVisible = await allElementsVisible(
        selectors,
        document.querySelector(containerSelector),
      );
      expect(elementsAreVisible).to.equal(true);
    });
  });

  describe('region picker tests', () => {
    it('should handle non-empty hash', async () => {
      const footer = await createFullGlobalFooter({ waitForDecoration: true });
      expect(footer).to.exist;
      const regionPickerElem = document.querySelector('.feds-regionPicker');
      regionPickerElem.dispatchEvent(new Event('click'));

      expect(regionPickerElem.getAttribute('href') === '#langnav').to.be.true;
      expect(regionPickerElem.hasAttribute('aria-expanded')).to.be.true;
      expect(regionPickerElem.getAttribute('aria-expanded') === 'true').to.be.true;
    });

    it('should handle empty hash', async () => {
      window.fetch = stub().callsFake((url) => {
        if (url.includes('/footer')) {
          return mockRes({ payload: fetchedFooter({ regionPickerHash: '' }) });
        }

        if (url.includes('/placeholders')) {
          return mockRes({ payload: placeholders });
        }

        if (url.includes('icons.svg')) {
          return mockRes({ payload: icons });
        }

        return null;
      });

      const footer = await createFullGlobalFooter({ waitForDecoration: true });
      const regionPickerElem = document.querySelector('.feds-regionPicker');

      expect(footer).to.exist;
      expect(regionPickerElem.getAttribute('href') === '#').to.be.true;

      regionPickerElem.dispatchEvent(new Event('click'));
      expect(regionPickerElem.hasAttribute('aria-expanded')).to.be.true;
      expect(regionPickerElem.getAttribute('aria-expanded') === 'true').to.be.true;
    });
  });
});
