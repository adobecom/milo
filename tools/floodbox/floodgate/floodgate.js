/* eslint-disable import/no-unresolved, no-underscore-dangle */
import { LitElement, html, nothing } from 'https://da.live/deps/lit/dist/index.js';
import getStyle from 'https://da.live/nx/utils/styles.js';
import getSvg from 'https://da.live/nx/public/utils/svg.js';
import FloodgateConfig, { evaluateFloodgateAccess } from './floodgate-config.js';
import {
  validatePaths,
  parsePathInput,
  getValidPathsForInput,
  getValidFloodgate,
} from './utils.js';
import * as floodbox from '../floodbox.js';
import {
  runFindStep,
  executeCopy,
  readPromoteIgnorePaths,
  applyPromoteIgnore,
  executePromote,
  executePreview,
  executePublish,
  preparePathsForDelete,
  executeUnpublish,
  executeDelete,
} from './floodgate-workflows.js';
import {
  renderFindStep,
  renderCopyStep,
  renderPromoteStep,
  renderPreviewStep,
  renderPublishStep,
  renderUnpublishStep,
  renderDeleteStep,
  renderDone,
} from './floodgate-render.js';

const ICONS = [
  'https://da.live/nx/public/icons/Smock_Close_18_N.svg',
  'https://da.live/nx/public/icons/Smock_ChevronDown_18_N.svg',
];

const FLOODGATE_HELP_DOC_URL = 'https://main--da-events--adobecom.aem.page/drafts/docs/floodgate';
const FLOODGATE_HELP_ICON_URL = new URL('./help.svg', import.meta.url).href;

const LARGE_OP_THRESHOLD = 50;
const PATHS_STORAGE_KEY = 'floodgate-paths';
// ~5000 typical paths. Above this we refuse to parse to avoid pinning the UI thread.
const MAX_PATHS_INPUT_CHARS = 500_000;

function debounce(fn, ms = 300) {
  let timer;
  return function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

const buttons = await getStyle('https://da.live/nx/styles/buttons.css');
const style = await getStyle(import.meta.url);
const floodboxCss = await getStyle('/tools/floodbox/floodbox.css');

export default class MiloFloodgate extends LitElement {
  static properties = {
    org: { type: String },
    repo: { type: String },
    token: { type: String },
    email: { type: String },
  };

  constructor() {
    super();
    this._email = '';
    this._selectedOption = 'fgCopy';
    this._selectedColor = '';

    this._org = '';
    this._sourceRepo = '';
    this._floodgateRepo = '';
    this._repoReady = false;
    this._prevOrg = '';
    this._prevSourceRepo = '';

    this._pathCount = 0;
    this._pathsRawValue = '';
    this._invalidPathLineIndices = new Set();

    this._previewAfterCopy = false;
    this._publishAfterPromote = false;
    this._promoteIgnore = false;

    this._floodgateConfig = {};
    this._accessMode = 'unknown';
    this._accessInfoMessage = '';
    this._accessBlockScope = 'none';
    this._configLoading = false;
    this._configContextKey = '';
    this._configLoadKey = '';
    this._configLoadPromise = null;
    this._configLoadController = null;
    this._configLoadError = '';
    this._debouncedEvaluateAccess = debounce(() => this._evaluateAccess(), 300);

    this._pathsLines = [];
    this._abortController = null;
    this._tokenInitialized = false;

    this._resetWorkflowState();
  }

  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.adoptedStyleSheets = [buttons, floodboxCss, style];
    getSvg({ parent: this.shadowRoot, paths: ICONS });
    this._email = this.email || '';
  }

  firstUpdated() {
    const select = this.shadowRoot.querySelector('.action-select');
    if (select) select.value = this._selectedOption;

    const savedPaths = sessionStorage.getItem(PATHS_STORAGE_KEY);
    if (savedPaths) {
      const textarea = this.shadowRoot.querySelector('textarea[name="paths"]');
      if (textarea) {
        textarea.value = savedPaths;
        this.handleInputChange({ target: textarea });
      }
    }
  }

  updated(changed) {
    super.updated(changed);
    if (changed.has('token')) {
      if (this._tokenInitialized) {
        this._configLoadController?.abort();
        this._configLoadController = null;
        this._configLoadKey = '';
        this._configLoadPromise = null;
        this._configContextKey = '';
        this._configLoadError = '';
        this._prevOrg = '';
        this._prevSourceRepo = '';
      }
      this._tokenInitialized = true;
    }
    const textarea = this.shadowRoot.querySelector('textarea[name="paths"]');
    const highlight = this.shadowRoot.querySelector('.paths-highlight');
    if (textarea && highlight) {
      highlight.scrollTop = textarea.scrollTop;
      highlight.scrollLeft = textarea.scrollLeft;
    }
  }

  // --- Config & Access ---

  _getPathsFromTextarea() {
    const textarea = this.shadowRoot?.querySelector('textarea[name="paths"]');
    if (!textarea) return [];
    return getValidPathsForInput(
      textarea.value,
      this._selectedOption === 'fgCopy',
      this._selectedColor,
    );
  }

  _applyAccessResult(result) {
    this._accessMode = result.mode;
    this._accessInfoMessage = result.infoMessage || '';
    this._accessBlockScope = result.blockScope;
    const blockedWithMessage = result.errorMessage
      && (result.blockScope === 'paths' || result.blockScope === 'all' || result.blockScope === 'operation');
    if (blockedWithMessage) {
      this._errorMessage = result.errorMessage;
    } else if (result.mode !== 'blocked' || result.blockScope === 'none') {
      this._errorMessage = '';
    }
  }

  async _loadFloodgateConfig() {
    if (!this.token || !this._org || !this._sourceRepo) {
      this._configLoadController?.abort();
      this._configLoadController = null;
      this._floodgateConfig = {};
      this._configLoading = false;
      this._selectedColor = '';
      this._configContextKey = '';
      this._configLoadKey = '';
      this._configLoadPromise = null;
      this._configLoadError = '';
      this.requestUpdate();
      return undefined;
    }

    const key = `${this._org}|${this._sourceRepo}`;
    if (this._configContextKey === key) return undefined;

    // Dedupe in-flight requests for the same key. A concurrent call for a
    // different key supersedes this one (latest wins).
    if (this._configLoadKey === key && this._configLoadPromise) {
      return this._configLoadPromise;
    }

    // Supersede any previous in-flight load
    this._configLoadController?.abort();
    const controller = new AbortController();
    this._configLoadController = controller;

    this._configLoadKey = key;
    this._configLoading = true;
    this._configLoadError = '';
    this.requestUpdate();

    const promise = (async () => {
      try {
        const cfg = new FloodgateConfig(this._org, this._sourceRepo, this.token, controller.signal);
        await cfg.getConfig();

        // Superseded by a later load
        if (this._configLoadKey !== key) return;

        this._floodgateConfig = cfg;
        this._configContextKey = key;

        const colors = cfg.colors ?? [];
        [this._selectedColor] = colors.length > 0 ? colors : [''];

        if (this._sourceRepo && this._selectedColor) {
          this._floodgateRepo = `${this._sourceRepo}-fg-${this._selectedColor}`;
        }
      } catch (err) {
        if (err?.name === 'AbortError') return;
        if (this._configLoadKey !== key) return;
        this._configLoadError = 'Could not load floodgate configuration. Check your network and try again.';
      } finally {
        // Only the most recent loader clears the loading state.
        if (this._configLoadKey === key) {
          this._configLoading = false;
          this._configLoadPromise = null;
          this._configLoadController = null;
          this.requestUpdate();
        }
      }
    })();

    this._configLoadPromise = promise;
    return promise;
  }

  _evaluateAccess() {
    if (this._configLoading || !(this._floodgateConfig instanceof FloodgateConfig)) return;

    const cfg = this._floodgateConfig;
    const accessOpts = {
      allAccessUsers: cfg.allAccessUsers,
      copyOnlyUsers: cfg.copyOnlyUsers,
      draftsAllowed: cfg.draftsAllowed,
      userEmail: this._email,
      org: this._org,
      repo: this._sourceRepo,
    };

    // Determine user role with a copy operation to get the base mode
    const roleCheck = evaluateFloodgateAccess({ ...accessOpts, paths: [], operation: 'copy' });

    // Force operation to copy if user only has copy permissions
    if (roleCheck.mode === 'copyOnly' && this._selectedOption !== 'fgCopy') {
      this._selectedOption = 'fgCopy';
    }

    const opMap = { fgCopy: 'copy', fgPromote: 'promote', fgDelete: 'delete' };
    const operation = opMap[this._selectedOption] || 'copy';
    const paths = this._getPathsFromTextarea();

    const access = evaluateFloodgateAccess({ ...accessOpts, paths, operation });

    this._applyAccessResult(access);
    this.requestUpdate();
  }

  _accessBlocksFind() {
    if (!this.token) return true;
    if (this._configLoading) return true;
    if (!(this._floodgateConfig instanceof FloodgateConfig)) return true;
    if (this._accessBlockScope === 'all') return true;
    if (this._accessBlockScope === 'paths') return true;
    if (this._accessBlockScope === 'operation') return true;
    return false;
  }

  get tabUi() {
    if (this._selectedOption === 'fgCopy') {
      const tabs = [{ id: 'find', title: 'Find' }, { id: 'copy', title: 'Copy' }];
      if (this._previewAfterCopy) tabs.push({ id: 'preview', title: 'Preview' });
      tabs.push({ id: 'done', title: 'Done' });
      return tabs;
    }
    if (this._selectedOption === 'fgPromote') {
      const tabs = [
        { id: 'find', title: 'Find' },
        { id: 'promote', title: 'Promote' },
        { id: 'preview', title: 'Preview' },
      ];
      if (this._publishAfterPromote) tabs.push({ id: 'publish', title: 'Publish' });
      tabs.push({ id: 'done', title: 'Done' });
      return tabs;
    }
    return [
      { id: 'find', title: 'Find' },
      { id: 'unpublish', title: 'Unpublish' },
      { id: 'delete', title: 'Delete' },
      { id: 'done', title: 'Done' },
    ];
  }

  // --- Input Handling ---

  handleInputChange(event) {
    this._pathsRawValue = event.target.value;
    try {
      sessionStorage.setItem(PATHS_STORAGE_KEY, this._pathsRawValue);
    } catch {
      // QuotaExceeded — too large to persist; continue without storing.
    }

    if (this._pathsRawValue.length > MAX_PATHS_INPUT_CHARS) {
      this._invalidPathLineIndices = new Set();
      this._pathsLines = [];
      this._pathCount = 0;
      this._org = '';
      this._sourceRepo = '';
      this._floodgateRepo = '';
      this._canStart = false;
      this._repoReady = false;
      this._errorMessage = `Input is too large (${this._pathsRawValue.length.toLocaleString()} chars). Maximum is ${MAX_PATHS_INPUT_CHARS.toLocaleString()}. Reduce the path list and try again.`;
      this.requestUpdate();
      return;
    }

    const { invalidLines, validPaths, lines } = parsePathInput(
      this._pathsRawValue,
      this._selectedOption === 'fgCopy',
      this._selectedColor,
    );
    this._invalidPathLineIndices = invalidLines;
    this._pathsLines = lines;
    const paths = validPaths;
    this._pathCount = paths.length;

    const { valid, org, repo } = validatePaths(paths);
    const ready = paths.length > 0 && valid;
    this._org = org;
    this._sourceRepo = repo;
    this._floodgateRepo = ready && this._selectedColor ? `${repo}-fg-${this._selectedColor}` : '';
    this._canStart = ready;
    this._repoReady = ready;
    this._errorMessage = '';
    this.requestUpdate();

    const orgChanged = org !== this._prevOrg;
    const repoChanged = repo !== this._prevSourceRepo;
    if (orgChanged || repoChanged) {
      this._prevOrg = org;
      this._prevSourceRepo = repo;
      this._loadFloodgateConfig().then(() => this._evaluateAccess()).catch(() => {});
    } else {
      this._debouncedEvaluateAccess();
    }
  }

  handlePathsScroll(event) {
    const highlight = this.shadowRoot.querySelector('.paths-highlight');
    if (highlight) {
      highlight.scrollTop = event.target.scrollTop;
      highlight.scrollLeft = event.target.scrollLeft;
    }
  }

  handleClear(event) {
    event.preventDefault();
    const textarea = this.shadowRoot.querySelector('textarea[name="paths"]');
    if (textarea) textarea.value = '';
    this.resetState();
    this.requestUpdate();
  }

  handleOptionChange(event) {
    this._selectedOption = event.target.value;
    this._resetWorkflowState();
    const textarea = this.shadowRoot.querySelector('textarea[name="paths"]');
    if (textarea?.value) {
      this.handleInputChange({ target: textarea });
    } else {
      this._evaluateAccess();
    }
  }

  handleColorChange(event) {
    this._selectedColor = event.target.value;
    this._floodgateRepo = this._sourceRepo && this._selectedColor
      ? `${this._sourceRepo}-fg-${this._selectedColor}` : '';
    this._resetWorkflowState();
    const textarea = this.shadowRoot.querySelector('textarea[name="paths"]');
    if (textarea?.value) {
      this.handleInputChange({ target: textarea });
    } else {
      this._evaluateAccess();
    }
  }

  // --- Find Step ---

  async handleStart(event) {
    event.preventDefault();
    if (!this._canStart) return;

    const textarea = this.shadowRoot.querySelector('textarea[name="paths"]');
    const paths = getValidPathsForInput(
      textarea.value,
      this._selectedOption === 'fgCopy',
      this._selectedColor,
    );

    if (paths.length === 0) {
      this._errorMessage = 'Enter at least one valid path. Paths must share the same org/repo and start with /.';
      this.requestUpdate();
      return;
    }

    const { valid } = validatePaths(paths);
    if (!valid) {
      this._errorMessage = 'Could not resolve org/repo from the selected paths.';
      this.requestUpdate();
      return;
    }

    if (!(this._floodgateConfig instanceof FloodgateConfig)) {
      await this._loadFloodgateConfig();
    }
    this._evaluateAccess();
    if (this._configLoading) {
      this._errorMessage = 'Loading configuration…';
      this.requestUpdate();
      return;
    }
    if (this._accessBlocksFind()) {
      if (!this._errorMessage) {
        this._errorMessage = 'You cannot run Find with the current paths or action.';
      }
      this.requestUpdate();
      return;
    }

    this._tabUiStart = true;
    this._canStart = false;
    this._finding = true;
    this._startFind = true;
    this._errorMessage = '';
    this._cancelled = false;
    this._abortController = new AbortController();
    await this.syncWorkflowTab('find');

    let findError;
    try {
      await runFindStep(this);
    } catch (err) {
      if (err?.name !== 'AbortError') findError = err;
    }

    this._finding = false;
    this._findingStatus = '';
    if (findError) {
      this._errorMessage = `Could not finish finding files: ${findError.message || 'network error'}. Please try again.`;
      this._tabUiStart = false;
      this._startFind = false;
      this._canStart = true;
    } else {
      this._actionReady = true;
    }
    this.requestUpdate();
  }

  // --- File List ---

  removeFile(path) {
    const idx = this._filesToProcess.indexOf(path);
    if (idx === -1) return;
    this._filesToProcess.splice(idx, 1);
    this._filesToProcess = [...this._filesToProcess];
    this.requestUpdate();
  }

  // --- Cancel ---

  handleCancel() {
    this._cancelled = true;
    this._abortController?.abort();
    this.requestUpdate();
  }

  // --- Back ---

  handleBack() {
    this._resetWorkflowState();
    const textarea = this.shadowRoot.querySelector('textarea[name="paths"]');
    if (textarea?.value) {
      this.handleInputChange({ target: textarea });
    }
  }

  // --- Retry ---

  retryErrors() {
    const errorPaths = [
      ...this._copiedErrorList.map((e) => e.href),
      ...this._promoteErrorList.map((e) => e.href),
      ...this._previewErrorList.map((e) => e.path),
      ...this._publishErrorList.map((e) => e.path),
      ...this._unpublishErrorList.map((e) => e.href),
      ...this._deleteErrorList.map((e) => e.href),
    ];
    if (errorPaths.length === 0) return;

    const fgSitePath = `/${this._org}/${this._floodgateRepo}`;
    const srcSitePath = `/${this._org}/${this._sourceRepo}`;
    const normalized = errorPaths.map((p) => p.replace(fgSitePath, srcSitePath));

    this._resetWorkflowState();
    const textarea = this.shadowRoot.querySelector('textarea[name="paths"]');
    if (textarea) {
      textarea.value = normalized.join('\n');
      this.handleInputChange({ target: textarea });
    }
  }

  // --- Confirmation Dialog ---

  showConfirmDialog(type, message) {
    this._dialogType = type;
    this._dialogMessage = message;
    this._showDialog = true;
    this.requestUpdate();
  }

  handleConfirm() {
    this._showDialog = false;
    const { _dialogType: action } = this;
    this._dialogType = '';
    this.requestUpdate();

    if (action === 'delete') this.executeDeleteWorkflow();
    else if (action === 'copy') this.executeCopyWorkflow();
    else if (action === 'promote') this.executePromoteWorkflow();
  }

  handleDialogCancel(event) {
    event.preventDefault();
    this._showDialog = false;
    this._dialogType = '';
    this.requestUpdate();
  }

  // --- Copy ---

  handleCopy(event) {
    event.preventDefault();
    if (!this._actionReady) return;

    if (this._filesToProcess.length > LARGE_OP_THRESHOLD) {
      this.showConfirmDialog('copy', `You are about to copy ${this._filesToProcess.length} files. Continue?`);
      return;
    }
    this.executeCopyWorkflow();
  }

  async executeCopyWorkflow() {
    this._actionReady = false;
    this._startCopy = true;
    await this.syncWorkflowTab('copy');

    await executeCopy(this);

    if (!this._cancelled && this._previewAfterCopy) {
      this._startPreview = true;
      await this.syncWorkflowTab('preview');
      await executePreview(
        this,
        this._org,
        `${this._sourceRepo}-fg-${this._selectedColor}`,
        this._copiedFiles,
      );
    }

    this._done = true;
    await this.syncWorkflowTab('done');
  }

  // --- Promote ---

  handlePromote(event) {
    event.preventDefault();
    if (!this._actionReady) return;

    if (this._filesToProcess.length > LARGE_OP_THRESHOLD) {
      this.showConfirmDialog('promote', `You are about to promote ${this._filesToProcess.length} files. Continue?`);
      return;
    }
    this.executePromoteWorkflow();
  }

  async executePromoteWorkflow() {
    this._actionReady = false;
    readPromoteIgnorePaths(this);
    applyPromoteIgnore(this);

    this._startPromote = true;
    await this.syncWorkflowTab('promote');

    await executePromote(this);

    if (!this._cancelled) {
      this._startPreview = true;
      await this.syncWorkflowTab('preview');
      await executePreview(this, this._org, this._sourceRepo, this._promotedFiles);
    }

    if (!this._cancelled && this._publishAfterPromote) {
      this._startPublish = true;
      await this.syncWorkflowTab('publish');
      await executePublish(this, this._org, this._sourceRepo, this._promotedFiles);
    }

    this._done = true;
    await this.syncWorkflowTab('done');
  }

  // --- Delete ---

  handleDeleteClick(event) {
    event.preventDefault();
    if (!this._actionReady) return;
    this.showConfirmDialog(
      'delete',
      `Are you sure you want to delete ${this._filesToProcess.length} files from ${this._floodgateRepo}?`,
    );
  }

  async executeDeleteWorkflow() {
    this._actionReady = false;

    this._startUnpublish = true;
    await this.syncWorkflowTab('unpublish');

    const fgPaths = preparePathsForDelete(this);
    await executeUnpublish(this, fgPaths);

    if (!this._cancelled) {
      this._startDelete = true;
      await this.syncWorkflowTab('delete');
      await executeDelete(this, fgPaths);
    }

    this._done = true;
    await this.syncWorkflowTab('done');
  }

  // --- Toggle Handlers ---

  togglePreviewAfterCopy(event) {
    this._previewAfterCopy = event.target.checked;
    this.requestUpdate();
  }

  togglePublishAfterPromote(event) {
    this._publishAfterPromote = event.target.checked;
    this.requestUpdate();
  }

  togglePromoteIgnore(event) {
    this._promoteIgnore = event.target.checked;
    this.requestUpdate();
  }

  // --- State Management ---

  _resetWorkflowState() {
    this._canStart = false;
    this._finding = false;
    this._findingStatus = '';
    this._actionReady = false;
    this._tabUiStart = false;
    this._errorMessage = '';
    this._cancelled = false;
    this._startFind = false;
    this._startCopy = false;
    this._startPromote = false;
    this._startPreview = false;
    this._startPublish = false;
    this._startUnpublish = false;
    this._startDelete = false;
    this._done = false;
    this._filesToProcess = [];
    this._fragmentsAssets = new Set();
    this._notFoundPaths = [];
    this._promoteIgnorePaths = [];
    this._promoteIgnoreList = [];
    this._copiedFiles = [];
    this._copiedFilesCount = 0;
    this._copiedErrorList = [];
    this._copyDuration = 0;
    this._promotedFiles = [];
    this._promotedFilesCount = 0;
    this._promoteErrorList = [];
    this._promoteDuration = 0;
    this._previewedFilesCount = 0;
    this._previewErrorList = [];
    this._previewedUrls = [];
    this._previewDuration = 0;
    this._publishedFilesCount = 0;
    this._publishErrorList = [];
    this._publishedUrls = [];
    this._publishDuration = 0;
    this._unpublishFilesCount = 0;
    this._unpublishErrorList = [];
    this._unpublishDuration = 0;
    this._deletedFilesCount = 0;
    this._deleteErrorList = [];
    this._deleteDuration = 0;
    this._showDialog = false;
    this._dialogType = '';
    this._dialogMessage = '';
    this.requestUpdate();
  }

  resetState() {
    this._resetWorkflowState();
    sessionStorage.removeItem(PATHS_STORAGE_KEY);
    this._pathCount = 0;
    this._pathsRawValue = '';
    this._pathsLines = [];
    this._invalidPathLineIndices = new Set();
    this._repoReady = false;
    this._org = '';
    this._sourceRepo = '';
    this._floodgateRepo = '';
    this._prevOrg = '';
    this._prevSourceRepo = '';
    this._configLoadController?.abort();
    this._configLoadController = null;
    this._configContextKey = '';
    this._configLoadKey = '';
    this._configLoadPromise = null;
    this._configLoadError = '';
    this._floodgateConfig = {};
    this._selectedColor = '';
    this._configLoading = false;
    this._accessMode = 'unknown';
    this._accessInfoMessage = '';
    this._accessBlockScope = 'none';
    this.requestUpdate();
  }

  async resetApp() {
    const cmp = await getValidFloodgate();
    this.replaceWith(cmp);
  }

  // --- Render Helpers ---

  async syncWorkflowTab(target) {
    this.requestUpdate();
    await this.updateComplete;
    floodbox.updateTabUi(this, target, 0);
  }

  renderPathsHighlight() {
    const lines = this._pathsLines;
    if (!lines || lines.length === 0) return nothing;
    const invalid = this._invalidPathLineIndices;
    return lines.map((line, i) => html`<span class="${invalid.has(i) ? 'path-invalid' : ''}">${line}</span>${i < lines.length - 1 ? '\n' : nothing}`);
  }

  getPlaceholder() {
    const colorCap = this._selectedColor.charAt(0).toUpperCase() + this._selectedColor.slice(1);
    if (this._selectedOption === 'fgCopy') {
      return `Enter paths to copy to the ${colorCap} site, one per line.\nUse * to include all files in a folder (e.g. /org/repo/folder/*)`;
    }
    if (this._selectedOption === 'fgPromote') {
      return `Enter paths to promote from the ${colorCap} site, one per line.\nAccepts source or floodgate repo paths.\nUse * to include all files in a folder.`;
    }
    return `Enter paths to delete from the ${colorCap} site, one per line.\nAccepts source or floodgate repo paths.\nUse * to include all files in a folder.`;
  }

  renderActionButton() {
    const isRunning = this._startCopy || this._startPromote
      || this._startUnpublish;
    return html`
      <button class="accent" type="button"
        .disabled=${!this._canStart || this._finding || isRunning || this._actionReady || this._accessBlocksFind()}
        @click=${(e) => this.handleStart(e)}>
        ${this._finding ? 'Finding...' : 'Find Files'}
      </button>`;
  }

  renderToggles() {
    const disabled = !this.token || (!this._canStart && !this._actionReady) || this._accessBlockScope === 'all';

    if (this._selectedOption === 'fgCopy') {
      return html`
        <div class="button-toggle">
          <input type="checkbox" id="previewAfterCopy" .disabled=${disabled}
            .checked=${this._previewAfterCopy} @change=${(e) => this.togglePreviewAfterCopy(e)}>
          <label for="previewAfterCopy">Preview after copy?</label>
        </div>
      `;
    }

    if (this._selectedOption === 'fgPromote') {
      return html`
        <div class="button-toggle">
          <input type="checkbox" id="publish" .disabled=${disabled}
            .checked=${this._publishAfterPromote} @change=${(e) => this.togglePublishAfterPromote(e)}>
          <label for="publish">Publish after promote?</label>
        </div>
      `;
    }

    return nothing;
  }

  renderConfirmDialog() {
    if (!this._showDialog) return nothing;
    const isDelete = this._dialogType === 'delete';
    return html`
      <div class="dialog-overlay">
        <div class="dialog-box">
          <p>${this._dialogMessage}</p>
          <div class="dialog-buttons">
            <button class="accent" @click=${(e) => this.handleDialogCancel(e)} autofocus>Cancel</button>
            <button class="${isDelete ? 'confirm-btn' : 'accent'}" @click=${() => this.handleConfirm()}>
              ${isDelete ? 'Delete' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderRepoInfo() {
    return html`
      <div class="repo-info">
        <p>Source: <span>${this._sourceRepo}</span></p>
        <p>Floodgate: <span>${this._floodgateRepo}</span></p>
      </div>
    `;
  }

  renderTabUi() {
    return html`
      ${floodbox.renderTabNav(this, this.tabUi)}
      <div class="tabs">
        ${this._startFind ? renderFindStep(this) : nothing}
        ${this._startCopy ? renderCopyStep(this) : nothing}
        ${this._startPromote ? renderPromoteStep(this) : nothing}
        ${this._startPreview ? renderPreviewStep(this) : nothing}
        ${this._startPublish ? renderPublishStep(this) : nothing}
        ${this._startUnpublish ? renderUnpublishStep(this) : nothing}
        ${this._startDelete ? renderDeleteStep(this) : nothing}
        ${this._done ? renderDone(this) : nothing}
      </div>
    `;
  }

  // --- Main Render ---

  render() {
    const isRunning = this._startCopy || this._startPromote || this._startUnpublish;
    return html`
      <div class="floodgate-title-row">
        <h1>Floodgate</h1>
        <a
          class="floodgate-help-link"
          href=${FLOODGATE_HELP_DOC_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Floodgate documentation (opens in new tab)"
        >
          <img src=${FLOODGATE_HELP_ICON_URL} width="18" height="18" alt="" />
        </a>
      </div>
      <h3>Content administration for pre-/post-Floodgate events.</h3>
      ${!this._tabUiStart && this._invalidPathLineIndices.size > 0 ? html`
        <p class="invalid-paths-hint">Invalid paths are highlighted in red.</p>
      ` : nothing}
      <form @submit=${(e) => e.preventDefault()}>
        ${this._repoReady && this._tabUiStart ? html`
          <div class="repo-row repo-row-workflow">${this.renderRepoInfo()}</div>
        ` : nothing}
        ${this._tabUiStart ? html`
          <div class="workflow-shell tab-ui">${this.renderTabUi()}</div>
        ` : nothing}
        <div class="input-row ${this._tabUiStart ? 'hide' : ''}">
          <div class="paths-input-wrap">
            <div class="paths-highlight" aria-hidden="true">${this.renderPathsHighlight()}</div>
            <textarea name="paths"
              .disabled=${this._finding || isRunning}
              rows="10"
              placeholder="${this.getPlaceholder()}"
              @input=${(e) => this.handleInputChange(e)}
              @scroll=${(e) => this.handlePathsScroll(e)}></textarea>
          </div>
          <button class="icon-button clear-button" type="button" @click=${(e) => this.handleClear(e)}>
            <svg class="icon"><use href="#spectrum-close"/></svg>
          </button>
        </div>
        ${!this._tabUiStart && this._pathCount > 0 ? html`
          <p class="path-count">${this._pathCount} path${this._pathCount !== 1 ? 's' : ''}</p>
        ` : nothing}
        ${!this.token && !this._tabUiStart ? html`<p class="access-info-message">Sign in to DA to enable floodgate actions.</p>` : nothing}
        ${this._accessInfoMessage ? html`<p class="access-info-message">${this._accessInfoMessage}</p>` : nothing}
        ${this._configLoadError ? html`<p class="error-message">${this._configLoadError}</p>` : nothing}
        ${this._errorMessage ? html`<p class="error-message">${this._errorMessage}</p>` : nothing}
        <div class="button-row ${this._tabUiStart ? 'hide' : ''}">
          <select class="action-select" .disabled=${!this.token || isRunning} .value=${this._selectedOption} @change=${(e) => this.handleOptionChange(e)}>
            <option value="fgCopy">Copy to Floodgate</option>
            <option value="fgPromote" ?disabled=${this._accessMode === 'copyOnly'}>Promote from Floodgate</option>
            <option value="fgDelete" ?disabled=${this._accessMode === 'copyOnly'}>Delete from Floodgate</option>
          </select>
          <select class="color-select" .disabled=${!this.token || isRunning} .value=${this._selectedColor} @change=${(e) => this.handleColorChange(e)}>
            ${this._floodgateConfig?.colors?.map((color) => html`
              <option value="${color}">${color.charAt(0).toUpperCase() + color.slice(1)}</option>
            `)}
          </select>
          ${this.renderToggles()}
          ${this.renderActionButton()}
        </div>
        <div class="repo-row ${this._tabUiStart ? 'hide' : ''}">
          ${this._repoReady ? this.renderRepoInfo() : nothing}
        </div>
      </form>
      ${this.renderConfirmDialog()}
    `;
  }
}

customElements.define('milo-floodgate', MiloFloodgate);

(async function init() {
  const cmp = await getValidFloodgate();
  document.body.appendChild(cmp);
}());
