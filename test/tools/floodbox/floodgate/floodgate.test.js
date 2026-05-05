/* eslint-disable no-underscore-dangle, object-curly-newline */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

import {
  readPromoteIgnorePaths,
  applyPromoteIgnore,
  prepareFilesForPromote,
  preparePathsForDelete,
} from '../../../../tools/floodbox/floodgate/floodgate-workflows.js';
import {
  aemUrlToPageUrl,
  getDoneSteps,
  stripAdminPreviewPrefixForDisplay,
} from '../../../../tools/floodbox/floodgate/floodgate-render.js';

/** Mock da.live fetches; avoids WTR disallowed-external-fetch console errors. */
function mockDaLiveFetchResponse(url) {
  const u = String(url);
  if (u.includes('.css') || u.includes('/styles/')) {
    return new Response('/* mock */', { status: 200, headers: { 'Content-Type': 'text/css' } });
  }
  if (u.endsWith('.svg') || u.includes('/icons/') || u.includes('Smock_')) {
    return new Response('<svg xmlns="http://www.w3.org/2000/svg"></svg>', { status: 200, headers: { 'Content-Type': 'image/svg+xml' } });
  }
  if (u.includes('floodgate/config.json') || u.includes('.milo/floodgate')) {
    return new Response(JSON.stringify({ data: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
  return new Response('', { status: 200 });
}

function resolveFetchUrl(input) {
  if (typeof input === 'string') return input;
  if (input instanceof Request) return input.url;
  return String(input?.url ?? input ?? '');
}

function installDaLiveFetchStub() {
  const passThrough = window.fetch.bind(window);
  sinon.stub(window, 'fetch').callsFake((input, init) => {
    const s = resolveFetchUrl(input);
    if (s.includes('da.live') || s.includes('admin.da.live')) {
      return Promise.resolve(mockDaLiveFetchResponse(s));
    }
    return passThrough(input, init);
  });
}

before(async () => {
  installDaLiveFetchStub();
  await import('../../../../tools/floodbox/floodgate/floodgate.js');
});

function createComponent() {
  const el = document.createElement('milo-floodgate');
  el.token = 'test-token';
  el.email = 'user@test.com';
  document.body.appendChild(el);
  return el;
}

function removeComponent(el) {
  el?.remove();
}

describe('MiloFloodgate', () => {
  let el;

  afterEach(() => {
    removeComponent(el);
    document.querySelectorAll('milo-floodgate').forEach((node) => node.remove());
    el = null;
    sinon.restore();
    installDaLiveFetchStub();
    sessionStorage.removeItem('floodgate-paths');
  });

  describe('constructor defaults', () => {
    it('sets default state properties', () => {
      el = createComponent();
      expect(el._selectedOption).to.equal('fgCopy');
      expect(el._selectedColor).to.equal('');
      expect(el._org).to.equal('');
      expect(el._sourceRepo).to.equal('');
      expect(el._canStart).to.be.false;
      expect(el._finding).to.be.false;
      expect(el._actionReady).to.be.false;
      expect(el._done).to.be.false;
      expect(el._accessMode).to.equal('unknown');
      expect(el._accessBlockScope).to.equal('none');
      expect(el._configLoading).to.be.false;
      expect(el._filesToProcess).to.deep.equal([]);
      expect(el._copiedErrorList).to.deep.equal([]);
      expect(el._promoteErrorList).to.deep.equal([]);
    });
  });

  describe('_applyAccessResult', () => {
    beforeEach(() => {
      el = createComponent();
    });

    it('sets full access mode', () => {
      el._applyAccessResult({ mode: 'full', blockScope: 'none' });
      expect(el._accessMode).to.equal('full');
      expect(el._accessBlockScope).to.equal('none');
      expect(el._errorMessage).to.equal('');
    });

    it('sets blocked mode with error message for all scope', () => {
      el._applyAccessResult({ mode: 'blocked', blockScope: 'all', errorMessage: 'Not authorized' });
      expect(el._accessMode).to.equal('blocked');
      expect(el._accessBlockScope).to.equal('all');
      expect(el._errorMessage).to.equal('Not authorized');
    });

    it('sets error message for paths scope', () => {
      el._applyAccessResult({ mode: 'blocked', blockScope: 'paths', errorMessage: 'Bad paths' });
      expect(el._errorMessage).to.equal('Bad paths');
    });

    it('sets error message for operation scope', () => {
      el._applyAccessResult({ mode: 'blocked', blockScope: 'operation', errorMessage: 'No promote' });
      expect(el._errorMessage).to.equal('No promote');
    });

    it('clears error when not blocked', () => {
      el._errorMessage = 'old error';
      el._applyAccessResult({ mode: 'draftsOnly', blockScope: 'none', infoMessage: 'Drafts only' });
      expect(el._errorMessage).to.equal('');
      expect(el._accessInfoMessage).to.equal('Drafts only');
    });
  });

  describe('_accessBlocksFind', () => {
    beforeEach(() => {
      el = createComponent();
    });

    it('blocks when there is no token', () => {
      el.token = '';
      expect(el._accessBlocksFind()).to.be.true;
    });

    it('blocks when config is loading', () => {
      el._configLoading = true;
      expect(el._accessBlocksFind()).to.be.true;
    });

    it('blocks when config is not a FloodgateConfig instance', () => {
      el._floodgateConfig = {};
      expect(el._accessBlocksFind()).to.be.true;
    });

    it('blocks when scope is all', () => {
      // Need a real FloodgateConfig to get past the instanceof check
      const FloodgateConfig = el._floodgateConfig.constructor;
      el._floodgateConfig = Object.create(FloodgateConfig.prototype);
      el._accessBlockScope = 'all';
      expect(el._accessBlocksFind()).to.be.true;
    });

    it('blocks when scope is paths', () => {
      el._accessBlockScope = 'paths';
      expect(el._accessBlocksFind()).to.be.true;
    });

    it('blocks when scope is operation', () => {
      el._accessBlockScope = 'operation';
      expect(el._accessBlocksFind()).to.be.true;
    });

    it('does not block when token present, config loaded, and scope is none', async () => {
      // Import FloodgateConfig to create a real instance
      const { default: FC } = await import('../../../../tools/floodbox/floodgate/floodgate-config.js');
      el._floodgateConfig = new FC('org', 'repo', 'token');
      el._configLoading = false;
      el._accessBlockScope = 'none';
      expect(el._accessBlocksFind()).to.be.false;
    });
  });

  describe('tabUi', () => {
    beforeEach(() => {
      el = createComponent();
    });

    it('returns copy tabs by default', () => {
      el._selectedOption = 'fgCopy';
      const tabs = el.tabUi;
      expect(tabs.map((t) => t.id)).to.deep.equal(['find', 'copy', 'done']);
    });

    it('includes preview tab when previewAfterCopy is on', () => {
      el._selectedOption = 'fgCopy';
      el._previewAfterCopy = true;
      const tabs = el.tabUi;
      expect(tabs.map((t) => t.id)).to.deep.equal(['find', 'copy', 'preview', 'done']);
    });

    it('returns promote tabs', () => {
      el._selectedOption = 'fgPromote';
      const tabs = el.tabUi;
      expect(tabs.map((t) => t.id)).to.deep.equal(['find', 'promote', 'preview', 'done']);
    });

    it('includes publish tab when publishAfterPromote is on', () => {
      el._selectedOption = 'fgPromote';
      el._publishAfterPromote = true;
      const tabs = el.tabUi;
      expect(tabs.map((t) => t.id)).to.include('publish');
    });

    it('returns delete tabs', () => {
      el._selectedOption = 'fgDelete';
      const tabs = el.tabUi;
      expect(tabs.map((t) => t.id)).to.deep.equal(['find', 'unpublish', 'delete', 'done']);
    });
  });

  describe('removeFile', () => {
    beforeEach(() => {
      el = createComponent();
    });

    it('removes a file by path', () => {
      el._filesToProcess = ['/a', '/b', '/c'];
      el.removeFile('/b');
      expect(el._filesToProcess).to.deep.equal(['/a', '/c']);
    });

    it('is a no-op when the path is not in the list', () => {
      el._filesToProcess = ['/a', '/b', '/c'];
      el.removeFile('/missing');
      expect(el._filesToProcess).to.deep.equal(['/a', '/b', '/c']);
    });
  });

  describe('handleCancel', () => {
    beforeEach(() => {
      el = createComponent();
    });

    it('sets cancelled flag', () => {
      el.handleCancel();
      expect(el._cancelled).to.be.true;
    });

    it('aborts the abort controller when one is present', () => {
      el._abortController = new AbortController();
      const { signal } = el._abortController;
      expect(signal.aborted).to.be.false;
      el.handleCancel();
      expect(signal.aborted).to.be.true;
    });

    it('is safe when no abort controller has been created yet', () => {
      el._abortController = null;
      expect(() => el.handleCancel()).to.not.throw();
      expect(el._cancelled).to.be.true;
    });
  });

  describe('showConfirmDialog / handleConfirm / handleDialogCancel', () => {
    beforeEach(() => {
      el = createComponent();
    });

    it('opens dialog with type and message', () => {
      el.showConfirmDialog('delete', 'Are you sure?');
      expect(el._showDialog).to.be.true;
      expect(el._dialogType).to.equal('delete');
      expect(el._dialogMessage).to.equal('Are you sure?');
    });

    it('handleDialogCancel closes the dialog', () => {
      el.showConfirmDialog('copy', 'msg');
      el.handleDialogCancel({ preventDefault: () => {} });
      expect(el._showDialog).to.be.false;
      expect(el._dialogType).to.equal('');
    });
  });

  describe('prepareFilesForPromote', () => {
    beforeEach(() => {
      el = createComponent();
      el._org = 'myorg';
      el._sourceRepo = 'myrepo';
      el._selectedColor = 'pink';
    });

    it('maps source paths to fg paths with extensions', () => {
      el._filesToProcess = ['/myorg/myrepo/page'];
      const result = prepareFilesForPromote(el);
      expect(result).to.deep.equal([
        { path: '/myorg/myrepo-fg-pink/page.html', ext: 'html', name: 'page' },
      ]);
    });

    it('preserves existing extensions', () => {
      el._filesToProcess = ['/myorg/myrepo/data.json'];
      const result = prepareFilesForPromote(el);
      expect(result).to.deep.equal([
        { path: '/myorg/myrepo-fg-pink/data.json', ext: 'json', name: 'data.json' },
      ]);
    });
  });

  describe('preparePathsForDelete', () => {
    beforeEach(() => {
      el = createComponent();
      el._org = 'myorg';
      el._sourceRepo = 'myrepo';
      el._selectedColor = 'blue';
    });

    it('maps source paths to fg paths', () => {
      el._filesToProcess = ['/myorg/myrepo/page', '/myorg/myrepo/file.json'];
      const result = preparePathsForDelete(el);
      expect(result).to.deep.equal([
        '/myorg/myrepo-fg-blue/page.html',
        '/myorg/myrepo-fg-blue/file.json',
      ]);
    });
  });

  describe('readPromoteIgnorePaths', () => {
    beforeEach(() => {
      el = createComponent();
    });

    it('reads paths from config getPromoteIgnorePaths', () => {
      el._floodgateConfig = {
        getPromoteIgnorePaths: () => ['/placeholders.json', '/metadata.json'],
      };
      readPromoteIgnorePaths(el);
      expect(el._promoteIgnorePaths).to.deep.equal(['/placeholders.json', '/metadata.json']);
    });

    it('appends .html to paths without extension or trailing slash', () => {
      el._floodgateConfig = {
        getPromoteIgnorePaths: () => ['/my-page'],
      };
      readPromoteIgnorePaths(el);
      expect(el._promoteIgnorePaths).to.deep.equal(['/my-page.html']);
    });

    it('handles missing getPromoteIgnorePaths gracefully', () => {
      el._floodgateConfig = {};
      readPromoteIgnorePaths(el);
      expect(el._promoteIgnorePaths).to.deep.equal([]);
    });
  });

  describe('applyPromoteIgnore', () => {
    beforeEach(() => {
      el = createComponent();
    });

    it('filters files that match ignore paths', () => {
      el._filesToProcess = ['/org/repo/page.html', '/org/repo/placeholders.json', '/org/repo/other.html'];
      el._promoteIgnorePaths = ['/placeholders.json'];
      applyPromoteIgnore(el);
      expect(el._filesToProcess).to.deep.equal(['/org/repo/page.html', '/org/repo/other.html']);
      expect(el._promoteIgnoreList).to.deep.equal([
        { href: '/org/repo/placeholders.json', status: 'Ignored' },
      ]);
    });

    it('filters folder-based ignore paths', () => {
      el._filesToProcess = ['/org/repo/summit25/page.html', '/org/repo/other.html'];
      el._promoteIgnorePaths = ['/summit25/'];
      applyPromoteIgnore(el);
      expect(el._filesToProcess).to.deep.equal(['/org/repo/other.html']);
    });
  });

  describe('aemUrlToPageUrl', () => {
    it('converts admin preview URL to page URL', () => {
      const result = aemUrlToPageUrl('https://admin.aem.page/preview/myorg/myrepo/main/path/to/page');
      expect(result).to.equal('https://main--myrepo--myorg.aem.page/path/to/page');
    });

    it('converts admin live URL to live URL', () => {
      const result = aemUrlToPageUrl('https://admin.aem.page/live/myorg/myrepo/main/path/to/page');
      expect(result).to.equal('https://main--myrepo--myorg.aem.live/path/to/page');
    });

    it('returns original string for invalid URLs', () => {
      expect(aemUrlToPageUrl('not-a-url')).to.equal('not-a-url');
    });

    it('returns the original URL when the path is missing required segments', () => {
      // Missing org/repo/branch — would otherwise emit "main--undefined--undefined."
      expect(aemUrlToPageUrl('https://admin.aem.page/preview'))
        .to.equal('https://admin.aem.page/preview');
      expect(aemUrlToPageUrl('https://admin.aem.page/preview/myorg'))
        .to.equal('https://admin.aem.page/preview/myorg');
      expect(aemUrlToPageUrl('https://admin.aem.page/preview/myorg/myrepo'))
        .to.equal('https://admin.aem.page/preview/myorg/myrepo');
    });

    it('returns a bare host (no path) when only the branch segment is present', () => {
      const result = aemUrlToPageUrl('https://admin.aem.page/preview/myorg/myrepo/main');
      expect(result).to.equal('https://main--myrepo--myorg.aem.page');
    });
  });

  describe('stripAdminPreviewPrefixForDisplay', () => {
    it('strips admin preview prefix', () => {
      expect(stripAdminPreviewPrefixForDisplay('https://admin.aem.page/preview/org/repo/main/page'))
        .to.equal('/org/repo/main/page');
    });

    it('returns empty string for falsy input', () => {
      expect(stripAdminPreviewPrefixForDisplay(null)).to.equal('');
      expect(stripAdminPreviewPrefixForDisplay('')).to.equal('');
    });

    it('returns non-matching strings as-is', () => {
      expect(stripAdminPreviewPrefixForDisplay('/some/path')).to.equal('/some/path');
    });
  });

  describe('getDoneSteps', () => {
    beforeEach(() => {
      el = createComponent();
    });

    it('returns copy steps for fgCopy', () => {
      el._selectedOption = 'fgCopy';
      el._copiedFilesCount = 5;
      el._copiedErrorList = [{ href: '/a', status: 500 }];
      el._copyDuration = 10;
      const { steps, allErrors } = getDoneSteps(el);
      expect(steps).to.have.length(1);
      expect(steps[0].name).to.equal('Copy');
      expect(steps[0].success).to.equal(5);
      expect(steps[0].errors).to.equal(1);
      expect(allErrors).to.have.length(1);
    });

    it('includes preview step for fgCopy when previewAfterCopy and previewDuration > 0', () => {
      el._selectedOption = 'fgCopy';
      el._previewAfterCopy = true;
      el._previewDuration = 5;
      el._copiedFilesCount = 3;
      el._copyDuration = 2;
      el._previewedFilesCount = 3;
      const { steps } = getDoneSteps(el);
      expect(steps).to.have.length(2);
      expect(steps[1].name).to.equal('Preview');
    });

    it('returns promote + preview steps for fgPromote', () => {
      el._selectedOption = 'fgPromote';
      el._promotedFilesCount = 4;
      el._promoteDuration = 3;
      el._previewedFilesCount = 4;
      el._previewDuration = 2;
      const { steps } = getDoneSteps(el);
      expect(steps.map((s) => s.name)).to.deep.equal(['Promote', 'Preview']);
    });

    it('returns unpublish + delete steps for fgDelete', () => {
      el._selectedOption = 'fgDelete';
      el._unpublishFilesCount = 2;
      el._unpublishDuration = 1;
      el._deletedFilesCount = 2;
      el._deleteDuration = 1;
      const { steps } = getDoneSteps(el);
      expect(steps.map((s) => s.name)).to.deep.equal(['Unpublish', 'Delete']);
    });
  });

  describe('_resetWorkflowState', () => {
    beforeEach(() => {
      el = createComponent();
    });

    it('resets workflow state but preserves org/repo/config', () => {
      el._org = 'myorg';
      el._sourceRepo = 'myrepo';
      el._selectedColor = 'pink';
      el._floodgateConfig = { some: 'config' };
      el._copiedFilesCount = 5;
      el._startCopy = true;
      el._done = true;

      el._resetWorkflowState();

      // Workflow state reset
      expect(el._copiedFilesCount).to.equal(0);
      expect(el._startCopy).to.be.false;
      expect(el._done).to.be.false;
      expect(el._filesToProcess).to.deep.equal([]);

      // Config/org/repo preserved
      expect(el._org).to.equal('myorg');
      expect(el._sourceRepo).to.equal('myrepo');
      expect(el._selectedColor).to.equal('pink');
    });
  });

  describe('resetState', () => {
    beforeEach(() => {
      el = createComponent();
    });

    it('fully resets including org, repo, config, and sessionStorage', () => {
      sessionStorage.setItem('floodgate-paths', 'test');
      el._org = 'myorg';
      el._sourceRepo = 'myrepo';
      el._selectedColor = 'pink';
      el._configContextKey = 'myorg|myrepo';

      el.resetState();

      expect(el._org).to.equal('');
      expect(el._sourceRepo).to.equal('');
      expect(el._selectedColor).to.equal('');
      expect(el._configContextKey).to.equal('');
      expect(sessionStorage.getItem('floodgate-paths')).to.be.null;
    });
  });

  describe('toggles', () => {
    beforeEach(() => {
      el = createComponent();
    });

    it('togglePreviewAfterCopy sets flag', () => {
      el.togglePreviewAfterCopy({ target: { checked: true } });
      expect(el._previewAfterCopy).to.be.true;
      el.togglePreviewAfterCopy({ target: { checked: false } });
      expect(el._previewAfterCopy).to.be.false;
    });

    it('togglePublishAfterPromote sets flag', () => {
      el.togglePublishAfterPromote({ target: { checked: true } });
      expect(el._publishAfterPromote).to.be.true;
    });

    it('togglePromoteIgnore sets flag', () => {
      el.togglePromoteIgnore({ target: { checked: true } });
      expect(el._promoteIgnore).to.be.true;
    });
  });

  describe('getPlaceholder', () => {
    beforeEach(() => {
      el = createComponent();
      el._selectedColor = 'pink';
    });

    it('returns copy placeholder for fgCopy', () => {
      el._selectedOption = 'fgCopy';
      expect(el.getPlaceholder()).to.include('copy to the Pink site');
    });

    it('returns promote placeholder for fgPromote', () => {
      el._selectedOption = 'fgPromote';
      expect(el.getPlaceholder()).to.include('promote from the Pink site');
    });

    it('returns delete placeholder for fgDelete', () => {
      el._selectedOption = 'fgDelete';
      expect(el.getPlaceholder()).to.include('delete from the Pink site');
    });
  });

  describe('sessionStorage persistence', () => {
    it('handleInputChange saves to sessionStorage', async () => {
      el = createComponent();
      await el.updateComplete;
      const textarea = el.shadowRoot.querySelector('textarea[name="paths"]');
      textarea.value = '/myorg/myrepo/path1\n/myorg/myrepo/path2';
      el.handleInputChange({ target: textarea });
      expect(sessionStorage.getItem('floodgate-paths')).to.equal('/myorg/myrepo/path1\n/myorg/myrepo/path2');
    });

    it('handleClear removes from sessionStorage', async () => {
      sessionStorage.setItem('floodgate-paths', '/saved/paths');
      el = createComponent();
      await el.updateComplete;
      el.handleClear({ preventDefault: () => {} });
      expect(sessionStorage.getItem('floodgate-paths')).to.be.null;
    });

    it('restores paths from sessionStorage on first mount and parses them', async () => {
      sessionStorage.setItem('floodgate-paths', '/myorg/myrepo/page1\n/myorg/myrepo/page2');
      el = createComponent();
      await el.updateComplete;
      const textarea = el.shadowRoot.querySelector('textarea[name="paths"]');
      expect(textarea.value).to.equal('/myorg/myrepo/page1\n/myorg/myrepo/page2');
      // Parsing should have run during firstUpdated, not been blocked by the
      // initial token-change reset in updated().
      expect(el._org).to.equal('myorg');
      expect(el._sourceRepo).to.equal('myrepo');
      expect(el._pathCount).to.equal(2);
      expect(el._canStart).to.be.true;
      // The config-load controller created during the initial restore must not
      // have been aborted by updated()'s token-change handler.
      expect(el._prevOrg).to.equal('myorg');
      expect(el._prevSourceRepo).to.equal('myrepo');
    });
  });

  describe('handleInputChange path parsing', () => {
    it('sets org, repo, pathCount from valid paths', async () => {
      el = createComponent();
      await el.updateComplete;
      const textarea = el.shadowRoot.querySelector('textarea[name="paths"]');
      textarea.value = '/myorg/myrepo/page1\n/myorg/myrepo/page2';
      el.handleInputChange({ target: textarea });
      expect(el._org).to.equal('myorg');
      expect(el._sourceRepo).to.equal('myrepo');
      expect(el._pathCount).to.equal(2);
      expect(el._canStart).to.be.true;
    });

    it('sets canStart false for invalid paths', async () => {
      el = createComponent();
      await el.updateComplete;
      el.handleInputChange({ target: { value: 'not-a-path' } });
      expect(el._canStart).to.be.false;
    });

    it('refuses to parse input over the size cap and surfaces an error', async () => {
      el = createComponent();
      await el.updateComplete;
      // Build a payload longer than MAX_PATHS_INPUT_CHARS (500_000) without
      // running parsePathInput on it — we want to confirm the early-return path.
      const oversized = '/myorg/myrepo/p'.repeat(40_000); // ~600k chars
      el.handleInputChange({ target: { value: oversized } });
      expect(el._canStart).to.be.false;
      expect(el._pathCount).to.equal(0);
      expect(el._pathsLines).to.eql([]);
      expect(el._errorMessage).to.match(/too large/i);
    });

    it('does not throw when sessionStorage rejects an oversize value', async () => {
      el = createComponent();
      await el.updateComplete;
      const setItem = sinon.stub(window.sessionStorage, 'setItem').throws(new Error('QuotaExceeded'));
      try {
        const big = '/myorg/myrepo/p'.repeat(40_000);
        // Should not throw despite sessionStorage failure + cap trigger.
        el.handleInputChange({ target: { value: big } });
        expect(el._canStart).to.be.false;
      } finally {
        setItem.restore();
      }
    });
  });

  describe('handleStart error handling', () => {
    it('surfaces an error message and resets state when runFindStep throws', async () => {
      el = createComponent();
      await el.updateComplete;
      // Inflight fetches normally pass through to the DA-live stub. Override here
      // so runFindStep's HEAD checks reject with a real network error.
      sinon.restore();
      const fetchStub = sinon.stub(window, 'fetch').rejects(new Error('boom'));

      const textarea = el.shadowRoot.querySelector('textarea[name="paths"]');
      textarea.value = '/myorg/myrepo/page1';
      el.handleInputChange({ target: textarea });

      // Build a real FloodgateConfig with the test user pre-authorized so the
      // access gate passes — we're testing the find-step error path, not access.
      const { default: FC } = await import('../../../../tools/floodbox/floodgate/floodgate-config.js');
      const fc = new FC('myorg', 'myrepo', 'test-token');
      fc.allAccessUsers = ['user@test.com'];
      fc.colors = ['pink'];
      el._floodgateConfig = fc;
      el._configContextKey = 'myorg|myrepo';
      el._selectedColor = 'pink';
      el._canStart = true;

      try {
        await el.handleStart({ preventDefault: () => {} });
      } finally {
        fetchStub.restore();
      }

      expect(el._finding).to.be.false;
      expect(el._tabUiStart).to.be.false;
      expect(el._errorMessage).to.match(/Could not finish finding files/);
      expect(el._actionReady).to.not.be.true;
    });
  });

  describe('config load supersession', () => {
    it('aborts the in-flight config controller when token changes', async () => {
      el = createComponent();
      await el.updateComplete;
      // Simulate an in-flight load
      const controller = new AbortController();
      el._configLoadController = controller;
      el._configLoadKey = 'org|repo';
      el._configLoadPromise = Promise.resolve();
      el._configContextKey = 'org|repo';

      el.token = 'new-token';
      await el.updateComplete;

      expect(controller.signal.aborted).to.be.true;
      expect(el._configLoadController).to.be.null;
      expect(el._configLoadKey).to.equal('');
      expect(el._configLoadPromise).to.be.null;
      expect(el._configContextKey).to.equal('');
    });
  });
});
