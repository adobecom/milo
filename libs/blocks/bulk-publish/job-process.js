import { LitElement, html } from '../../deps/lit-all.min.js';
import { getSheet } from '../../../tools/utils/utils.js';
import { humanDateTime, getStatusText, wait } from './utils.js';
import { pollJobStatus, runRetry } from './services.js';

const styleSheet = await getSheet('/libs/blocks/bulk-publish/job-process.css');

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
    this.renderRoot.adoptedStyleSheets = [styleSheet];
    if (this.job?.useBulk) {
      await pollJobStatus(this.job, (detail) => {
        this.jobStatus = detail;
        this.dispatchEvent(new CustomEvent('progress', { detail }));
      });
    } else {
      this.jobStatus = this.job.result.job;
    }
  }

  async updated() {
    if (this.jobStatus && this.jobStatus.state === 'stopped') {
      this.dispatchEvent(new CustomEvent('stopped', { detail: this.jobStatus }));
    }
    if (this.jobStatus && this.jobStatus.progress?.failed !== 0) {
      const timeouts = this.jobStatus.data?.resources?.filter((job) => job.status === 503);
      if (timeouts?.length) {
        if (!this.queue.length) {
          this.queue = timeouts.map((item) => ({ ...item, count: 1 }));
        } else {
          const queue = this.queue.filter((item) => item.count < 3 && item.status === 503);
          if (queue.length) {
            const newQueue = await runRetry({
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
    const isPOST = !['preview-remove', 'publish-remove'].includes(topic);
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
    const jobData = this.jobStatus ?? this.job.result.job;
    const { topic, data, startTime, stopTime, createTime } = jobData;
    const resource = data?.resources?.find((src) => src.path === path || src.webPath === path);
    let { state, status } = resource ?? jobData;

    const success = [200, 204];
    const queued = this.queue?.find((item) => item.path === path);
    if (queued) {
      status = queued.status;
      state = !success.includes(status) && queued.count < 3 ? 'queued' : 'stopped';
    }

    const statusText = getStatusText(status, state, queued?.count);
    const style = success.includes(status)
      ? ` success${['preview-remove', 'publish-remove'].includes(topic) ? '' : ' link'}`
      : '';

    const origin = topic === 'publish' && success.includes(status)
      ? this.job.origin.replace('.page', '.live')
      : this.job.origin;

    // sometimes stopTime is returned from API as an empty string
    const stop = stopTime && stopTime !== '' ? stopTime : undefined;
    const stamp = stop ?? startTime ?? createTime;

    return {
      topic,
      style,
      url: resource?.href ?? `${origin}${path}`,
      status: statusText,
      time: {
        stamp,
        label: stopTime ? 'Finished' : 'Started',
      },
    };
  }

  render() {
    const { job } = this.job.result;
    return job.data.paths.map((path, pathIndex) => {
      const jobPath = typeof path === 'object' ? path.path : path;
      const { style, status, topic, url, time } = this.jobDetails(jobPath);
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
