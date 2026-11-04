import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import collectDependencyChanges from '../../../../../libs/blocks/preflight/checks/diff/dependencies.js';

const PAGE_URL = new URL('https://main--milo--adobecom.aem.page/page');
const OLDER = 'Wed, 01 Jan 2026 00:00:00 GMT';
const NEWER = 'Thu, 02 Jan 2026 00:00:00 GMT';

const statusOf = (preview, live) => ({
  ok: true,
  json: () => Promise.resolve({ preview: { lastModified: preview }, live: { lastModified: live } }),
});

function stubStatuses(byPath) {
  return sinon.stub(window, 'fetch').callsFake((url) => {
    const [, path] = String(url).match(/admin\.hlx\.page\/status\/[^/]+\/[^/]+\/[^/]+(\/[^?]*)/);
    return Promise.resolve(byPath[path] || { ok: false, status: 401 });
  });
}

function makeRoot(html) {
  const root = document.createElement('main');
  root.innerHTML = `<div>${html}</div>`;
  return root;
}

describe('preflight dependency changes', () => {
  beforeEach(() => { window.lana = { log: sinon.spy() }; });
  afterEach(() => sinon.restore());

  it('reports a never-published svg as added', async () => {
    stubStatuses({ '/icons/new.svg': statusOf(NEWER, undefined) });
    const root = makeRoot('<img src="/icons/new.svg" alt="">');

    const { added, modified } = await collectDependencyChanges(root, PAGE_URL);

    expect(added).to.deep.equal([{ type: 'added', kind: 'leaf', tag: 'IMG', path: '/div[1]/img[1]' }]);
    expect(modified).to.have.length(0);
  });

  it('reports a pdf link that is newer on preview than live as modified', async () => {
    stubStatuses({ '/files/terms.pdf': statusOf(NEWER, OLDER) });
    const root = makeRoot('<p><a href="/files/terms.pdf">Terms</a></p>');

    const { added, modified } = await collectDependencyChanges(root, PAGE_URL);

    expect(modified).to.deep.equal([{ type: 'modified', kind: 'leaf', tag: 'A', path: '/div[1]/p[1]/a[1]' }]);
    expect(added).to.have.length(0);
  });

  it('reports nothing for dependencies that are in sync', async () => {
    stubStatuses({ '/icons/same.svg': statusOf(OLDER, NEWER) });
    const root = makeRoot('<img src="/icons/same.svg" alt="">');

    const { added, modified } = await collectDependencyChanges(root, PAGE_URL);

    expect(added.concat(modified)).to.have.length(0);
  });

  it('reports nothing for a resource that has no preview, like a code file', async () => {
    stubStatuses({ '/libs/img/icon.svg': statusOf(undefined, undefined) });
    const root = makeRoot('<img src="/libs/img/icon.svg" alt="">');

    const { added, modified } = await collectDependencyChanges(root, PAGE_URL);

    expect(added.concat(modified)).to.have.length(0);
  });

  it('skips a dependency whose status cannot be read', async () => {
    stubStatuses({});
    const root = makeRoot('<img src="/icons/private.svg" alt="">');

    const { added, modified } = await collectDependencyChanges(root, PAGE_URL);

    expect(added.concat(modified)).to.have.length(0);
    expect(window.lana.log.called).to.equal(false);
  });

  it('checks a cross-repo fragment by its publish state, not by its content', async () => {
    const fetchStub = stubStatuses({ '/federal/promos/sale': statusOf(NEWER, OLDER) });
    const root = makeRoot('<div class="fragment" data-path="/federal/promos/sale"><p>Sale</p></div>');

    const { modified } = await collectDependencyChanges(root, PAGE_URL);

    expect(modified).to.deep.equal([{ type: 'modified', kind: 'leaf', tag: 'DIV', path: '/div[1]/div[1]' }]);
    expect(fetchStub.firstCall.args[0]).to.contain('/status/adobecom/federal/main/federal/promos/sale');
  });

  it('leaves same-origin fragments to the content diff', async () => {
    const fetchStub = stubStatuses({});
    const root = makeRoot('<div class="fragment" data-path="/fragments/blade"><p>Blade</p></div>');

    await collectDependencyChanges(root, PAGE_URL);

    expect(fetchStub.called).to.equal(false);
  });

  it('asks for each distinct resource once and frames every element that uses it', async () => {
    const fetchStub = stubStatuses({ '/icons/new.svg': statusOf(NEWER, undefined) });
    const root = makeRoot('<img src="/icons/new.svg" alt=""><p><img src="/icons/new.svg" alt=""></p>');

    const { added } = await collectDependencyChanges(root, PAGE_URL);

    expect(fetchStub.callCount).to.equal(1);
    expect(added.map(({ path }) => path)).to.have.members(['/div[1]/img[1]', '/div[1]/p[1]/img[1]']);
  });

  it('logs and skips a dependency when the status request fails', async () => {
    sinon.stub(window, 'fetch').rejects(new Error('offline'));
    const root = makeRoot('<img src="/icons/new.svg" alt="">');

    const { added } = await collectDependencyChanges(root, PAGE_URL);

    expect(added).to.have.length(0);
    expect(window.lana.log.calledWith(sinon.match('offline'))).to.equal(true);
  });
});
