import { LitElement, html } from '../../deps/lit-all.min.js';
import { getSheet } from '../../../tools/utils/utils.js';
import { humanDateTime, jobStatus, wait } from './utils.js';
import { pollJobStatus, attemptRetry } from './services.js';

const styles = await getSheet('/libs/blocks/bulk-publish/job.css');

class JobProcess extends LitElement {
  static get properties() {
    return {
      job: { type: Object },
      jobStatus: { state: true },
      queue: { state: true },
      expandDate: { state: true },
    };
  }

  constructor() {
    super();
    this.jobStatus = undefined;
    this.queue = [];
    this.expandDate = false;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.renderRoot.adoptedStyleSheets = [styles];
    const setProgress = (detail) => this.dispatchEvent(new CustomEvent('progress', { detail }));
    this.jobStatus = this.job?.useBulk
      ? await pollJobStatus(this.job, setProgress)
      : this.job.result.job;
  }

  async updated() {
    if (this.jobStatus) {
      this.dispatchEvent(new CustomEvent('processed', { detail: this.jobStatus }));
    }
    if (this.jobStatus && this.jobStatus.progress.failed !== 0) {
      const timeouts = this.jobStatus.data.resources.filter((job) => job.status === 503);
      if (timeouts.length) {
        if (!this.queue.length) {
          this.queue = timeouts.map((item) => ({ ...item, count: 1 }));
        } else {
          const queue = this.queue.filter((item) => item.count < 3 && item.status === 503);
          if (queue.length) {
            const newQueue = await attemptRetry({
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

  async viewResult({ url, code, topic }, pathIndex) {
    const isPOST = !['delete', 'unpublish'].includes(topic);
    if (this.jobStatus && (code === 200 || code === 204) && isPOST) {
      window.open(url, '_blank');
    } else {
      await navigator.clipboard.writeText(url);
      const results = this.renderRoot.querySelectorAll('.result');
      results[pathIndex].classList.add('copied');
      await wait(3000);
      results[pathIndex].classList.remove('copied');
    }
  }

  jobDetails(path) {
    const current = this.jobStatus ?? this.job.result.job;
    const { state, status, createTime, stopTime, data } = current;
    const statusResource = this.jobStatus && data.resources.find((source) => source.path === path);
    let currentStatus = statusResource?.status ?? status;
    let jobState = state;
    const isOK = [200, 204];
    const queued = this.queue?.find((item) => item.path === path);
    if (queued) {
      currentStatus = queued.status;
      jobState = !isOK.includes(queued.status) && queued.count < 3 ? 'queued' : 'stopped';
    }
    const jobstatus = jobStatus(currentStatus, jobState, queued?.count);
    const okStyle = ` success${['delete', 'unpublish'].includes(current.topic) ? '' : ' link'}`;
    const style = isOK.includes(currentStatus) ? okStyle : '';
    const origin = current.topic === 'publish'
      && statusResource?.status
      && isOK.includes(statusResource.status)
      ? this.job.origin.replace('.page', '.live')
      : this.job.origin;

    return {
      style,
      url: statusResource?.href ?? `${origin}${path}`,
      status: jobstatus,
      topic: current.topic,
      time: {
        stamp: stopTime ?? createTime,
        label: stopTime ? 'Finished' : 'Started',
      },
    };
  }

  render() {
    const { job } = this.job.result;
    return job.data.paths.map((path, pathIndex) => {
      const pathcheck = typeof path === 'object' ? path.path : path;
      const { style, status, topic, url, time } = this.jobDetails(pathcheck);
      return html`
        <div 
          class="result${style}"
          @click=${() => this.viewResult({ url, code: status.code, topic }, pathIndex)}>
          <div class="process">
            ${topic} <span class="url">${url}</span>
          </div>
          <div class="meta">
            <span class="${status.color}">${status.text}</span>
            <span
              @mouseover=${() => { this.expandDate = url; }}
              @mouseleave=${() => { this.expandDate = false; }}>
              <i>${this.expandDate === url ? time.label : ''}</i> ${humanDateTime(time.stamp)}
            </span>
          </div>
        </div>
      `;
    });
  }
}

customElements.define('job-process', JobProcess);
