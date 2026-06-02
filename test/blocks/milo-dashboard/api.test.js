import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../libs/utils/utils.js';

const { readConfig, resolveContext, createClient } = await import('../../../libs/blocks/milo-dashboard/api.js');

function buildBlock(rows) {
  const block = document.createElement('div');
  block.className = 'milo-dashboard';
  rows.forEach(([k, v]) => {
    const row = document.createElement('div');
    const c1 = document.createElement('div');
    c1.textContent = k;
    const c2 = document.createElement('div');
    c2.textContent = v;
    row.append(c1, c2);
    block.append(row);
  });
  return block;
}

describe('milo-dashboard api', () => {
  beforeEach(() => {
    setConfig({ imsClientId: 'test-client-id' });
  });

  afterEach(() => {
    sinon.restore();
    delete window.adobeIMS;
  });

  describe('readConfig', () => {
    it('parses rows into a keyed object', () => {
      const block = buildBlock([['API', ' http://localhost:8080 ']]);
      expect(readConfig(block)).to.deep.equal({ api: 'http://localhost:8080' });
    });

    it('skips rows without a key', () => {
      const block = buildBlock([['', 'orphan'], ['Token', 'abc']]);
      expect(readConfig(block)).to.deep.equal({ token: 'abc' });
    });
  });

  describe('resolveContext', () => {
    it('returns local mode when no api row and not iframe', async () => {
      const block = buildBlock([]);
      const ctx = await resolveContext(block, { inIframe: false });
      expect(ctx.mode).to.equal('local');
      expect(ctx.base).to.equal('http://localhost:8080');
      expect(ctx.token).to.be.undefined;
    });

    it('defaults to the local backend on localhost when no api row', async () => {
      // web-test-runner serves from localhost, so defaultBase() resolves to local.
      const block = buildBlock([]);
      const ctx = await resolveContext(block, { inIframe: false });
      expect(ctx.base).to.equal('http://localhost:8080');
      expect(ctx.mode).to.equal('local');
    });

    it('returns standalone mode and honors api row as base', async () => {
      const block = buildBlock([['api', 'https://example.com'], ['token', 'tk']]);
      const ctx = await resolveContext(block, { inIframe: false });
      expect(ctx.mode).to.equal('standalone');
      expect(ctx.base).to.equal('https://example.com');
      expect(ctx.token).to.equal('tk');
    });

    it('uses adobeIMS token and imsClientId when no config token (non-DA)', async () => {
      window.adobeIMS = { getAccessToken: () => ({ token: 'ims-tok' }) };
      const block = buildBlock([]);
      const ctx = await resolveContext(block, { inIframe: false });
      expect(ctx.token).to.equal('ims-tok');
      expect(ctx.clientId).to.equal('test-client-id');
    });

    it('prefers an explicit config token over adobeIMS', async () => {
      window.adobeIMS = { getAccessToken: () => ({ token: 'ims-tok' }) };
      const block = buildBlock([['token', 'cfg-tok']]);
      const ctx = await resolveContext(block, { inIframe: false });
      expect(ctx.token).to.equal('cfg-tok');
    });

    it('derives clientId from the token client_id when no config row', async () => {
      const payload = btoa(JSON.stringify({ client_id: 'darkalley' }));
      window.adobeIMS = { getAccessToken: () => ({ token: `h.${payload}.s` }) };
      const block = buildBlock([]);
      const ctx = await resolveContext(block, { inIframe: false });
      expect(ctx.clientId).to.equal('darkalley');
    });

    it('prefers an explicit clientid row over the token client_id', async () => {
      const payload = btoa(JSON.stringify({ client_id: 'darkalley' }));
      window.adobeIMS = { getAccessToken: () => ({ token: `h.${payload}.s` }) };
      const block = buildBlock([['clientid', 'override-cid']]);
      const ctx = await resolveContext(block, { inIframe: false });
      expect(ctx.clientId).to.equal('override-cid');
    });

    it('resolves DA mode when in iframe and sdk resolves', async () => {
      const block = buildBlock([]);
      const loadDaSdk = () => Promise.resolve({ token: 't', context: { org: 'x' } });
      const ctx = await resolveContext(block, { inIframe: true, loadDaSdk });
      expect(ctx.mode).to.equal('da');
      expect(ctx.base).to.equal('http://localhost:8080');
      expect(ctx.token).to.equal('t');
      expect(ctx.clientId).to.equal('test-client-id');
      expect(ctx.daContext).to.deep.equal({ org: 'x' });
    });

    it('falls through to local when sdk rejects in iframe', async () => {
      const block = buildBlock([]);
      const loadDaSdk = () => Promise.reject(new Error('nope'));
      const ctx = await resolveContext(block, { inIframe: true, loadDaSdk });
      expect(ctx.mode).to.equal('local');
      expect(ctx.token).to.be.undefined;
    });
  });

  describe('createClient', () => {
    it('builds url with params, no auth when no token', async () => {
      const fetchStub = sinon.stub(window, 'fetch').resolves({ ok: true, json: () => Promise.resolve({ ok: 1 }) });
      const client = createClient({ base: 'https://example.com' });
      const data = await client.get('/items', { q: 'hi', empty: '', skip: null });
      const [url, opts] = fetchStub.firstCall.args;
      expect(url.toString()).to.equal('https://example.com/items?q=hi');
      expect(opts.headers.Authorization).to.be.undefined;
      expect(data).to.deep.equal({ ok: 1 });
    });

    it('adds bearer header and passed clientId when token present', async () => {
      const fetchStub = sinon.stub(window, 'fetch').resolves({ ok: true, json: () => Promise.resolve({}) });
      const client = createClient({ base: 'https://example.com', token: 't', clientId: 'cid' });
      await client.get('/items');
      const [url, opts] = fetchStub.firstCall.args;
      expect(url.searchParams.get('clientId')).to.equal('cid');
      expect(opts.headers.Authorization).to.equal('Bearer t');
    });

    it('getText returns text body', async () => {
      const csv = 'path,site\n/a.html,milo';
      const fetchStub = sinon.stub(window, 'fetch').resolves({ ok: true, text: () => Promise.resolve(csv) });
      const client = createClient({ base: 'https://example.com', token: 'abc', clientId: 'cid' });
      const data = await client.getText('/test-pages', { since: '30d' });
      const [url, opts] = fetchStub.firstCall.args;
      expect(url.toString()).to.equal('https://example.com/test-pages?since=30d&clientId=cid');
      expect(opts.headers.Authorization).to.equal('Bearer abc');
      expect(data).to.equal(csv);
    });

    it('throws an error with status on non-ok response', async () => {
      sinon.stub(window, 'fetch').resolves({ ok: false, status: 503 });
      const client = createClient({ base: 'https://example.com' });
      let err;
      try {
        await client.get('/items');
      } catch (e) {
        err = e;
      }
      expect(err).to.be.an('error');
      expect(err.status).to.equal(503);
    });
  });
});
