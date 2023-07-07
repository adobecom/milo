import Service from './service.js';

export const RESOLVED = 'placeholder-resolved';
export const FAILED = 'placeholder-failed';
export const PENDING = 'placeholder-pending';

/** @type {Commerce.PLaceholderElement & Record<string, any>} */
// @ts-ignore
export const HTMLPlaceholderMixinBase = {
  attributeChangedCallback(attr, prev, next) {
    this.log?.debug('Changed:', attr, "=", next);
    this.render();
  },

  connectedCallback() {
    this.log?.debug('Connected');
    this.render();
  },

  init() {
    this.failed = false;
    this.pending = false;
    this.promises = [];
    this.resolved = false;
  },

  onceResolved() {
    if (this.resolved) return Promise.resolve(this);
    if (this.failed) return Promise.reject();
    return new Promise((resolve, reject) => {
      this.promises.push({ resolve, reject });
    }).then(() => this);
  },

  toggle() {
    this.classList.toggle(RESOLVED, this.resolved);
    this.classList.toggle(FAILED, this.failed);
    this.classList.toggle(PENDING, this.pending);
  },

  toggleResolved() {
    this.pending = false;
    this.resolved = true;

    this.toggle();
    this.dispatchEvent(
      new CustomEvent(RESOLVED, { bubbles: true }),
    );

    this.log?.debug('Resolved:', {
      dataset: { ...this.dataset },
      node: this,
      settings: Service.settings,
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
      new CustomEvent(FAILED, { bubbles: true }),
    );

    this.log?.error(
      'Failed:',
      {
        dataset: { ...this.dataset },
        node: this,
        settings: Service.settings,
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
      new CustomEvent(PENDING, { bubbles: true }),
    );
  },
};

/**
 * @template T
 * @param {string} extendsTag
 * @param {string} customTag
 * @param {T extends CustomElementConstructor ? T : never} Class
 * @return {T & ReturnType<Commerce.PLaceholderElement>}
 */
export default function HTMLPlaceholderMixin(extendsTag, customTag, Class) {
  if (!customElements.get(customTag)) {
    Object.assign(Class.prototype, HTMLPlaceholderMixinBase);
    customElements.define(customTag, Class, { extends: extendsTag });
  }
  return Class;
}
