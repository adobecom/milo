import { LitElement, html, nothing } from '../../../deps/lit-all.min.js';
import { getSheet } from '../../../../tools/utils/utils.js';
import { getConfig } from '../../../utils/utils.js';
import { delay, displayDate, setJobTime } from '../utils.js';

const { miloLibs, codeRoot } = getConfig();
const base = miloLibs || codeRoot;
const styleSheet = await getSheet(`${base}/blocks/bulk-publish-v2/components/job-process.css`);
const reworkIcon = `${base}/blocks/bulk-publish-v2/img/rework.svg`;
const closeIcon = `${base}/blocks/bulk-publish-v2/img/close.svg`;

class JobInfo extends LitElement {
  static get properties() {
    return {
      status: { type: Object },
      reworkErrors: { type: Function },
      errFilter: { state: true },
      timer: { state: true },
      showTimes: { state: true },
      timesAutoOpened: { state: true },
      copiedInvocationId: { state: true },
    };
  }

  async connectedCallback() {
    super.connectedCallback();
    this.renderRoot.adoptedStyleSheets = [styleSheet];
  }

  async updated() {
    if (this.errFilter) {
      this.parentElement.classList.add('filter-errors');
      this.showTimes = false;
      this.scrollIntoView();
    } else {
      this.parentElement.classList.remove('filter-errors');
    }
    // expand time data when a job finishes
    if (this.status.state === 'stopped' && !this.showTimes && !this.timesAutoOpened) {
      this.timesAutoOpened = true;
      this.showTimes = true;
    }
  }

  async copyInvocationId() {
    await navigator.clipboard.writeText(this.status.invocationId);
    this.copiedInvocationId = true;
    await delay(3000);
    this.copiedInvocationId = false;
  }

  renderStatus() {
    const { progress, data, state } = this.status;
    const complete = progress ? progress.processed - progress.failed : 0;
    const error = progress ? progress.failed : 0;
    const total = progress ? progress.total : data.paths.length;
    const hasErrors = error > 0;
    if (state === 'created') return html`<span class="job-totals">Waiting</span>`;
    return html`
      <div class="progress${this.errFilter ? ' filtered' : ''}">
        ${!this.errFilter ? html`
          <div class="job-totals${hasErrors ? ' errors' : ''}">
            <span class="${complete > 0 ? 'success' : ''}" title="Completed Pages">
            ${complete}</span> / ${total}
          </div>
        ` : nothing}
        ${hasErrors ? html`
          <span class="error-tools">
            ${this.errFilter ? html`
              <span class="tools">
                ${error}
                <span class="rework" title="Rework Errors" @click=${this.reworkErrors}>
                  <img src=${reworkIcon} alt="Rework Errors Icon" title="Rework Errors" />
                </span>
                <span @click=${() => { this.errFilter = false; }} class="close">
                  <img src=${closeIcon} alt="Remove Filter Icon" title="Remove Error Filter" />
                </span>
              </span>
            ` : html`
              <span class="count" title="Filter Errors" @click=${() => { this.errFilter = true; }}>
                ${error}
              </span>
            `}
          </span>
        ` : nothing}
      </div>
    `;
  }

  renderTimer() {
    const { state, createTime, startTime, stopTime } = this.status;
    let timerText = `${displayDate(createTime)}`;
    this.updateComplete.then(() => { setJobTime(this); });
    if (state === 'running') {
      timerText = html`Working <strong id="TimerTime"></strong>`;
    }
    if (state === 'stopped') {
      timerText = html`Done in <strong id="TimerTime"></strong>`;
    }
    const toggleTimes = () => { this.showTimes = !this.showTimes; };
    return html`
      <div class="timer${this.showTimes ? ' show-times' : ''}" @click=${toggleTimes}>
        ${timerText}
      </div>
      ${this.showTimes ? html`
        <div class="job-timing">
          <div class="stat">
            Created
            <strong>${displayDate(createTime)}</strong>
          </div>
          ${startTime ? html`
            <div class="stat">
              Started
              <strong>${displayDate(startTime)}</strong>
            </div>
          ` : nothing}
          ${stopTime ? html`
            <div class="stat">
              Finished
              <strong>${displayDate(stopTime)}</strong>
            </div>
          ` : nothing}
        </div>
      ` : nothing}
    `;
  }

  render() {
    const { topic, invocationId } = this.status;
    return html`
      <div class="job-info">
        <div class="process">
          <span class="topic">${topic}</span>
          ${invocationId ? html`
            <span class="job-id-link" @click=${this.copyInvocationId}>
              copy invocation ID
            </span>
          ` : nothing}
          ${this.copiedInvocationId ? html`
            <div class="job-id-copied">
              Copied to clipboard!
            </div>
          ` : nothing}
        </div>
        <div class="meta">
          <span class="status">
            ${this.renderStatus()}
            ${this.renderTimer()}
          </span>
        </div>
      </div>
    `;
  }
}

customElements.define('job-info', JobInfo);
