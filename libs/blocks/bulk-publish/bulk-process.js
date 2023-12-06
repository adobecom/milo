import { LitElement, html } from '../../deps/lit-all.min.js';
import { getSheet } from '../../../tools/utils/utils.js';
import { pollJobStatus } from './utils.js';

const styles = await getSheet('/libs/blocks/bulk-publish/bulk-process.css');

class BulkProcess extends LitElement {
  static get properties() {
    return {
      process: { type: Object },
      jobStatus: { state: true },
      viewError: { state: true },
    };
  }

  constructor() {
    super();
    this.jobStatus = undefined;
    this.viewError = false;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.renderRoot.adoptedStyleSheets = [styles];
    this.jobStatus = await pollJobStatus(this.process);
  }

  viewResult({ url, status }, indx) {
    if (this.jobStatus) {
      if (status !== 200) this.viewError = this.viewError === indx ? false : indx;
      else window.open(url, '_blank');
    }
  }

  getJobMeta(path) {
    const { result, origin } = this.process;
    const { job } = result;
    const url = `${origin}${path}`;
    const { status } = this.jobStatus?.data?.resources
      ? this.jobStatus.data.resources.find((p) => p.path === path)
      : job;
    return {
      url,
      status,
      state: this.jobStatus?.state ?? job.state,
      time: this.jobStatus?.stopTime ?? job.createTime,
    };
  }

  getJobStatus(status, state) {
    return this.jobStatus
      ? `${state === 'stopped' ? 'Completed' : state}`
      : html`<span class="loader-text">Working</span>`;
  }

  render() {
    const { result } = this.process;
    const { job } = result;
    return job.data.paths.map((path, index) => {
      const { url, status, state, time } = this.getJobMeta(path);
      const success = status === 200;
      return html`
        <div class="result" @click=${() => this.viewResult({ url, status }, index)}>
          <div class="job-url">${url}</div>
          <div class="result-meta">
            <span class="${success ? 'success' : ''}">
              ${this.getJobStatus(status, state)}
            </span>
            <span>${new Date(time).toLocaleString()}</span>
          </div>
        </div>
      `;
    });
  }
}

customElements.define('bulk-process', BulkProcess);
