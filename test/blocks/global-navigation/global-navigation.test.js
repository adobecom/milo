/* eslint-disable no-restricted-syntax */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { sendKeys, setViewport } from '@web/test-runner-commands';
import { createFullGlobalNavigation, selectors, isElementVisible, mockRes, viewports } from './test-utilities.js';
import { isDesktop, isTangentToViewport, setActiveLink, toFragment } from '../../../libs/blocks/global-navigation/utilities/utilities.js';
import logoOnlyNav from './mocks/global-navigation-only-logo.plain.js';
import brandOnlyNav from './mocks/global-navigation-only-brand.plain.js';
import nonSvgBrandOnlyNav from './mocks/global-navigation-only-non-svg-brand.plain.js';
import longNav from './mocks/global-navigation-long.plain.js';
import noLogoBrandOnlyNav from './mocks/global-navigation-only-brand-no-image.plain.js';
import noBrandImageOnlyNav from './mocks/global-navigation-only-brand-no-explicit-image.js';
import globalNavigationMock from './mocks/global-navigation.plain.js';
import globalNavigationActiveMock from './mocks/global-navigation-active.plain.js';
import globalNavigationWideColumnMock from './mocks/global-navigation-wide-column.plain.js';
import globalNavigationCrossCloud from './mocks/global-navigation-cross-cloud.plain.js';

const ogFetch = window.fetch;

// TODO
// - test localization

describe('global navigation', () => {
  before(() => {
    document.head.innerHTML = '<link rel="icon" href="/libs/img/favicons/favicon.ico" size="any"><script src="https://auth.services.adobe.com/imslib/imslib.min.js" type="javascript/blocked" data-loaded="true"></script>';
  });

  describe('basic sanity tests', () => {
    it('should render the navigation on desktop', async () => {
      const nav = await createFullGlobalNavigation();

      expect(nav).to.exist;
      expect(isElementVisible(document.querySelector(selectors.globalNav))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.search))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.profile))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.logo))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.brandContainer))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.mainNavToggle))).to.equal(false);
      expect(document.querySelectorAll(selectors.navItem).length).to.equal(8);
    });

    it('should render the navigation on smallDesktop', async () => {
      await createFullGlobalNavigation({ viewport: 'smallDesktop' });

      expect(isElementVisible(document.querySelector(selectors.globalNav))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.search))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.profile))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.logo))).to.equal(false);
      expect(isElementVisible(document.querySelector(selectors.brandContainer))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.mainNavToggle))).to.equal(false);
      expect(document.querySelectorAll(selectors.navItem).length).to.equal(8);
    });

    it('should render the navigation on mobile', async () => {
      await createFullGlobalNavigation({ viewport: 'mobile' });

      expect(isElementVisible(document.querySelector(selectors.globalNav))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.search))).to.equal(false);
      expect(isElementVisible(document.querySelector(selectors.profile))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.logo))).to.equal(false);
      expect(isElementVisible(document.querySelector(selectors.brandContainer))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.mainNavToggle))).to.equal(true);
      expect(document.querySelectorAll(selectors.navItem).length).to.equal(8);
    });
  });

  describe('Cross Cloud Menu', () => {
    describe('desktop', () => {
      it('should render the Cross Cloud Menu', async () => {
        await createFullGlobalNavigation({ globalNavigation: globalNavigationCrossCloud });
        const crossCloudMenu = document.querySelector(selectors.crossCloudMenuWrapper);

        expect(crossCloudMenu).to.exist;
        expect(isElementVisible(crossCloudMenu)).to.equal(false);

        document.querySelector(`${selectors.largeMenu} ${selectors.navLink}`).click();

        crossCloudMenu.querySelectorAll(selectors.navLink).forEach((el) => {
          expect(isElementVisible(el)).to.equal(true);
        });
      });

      it('should not render Cross Cloud Menu if not authored', async () => {
        await createFullGlobalNavigation();
        expect(document.querySelector(selectors.crossCloudMenuWrapper)).to.not.exist;
      });
    });

    describe('small desktop', () => {
      it('should not render the Cross Cloud Menu', async () => {
        await createFullGlobalNavigation({ globalNavigation: globalNavigationCrossCloud, viewport: 'smallDesktop' });
        document.querySelector(`${selectors.largeMenu} ${selectors.navLink}`).click();

        expect(isElementVisible(document.querySelector(selectors.crossCloudMenuWrapper)))
          .to.equal(false);
      });
    });

    describe('mobile', () => {
      it('should not render the Cross Cloud Menu', async () => {
        await createFullGlobalNavigation({ viewport: 'mobile' });
        document.querySelector(`${selectors.largeMenu} ${selectors.navLink}`).click();

        expect(isElementVisible(document.querySelector(selectors.crossCloudMenuWrapper)))
          .to.equal(false);
      });
    });
  });

  describe('Promo', () => {
    it('doesn\'t exist if metadata is not defined', async () => {
      const nav = await createFullGlobalNavigation();
      expect(nav.el.querySelector('.aside.promobar')).to.equal(null);
    });

    it('doesn\'t exist if metadata is not referencing a fragment', async () => {
      const wrongPromoMeta = toFragment`<meta name="gnav-promo-source" content="http://localhost:2000/path/to/promo">`;
      document.head.append(wrongPromoMeta);
      const nav = await createFullGlobalNavigation({ hasPromo: true });
      expect(nav.el.classList.contains('has-promo')).to.be.false;
      expect(nav.el.querySelector('.aside.promobar')).to.equal(null);
      wrongPromoMeta.remove();
    });

    it('doesn\'t exist if fragment doesn\'t contain an aside block', async () => {
      const promoMeta = toFragment`<meta name="gnav-promo-source" content="http://localhost:2000/fragments/wrong-promo-fragment">`;
      document.head.append(promoMeta);
      const nav = await createFullGlobalNavigation({ hasPromo: true });
      expect(nav.el.classList.contains('has-promo')).to.be.false;
      expect(nav.el.querySelector('.aside.promobar')).to.equal(null);
      promoMeta.remove();
    });

    it('is available if set up correctly', async () => {
      const promoMeta = toFragment`<meta name="gnav-promo-source" content="http://localhost:2000/fragments/correct-promo-fragment">`;
      document.head.append(promoMeta);
      const nav = await createFullGlobalNavigation({ hasPromo: true });
      expect(nav.el.classList.contains('has-promo')).to.be.true;
      const asideElem = nav.el.querySelector('.aside.promobar');
      expect(asideElem).to.exist;
      expect(asideElem.getAttribute('daa-lh')).to.equal('Promo');
      asideElem.querySelectorAll('a').forEach((linkElem) => {
        expect(linkElem.hasAttribute('daa-ll')).to.be.true;
      });
      promoMeta.remove();
    });

    it('doesn\'t exist on mobile', async () => {
      const promoMeta = toFragment`<meta name="gnav-promo-source" content="http://localhost:2000/fragments/correct-promo-fragment">`;
      document.head.append(promoMeta);
      const nav = await createFullGlobalNavigation({ viewport: 'mobile', hasPromo: true });
      expect(nav.el.classList.contains('has-promo')).to.be.false;
      const asideElem = nav.el.querySelector('.aside.promobar');
      expect(asideElem).to.not.exist;
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

  describe('Gnav-toggle', () => {
    describe('desktop', () => {
      it('should be hidden', async () => {
        await createFullGlobalNavigation();

        expect(isElementVisible(document.querySelector(selectors.mainNavToggle))).to.equal(false);
      });
    });

    describe('smallDesktop', () => {
      it('should be hidden', async () => {
        await createFullGlobalNavigation({ viewport: 'smallDesktop' });

        expect(isElementVisible(document.querySelector(selectors.mainNavToggle))).to.equal(false);
      });
    });

    describe('mobile', () => {
      let clock;

      beforeEach(async () => {
        clock = sinon.useFakeTimers({
          toFake: ['setTimeout'],
          shouldAdvanceTime: true,
        });
      });

      afterEach(() => {
        clock.restore();
      });

      it('should be visible', async () => {
        await createFullGlobalNavigation({ viewport: 'mobile' });

        expect(isElementVisible(document.querySelector(selectors.mainNavToggle))).to.equal(true);
      });

      it('should open navigation on click', async () => {
        await createFullGlobalNavigation({ viewport: 'mobile' });

        const navWrapper = document.querySelector(selectors.navWrapper);
        const toggle = document.querySelector(selectors.mainNavToggle);
        const curtain = document.querySelector(selectors.curtain);

        expect(navWrapper.classList.contains('feds-nav-wrapper--expanded')).to.equal(false);
        expect(curtain.classList.contains('feds-curtain--open')).to.equal(false);
        expect(isElementVisible(document.querySelector(selectors.navWrapper))).to.equal(false);

        toggle.click();
        await clock.runAllAsync();

        expect(navWrapper.classList.contains('feds-nav-wrapper--expanded')).to.equal(true);
        expect(isElementVisible(document.querySelector(selectors.navWrapper))).to.equal(true);
      });

      it('should clear search results when closed', async () => {
        await createFullGlobalNavigation({ viewport: 'mobile' });
        const toggle = document.querySelector(selectors.mainNavToggle);
        // Clicking the toggle will load the search logic
        toggle.click();
        await clock.runAllAsync();
        // Expect the search input to be visible; focus on it and type
        const searchField = document.querySelector(selectors.searchField);
        expect(isElementVisible(searchField)).to.equal(true);

        window.fetch = sinon.stub().callsFake(() => mockRes({
          payload:
          { query_prefix: 'f', locale: 'en-US', suggested_completions: [{ name: 'framemaker', score: 578.15875, scope: 'learn' }, { name: 'fuse', score: 578.15875, scope: 'learn' }, { name: 'flash player', score: 578.15875, scope: 'learn' }, { name: 'framemaker publishing server', score: 578.15875, scope: 'learn' }, { name: 'fill & sign', score: 578.15875, scope: 'learn' }, { name: 'font folio', score: 578.15875, scope: 'learn' }, { name: 'free fonts for photoshop', score: 577.25055, scope: 'learn' }, { name: 'free lightroom presets', score: 577.25055, scope: 'learn' }, { name: 'frame', score: 577.25055, scope: 'learn' }, { name: 'frame for creative cloud', score: 577.25055, scope: 'learn' }], elastic_search_time: 1440.750028 },
        }));

        searchField.focus();
        await sendKeys({ type: 'f' });
        await clock.runAllAsync();
        expect(searchField.value).to.equal('f');
        // Clicking the toggle again should clear the search field
        toggle.click();
        expect(searchField.value).to.equal('');
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
        const clock = sinon.useFakeTimers({
          toFake: ['setTimeout'],
          shouldAdvanceTime: true,
        });

        await createFullGlobalNavigation();

        const navItem = document.querySelector(selectors.navItem);
        const navLink = navItem.querySelector(selectors.navLink);
        const popup = navItem.querySelector(selectors.popup);

        expect(navLink.getAttribute('aria-expanded')).to.equal('false');
        expect(navLink.getAttribute('daa-lh')).to.equal('header|Open');
        expect(isElementVisible(popup)).to.equal(false);

        navLink.click();
        await clock.runAllAsync();

        expect(navLink.getAttribute('aria-expanded')).to.equal('true');
        expect(navItem.classList.contains('feds-dropdown--active')).to.equal(true);
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
        expect(navItem.classList.contains('feds-dropdown--active')).to.equal(true);

        navLink.click();

        expect(navLink.getAttribute('aria-expanded')).to.equal('false');
        expect(isElementVisible(popup)).to.equal(false);
        expect(navItem.classList.contains('feds-dropdown--active')).to.equal(false);
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

        document.querySelector(selectors.mainNavToggle).click();

        [...document.querySelectorAll(selectors.navItem)].forEach((el) => {
          expect(isElementVisible(el)).to.equal(true);
        });
      });
    });

    describe('sets an active item', () => {
      beforeEach(() => {
        setActiveLink(false);
      });

      it('marks simple link as active', async () => {
        const targetSelector = '#simple-link';
        const template = toFragment`<div></div>`;
        template.innerHTML = globalNavigationActiveMock;
        const templateActiveElem = template.querySelector(targetSelector);
        templateActiveElem.setAttribute('href', window.location.href);
        await createFullGlobalNavigation({ globalNavigation: template.innerHTML });
        const markupActiveElem = document.querySelector(targetSelector);
        expect(markupActiveElem.closest(selectors.activeNavItem) instanceof HTMLElement).to.be.true;
      });

      it('marks item with sync dropdown containing active link', async () => {
        const targetSelector = '#link-in-dropdown';
        const template = toFragment`<div></div>`;
        template.innerHTML = globalNavigationActiveMock;
        const templateActiveElem = template.querySelector(targetSelector);
        templateActiveElem.setAttribute('href', window.location.href);
        await createFullGlobalNavigation({ globalNavigation: template.innerHTML });
        const markupActiveElem = document.querySelector(targetSelector);
        expect(markupActiveElem.closest(selectors.activeNavItem) instanceof HTMLElement).to.be.true;
      });

      it('marks item from a nav with a single async dropdown containing active link', async () => {
        await createFullGlobalNavigation({ globalNavigation: globalNavigationActiveMock });
        const sections = document.querySelectorAll('section.feds-navItem--section');
        expect(sections.length).to.equal(1);
        expect(sections[0].matches(selectors.activeNavItem)).to.be.true;
      });

      it('marks item from a nav with multiple async dropdowns containing active link', async () => {
        const template = toFragment`<div></div>`;
        template.innerHTML = globalNavigationActiveMock;
        // Duplicate cloud menu and add it to the template
        const toDuplicate = template.querySelector('#cloud-menu-wrapper');
        const duplicated = toDuplicate.cloneNode(true);
        duplicated.id = `${duplicated.id}-duplicate`;
        const duplicatedCloudMenuElem = duplicated.querySelector('a#cloud-menu');
        duplicatedCloudMenuElem.id = `${duplicatedCloudMenuElem.id}-duplicate`;
        toDuplicate.after(duplicated);
        await createFullGlobalNavigation({ globalNavigation: template.innerHTML });
        // There should be two sections, one of which is active
        const sections = document.querySelectorAll('.feds-navItem--section');
        expect(sections.length).to.equal(2);
        const activeSections = document.querySelectorAll(`.feds-navItem--section${selectors.activeNavItem}`);
        expect(activeSections.length).to.equal(1);
        // A special class needs to be added in this case
        const activeSection = document.querySelector(selectors.activeNavItem);
        expect(activeSection.matches(selectors.deferredActiveNavItem)).to.be.true;
        // The special class should be removed is switching to mobile/tablet
        await setViewport(viewports.mobile);
        isDesktop.dispatchEvent(new Event('change'));
        expect(activeSection.matches(selectors.deferredActiveNavItem)).to.be.false;
      });

      it('marks a single item as active if multiple links match URL', async () => {
        const targetSelector1 = '#simple-link';
        const targetSelector2 = '#link-in-dropdown';
        const template = toFragment`<div></div>`;
        template.innerHTML = globalNavigationActiveMock;
        const templateActiveElem1 = template.querySelector(targetSelector1);
        templateActiveElem1.setAttribute('href', window.location.href);
        const templateActiveElem2 = template.querySelector(targetSelector2);
        templateActiveElem2.setAttribute('href', window.location.href);
        await createFullGlobalNavigation({ globalNavigation: template.innerHTML });
        const activeSections = document.querySelectorAll('section.feds-navItem--section');
        expect(activeSections.length).to.equal(1);
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

        const hasLinkgroupModifier = document.querySelector(`${selectors.navLink}--blue`) instanceof HTMLElement;
        expect(hasLinkgroupModifier).to.equal(true);
      });

      it('should render popups with wide columns', async () => {
        await createFullGlobalNavigation({ globalNavigation: globalNavigationWideColumnMock });
        expect(document.querySelector('.feds-navItem--section .feds-menu-column--group .feds-menu-column + .feds-menu-column')).to.exist;
        expect(document.querySelector('.column-break')).to.not.exist;
      });

      it('should render the promo', async () => {
        await createFullGlobalNavigation();

        document.querySelector(selectors.mainNavToggle).click();
        document.querySelector(selectors.navLink).click();

        expect(isElementVisible(document.querySelector(selectors.promoImage))).to.equal(true);
      });

      it('should allow CTAs in Promo boxes', async () => {
        await createFullGlobalNavigation();
        expect(document.querySelector(`${selectors.promo}${selectors.promo}--dark ${selectors.cta}`)).to.exist;
      });

      it('should render promo elements in initial order', async () => {
        // Initial template order is text, then image
        await createFullGlobalNavigation();

        const imgAfterTxt = document.querySelector('.feds-promo-content + .feds-promo-image');
        expect(imgAfterTxt).to.exist;

        // Switch original order to be image, then text
        const template = toFragment`<div></div>`;
        template.innerHTML = globalNavigationMock;
        const templatePromo = template.querySelector('.gnav-promo');
        const templatePromoContent = templatePromo.firstElementChild;
        templatePromoContent.remove();
        templatePromo.append(templatePromoContent);
        await createFullGlobalNavigation({ globalNavigation: template.innerHTML });

        const txtAfterImg = document.querySelector('.feds-promo-image + .feds-promo-content');
        expect(txtAfterImg).to.exist;
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

        const hasLinkgroupModifier = document.querySelector(`${selectors.navLink}--blue`) instanceof HTMLElement;
        expect(hasLinkgroupModifier).to.equal(true);
      });

      it('should render the promo', async () => {
        await createFullGlobalNavigation({ viewport: 'smallDesktop' });

        document.querySelector(selectors.mainNavToggle).click();
        document.querySelector(selectors.navLink).click();

        expect(isElementVisible(document.querySelector(selectors.promoImage))).to.equal(true);
      });
    });

    describe('mobile', () => {
      let clock;

      beforeEach(async () => {
        clock = sinon.useFakeTimers({
          toFake: ['setTimeout'],
          shouldAdvanceTime: true,
        });
      });

      afterEach(() => {
        clock.restore();
      });

      it('should open a popup and headline on click', async () => {
        await createFullGlobalNavigation({ viewport: 'mobile' });

        document.querySelector(selectors.mainNavToggle).click();

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
        await clock.runAllAsync();

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

        document.querySelector(selectors.mainNavToggle).click();
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
        const dropdownSignIn = signInDropdown.querySelector(selectors.imsSignIn);

        window.adobeIMS = { signIn: sinon.spy() };

        dropdownSignIn.click();

        expect(window.adobeIMS.signIn.callCount).to.equal(1);

        window.adobeIMS = undefined;
      });

      it('calls ims when clicking a link with a special href, ensuring it only verifies the end of the string', async () => {
        const mockWithNewSignInHref = globalNavigationMock.replace('https://adobe.com?sign-in=true', 'i-messed-this-up/?sign-in=true');
        await createFullGlobalNavigation({
          signedIn: false,
          globalNavigation: mockWithNewSignInHref,
        });
        const signIn = document.querySelector(selectors.signIn);

        signIn.click();

        const signInDropdown = document.querySelector(selectors.signInDropdown);
        const dropdownSignIn = signInDropdown.querySelector(selectors.imsSignIn);

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
        const dropdownSignIn = signInDropdown.querySelector(selectors.imsSignIn);

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
      it('hides the logo', async () => {
        await createFullGlobalNavigation({ viewport: 'smallDesktop' });

        const logo = document.querySelector(selectors.logo);
        expect(isElementVisible(logo)).to.equal(false);
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

  describe('Viewport changes', () => {
    it('should render desktop -> small desktop -> mobile', async () => {
      const nav = await createFullGlobalNavigation();

      expect(nav).to.exist;
      expect(isElementVisible(document.querySelector(selectors.globalNav))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.search))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.profile))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.logo))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.brandContainer))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.mainNavToggle))).to.equal(false);
      expect(document.querySelectorAll(selectors.navItem).length).to.equal(8);
      expect([...document.querySelectorAll(selectors.headline)]
        .every((elem) => elem.getAttribute('daa-ll') === null))
        .to.be.true;

      await setViewport(viewports.smallDesktop);
      isDesktop.dispatchEvent(new Event('change'));

      expect(isElementVisible(document.querySelector(selectors.globalNav))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.search))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.profile))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.logo))).to.equal(false);
      expect(isElementVisible(document.querySelector(selectors.brandContainer))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.mainNavToggle))).to.equal(false);
      expect(document.querySelectorAll(selectors.navItem).length).to.equal(8);
      expect([...document.querySelectorAll(selectors.headline)]
        .every((elem) => elem.getAttribute('daa-ll') === null))
        .to.be.true;

      await setViewport(viewports.mobile);
      isDesktop.dispatchEvent(new Event('change'));

      expect(isElementVisible(document.querySelector(selectors.globalNav))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.search))).to.equal(false);
      expect(isElementVisible(document.querySelector(selectors.profile))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.logo))).to.equal(false);
      expect(isElementVisible(document.querySelector(selectors.brandContainer))).to.equal(true);
      expect(isElementVisible(document.querySelector(selectors.mainNavToggle))).to.equal(true);
      expect(document.querySelectorAll(selectors.navItem).length).to.equal(8);
      expect([...document.querySelectorAll(selectors.headline)]
        .every((elem) => elem.getAttribute('daa-ll') !== null))
        .to.be.true;
    });

    it('should change the DOM order to ensure correct TAB behavior for mobile|desktop', async () => {
      await createFullGlobalNavigation();

      expect(document.querySelector(selectors.mainNav).nextElementSibling)
        .to.equal(document.querySelector(selectors.search));
      expect(document.querySelector(selectors.topNavWrapper).lastElementChild)
        .to.equal(document.querySelector(selectors.breadcrumbsWrapper));

      await setViewport(viewports.mobile);
      isDesktop.dispatchEvent(new Event('change'));

      expect(document.querySelector(selectors.mainNav).previousElementSibling)
        .to.equal(document.querySelector(selectors.search));
      expect(document.querySelector(selectors.navWrapper).firstElementChild)
        .to.equal(document.querySelector(selectors.breadcrumbsWrapper));

      await setViewport(viewports.smallDesktop);
      isDesktop.dispatchEvent(new Event('change'));

      expect(document.querySelector(selectors.mainNav).nextElementSibling)
        .to.equal(document.querySelector(selectors.search));
      expect(document.querySelector(selectors.topNavWrapper).lastElementChild)
        .to.equal(document.querySelector(selectors.breadcrumbsWrapper));
    });

    it('should add a modifier class when nav content overflows', async () => {
      const getOverflowingTopnav = () => document.querySelector(selectors.overflowingTopNav);

      await createFullGlobalNavigation();
      expect(getOverflowingTopnav()).to.equal(null);

      await createFullGlobalNavigation({ globalNavigation: longNav });
      expect(getOverflowingTopnav() instanceof HTMLElement).to.be.true;

      await setViewport(viewports.wide);
      isTangentToViewport.dispatchEvent(new Event('change'));

      expect(getOverflowingTopnav()).to.equal(null);

      await setViewport(viewports.smallDesktop);
      isTangentToViewport.dispatchEvent(new Event('change'));

      expect(getOverflowingTopnav() instanceof HTMLElement).to.be.true;

      await setViewport(viewports.mobile);
      isTangentToViewport.dispatchEvent(new Event('change'));

      expect(getOverflowingTopnav()).to.equal(null);
    });
  });
});
