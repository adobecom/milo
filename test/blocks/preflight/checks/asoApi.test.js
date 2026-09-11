import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import getChecks, { asoCache, getASOToken, fetchPreflightChecks } from '../../../../libs/blocks/preflight/checks/asoApi.js';

const COMPLETED_AUDITS = [
  { name: 'metatags', opportunities: [{ tagName: 'title', issue: 'Missing title', issueDetails: 'add one', aiSuggestion: 'My Title' }] },
  { name: 'h1-count', opportunities: [{ issue: 'Multiple H1s' }] },
  { name: 'canonical', opportunities: [] },
  { name: 'body-size', opportunities: [] },
  { name: 'lorem-ipsum', opportunities: [] },
  { name: 'links', opportunities: [{ check: 'bad-links', issue: [{ url: '/broken', issue: '404' }] }] },
];

const resetCache = () => Object.assign(asoCache, {
  identify: null,
  identifyFinished: false,
  suggest: null,
  suggestFinished: false,
  sessionToken: null,
  identifyJobId: undefined,
});

describe('preflight checks asoApi', () => {
  let lanaBackup;
  let imsBackup;
  let responses;

  const router = (url, opts = {}) => {
    const u = String(url);
    if (u.endsWith('/auth/login')) return responses.login();
    if (/\/preflight\/jobs\/[^/]+$/.test(u)) return responses.jobStatus();
    if (u.endsWith('/preflight/jobs') && opts.method === 'POST') return responses.jobCreate();
    return Promise.reject(new Error(`unexpected fetch ${u}`));
  };

  beforeEach(() => {
    lanaBackup = window.lana;
    imsBackup = window.asoIMS;
    window.lana = { log: sinon.spy() };
    resetCache();
    responses = {
      login: () => Promise.resolve({ ok: true, json: () => Promise.resolve({ sessionToken: 'sess-1' }) }),
      jobCreate: () => Promise.resolve({ ok: true, json: () => Promise.resolve({ jobId: 'job-1' }) }),
      jobStatus: () => Promise.resolve({ ok: true, json: () => Promise.resolve({ status: 'COMPLETED', result: [{ audits: COMPLETED_AUDITS }] }) }),
    };
    sinon.stub(window, 'fetch').callsFake(router);
  });

  afterEach(() => {
    sinon.restore();
    window.lana = lanaBackup;
    window.asoIMS = imsBackup;
    resetCache();
  });

  describe('getASOToken', () => {
    it('returns null when there is no IMS access token', async () => {
      window.asoIMS = { getAccessToken: () => null };
      expect(await getASOToken()).to.be.null;
    });

    it('exchanges the IMS token for a session token', async () => {
      window.asoIMS = { getAccessToken: () => ({ token: 'ims-tok' }) };
      const token = await getASOToken();
      expect(token).to.equal('sess-1');
      expect(asoCache.sessionToken).to.equal('sess-1');
    });

    it('returns null and logs when the auth call fails', async () => {
      window.asoIMS = { getAccessToken: () => ({ token: 'ims-tok' }) };
      responses.login = () => Promise.resolve({ ok: false, status: 401 });
      expect(await getASOToken()).to.be.null;
      expect(window.lana.log.called).to.be.true;
    });

    it('returns null and logs when the auth call throws', async () => {
      window.asoIMS = { getAccessToken: () => ({ token: 'ims-tok' }) };
      responses.login = () => Promise.reject(new Error('network'));
      expect(await getASOToken()).to.be.null;
      expect(window.lana.log.called).to.be.true;
    });
  });

  describe('getChecks', () => {
    it('returns null when the job cannot be created', async () => {
      asoCache.sessionToken = 'sess-1';
      responses.jobCreate = () => Promise.resolve({ ok: false, status: 500 });
      expect(await getChecks('IDENTIFY')).to.be.null;
    });

    it('formats a completed job into SEO check results', async () => {
      asoCache.sessionToken = 'sess-1';
      const checks = await getChecks('IDENTIFY');
      const byId = Object.fromEntries(checks.map((c) => [c.id, c]));
      expect(byId.title.status).to.equal('fail');
      expect(byId.title.description).to.contain('Missing title');
      expect(byId.title.aiSuggestion).to.equal('My Title');
      expect(byId.description.status).to.equal('pass');
      expect(byId['h1-count'].status).to.equal('fail');
      expect(byId.canonical.status).to.equal('pass');
      expect(byId.links.status).to.equal('fail');
      expect(byId.links.details.badLinks).to.have.lengthOf(1);
      expect(asoCache.identifyFinished).to.be.true;
      expect(asoCache.identifyJobId).to.equal('job-1');
    });
  });

  describe('fetchPreflightChecks', () => {
    it('returns null when no session token can be obtained', async () => {
      window.asoIMS = { getAccessToken: () => null };
      expect(await fetchPreflightChecks()).to.be.null;
    });

    it('resolves identify results when signed in', async () => {
      const clock = sinon.useFakeTimers();
      window.asoIMS = { getAccessToken: () => ({ token: 'ims-tok' }) };
      const promise = fetchPreflightChecks();
      await clock.tickAsync(0);
      const results = await promise;
      expect(results.some((c) => c.id === 'title')).to.be.true;
      clock.restore();
    });
  });
});
