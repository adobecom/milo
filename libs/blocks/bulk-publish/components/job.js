import { LitElement, html } from '../../../deps/lit-all.min.js';
import { getSheet } from '../../../../tools/utils/utils.js';
import { jobStatus } from '../utils.js';
import { pollJobStatus } from '../services.js';

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

  viewResult({ url, code }, indx) {
    if (this.jobStatus) {
      if (code !== 200) this.viewError = this.viewError === indx ? false : indx;
      else window.open(url, '_blank');
    }
  }

  getJobDetails(path) {
    const current = this.jobStatus ?? this.job.result.job;
    const { state, status, createTime, stopTime, data } = current;
    const currentStatus = this.jobStatus
      ? data.resources.find((source) => source.path === path).status
      : status;
    const jobstatus = jobStatus(currentStatus, state);
    return {
      url: `${this.job.origin}${path}`,
      status: jobstatus,
      time: stopTime ?? createTime,
      topic: current.topic,
    };
  }

  render() {
    const { job } = this.job.result;
    return job.data.paths.map((path, pathIndex) => {
      const { url, status, time, topic } = this.getJobDetails(path);
      return html`
        <div class="result" @click=${() => this.viewResult({ url, code: status.code }, pathIndex)}>
          <div class="process">
            ${topic} <span class="url${status.code === 200 ? ' success' : ''}">${url}</span>
          </div>
          <div class="meta">
            <span class="${status.color}">
              <span class="code">${status.code}</span>
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
