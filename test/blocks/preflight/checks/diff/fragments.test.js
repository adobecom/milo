import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import collectFragmentChanges, { hasPendingFragments } from '../../../../../libs/blocks/preflight/checks/diff/fragments.js';

const PAGE_URL = new URL('https://main--milo--adobecom.aem.page/page');
const PREVIEW_HTML = '<body><div><div class="text"><p>Hello new world</p></div></div></body>';
const LIVE_HTML = '<body><div><div class="text"><p>Hello world</p></div></div></body>';

const STATUS = {
  ok: true,
  json: () => Promise.resolve({
    preview: { lastModified: 'Thu, 02 Jan 2026 00:00:00 GMT' },
    live: { lastModified: 'Wed, 01 Jan 2026 00:00:00 GMT' },
  }),
};

function stubFetch({ notFound = [] } = {}) {
  return sinon.stub(window, 'fetch').callsFake((u) => {
    const s = String(u);
    if (s.includes('admin.hlx.page')) return Promise.resolve(STATUS);
    if (notFound.some((p) => s.includes(`${p}.plain.html`) && !s.includes('aem.live'))) {
      return Promise.resolve({ ok: false, status: 404 });
    }
    const html = s.includes('aem.live') ? LIVE_HTML : PREVIEW_HTML;
    return Promise.resolve({ ok: true, text: () => Promise.resolve(html) });
  });
}

function makeRoot(paths) {
  const root = document.createElement('main');
  root.innerHTML = paths.map((p) => `<div class="fragment" data-path="${p}"></div>`).join('');
  return root;
}

describe('preflight fragments', () => {
  beforeEach(() => { window.lana = { log: sinon.spy() }; });
  afterEach(() => sinon.restore());

  it('collects a change scoped to the fragment element', async () => {
    stubFetch();
    const root = makeRoot(['/fragments/blade']);
    const frag = root.querySelector('.fragment');

    const { modified } = await collectFragmentChanges(root, PAGE_URL);

    expect(modified).to.have.length(1);
    expect(modified[0].scope).to.equal(frag);
  });

  it('does not carry detached DOM nodes (previewEl/liveEl) on returned changes', async () => {
    stubFetch();
    const { modified } = await collectFragmentChanges(makeRoot(['/fragments/blade']), PAGE_URL);
    expect(modified[0]).to.not.have.property('previewEl');
    expect(modified[0]).to.not.have.property('liveEl');
  });

  it('tags every instance when the same fragment appears more than once', async () => {
    stubFetch();
    const root = makeRoot(['/fragments/blade', '/fragments/blade']);
    const frags = [...root.querySelectorAll('.fragment')];

    const { modified } = await collectFragmentChanges(root, PAGE_URL);

    expect(modified).to.have.length(2);
    expect(modified.map((c) => c.scope)).to.have.members(frags);
  });

  it('skips /federal/ fragments without fetching them', async () => {
    const fetchStub = stubFetch();
    const root = makeRoot(['/federal/gnav', '/fragments/blade']);

    const { modified } = await collectFragmentChanges(root, PAGE_URL);

    expect(modified).to.have.length(1);
    expect(fetchStub.getCalls().every((call) => !String(call.args[0]).includes('/federal/'))).to.equal(true);
  });

  it('skips a fragment whose preview is missing but keeps the others', async () => {
    stubFetch({ notFound: ['/fragments/broken'] });
    const root = makeRoot(['/fragments/broken', '/fragments/blade']);
    const blade = root.querySelectorAll('.fragment')[1];

    const { modified } = await collectFragmentChanges(root, PAGE_URL);

    expect(modified).to.have.length(1);
    expect(modified[0].scope).to.equal(blade);
  });

  it('returns no changes when a fragment matches live', async () => {
    sinon.stub(window, 'fetch').callsFake((u) => {
      if (String(u).includes('admin.hlx.page')) return Promise.resolve(STATUS);
      return Promise.resolve({ ok: true, text: () => Promise.resolve(LIVE_HTML) });
    });
    const root = makeRoot(['/fragments/blade']);

    const { added, modified } = await collectFragmentChanges(root, PAGE_URL);

    expect(added).to.have.length(0);
    expect(modified).to.have.length(0);
  });

  it('reports pending fragments while an un-expanded fragment link remains', () => {
    const root = document.createElement('main');
    root.innerHTML = '<p><a href="/in/edu-shared/fragments/faq">/in/edu-shared/fragments/faq</a></p>';
    expect(hasPendingFragments(root)).to.equal(true);
  });

  it('reports no pending fragments once every link is expanded', () => {
    const root = makeRoot(['/fragments/blade']);
    expect(hasPendingFragments(root)).to.equal(false);
  });

  it('does not treat a cross-repo (federal) fragment link as pending', () => {
    const root = document.createElement('main');
    root.innerHTML = '<p><a href="/federal/x/fragments/y">/federal/x/fragments/y</a></p>';
    expect(hasPendingFragments(root)).to.equal(false);
  });

  it('logs and skips a fragment with an unparseable data-path', async () => {
    const fetchStub = stubFetch();
    const root = makeRoot(['http://']);

    const { added, modified } = await collectFragmentChanges(root, PAGE_URL);

    expect(added).to.have.length(0);
    expect(modified).to.have.length(0);
    expect(window.lana.log.called).to.equal(true);
    expect(fetchStub.called).to.equal(false);
  });
});
