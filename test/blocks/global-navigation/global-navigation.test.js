/* eslint-disable no-restricted-syntax */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { sendKeys, setViewport } from '@web/test-runner-commands';
import { createFullGlobalNavigation, selectors, isElementVisible, mockRes, viewports } from './test-utilities.js';
import logoOnlyNav from './mocks/global-navigation-only-logo.plain.js';
import brandOnlyNav from './mocks/global-navigation-only-brand.plain.js';

const ogFetch = window.fetch;

// TODO
// - test localization
// - test breadcrumbs SEO

describe('global navigation', () => {
  describe('basic sanity tests', () => {
    it('should render the navigation on desktop', async () => {
      const nav = await createFullGlobalNavigation();

      expect(nav).to.exist;
      expect(isElementVisible(document.querySelector(selectors.globalNav))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.search))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.profile))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.logo))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.brandContainer))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.gnavToggle))).to.equal(false);
      expect(document.querySelectorAll(selectors.navItem).length).to.equal(8);
    });

    it('should render the navigation on smallDesktop', async () => {
      await createFullGlobalNavigation({ viewport: 'smallDesktop' });

      expect(isElementVisible(document.querySelector(selectors.globalNav))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.search))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.profile))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.logo))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.brandContainer))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.gnavToggle))).to.equal(false);
      expect(document.querySelectorAll(selectors.navItem).length).to.equal(8);
    });

    it('should render the navigation on mobile', async () => {
      await createFullGlobalNavigation({ viewport: 'mobile' });

      expect(isElementVisible(document.querySelector(selectors.globalNav))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.search))).to.equal(false);
      expect(isElementVisible(document.querySelector(selectors.profile))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.logo))).to.equal(false);
      expect(isElementVisible(document.querySelector(selectors.brandContainer))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.gnavToggle))).to.equal(true);
      expect(document.querySelectorAll(selectors.navItem).length).to.equal(8);
    });
  });

  describe('brand', () => {
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

  describe('Gnav-toggle', () => {
    describe('desktop', () => {
      it('should be hidden', async () => {
        await createFullGlobalNavigation();

        expect(isElementVisible(document.querySelector(selectors.gnavToggle))).to.equal(false);
      });
    });

    describe('smallDesktop', () => {
      it('should be hidden', async () => {
        await createFullGlobalNavigation({ viewport: 'smallDesktop' });

        expect(isElementVisible(document.querySelector(selectors.gnavToggle))).to.equal(false);
      });
    });

    describe('mobile', () => {
      it('should be visible', async () => {
        await createFullGlobalNavigation({ viewport: 'mobile' });

        expect(isElementVisible(document.querySelector(selectors.gnavToggle))).to.equal(true);
      });

      it('should open navigation on click', async () => {
        await createFullGlobalNavigation({ viewport: 'mobile' });

        const header = document.querySelector(selectors.globalNav);
        const toggle = document.querySelector(selectors.gnavToggle);
        const curtain = document.querySelector(selectors.curtain);

        expect(header.classList.contains('is-open')).to.equal(false);
        expect(curtain.classList.contains('is-open')).to.equal(false);
        expect(isElementVisible(document.querySelector(selectors.navWrapper))).to.equal(false);

        toggle.click();

        expect(header.classList.contains('is-open')).to.equal(true);
        expect(curtain.classList.contains('is-open')).to.equal(true);
        expect(isElementVisible(document.querySelector(selectors.navWrapper))).to.equal(true);
      });
    });
  });

  describe('main nav', () => {
    describe('desktop', () => {
      it('should render the main nav', async () => {
        await createFullGlobalNavigation();

        [...document.querySelectorAll(selectors.navItem)].forEach((el) => {
          expect(isElementVisible(el)).to.equal(true);
        });
      });

      it('should open a popup on click', async () => {
        await createFullGlobalNavigation();

        const navItem = document.querySelector(selectors.navItem);
        const navLink = navItem.querySelector(selectors.navLink);
        const popup = navItem.querySelector(selectors.popup);

        expect(navLink.getAttribute('aria-expanded')).to.equal('false');
        expect(navLink.getAttribute('daa-lh')).to.equal('header|Open');
        expect(isElementVisible(popup)).to.equal(false);

        navLink.click();

        expect(navLink.getAttribute('aria-expanded')).to.equal('true');
        expect(isElementVisible(popup)).to.equal(true);
        expect(navLink.getAttribute('daa-lh')).to.equal('header|Close');
      });

      it('should close a popup on click', async () => {
        await createFullGlobalNavigation();

        const navItem = document.querySelector(selectors.navItem);
        const navLink = navItem.querySelector(selectors.navLink);
        const popup = navItem.querySelector(selectors.popup);

        navLink.click();

        expect(navLink.getAttribute('aria-expanded')).to.equal('true');
        expect(isElementVisible(popup)).to.equal(true);

        navLink.click();

        expect(navLink.getAttribute('aria-expanded')).to.equal('false');
        expect(isElementVisible(popup)).to.equal(false);
      });

      it(
        'should be able to click all links with popups and at most have 1 open popup at a time',
        async () => {
          await createFullGlobalNavigation();

          const navLinks = document.querySelectorAll(`${selectors.navLink}[aria-haspopup='true']`);

          [...navLinks].forEach((link) => {
            const navItem = link.parentElement;
            const popup = navItem.querySelector(selectors.popup);

            link.click();

            expect(document.querySelectorAll(`${selectors.navLink}[aria-expanded='true']`).length).to.equal(1);
            expect(link.getAttribute('aria-expanded')).to.equal('true');
            expect(isElementVisible(popup)).to.equal(true);
          });
        },
      );

      it('should close popups when clicking outside of the header', async () => {
        await createFullGlobalNavigation();

        const navItem = document.querySelector(selectors.navItem);
        const navLink = navItem.querySelector(selectors.navLink);
        const popup = navItem.querySelector(selectors.popup);

        navLink.click();

        expect(navLink.getAttribute('aria-expanded')).to.equal('true');
        expect(isElementVisible(popup)).to.equal(true);

        document.body.click();

        expect(navLink.getAttribute('aria-expanded')).to.equal('false');
        expect(isElementVisible(popup)).to.equal(false);
      });
    });

    describe('small desktop', () => {
      it('should render the main nav', async () => {
        await createFullGlobalNavigation({ viewport: 'smallDesktop' });

        [...document.querySelectorAll(selectors.navItem)].forEach((el) => {
          expect(isElementVisible(el)).to.equal(true);
        });
      });
    });

    describe('mobile', () => {
      it('should render the main nav only on click', async () => {
        await createFullGlobalNavigation({ viewport: 'mobile' });

        [...document.querySelectorAll(selectors.navItem)].forEach((el) => {
          expect(isElementVisible(el)).to.equal(false);
        });

        document.querySelector(selectors.gnavToggle).click();

        [...document.querySelectorAll(selectors.navItem)].forEach((el) => {
          expect(isElementVisible(el)).to.equal(true);
        });
      });
    });
  });

  describe('main nav popups', () => {
    describe('desktop', () => {
      it('should render a popup properly', async () => {
        await createFullGlobalNavigation();

        const navItem = document.querySelector(selectors.navItem);
        const navLink = navItem.querySelector(selectors.navLink);
        const popup = navItem.querySelector(selectors.popup);
        const columns = popup.querySelectorAll(selectors.column);
        const navLinks = popup.querySelectorAll(selectors.navLink);

        navLink.click();

        expect(columns.length).to.equal(4);
        expect(navLinks.length).to.equal(22);

        [...columns].forEach((column) => {
          expect(isElementVisible(column)).to.equal(true);
        });

        [...navLinks].forEach((link) => {
          expect(isElementVisible(link)).to.equal(true);
        });
      });

      it('should render the promo', async () => {
        await createFullGlobalNavigation();

        document.querySelector(selectors.gnavToggle).click();
        document.querySelector(selectors.navLink).click();

        expect(isElementVisible(document.querySelector(selectors.promoImage))).to.equal(true);
      });
    });

    describe('small desktop', () => {
      it('should render a popup properly', async () => {
        await createFullGlobalNavigation({ viewport: 'smallDesktop' });

        const navItem = document.querySelector(selectors.navItem);
        const navLink = navItem.querySelector(selectors.navLink);
        const popup = navItem.querySelector(selectors.popup);
        const columns = popup.querySelectorAll(selectors.column);
        const navLinks = popup.querySelectorAll(selectors.navLink);

        navLink.click();

        expect(columns.length).to.equal(4);
        expect(navLinks.length).to.equal(22);

        [...columns].forEach((column) => {
          expect(isElementVisible(column)).to.equal(true);
        });

        [...navLinks].forEach((link) => {
          expect(isElementVisible(link)).to.equal(true);
        });
      });

      it('should render the promo', async () => {
        await createFullGlobalNavigation({ viewport: 'smallDesktop' });

        document.querySelector(selectors.gnavToggle).click();
        document.querySelector(selectors.navLink).click();

        expect(isElementVisible(document.querySelector(selectors.promoImage))).to.equal(true);
      });
    });

    describe('mobile', () => {
      it('should open a popup and headline on click', async () => {
        await createFullGlobalNavigation({ viewport: 'mobile' });

        document.querySelector(selectors.gnavToggle).click();

        const navItem = document.querySelector(selectors.navItem);
        const navLink = navItem.querySelector(selectors.navLink);
        const popup = navItem.querySelector(selectors.popup);
        const headline = popup.querySelector(selectors.headline);
        const headlinePopupItems = popup.querySelector(selectors.popupItems);

        expect(isElementVisible(popup.querySelector(selectors.navLink))).to.equal(false);
        expect(navLink.getAttribute('aria-expanded')).to.equal('false');
        expect(navLink.getAttribute('daa-lh')).to.equal('header|Open');
        expect(isElementVisible(popup)).to.equal(false);
        expect(headline.getAttribute('aria-expanded')).to.equal('false');
        expect(isElementVisible(headlinePopupItems)).to.equal(false);

        navLink.click();

        expect(isElementVisible(popup.querySelector(selectors.navLink))).to.equal(true);
        expect(navLink.getAttribute('aria-expanded')).to.equal('true');
        expect(navLink.getAttribute('daa-lh')).to.equal('header|Close');
        expect(isElementVisible(popup)).to.equal(true);
        expect(headline.getAttribute('aria-expanded')).to.equal('false');
        expect(isElementVisible(headlinePopupItems)).to.equal(false);

        headline.click();

        expect(headline.getAttribute('aria-expanded')).to.equal('true');
        expect(isElementVisible(headlinePopupItems)).to.equal(true);
      });

      it('should not render the promo', async () => {
        await createFullGlobalNavigation({ viewport: 'mobile' });

        document.querySelector(selectors.gnavToggle).click();
        document.querySelector(selectors.navLink).click();

        expect(isElementVisible(document.querySelector(selectors.promoImage))).to.equal(false);
      });
    });
  });

  describe('search', () => {
    let clock;
    let nav;
    let trigger;

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
        const searchInput = document.querySelector(selectors.searchInput);
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
        const searchInput = document.querySelector(selectors.searchInput);
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
        const searchInput = document.querySelector(selectors.searchInput);
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
        document.querySelector(selectors.gnavToggle).click();
        await clock.runAllAsync();

        const searchResults = document.querySelector(selectors.searchResults);
        const searchInput = document.querySelector(selectors.searchInput);
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

  describe('profile', () => {
    describe('desktop', () => {
      it('renders the profile', async () => {
        await createFullGlobalNavigation({ });
        expect(isElementVisible(document.querySelector(selectors.profile))).to.equal(true);
      });

      it('renders the sign in button and dropdown on click', async () => {
        await createFullGlobalNavigation({ signedIn: false });

        const signIn = document.querySelector(selectors.signIn);
        expect(isElementVisible(signIn)).to.equal(true);
        expect(signIn.getAttribute('aria-haspopup')).to.equal('true');
        expect(signIn.getAttribute('aria-expanded')).to.equal('false');
        expect(isElementVisible(document.querySelector(selectors.signInDropdown))).to.equal(false);

        signIn.click();

        const signInDropdown = document.querySelector(selectors.signInDropdown);
        expect(signIn.getAttribute('aria-expanded')).to.equal('true');
        expect(isElementVisible(signInDropdown)).to.equal(true);
        expect(signInDropdown.querySelector('li').innerText).to.equal('Experience Cloud');
        expect(signInDropdown.querySelectorAll('li').length).to.equal(5);
      });

      it('calls ims when clicking a link with a special href', async () => {
        await createFullGlobalNavigation({ signedIn: false });
        const signIn = document.querySelector(selectors.signIn);

        signIn.click();

        const signInDropdown = document.querySelector(selectors.signInDropdown);
        const dropdownSignIn = signInDropdown.querySelector('[href="https://adobe.com?sign-in=true"]');

        window.adobeIMS = { signIn: sinon.spy() };

        dropdownSignIn.click();

        expect(window.adobeIMS.signIn.callCount).to.equal(1);

        window.adobeIMS = undefined;
      });

      it('calls ims signOut', async () => {
        await createFullGlobalNavigation();

        const signOut = document.querySelector("[daa-ll='Sign Out']");
        window.adobeIMS = { signOut: sinon.spy() };

        signOut.click();

        expect(window.adobeIMS.signOut.callCount).to.equal(1);
        window.adobeIMS = undefined;
      });
    });

    describe('smallDesktop', () => {
      it('renders the profile', async () => {
        await createFullGlobalNavigation({ viewport: 'smallDesktop' });
        expect(isElementVisible(document.querySelector(selectors.profile))).to.equal(true);
      });
    });

    describe('mobile', () => {
      it('renders the profile', async () => {
        await createFullGlobalNavigation({ });
        expect(isElementVisible(document.querySelector(selectors.profile))).to.equal(true);
      });

      it('renders the sign in button and dropdown on click', async () => {
        await createFullGlobalNavigation({ signedIn: false });

        const signIn = document.querySelector(selectors.signIn);
        expect(isElementVisible(signIn)).to.equal(true);
        expect(signIn.getAttribute('aria-haspopup')).to.equal('true');
        expect(signIn.getAttribute('aria-expanded')).to.equal('false');
        expect(isElementVisible(document.querySelector(selectors.signInDropdown))).to.equal(false);

        signIn.click();

        const signInDropdown = document.querySelector(selectors.signInDropdown);
        expect(signIn.getAttribute('aria-expanded')).to.equal('true');
        expect(isElementVisible(signInDropdown)).to.equal(true);
        expect(signInDropdown.querySelector('li').innerText).to.equal('Experience Cloud');
        expect(signInDropdown.querySelectorAll('li').length).to.equal(5);
      });

      it('calls ims when clicking the last link of the dropdown', async () => {
        await createFullGlobalNavigation({ signedIn: false });
        const signIn = document.querySelector(selectors.signIn);

        signIn.click();

        const signInDropdown = document.querySelector(selectors.signInDropdown);
        const dropdownSignIn = signInDropdown.querySelector('[href="https://adobe.com?sign-in=true"]');

        window.adobeIMS = { signIn: sinon.spy() };

        dropdownSignIn.click();

        expect(window.adobeIMS.signIn.callCount).to.equal(1);

        window.adobeIMS = undefined;
      });
    });
  });

  describe('Gnav-logo', () => {
    describe('desktop', () => {
      it('renders the logo', async () => {
        await createFullGlobalNavigation({ });

        const logo = document.querySelector(selectors.logo);
        expect(isElementVisible(logo)).to.equal(true);
        expect(logo.getAttribute('daa-ll')).to.equal('Logo');
        expect(logo.getAttribute('aria-label')).to.equal('Adobe');
      });

      it('should only render the logo', async () => {
        await createFullGlobalNavigation({ globalNavigation: logoOnlyNav });

        expect(isElementVisible(document.querySelector(selectors.logo))).to.equal(true);
        expect(isElementVisible(document.querySelector(selectors.brandContainer))).to.equal(false);
        expect(isElementVisible(document.querySelector(selectors.search))).to.equal(false);
        expect(isElementVisible(document.querySelector(selectors.profile))).to.equal(false);
        expect(document.querySelectorAll(selectors.navItem).length).to.equal(0);
      });
    });

    describe('small desktop', () => {
      it('renders the logo', async () => {
        await createFullGlobalNavigation({ viewport: 'smallDesktop' });

        const logo = document.querySelector(selectors.logo);
        expect(isElementVisible(logo)).to.equal(true);
        expect(logo.getAttribute('daa-ll')).to.equal('Logo');
        expect(logo.getAttribute('aria-label')).to.equal('Adobe');
      });
    });

    describe('mobile', () => {
      it('does not render the logo', async () => {
        await createFullGlobalNavigation({ viewport: 'mobile' });

        const logo = document.querySelector(selectors.logo);
        expect(isElementVisible(logo)).to.equal(false);
      });
    });
  });

  describe('Breadcrumbs', () => {

  });

  describe('Viewport changes', () => {
    it('should render desktop -> small desktop -> mobile', async () => {
      const nav = await createFullGlobalNavigation();

      expect(nav).to.exist;
      expect(isElementVisible(document.querySelector(selectors.globalNav))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.search))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.profile))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.logo))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.brandContainer))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.gnavToggle))).to.equal(false);
      expect(document.querySelectorAll(selectors.navItem).length).to.equal(8);

      await setViewport(viewports.smallDesktop);

      expect(isElementVisible(document.querySelector(selectors.globalNav))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.search))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.profile))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.logo))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.brandContainer))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.gnavToggle))).to.equal(false);
      expect(document.querySelectorAll(selectors.navItem).length).to.equal(8);

      await setViewport(viewports.mobile);

      expect(isElementVisible(document.querySelector(selectors.globalNav))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.search))).to.equal(false);
      expect(isElementVisible(document.querySelector(selectors.profile))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.logo))).to.equal(false);
      expect(isElementVisible(document.querySelector(selectors.brandContainer))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.gnavToggle))).to.equal(true);
      expect(document.querySelectorAll(selectors.navItem).length).to.equal(8);
    });

    it('should change the DOM order to ensure correct TAB behaviour for mobile|desktop', async () => {
      const nav = await createFullGlobalNavigation();

      expect(document.querySelector(selectors.mainNav).nextElementSibling)
        .to.equal(document.querySelector(selectors.search));
      expect(document.querySelector(selectors.topNavWrapper).lastElementChild)
        .to.equal(document.querySelector(selectors.breadCrumbsWrapper));

      await setViewport(viewports.mobile);
      nav.isDesktop.dispatchEvent(new Event('change'));

      expect(document.querySelector(selectors.mainNav).previousElementSibling)
        .to.equal(document.querySelector(selectors.search));
      expect(document.querySelector(selectors.navWrapper).firstElementChild)
        .to.equal(document.querySelector(selectors.breadCrumbsWrapper));

      await setViewport(viewports.smallDesktop);
      nav.isDesktop.dispatchEvent(new Event('change'));

      expect(document.querySelector(selectors.mainNav).nextElementSibling)
        .to.equal(document.querySelector(selectors.search));
      expect(document.querySelector(selectors.topNavWrapper).lastElementChild)
        .to.equal(document.querySelector(selectors.breadCrumbsWrapper));
    });
  });
});
