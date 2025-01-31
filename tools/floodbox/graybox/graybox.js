/* eslint-disable import/no-unresolved, no-underscore-dangle, class-methods-use-this */
import { LitElement, html, nothing } from 'https://da.live/deps/lit/dist/index.js';
import getStyle from 'https://da.live/nx/utils/styles.js';
import getSvg from 'https://da.live/nx/public/utils/svg.js';
import crawl from '../crawl-tree.js';
import promoteFiles from '../promote.js';
import previewOrPublishPaths from '../bulk-action.js';
import { SUCCESS_CODES } from '../constants.js';
import getFilesToPromote from './promote-paths.js';
import { validatePaths, getValidGraybox } from './utils.js';
import GrayboxConfig from './graybox-config.js';
import * as floodbox from '../floodbox.js';

const ICONS = [
  'https://da.live/nx/public/icons/Smock_Close_18_N.svg',
  'https://da.live/nx/public/icons/Smock_ChevronDown_18_N.svg',
];

const buttons = await getStyle('https://da.live/nx/styles/buttons.css');
const style = await getStyle(import.meta.url);
const floodboxCss = await getStyle('/tools/floodbox/floodbox.css');

export default class MiloGraybox extends LitElement {
  static properties = {
    repo: { type: String },
    token: { type: String },
  };

  constructor() {
    super();
    this._canPromote = false;
    this._canPromotePaths = false;
    this._tabUiStart = false;
    this._gbExpPath = '';
    this._gbPromoted = false;
    this._startCrawlExp = false;
    this._startCrawlPaths = false;
    this._startPromote = false;
    this._startPromotePaths = false;
    this._invalidInput = false;
    this._startPreviewPublish = false;
    this._filesToPromote = [];
    this._promoteIgnorePaths = [];
    this._promoteIgnoreList = [];
    this._promotedFiles = [];
    this._promotedFilesCount = 0;
    this._promoteErrorList = [];
    this._previewedFilesCount = 0;
    this._previewErrorList = [];
    this._publishedFilesCount = 0;
    this._publishErrorCount = 0;
    this._crawledFiles = [];
    this._crawledFilesCount = 0;
    this._crawlDuration = 0;
    this._promoteDuration = 0;
    this._previewPublishDuration = 0;
    this._selectedOption = 'promoteExp';
    this._promoteIgnore = false;
    this._grayboxConfig = {};

    this.tabUiSteps = [
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

  async startCrawl(experiencePath, expName) {
    const { results, getDuration } = crawl({
      path: experiencePath,
      callback: () => {
        this._crawledFilesCount += 1;
        this.requestUpdate();
      },
      throttle: 10,
      accessToken: this.token,
      crawlType: 'graybox',
      isDraftsOnly: this._grayboxConfig.isDraftsOnly(expName),
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
        isDraftOnly: this._grayboxConfig.isDraftsOnly(exp),
        files: this._filesToPromote,
        callback: (status) => {
          // eslint-disable-next-line no-console
          console.log(`${status.statusCode} :: ${status.filePath}`);
          this._promotedFiles.push(status.filePath);
          if (SUCCESS_CODES.includes(status.statusCode)) {
            this._promotedFilesCount += 1;
          } else {
            this._promoteErrorList.push({ href: status.filePath, status: status.statusCode });
          }
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
      accessToken: this.token,
      callback: (status) => {
        // eslint-disable-next-line no-console
        console.log(`${status.statusCode} :: ${status.aemUrl}`);
        if (SUCCESS_CODES.includes(status.statusCode)) {
          this._previewedFilesCount += 1;
        } else {
          this._previewErrorList.push({ href: status.aemUrl, status: status.statusCode });
        }
        this.requestUpdate();
      },
    });
    this.requestUpdate();
    this._previewPublishDuration = (Date.now() - startTime) / 1000;
    this._gbPromoted = true;
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
    this._tabUiStart = true;
    this._canPromote = false;
    this.requestUpdate();
    await this.readPromoteIgnorePaths();

    // #1 - Start crawling
    const { org, repo, exp } = this.getOrgRepoExp();
    this._startCrawlExp = true;
    floodbox.updateTabUi(this, 'crawl', 100);
    await this.startCrawl(this._gbExpPath, exp);

    // #2 - Start promoting
    this._startPromote = true;
    floodbox.updateTabUi(this, 'promote', 100);
    this.requestUpdate();
    await this.startPromote(org, repo, exp);

    // #3 - Preview promoted files
    this._startPreviewPublish = true;
    floodbox.updateTabUi(this, 'preview', 100);
    await this.startPreviewPublish(org, repo);

    floodbox.updateTabUi(this, 'done', 100);
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
    this._tabUiStart = true;
    this._canPromotePaths = false;
    this.requestUpdate();
    await this.readPromoteIgnorePaths();

    // #2 - Get files to promote from paths
    this._startCrawlPaths = true;
    floodbox.updateTabUi(this, 'crawl', 100);
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
    floodbox.updateTabUi(this, 'promote', 100);
    this.requestUpdate();
    await this.startPromote(org, repo, expName);

    // #4 - Preview promoted files
    this._startPreviewPublish = true;
    floodbox.updateTabUi(this, 'preview', 100);
    await this.startPreviewPublish(org, repo);

    floodbox.updateTabUi(this, 'done', 100);
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
    this._promoteIgnore = false;
    this.requestUpdate();
  }

  async resetApp() {
    const cmp = await getValidGraybox();
    this.replaceWith(cmp);
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
      <div class="tab-step" data-id="done">
        <h3>Done</h3>
        <p>Graybox experience files have been promoted and previewed.</p>
        <button class="accent" @click=${() => this.resetApp()}>Reset</button>
      </div>
    `;
  }

  renderPreviewPublishInfo() {
    return html`
      <div class="tab-step" data-id="preview">
        <h3>Graybox Preview</h3>
        <p>Previewing and Publishing promoted files"... </p>
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
        <p class="${this._previewPublishDuration === 0 ? 'hide' : ''}">Duration: ~${this._previewPublishDuration} seconds</p>
      </div>
    `;
  }

  renderPromoteInfo() {
    return html`
      <div class="tab-step" data-id="promote">
      ${this._selectedOption === 'promoteExp' ? html`
        <h3>Promote Graybox Experience</h3>
        <p>Promoting "${this._gbExpPath}"... </p>
      ` : nothing}
      ${this._selectedOption === 'promotePaths' ? html`
        <h3>Promote Graybox Paths</h3> 
      ` : nothing}
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
      ${this._selectedOption === 'promoteExp' ? html`
        <h3>Crawl Graybox Experience</h3>
        <p>Crawling "${this._gbExpPath}" to promote... </p>
        <div class="detail-cards crawl-cards">
          ${floodbox.renderBadge('Files', this._crawledFilesCount)}
        </div>
      ` : nothing}
      ${this._selectedOption === 'promotePaths' ? html`
        <h3>Crawl Graybox Paths</h3>
        <p>Finding all files to promote... </p>
        <div class="detail-cards crawl-cards">
          ${floodbox.renderBadge('Files', this._filesToPromote.length)}
        </div>
      ` : nothing}
        <p>Duration: ~${this._crawlDuration} seconds</p>
      </div>
      `;
  }

  renderTabUi() {
    return html`
      ${floodbox.renderTabNav(this, this.tabUiSteps)}
      <div class="tabs">
        ${this._startCrawlExp || this._startCrawlPaths ? this.renderCrawlInfo() : nothing}
        ${this._startPromote || this._startPromotePaths ? this.renderPromoteInfo() : nothing}
        ${this._startPreviewPublish ? this.renderPreviewPublishInfo() : nothing}
        ${this._gbPromoted ? this.renderDone() : nothing}
      </div>
  `;
  }

  render() {
    return html`
      <h1>Graybox</h1>
      <h3>Promote Graybox experiences and paths to the source site.</h3>
      <form>
        ${this._selectedOption === 'promoteExp' ? html`
          <div class="input-row">
            <input type="text" class="path-input" name="path" placeholder="Enter Experience Path" value="" @input=${this.validateInput} />
            ${floodbox.renderClearButton()}
          </div>
          ${this._promoteIgnore === true ? html`
            <div class="input-row promote-ignore">
              <textarea class="path-list" name="additionalInfo" rows="3" 
                placeholder="Enter paths to ignore from promote, separated by line-break. Eg:/<org>/<site>/<exp>/<path-to-file>"></textarea>
              ${floodbox.renderClearButton()}
            </div>` : nothing}
          ` : nothing}
        ${this._selectedOption === 'promotePaths' ? html`
          <div class="input-row">
            <textarea name="promotePaths" rows="3" placeholder="Enter graybox paths to promote, separated by line-break" @input=${this.validateInputPaths}></textarea>
            ${floodbox.renderClearButton()}
          </div>
        ` : nothing}
        <div class="button-row">
          <select id="actionSelect" class="action-select" @change=${this.handleOptionChange}>
            <option value="promoteExp">Promote Experience</option>
            <option value="promotePaths">Promote Paths</option>
          </select>
          ${this._selectedOption === 'promoteExp' ? html`
            <div class="button-toggle">
              <input type="checkbox" id="promoteIgnore" name="promoteIgnore" @change=${this.togglePromoteIgnore}>
              <label for="promoteIgnore">Ignore Paths?</label>
            </div>
            <button class="accent" .disabled=${!this._canPromote} @click=${this.handlePromoteExperience}>Promote</button>
          ` : nothing}
          ${this._selectedOption === 'promotePaths' ? html`
            <button class="accent" .disabled=${!this._canPromotePaths} @click=${this.handlePromotePaths}>Promote</button>
          ` : nothing}
        </div>
      </form>
      <div class="tab-ui">
        ${this._tabUiStart ? this.renderTabUi() : nothing}
      </div>
      ${this._invalidInput ? this.renderError() : nothing}
    `;
  }
}

customElements.define('milo-graybox', MiloGraybox);

(async function init() {
  const cmp = await getValidGraybox();
  document.body.appendChild(cmp);
}());
