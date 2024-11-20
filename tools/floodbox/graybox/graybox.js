/* eslint-disable import/no-unresolved, no-underscore-dangle, class-methods-use-this */
import DA_SDK from 'https://da.live/nx/utils/sdk.js';
import { LitElement, html, nothing } from 'https://da.live/deps/lit/dist/index.js';
import getStyle from 'https://da.live/nx/utils/styles.js';
import crawl from '../crawl-tree.js';
import promoteFiles from '../promote.js';
import previewOrPublishPaths from '../bulk-action.js';
import { SUCCESS_CODES } from '../constants.js';
import getFilesToPromote from './promote-paths.js';
import validatePaths from './utils.js';
import GrayboxConfig from './graybox-config.js';

const buttons = await getStyle('https://da.live/nx/styles/buttons.css');
const style = await getStyle(import.meta.url);

export default class MiloGraybox extends LitElement {
  static properties = {
    repo: { type: String },
    token: { type: String },
  };

  constructor() {
    super();
    this._canPromote = false;
    this._canPromotePaths = false;
    this._gbExpPath = '';
    this._gbExpPromoted = false;
    this._startCrawlExp = false;
    this._startCrawlPaths = false;
    this._startPromote = false;
    this._startPromotePaths = false;
    this._invalidInput = false;
    this._startPreviewPublish = false;
    this._filesToPromote = [];
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
    this._selectedOption = 'promoteExp';
    this._promoteIgnore = false;
    this._grayboxConfig = {};
  }

  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.adoptedStyleSheets = [buttons, style];
  }

  firstUpdated() {
    const input = this.shadowRoot.querySelector('input[name="path"]');
    if (input) {
      this._gbExpPath = input.value;
    }
    const select = this.shadowRoot.querySelector('.action-select');
    select.value = this._selectedOption;
  }

  getOrgRepoExp() {
    const input = this.shadowRoot.querySelector('input[name="path"]');
    const path = input.value.trim();
    const parts = path.split('/');
    return {
      org: parts[1],
      repo: parts[2],
      exp: parts[3],
    };
  }

  async startCrawl(experiencePath) {
    const { results, getDuration } = crawl({
      path: experiencePath,
      callback: () => {
        this.requestUpdate();
      },
      throttle: 10,
      accessToken: this.token,
      crawlType: 'graybox',
    });
    this._crawledFiles = await results;
    this.cleanUpIgnoreFilesFromPromote(this._crawledFiles);
    this._crawlDuration = getDuration();
    this._startPromote = true;
    this.requestUpdate();
  }

  async startPromote(org, repo, exp) {
    if (org && repo && exp && repo.endsWith('-graybox')) {
      const startTime = Date.now();
      await promoteFiles({
        accessToken: this.token,
        org,
        repo,
        expName: exp,
        promoteType: 'graybox',
        files: this._filesToPromote,
        callback: (status) => {
          // eslint-disable-next-line no-console
          console.log(`${status.statusCode} :: ${status.destinationFilePath}`);
          this._promotedFiles.push(status.destinationFilePath);
          // eslint-disable-next-line chai-friendly/no-unused-expressions
          SUCCESS_CODES.includes(status.statusCode) ? this._promotedFilesCount += 1
            : this._promoteErrorCount += 1;
          this.requestUpdate();
        },
      });
      this._promoteDuration = (Date.now() - startTime) / 1000;
      this._startPreviewPublish = true;
      this.requestUpdate();
    }
  }

  async startPreviewPublish(org, repo) {
    const startTime = Date.now();
    const paths = this._promotedFiles;
    const repoToPrevPub = repo.replace('-graybox', '');
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
        action: 'publish',
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
    this._gbExpPromoted = true;
    this.requestUpdate();
  }

  readPromoteIgnorePaths() {
    // add global promote ignore paths
    this._promoteIgnorePaths.push(...this._grayboxConfig.getGlobalPromoteIgnorePaths());
    // add additional paths from textarea
    const promoteIgnoreCheckbox = this.shadowRoot.querySelector('input[name="promoteIgnore"]');
    if (promoteIgnoreCheckbox?.checked) {
      const promoteIgnoreTextArea = this.shadowRoot.querySelector('textarea[name="additionalInfo"]');
      if (promoteIgnoreTextArea) {
        this._promoteIgnorePaths.push(...promoteIgnoreTextArea.value
          .split('\n')
          .map((path) => path.trim())
          .filter((path) => path.length > 0));
      }
    }
    this._promoteIgnorePaths = this._promoteIgnorePaths.map((path) => {
      if (path.endsWith('/') || path.includes('.')) {
        return path;
      }
      return `${path}.html`;
    });
  }

  async handlePromoteExperience(event) {
    event.preventDefault();
    if (!this._canPromote) {
      return;
    }
    this.readPromoteIgnorePaths();

    // #1 - Start crawling
    this._startCrawlExp = true;
    await this.startCrawl(this._gbExpPath);

    // #2 - Start promoting
    const { org, repo, exp } = this.getOrgRepoExp();
    this._startPromote = true;
    await this.startPromote(org, repo, exp);

    // #3 - Preview promoted files
    this._startPreviewPublish = true;
    await this.startPreviewPublish(org, repo);
  }

  async handlePromotePaths(event) {
    event.preventDefault();
    let paths = this.shadowRoot.querySelector('textarea[name="promotePaths"]').value;
    paths = paths.split('\n').map((path) => path.trim()).filter((path) => path.length > 0);

    // #1 - Validate paths
    const { valid, org, repo, expName } = validatePaths(paths);
    if (!valid) {
      this._invalidInput = true;
      this.requestUpdate();
      return;
    }
    this.readPromoteIgnorePaths();

    // #2 - Get files to promote from paths
    this._startCrawlPaths = true;
    this._crawledFiles = await getFilesToPromote({
      accessToken: this.token,
      org,
      repo,
      expName,
      paths,
    });
    this.cleanUpIgnoreFilesFromPromote(this._crawledFiles);
    // eslint-disable-next-line no-console
    console.log('Files to Promote:', this._filesToPromote);
    this.requestUpdate();

    // #3 - Start promoting
    this._startPromotePaths = true;
    await this.startPromote(org, repo, expName);

    // #4 - Preview promoted files
    this._startPreviewPublish = true;
    await this.startPreviewPublish(org, repo);
  }

  cleanUpIgnoreFilesFromPromote(files) {
    this._filesToPromote = files.filter((file) => !this._promoteIgnorePaths.some((ignorePath) => {
      if (ignorePath.endsWith('/')) {
        return file.path.includes(ignorePath);
      }
      return file.path.endsWith(ignorePath);
    }));
  }

  handleClear(event) {
    event.preventDefault();
    const field = event.target.previousElementSibling;
    field.value = '';
    this._canPromote = false;
    this._gbExpPath = '';
    this.requestUpdate();
  }

  async validateInput(event) {
    const input = event.target;
    // eslint-disable-next-line no-useless-escape
    const regex = /^\/[^\/]+\/[^\/]+-graybox\/[^\/]+$/;
    this._gbExpPath = input.value.trim();
    const valid = regex.test(this._gbExpPath);
    if (valid) {
      const { org, repo, exp } = this.getOrgRepoExp();
      this._grayboxConfig = new GrayboxConfig(org, repo, this.token);
      await this._grayboxConfig.getConfig();
      if (this._grayboxConfig.isPromoteEnabled(exp)) {
        this._canPromote = true;
      } else {
        this._canPromote = false;
        // eslint-disable-next-line no-console
        console.log('Promote is not enabled for this experience.');
      }
    }
    this.requestUpdate();
  }

  async validateInputPaths(event) {
    const textarea = event.target;
    const paths = textarea.value.split('\n').map((path) => path.trim()).filter((path) => path.length > 0);
    const { valid, org, repo, expName } = validatePaths(paths);
    if (valid) {
      this._grayboxConfig = new GrayboxConfig(org, repo, this.token);
      await this._grayboxConfig.getConfig();
      if (this._grayboxConfig.isPromoteEnabled(expName)) {
        this._canPromotePaths = true;
      } else {
        this._canPromotePaths = false;
        // eslint-disable-next-line no-console
        console.log('Promote is not enabled for this experience.');
      }
    }
    this.requestUpdate();
  }

  togglePromoteIgnore(event) {
    this._promoteIgnore = event.target.checked;
    this.requestUpdate();
  }

  handleOptionChange(event) {
    this._selectedOption = event.target.value;
    this.requestUpdate();
  }

  renderError() {
    return html`
      <div class="error info-box">
        <h3>Error</h3>
        <p>Invalid Graybox Experience path(s).</p>
      </div>
    `;
  }

  renderDone() {
    return html`
      <div class="done info-box">
        <h3>Done</h3>
        <p>Graybox experience files have been promoted and previewed/published.</p>
      </div>
    `;
  }

  renderPreviewPublishInfo() {
    return html`
      <div class="preview-publish-info info-box">
        <h3>Preview/Publish Graybox Experience</h3>
        <p>Previewing and Publishing promoted files"... </p>
        <p>Files previewed: ${this._previewedFilesCount} | Preview errors: ${this._previewErrorCount}</p>
        <p>Files published: ${this._publishedFilesCount} | Publish errors: ${this._publishErrorCount}</p>
        <p class="${this._previewPublishDuration === 0 ? 'hide' : ''}">Duration: ~${this._previewPublishDuration} seconds</p>
      </div>
      ${this._gbExpPromoted ? this.renderDone() : nothing}
    `;
  }

  renderPromoteInfo() {
    return html`
      <div class="promote-info info-box">
        <h3>Promote Graybox Experience</h3>
        <p>Promoting "${this._gbExpPath}"... </p>
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
        <h3>Crawl Graybox Experience</h3>
        <p>Crawling "${this._gbExpPath}" to promote... </p>
        <p>Files crawled: ${this._crawledFiles.length}</p>
        <p>Duration: ~${this._crawlDuration} seconds</p>
      </div>
      ${this._startPromote ? this.renderPromoteInfo() : nothing}
      `;
  }

  renderPromotePathsInfo() {
    return html`
      <div class="promote-paths-info info-box">
        <h3>Promote Graybox Paths</h3>        
        <p>Files to promote: ${this._filesToPromote.length} | Files ignored: ${this._crawledFiles.length - this._filesToPromote.length}</p>
        <p>Files promoted: ${this._promotedFilesCount} | Promote errors: ${this._promoteErrorCount}</p>
        <p class="${this._promoteDuration === 0 ? 'hide' : ''}">Duration: ~${this._promoteDuration} seconds</p>
      </div>
      ${this._startPreviewPublish ? this.renderPreviewPublishInfo() : nothing}      
    `;
  }

  renderCrawlPathsInfo() {
    return html`
      <div class="crawl-paths-info info-box">
        <h3>Crawl Graybox Paths</h3>
        <p>Finding all files to promote... </p>
        <p>Files found: ${this._filesToPromote.length}</p>
      </div>
      ${this._startPromotePaths ? this.renderPromotePathsInfo() : nothing}
    `;
  }

  render() {
    return html`
      <h1>Graybox</h1>
      <h3>Promote Graybox experiences and paths to the source site.</h3>
      <form>
        <div class="input-row promote-type">
          <label for="actionSelect">Promote Type:</label>
          <select id="actionSelect" class="action-select" @change=${this.handleOptionChange}>
            <option value="promoteExp">Promote Graybox Experience</option>
            <option value="promotePaths">Promote Graybox Paths</option>            
          </select>
        </div>
        ${this._selectedOption === 'promoteExp' ? html`
          <div class="input-row">
            <input type="text" class="path-input" name="path" placeholder="Enter Experience Path" value="/sukamat/da-bacom-graybox/summit25" @input=${this.validateInput} />
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
              <textarea class="path-list" name="additionalInfo" rows="3" 
                placeholder="Enter paths to ignore from promote, separated by line-break. Eg:/<org>/<site>/<exp>/<path-to-file>"></textarea>
              <button class="primary" @click=${this.handleClear}>Clear</button>
            </div>` : nothing}
            <div class="button-row">
              <button class="accent" .disabled=${!this._canPromote} @click=${this.handlePromoteExperience}>Promote</button>
            </div>          
          ` : nothing}
        ${this._selectedOption === 'promotePaths' ? html`
          <div class="input-row">
            <textarea name="promotePaths" rows="3" placeholder="Enter graybox paths to promote, separated by line-break" @input=${this.validateInputPaths}></textarea>
            <button class="primary" @click=${this.handleClear}>Clear</button>
          </div>
          <div class="button-row">
            <button class="accent" .disabled=${!this._canPromotePaths} @click=${this.handlePromotePaths}>Promote</button>
          </div>
        ` : nothing}
      </form>
      ${this._invalidInput ? this.renderError() : nothing}
      ${this._startCrawlExp ? this.renderCrawlInfo() : nothing}
      ${this._startCrawlPaths ? this.renderCrawlPathsInfo() : nothing}
    `;
  }
}

customElements.define('milo-graybox', MiloGraybox);

(async function init() {
  const { context, token } = await DA_SDK;
  const cmp = document.createElement('milo-graybox');
  cmp.repo = context.repo;
  cmp.token = token;
  document.body.appendChild(cmp);
}());
