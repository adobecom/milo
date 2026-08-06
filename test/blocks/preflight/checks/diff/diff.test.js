import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { runChecks } from '../../../../../libs/blocks/preflight/checks/diff.js';
import { SEVERITY } from '../../../../../libs/blocks/preflight/checks/constants.js';

const URL_PREVIEW = 'https://main--milo--adobecom.aem.page/p';
const PREVIEW = '<main><div><p>hello</p><p>new line</p></div></main>';
const LIVE = '<main><div><p>hello</p></div></main>';

// ES module bindings (e.g. the default export of fetchVersions.js) can't be
// stubbed under native ESM, so fetch is stubbed and the real fetchVersions runs.
function stubFetch({ newer = true } = {}) {
  return sinon.stub(window, 'fetch').callsFake((u) => {
    const s = String(u);
    if (s.includes('admin.hlx.page')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          preview: { lastModified: newer ? 'Thu, 02 Jan 2026 00:00:00 GMT' : 'Wed, 01 Jan 2026 00:00:00 GMT' },
          live: { lastModified: 'Wed, 01 Jan 2026 00:00:00 GMT' },
        }),
      });
    }
    if (s.includes('aem.live')) return Promise.resolve({ ok: true, text: () => Promise.resolve(LIVE) });
    return Promise.resolve({ ok: true, text: () => Promise.resolve(PREVIEW) });
  });
}

describe('preflight diff check', () => {
  afterEach(() => sinon.restore());

  it('reports fail + WARNING with the added change when preview differs', async () => {
    stubFetch({ newer: true });
    const [promise] = runChecks({ area: document, url: new URL(URL_PREVIEW) });
    const res = await promise;
    expect(res.name).to.equal('Content Diff');
    expect(res.status).to.equal('fail');
    expect(res.severity).to.equal(SEVERITY.WARNING);
    expect(res.details.content.added).to.have.length(1);
  });

  it('reports pass when there are no changes (skipped)', async () => {
    stubFetch({ newer: false });
    const [promise] = runChecks({ area: document, url: new URL(URL_PREVIEW) });
    const res = await promise;
    expect(res.status).to.equal('pass');
    expect(res.details.skipped).to.equal(true);
  });

  it('reports limbo when a downstream error is thrown (e.g. parse failure)', async () => {
    stubFetch({ newer: true });
    sinon.stub(window, 'DOMParser').throws(new Error('parse boom'));
    const [promise] = runChecks({ area: document, url: new URL(URL_PREVIEW) });
    const res = await promise;
    expect(res.status).to.equal('limbo');
    expect(res.severity).to.equal(SEVERITY.WARNING);
  });

  it('resolves a bare pathname url against the current origin instead of going limbo', async () => {
    const fetchStub = stubFetch({ newer: true });
    const [promise] = runChecks({ area: document, url: '/some/path' });
    const res = await promise;
    expect(res.status).to.not.equal('limbo');
    expect(res.status).to.be.oneOf(['pass', 'fail']);
    const calls = fetchStub.getCalls().map((c) => String(c.args[0]));
    expect(calls.some((u) => u.includes('/some/path'))).to.equal(true);
  });
});
