import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import autoHighlightUnpublished from '../../../../../libs/blocks/preflight/checks/diff/autoHighlight.js';
import { clearHighlights } from '../../../../../libs/blocks/preflight/panels/diff-onpage.js';

const PAGE_HTML = '<body><div><p>Same text</p><img src="/icons/new.svg" alt=""></div></body>';
const PREVIEW = 'Thu, 02 Jan 2026 00:00:00 GMT';
const LIVE = 'Wed, 01 Jan 2026 00:00:00 GMT';

function stubFetch(statusByPath) {
  return sinon.stub(window, 'fetch').callsFake((url) => {
    const address = String(url);
    if (!address.includes('admin.hlx.page')) {
      return Promise.resolve({ ok: true, text: () => Promise.resolve(PAGE_HTML) });
    }
    const [, path] = address.match(/\/main(\/[^?]*)/);
    const { preview, live } = statusByPath[path] || { preview: LIVE, live: LIVE };
    const json = { preview: { lastModified: preview }, live: { lastModified: live } };
    return Promise.resolve({ ok: true, json: () => Promise.resolve(json) });
  });
}

describe('preflight auto highlight', () => {
  let main;

  beforeEach(() => {
    main = document.createElement('main');
    main.innerHTML = '<div><p>Same text</p><img src="/icons/new.svg" alt=""></div>';
    document.body.append(main);
  });

  afterEach(() => {
    clearHighlights(main);
    main.remove();
    sinon.restore();
  });

  it('frames an unpublished dependency even when the page itself has no unpublished changes', async () => {
    stubFetch({ '/icons/new.svg': { preview: PREVIEW, live: undefined } });

    await autoHighlightUnpublished(true);

    expect(main.querySelector('.preflight-diff-highlight-wrap > img')).to.exist;
    expect(main.querySelector('.preflight-diff-overlay.is-added')).to.exist;
    expect(main.querySelector('p .preflight-diff-overlay')).to.not.exist;
  });

  it('frames nothing when the page and its dependencies are all published', async () => {
    stubFetch({});

    await autoHighlightUnpublished(true);

    expect(main.querySelector('.preflight-diff-overlay')).to.not.exist;
  });

  it('frames an unpublished dependency once when the page diff already marks it as new', async () => {
    sinon.stub(window, 'fetch').callsFake((url) => {
      const address = String(url);
      if (address.includes('admin.hlx.page')) {
        const json = { preview: { lastModified: PREVIEW }, live: { lastModified: address.includes('new.svg') ? undefined : LIVE } };
        return Promise.resolve({ ok: true, json: () => Promise.resolve(json) });
      }
      const html = address.includes('aem.live') ? '<body><div><p>Same text</p></div></body>' : PAGE_HTML;
      return Promise.resolve({ ok: true, text: () => Promise.resolve(html) });
    });

    await autoHighlightUnpublished(true);

    expect(main.querySelectorAll('.preflight-diff-overlay')).to.have.length(1);
  });
});
