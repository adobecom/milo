import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import fetchVersions, { deriveLiveUrl } from '../../../../../libs/blocks/preflight/checks/diff/fetchVersions.js';

describe('preflight fetchVersions', () => {
  afterEach(() => sinon.restore());

  it('deriveLiveUrl swaps aem.page for aem.live', () => {
    const live = deriveLiveUrl(new URL('https://main--milo--adobecom.aem.page/a/b'));
    expect(live.hostname).to.equal('main--milo--adobecom.aem.live');
    expect(live.pathname).to.equal('/a/b');
  });

  it('deriveLiveUrl points localhost at real milo main live (aem up dev)', () => {
    const live = deriveLiveUrl(new URL('http://localhost:6456/drafts/x/diff-test'));
    expect(live.hostname).to.equal('main--milo--adobecom.aem.live');
    expect(live.pathname).to.equal('/drafts/x/diff-test');
  });

  it('returns skipped=true when preview is not newer than live', async () => {
    sinon.stub(window, 'fetch').callsFake((u) => {
      if (String(u).includes('admin.hlx.page')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            preview: { lastModified: 'Wed, 01 Jan 2026 00:00:00 GMT' },
            live: { lastModified: 'Wed, 01 Jan 2026 00:00:00 GMT' },
          }),
        });
      }
      return Promise.resolve({ ok: true, text: () => Promise.resolve('<main></main>') });
    });
    const res = await fetchVersions(new URL('https://main--milo--adobecom.aem.page/p'));
    expect(res.skipped).to.equal(true);
  });

  it('fetches both .plain.html when preview is newer', async () => {
    sinon.stub(window, 'fetch').callsFake((u) => {
      const s = String(u);
      if (s.includes('admin.hlx.page')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            preview: { lastModified: 'Thu, 02 Jan 2026 00:00:00 GMT', lastModifiedBy: 'alice' },
            live: { lastModified: 'Wed, 01 Jan 2026 00:00:00 GMT', lastModifiedBy: 'bob' },
          }),
        });
      }
      if (s.includes('aem.live')) return Promise.resolve({ ok: true, text: () => Promise.resolve('<main>live</main>') });
      return Promise.resolve({ ok: true, text: () => Promise.resolve('<main>preview</main>') });
    });
    const res = await fetchVersions(new URL('https://main--milo--adobecom.aem.page/p'));
    expect(res.skipped).to.equal(false);
    expect(res.preview.html).to.contain('preview');
    expect(res.live.html).to.contain('live');
    expect(res.status.preview.lastModifiedBy).to.equal('alice');
    expect(res.liveStatus).to.equal('ok');
  });

  it('returns live=null and liveStatus=missing when live 404s', async () => {
    sinon.stub(window, 'fetch').callsFake((u) => {
      const s = String(u);
      if (s.includes('admin.hlx.page')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            preview: { lastModified: 'Thu, 02 Jan 2026 00:00:00 GMT' },
            live: { lastModified: null },
          }),
        });
      }
      if (s.includes('aem.live')) return Promise.resolve({ ok: false, status: 404 });
      return Promise.resolve({ ok: true, text: () => Promise.resolve('<main>preview</main>') });
    });
    const res = await fetchVersions(new URL('https://main--milo--adobecom.aem.page/p'));
    expect(res.live).to.equal(null);
    expect(res.liveStatus).to.equal('missing');
    expect(res.preview.html).to.contain('preview');
  });

  it('returns live=null and liveStatus=error on a non-404 failure (e.g. 500)', async () => {
    sinon.stub(window, 'fetch').callsFake((u) => {
      const s = String(u);
      if (s.includes('admin.hlx.page')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            preview: { lastModified: 'Thu, 02 Jan 2026 00:00:00 GMT' },
            live: { lastModified: 'Wed, 01 Jan 2026 00:00:00 GMT' },
          }),
        });
      }
      if (s.includes('aem.live')) return Promise.resolve({ ok: false, status: 500 });
      return Promise.resolve({ ok: true, text: () => Promise.resolve('<main>preview</main>') });
    });
    const res = await fetchVersions(new URL('https://main--milo--adobecom.aem.page/p'));
    expect(res.live).to.equal(null);
    expect(res.liveStatus).to.equal('error');
  });

  it('returns live=null and liveStatus=error when the live fetch throws (network failure)', async () => {
    sinon.stub(window, 'fetch').callsFake((u) => {
      const s = String(u);
      if (s.includes('admin.hlx.page')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            preview: { lastModified: 'Thu, 02 Jan 2026 00:00:00 GMT' },
            live: { lastModified: 'Wed, 01 Jan 2026 00:00:00 GMT' },
          }),
        });
      }
      if (s.includes('aem.live')) return Promise.reject(new Error('network down'));
      return Promise.resolve({ ok: true, text: () => Promise.resolve('<main>preview</main>') });
    });
    const res = await fetchVersions(new URL('https://main--milo--adobecom.aem.page/p'));
    expect(res.live).to.equal(null);
    expect(res.liveStatus).to.equal('error');
  });
});
