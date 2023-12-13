import { LitElement, html } from '../../deps/lit-all.min.js';
import { getSheet } from '../../../tools/utils/utils.js';
import { jobStatus } from './utils.js';
import { pollJobStatus, processRetryQueue } from './services.js';

const styles = await getSheet('/libs/blocks/bulk-publish/job.css');

class JobProcess extends LitElement {
  static get properties() {
    return {
      job: { type: Object },
      jobStatus: { state: true },
      viewError: { state: true },
      queue: { state: true },
    };
  }

  constructor() {
    super();
    this.jobStatus = undefined;
    this.viewError = false;
    this.queue = [];
  }

  async connectedCallback() {
    super.connectedCallback();
    this.renderRoot.adoptedStyleSheets = [styles];
    this.jobStatus = this.job?.useBulk ? await pollJobStatus(this.job) : this.job.result.job;
  }

  async updated() {
    if (this.jobStatus && this.jobStatus.progress.failed !== 0) {
      const timeouts = this.jobStatus.data.resources.filter((job) => job.status === 503);
      if (timeouts.length) {
        if (!this.queue.length) {
          this.queue = timeouts.map((item) => ({ ...item, count: 1 }));
        } else {
          const queue = this.queue.filter((item) => item.count < 3 && item.status === 503);
          if (queue.length) {
            const newQueue = await processRetryQueue({
              queue,
              urls: queue.map((item) => `${this.job.origin}${item.path}`),
              process: this.jobStatus.topic,
            });
            this.queue = newQueue;
          }
        }
      }
    }
  }

  viewResult({ url, code }) {
    if (this.jobStatus && (code === 200 || code === 204)) {
      window.open(url, '_blank');
    }
  }

  jobDetails(path) {
    const current = this.jobStatus ?? this.job.result.job;
    const { state, status, createTime, stopTime, data } = current;
    const statusResource = this.jobStatus && data.resources.find((source) => source.path === path);
    let currentStatus = statusResource ? statusResource.status : status;
    let jobState = state;
    const queued = this.queue?.find((item) => item.path === path);
    if (queued) {
      currentStatus = queued.status;
      jobState = ![200, 204].includes(queued.status) && queued.count < 3 ? 'queued' : 'stopped';
    }
    const jobstatus = jobStatus(currentStatus, jobState, queued?.count);
    const isLinked = ['delete', 'unpublish'].includes(current.topic) ? ' link' : '';
    const isCompleted = [200, 204].includes(status) ? ` success${isLinked}` : '';
    return {
      url: statusResource?.href ?? `${this.job.origin}${path}`,
      status: jobstatus,
      time: stopTime ?? createTime,
      topic: current.topic,
      isCompleted,
    };
  }

  render() {
    const { job } = this.job.result;
    return job.data.paths.map((path, pathIndex) => {
      const jobPath = typeof path === 'object' ? path.path : path;
      const { url, status, time, topic, isCompleted } = this.jobDetails(jobPath);
      return html`
        <div 
          class="result${isCompleted}"
          @click=${() => this.viewResult({ url, code: status.code }, pathIndex)}>
          <div class="process">
            ${topic} <span class="url">${url}</span>
          </div>
          <div class="meta">
            <span class="${status.color}">${status.text}</span>
            <span>${new Date(time).toLocaleString().replace(',', '')}</span>
          </div>
        </div>
      `;
    });
  }
}

customElements.define('job-process', JobProcess);
