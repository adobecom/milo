/* eslint-disable import/no-unresolved, no-underscore-dangle, class-methods-use-this */
import { LitElement, html, nothing } from 'https://da.live/deps/lit/dist/index.js';
import getStyle from 'https://da.live/nx/utils/styles.js';
import getSvg from 'https://da.live/nx/public/utils/svg.js';
import crawl from '../crawl-tree.js';
import promoteFiles from '../promote.js';
import { SUCCESS_CODES } from '../constants.js';
import previewOrPublishPaths from '../bulk-action.js';
import FloodgateConfig from './floodgate-config.js';
import copyFiles from './fg-copy.js';
import findFragmentsAndAssets from '../references.js';
import { validatePaths, getValidFloodgate } from './utils.js';
import * as floodbox from '../floodbox.js';

const ICONS = [
  'https://da.live/nx/public/icons/Smock_Close_18_N.svg',
  'https://da.live/nx/public/icons/Smock_ChevronDown_18_N.svg',
];

const buttons = await getStyle('https://da.live/nx/styles/buttons.css');
const style = await getStyle(import.meta.url);
const floodboxCss = await getStyle('/tools/floodbox/floodbox.css');

export default class MiloFloodgate extends LitElement {
  static properties = {
    repo: { type: String },
    token: { type: String },
  };

  constructor() {
    super();
    this._pinkSitePath = '';
    this._canCopyPaths = false;
    this._canPromote = false;
    this._tabUiStart = false;
    this._promoteIgnore = false;
    this._publish = false;
    this._startCrawlPink = false;
    this._startPromote = false;
    this._startCopy = false;
    this._pinkContentPromoted = false;
    this._copiedToPink = false;
    this._invalidInput = false;
    this._startPreview = false;
    this._startPublish = false;
    this._filesToPromote = [];
    this._filesToCopy = [];
    this._copiedFiles = [];
    this._copiedFilesCount = 0;
    this._copiedErrorCount = 0;
    this._copyDuration = 0;
    this._fragmentsAssets = [];
    this._startFindFragmentsAssets = false;
    this._promoteIgnorePaths = [];
    this._promoteIgnoreList = [];
    this._promotedFiles = [];
    this._promotedFilesCount = 0;
    this._promoteErrorList = [];
    this._previewedFilesCount = 0;
    this._previewErrorList = [];
    this._publishedFilesCount = 0;
    this._publishErrorList = [];
    this._crawledFiles = [];
    this._crawlDuration = 0;
    this._promoteDuration = 0;
    this._previewDuration = 0;
    this._publishDuration = 0;
    this._selectedOption = 'fgCopy';
    this._floodgateConfig = {};

    this.tabUiCopy = [
      { id: 'find', title: 'Find' },
      { id: 'copy', title: 'Copy' },
      { id: 'preview', title: 'Preview' },
      { id: 'done', title: 'Done' },
    ];

    this.tabUiPromote = [
      { id: 'crawl', title: 'Crawl' },
      { id: 'promote', title: 'Promote' },
      { id: 'preview', title: 'Preview' },
      { id: 'done', title: 'Done' },
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.adoptedStyleSheets = [buttons, style, floodboxCss];
    getSvg({ parent: this.shadowRoot, paths: ICONS });
  }

  firstUpdated() {
    const select = this.shadowRoot.querySelector('.action-select');
    select.value = this._selectedOption;
  }

  async startCrawlPinkSite() {
    const { results, getDuration } = crawl({
      path: this._pinkSitePath,
      accessToken: this.token,
      crawlType: 'floodgate',
      isDraftsOnly: this._floodgateConfig.isPromoteDraftsOnly,
      callback: () => {
        this.requestUpdate();
      },
    });
    this._crawledFiles = await results;
    this.cleanUpIgnoreFilesFromPromote(this._crawledFiles);
    this._crawlDuration = getDuration();
    this._startPromote = true;
    this.requestUpdate();
  }

  async startPromote(org, repo) {
    if (org && repo && repo.endsWith('-pink')) {
      const startTime = Date.now();
      await promoteFiles({
        accessToken: this.token,
        org,
        repo,
        promoteType: 'floodgate',
        files: this._filesToPromote,
        callback: (status) => {
          // eslint-disable-next-line no-console
          console.log(`${status.statusCode} :: ${status.filePath}`);
          this._promotedFiles.push(status.filePath);
          // eslint-disable-next-line chai-friendly/no-unused-expressions
          if (SUCCESS_CODES.includes(status.statusCode)) {
            this._promotedFilesCount += 1;
          } else {
            this._promoteErrorList.push({ href: status.filePath, status: status.statusCode });
          }
          this.requestUpdate();
        },
      });
      this._promoteDuration = Math.round((Date.now() - startTime) / 1000);
      this._startPreview = true;
      this.requestUpdate();
    }
  }

  async startPreview(org, repoToPrevPub, paths) {
    const startTime = Date.now();
    await previewOrPublishPaths({
      org,
      repo: repoToPrevPub,
      paths,
      action: 'preview',
      callback: (status) => {
        // eslint-disable-next-line no-console
        console.log(`${status.statusCode} :: ${status.aemUrl}`);
        // eslint-disable-next-line chai-friendly/no-unused-expressions
        if (SUCCESS_CODES.includes(status.statusCode)) {
          this._previewedFilesCount += 1;
        } else {
          this._previewErrorList.push({ href: status.aemUrl, status: status.statusCode });
        }
        this.requestUpdate();
      },
    });

    this._previewDuration = (Date.now() - startTime) / 1000;
    this._pinkContentPromoted = true;
    this._copiedToPink = true;
    this.requestUpdate();
  }

  async startPublish(org, repoToPrevPub, paths) {
    const startTime = Date.now();
    await previewOrPublishPaths({
      org,
      repo: repoToPrevPub,
      paths,
      action: 'live',
      callback: (status) => {
        // eslint-disable-next-line no-console
        console.log(`${status.statusCode} :: ${status.aemUrl}`);
        // eslint-disable-next-line chai-friendly/no-unused-expressions
        if (SUCCESS_CODES.includes(status.statusCode)) {
          this._publishedFilesCount += 1;
        } else {
          this._publishErrorList.push({ href: status.aemUrl, status: status.statusCode });
        }
        this.requestUpdate();
      },
    });
    this._publishDuration = (Date.now() - startTime) / 1000;
    this.requestUpdate();
  }

  cleanUpIgnoreFilesFromPromote(files) {
    files.filter((file) => this._promoteIgnorePaths.some((ignorePath) => {
      if (file.path.endsWith(ignorePath) || file.path.includes(ignorePath)) {
        this._promoteIgnoreList.push({ href: file.path, status: 'Ignored' });
      }
      return file.path.endsWith(ignorePath);
    }));

    this._filesToPromote = files.filter((file) => !this._promoteIgnorePaths.some((ignorePath) => {
      if (ignorePath.endsWith('/')) {
        return file.path.includes(ignorePath);
      }
      return file.path.endsWith(ignorePath);
    }));
  }

  getOrgRepo() {
    const input = this.shadowRoot.querySelector('input[name="path"]');
    const path = input.value.trim();
    const parts = path.split('/');
    return {
      org: parts[1],
      repo: parts[2],
    };
  }

  readPromoteIgnorePaths() {
    // add global promote ignore paths
    this._promoteIgnorePaths.push(...this._floodgateConfig.getPromoteIgnorePaths());
    // add user input promote ignore paths
    const promoteIgnoreCheckbox = this.shadowRoot.querySelector('input[name="promoteIgnore"]');
    if (promoteIgnoreCheckbox?.checked) {
      const promoteIgnoreTextArea = this.shadowRoot.querySelector('textarea[name="promote-ignore-paths"]');
      if (promoteIgnoreTextArea) {
        this._promoteIgnorePaths.push(...promoteIgnoreTextArea.value
          .split('\n').map((path) => path.trim()).filter((path) => path.length > 0));
      }
    }
    this._promoteIgnorePaths = this._promoteIgnorePaths.map((path) => {
      if (path.endsWith('/') || path.includes('.')) {
        return path;
      }
      return `${path}.html`;
    });
  }

  async handlePromote(event) {
    event.preventDefault();
    if (!this._canPromote) {
      return;
    }
    this._tabUiStart = true;
    this._canPromote = false;
    this.requestUpdate();
    await this.readPromoteIgnorePaths();

    // #1 - Start Crawling Pink Site
    this._startCrawlPink = true;
    floodbox.updateTabUi(this, 'crawl', 100);
    await this.startCrawlPinkSite();

    // #2 - Start Promoting
    const { org, repo } = this.getOrgRepo();
    this._startPromote = true;
    floodbox.updateTabUi(this, 'promote', 100);
    this.requestUpdate();
    await this.startPromote(org, repo);

    // #3 - Preview Promoted files
    this._startPreview = true;
    const repoToPrev = repo.replace('-pink', '');
    floodbox.updateTabUi(this, 'preview', 100);
    await this.startPreview(org, repoToPrev, this._promotedFiles);

    // #4 - Publish Promoted files
    if (this._publish) {
      this._startPublish = true;
      const repoToPub = repo.replace('-pink', '');
      floodbox.updateTabUi(this, 'publish', 100);
      this.requestUpdate();
      await this.startPublish(org, repoToPub, this._promotedFiles);
    }

    floodbox.updateTabUi(this, 'done', 100);
    this.requestUpdate();
  }

  async startCopy(org, repo) {
    const startTime = Date.now();
    this._startCopy = true;
    await copyFiles({
      accessToken: this.token,
      org,
      repo,
      paths: this._filesToCopy,
      callback: (status) => {
        // eslint-disable-next-line no-console
        console.log(`${status.statusCode} :: ${status.filePath}`);
        this._copiedFiles.push(status.filePath);
        // eslint-disable-next-line chai-friendly/no-unused-expressions
        SUCCESS_CODES.includes(status.statusCode) ? this._copiedFilesCount += 1
          : this._copiedErrorCount += 1;
        this.requestUpdate();
      },
    });
    this._copyDuration = Math.round((Date.now() - startTime) / 1000);
    this._startPreview = true;
    this.requestUpdate();
  }

  async getReferencedFragmentsAndAssets(paths, org, repo) {
    const htmlPaths = paths.filter((path) => !path.endsWith('/') && !path.includes('.'));
    this._fragmentsAssets = await findFragmentsAndAssets({
      accessToken: this.token,
      htmlPaths,
      org,
      repo,
    });
    this._filesToCopy.push(...this._fragmentsAssets);
    // eslint-disable-next-line no-console
    console.log('Paths to copy:', this._filesToCopy);
    this._startFindFragmentsAssets = true;
    this.requestUpdate();
  }

  async handleCopyPaths(event) {
    event.preventDefault();
    if (!this._canCopyPaths) {
      return;
    }
    let paths = this.shadowRoot.querySelector('textarea[name="copyPaths"]').value;
    paths = paths.split('\n').map((path) => path.trim()).filter((path) => path.length > 0);

    // #1 - Validate paths
    const { valid, org, repo } = validatePaths(paths);
    if (!valid) {
      this._invalidInput = true;
      this.requestUpdate();
      return;
    }
    this._filesToCopy = paths;

    // #2 - Find referenced fragments and assets
    this._startFindFragmentsAssets = true;
    await this.getReferencedFragmentsAndAssets(paths, org, repo);

    // #3 - Copy files to pink site
    this._startCopy = true;
    this._pinkSitePath = `/${org}/${repo}-pink`;
    await this.startCopy(org, repo);

    // #4 - Preview copied files
    this._startPreview = true;
    await this.startPreview(org, `${repo}-pink`, this._copiedFiles);
  }

  togglePromoteIgnore(event) {
    this._promoteIgnore = event.target.checked;
    this.requestUpdate();
  }

  togglePublish(event) {
    this._publish = event.target.checked;
    if (this._publish) {
      this.tabUiPromote.pop();
      this.tabUiPromote.push({ id: 'publish', title: 'Publish' });
      this.tabUiPromote.push({ id: 'done', title: 'Done' });
    } else {
      this.tabUiPromote.pop();
      this.tabUiPromote.pop();
      this.tabUiPromote.push({ id: 'done', title: 'Done' });
    }
    this.requestUpdate();
  }

  handleOptionChange(event) {
    this._selectedOption = event.target.value;
    this.requestUpdate();
  }

  handleClear(event) {
    event.preventDefault();
    const field = event.target.previousElementSibling;
    field.value = '';
    this._canCopyPaths = false;
    this._canPromote = false;
    this._promoteIgnore = false;
    this._pinkSitePath = '';
    this.requestUpdate();
  }

  async validateCopyPaths(event) {
    const paths = event.target.value.split('\n').map((path) => path.trim()).filter((path) => path.length > 0);
    const { valid, repo } = validatePaths(paths);
    this._sourceRepo = `${repo}`;
    this._floodgateRepo = `${repo}-pink`;
    this._canCopyPaths = valid;
    this.requestUpdate();
  }

  async validatePromotePath(event) {
    const path = event.target.value.trim();
    // eslint-disable-next-line no-useless-escape
    const pathRegex = /^\/[^\/]+\/[^\/]+-pink$/;
    const valid = pathRegex.test(path);
    this._canPromote = false;
    this._pinkSitePath = '';
    if (valid) {
      const { org, repo } = this.getOrgRepo();
      this._floodgateConfig = new FloodgateConfig(org, repo, this.token);
      await this._floodgateConfig.getConfig();
      if (this._floodgateConfig.isPromoteEnabled === true) {
        this._canPromote = true;
        this._pinkSitePath = path;
        this._sourceRepo = `${repo}`.replace('-pink', '');
        this._floodgateRepo = `${repo}`;
      }
    }
    this.requestUpdate();
  }

  async resetApp() {
    const cmp = await getValidFloodgate();
    this.replaceWith(cmp);
  }

  renderDone() {
    return html`
      <div class="tab-step" data-id="done">
        <h3>Done</h3>
        ${this._selectedOption === 'fgCopy' ? html`
          <p>Selected files have been copied.</p>
        ` : nothing}
        ${this._selectedOption === 'fgPromote' ? html`
          <p>Floodgated files have been promoted and previewed / published.</p>
        ` : nothing}
        <button class="accent" @click=${() => this.resetApp()}>Reset</button>
      </div>
    `;
  }

  renderPublishInfo() {
    return html`
      <div class="tab-step" data-id="publish">
        <h3>Publish Promote Files</h3>
        <p>Publishing promoted files"... </p>
        <div class="detail-cards preview-cards">
          ${floodbox.renderBadge('Remaining', this._previewedFilesCount - this._publishedFilesCount)}
          ${floodbox.renderBadge('Publish Ignored', this._promoteIgnoreList.length, true)}
          ${floodbox.renderBadge('Publish Errors', this._publishErrorList.length, true)}
          ${floodbox.renderBadge('Success', this._publishedFilesCount)}
          ${floodbox.renderBadge('Total', this._publishedFilesCount + this._publishErrorList.length + this._promoteIgnoreList.length)}
        </div>
        <div class="detail-lists">
          ${floodbox.renderList('Publish Ignored', this._promoteIgnoreList)}
          ${floodbox.renderList('Publish Errors', this._previewErrorList)}
        </div>
        <p class="${this._publishDuration === 0 ? 'hide' : ''}">Duration: ~${this._publishDuration} seconds</p>
      </div>
    `;
  }

  renderPreviewInfo() {
    return html`
      <div class="tab-step" data-id="preview">
        <h3>Preview Promote Files</h3>
        <p>Previewing promoted files"... </p>
        <div class="detail-cards preview-cards">
          ${floodbox.renderBadge('Remaining', this._promotedFilesCount - this._previewedFilesCount)}
          ${floodbox.renderBadge('Preview Ignored', this._promoteIgnoreList.length, true)}
          ${floodbox.renderBadge('Preview Errors', this._previewErrorList.length, true)}
          ${floodbox.renderBadge('Success', this._previewedFilesCount)}
          ${floodbox.renderBadge('Total', this._previewedFilesCount + this._previewErrorList.length + this._promoteIgnoreList.length)}
        </div>
        <div class="detail-lists">
          ${floodbox.renderList('Preview Ignored', this._promoteIgnoreList)}
          ${floodbox.renderList('Preview Errors', this._previewErrorList)}
        </div>
        <p class="${this._previewDuration === 0 ? 'hide' : ''}">Duration: ~${this._previewDuration} seconds</p>
      </div>
    `;
  }

  renderPromoteInfo() {
    return html`
      <div class="tab-step" data-id="promote">
        <h3>Promote Floodgated Content</h3>
        <p>Promoting "${this._pinkSitePath}"... </p>
        <div class="detail-cards promote-cards">
          ${floodbox.renderBadge('Remaining', this._filesToPromote.length - this._promotedFilesCount - this._promoteErrorList.length)}
          ${floodbox.renderBadge('Promote Ignored', this._promoteIgnoreList.length, true)}
          ${floodbox.renderBadge('Promote Errors', this._promoteErrorList.length, true)}
          ${floodbox.renderBadge('Success', this._promotedFilesCount)}
          ${floodbox.renderBadge('Total', this._promotedFilesCount + this._promoteErrorList.length + this._promoteIgnoreList.length)}
        </div>
        <div class="detail-lists">
          ${floodbox.renderList('Promote Ignored', this._promoteIgnoreList)}
          ${floodbox.renderList('Promote Errors', this._promoteErrorList)}
        </div>
        <p class="${this._promoteDuration === 0 ? 'hide' : ''}">Duration: ~${this._promoteDuration} seconds</p>
      </div>
    `;
  }

  renderCrawlInfo() {
    return html`
      <div class="tab-step active" data-id="crawl">
        <h3>Crawl Pink Site</h3>
        <p>Crawling "${this._pinkSitePath}" to promote... </p>
        <div class="detail-cards crawl-cards">
          ${floodbox.renderBadge('Files', this._crawledFiles.length)}
        </div>
        <p>Duration: ~${this._crawlDuration} seconds</p>
      </div>
    `;
  }

  renderCopyPreviewInfo() {
    return html`
      <div class="preview-info info-box">
        <h3>Preview Copied Files</h3>
        <p>Previewing copied files... </p>
        <p>Files previewed: ${this._previewedFilesCount} | Preview errors: ${this._previewErrorList.length}</p>
        <p>Duration: ~${this._previewDuration} seconds</p>
      </div>
      ${this._copiedToPink ? this.renderDone() : nothing}
    `;
  }

  renderCopyInfo() {
    return html`
      <div class="copy-info info-box">
        <h3>Copy Content to Pink Site</h3>
        <p>Copying files to "${this._pinkSitePath}"... </p>
        <p>Files to copy: ${this._filesToCopy.length} | Files copied: ${this._copiedFilesCount}</p>
        <p>Copy errors: ${this._copiedErrorCount}</p>
        <p class="${this._copyDuration === 0 ? 'hide' : ''}">Duration: ~${this._copyDuration} seconds</p>
      </div>
      ${this._startPreview ? this.renderCopyPreviewInfo() : nothing}
    `;
  }

  renderReferencedFragmentsAssetsInfo() {
    return html`
      <div class="fragments-assets-info info-box">
        <h3>Find Referenced Fragments and Assets</h3>
        <p>Found ${this._fragmentsAssets.size} referenced fragments and assets.</p>
      </div>
      ${this._startCopy ? this.renderCopyInfo() : nothing}
    `;
  }

  renderTabUi() {
    return html`
      ${this._selectedOption === 'fgCopy' ? html`
        ${floodbox.renderTabNav(this, this.tabUiCopy)}
        <div class="tabs">
          ${this._startFindFragmentsAssets ? this.renderReferencedFragmentsAssetsInfo() : nothing}
        </div>
      ` : nothing}
      ${this._selectedOption === 'fgPromote' ? html`
        ${floodbox.renderTabNav(this, this.tabUiPromote)}
        <div class="tabs">
          ${this._startCrawlPink ? this.renderCrawlInfo() : nothing}
          ${this._startPromote ? this.renderPromoteInfo() : nothing}
          ${this._startPreview ? this.renderPreviewInfo() : nothing}
          ${this._startPublish ? this.renderPublishInfo() : nothing}
          ${this._pinkContentPromoted ? this.renderDone() : nothing}
        </div>
      ` : nothing}
  `;
  }

  render() {
    return html`
      <h1>Floodgate</h1>
      <h3>Provides content administration options to perform pre/post Floodgate events.</h3>
      <form>    
        ${this._selectedOption === 'fgCopy' ? html`
          <div class="input-row">
            <textarea name="copyPaths" rows="10" placeholder="Enter paths to copy to the pink site, separated by line-break." @input=${this.validateCopyPaths}></textarea>
            ${floodbox.renderClearButton()}
          </div>
        ` : nothing}
        ${this._selectedOption === 'fgPromote' ? html`
          <div class="input-row">
            <input type="text" class="path-input" name="path" placeholder="Enter Pink Site Path to Promote" value="/sukamat/da-bacom-pink" @input=${this.validatePromotePath} />
            ${floodbox.renderClearButton()}
          </div>
          ${this._promoteIgnore === true ? html`
            <div class="input-row promote-ignore">
              <textarea class="path-list" name="promote-ignore-paths" rows="5" 
                placeholder="Enter paths to ignore from promote, separated by line-break. Eg:/<org>/<site>-pink/<path-to-file>"></textarea>
              ${floodbox.renderClearButton()}
            </div>` : nothing}
          ` : nothing}
          <div class="button-row">
            <select id="actionSelect" class="action-select" @change=${this.handleOptionChange}>
              <option value="fgCopy">Copy Content To Pink Tree</option>
              <option value="fgPromote">Promote Content From Pink Tree</option>
            </select>
            ${this._selectedOption === 'fgCopy' ? html`
              <button class="accent" .disabled=${!this._canCopyPaths} @click=${this.handleCopyPaths}>Copy</button>
            ` : nothing}
            ${this._selectedOption === 'fgPromote' ? html`
              <div class="button-toggle">
                <input type="checkbox" id="promoteIgnore" name="promoteIgnore" .disabled=${!this._canPromote} @change=${this.togglePromoteIgnore}>
                <label for="promoteIgnore">Paths to ignore from promote?</label>
              </div>
              <div class="button-toggle">
                <input type="checkbox" id="publish" name="publish" .disabled=${!this._canPromote} @change=${this.togglePublish}>
                <label for="publish">Publish files after promote?</label>
              </div>
              <button class="accent" .disabled=${!this._canPromote} @click=${this.handlePromote}>Promote</button>
            ` : nothing}
          </div>   
      </form>
      <div class="tab-ui">
        ${this._tabUiStart ? this.renderTabUi() : nothing}
      </div>
      ${this._startFindFragmentsAssets ? this.renderReferencedFragmentsAssetsInfo() : nothing}
      ${this._canCopyPaths ? html`
        <div>Source Repo: <span>${this._sourceRepo}</span></div>
        <div>Floodgate Repo: <span>${this._floodgateRepo}</span></div
      ` : nothing}
      ${this._canPromote ? html`
        <div>Source Repo: <span>${this._sourceRepo}</span></div>
        <div>Floodgate Repo: <span>${this._floodgateRepo}</span></div>
      ` : nothing}
    `;
  }
}

customElements.define('milo-floodgate', MiloFloodgate);

(async function init() {
  const cmp = await getValidFloodgate();
  document.body.appendChild(cmp);
}());
