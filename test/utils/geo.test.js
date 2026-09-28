import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { getAkamaiCode } = await import('../../libs/utils/geo.js');

describe('getAkamaiCode (geo.js)', () => {
  let fetchStub;

  beforeEach(() => {
    fetchStub = sinon.stub(window, 'fetch');
    sessionStorage.removeItem('akamai');
  });

  afterEach(() => {
    sinon.restore();
    sessionStorage.removeItem('akamai');
  });

  const okRes = (country) => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ country }),
  });

  it('resolves the lowercased country code and caches it in sessionStorage', async () => {
    fetchStub.returns(okRes('US'));
    const code = await getAkamaiCode();
    expect(code).to.equal('us');
    expect(sessionStorage.getItem('akamai')).to.equal('us');
    expect(fetchStub.calledOnceWith('https://geo2.adobe.com/json/')).to.be.true;
  });

  it('deduplicates concurrent callers into a single in-flight fetch', async () => {
    let resolveFetch;
    fetchStub.returns(new Promise((res) => { resolveFetch = res; }));
    const p1 = getAkamaiCode();
    const p2 = getAkamaiCode();
    // Both callers share the same in-flight promise; only one fetch is issued.
    expect(p1).to.equal(p2);
    expect(fetchStub.callCount).to.equal(1);
    resolveFetch({ ok: true, json: () => Promise.resolve({ country: 'DE' }) });
    const [c1, c2] = await Promise.all([p1, p2]);
    expect(c1).to.equal('de');
    expect(c2).to.equal('de');
  });

  it('re-fetches after a failed call instead of memoizing the failure', async () => {
    fetchStub.onCall(0).returns(Promise.reject(new Error('network down')));
    fetchStub.onCall(1).returns(okRes('FR'));

    let firstErr;
    try { await getAkamaiCode(); } catch (e) { firstErr = e; }
    expect(firstErr).to.be.an('error');

    // The in-flight handle is cleared in finally(), so the next call re-fetches.
    const code = await getAkamaiCode();
    expect(code).to.equal('fr');
    expect(fetchStub.callCount).to.equal(2);
  });

  it('rejects when the response is not ok', async () => {
    fetchStub.returns(Promise.resolve({ ok: false, statusText: 'Service Unavailable' }));
    let err;
    try { await getAkamaiCode(); } catch (e) { err = e; }
    expect(err).to.be.an('error');
    expect(err.message).to.include('akamai Code');
  });

  it('aborts after the 5s timeout and rejects', async () => {
    const clock = sinon.useFakeTimers();
    fetchStub.callsFake((url, opts) => new Promise((_, reject) => {
      opts.signal.addEventListener('abort', () => {
        reject(new DOMException('The operation was aborted.', 'AbortError'));
      });
    }));
    const p = getAkamaiCode();
    clock.tick(5000);
    let err;
    try { await p; } catch (e) { err = e; }
    expect(err).to.be.an('error');
    clock.restore();
  });
});
