import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../../libs/utils/utils.js';
import captureMetrics from '../../../../libs/blocks/preflight/checks/captureMetrics.js';

const baseResults = () => ({
  performance: [Promise.resolve({ id: 'lcp-element', status: 'pass' })],
  seo: [Promise.resolve({ checkId: 'title-size', status: 'pass' })],
  accessibility: [Promise.resolve({ details: { issuesCount: 3, violations: [{ id: 'x' }] } })],
});

const lastBody = (fetchStub) => JSON.parse(fetchStub.firstCall.args[1].body);

describe('preflight checks captureMetrics', () => {
  let fetchStub;
  let imsBackup;

  beforeEach(() => {
    window.hasCapturedPreflightMetrics = false;
    imsBackup = window.adobeIMS;
    fetchStub = sinon.stub(window, 'fetch').resolves({ ok: true, status: 200, statusText: 'OK' });
    setConfig({ imsClientId: 'test-client' });
  });

  afterEach(() => {
    sinon.restore();
    window.adobeIMS = imsBackup;
    delete window.hasCapturedPreflightMetrics;
  });

  it('does nothing when imsClientId is not configured', async () => {
    setConfig({});
    await captureMetrics(baseResults());
    expect(fetchStub.called).to.be.false;
  });

  it('posts transformed metrics with column keys and context data', async () => {
    await captureMetrics(baseResults());
    expect(fetchStub.calledOnce).to.be.true;
    const [url, opts] = fetchStub.firstCall.args;
    expect(url).to.contain('clientId=test-client');
    expect(opts.method).to.equal('POST');
    const body = lastBody(fetchStub);
    expect(body.performance[0].key).to.equal('performance_valid_lcp');
    expect(body.seo[0].key).to.equal('seo_title_size_status');
    expect(body.accessibility_issues_count).to.equal(3);
    expect(body.project_key).to.equal('test-client');
    expect(opts.headers).to.not.have.property('authorization');
  });

  it('includes a bearer token and profile email when IMS is signed in', async () => {
    window.adobeIMS = {
      getAccessToken: () => ({ token: 'tok-123' }),
      getProfile: async () => ({ email: 'author@adobe.com' }),
    };
    await captureMetrics(baseResults());
    const [, opts] = fetchStub.firstCall.args;
    expect(opts.headers.authorization).to.equal('Bearer tok-123');
    expect(lastBody(fetchStub).email).to.equal('author@adobe.com');
  });

  it('continues without profile data when getProfile fails', async () => {
    const lanaBackup = window.lana;
    window.lana = { log: sinon.spy() };
    window.adobeIMS = {
      getAccessToken: () => ({ token: 'tok-123' }),
      getProfile: async () => { throw new Error('ims down'); },
    };
    await captureMetrics(baseResults());
    expect(fetchStub.calledOnce).to.be.true;
    expect(lastBody(fetchStub).email).to.equal('');
    expect(window.lana.log.called).to.be.true;
    window.lana = lanaBackup;
  });

  it('captures only once (guard flag)', async () => {
    await captureMetrics(baseResults());
    await captureMetrics(baseResults());
    expect(fetchStub.calledOnce).to.be.true;
  });
});
