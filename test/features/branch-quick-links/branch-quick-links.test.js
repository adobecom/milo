import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import processQuickLink from '../../../libs/features/branch-quick-links/branch-quick-links.js';

window.lana = { log: sinon.stub() };

describe('branch quick links', () => {
  beforeEach(async () => {
    window.adobePrivacy = {
      hasUserProvidedConsent: () => true,
      activeCookieGroups: () => ['C0002', 'C0004'],
    };
    document.head.innerHTML = await readFile({ path: '../../../test/utils/mocks/head.html' });
    document.body.innerHTML = await readFile({ path: '../../../test/utils/mocks/body.html' });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should add a class to the quick link', async () => {
    window.alloy = () => Promise.resolve({ identity: { ECID: '123' } });
    const quickLink = document.querySelector('a[href*="app.link"]');
    processQuickLink(quickLink);
    quickLink.href = '#';
    await quickLink.click();
    window.dispatchEvent(new CustomEvent('adobePrivacy:PrivacyConsent'));
    window.dispatchEvent(new CustomEvent('adobePrivacy:PrivacyCustom'));
    window.dispatchEvent(new CustomEvent('adobePrivacy:PrivacyReject'));
    expect(quickLink.classList.contains('quick-link')).to.be.true;
  });

  it('should throw an error while fetching ecid', async () => {
    window.alloy = () => Promise.reject(new Error('Error fetching ECID'));
    const quickLink = document.querySelector('a[href*="app.link"]');
    processQuickLink(quickLink);
    quickLink.href = '#';
    await quickLink.click();
  });

  describe('case: alloy is undefined', async () => {
    it('should not add ecid if alloy is undefined', async () => {
      window.alloy = undefined;
      const quickLink = document.querySelector('a');
      processQuickLink(quickLink);
      await quickLink.click();
      expect(quickLink.href.includes('ecid')).to.be.false;
    });
  });
});
