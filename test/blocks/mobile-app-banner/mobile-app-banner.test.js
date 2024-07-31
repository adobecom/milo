import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { delay } from '../../helpers/waitfor.js';

const { setConfig } = await import('../../../libs/utils/utils.js');

const mockConfig = { contentRoot: '/test/blocks/mobile-app-banner/mocks' };
setConfig(mockConfig);

describe('mobile-app-banner', () => {
  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should not call branch init if no branch-io-key.json', async () => {
    sinon.stub(window, 'fetch');
    const res = new window.Response('Not found', { status: 404 });
    window.fetch.returns(Promise.resolve(res));

    const module = await import('../../../libs/blocks/mobile-app-banner/mobile-app-banner.js');
    const banner = document.body.querySelector('.mobile-app-banner.product-test');
    await module.default(banner);
    window.dispatchEvent(new CustomEvent('adobePrivacy:PrivacyConsent'));
    await delay(0);

    const scriptTags = document.querySelectorAll('head > script');
    const scriptSrcs = [];
    scriptTags.forEach((scriptTag) => {
      scriptSrcs.push(scriptTag.getAttribute('src'));
    });
    expect(scriptSrcs).to.not.include('https://cdn.branch.io/branch-latest.min.js');
  });

  it('should not call branch init if product not found in branch-io-key file', async () => {
    const module = await import('../../../libs/blocks/mobile-app-banner/mobile-app-banner.js');
    const banner = document.body.querySelector('.mobile-app-banner.product-test1');
    await module.default(banner);
    window.dispatchEvent(new CustomEvent('adobePrivacy:PrivacyConsent'));
    await delay(0);

    const scriptTags = document.querySelectorAll('head > script');
    const scriptSrcs = [];
    scriptTags.forEach((scriptTag) => {
      if (scriptTag.getAttribute('src') !== null) scriptSrcs.push(scriptTag.getAttribute('src'));
    });
    expect(scriptSrcs).to.not.include('https://cdn.branch.io/branch-latest.min.js');
  });

  it('should init by adding branchio script', async () => {
    window.adobePrivacy = { hasUserProvidedConsent: () => true };
    const module = await import('../../../libs/blocks/mobile-app-banner/mobile-app-banner.js');
    const banner = document.body.querySelector('.mobile-app-banner.product-test');
    await module.default(banner);
    window.dispatchEvent(new CustomEvent('adobePrivacy:PrivacyConsent'));
    await delay(0);
    const scriptTags = document.querySelectorAll('head > script');
    const scriptSrcs = [];
    scriptTags.forEach((scriptTag) => {
      if (scriptTag.getAttribute('src') !== null) scriptSrcs.push(scriptTag.getAttribute('src'));
    });
    expect(scriptSrcs).to.include('https://cdn.branch.io/branch-latest.min.js');
  });
});
