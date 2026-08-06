import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { html, render } from '../../../../libs/deps/htm-preact.js';
import DiffPanel from '../../../../libs/blocks/preflight/panels/diff.js';
import { waitFor } from '../../../helpers/waitfor.js';

const TEST_URL = new URL('https://main--milo--adobecom.aem.page/p');
const noopDecorate = async () => {};
const HIGHLIGHTS_KEY = 'preflight-diff-highlights';

const LIVE_HTML = `<main>
  <div>
    <p>Hello world</p>
    <p>Old paragraph</p>
    <p>Removed paragraph</p>
  </div>
  <div class="metadata">
    <div><div>description</div><div>Live description</div></div>
    <div><div>og:title</div><div>Shared Title</div></div>
    <div><div>robots</div><div>noindex</div></div>
  </div>
</main>`;

const PREVIEW_HTML = `<main>
  <div>
    <p>Hello world</p>
    <p>New paragraph</p>
    <h2>Brand new heading</h2>
  </div>
  <div class="metadata">
    <div><div>description</div><div>Preview description</div></div>
    <div><div>og:title</div><div>Shared Title</div></div>
    <div><div>keywords</div><div>new, keyword</div></div>
  </div>
</main>`;

// ES module bindings (e.g. the default export of fetchVersions.js) can't be stubbed
// under native ESM (mirrors checks/diff.test.js), so fetch is stubbed by URL and the
// real fetchVersions/diffContent/diffMetadata run against these fixtures.
function stubFetchWithChanges() {
  return sinon.stub(window, 'fetch').callsFake((u) => {
    const s = String(u);
    if (s.includes('admin.hlx.page')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          preview: { lastModified: 'Thu, 02 Jan 2026 00:00:00 GMT', lastModifiedBy: 'preview-author' },
          live: { lastModified: 'Wed, 01 Jan 2026 00:00:00 GMT', lastModifiedBy: 'live-author' },
        }),
      });
    }
    if (s.includes('aem.live')) return Promise.resolve({ ok: true, text: () => Promise.resolve(LIVE_HTML) });
    return Promise.resolve({ ok: true, text: () => Promise.resolve(PREVIEW_HTML) });
  });
}

function stubFetchSkipped() {
  return sinon.stub(window, 'fetch').callsFake((u) => {
    const s = String(u);
    if (s.includes('admin.hlx.page')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          preview: { lastModified: 'Wed, 01 Jan 2026 00:00:00 GMT' },
          live: { lastModified: 'Wed, 01 Jan 2026 00:00:00 GMT' },
        }),
      });
    }
    return Promise.resolve({ ok: true, text: () => Promise.resolve(LIVE_HTML) });
  });
}

// Not skipped (preview genuinely newer) but both sides render the same content — a legitimate
// "no changes" case distinct from the skipped-by-timestamp path above.
function stubFetchNoContentChanges() {
  return sinon.stub(window, 'fetch').callsFake((u) => {
    const s = String(u);
    if (s.includes('admin.hlx.page')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          preview: { lastModified: 'Thu, 02 Jan 2026 00:00:00 GMT', lastModifiedBy: 'preview-author' },
          live: { lastModified: 'Wed, 01 Jan 2026 00:00:00 GMT', lastModifiedBy: 'live-author' },
        }),
      });
    }
    return Promise.resolve({ ok: true, text: () => Promise.resolve(LIVE_HTML) });
  });
}

// Genuine fetch failure (e.g. 5xx) on the preview .plain.html — distinct from "skipped".
function stubFetchPreviewFails() {
  return sinon.stub(window, 'fetch').callsFake((u) => {
    const s = String(u);
    if (s.includes('admin.hlx.page')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          preview: { lastModified: 'Thu, 02 Jan 2026 00:00:00 GMT', lastModifiedBy: 'preview-author' },
          live: { lastModified: 'Wed, 01 Jan 2026 00:00:00 GMT', lastModifiedBy: 'live-author' },
        }),
      });
    }
    if (s.includes('aem.live')) return Promise.resolve({ ok: true, text: () => Promise.resolve(LIVE_HTML) });
    return Promise.resolve({ ok: false });
  });
}

// live .plain.html fetch fails (e.g. page never published) — preview content should fall back
// to comparing against an empty live doc, so every preview node reads as "added".
function stubFetchLiveMissing() {
  return sinon.stub(window, 'fetch').callsFake((u) => {
    const s = String(u);
    if (s.includes('admin.hlx.page')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          preview: { lastModified: 'Thu, 02 Jan 2026 00:00:00 GMT', lastModifiedBy: 'preview-author' },
          live: { lastModified: 'Wed, 01 Jan 2026 00:00:00 GMT', lastModifiedBy: 'live-author' },
        }),
      });
    }
    if (s.includes('aem.live')) return Promise.resolve({ ok: false });
    return Promise.resolve({ ok: true, text: () => Promise.resolve(PREVIEW_HTML) });
  });
}

describe('Preflight Content Diff Panel', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    window.localStorage.removeItem(HIGHLIGHTS_KEY);
  });

  afterEach(() => {
    document.body.removeChild(container);
    sinon.restore();
    window.localStorage.removeItem(HIGHLIGHTS_KEY);
  });

  it('renders the preflight-diff root with a loading indicator initially', async () => {
    sinon.stub(window, 'fetch').rejects(new Error('blocked in test'));
    render(html`<${DiffPanel} />`, container);
    expect(container.querySelector('.preflight-diff')).to.exist;
    expect(container.querySelector('.preflight-diff-loading')).to.exist;
    expect(container.querySelector('.preflight-diff-empty')).to.not.exist;
    expect(container.querySelector('.preflight-diff-panes')).to.not.exist;
    // Drain the pending async work so it can't leak into the next test's shared signals.
    // A rejected fetch is a genuine failure, so this settles into the error state, not empty.
    await waitFor(() => container.querySelector('.preflight-diff-error'));
  });

  it('shows the empty state when preview has no unpublished changes', async () => {
    stubFetchSkipped();
    render(html`<${DiffPanel} url=${TEST_URL} decorate=${noopDecorate} />`, container);
    await waitFor(() => container.querySelector('.preflight-diff-empty'));
    expect(container.querySelector('.preflight-diff-empty').textContent).to.equal('No unpublished changes');
  });

  it('shows the empty state when preview is newer but renders no content changes', async () => {
    stubFetchNoContentChanges();
    render(html`<${DiffPanel} url=${TEST_URL} decorate=${noopDecorate} />`, container);
    await waitFor(() => container.querySelector('.preflight-diff-empty'));
    expect(container.querySelector('.preflight-diff-empty').textContent).to.equal('No unpublished changes');
  });

  it('falls back to an empty live doc when the live fetch fails, marking preview content as added', async () => {
    stubFetchLiveMissing();
    render(html`<${DiffPanel} url=${TEST_URL} decorate=${noopDecorate} />`, container);
    await waitFor(() => container.querySelector('.preflight-diff-pane-preview [data-diff-key]'));

    const badges = [...container.querySelectorAll('.preflight-diff-change-item .preflight-diff-badge')]
      .map((b) => b.textContent);
    expect(badges.length).to.be.greaterThan(0);
    expect(badges.every((label) => label === 'New')).to.equal(true);
  });

  describe('error state', () => {
    it('shows a distinct error state with a retry action on genuine fetch failure', async () => {
      stubFetchPreviewFails();
      render(html`<${DiffPanel} url=${TEST_URL} decorate=${noopDecorate} />`, container);
      await waitFor(() => container.querySelector('.preflight-diff-error'));

      expect(container.querySelector('.preflight-diff-empty')).to.not.exist;
      expect(container.querySelector('.preflight-diff-retry')).to.exist;
    });

    it('retries the load when Retry is clicked', async () => {
      const failStub = stubFetchPreviewFails();
      render(html`<${DiffPanel} url=${TEST_URL} decorate=${noopDecorate} />`, container);
      await waitFor(() => container.querySelector('.preflight-diff-error'));

      failStub.restore();
      stubFetchWithChanges();
      container.querySelector('.preflight-diff-retry').click();

      await waitFor(() => container.querySelector('.preflight-diff-pane-preview [data-diff-key]'));
      expect(container.querySelector('.preflight-diff-error')).to.not.exist;
    });
  });

  describe('on-demand loading', () => {
    // Asserts purely on fetchStub call state (not on rendered DOM): the shared, module-level
    // view/pane signals can carry over a READY render from an earlier test's own instance,
    // which would make a DOM-presence wait pass on stale content instead of this test's fetch.
    it('does not fetch until selected, fetches once selected, and does not re-fetch on re-selection', async () => {
      const fetchStub = stubFetchWithChanges();
      render(html`<${DiffPanel} url=${TEST_URL} decorate=${noopDecorate} selected=${false} />`, container);

      // Give any pending microtasks a chance to run; the deferred panel must not have fetched.
      await new Promise((resolve) => { setTimeout(resolve, 0); });
      expect(fetchStub.called).to.equal(false);

      render(html`<${DiffPanel} url=${TEST_URL} decorate=${noopDecorate} selected=${true} />`, container);
      await waitFor(() => fetchStub.called);
      const callsAfterFirstLoad = fetchStub.callCount;

      // Switching away and back to the tab must not trigger a second fetch — the guard
      // latches synchronously on first activation, before the fetch itself even resolves.
      render(html`<${DiffPanel} url=${TEST_URL} decorate=${noopDecorate} selected=${false} />`, container);
      render(html`<${DiffPanel} url=${TEST_URL} decorate=${noopDecorate} selected=${true} />`, container);
      await new Promise((resolve) => { setTimeout(resolve, 0); });
      expect(fetchStub.callCount).to.equal(callsAfterFirstLoad);
    });

    it('defaults to loading immediately when selected is omitted (back-compat)', async () => {
      const fetchStub = stubFetchWithChanges();
      render(html`<${DiffPanel} url=${TEST_URL} decorate=${noopDecorate} />`, container);
      await waitFor(() => fetchStub.called);
      expect(fetchStub.called).to.equal(true);
    });
  });

  describe('highlight toggle', () => {
    it('re-reads a persisted off-state on mount', async () => {
      window.localStorage.setItem(HIGHLIGHTS_KEY, 'false');
      stubFetchWithChanges();
      render(html`<${DiffPanel} url=${TEST_URL} decorate=${noopDecorate} />`, container);
      await waitFor(() => container.querySelector('.preflight-diff-pane-preview [data-diff-key]'));

      expect(container.querySelector('.preflight-diff').classList.contains('preflight-diff-active')).to.equal(false);
      expect(container.querySelector('.preflight-diff-highlight-toggle').getAttribute('aria-pressed')).to.equal('false');
    });
  });

  describe('with changes', () => {
    beforeEach(async () => {
      stubFetchWithChanges();
      render(html`<${DiffPanel} url=${TEST_URL} decorate=${noopDecorate} />`, container);
      await waitFor(() => container.querySelector('.preflight-diff-pane-preview [data-diff-key]'));
    });

    it('renders live and preview panes with highlights applied by change type', () => {
      const previewBody = container.querySelector('.preflight-diff-pane-preview .preflight-diff-pane-body');
      const liveBody = container.querySelector('.preflight-diff-pane-live .preflight-diff-pane-body');

      // added: only in preview
      expect(previewBody.querySelector('h2.preflight-diff-added')).to.exist;
      expect(liveBody.querySelector('.preflight-diff-added')).to.not.exist;

      // modified: both panes, same path
      expect(previewBody.querySelector('p.preflight-diff-modified')).to.exist;
      expect(liveBody.querySelector('p.preflight-diff-modified')).to.exist;

      // removed: only in live
      expect(liveBody.querySelector('p.preflight-diff-removed')).to.exist;
      expect(previewBody.querySelector('.preflight-diff-removed')).to.not.exist;
    });

    it('lists one change row per change with the right badge', () => {
      const rows = [...container.querySelectorAll('.preflight-diff-change-item')];
      expect(rows).to.have.length(3);
      const badges = rows.map((row) => row.querySelector('.preflight-diff-badge').textContent);
      expect(badges).to.include('New');
      expect(badges).to.include('Changed');
      expect(badges).to.include('Removed');
    });

    it('scrolls both panes when a modified change row is clicked', () => {
      const scrollToStub = sinon.stub(Element.prototype, 'scrollTo');
      const rows = [...container.querySelectorAll('.preflight-diff-change-item')];
      const modifiedRow = rows.find((row) => row.querySelector('.preflight-diff-badge').textContent === 'Changed');

      modifiedRow.querySelector('.preflight-diff-change-row').click();

      // present in both live and preview panes, so both get scrolled
      expect(scrollToStub.callCount).to.equal(2);
    });

    it('switches to the Metadata tab and lists key/value changes', async () => {
      const contentPanel = container.querySelector('#preflight-diff-panel-content');
      const metadataPanel = container.querySelector('#preflight-diff-panel-metadata');
      const metadataToggle = container.querySelector('#preflight-diff-tab-metadata');
      expect(contentPanel.hasAttribute('hidden')).to.equal(false);
      expect(metadataPanel.hasAttribute('hidden')).to.equal(true);

      metadataToggle.click();
      await waitFor(() => metadataToggle.getAttribute('aria-selected') === 'true');

      expect(metadataToggle.getAttribute('aria-selected')).to.equal('true');
      expect(contentPanel.hasAttribute('hidden')).to.equal(true);
      expect(metadataPanel.hasAttribute('hidden')).to.equal(false);
      // role="tabpanel" doesn't take aria-selected — only role="tab" does.
      expect(contentPanel.hasAttribute('aria-selected')).to.equal(false);
      expect(metadataPanel.hasAttribute('aria-selected')).to.equal(false);

      const metaRows = [...container.querySelectorAll('.preflight-diff-metadata-row')];
      expect(metaRows).to.have.length(3);
      const tableText = container.querySelector('.preflight-diff-metadata-table').textContent;
      expect(tableText).to.include('description');
      expect(tableText).to.include('Live description');
      expect(tableText).to.include('Preview description');
      expect(tableText).to.include('robots');
      expect(tableText).to.include('keywords');
    });

    it('shows the last-modified header for both preview and live', () => {
      const header = container.querySelector('.preflight-diff-header');
      expect(header.textContent).to.include('Live: live-author');
      expect(header.textContent).to.include('Preview: preview-author');
      expect(header.textContent).to.include('·');
    });

    it('defaults highlights on and persists off-toggle to localStorage', async () => {
      const root = container.querySelector('.preflight-diff');
      const toggle = container.querySelector('.preflight-diff-highlight-toggle');
      expect(root.classList.contains('preflight-diff-active')).to.equal(true);
      expect(toggle.getAttribute('aria-pressed')).to.equal('true');

      toggle.click();
      await waitFor(() => toggle.getAttribute('aria-pressed') === 'false');

      expect(root.classList.contains('preflight-diff-active')).to.equal(false);
      expect(window.localStorage.getItem(HIGHLIGHTS_KEY)).to.equal('false');
    });

    it('mirrors scroll position between live and preview panes', () => {
      const previewBody = container.querySelector('.preflight-diff-pane-preview .preflight-diff-pane-body');
      const liveBody = container.querySelector('.preflight-diff-pane-live .preflight-diff-pane-body');
      Object.defineProperty(liveBody, 'scrollTop', { value: 0, writable: true, configurable: true });
      Object.defineProperty(previewBody, 'scrollTop', { value: 0, writable: true, configurable: true });

      liveBody.scrollTop = 42;
      liveBody.dispatchEvent(new Event('scroll'));

      expect(previewBody.scrollTop).to.equal(42);
    });
  });
});
