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

  it('does not cache a failed call, so a 401 is retried next time', async () => {
    const fetchStub = sinon.stub(window, 'fetch');
    fetchStub.onFirstCall().resolves({ ok: false, status: 401 });
    fetchStub.onSecondCall().resolves(ok);
    expect(await getPageStatus(page('/b'))).to.be.null;
    expect(await getPageStatus(page('/b'))).to.not.be.null;
  });

  it('retries a rate-limited (429) call once after Retry-After', async () => {
    const rateLimited = { ok: false, status: 429, headers: new Headers({ 'retry-after': '0' }) };
    const fetchStub = sinon.stub(window, 'fetch');
    fetchStub.onFirstCall().resolves(rateLimited);
    fetchStub.onSecondCall().resolves(ok);
    expect(await getPageStatus(page('/429-once'))).to.not.be.null;
    fetchStub.reset();
    fetchStub.resolves(rateLimited);
    expect(await getPageStatus(page('/429-twice'))).to.be.null;
    expect(fetchStub.callCount).to.equal(2);
  });

  it('does not cache a network error either', async () => {
    const fetchStub = sinon.stub(window, 'fetch');
    fetchStub.onFirstCall().rejects(new Error('offline'));
    fetchStub.onSecondCall().resolves(ok);
    let error;
    await getPageStatus(page('/c')).catch((e) => { error = e; });
    expect(error?.message).to.equal('offline');
    expect(await getPageStatus(page('/c'))).to.not.be.null;
  });

  it('keeps a newer cached call when an older one fails after the cache was cleared', async () => {
    let failOldCall;
    const fetchStub = sinon.stub(window, 'fetch');
    fetchStub.onFirstCall().returns(new Promise((resolve) => { failOldCall = resolve; }));
    fetchStub.onSecondCall().resolves(ok);
    const oldCall = getPageStatus(page('/d'));
    await new Promise((resolve) => { setTimeout(resolve, 200); });
    clearPageStatusCache();
    await getPageStatus(page('/d'));
    failOldCall({ ok: false, status: 500 });
    await oldCall;
    await getPageStatus(page('/d'));
    expect(fetchStub.callCount).to.equal(2);
  });

  it('starts Admin API calls at most 8 per second, however fast they answer', async () => {
    const startedAt = [];
    sinon.stub(window, 'fetch').callsFake(async () => {
      startedAt.push(Date.now());
      return ok;
    });
    await Promise.all(['/1', '/2', '/3', '/4'].map((p) => getPageStatus(page(p))));
    const gaps = startedAt.slice(1).map((time, i) => time - startedAt[i]);
    gaps.forEach((gap) => expect(gap).to.be.at.least(120));
  });

  it('sends the Sidekick login cookie, since protected sites reject anonymous calls', async () => {
    const fetchStub = sinon.stub(window, 'fetch').resolves(ok);
    const status = await getPageStatus(new URL('https://main--cc--adobecom.aem.page/x'));
    expect(fetchStub.firstCall.args[1]).to.deep.equal({ cache: 'no-store', credentials: 'include' });
    expect(status.live.lastModified).to.be.null;
  });
});
