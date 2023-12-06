import { LitElement, html } from '../../deps/lit-all.min.js';
import { getSheet } from '../../../tools/utils/utils.js';
import { pollJobStatus } from './utils.js';

const styles = await getSheet('/libs/blocks/bulk-publish/bulk-process.css');

class BulkProcess extends LitElement {
  static get properties() {
    return {
      process: { type: Object },
      status: { state: true },
      viewError: { state: true },
    };
  }

  constructor() {
    super();
    this.status = undefined;
    this.viewError = false;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.renderRoot.adoptedStyleSheets = [styles];
    this.status = await pollJobStatus(this.process);
  }

  viewResult({ url, result }, indx) {
    if (this.status) {
      if (result.status !== 202) this.viewError = this.viewError === indx ? false : indx;
      else window.open(url, '_blank');
    }
  }

  getJobMeta(path) {
    const { result, origin } = this.process;
    const { job } = result;
    const url = `${origin}${path}`;
    const { status } = this.status?.resources
      ? this.status.resources.find((p) => p.path === url)
      : job;
    return {
      url,
      status,
      state: this.status?.state ?? job.state,
      time: this.status?.stopTime ?? job.startTime,
    };
  }

  render() {
    const { result } = this.process;
    const { job } = result;
    return job.data.paths.map((path, index) => {
      const { url, status, state, time } = this.getJobMeta(path);
      return html`
        <div class="result" @click=${() => this.viewResult({ url, result }, index)}>
          <div class="job-url">${url}</div>
          <div class="result-meta">
            <span class="${status === 202 ? 'success' : 'error'}">
              ${this.status ? `${status} - ${state}` : state}
            </span>
            <span>${new Date(time).toLocaleString()}</span>
          </div>
        </div>
      `;
    });
  }
}

customElements.define('bulk-process', BulkProcess);
