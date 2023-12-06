import './bulk-process.js';
import { LitElement, html } from '../../deps/lit-all.min.js';
import { getSheet } from '../../../tools/utils/utils.js';
import {
  MAX,
  TYPES,
  editEntry,
  validPath,
  createJobs,
  selectOverage,
  panelSize,
} from './utils.js';

const styles = await getSheet('/libs/blocks/bulk-publish/bulk-publisher.css');
const loader = await getSheet('/libs/blocks/bulk-publish/loader.css');

class BulkPublish extends LitElement {
  static properties = {
    urls: { state: true },
    processType: { state: true },
    disabled: { state: true },
    editing: { state: true },
    processing: { state: true },
    processes: { state: true },
    openJobsPanel: { state: true },
    viewError: { state: true },
  };

  constructor() {
    super();
    this.urls = [];
    this.processType = 'choose';
    this.disabled = true;
    this.processing = false;
    this.editing = false;
    this.processes = [];
    this.openJobsPanel = false;
    this.viewError = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.renderRoot.adoptedStyleSheets = [styles, loader];
  }

  updated() {
    if (!this.openJobsPanel) {
      panelSize(
        this.renderRoot.getElementById('Urls'),
        this.renderRoot.getElementById('Header'),
      );
    }
  }

  setType(e) {
    if (e.target.value !== this.processType) {
      this.processType = e.target.value;
    }
  }

  setUrls(e) {
    this.urlsValue = e.target.value;
    const urls = e.target.value.replace(/\n/g, ' ').split(' ').filter((ur) => (ur.length));
    this.urls = [...new Set(urls)];
    this.validateUrls();
  }

  validateUrls() {
    let errors = [];
    const urls = this.urls.filter((url) => !validPath(url) && url.length);
    if (urls?.length) errors = [...errors, ...urls];
    if (this.urls.length > MAX) errors.push('limit');
    if (errors.length === 0) errors = this.urls.length === 0;
    this.disabled = errors;
    this.editing = false;
  }

  getError(isMax) {
    const textarea = this.renderRoot.getElementById('Urls');
    return {
      text: isMax ? 'Max Limit' : 'Invalid Url',
      startEdit: () => {
        this.editing = !this.editing;
        if (isMax) selectOverage(textarea, this.urls);
        else editEntry(textarea, this.disabled[0]);
      },
    };
  }

  validateTool() {
    if (typeof this.disabled === 'boolean') return html``;
    const isMax = this.disabled[0] === 'limit';
    const { text, startEdit } = this.getError(isMax);
    startEdit();
    const count = this.disabled.length;
    const counter = count > 1 ? `1/${count} Errors` : '1 Error';
    return html`
      <div class="errors">
        <span>${counter}: <strong>${text}</strong></span>
        <div class="fix-btn" @click=${startEdit}>
          ${this.editing ? 'Next Error' : 'Select Line'}
        </div>
      </div>
    `;
  }

  disableSubmit() {
    return this.disabled === true
      || typeof this.disabled !== 'boolean'
      || this.processType === 'choose';
  }

  formPanel() {
    if (this.openJobsPanel) {
      return html`
        <div class="panel-title" @click=${() => { this.openJobsPanel = false; }}>
          <span class="title">
            <strong>+</strong>
            Start New Job
          </span>
        </div>`;
    }
    return html`
      <div class="process">
        <div class="processor">
          <select 
            id="Process"
            name="select"
            value=${this.processType}
            @change=${this.setType}>
            <option disabled selected value="choose">Choose Process</option>
            ${TYPES.map((type) => (html`<option value=${type}>${type}</option>`))}
          </select>
          <button
            disable=${this.disableSubmit()} 
            @click=${this.submitJob}>
            Run Process
            <span class="loader${this.processing ? '' : ' hide'}"></span>
          </button>
        </div>
        <label class="process-title" for="Urls">
          <strong>PAGE URLs</strong> - <i>Max 1000 per process</i>
        </label>
      </div>
      <div class="urls${typeof this.disabled !== 'boolean' ? ' invalid' : ''}">
        <div class="url-tools">${this.validateTool()}</div>
        <textarea 
          id="Urls"
          placeholder="Example: https://main--milo--adobecom.hlx.page/mypage"
          @change=${this.setUrls}></textarea>
      </div>
    `;
  }

  jobsPanel() {
    return html`
      <div
        class="panel-title"
        @click=${() => { this.openJobsPanel = this.processes.length; }}>
        <span class="title">
          ${this.processes.length ? html`
            <strong>
              ${this.processes.reduce((c, { result }) => c + result.job.data.paths.length, 0)}
            </strong>` : ''}
          My Jobs
        </span>
      </div>
      <div class="job${!this.openJobsPanel ? ' hide' : ''}">
        <div class="job-head">
          <div class="job-url">URL</div>
          <div class="job-meta">
            <span>STATUS</span>
            <span>DATE/TIME</span>
          </div>
        </div>
        <div class="job-list">
          ${this.processes.map((process) => html`
            <bulk-process .process="${process}"></bulk-process>
          `)}
        </div>
      </div>
    `;
  }

  clearForm() {
    this.disabled = true;
    this.urls = [];
    this.processType = 'choose';
    const urls = this.renderRoot.querySelector('#Urls');
    if (urls) urls.value = '';
    const process = this.renderRoot.querySelector('#Process');
    if (process) process.value = 'choose';
  }

  async submitJob() {
    if (!this.disabled) {
      this.processing = true;
      const newJobs = await createJobs(this.processType, this.urls);
      this.openJobsPanel = true;
      this.processes = [...this.processes, ...newJobs];
      this.processing = false;
      this.clearForm();
    }
  }

  render() {
    return html`
      <header id="Header">
        <h1>Bulk Publishing</h1>
      </header>
      <div id="Publish" class="publish-form">
        <div active=${!this.openJobsPanel} class="panel form">${this.formPanel()}</div>
        <div active=${!!this.openJobsPanel} class="panel results">${this.jobsPanel()}</div>
      </div>
    `;
  }
}

customElements.define('bulk-publish', BulkPublish);

export default async function init(el) {
  el.append(document.createElement('bulk-publish'));
}
