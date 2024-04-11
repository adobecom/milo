import { LitElement, html } from '../../../deps/lit-all.min.js';
import { getSheet } from '../../../../tools/utils/utils.js';
import { getConfig } from '../../../utils/utils.js';
import { displayDate, setJobTime } from '../utils.js';

const { miloLibs, codeRoot } = getConfig();
const base = miloLibs || codeRoot;
const styleSheet = await getSheet(`${base}/blocks/bulk-publish-v2/components/job-process.css`);

class JobInfo extends LitElement {
  static get properties() {
    return {
      status: { type: Object },
      reworkErrors: { type: Function },
      timer: { state: true },
    };
  }

  async connectedCallback() {
    super.connectedCallback();
    this.renderRoot.adoptedStyleSheets = [styleSheet];
  }

  renderStatus() {
    const { progress, data, state } = this.status;
    const complete = progress ? progress.processed - progress.failed : 0;
    const error = progress ? progress.failed : 0;
    const total = progress ? progress.total : data.paths.length;
    if (state === 'created') return 'Created';
    return html`
      <div class="progress">
        <span class="${complete > 0 ? 'success' : ''}" title="Completed Pages">
          ${complete}</span> / ${total} page${total > 1 ? 's' : ''}
        ${error > 0 ? html`- <span class="error" title="Rework Errors">
          ${error} Error${error > 1 ? 's' : ''}</span>` : ''}
      </div>
    `;
  }

  renderTimer() {
    const { state, createTime } = this.status;
    setJobTime(this);
    let timerText = displayDate(createTime);
    if (state === 'running') {
      timerText = html`Working <strong>${this.timer}</strong>`;
    }
    if (state === 'stopped') {
      timerText = html`Done in <strong>${this.timer}</strong>`;
    }
    return html`
      <div class="timer">
        ${timerText}
      </div>
    `;
  }

  render() {
    const { topic } = this.status;
    return html`
      <div class="job-info">
        <div class="process">
          ${topic}
        </div>
        <div class="meta">
          <span class="status">
            ${this.renderStatus()}
          </span>
          <span class="date-stamp">
            ${this.renderTimer()}
          </span>
        </div>
      </div>
    `;
  }
}

customElements.define('job-info', JobInfo);
