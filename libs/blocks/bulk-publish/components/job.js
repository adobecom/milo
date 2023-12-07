import { LitElement, html } from '../../../deps/lit-all.min.js';
import { getSheet } from '../../../../tools/utils/utils.js';
import { pollJobStatus } from '../utils.js';

const styles = await getSheet('/libs/blocks/bulk-publish/components/job.css');

class Job extends LitElement {
  static get properties() {
    return {
      job: { type: Object },
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
    this.jobStatus = await pollJobStatus(this.job);
  }

  viewResult({ url, status }, indx) {
    if (this.jobStatus) {
      if (status !== 200) this.viewError = this.viewError === indx ? false : indx;
      else window.open(url, '_blank');
    }
  }

  getJobMeta(path) {
    const currentStatus = this.jobStatus ?? this.job.result.job;
    const { state, status, createTime, stopTime, data } = currentStatus;
    const code = this.jobStatus ? data.resources.find((res) => res.path === path).status : status;
    const stateText = state === 'stopped' ? 'Complete' : state;
    const text = this.jobStatus
      ? stateText
      : html`<span class="loader-text">Working</span>`;
    return {
      url: `${this.job.origin}${path}`,
      status: { code, text },
      time: stopTime ?? createTime,
    };
  }

  render() {
    const { job } = this.job.result;
    return job.data.paths.map((path, index) => {
      const { url, status, time } = this.getJobMeta(path);
      return html`
        <div class="result" @click=${() => this.viewResult({ url, status }, index)}>
          <div class="url">${url}</div>
          <div class="meta">
            <span class="${status.code === 200 ? 'success' : ''}">
              ${status.text}
            </span>
            <span>${new Date(time).toLocaleString()}</span>
          </div>
        </div>
      `;
    });
  }
}

customElements.define('job-process', Job);
