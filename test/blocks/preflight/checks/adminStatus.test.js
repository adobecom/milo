import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { getAdminUrl, getPageStatus } from '../../../../libs/blocks/preflight/checks/adminStatus.js';

describe('preflight adminStatus getAdminUrl', () => {
  it('resolves localhost to main--milo--adobecom', () => {
    const url = getAdminUrl(new URL('http://localhost:6456/x'), 'status');
    expect(url).to.equal('https://admin.hlx.page/status/adobecom/milo/main/x?editUrl=auto');
  });

  it('resolves a real aem.page URL', () => {
    const url = getAdminUrl(new URL('https://main--milo--adobecom.aem.page/a/b'), 'status');
    expect(url).to.equal('https://admin.hlx.page/status/adobecom/milo/main/a/b?editUrl=auto');
  });

  it('uses the cross-repo owner/repo/branch for /federal/ paths', () => {
    const url = getAdminUrl(new URL('https://main--milo--adobecom.aem.page/federal/x'), 'status');
    expect(url).to.equal('https://admin.hlx.page/status/adobecom/federal/main/federal/x?editUrl=auto');
  });
});

describe('preflight adminStatus getPageStatus', () => {
  afterEach(() => sinon.restore());

  it('sends the Sidekick login cookie, since protected sites reject anonymous calls', async () => {
    const fetchStub = sinon.stub(window, 'fetch').resolves({
      ok: true,
      json: async () => ({ preview: { lastModified: 'a' }, live: {} }),
    });
    const status = await getPageStatus(new URL('https://main--cc--adobecom.aem.page/x'));
    expect(fetchStub.firstCall.args[1]).to.deep.equal({ cache: 'no-store', credentials: 'include' });
    expect(status.live.lastModified).to.be.null;
  });
});
