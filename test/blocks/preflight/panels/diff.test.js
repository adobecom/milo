import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { html, render } from '../../../../libs/deps/htm-preact.js';
import DiffPanel from '../../../../libs/blocks/preflight/panels/diff.js';
import { waitFor } from '../../../helpers/waitfor.js';

const TEST_URL = new URL('https://main--milo--adobecom.aem.page/p');
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

const LIVE_LABELS_HTML = '<main><div><p>Existing text</p></div></main>';
const LONG_HEADING = 'A brand new heading with more than sixty characters in its text so truncation kicks in';
const PREVIEW_LABELS_HTML = `<main>
  <div>
    <img src="/a.png" alt="A cool photo">
    <h3>${LONG_HEADING}</h3>
    <a href="/x">Learn more</a>
    <p>Existing text</p>
    <button>Click me</button>
  </div>
</main>`;

const LIVE_BLOCKS_HTML = `<main>
  <div>
    <div class="columns">Old col text</div>
    <div class="marquee">Marquee text</div>
  </div>
</main>`;

const PREVIEW_BLOCKS_HTML = `<main>
  <div>
    <div class="columns">New col text</div>
    <div class="two-up">Two up text</div>
  </div>
</main>`;

function stubFetchWithBlockChanges() {
  return sinon.stub(window, 'fetch').callsFake((u) => {
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
    if (s.includes('aem.live')) return Promise.resolve({ ok: true, text: () => Promise.resolve(LIVE_BLOCKS_HTML) });
    return Promise.resolve({ ok: true, text: () => Promise.resolve(PREVIEW_BLOCKS_HTML) });
  });
}

function stubFetchWithLabelChanges() {
  return sinon.stub(window, 'fetch').callsFake((u) => {
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
    if (s.includes('aem.live')) return Promise.resolve({ ok: true, text: () => Promise.resolve(LIVE_LABELS_HTML) });
    return Promise.resolve({ ok: true, text: () => Promise.resolve(PREVIEW_LABELS_HTML) });
  });
}

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

// live .plain.html 404s but admin status confirms the page IS published (has a live
// lastModified) — the live version exists but couldn't be loaded, so the panel must show the
// "couldn't load" error state, never fabricate an empty live doc and mark everything "New".
function stubFetchLiveUnavailablePublished() {
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
    if (s.includes('aem.live')) return Promise.resolve({ ok: false, status: 404 });
    return Promise.resolve({ ok: true, text: () => Promise.resolve(PREVIEW_HTML) });
  });
}

// live .plain.html 404s and admin status is itself unavailable (e.g. 5xx) — publish state is
// unknown, so the panel must not guess; it shows the same "couldn't load" error state.
function stubFetchLiveUnavailableUnknownStatus() {
  return sinon.stub(window, 'fetch').callsFake((u) => {
    const s = String(u);
    if (s.includes('admin.hlx.page')) return Promise.resolve({ ok: false, status: 500 });
    if (s.includes('aem.live')) return Promise.resolve({ ok: false, status: 404 });
    return Promise.resolve({ ok: true, text: () => Promise.resolve(PREVIEW_HTML) });
  });
}

// live .plain.html 404s and admin status confirms the page has never been published (no live
// lastModified) — a genuinely new page. Preview content is safe to show as new, but the panel
// must label it as a new page, not silently render a diff against a fabricated empty live doc.
function stubFetchNewUnpublishedPage() {
  return sinon.stub(window, 'fetch').callsFake((u) => {
    const s = String(u);
    if (s.includes('admin.hlx.page')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          preview: { lastModified: 'Thu, 02 Jan 2026 00:00:00 GMT', lastModifiedBy: 'preview-author' },
          live: { lastModified: null },
        }),
      });
    }
    if (s.includes('aem.live')) return Promise.resolve({ ok: false, status: 404 });
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
    // Unmount the Preact tree (not just detaching the DOM node) so this test's component
    // instance stops subscribing to the shared, module-level signals (view, contentDiff,
    // highlightsOn, ...) — otherwise dead instances from earlier tests keep reacting to
    // signal updates from later tests and race with their assertions.
    render(null, container);
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
    // Drain the pending async work so it can't leak into the next test's shared signals.
    // A rejected fetch is a genuine failure, so this settles into the error state, not empty.
    await waitFor(() => container.querySelector('.preflight-diff-error'));
  });

  it('does not render the two-pane comparison markup that used to trigger loadArea', async () => {
    stubFetchWithChanges();
    render(html`<${DiffPanel} url=${TEST_URL} />`, container);
    await waitFor(() => container.querySelector('.preflight-diff-change-item'));

    expect(container.querySelector('.preflight-diff-panes')).to.not.exist;
    expect(container.querySelector('.preflight-diff-pane-live')).to.not.exist;
    expect(container.querySelector('.preflight-diff-pane-preview')).to.not.exist;
  });

  it('shows the empty state when preview has no unpublished changes', async () => {
    stubFetchSkipped();
    render(html`<${DiffPanel} url=${TEST_URL} />`, container);
    await waitFor(() => container.querySelector('.preflight-diff-empty'));
    expect(container.querySelector('.preflight-diff-empty').textContent).to.equal('No unpublished changes');
  });

  it('shows the empty state when preview is newer but renders no content changes', async () => {
    stubFetchNoContentChanges();
    render(html`<${DiffPanel} url=${TEST_URL} />`, container);
    await waitFor(() => container.querySelector('.preflight-diff-empty'));
    expect(container.querySelector('.preflight-diff-empty').textContent).to.equal('No unpublished changes');
  });

  describe('live version unavailable', () => {
    it('shows the "could not load live" error state when live 404s on a published page', async () => {
      stubFetchLiveUnavailablePublished();
      render(html`<${DiffPanel} url=${TEST_URL} />`, container);
      await waitFor(() => container.querySelector('.preflight-diff-error'));

      expect(container.querySelector('.preflight-diff-error').textContent)
        .to.equal('Couldn’t load the live version to compare.');
      expect(container.querySelector('.preflight-diff-retry')).to.exist;
      // Never fabricate a diff against an empty live doc.
      expect(container.querySelector('.preflight-diff-change-item')).to.not.exist;
    });

    it('shows the "could not load live" error state when publish status itself is unavailable', async () => {
      stubFetchLiveUnavailableUnknownStatus();
      render(html`<${DiffPanel} url=${TEST_URL} />`, container);
      await waitFor(() => container.querySelector('.preflight-diff-error'));

      expect(container.querySelector('.preflight-diff-error').textContent)
        .to.equal('Couldn’t load the live version to compare.');
      expect(container.querySelector('.preflight-diff-change-item')).to.not.exist;
    });

    it('retries and recovers into the ready state once the live fetch succeeds', async () => {
      const failStub = stubFetchLiveUnavailablePublished();
      render(html`<${DiffPanel} url=${TEST_URL} />`, container);
      await waitFor(() => container.querySelector('.preflight-diff-error'));

      failStub.restore();
      stubFetchWithChanges();
      container.querySelector('.preflight-diff-retry').click();

      await waitFor(() => container.querySelector('.preflight-diff-change-item'));
      expect(container.querySelector('.preflight-diff-error')).to.not.exist;
    });

    it('shows a distinct "new page" state for a confirmed-unpublished page, labeling content as new', async () => {
      stubFetchNewUnpublishedPage();
      render(html`<${DiffPanel} url=${TEST_URL} />`, container);
      await waitFor(() => container.querySelector('.preflight-diff-change-item'));

      expect(container.querySelector('.preflight-diff-new-page').textContent)
        .to.equal('This page isn’t published yet — all content is new.');
      expect(container.querySelector('.preflight-diff-error')).to.not.exist;

      const badges = [...container.querySelectorAll('.preflight-diff-change-item .preflight-diff-badge')]
        .map((b) => b.textContent);
      expect(badges.length).to.be.greaterThan(0);
      expect(badges.every((label) => label === 'New')).to.equal(true);
    });
  });

  describe('error state', () => {
    it('shows a distinct error state with a retry action on genuine fetch failure', async () => {
      stubFetchPreviewFails();
      render(html`<${DiffPanel} url=${TEST_URL} />`, container);
      await waitFor(() => container.querySelector('.preflight-diff-error'));

      expect(container.querySelector('.preflight-diff-empty')).to.not.exist;
      expect(container.querySelector('.preflight-diff-retry')).to.exist;
    });

    it('retries the load when Retry is clicked', async () => {
      const failStub = stubFetchPreviewFails();
      render(html`<${DiffPanel} url=${TEST_URL} />`, container);
      await waitFor(() => container.querySelector('.preflight-diff-error'));

      failStub.restore();
      stubFetchWithChanges();
      container.querySelector('.preflight-diff-retry').click();

      await waitFor(() => container.querySelector('.preflight-diff-change-item'));
      expect(container.querySelector('.preflight-diff-error')).to.not.exist;
    });
  });

  describe('on-demand loading', () => {
    it('does not fetch until selected, fetches once selected, and does not re-fetch on re-selection', async () => {
      const fetchStub = stubFetchWithChanges();
      render(html`<${DiffPanel} url=${TEST_URL} selected=${false} />`, container);

      // Give any pending microtasks a chance to run; the deferred panel must not have fetched.
      await new Promise((resolve) => { setTimeout(resolve, 0); });
      expect(fetchStub.called).to.equal(false);

      render(html`<${DiffPanel} url=${TEST_URL} selected=${true} />`, container);
      // Wait for the full settle (not just the first fetch call) — loadDiff's fetchVersions()
      // makes three sequential/parallel fetch() calls (status, then preview + live), so
      // capturing callCount right as the first one fires would under-count the original load.
      await waitFor(() => container.querySelector('.preflight-diff-change-item'));
      const callsAfterFirstLoad = fetchStub.callCount;

      // Switching away and back to the tab must not trigger a second fetch — the guard
      // latches synchronously on first activation, before the fetch itself even resolves.
      render(html`<${DiffPanel} url=${TEST_URL} selected=${false} />`, container);
      render(html`<${DiffPanel} url=${TEST_URL} selected=${true} />`, container);
      await new Promise((resolve) => { setTimeout(resolve, 0); });
      expect(fetchStub.callCount).to.equal(callsAfterFirstLoad);
    });

    it('defaults to loading immediately when selected is omitted (back-compat)', async () => {
      const fetchStub = stubFetchWithChanges();
      render(html`<${DiffPanel} url=${TEST_URL} />`, container);
      await waitFor(() => fetchStub.called);
      expect(fetchStub.called).to.equal(true);

      // Drain the in-flight loadDiff so it can't settle mid-way through a later test and
      // clobber the shared, module-level signals (view, contentDiff, ...) out from under it.
      await waitFor(() => container.querySelector('.preflight-diff-change-item'));
    });
  });

  describe('highlight toggle', () => {
    it('re-reads a persisted off-state on mount', async () => {
      window.localStorage.setItem(HIGHLIGHTS_KEY, 'false');
      stubFetchWithChanges();
      render(html`<${DiffPanel} url=${TEST_URL} />`, container);
      await waitFor(() => container.querySelector('.preflight-diff-highlight-toggle'));

      expect(container.querySelector('.preflight-diff').classList.contains('preflight-diff-active')).to.equal(false);
      expect(container.querySelector('.preflight-diff-highlight-toggle').getAttribute('aria-pressed')).to.equal('false');
    });
  });

  describe('with changes', () => {
    beforeEach(async () => {
      stubFetchWithChanges();
      render(html`<${DiffPanel} url=${TEST_URL} />`, container);
      await waitFor(() => container.querySelector('.preflight-diff-change-item'));
    });

    it('lists one change row per change with the right badge', () => {
      const rows = [...container.querySelectorAll('.preflight-diff-change-item')];
      expect(rows).to.have.length(3);
      const badges = rows.map((row) => row.querySelector('.preflight-diff-badge').textContent);
      expect(badges).to.include('New');
      expect(badges).to.include('Changed');
      expect(badges).to.include('Removed');
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
  });

  describe('friendly change labels', () => {
    let rowLabels;

    beforeEach(async () => {
      stubFetchWithLabelChanges();
      render(html`<${DiffPanel} url=${TEST_URL} />`, container);
      await waitFor(() => container.querySelectorAll('.preflight-diff-change-item').length >= 4);
      rowLabels = [...container.querySelectorAll('.preflight-diff-change-item')]
        .map((row) => ({
          text: row.querySelector('.preflight-diff-change-path').textContent,
          title: row.querySelector('.preflight-diff-change-path').getAttribute('title'),
        }));
    });

    it('labels an added image with "Image" plus its alt text', () => {
      const imgRow = rowLabels.find((r) => r.text.startsWith('Image'));
      expect(imgRow.text).to.equal('Image (A cool photo)');
      expect(imgRow.title).to.equal('/div[1]/img[1]');
    });

    it('labels an added heading as "Heading" with truncated quoted text', () => {
      const headingRow = rowLabels.find((r) => r.text.startsWith('Heading'));
      expect(headingRow.text.startsWith('Heading: "')).to.equal(true);
      expect(headingRow.text.length).to.be.lessThan(`Heading: "${LONG_HEADING}"`.length);
      expect(headingRow.text).to.include('…');
    });

    it('labels an added link as "Link" with its text', () => {
      const linkRow = rowLabels.find((r) => r.text.startsWith('Link'));
      expect(linkRow.text).to.equal('Link: "Learn more"');
    });

    it('labels an added button (no special-case tag) with the lowercased tag name', () => {
      const buttonRow = rowLabels.find((r) => r.text.startsWith('button'));
      expect(buttonRow.text).to.equal('button: "Click me"');
    });

    it('keeps the raw xpath as the title attribute for every row', () => {
      rowLabels.forEach((row) => expect(row.title).to.match(/^\//));
    });
  });

  describe('block change labels', () => {
    let rowTexts;

    beforeEach(async () => {
      stubFetchWithBlockChanges();
      render(html`<${DiffPanel} url=${TEST_URL} />`, container);
      await waitFor(() => container.querySelectorAll('.preflight-diff-change-item').length >= 3);
      rowTexts = [...container.querySelectorAll('.preflight-diff-change-path')].map((el) => el.textContent);
    });

    it('labels a block present in preview only as "New block: <TitleCased name>"', () => {
      expect(rowTexts).to.include('New block: Two Up');
    });

    it('labels a block with changed inner text at the same slot as "Changed block: <TitleCased name>"', () => {
      expect(rowTexts).to.include('Changed block: Columns');
    });

    it('labels a block present in live only as "Removed block: <TitleCased name>"', () => {
      expect(rowTexts).to.include('Removed block: Marquee');
    });
  });

  describe('on-page highlighting and jump-to', () => {
    // A real <main>, outside the modal container, standing in for the decorated preview page
    // DiffPanel's on-page wiring resolves against — structurally the same as PREVIEW_HTML above
    // so the change paths from stubFetchWithChanges() resolve onto it.
    let pageMain;
    let preflightModal;
    let sidekick;

    beforeEach(() => {
      pageMain = document.createElement('main');
      pageMain.innerHTML = `
        <div>
          <p>Hello world</p>
          <p>New paragraph</p>
          <h2>Brand new heading</h2>
        </div>`;
      document.body.append(pageMain);

      preflightModal = document.createElement('div');
      preflightModal.id = 'preflight';
      document.body.append(preflightModal);

      sidekick = document.createElement('aem-sidekick');
      document.body.append(sidekick);
    });

    afterEach(() => {
      pageMain.remove();
      preflightModal.remove();
      sidekick.remove();
      document.querySelector('.preflight-return-popover')?.remove();
    });

    it('outlines the added and modified elements on the real page once the diff loads', async () => {
      stubFetchWithChanges();
      render(html`<${DiffPanel} url=${TEST_URL} />`, container);
      await waitFor(() => container.querySelector('.preflight-diff-change-item'));
      await waitFor(() => pageMain.querySelector('.preflight-diff-added'));

      const heading = pageMain.querySelector('h2');
      const modifiedParagraph = [...pageMain.querySelectorAll('p')][1];
      expect(heading.classList.contains('preflight-diff-added')).to.equal(true);
      expect(modifiedParagraph.classList.contains('preflight-diff-modified')).to.equal(true);
      // Removed content never rendered on the preview page — nothing to outline for it.
      expect(pageMain.querySelector('.preflight-diff-removed')).to.not.exist;
    });

    it('removes on-page highlights when the toggle is switched off', async () => {
      stubFetchWithChanges();
      render(html`<${DiffPanel} url=${TEST_URL} />`, container);
      await waitFor(() => container.querySelector('.preflight-diff-change-item'));
      await waitFor(() => pageMain.querySelector('.preflight-diff-added'));

      container.querySelector('.preflight-diff-highlight-toggle').click();
      await waitFor(() => !pageMain.querySelector('.preflight-diff-added'));

      expect(pageMain.querySelector('.preflight-diff-added')).to.not.exist;
      expect(pageMain.querySelector('.preflight-diff-modified')).to.not.exist;
    });

    it('clicking an added change row closes the modal and jumps to it on the page', async () => {
      stubFetchWithChanges();
      render(html`<${DiffPanel} url=${TEST_URL} />`, container);
      await waitFor(() => container.querySelector('.preflight-diff-change-item'));

      const closeSpy = sinon.spy();
      preflightModal.addEventListener('closeModal', closeSpy);

      const addedRow = [...container.querySelectorAll('.preflight-diff-change-item')]
        .find((row) => row.querySelector('.preflight-diff-badge').textContent === 'New');
      addedRow.querySelector('button').click();

      expect(closeSpy.calledOnce).to.equal(true);
      await waitFor(() => document.querySelector('.preflight-return-popover'));
      expect(pageMain.querySelector('h2').classList.contains('preflight-diff-jump-highlight')).to.equal(true);
    });

    it('disables the removed change row so there is nothing to click', async () => {
      stubFetchWithChanges();
      render(html`<${DiffPanel} url=${TEST_URL} />`, container);
      await waitFor(() => container.querySelector('.preflight-diff-change-item'));

      const removedRow = [...container.querySelectorAll('.preflight-diff-change-item')]
        .find((row) => row.querySelector('.preflight-diff-badge').textContent === 'Removed');
      expect(removedRow.querySelector('button').disabled).to.equal(true);
    });
  });
});
