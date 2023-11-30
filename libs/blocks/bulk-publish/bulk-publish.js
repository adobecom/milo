import { LitElement, html } from '../../deps/lit-all.min.js';
import { getSheet } from '../../../tools/utils/utils.js';
import {
  MAX,
  TYPES,
  editEntry,
  validPath,
  runBulkJob,
  selectOverage,
  handleResize,
} from './utils.js';

const styles = await getSheet('/libs/blocks/bulk-publish/bulk-publish-wc.css');
const loader = await getSheet('/libs/blocks/bulk-publish/loader.css');

class BulkPublish extends LitElement {
  static properties = {
    urls: { state: true },
    processType: { state: true },
    results: { state: true },
    openPanel: { state: true },
    disabled: { state: true },
    processing: { state: true },
    editing: { state: true },
  };

  constructor() {
    super();
    this.urls = [];
    this.processType = 'choose';
    this.results = null;
    this.openPanel = 0;
    this.disabled = true;
    this.processing = false;
    this.editing = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.adoptedStyleSheets = [styles, loader];
  }

  updated() {
    if (!this.openPanel) {
      handleResize(
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
          ${this.editing ? 'Next' : 'Select'}
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
    if (this.openPanel === 1) return html`<div class="" @click=${() => { this.openPanel = 0; }}>Start New Process</div>`;
    return html`
      <div class="process">
        <div class="processor">
          <select id="process" name="select" value=${this.processType} @change=${this.setType}>
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

  resultsPanel() {
    const getResults = () => {
      if (this.results) return this.results;
      return { name: null, status: null, startTime: null, data: [] };
    };
    const { name, status, startTime, data } = getResults();
    return html`
      <div class="" @click=${() => { this.openPanel = this.results ? 1 : 0; }}>My Processes</div>
      <div class="job-meta${this.openPanel === 1 ? '' : ' hide'}">
        <h4><span>name:</span> ${name}</h4>
        <h4><span>started:</span> ${startTime}</h4>
        <h4><span>status:</span> ${status}</h4>
      </div>
      <div class="paths">
        ${data.map((entry) => html`<div class="path">${entry.path}</div>`)}
      </div>
    `;
  }

  async runJob() {
    if (!this.disabled) {
      this.processing = true;
      this.results = null;
      const process = await runBulkJob({
        type: this.processType,
        paths: this.urls,
      });
      this.openPanel = 1;
      this.results = process;
      this.processing = false;
      this.disabled = true;
      this.urls = [];
      this.processType = 'choose';
      this.renderRoot.querySelector('#urls').value = '';
      this.renderRoot.querySelector('#process').value = 'choose';
    }
  }

  render() {
    return html`
      <header>
        <h1>Milo Bulk Publishing</h1>
      </header>
      <div id="Panel" class="publish-form">
        <div active=${this.openPanel === 0} class="panel form">${this.processForm()}</div>
        <div active=${this.openPanel === 1} class="panel results">${this.resultsPanel()}</div>
      </div>
    `;
  }
}

customElements.define('bulk-publish', BulkPublish);

export default async function init(el) {
  el.append(document.createElement('bulk-publish'));
}
