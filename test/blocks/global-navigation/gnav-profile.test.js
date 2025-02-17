/* eslint-disable no-restricted-syntax */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import {
  createFullGlobalNavigation,
  selectors,
  isElementVisible,
  unavVersion,
} from './test-utilities.js';
import globalNavigationMock from './mocks/global-navigation.plain.js';

describe('profile', () => {
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
