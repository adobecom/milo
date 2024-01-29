import './job-process.js';
import { LitElement, html } from '../../deps/lit-all.min.js';
import { getSheet } from '../../../tools/utils/utils.js';
import { connectSidekick, startJobProcess } from './services.js';
import { getConfig } from '../../utils/utils.js';
import {
  editEntry,
  FORM_MODES,
  getJobErrorText,
  processJobResult,
  PROCESS_TYPES,
  sticky,
  validMiloURL,
  delay,
} from './utils.js';

const { miloLibs, codeRoot } = getConfig();
const base = miloLibs || codeRoot || 'libs';
const styleSheet = await getSheet(`${base}/blocks/bulk-publish/bulk-publisher.css`);
const loaderSheet = await getSheet(`${base}/blocks/bulk-publish/loader.css`);
const backgroundImg = `${base}/blocks/bulk-publish/img/background.svg`;
const downArrowIcon = `${base}/blocks/bulk-publish/img/downarrow.svg`;
const checkmarkIcon = `${base}/blocks/bulk-publish/img/checkmark.svg`;
const clearJobsIcon = `${base}/blocks/bulk-publish/img/remove.svg`;

class BulkPublish extends LitElement {
  static properties = {
    mode: { state: true },
    urls: { state: true },
    process: { state: true },
    disabled: { state: true },
    editing: { state: true },
    processing: { state: true },
    jobs: { state: true },
    openJobs: { state: true },
    jobErrors: { state: true },
    user: { state: true },
  };

  constructor() {
    super();
    this.mode = sticky().get('mode');
    this.urls = [];
    this.process = 'choose';
    this.disabled = true;
    this.editing = false;
    this.processing = false;
    this.jobs = [];
    this.openJobs = false;
    this.jobErrors = false;
    this.user = null;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.renderRoot.adoptedStyleSheets = [styleSheet, loaderSheet];
    connectSidekick(this);
    const resume = sticky().get('resume');
    if (resume.length) {
      this.jobs = resume;
      await delay(1000);
      this.openJobs = true;
      this.processing = 'resumed';
    }
  }

  async updated() {
    const storage = sticky();
    if (storage.get('mode') !== this.mode) {
      storage.set('mode', this.mode);
    }
    if (this.jobs.length) {
      const resumeable = this.jobs.filter((job) => !job.status);
      storage.set('resume', resumeable);
    }
    const textarea = this.renderRoot.querySelector('#Urls');
    if (this.urls.length && textarea?.value === '') {
      textarea.value = this.urls.join('\r\n');
    }
  }

  setType(e) {
    if (e.target.value !== this.process) {
      this.process = e.target.value;
    }
  }

  setUrls(e) {
    const urls = e.target.value.replace(/\n/g, ' ').split(' ').filter((ur) => (ur.length));
    this.urls = [...new Set(urls)];
    this.validateUrls();
  }

  setJobErrors(errors) {
    const urls = [];
    errors.forEach((error) => {
      const matched = this.urls.filter((url) => {
        if (Array.isArray(error.href)) return error.href.includes(url);
        return url.includes(error.href);
      });
      matched.forEach((match) => urls.push(match));
    });
    const textarea = this.renderRoot.querySelector('#Urls');
    textarea.value = urls.join('\r\n');
    if (['delete', 'unpublish'].includes(this.process)) {
      this.urls = urls;
    }
    this.disabled = urls;
    this.jobErrors = { urls, messages: errors.map((error) => (error.message)) };
  }

  validateUrls() {
    let errors = [];
    const invalid = this.jobErrors?.urls?.length
      ? this.urls.filter((url) => this.jobErrors.urls.includes(url))
      : this.urls.filter((url) => !validMiloURL(url) && url.length);

    if (invalid?.length) {
      errors = [...errors, ...invalid];
    }
    if (errors.length === 0) {
      errors = this.urls.length === 0;
    }
    this.disabled = errors;
    this.editing = false;
  }

  renderErrorBar() {
    if (typeof this.disabled === 'boolean') return html``;
    const { text, startEdit } = this.getErrorProps();
    startEdit();
    const count = this.disabled.length;
    const btnText = this.editing ? 'Next Error' : 'Select Line';
    return html`
      <div class="errors">
        <span>Error: <strong>${text}</strong></span>
        <div class="fix-btn" @click=${() => startEdit(true)}>
          ${count === 1 ? 'Finish Up' : btnText}
        </div>
      </div>
    `;
  }

  getErrorProps() {
    const textarea = this.renderRoot.getElementById('Urls');
    let text = 'Invalid Url';
    if (this.jobErrors) {
      text = getJobErrorText(this.jobErrors, this.process);
    }
    return {
      text,
      startEdit: (click = null) => {
        this.editing = !this.editing;
        if (click) {
          if (this.jobErrors.length === 1) {
            this.jobErrors = false;
          } else {
            Object.keys(this.jobErrors).forEach((key) => this.jobErrors[key].shift());
          }
          this.validateUrls();
        } else {
          editEntry(textarea, this.disabled[0]);
        }
      },
    };
  }

  renderForm() {
    if (this.openJobs && this.mode === 'full') {
      return html`
        <div class="panel-title" @click=${() => { this.openJobs = false; }}>
          <span class="title">
            <strong>+</strong>
            Start New Job
          </span>
        </div>`;
    }
    const getOption = (type) => {
      const isDelete = ['delete', 'unpublish'].includes(type);
      if (isDelete && this.user?.permissions[type] === false) {
        return html`<option disabled value=${type}>${type}</option>`;
      }
      return html`<option value=${type}>${type}</option>`;
    };
    return html`
      <div class="process">
        <div class="processor">
          <select 
            id="ProcessSelect"
            name="select"
            value=${this.process}
            @change=${this.setType}>
            <option disabled selected value="choose">Choose Process</option>
            ${PROCESS_TYPES.map((type) => (getOption(type)))}
          </select>
          <button
            id="RunProcess"
            disable=${this.formDisabled()} 
            @click=${this.submit}>
            Run Job
            <span class="loader${this.processing === 'started' ? '' : ' hide'}"></span>
          </button>
        </div>
        <label class="process-title" for="Urls">
          <strong>PAGE URLs</strong>
        </label>
      </div>
      <div class="urls${typeof this.disabled !== 'boolean' ? ' invalid' : ''}">
        <div class="error-bar">${this.renderErrorBar()}</div>
        <div class="checkmark${this.disabled ? '' : ' show'}">
          <img src=${checkmarkIcon} alt="Valid Urls" />
        </div>
        <div class="entered-count${this.urls.length ? ' show' : ''}">${this.urls.length}</div>
        <textarea 
          id="Urls"
          wrap="off"
          placeholder="Example: https://main--milo--adobecom.hlx.page/path/to/page"
          @blur=${this.setUrls}
          @change=${this.setUrls}></textarea>
      </div>
    `;
  }

  getJobState() {
    const states = {
      showList: this.mode === 'half' || this.openJobs,
      showClear: this.jobs.length && this.processing === false,
      loading: this.processing !== false,
    };
    Object.keys(states).forEach((key) => (states[key] = `${states[key] ? '' : ' hide'}`));
    states.count = this.jobs.reduce((count, { result }) => {
      const paths = result?.job?.data?.paths?.length ?? 0;
      return count + paths;
    }, 0);
    return states;
  }

  processCompleted(event) {
    const status = event.detail;
    const jobProcess = this.jobs.find(({ result }) => result.job.name === status.name);
    if (jobProcess) jobProcess.status = status;
    if (this.jobs.filter((job) => !job.status).length === 0) {
      this.processing = false;
      sticky().set('resume', []);
    }
  }

  setProgress(event) {
    const { name, progress } = event.detail;
    const jobProcess = this.jobs.find(({ result }) => result.job.name === name);
    if (jobProcess) jobProcess.progress = progress;
    this.requestUpdate();
  }

  renderProgress(total) {
    if (!total) return '';
    return `${this.jobs.reduce((count, { progress }) => {
      const processed = progress?.processed ?? 0;
      return count + processed;
    }, 0)}/${total}`;
  }

  clearJobs = () => {
    this.jobs = [];
    if (this.mode === 'full') this.openJobs = false;
  };

  renderResults() {
    const { showList, showClear, loading, count } = this.getJobState();
    const handleToggle = () => {
      if (!this.openJobs) {
        this.openJobs = !!this.jobs.length;
      }
    };
    return html`
      <div
        class="panel-title"
        @click=${handleToggle}>
        <span class="title">
          ${count ? html`<strong>${count}</strong>` : ''}
          Job Results
        </span>
        <div class="jobs-tools${showList}">
          <div 
            class="clear-jobs${showClear}"
            @click=${this.clearJobs}>
            <img src=${clearJobsIcon} alt="Clear Job List" />
          </div>
          <div class="job-progress${loading}">
            ${this.renderProgress(count)}
          </div>
          <div class="loading-jobs${loading}">
            <div class="loader pink"></div>
          </div>
        </div>
      </div>
      <div class="job${showList}">
        <div class="job-head">
          <div class="job-url">JOB</div>
          <div class="job-meta">
            <span>STATUS</span>
            <span>DATE/TIME</span>
          </div>
        </div>
        <div class="job-list">
          ${this.jobs.map((job) => html`
            <job-process 
              .job=${job}
              @progress="${this.setProgress}"
              @stopped="${this.processCompleted}">
            </job-process>
          `)}
        </div>
      </div>
    `;
  }

  formDisabled() {
    return this.disabled === true
      || typeof this.disabled !== 'boolean'
      || this.process === 'choose';
  }

  resetForm() {
    this.disabled = true;
    this.jobErrors = false;
    this.urls = [];
    const urls = this.renderRoot.querySelector('#Urls');
    if (urls) urls.value = '';
    this.process = 'choose';
    const process = this.renderRoot.querySelector('#ProcessSelect');
    if (process) process.value = 'choose';
  }

  async submit() {
    if (!this.formDisabled()) {
      this.processing = 'started';
      const job = await startJobProcess({
        urls: this.urls,
        process: this.process.toLowerCase(),
        hasPermission: this.user?.permissions?.[this.process],
      });
      const { complete, error } = processJobResult(job);
      this.jobs = [...this.jobs, ...complete];
      this.processing = complete.length ? 'job' : false;
      if (error.length) {
        this.setJobErrors(error);
      } else {
        if (this.mode === 'full') this.openJobs = true;
        this.resetForm();
      }
    }
  }

  getModeState() {
    return {
      full: this.mode === 'full' ? 'on' : 'off',
      half: this.mode === 'half' ? 'on' : 'off',
      toggleMode: (modeIndex) => { this.mode = FORM_MODES[modeIndex]; },
    };
  }

  loadPrompt() {
    setTimeout(() => {
      const loader = this.renderRoot.querySelector('.load-indicator');
      const message = this.renderRoot.querySelector('.message');
      loader?.classList.add('hide');
      message?.classList.remove('hide');
    }, 4000);
    return html`
      <div class="load-indicator">
        <div class="loader"></div>
        Loading User Information
      </div>
    `;
  }

  renderPrompt() {
    if (this.user?.profile) return html``;
    const message = this.user
      ? 'Please sign in to AEM sidekick to continue'
      : 'Please open AEM sidekick to continue';
    return html`
      <div class="login-prompt">
        <div class="prompt">
          ${this.loadPrompt()}
          <div class="message hide">
            ${message}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const { full, half, toggleMode } = this.getModeState();
    return html`
      ${this.renderPrompt()}
      <header id="Header">
        <h1>Bulk Publishing</h1>
        <div class="mode-switcher">
          <div class="switch full ${full}" @click=${() => toggleMode(0)}></div>
          <div class="switch half ${half}" @click=${() => toggleMode(1)}></div>
        </div>
      </header>
      <div id="BulkPublish" class="bulk-publisher ${this.mode}">
        <div active=${!this.openJobs} class="panel form">
          ${this.renderForm()}
        </div>
        <div active=${!!this.openJobs} class="panel results">
          ${this.renderResults()}
        </div>
      </div>
    `;
  }
}

customElements.define('bulk-publish', BulkPublish);

export default async function init(el) {
  el.style.setProperty('--background-img', `url(${backgroundImg})`);
  el.style.setProperty('--down-arrow-icon', `url(${downArrowIcon})`);
  el.append(document.createElement('bulk-publish'));
}
