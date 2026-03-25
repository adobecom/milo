import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

// We test the component class by importing it.
// Top-level awaits (getStyle) resolve because the test server serves the CSS files.
import MiloFloodgate from '../../../../tools/floodbox/floodgate/floodgate.js';
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
    el = null;
    sinon.restore();
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

    it('removes a file at the given index', () => {
      el._filesToProcess = ['/a', '/b', '/c'];
      el.removeFile(1);
      expect(el._filesToProcess).to.deep.equal(['/a', '/c']);
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
  });
});
