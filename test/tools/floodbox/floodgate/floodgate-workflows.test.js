/* eslint-disable no-underscore-dangle */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

import { findFragments, runFindStep } from '../../../../tools/floodbox/floodgate/floodgate-workflows.js';
import RequestHandler from '../../../../tools/floodbox/request-handler.js';

const ORG = 'test-org';
const REPO = 'test-repo';

function makeCmp({ files, color, chronoBoxFragmentsEnabled = false }) {
  return {
    token: 'test-token',
    _abortController: undefined,
    _floodgateConfig: { chronoBoxFragmentsEnabled },
    _filesToProcess: [...files],
    _selectedColor: color,
  };
}

const chronoBoxHtml = (json) => `
  <div class="chrono-box">
    <div>
      <div>schedule</div>
      <div>${json}</div>
    </div>
  </div>`;

describe('findFragments (floodgate-workflows)', () => {
  let daFetchStub;

  beforeEach(() => {
    daFetchStub = sinon.stub(RequestHandler.prototype, 'daFetch');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('copy operation', () => {
    it('omits chrono-box fragments when chronoBoxFragmentsEnabled is false', async () => {
      const cmp = makeCmp({
        files: [`/${ORG}/${REPO}/some/dir/page`],
        chronoBoxFragmentsEnabled: false,
      });
      const html = `
        <a href="https://main--${REPO}--${ORG}.aem.page/fragments/from-link">link</a>
        ${chronoBoxHtml('[{"pathToFragment":"fragments/2026-06-10/hero-pre"}]')}`;
      daFetchStub.resolves({ ok: true, text: async () => html });

      await findFragments(cmp, ORG, REPO, 'copy');

      expect(cmp._fragmentsAssets).to.eql(
        new Set([`/${ORG}/${REPO}/fragments/from-link`]),
      );
      expect(cmp._filesToProcess).to.include(`/${ORG}/${REPO}/fragments/from-link`);
      expect(cmp._filesToProcess).to.not.include(
        `/${ORG}/${REPO}/some/dir/fragments/2026-06-10/hero-pre`,
      );
    });

    it('includes chrono-box and schedule-maker fragments when the flag is enabled', async () => {
      const schedulePayload = { blocks: [{ fragmentPath: '/events/events-shared/fragments/sm/blank' }] };
      const scheduleHref = `https://www.adobe.com/ecc/system/tools/schedule-maker?schedule=${btoa(JSON.stringify(schedulePayload))}`;
      const cmp = makeCmp({
        files: [`/${ORG}/${REPO}/some/dir/page`],
        chronoBoxFragmentsEnabled: true,
      });
      const html = `
        <a href="${scheduleHref}">schedule</a>
        ${chronoBoxHtml('[{"pathToFragment":"fragments/2026-06-10/hero-pre"}]')}`;
      daFetchStub.resolves({ ok: true, text: async () => html });

      await findFragments(cmp, ORG, REPO, 'copy');

      expect(cmp._fragmentsAssets).to.eql(new Set([
        `/${ORG}/${REPO}/some/dir/fragments/2026-06-10/hero-pre`,
        `/${ORG}/${REPO}/events/events-shared/fragments/sm/blank`,
      ]));
    });

    it('treats a missing _floodgateConfig as flag-off', async () => {
      const cmp = makeCmp({
        files: [`/${ORG}/${REPO}/some/dir/page`],
        chronoBoxFragmentsEnabled: false,
      });
      cmp._floodgateConfig = undefined;
      const html = chronoBoxHtml('[{"pathToFragment":"fragments/x"}]');
      daFetchStub.resolves({ ok: true, text: async () => html });

      await findFragments(cmp, ORG, REPO, 'copy');

      expect(cmp._fragmentsAssets).to.eql(new Set());
    });

    it('filters folder paths and asset paths out of htmlPaths', async () => {
      const cmp = makeCmp({
        files: [
          `/${ORG}/${REPO}/some/dir/page`,
          `/${ORG}/${REPO}/some/dir/`,
          `/${ORG}/${REPO}/some/file.pdf`,
        ],
      });
      daFetchStub.resolves({ ok: true, text: async () => '' });

      await findFragments(cmp, ORG, REPO, 'copy');

      expect(daFetchStub.callCount).to.equal(1);
      expect(daFetchStub.firstCall.args[0]).to.include(
        `/${ORG}/${REPO}/some/dir/page.html`,
      );
    });
  });

  describe('promote operation', () => {
    it('plumbs the flag through and rewrites fg-{color} paths back to source repo', async () => {
      const color = 'pink';
      const fgRepo = `${REPO}-fg-${color}`;
      const cmp = makeCmp({
        files: [`/${ORG}/${REPO}/some/dir/page`],
        color,
        chronoBoxFragmentsEnabled: true,
      });
      const html = chronoBoxHtml('[{"pathToFragment":"fragments/promo"}]');
      daFetchStub.resolves({ ok: true, text: async () => html });

      await findFragments(cmp, ORG, REPO, 'promote');

      // daFetch is invoked against the fg repo path
      expect(daFetchStub.firstCall.args[0]).to.include(
        `/${ORG}/${fgRepo}/some/dir/page.html`,
      );

      // Resolved fragments come back stripped of the -fg-{color} segment
      expect(cmp._fragmentsAssets).to.eql(
        new Set([`/${ORG}/${REPO}/some/dir/fragments/promo`]),
      );
    });

    it('omits chrono-box fragments when the flag is disabled in promote', async () => {
      const color = 'pink';
      const cmp = makeCmp({
        files: [`/${ORG}/${REPO}/some/dir/page`],
        color,
        chronoBoxFragmentsEnabled: false,
      });
      const html = chronoBoxHtml('[{"pathToFragment":"fragments/promo"}]');
      daFetchStub.resolves({ ok: true, text: async () => html });

      await findFragments(cmp, ORG, REPO, 'promote');

      expect(cmp._fragmentsAssets).to.eql(new Set());
    });
  });
});

describe('runFindStep', () => {
  let daFetchStub;

  beforeEach(() => {
    daFetchStub = sinon.stub(RequestHandler.prototype, 'daFetch');
  });

  afterEach(() => {
    sinon.restore();
  });

  function makeFindStepCmp({ textareaValue, selectedOption = 'fgCopy', signal }) {
    return {
      token: 'test-token',
      _abortController: signal ? { signal } : undefined,
      _floodgateConfig: { chronoBoxFragmentsEnabled: false },
      _filesToProcess: [],
      _notFoundPaths: [],
      _fragmentsAssets: new Set(),
      _findingStatus: '',
      _selectedColor: 'pink',
      _selectedOption: selectedOption,
      _org: ORG,
      _sourceRepo: REPO,
      shadowRoot: {
        querySelector: (sel) => (
          sel === 'textarea[name="paths"]' ? { value: textareaValue } : null
        ),
      },
      requestUpdate: () => {},
    };
  }

  it('populates _notFoundPaths and removes 404 paths from _filesToProcess', async () => {
    const cmp = makeFindStepCmp({ textareaValue: `/${ORG}/${REPO}/some/page` });
    daFetchStub.resolves({ ok: false, status: 404 });

    await runFindStep(cmp);

    expect(cmp._notFoundPaths).to.eql([
      { href: `/${ORG}/${REPO}/some/page`, status: 'Not Found' },
    ]);
    expect(cmp._filesToProcess).to.eql([]);
  });

  it('exits early without fetching when the abort signal is already aborted', async () => {
    const ctrl = new AbortController();
    ctrl.abort();
    const cmp = makeFindStepCmp({
      textareaValue: `/${ORG}/${REPO}/some/page`,
      signal: ctrl.signal,
    });

    await runFindStep(cmp);

    expect(daFetchStub.called).to.be.false;
    expect(cmp._notFoundPaths).to.eql([]);
  });

  it('skips findFragments when the operation is fgDelete', async () => {
    const cmp = makeFindStepCmp({
      textareaValue: `/${ORG}/${REPO}/some/page`,
      selectedOption: 'fgDelete',
    });
    // HEAD checks (validatePathsExist) succeed; no GET should be issued for fragment HTML.
    daFetchStub.resolves({ ok: true, status: 200 });

    await runFindStep(cmp);

    // Only the HEAD existence check happens — never a GET for `${path}.html` content.
    expect(daFetchStub.callCount).to.equal(1);
    expect(daFetchStub.firstCall.args[1]).to.eql({ method: 'HEAD' });
    expect(cmp._fragmentsAssets).to.eql(new Set());
  });
});
