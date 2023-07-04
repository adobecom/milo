import singleton from './singleton.js';
import { ignore, toBoolean } from './utils.js';

const PLACEHOLDER_RESOLVED = 'placeholder-resolved';
const PLACEHOLDER_FAILED = 'placeholder-failed';
const PLACEHOLDER_PENDING = 'placeholder-pending';

const Placeholder = {
  initPlaceholder() {
    this.resolved = false;
    this.pending = false;
    this.failed = false;
    this.promises = [];
  },

  onceResolved() {
    if (this.resolved) return Promise.resolve();
    if (this.failed) return Promise.reject();
    return new Promise((resolve, reject) => {
      this.promises.push({ resolve, reject });
    }).then(ignore);
  },

  toggle() {
    this.classList.toggle(PLACEHOLDER_RESOLVED, this.resolved);
    this.classList.toggle(PLACEHOLDER_FAILED, this.failed);
    this.classList.toggle(PLACEHOLDER_PENDING, this.pending);
  },

  toggleResolved() {
    this.pending = false;
    this.resolved = true;
    this.toggle();
    this.dispatchEvent(
      new CustomEvent(PLACEHOLDER_RESOLVED, { bubbles: true }),
    );

    this.log?.debug('Resolved:', {
      dataset: { ...this.dataset },
      node: this,
      settings: { ...singleton.instance.settings },
    });
    setTimeout(() => {
      this.promises.forEach(({ resolve }) => resolve());
      this.promises = [];
    }, 0);
  },

  toggleFailed(reason) {
    this.pending = false;
    this.failed = true;
    this.toggle();
    this.dispatchEvent(
      new CustomEvent(PLACEHOLDER_FAILED, { bubbles: true }),
    );

    this.log?.error(
      'Failed:',
      {
        dataset: { ...this.dataset },
        node: this,
        settings: { ...singleton.instance.settings },
      },
      reason,
    );
    setTimeout(() => {
      this.promises.forEach(({ reject }) => reject(reason));
      this.promises = [];
    }, 0);
  },

  togglePending() {
    this.log?.debug('Pending');

    this.resolved = false;
    this.failed = false;
    this.pending = true;
    this.toggle();
    this.dispatchEvent(
      new CustomEvent(PLACEHOLDER_PENDING, { bubbles: true }),
    );
  },

  get initiliazed() {
    return this.resolved || this.pending || this.failed;
  },
};

export default Placeholder;
