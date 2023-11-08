import { expect } from '@esm-bundle/chai';
import sinon, { stub } from 'sinon';
import {
  allElementsVisible,
  visibleSelectorsDesktop,
  visibleSelectorsMobile,
  containerSelector,
  createFullGlobalFooter,
  insertDummyElementOnTop,
  isElementVisible,
  waitForFooterToDecorate,
  allSelectors,
} from './test-utilities.js';
import baseFooter from './mocks/base-footer.js';
import fetchedFooter from './mocks/fetched-footer.js';
import icons from './mocks/icons.js';
import { mockRes } from '../global-navigation/test-utilities.js';
import placeholders from './mocks/placeholders.js';
import { logErrorFor } from '../../../libs/blocks/global-navigation/utilities/utilities.js';

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
      await createFullGlobalFooter({ waitForDecoration: true, viewport: 'wide' });

      Object.keys(allSelectors).forEach((key) => expect(
        document.querySelector(allSelectors[key]) instanceof HTMLElement,
      ).to.equal(true));

      expect(allElementsVisible(
        visibleSelectorsDesktop,
        document.querySelector(containerSelector),
      )).to.equal(true);
    });
  });

  describe('desktop', () => {
    describe('basic sanity tests', () => {
      it('should have footer', async () => {
        await createFullGlobalFooter({ waitForDecoration: true });
        expect(document.querySelector('footer')).to.exist;

        Object.keys(allSelectors).forEach((key) => expect(
          document.querySelector(allSelectors[key]) instanceof HTMLElement,
        ).to.equal(true));

        expect(allElementsVisible(
          visibleSelectorsDesktop,
          document.querySelector(containerSelector),
        )).to.equal(true);
      });
    });

    describe('conditional render tests', () => {
      it('should render the footer when in viewport', async () => {
        await createFullGlobalFooter({ waitForDecoration: true });

        Object.keys(allSelectors).forEach((key) => expect(
          document.querySelector(allSelectors[key]) instanceof HTMLElement,
        ).to.equal(true));

        expect(allElementsVisible(
          visibleSelectorsDesktop,
          document.querySelector(containerSelector),
        )).to.equal(true);
      });

      it('should render the footer after 3s when outside of the 300px range of the viewport', async () => {
        insertDummyElementOnTop({ height: window.innerHeight + 400 });

        await createFullGlobalFooter({ waitForDecoration: false });

        Object.keys(allSelectors).forEach((key) => expect(
          document.querySelector(allSelectors[key]) instanceof HTMLElement,
        ).to.equal(false));

        clock.tick(3000);
        await waitForFooterToDecorate();

        Object.keys(allSelectors).forEach((key) => expect(
          document.querySelector(allSelectors[key]) instanceof HTMLElement,
        ).to.equal(true));
      });

      it('should render the footer when outside of the viewport, but within 300px range', async () => {
        insertDummyElementOnTop({ height: window.innerHeight + 200 });
        const startTime = performance.now();
        await createFullGlobalFooter({ waitForDecoration: true });
        const endTime = performance.now();
        const timeDiff = endTime - startTime;

        Object.keys(allSelectors).forEach((key) => expect(
          document.querySelector(allSelectors[key]) instanceof HTMLElement,
        ).to.equal(true));
        // footer decoration should take less than 3s if within 300px range of viewport
        expect(timeDiff < 3000).to.equal(true);
      });

      it('should render the footer when outside of the 300px viewport range, but scrolled into view earlier than 3s', async () => {
        insertDummyElementOnTop({ height: window.innerHeight + 400 });
        const startTime = performance.now();
        await createFullGlobalFooter({ waitForDecoration: false });

        Object.keys(allSelectors).forEach((key) => expect(
          document.querySelector(allSelectors[key]) instanceof HTMLElement,
        ).to.equal(false));

        window.scrollBy(0, window.innerHeight);
        await waitForFooterToDecorate();

        Object.keys(allSelectors).forEach((key) => expect(
          document.querySelector(allSelectors[key]) instanceof HTMLElement,
        ).to.equal(true));

        const endTime = performance.now();
        const timeDiff = endTime - startTime;
        // footer decoration should take less than 3s when scrolled into view
        expect(timeDiff < 3000).to.equal(true);

        expect(allElementsVisible(
          visibleSelectorsDesktop,
          document.querySelector(containerSelector),
        )).to.equal(true);
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
      await createFullGlobalFooter({ waitForDecoration: true, viewport: 'smallDesktop' });

      Object.keys(allSelectors).forEach((key) => expect(
        document.querySelector(allSelectors[key]) instanceof HTMLElement,
      ).to.equal(true));

      expect(allElementsVisible(
        visibleSelectorsDesktop,
        document.querySelector(containerSelector),
      )).to.equal(true);
    });
  });

  describe('mobile', () => {
    it('should render the footer on mobile', async () => {
      await createFullGlobalFooter({ waitForDecoration: true, viewport: 'mobile' });

      Object.keys(allSelectors).forEach((key) => expect(
        document.querySelector(allSelectors[key]) instanceof HTMLElement,
      ).to.equal(true));

      expect(allElementsVisible(
        visibleSelectorsMobile,
        document.querySelector(containerSelector),
      )).to.equal(true);
    });

    it('should open/close dropdowns on click', async () => {
      await createFullGlobalFooter({ waitForDecoration: true, viewport: 'mobile' });

      for (const dropdown of Array.from(document.getElementsByClassName('feds-menu-section'))) {
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

  describe('logging tests', () => {
    const originalLanaLog = window.lana.log;
    let lanaLogSpy;

    beforeEach(async () => {
      lanaLogSpy = sinon.spy();
      window.lana.log = lanaLogSpy;
    });

    afterEach(() => {
      window.lana.log = originalLanaLog;
    });

    it('should send LANA log on error', async () => {
      const erroneousFunction = async () => {
        throw new Error('error');
      };

      const logMessage = 'test message';
      const logTags = 'errorType=error,module=global-footer';
      await logErrorFor(erroneousFunction, logMessage, logTags);

      expect(lanaLogSpy.calledOnce).to.be.true;

      const firstCallArguments = lanaLogSpy.getCall(0).args;

      expect(firstCallArguments[0].includes(logMessage)).to.equal(true);
      expect(firstCallArguments[1].tags === logTags).to.equal(true);
    });

    it('should send log when footer cannot be fetched', async () => {
      window.fetch = stub().callsFake((url) => {
        if (url.includes('/footer')) {
          return mockRes({
            payload: null,
            ok: false,
            status: 400,
          });
        }

        if (url.includes('/placeholders')) return mockRes({ payload: placeholders });

        if (url.includes('icons.svg')) return mockRes({ payload: icons });
        return null;
      });
      await createFullGlobalFooter({ waitForDecoration: false });
      await clock.runAllAsync();
      const firstCallArguments = lanaLogSpy.getCall(0).args;
      const secondCallArguments = lanaLogSpy.getCall(1).args;
      expect(firstCallArguments[0].includes('Failed to fetch footer content:')).to.equal(true);
      expect(firstCallArguments[1].tags === 'errorType=error,module=global-footer').to.equal(true);
      expect(secondCallArguments[0].includes('Footer content could not be found')).to.equal(true);
      expect(secondCallArguments[1].tags === 'errorType=error,module=global-footer').to.equal(true);
    });

    it('should send log if failed to load icons', async () => {
      window.fetch = stub().callsFake((url) => {
        if (url.includes('/footer')) {
          return mockRes({
            payload: fetchedFooter(
              { regionPickerHash: '/fragments/regions#langnav' },
            ),
          });
        }

        if (url.includes('/placeholders')) return mockRes({ payload: placeholders });

        if (url.includes('icons.svg')) return mockRes({ payload: null, ok: false, status: 400 });

        return null;
      });
      await createFullGlobalFooter({ waitForDecoration: true });

      const firstCallArguments = lanaLogSpy.getCall(0).args;
      expect(firstCallArguments[0].includes('Failed to load icons:')).to.equal(true);
      expect(firstCallArguments[1].tags === 'errorType=error,module=global-footer').to.equal(true);
    });
  });
});
