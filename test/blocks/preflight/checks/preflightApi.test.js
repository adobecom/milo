import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../../libs/utils/utils.js';
import preflightApi, { getChecksSuite, getPreflightResults } from '../../../../libs/blocks/preflight/checks/preflightApi.js';

describe('preflight checks preflightApi', () => {
  afterEach(() => sinon.restore());

  it('exposes a check suite namespace for each preflight tab', () => {
    expect(preflightApi).to.have.all.keys('accessibility', 'assets', 'performance', 'seo', 'structure', 'merch');
    expect(preflightApi.seo.checkH1s).to.be.a('function');
    expect(preflightApi.performance.runChecks).to.be.a('function');
    expect(preflightApi.assets.isViewportTooSmall).to.be.a('function');
  });

  it('resolves the ASO suite when the client is enabled (memoized)', async () => {
    setConfig({ imsClientId: 'enabled-client' });
    sinon.stub(window, 'fetch').resolves({ json: () => Promise.resolve({ data: [{ value: 'enabled-client' }] }) });
    expect(await getChecksSuite()).to.equal('ASO');
    // second call is served from the module cache without another fetch
    expect(await getChecksSuite()).to.equal('ASO');
  });

  it('returns null for URLs matched by the exclusion list', async () => {
    sinon.stub(window, 'fetch').callsFake((url) => {
      if (String(url).includes('preflight-exclusions')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [{ path: '/drafts/**' }] }) });
      }
      return Promise.reject(new Error(`unexpected fetch ${url}`));
    });
    const res = await getPreflightResults({ url: '/drafts/wip-page', useCache: false });
    expect(res).to.be.null;
  });
});
