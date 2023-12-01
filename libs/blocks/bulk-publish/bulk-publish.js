import { LitElement, html } from '../../deps/lit-all.min.js';
import { getSheet } from '../../../tools/utils/utils.js';
import {
  MAX,
  TYPES,
  editEntry,
  validPath,
  runBulkJob,
  selectOverage,
  handlePanelSize,
} from './utils.js';

const styles = await getSheet('/libs/blocks/bulk-publish/bulk-publish-wc.css');
const loader = await getSheet('/libs/blocks/bulk-publish/loader.css');

class BulkPublish extends LitElement {
  static properties = {
    urls: { state: true },
    processType: { state: true },
    disabled: { state: true },
    editing: { state: true },
    processing: { state: true },
    results: { state: true },
    openResults: { state: true },
    openResult: { state: true },
  };

  constructor() {
    super();
    this.urls = [];
    this.processType = 'choose';
    this.disabled = true;
    this.processing = false;
    this.editing = false;
    this.results = [];
    this.openResults = false;
    this.openResult = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.adoptedStyleSheets = [styles, loader];
  }

  updated() {
    if (!this.openResults) {
      handlePanelSize(
        this.renderRoot.getElementById('Urls'),
        this.renderRoot.getElementById('Panel'),
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
    this.urls = urls;
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

  getEdit(isMax) {
    const textarea = this.renderRoot.getElementById('Urls');
    return {
      text: isMax ? 'URL Max Limit' : 'Invalid Url',
      edit: () => {
        if (!this.editing) {
          this.editing = true;
          if (isMax) selectOverage(textarea, this.urls);
          else editEntry(textarea, this.disabled[0]);
        }
      },
    };
  }

  validationTools() {
    if (typeof this.disabled === 'boolean') return html``;
    const isLimit = this.disabled[0] === 'limit';
    const { text, edit } = this.getEdit(isLimit);
    const count = this.disabled.length;
    const counter = count > 1 ? `1/${count} Errors` : '1 Error';
    return html`
      <div class="errors">
        <span>${counter}: <strong>${text}</strong></span>
        <div class="fix-btn" @click=${edit}>
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

  processForm() {
    if (this.openResults) return html`<div class="panel-title" @click=${() => { this.openResults = false; }}>Start New Job</div>`;
    return html`
      <div class="process">
        <div class="processor">
          <select id="Process" name="select" value=${this.processType} @change=${this.setType}>
            <option disabled selected value="choose">Choose Process</option>
            ${TYPES.map((type) => (html`<option value=${type}>${type}</option>`))}
          </select>
          <button
            disable=${this.disableSubmit()} 
            @click=${this.runJob}>
            Run Job
            <span class="loader${this.processing ? '' : ' hide'}"></span>
          </button>
        </div>
        <label class="process-title" for="Urls">PAGE URLs <i>Max 1000 per process</i></label>
      </div>
      <div class="urls${typeof this.disabled !== 'boolean' ? ' invalid' : ''}">
        <div class="url-tools">${this.validationTools()}</div>
        <textarea 
          id="Urls"
          placeholder="Example: https://main--milo--adobecom.hlx.page/mypage"
          @change=${this.setUrls}></textarea>
      </div>
    `;
  }

  jobResult(result) {
    const { name, status, startTime, topic, data } = result;
    const statusName = status === 202 ? 'success' : 'error';
    const hide = this.openResults ? '' : ' hide';
    return html`
      <div class="job-meta${hide}">
        <h4><span>name:</span> ${name}</h4>
        <h4><span>type:</span> ${topic}</h4>
        <h4 class="${statusName}"><span>status:</span> ${statusName}</h4>
      </div>
      <div class="path-table${hide}">
        <span>URL</span>
        <span>Completed</span>
      </div>
      <div class="paths">
        ${data.map((entry) => html`
          <div class="path">
            <span>${entry.path}</span>
            <span>${startTime}</span>
          </div>
        `)}
      </div>
    `;
  }

  resultsPanel() {
    return html`
      <div class="panel-title" @click=${() => { this.openResults = this.results.length; }}>
        <span class="title">My Jobs ${this.results.length ? html`<strong>${this.results.length}</strong>` : ''}</span>
        <div class="view-results">
          ${this.results.length > 1 ? html`<div @click=${() => { this.openResult += this.openResult; }}>Next</div>` : ''}
        </div>
      </div>
      ${this.results.map((result) => this.jobResult(result)).filter((r, i) => this.openResult === i)}
    `;
  }

  async runJob() {
    if (!this.disabled) {
      this.processing = true;
      const job = await runBulkJob({
        type: this.processType,
        paths: this.urls,
      });
      this.openResults = true;
      this.results = [...this.results, ...[job]];
      this.processing = false;
      this.disabled = true;
      this.urls = [];
      this.processType = 'choose';
      this.renderRoot.querySelector('#Urls').value = '';
      this.renderRoot.querySelector('#Process').value = 'choose';
    }
  }

  render() {
    return html`
      <header>
        <h1>Milo Bulk Publishing</h1>
      </header>
      <div id="Panel" class="publish-form">
        <div active=${!this.openResults} class="panel form">${this.processForm()}</div>
        <div active=${!!this.openResults} class="panel results">${this.resultsPanel()}</div>
      </div>
    `;
  }
}

customElements.define('bulk-publish', BulkPublish);

export default async function init(el) {
  el.append(document.createElement('bulk-publish'));
}
