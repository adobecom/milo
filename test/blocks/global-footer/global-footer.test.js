import { expect } from '@esm-bundle/chai';
import sinon, { stub } from 'sinon';
import {
  allElementsVisible,
  alwaysVisibleSelectorsDesktop,
  alwaysVisibleSelectorsMobile,
  containerSelector,
  createFullGlobalFooter,
  insertDummyElementOnTop,
  selectors,
  waitForFooterToDecorate,
} from './test-utilities.js';
import baseFooter from './mocks/base-footer.js';
import fetchedFooter from './mocks/fetched-footer.js';
import icons from './mocks/icons.js';
import { isElementVisible, mockRes } from '../global-navigation/test-utilities.js';
import placeholders from './mocks/placeholders.js';

const originalFetch = window.fetch;

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
        return mockRes({
          payload: fetchedFooter(
            { regionPickerHash: '/fragments/regions#langnav' },
          ),
        });
      }

      if (url.includes('/placeholders')) return mockRes({ payload: placeholders });

      if (url.includes('icons.svg')) return mockRes({ payload: icons });

      return null;
    });
  });

  afterEach(() => {
    clock.restore();
    window.fetch = originalFetch;
  });

  describe('wide screen', async () => {
    it('should render the footer on wide screen', async () => {
      const footer = await createFullGlobalFooter({ waitForDecoration: true, viewport: 'wide' });

      expect(footer).to.exist;

      Object.keys(selectors).forEach((key) => expect(
        document.querySelector(selectors[key]) instanceof HTMLElement,
      ).to.equal(true));

      const elementsAreVisible = allElementsVisible(
        alwaysVisibleSelectorsDesktop,
        document.querySelector(containerSelector),
      );
      expect(elementsAreVisible).to.equal(true);
    });
  });

  describe('desktop', () => {
    describe('basic sanity tests', () => {
      it('should have footer', async () => {
        const footer = await createFullGlobalFooter({ waitForDecoration: true });
        expect(footer).to.exist;
        expect(document.querySelector('footer')).to.exist;

        Object.keys(selectors).forEach((key) => expect(
          document.querySelector(selectors[key]) instanceof HTMLElement,
        ).to.equal(true));

        const elementsAreVisible = allElementsVisible(
          alwaysVisibleSelectorsDesktop,
          document.querySelector(containerSelector),
        );
        expect(elementsAreVisible).to.equal(true);
      });
    });

    describe('conditional render tests', () => {
      it('should render the footer when in viewport', async () => {
        await createFullGlobalFooter({ waitForDecoration: true });

        Object.keys(selectors).forEach((key) => expect(
          document.querySelector(selectors[key]) instanceof HTMLElement,
        ).to.equal(true));

        const elementsAreVisible = allElementsVisible(
          alwaysVisibleSelectorsDesktop,
          document.querySelector(containerSelector),
        );
        expect(elementsAreVisible).to.equal(true);
      });

      it('should render the footer after 3s when outside of the 300px range of the viewport', async () => {
        const viewportHeight = window.innerHeight;
        insertDummyElementOnTop({ height: viewportHeight + 400 });

        await createFullGlobalFooter({ waitForDecoration: false });

        Object.keys(selectors).forEach((key) => expect(
          document.querySelector(selectors[key]) instanceof HTMLElement,
        ).to.equal(false));

        clock.tick(3000);
        await waitForFooterToDecorate();

        Object.keys(selectors).forEach((key) => expect(
          document.querySelector(selectors[key]) instanceof HTMLElement,
        ).to.equal(true));
      });

      it('should render the footer when outside of the viewport, but within 300px range', async () => {
        const viewportHeight = window.innerHeight;
        insertDummyElementOnTop({ height: viewportHeight + 200 });
        const startTime = performance.now();
        await createFullGlobalFooter({ waitForDecoration: true });
        const endTime = performance.now();
        const timeDiff = endTime - startTime;

        Object.keys(selectors).forEach((key) => expect(
          document.querySelector(selectors[key]) instanceof HTMLElement,
        ).to.equal(true));
        // footer decoration should take less than 3s if within 300px range of viewport
        expect(timeDiff < 3000).to.equal(true);
      });

      it('should render the footer when outside of the 300px viewport range, but scrolled into view earlier than 3s', async () => {
        const viewportHeight = window.innerHeight;
        insertDummyElementOnTop({ height: viewportHeight + 400 });
        const startTime = performance.now();
        await createFullGlobalFooter({ waitForDecoration: false });

        Object.keys(selectors).forEach((key) => expect(
          document.querySelector(selectors[key]) instanceof HTMLElement,
        ).to.equal(false));

        window.scrollBy(0, viewportHeight);
        await waitForFooterToDecorate();

        Object.keys(selectors).forEach((key) => expect(
          document.querySelector(selectors[key]) instanceof HTMLElement,
        ).to.equal(true));

        const endTime = performance.now();
        const timeDiff = endTime - startTime;
        // footer decoration should take less than 3s when scrolled into view
        expect(timeDiff < 3000).to.equal(true);

        const elementsAreVisible = allElementsVisible(
          alwaysVisibleSelectorsDesktop,
          document.querySelector(containerSelector),
        );
        expect(elementsAreVisible).to.equal(true);
      });
    });

    describe('region picker tests', () => {
      it('should handle non-empty hash', async () => {
        await createFullGlobalFooter({ waitForDecoration: true });

        const regionPickerElem = document.querySelector('.feds-regionPicker');
        regionPickerElem.dispatchEvent(new Event('click'));

        expect(regionPickerElem.getAttribute('href') === '#langnav').to.equal(true);
        expect(regionPickerElem.hasAttribute('aria-expanded')).to.equal(true);
        expect(regionPickerElem.getAttribute('aria-expanded') === 'true').to.equal(true);
      });

      it('should handle empty hash', async () => {
        window.fetch = stub().callsFake((url) => {
          if (url.includes('/footer')) {
            return mockRes({
              payload: fetchedFooter(
                { regionPickerHash: '' },
              ),
            });
          }

          if (url.includes('/placeholders')) return mockRes({ payload: placeholders });

          if (url.includes('icons.svg')) return mockRes({ payload: icons });

          return null;
        });

        await createFullGlobalFooter({ waitForDecoration: true });
        const regionPickerElem = document.querySelector('.feds-regionPicker');
        expect(regionPickerElem.getAttribute('href') === '#').to.equal(true);

        regionPickerElem.dispatchEvent(new Event('click'));
        expect(regionPickerElem.hasAttribute('aria-expanded')).to.equal(true);
        expect(regionPickerElem.getAttribute('aria-expanded') === 'true').to.equal(true);
      });
    });
  });

  describe('small desktop', async () => {
    it('should render the footer on small desktop', async () => {
      const footer = await createFullGlobalFooter({ waitForDecoration: true, viewport: 'smallDesktop' });

      expect(footer).to.exist;

      Object.keys(selectors).forEach((key) => expect(
        document.querySelector(selectors[key]) instanceof HTMLElement,
      ).to.equal(true));

      const elementsAreVisible = allElementsVisible(
        alwaysVisibleSelectorsDesktop,
        document.querySelector(containerSelector),
      );
      expect(elementsAreVisible).to.equal(true);
    });
  });

  describe('mobile', () => {
    it('should render the footer on mobile', async () => {
      const footer = await createFullGlobalFooter({ waitForDecoration: true, viewport: 'mobile' });

      expect(footer).to.exist;

      Object.keys(selectors).forEach((key) => expect(
        document.querySelector(selectors[key]) instanceof HTMLElement,
      ).to.equal(true));

      const elementsAreVisible = allElementsVisible(
        alwaysVisibleSelectorsMobile,
        document.querySelector(containerSelector),
      );
      expect(elementsAreVisible).to.equal(true);
    });

    it('should open/close dropdowns on click', async () => {
      await createFullGlobalFooter({ waitForDecoration: true, viewport: 'mobile' });
      const dropdowns = Array.from(document.getElementsByClassName('feds-menu-section'));

      for (const dropdown of dropdowns) {
        const header = dropdown.querySelector('.feds-menu-headline');
        const links = Array.from(dropdown.getElementsByClassName('feds-navLink'));

        // open the dropdown
        header.dispatchEvent(new Event('click'));
        for (const link of links) {
          expect(isElementVisible(link)).to.equal(true);
        }
        // close the dropdown
        header.dispatchEvent(new Event('click'));
        for (const link of links) {
          expect(isElementVisible(link)).to.equal(false);
        }
      }
    });
  });
});
