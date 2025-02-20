/* eslint-disable no-restricted-syntax */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { sendKeys } from '@web/test-runner-commands';
import {
  createFullGlobalNavigation,
  selectors,
  isElementVisible,
  mockRes,
  unavVersion,
} from './test-utilities.js';

const ogFetch = window.fetch;

describe('search', () => {
  let clock;
  let nav;
  let trigger;

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

  afterEach(() => {
    clock.restore();
    window.fetch = ogFetch;
  });

  describe('desktop', () => {
    beforeEach(async () => {
      nav = await createFullGlobalNavigation();
      clock = sinon.useFakeTimers({
        toFake: ['setTimeout'],
        shouldAdvanceTime: true,
      });
      trigger = document.querySelector(selectors.searchTrigger);
    });

    it('should load the search on click', async () => {
      nav.loadSearch = sinon.spy();

      trigger.click();

      expect(nav.loadSearch.callCount).to.equal(1);
    });

    it('open and close the search ', async () => {
      expect(isElementVisible(document.querySelector(selectors.searchDropdown))).to.equal(false);
      expect(trigger.getAttribute('aria-expanded')).to.equal('false');

      // loadSearch is only called on click, then Wait a tick to fetch all the mock labels
      await nav.loadSearch();
      await clock.runAllAsync();

      expect(isElementVisible(document.querySelector(selectors.searchDropdown))).to.equal(true);
      expect(trigger.getAttribute('aria-expanded')).to.equal('true');

      trigger.click();

      expect(isElementVisible(document.querySelector(selectors.searchDropdown))).to.equal(false);
      expect(trigger.getAttribute('aria-expanded')).to.equal('false');
    });

    it('fetches results from the search and clears them', async () => {
      await nav.loadSearch();
      await clock.runAllAsync();

      const searchResults = document.querySelector(selectors.searchResults);
      const searchInput = document.querySelector(selectors.searchField);
      window.fetch = sinon.stub().callsFake(() => mockRes({
        payload:
        { query_prefix: 'f', locale: 'en-US', suggested_completions: [{ name: 'framemaker', score: 578.15875, scope: 'learn' }, { name: 'fuse', score: 578.15875, scope: 'learn' }, { name: 'flash player', score: 578.15875, scope: 'learn' }, { name: 'framemaker publishing server', score: 578.15875, scope: 'learn' }, { name: 'fill & sign', score: 578.15875, scope: 'learn' }, { name: 'font folio', score: 578.15875, scope: 'learn' }, { name: 'free fonts for photoshop', score: 577.25055, scope: 'learn' }, { name: 'free lightroom presets', score: 577.25055, scope: 'learn' }, { name: 'frame', score: 577.25055, scope: 'learn' }, { name: 'frame for creative cloud', score: 577.25055, scope: 'learn' }], elastic_search_time: 1440.750028 },
      }));

      expect(document.querySelectorAll(selectors.searchResult).length).to.equal(0);
      expect(isElementVisible(searchResults)).to.equal(false);
      expect(searchInput.value).to.equal('');
      expect(searchInput.getAttribute('placeholder'))
        .to.equal('Search_test');

      searchInput.focus();
      await sendKeys({ type: 'f' });
      await clock.runAllAsync();

      const firstSearchRes = document.querySelector(selectors.searchResult);
      expect(firstSearchRes.innerText).to.equal('framemaker');
      expect(firstSearchRes.getAttribute('href')).to.equal('https://helpx.adobe.com/globalsearch.html?q=framemaker&start_index=0&country=US');
      expect(firstSearchRes.getAttribute('aria-label')).to.equal('framemaker');
      expect(isElementVisible(searchResults)).to.equal(true);
      expect(document.querySelectorAll(selectors.searchResult).length).to.equal(10);

      document.querySelector(selectors.searchClear).click();
      await clock.runAllAsync();

      expect(document.querySelectorAll(selectors.searchResult).length).to.equal(0);
    });

    it('suggests advanced search if there are no results and clears it using ESC', async () => {
      // loadSearch and wait a tick to fetch all the mock labels
      await nav.loadSearch();
      await clock.runAllAsync();

      const searchResults = document.querySelector(selectors.searchResults);
      const searchInput = document.querySelector(selectors.searchField);
      window.fetch = sinon.stub().callsFake(() => mockRes({ payload: { query_prefix: 'qwe12', locale: 'en-US', suggested_completions: [], elastic_search_time: 406.624478 } }));

      expect(document.querySelectorAll(selectors.searchResult).length).to.equal(0);
      expect(isElementVisible(searchResults)).to.equal(false);
      expect(searchInput.value).to.equal('');
      expect(searchInput.getAttribute('placeholder'))
        .to.equal('Search_test');

      searchInput.focus();
      await sendKeys({ type: 'qwe12' });
      await clock.runAllAsync();

      const firstSearchRes = document.querySelector(selectors.searchResult);
      expect(firstSearchRes.innerText).to.equal('Try our advanced search_test');
      expect(firstSearchRes.getAttribute('href')).to.equal('https://helpx.adobe.com/globalsearch.html?q=qwe12&start_index=0&country=US');
      expect(isElementVisible(searchResults)).to.equal(true);
      expect(document.querySelectorAll(selectors.searchResult).length).to.equal(1);

      await sendKeys({ press: 'Escape' });
      await clock.runAllAsync();

      expect(document.querySelectorAll(selectors.searchResult).length).to.equal(0);
    });

    it('close the search when pressing the ESC key', async () => {
      // loadSearch and wait a tick to fetch all the mock labels
      await nav.loadSearch();
      await clock.runAllAsync();

      expect(isElementVisible(document.querySelector(selectors.searchDropdown))).to.equal(true);
      expect(trigger.getAttribute('aria-expanded')).to.equal('true');

      await sendKeys({ press: 'Escape' });

      expect(isElementVisible(document.querySelector(selectors.searchDropdown))).to.equal(false);
      expect(trigger.getAttribute('aria-expanded')).to.equal('false');
      expect(document.activeElement).to.equal(trigger);
    });
  });

  describe('small desktop', () => {
    beforeEach(async () => {
      nav = await createFullGlobalNavigation({ viewport: 'smallDesktop' });
      clock = sinon.useFakeTimers({
        toFake: ['setTimeout'],
        shouldAdvanceTime: true,
      });
      trigger = document.querySelector(selectors.searchTrigger);
    });

    it('fetches results from the search and clears them', async () => {
      await nav.loadSearch();
      await clock.runAllAsync();

      const searchResults = document.querySelector(selectors.searchResults);
      const searchInput = document.querySelector(selectors.searchField);
      window.fetch = sinon.stub().callsFake(() => mockRes({
        payload:
        { query_prefix: 'f', locale: 'en-US', suggested_completions: [{ name: 'framemaker', score: 578.15875, scope: 'learn' }, { name: 'fuse', score: 578.15875, scope: 'learn' }, { name: 'flash player', score: 578.15875, scope: 'learn' }, { name: 'framemaker publishing server', score: 578.15875, scope: 'learn' }, { name: 'fill & sign', score: 578.15875, scope: 'learn' }, { name: 'font folio', score: 578.15875, scope: 'learn' }, { name: 'free fonts for photoshop', score: 577.25055, scope: 'learn' }, { name: 'free lightroom presets', score: 577.25055, scope: 'learn' }, { name: 'frame', score: 577.25055, scope: 'learn' }, { name: 'frame for creative cloud', score: 577.25055, scope: 'learn' }], elastic_search_time: 1440.750028 },
      }));

      expect(document.querySelectorAll(selectors.searchResult).length).to.equal(0);
      expect(isElementVisible(searchResults)).to.equal(false);
      expect(searchInput.value).to.equal('');
      expect(searchInput.getAttribute('placeholder'))
        .to.equal('Search_test');

      searchInput.focus();
      await sendKeys({ type: 'f' });
      await clock.runAllAsync();

      const firstSearchRes = document.querySelector(selectors.searchResult);
      expect(firstSearchRes.innerText).to.equal('framemaker');
      expect(firstSearchRes.getAttribute('href')).to.equal('https://helpx.adobe.com/globalsearch.html?q=framemaker&start_index=0&country=US');
      expect(firstSearchRes.getAttribute('aria-label')).to.equal('framemaker');
      expect(isElementVisible(searchResults)).to.equal(true);
      expect(document.querySelectorAll(selectors.searchResult).length).to.equal(10);

      document.querySelector(selectors.searchClear).click();
      await clock.runAllAsync();

      expect(document.querySelectorAll(selectors.searchResult).length).to.equal(0);
    });
  });

  describe('mobile', () => {
    beforeEach(async () => {
      nav = await createFullGlobalNavigation({ viewport: 'mobile' });
      clock = sinon.useFakeTimers({
        toFake: ['setTimeout'],
        shouldAdvanceTime: true,
      });
      trigger = document.querySelector(selectors.searchTrigger);
    });

    it('fetches results from the search and clears them', async () => {
      document.querySelector(selectors.mainNavToggle).click();
      await new Promise((resolve) => { setTimeout(resolve, 0); });
      await clock.runAllAsync();

      const searchResults = document.querySelector(selectors.searchResults);
      const searchInput = document.querySelector(selectors.searchField);
      window.fetch = sinon.stub().callsFake(() => mockRes({
        payload:
        { query_prefix: 'f', locale: 'en-US', suggested_completions: [{ name: 'framemaker', score: 578.15875, scope: 'learn' }, { name: 'fuse', score: 578.15875, scope: 'learn' }, { name: 'flash player', score: 578.15875, scope: 'learn' }, { name: 'framemaker publishing server', score: 578.15875, scope: 'learn' }, { name: 'fill & sign', score: 578.15875, scope: 'learn' }, { name: 'font folio', score: 578.15875, scope: 'learn' }, { name: 'free fonts for photoshop', score: 577.25055, scope: 'learn' }, { name: 'free lightroom presets', score: 577.25055, scope: 'learn' }, { name: 'frame', score: 577.25055, scope: 'learn' }, { name: 'frame for creative cloud', score: 577.25055, scope: 'learn' }], elastic_search_time: 1440.750028 },
      }));

      expect(document.querySelectorAll(selectors.searchResult).length).to.equal(0);
      expect(isElementVisible(searchResults)).to.equal(false);
      expect(searchInput.value).to.equal('');
      expect(searchInput.getAttribute('placeholder'))
        .to.equal('Search_test');

      searchInput.focus();
      await sendKeys({ type: 'f' });
      await clock.runAllAsync();

      const firstSearchRes = document.querySelector(selectors.searchResult);
      expect(firstSearchRes.innerText).to.equal('framemaker');
      expect(firstSearchRes.getAttribute('href')).to.equal('https://helpx.adobe.com/globalsearch.html?q=framemaker&start_index=0&country=US');
      expect(firstSearchRes.getAttribute('aria-label')).to.equal('framemaker');
      expect(isElementVisible(searchResults)).to.equal(true);
      expect(document.querySelectorAll(selectors.searchResult).length).to.equal(10);

      document.querySelector(selectors.searchClear).click();
      await clock.runAllAsync();

      expect(document.querySelectorAll(selectors.searchResult).length).to.equal(0);
    });
  });
});
