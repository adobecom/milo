import { expect } from '@esm-bundle/chai';
import sinon, { stub } from 'sinon';
import pepPromptContent from './mocks/pep-prompt-content.js';

describe('PEP', () => {
  let clock;
  let allSelectors;
  let defaultConfig;
  let mockRes;
  let initPep;

  beforeEach(async () => {
    clock = sinon.useFakeTimers({
      toFake: ['setTimeout'],
      shouldAdvanceTime: true,
    });
    // We need to import the utilities after mocking setTimeout to ensure
    // their setTimeout calls use Sinon's mocked implementation.
    // Importing before mocking would lead to a 5s PEP timeout, exceeding the 2s test limit.
    const { allSelectors: importedAllSelectors, defaultConfig: importedDefaultConfig, mockRes: importedMockRes } = await import('./test-utilities.js');
    allSelectors = importedAllSelectors;
    defaultConfig = importedDefaultConfig;
    mockRes = importedMockRes;
    initPep = (await import('./test-utilities.js')).initPep;
    document.body.innerHTML = `<div class="${allSelectors.fedsUtilities.replace('.', '')}" style="position:relative">
    <div id="${allSelectors.appSwitcher.replace('#', '')}" tabindex="0">App Switcher</div>
    </div>`;
    stub(window, 'fetch').callsFake(async (url) => {
      if (url.includes('pep-prompt-content.plain.html')) return mockRes({ payload: pepPromptContent({ ...defaultConfig }) });
      return null;
    });
  });

  afterEach(() => {
    sinon.restore();
    clock.restore();
    document.body.innerHTML = '';
    document.cookie = `${document.cookie};expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  });

  describe('PEP rendering tests', () => {
    it('should render PEP', async () => {
      await initPep({});
      await clock.runAllAsync();
      expect(document.querySelector(allSelectors.pepWrapper)).to.exist;
    });

    it('should not render PEP when previously dismissed', async () => {
      document.cookie = 'dismissedAppPrompts=["pep-prompt-content.plain.html"]';
      await initPep({});
      await clock.runAllAsync();
      expect(document.querySelector(allSelectors.pepWrapper)).to.not.exist;
    });

    it('should not render PEP when the entitlement does not match', async () => {
      await initPep({ entName: 'not-matching-entitlement' });
      await clock.runAllAsync();
      expect(document.querySelector(allSelectors.pepWrapper)).to.not.exist;
    });

    it('should not render PEP when there is no prompt content', async () => {
      sinon.restore();
      stub(window, 'fetch').callsFake(async (url) => {
        if (url.includes('pep-prompt-content.plain.html')) {
          return mockRes({
            payload: null,
            ok: false,
            status: 400,
          });
        }
        return null;
      });
      await initPep({});
      await clock.runAllAsync();
      expect(document.querySelector(allSelectors.pepWrapper)).to.not.exist;
    });

    it('should not render PEP when the redirect url or product name are not provided', async () => {
      sinon.restore();
      stub(window, 'fetch').callsFake(async (url) => {
        if (url.includes('pep-prompt-content.plain.html')) return mockRes({ payload: pepPromptContent({ ...defaultConfig, redirectUrl: false, productName: false }) });
        return null;
      });
      await initPep({});
      await clock.runAllAsync();
      expect(document.querySelector(allSelectors.pepWrapper)).to.not.exist;
    });

    it('should not render PEP when the anchor element is open', async () => {
      await initPep({ isAnchorOpen: true });
      await clock.runAllAsync();
      expect(document.querySelector(allSelectors.pepWrapper)).to.not.exist;
    });
  });

  describe('PEP configuration tests', () => {
    it('should use config values when metadata loader color or duration are not provided', async () => {
      sinon.restore();
      stub(window, 'fetch').callsFake(async (url) => {
        if (url.includes('pep-prompt-content.plain.html')) return mockRes({ payload: pepPromptContent({ ...defaultConfig, color: false, loaderDuration: false }) });
        return null;
      });
      const pep = await initPep({});
      await clock.runAllAsync();
      const { 'loader-color': pepColor, 'loader-duration': pepDuration } = pep.options;
      expect(!!pepColor && !!pepDuration).to.equal(true);
    });
  });

  describe('PEP interaction tests', () => {
    it('should close PEP on Escape key', async () => {
      await initPep({});
      await clock.runAllAsync();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(document.querySelector(allSelectors.pepWrapper)).to.not.exist;
    });

    it('should close PEP on clicking the close icon', async () => {
      await initPep({});
      await clock.runAllAsync();
      document.querySelector(allSelectors.closeIcon).click();
      expect(document.querySelector(allSelectors.pepWrapper)).to.not.exist;
    });

    it('should close PEP on clicking the CTA', async () => {
      await initPep({});
      await clock.runAllAsync();
      document.querySelector(allSelectors.cta).click();
      expect(document.querySelector(allSelectors.pepWrapper)).to.not.exist;
    });

    it('should close PEP on clicking the anchor element', async () => {
      await initPep({});
      await clock.runAllAsync();
      document.querySelector(allSelectors.appSwitcher).click();
      expect(document.querySelector(allSelectors.pepWrapper)).to.not.exist;
    });
  });

  describe('PEP focus tests', () => {
    it('should focus on the close icon on initial render', async () => {
      await initPep({});
      await clock.runAllAsync();
      expect(document.activeElement).to.equal(document.querySelector(allSelectors.closeIcon));
    });

    it('should focus on the anchor element after closing', async () => {
      await initPep({});
      await clock.runAllAsync();
      document.querySelector(allSelectors.closeIcon).click();
      expect(document.activeElement).to.equal(document.querySelector(allSelectors.appSwitcher));
    });
  });
});
