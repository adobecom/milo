/* eslint-disable import/no-unresolved, no-underscore-dangle, class-methods-use-this */
import DA_SDK from 'https://da.live/nx/utils/sdk.js';
import { LitElement, html, nothing } from 'https://da.live/deps/lit/dist/index.js';
import getStyle from 'https://da.live/nx/utils/styles.js';
import crawl from '../crawl-tree.js';
import promoteFiles from '../promote.js';
import { SUCCESS_CODES } from '../constants.js';
import previewOrPublishPaths from '../bulk-action.js';
import FloodgateConfig from './floodgate-config.js';
import copyFiles from './fg-copy.js';
import findFragmentsAndAssets from '../references.js';
import validatePaths from './utils.js';
import RequestHandler from '../request-handler.js';

const buttons = await getStyle('https://da.live/nx/styles/buttons.css');
const style = await getStyle(import.meta.url);

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
    this._promoteIgnore = false;
    this._startCrawlPink = false;
    this._startPromote = false;
    this._startCopy = false;
    this._pinkContentPromoted = false;
    this._copiedToPink = false;
    this._invalidInput = false;
    this._startPreviewPublish = false;
    this._filesToPromote = [];
    this._filesToCopy = [];
    this._copiedFiles = [];
    this._copiedFilesCount = 0;
    this._copiedErrorCount = 0;
    this._copyDuration = 0;
    this._fragmentsAssets = [];
    this._startFindFragmentsAssets = false;
    this._promoteIgnorePaths = [];
    this._promotedFiles = [];
    this._promotedFilesCount = 0;
    this._promoteErrorCount = 0;
    this._previewedFilesCount = 0;
    this._previewErrorCount = 0;
    this._publishedFilesCount = 0;
    this._publishErrorCount = 0;
    this._crawledFiles = [];
    this._crawlDuration = 0;
    this._promoteDuration = 0;
    this._previewPublishDuration = 0;
    this._selectedOption = 'fgCopy';
    this._floodgateConfig = {};
  }

  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.adoptedStyleSheets = [buttons, style];
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
          SUCCESS_CODES.includes(status.statusCode) ? this._promotedFilesCount += 1
            : this._promoteErrorCount += 1;
          this.requestUpdate();
        },
      });
      this._promoteDuration = Math.round((Date.now() - startTime) / 1000);
      this._startPreviewPublish = true;
      this.requestUpdate();
    }
  }

  async startPreviewPublish(org, repoToPrevPub, paths) {
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
        SUCCESS_CODES.includes(status.statusCode) ? this._previewedFilesCount += 1
          : this._previewErrorCount += 1;
        this.requestUpdate();
      },
    });
    this.requestUpdate();

    // Publish files if checked
    const publish = this.shadowRoot.querySelector('input[name="publish"]');
    if (publish?.checked) {
      await previewOrPublishPaths({
        org,
        repo: repoToPrevPub,
        paths,
        action: 'live',
        callback: (status) => {
          // eslint-disable-next-line no-console
          console.log(`${status.statusCode} :: ${status.aemUrl}`);
          // eslint-disable-next-line chai-friendly/no-unused-expressions
          SUCCESS_CODES.includes(status.statusCode) ? this._publishedFilesCount += 1
            : this._publishErrorCount += 1;
          this.requestUpdate();
        },
      });
    }
    this._previewPublishDuration = (Date.now() - startTime) / 1000;
    this._pinkContentPromoted = true;
    this._copiedToPink = true;
    this.requestUpdate();
  }

  cleanUpIgnoreFilesFromPromote(files) {
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
    this.readPromoteIgnorePaths();

    // #1 - Start Crawling Pink Site
    this._startCrawlPink = true;
    await this.startCrawlPinkSite();

    // #2 - Start Promoting
    const { org, repo } = this.getOrgRepo();
    this._startPromote = true;
    await this.startPromote(org, repo);

    // #3 - Preview/Publish Promoted files
    this._startPreviewPublish = true;
    const repoToPrevPub = repo.replace('-pink', '');
    await this.startPreviewPublish(org, repoToPrevPub, this._promotedFiles);
  }

  async startCrawlPinkSiteForDelete() {
    const { results, getDuration } = crawl({
      path: this._pinkSitePath,
      accessToken: this.token,
      crawlType: 'floodgate',
      isDraftsOnly: false,
      callback: () => {
        this.requestUpdate();
      },
    });
    this._crawledFiles = await results;
    this._crawlDuration = getDuration();
    this._startUnpublish = true;
    this.requestUpdate();
  }

  async handleDelete(event) {
    event.preventDefault();
    if (!this._canDelete) {
      return;
    }

    // #1 - Start Crawl Pink Site
    this._startCrawlPink = true;
    await this.startCrawlPinkSiteForDelete();

    const { org, repo } = this.getOrgRepo();
    const paths = this._crawledFiles.map((file) => file.path);
    if (repo?.endsWith('-pink')) {
      // #2 - Unpublish Crawled files
      await previewOrPublishPaths({
        org,
        repo,
        paths,
        action: 'live',
        isDelete: true,
        callback: (status) => {
          // eslint-disable-next-line no-console
          console.log(`${status.statusCode} :: ${status.aemUrl}`);
        },
      });

      // #3 - Delete Pink Site
      const reqHandler = new RequestHandler(this.token);
      for (const path of paths) {
        const resp = await reqHandler.deleteContent(path);
        // eslint-disable-next-line no-console
        console.log(`${resp.statusCode} :: ${resp.filePath}`);
      }
    }
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
    this._startPreviewPublish = true;
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
    this._startPreviewPublish = true;
    await this.startPreviewPublish(org, `${repo}-pink`, this._copiedFiles);
  }

  togglePromoteIgnore(event) {
    this._promoteIgnore = event.target.checked;
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

  async validatePromoteDeletePath(event, actionType) {
    const path = event.target.value.trim();
    // eslint-disable-next-line no-useless-escape
    const pathRegex = /^\/[^\/]+\/[^\/]+-pink$/;
    const valid = pathRegex.test(path);
    this._canPromote = false;
    this._canDelete = true;
    this._pinkSitePath = '';
    if (valid) {
      const { org, repo } = this.getOrgRepo();
      this._floodgateConfig = new FloodgateConfig(org, repo, this.token);
      await this._floodgateConfig.getConfig();
      if (actionType === 'promote' && this._floodgateConfig.isPromoteEnabled === true) {
        this._canPromote = true;
        this._pinkSitePath = path;
        this._sourceRepo = `${repo}`.replace('-pink', '');
        this._floodgateRepo = `${repo}`;
      } else if (actionType === 'delete' && this._floodgateConfig.isDeleteEnabled === true) {
        this._canDelete = true;
        this._pinkSitePath = path;
      }
    }
    this.requestUpdate();
  }

  renderDone() {
    return html`
      <div class="done info-box">
        <h3>Done</h3>
        <p>Floodgated files have been promoted and previewed/published.</p>
      </div>
    `;
  }

  renderPreviewPublishInfo() {
    return html`
      <div class="preview-publish-info info-box">
        <h3>Preview/Publish Promote Files</h3>
        <p>Previewing and Publishing promoted files"... </p>
        <p>Files previewed: ${this._previewedFilesCount} | Preview errors: ${this._previewErrorCount}</p>
        <p>Files published: ${this._publishedFilesCount} | Publish errors: ${this._publishErrorCount}</p>
        <p class="${this._previewPublishDuration === 0 ? 'hide' : ''}">Duration: ~${this._previewPublishDuration} seconds</p>
      </div>
      ${this._pinkContentPromoted ? this.renderDone() : nothing}
    `;
  }

  renderPromoteInfo() {
    return html`
      <div class="promote-info info-box">
        <h3>Promote Floodgated Content</h3>
        <p>Promoting "${this._pinkSitePath}"... </p>
        <p>Files to promote: ${this._filesToPromote.length} | Files ignored: ${this._crawledFiles.length - this._filesToPromote.length}</p>
        <p>Files promoted: ${this._promotedFilesCount} | Promote errors: ${this._promoteErrorCount}</p>
        <p class="${this._promoteDuration === 0 ? 'hide' : ''}">Duration: ~${this._promoteDuration} seconds</p>
      </div>
      ${this._startPreviewPublish ? this.renderPreviewPublishInfo() : nothing}
    `;
  }

  renderCrawlInfo() {
    return html`
      <div class="crawl-info info-box">
        <h3>Crawl Pink Site</h3>
        <p>Crawling "${this._pinkSitePath}" to promote... </p>
        <p>Files crawled: ${this._crawledFiles.length}</p>
        <p>Duration: ~${this._crawlDuration} seconds</p>
      </div>
      ${this._startPromote ? this.renderPromoteInfo() : nothing}
      `;
  }

  renderPreviewInfo() {
    return html`
      <div class="preview-info info-box">
        <h3>Preview Copied Files</h3>
        <p>Previewing copied files... </p>
        <p>Files previewed: ${this._previewedFilesCount} | Preview errors: ${this._previewErrorCount}</p>
        <p>Duration: ~${this._previewPublishDuration} seconds</p>
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
      ${this._startPreviewPublish ? this.renderPreviewInfo() : nothing}
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

  render() {
    return html`
      <h1>Floodgate</h1>
      <h3>Provides content administration options to perform pre/post Floodgate events.</h3>
      <form>
        <div class="input-row promote-type">
          <label for="actionSelect">What do you want to do today?</label>
          <select id="actionSelect" class="action-select" @change=${this.handleOptionChange}>
            <option value="fgCopy">Copy Content To Pink Tree</option>
            <option value="fgPromote">Promote Content From Pink Tree</option>
            <option value="fgDelete">Delete Pink Tree</option>        
          </select>
        </div>        
        ${this._selectedOption === 'fgCopy' ? html`
          <div class="input-row">
            <textarea name="copyPaths" rows="10" placeholder="Enter paths to copy to the pink site, separated by line-break." @input=${this.validateCopyPaths}></textarea>
            <button class="primary" @click=${this.handleClear}>Clear</button>
          </div>
          <div class="button-row">
            <button class="accent" .disabled=${!this._canCopyPaths} @click=${this.handleCopyPaths}>Copy</button>
            ${this._canCopyPaths ? html`<div>Source Repo: <span>${this._sourceRepo}</span></div><div>Floodgate Repo: <span>${this._floodgateRepo}</span></div>` : nothing}
          </div>
        ` : nothing}
        ${this._selectedOption === 'fgPromote' ? html`
          <div class="input-row">
            <input type="text" class="path-input" name="path" placeholder="Enter Pink Site Path to Promote" value="/sukamat/da-bacom-pink" @input=${(e) => this.validatePromoteDeletePath(e, 'promote')} />
            <button class="primary" @click=${this.handleClear}>Clear</button>
          </div>
          <div class="input-row">
            <input type="checkbox" id="promoteIgnore" name="promoteIgnore" @change=${this.togglePromoteIgnore}>
            <label for="promoteIgnore">Paths to ignore from promote?</label>
            <input type="checkbox" id="publish" name="publish" disabled>
            <label for="publish">Publish files after promote?</label>
          </div>
          ${this._promoteIgnore === true ? html`
            <div class="input-row promote-ignore">
              <textarea class="path-list" name="promote-ignore-paths" rows="5" 
                placeholder="Enter paths to ignore from promote, separated by line-break. Eg:/<org>/<site>-pink/<path-to-file>"></textarea>
              <button class="primary" @click=${this.handleClear}>Clear</button>
            </div>` : nothing}
            <div class="button-row">
              <button class="accent" .disabled=${!this._canPromote} @click=${this.handlePromote}>Promote</button>
              ${this._canPromote ? html`<div>Source Repo: <span>${this._sourceRepo}</span></div><div>Floodgate Repo: <span>${this._floodgateRepo}</span></div>` : nothing}
            </div>
          ` : nothing}
          ${this._selectedOption === 'fgDelete' ? html`
          <div class="input-row">
            <input type="text" class="path-input" name="path" placeholder="Enter Pink Site Path to Delete" value="/sukamat/da-bacom-pink" @input=${(e) => this.validatePromoteDeletePath(e, 'delete')} />
            <button class="primary" @click=${this.handleClear}>Clear</button>
          </div>
          <div class="button-row">
            <button class="accent" .disabled=${!this._canDelete} @click=${this.handleDelete}>Delete</button>
          </div>` : nothing}
      </form>
      ${this._startCrawlPink ? this.renderCrawlInfo() : nothing}
      ${this._startFindFragmentsAssets ? this.renderReferencedFragmentsAssetsInfo() : nothing}
    `;
  }
}

customElements.define('milo-floodgate', MiloFloodgate);

(async function init() {
  const { context, token } = await DA_SDK;
  const cmp = document.createElement('milo-floodgate');
  cmp.repo = context.repo;
  cmp.token = token;
  document.body.appendChild(cmp);
}());
