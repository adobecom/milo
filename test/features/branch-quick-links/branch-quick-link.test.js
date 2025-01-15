import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import processQL from '../../../libs/features/branch-quick-links/branch-quick-links.js';

describe('branch quick links', async () => {
  window.adobePrivacy = {
    hasUserProvidedConsent: () => true,
    activeCookieGroups: () => ['C0002', 'C0004'],
  };
  window.alloy = () => {};
  const alloyStub = sinon.stub(window, 'alloy').callsFake((command) => {
    if (command === 'getIdentity') {
      return Promise.resolve({ identity: { ECID: 'test-ecid' } });
    }
    return 'test-ecid';
  });
  document.head.innerHTML = await readFile({ path: './mocks/head.html' });
  document.body.innerHTML = await readFile({ path: './mocks/body.html' });
  const qL = document.querySelector('a');
  processQL(qL);
  qL.click();
  window.dispatchEvent(new CustomEvent('adobePrivacy:PrivacyConsent'));
  window.dispatchEvent(new CustomEvent('adobePrivacy:PrivacyCustom'));
  window.dispatchEvent(new CustomEvent('adobePrivacy:PrivacyReject'));
  expect(qL.classList.contains('quick-link')).to.be.true;
  expect(qL.href.includes('ecid')).to.be.true;
  alloyStub.restore();
});
