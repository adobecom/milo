import './job.js';
import { LitElement, html } from '../../deps/lit-all.min.js';
import { getSheet } from '../../../tools/utils/utils.js';
import { runJob } from './services.js';
import {
  editEntry,
  FORM_MODES,
  getJobErrorText,
  PROCESS_TYPES,
  validMiloURL,
  sticky,
  wait,
  getElapsedTime,
  processJobResult,
} from './utils.js';

const styles = await getSheet('/libs/blocks/bulk-publish/bulk-publisher.css');
const loader = await getSheet('/libs/blocks/bulk-publish/loader.css');

class BulkPublish extends LitElement {
  static properties = {
    mode: { state: true },
    urls: { state: true },
    processType: { state: true },
    disabled: { state: true },
    editing: { state: true },
    processing: { state: true },
    jobs: { state: true },
    openJobs: { state: true },
    jobErrors: { state: true },
    openStatus: { state: true },
  };

  constructor() {
    super();
    this.mode = sticky().get('mode');
    this.urls = [];
    this.processType = 'choose';
    this.disabled = true;
    this.processing = false;
    this.editing = false;
    this.jobs = [];
    this.openJobs = false;
    this.jobErrors = false;
    this.openStatus = false;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.renderRoot.adoptedStyleSheets = [styles, loader];
    const resume = sticky().get('resume');
    if (resume.length) {
      this.jobs = resume;
      await wait(1000);
      this.openJobs = true;
      this.processing = 'job';
    }
  }

  async updated() {
    const stored = sticky();
    if (stored.get('mode') !== this.mode) {
      stored.set('mode', this.mode);
    }
    if (this.jobs.length) {
      const unfinished = this.jobs.filter((job) => !job.status);
      stored.set('resume', unfinished);
    }
    const textarea = this.renderRoot.querySelector('#Urls');
    if (this.urls.length && textarea?.value === '') {
      textarea.value = this.urls.join('\r\n');
    }
  }

  setType(e) {
    if (e.target.value !== this.processType) {
      this.processType = e.target.value;
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
        if (Array.isArray(error.href)) {
          return error.href.includes(url);
        }
        return url.includes(error.href);
      });
      matched.forEach((match) => urls.push(match));
    });
    const textarea = this.renderRoot.querySelector('#Urls');
    textarea.value = urls.join('\r\n');
    if (['delete', 'unpublish'].includes(this.processType)) this.urls = urls;
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
          ${count === 1 ? 'Finish' : btnText}
        </div>
      </div>
    `;
  }

  getErrorProps() {
    const textarea = this.renderRoot.getElementById('Urls');
    let text = 'Invalid Url';
    if (this.jobErrors) {
      text = getJobErrorText(this.jobErrors, this.processType);
    }
    return {
      text,
      startEdit: (tapped = null) => {
        this.editing = !this.editing;
        if (tapped) {
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

  renderJobsForm() {
    if (this.openJobs && this.mode === 'full') {
      return html`
        <div class="panel-title" @click=${() => { this.openJobs = false; }}>
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
            id="ProcessSelect"
            name="select"
            value=${this.processType}
            @change=${this.setType}>
            <option disabled selected value="choose">Choose Process</option>
            ${PROCESS_TYPES.map((type) => (html`<option value=${type}>${type}</option>`))}
          </select>
          <button
            disable=${this.disableSubmitBtn()} 
            @click=${this.submitJobForm}>
            Run Job
            <span class="loader${this.processing === 'launch' ? '' : ' hide'}"></span>
          </button>
        </div>
        <label class="process-title" for="Urls">
          <strong>PAGE URLs</strong>
        </label>
      </div>
      <div class="urls${typeof this.disabled !== 'boolean' ? ' invalid' : ''}">
        <div class="error-bar">${this.renderErrorBar()}</div>
        <div class="checkmark${this.disabled ? '' : ' show'}"></div>
        <div class="entered-count${this.urls.length ? ' show' : ''}">${this.urls.length}</div>
        <textarea 
          id="Urls"
          placeholder="Example: https://main--milo--adobecom.hlx.page/path/to/page"
          @blur=${this.setUrls}
          @change=${this.setUrls}></textarea>
      </div>
    `;
  }

  errorReworkTool({ failed, status }) {
    const setRework = () => {
      const { origin } = this.jobs.find((item) => item.result.job.name === status.name);
      const paths = status.data.resources.filter((path) => ![200, 204].includes(path.status));
      this.urls = paths.map(({ path }) => `${origin}${path}`);
    };
    return html`<span
      @click=${setRework}
      class="failed${failed > 0 ? ' rework' : ''}">${failed} Error</span>`;
  }

  getJobState() {
    const jobState = {
      showList: this.mode === 'half' || this.openJobs,
      showClear: this.jobs.length && this.processing === false,
      loading: this.processing !== false,
    };
    Object.keys(jobState).forEach((key) => (jobState[key] = `${jobState[key] ? '' : ' hide'}`));
    jobState.count = this.jobs.reduce((count, { result }) => {
      const paths = result?.job?.data?.paths?.length ?? 0;
      return count + paths;
    }, 0);
    return jobState;
  }

  processCompleted(event) {
    const status = event.detail;
    const updateJob = this.jobs.find(({ result }) => result.job.name === status.name);
    updateJob.status = status;
    if (this.jobs.filter((job) => !job.status).length === 0) {
      this.processing = false;
      sticky().set('resume', []);
    }
  }

  setProgress(event) {
    const { name, progress } = event.detail;
    const updateJob = this.jobs.find(({ result }) => result.job.name === name);
    updateJob.progress = progress;
    this.requestUpdate();
  }

  renderProgress(total) {
    const processed = this.jobs.reduce((count, { progress }) => {
      const paths = progress?.processed ?? 0;
      return count + paths;
    }, 0);
    if (!total) return '';
    return `${processed}/${total}`;
  }

  renderResults() {
    const { showList, showClear, loading, count } = this.getJobState();
    const handleToggle = () => {
      if (!this.openJobs) this.openJobs = !!this.jobs.length;
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
            @click=${() => { this.jobs = []; this.openStatus = false; }}></div>
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
              .filtered=${this.openStatus}
              @progress="${this.setProgress}"
              @processed="${this.processCompleted}"></job-process>
          `)}
        </div>
      </div>
    `;
  }

  disableSubmitBtn() {
    return this.disabled === true
      || typeof this.disabled !== 'boolean'
      || this.processType === 'choose';
  }

  resetJobForm() {
    this.disabled = true;
    this.jobErrors = false;
    this.urls = [];
    this.processType = 'choose';
    const urls = this.renderRoot.querySelector('#Urls');
    if (urls) urls.value = '';
    const process = this.renderRoot.querySelector('#ProcessSelect');
    if (process) process.value = 'choose';
  }

  async submitJobForm() {
    if (!this.disableSubmitBtn()) {
      this.processing = 'launch';
      const newJobs = await runJob({
        urls: this.urls,
        process: this.processType.toLowerCase(),
      });
      const { complete, error } = processJobResult(newJobs);
      this.jobs = [...this.jobs, ...complete];
      this.processing = complete.length
        ? complete.map(({ result }) => ({ name: result.job.name }))
        : false;
      if (error.length) {
        this.setJobErrors(error);
      } else {
        if (this.mode === 'full') {
          this.openJobs = true;
        }
        this.resetJobForm();
      }
    }
  }

  getModeState() {
    return {
      full: this.mode === 'full' ? 'on' : 'off',
      half: this.mode === 'half' ? 'on' : 'off',
      toggleMode: (modeIndex) => {
        this.mode = FORM_MODES[modeIndex];
      },
    };
  }

  render() {
    const { full, half, toggleMode } = this.getModeState();
    return html`
      <header id="Header">
        <h1>Bulk Publishing</h1>
        <div class="mode-switcher">
          <div class="switch full ${full}" @click=${() => toggleMode(0)}></div>
          <div class="switch half ${half}" @click=${() => toggleMode(1)}></div>
        </div>
      </header>
      <div id="BulkPublish" class="bulk-publisher ${this.mode}">
        <div active=${!this.openJobs} class="panel form">
          ${this.renderJobsForm()}
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
  el.append(document.createElement('bulk-publish'));
}
