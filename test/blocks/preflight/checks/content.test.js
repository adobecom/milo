import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../../libs/utils/utils.js';
import { clearPageStatusCache } from '../../../../libs/blocks/preflight/checks/adminStatus.js';

document.body.innerHTML = await readFile({ path: './mocks/content.html' });
const {
  findFragments,
  checkUnpublishedFragments,
  checkUnresolvedPlaceholders,
  runChecks,
} = await import('../../../../libs/blocks/preflight/checks/content.js');

const ADMIN_STATUS = 'admin.hlx.page/status/adobecom/milo/main';
const PAGE_SOURCE = `${window.location.pathname.endsWith('/') ? `${window.location.pathname}index` : window.location.pathname}.plain.html`;
const live = (lastModified) => ({
  ok: true,
  json: async () => ({ preview: { lastModified: 'Mon, 01 Jan 2024' }, live: { lastModified } }),
});
const STATUSES = {
  '/fragments/published': live('Mon, 01 Jan 2024'),
  '/fragments/unpublished': live(null),
  '/fragments/inline-unpublished': live(null),
  '/fragments/modal-unpublished': live(null),
  '/fragments/nested-unknown': { ok: false, status: 401 },
};
const PLACEHOLDERS = { data: [{ key: 'buy-now', value: 'Buy now' }, { key: 'free', value: 'free' }] };
const html = (text) => ({ ok: true, text: async () => text });

let sources;

function stubFetch() {
  return sinon.stub(window, 'fetch').callsFake(async (resource) => {
    const url = String(resource);
    if (url.includes(ADMIN_STATUS)) {
      const path = url.split(ADMIN_STATUS)[1].split('?')[0];
      return STATUSES[path] ?? { ok: false, status: 404 };
    }
    if (url.endsWith('/placeholders.json')) return { ok: true, json: async () => PLACEHOLDERS };
    const source = Object.keys(sources).find((path) => url.endsWith(path));
    if (!source) return { ok: false, status: 404 };
    const resp = sources[source];
    if (resp instanceof Error) throw resp;
    return resp;
  });
}

const area = (id) => document.getElementById(id);
const statusCalls = (fetchStub, path) => fetchStub.getCalls()
  .filter(({ args }) => String(args[0]).includes(`${ADMIN_STATUS}${path}?`)).length;

describe('Preflight content checks', () => {
  let fetchStub;

  beforeEach(() => {
    setConfig({ locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } } });
    sources = { [PAGE_SOURCE]: html('') };
    fetchStub = stubFetch();
  });

  afterEach(() => {
    sinon.restore();
    clearPageStatusCache();
  });

  describe('findFragments', () => {
    it('finds loaded, inline, nested and modal fragments once each, and the ones that failed to load', () => {
      const found = findFragments(area('fragments')).map(({ path, failed }) => ({ path, failed }));
      expect(found).to.have.deep.members([
        { path: '/fragments/published', failed: false },
        { path: '/fragments/unpublished', failed: false },
        { path: '/fragments/nested-unknown', failed: false },
        { path: '/fragments/inline-unpublished', failed: false },
        { path: '/fragments/modal-unpublished', failed: false },
        { path: '/fragments/broken', failed: true },
      ]);
    });
  });

  describe('checkUnpublishedFragments', () => {
    it('blocks on unpublished and failed fragments and lists the ones it could not check', async () => {
      const result = await checkUnpublishedFragments(area('fragments'));
      expect(result).to.include({
        checkId: 'unpublished-fragments',
        title: 'Unpublished fragments',
        severity: 'critical',
        status: 'fail',
      });
      expect(result.details.items).to.have.deep.members([
        { path: '/fragments/unpublished', reason: 'unpublished' },
        { path: '/fragments/inline-unpublished', reason: 'unpublished' },
        { path: '/fragments/modal-unpublished', reason: 'unpublished' },
        { path: '/fragments/broken', reason: 'failed-to-load' },
      ]);
      expect(result.details.unchecked).to.deep.equal(['/fragments/nested-unknown']);
      expect(result.description).to.include("3 fragments aren't published");
      expect(result.description).to.include('1 fragment failed to load');
    });

    it('asks the publish status once per fragment and never for one that failed to load', async () => {
      await checkUnpublishedFragments(area('fragments'));
      expect(statusCalls(fetchStub, '/fragments/published')).to.equal(1);
      expect(statusCalls(fetchStub, '/fragments/broken')).to.equal(0);
    });

    it('is undecided, never passing, when the publish status is unknown', async () => {
      const unknown = document.createElement('div');
      unknown.append(document.querySelector('[data-path="/fragments/nested-unknown"]').cloneNode(true));
      const result = await checkUnpublishedFragments(unknown);
      expect(result.status).to.equal('limbo');
      expect(result.details).to.deep.equal({ items: [], unchecked: ['/fragments/nested-unknown'] });
    });

    it('treats a status request that throws as unknown', async () => {
      fetchStub.callsFake(async () => { throw new Error('offline'); });
      const result = await checkUnpublishedFragments(area('fragments'));
      expect(result.details.items).to.deep.equal([{ path: '/fragments/broken', reason: 'failed-to-load' }]);
      expect(result.details.unchecked).to.have.length(5);
    });

    it('passes when every fragment is published, or there are none', async () => {
      const published = document.createElement('div');
      published.append(document.querySelector('[data-path="/fragments/published"]').cloneNode(true));
      expect((await checkUnpublishedFragments(published)).status).to.equal('pass');
      const none = await checkUnpublishedFragments(area('no-content'));
      expect(none).to.include({ status: 'pass', description: 'No fragments on this page.' });
    });
  });

  describe('checkUnresolvedPlaceholders', () => {
    it('flags keys from the page source that fall back to the key text, but not resolved ones', async () => {
      sources[PAGE_SOURCE] = html('<p>{{buy-now}} {{free}} {{try-for-free}} <a href="/x?%7B%7Bmissing-link%7D%7D">x</a> {{price-geo-ip}} {{try-for-free}}</p>');
      const result = await checkUnresolvedPlaceholders(area('no-content'));
      expect(result).to.include({
        checkId: 'unresolved-placeholders',
        title: 'Unresolved placeholders',
        severity: 'critical',
        status: 'fail',
      });
      expect(result.details.items).to.deep.equal([
        { key: 'try-for-free', where: window.location.pathname },
        { key: 'missing-link', where: window.location.pathname },
      ]);
    });

    it('checks the sources of loaded fragments too', async () => {
      sources['/fragments/unpublished.plain.html'] = html('<p>{{frag-missing}} {{buy-now}}</p>');
      ['published', 'nested-unknown', 'inline-unpublished', 'modal-unpublished']
        .forEach((name) => { sources[`/fragments/${name}.plain.html`] = html(''); });
      const result = await checkUnresolvedPlaceholders(area('fragments'));
      expect(result.status).to.equal('fail');
      expect(result.details.items).to.deep.equal([{ key: 'frag-missing', where: '/fragments/unpublished' }]);
      const fetched = fetchStub.getCalls().map(({ args }) => String(args[0]));
      expect(fetched.some((url) => url.includes('/fragments/broken.plain.html'))).to.be.false;
    });

    it('ignores braces on the rendered page that the author never wrote, like widget templates', async () => {
      const result = await checkUnresolvedPlaceholders(area('raw-placeholders'));
      expect(result.status).to.equal('pass');
      expect(result.details.items).to.deep.equal([]);
    });

    it('is undecided, never passing, when a source cannot be loaded', async () => {
      sources[PAGE_SOURCE] = new Error('offline');
      const offline = await checkUnresolvedPlaceholders(area('no-content'));
      expect(offline.status).to.equal('limbo');
      expect(offline.description).to.include("Couldn't load");
      sources[PAGE_SOURCE] = { ok: false, status: 500 };
      expect((await checkUnresolvedPlaceholders(area('no-content'))).status).to.equal('limbo');
    });

    it('passes when every placeholder resolves', async () => {
      sources[PAGE_SOURCE] = html('<p>{{buy-now}}</p>');
      const result = await checkUnresolvedPlaceholders(area('no-content'));
      expect(result).to.include({ status: 'pass', description: 'Every placeholder resolves (1 checked).' });
    });

    it('is undecided, not failing, when no placeholder sheet loaded at all', async () => {
      const loaded = window.mph;
      window.mph = {};
      try {
        sources[PAGE_SOURCE] = html('<p>{{try-for-free}}</p>');
        const result = await checkUnresolvedPlaceholders(area('no-content'));
        expect(result.status).to.equal('limbo');
        expect(result.description).to.include('placeholder sheet');
      } finally {
        window.mph = loaded;
      }
    });

    it('does not fetch the source of cross-repo fragments', async () => {
      const federal = document.createElement('div');
      federal.innerHTML = '<div class="fragment" data-path="/federal/footer"></div>';
      await checkUnresolvedPlaceholders(federal);
      expect(fetchStub.getCalls().some(({ args }) => String(args[0]).includes('/federal/footer.plain.html'))).to.be.false;
    });
  });

  describe('runChecks', () => {
    it('runs both checks and turns a crash into an undecided result', async () => {
      const results = await Promise.all(runChecks({ area: null }));
      expect(results.map(({ checkId, status }) => ({ checkId, status }))).to.deep.equal([
        { checkId: 'unpublished-fragments', status: 'limbo' },
        { checkId: 'unresolved-placeholders', status: 'limbo' },
      ]);
    });
  });
});
