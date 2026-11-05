import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { getAdminUrl, getPageStatus, clearPageStatusCache } from '../../../../libs/blocks/preflight/checks/adminStatus.js';

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
  const ok = { ok: true, json: async () => ({ preview: { lastModified: 'a' }, live: {} }) };
  const page = (path) => new URL(`https://main--cc--adobecom.aem.page${path}`);

  afterEach(() => {
    sinon.restore();
    clearPageStatusCache();
  });

  it('asks the Admin API once per URL until the cache is cleared', async () => {
    const fetchStub = sinon.stub(window, 'fetch').resolves(ok);
    await Promise.all([getPageStatus(page('/a')), getPageStatus(page('/a'))]);
    await getPageStatus(page('/a'));
    expect(fetchStub.callCount).to.equal(1);
    clearPageStatusCache();
    await getPageStatus(page('/a'));
    expect(fetchStub.callCount).to.equal(2);
  });

  it('does not cache a failed call, so a 401 or 429 is retried', async () => {
    const fetchStub = sinon.stub(window, 'fetch');
    fetchStub.onFirstCall().resolves({ ok: false, status: 429 });
    fetchStub.onSecondCall().resolves(ok);
    expect(await getPageStatus(page('/b'))).to.be.null;
    expect(await getPageStatus(page('/b'))).to.not.be.null;
  });

  it('runs at most three Admin API calls at a time', async () => {
    let inFlight = 0;
    let peak = 0;
    sinon.stub(window, 'fetch').callsFake(async () => {
      inFlight += 1;
      peak = Math.max(peak, inFlight);
      await new Promise((resolve) => { setTimeout(resolve, 5); });
      inFlight -= 1;
      return ok;
    });
    await Promise.all(['/1', '/2', '/3', '/4', '/5', '/6', '/7'].map((p) => getPageStatus(page(p))));
    expect(peak).to.equal(3);
  });

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
