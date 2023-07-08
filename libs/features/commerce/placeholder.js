import Service from './service.js';
import { setImmediate } from './utils.js';

export const FAILED = 'placeholder-failed';
export const PENDING = 'placeholder-pending';
export const RESOLVED = 'placeholder-resolved';

/** @type {Commerce.HTMLPlaceholderMixin & Record<string, any>} */
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
    this.status = undefined;
    this.promises = [];
    this.version = 0;
  },

  onceResolved() {
    if (RESOLVED === this.status) return Promise.resolve(this);
    if (FAILED === this.status) return Promise.reject(this.error);
    return new Promise((resolve, reject) => {
      this.promises.push({ resolve, reject });
    }).then(() => this);
  },

  toggle() {
    [FAILED, PENDING, RESOLVED].forEach((status) => {
      this.classList.toggle(status, status === this.status);
    });
  },

  toggleResolved(version) {
    if (version !== this.version) return false;
    this.status = RESOLVED;
    this.toggle();
    this.log?.debug('Resolved:', {
      dataset: { ...this.dataset }, node: this, settings: Service.settings,
    });
    setImmediate(() => {
      this.promises.forEach(({ resolve }) => resolve());
      this.promises = [];
      this.dispatchEvent(
        new CustomEvent(RESOLVED, { bubbles: true }),
      );
    });
    return true;
  },

  toggleFailed(version, error) {
    if (version !== this.version) return false;
    this.error = error;
    this.status = FAILED;
    this.toggle();
    this.log?.error('Failed:', {
      dataset: { ...this.dataset }, node: this, settings: Service.settings,
    }, error);
    setImmediate(() => {
      this.promises.forEach(({ reject }) => reject(error));
      this.promises = [];
      this.dispatchEvent(
        new CustomEvent(FAILED, { bubbles: true }),
      );
    });
    return true;
  },

  togglePending() {
    this.version++;
    if (PENDING !== this.status) {
      this.log?.debug('Pending');
      this.status = PENDING;
      this.toggle();
      setImmediate(() => {
        this.dispatchEvent(
          new CustomEvent(PENDING, { bubbles: true }),
        );
      });
    }
    return this.version;
  },
};

/**
 * @template T
 * @param {string} extendsTag
 * @param {string} customTag
 * @param {T extends CustomElementConstructor ? T : never} Class
 * @return {T & ReturnType<Commerce.HTMLPlaceholderMixin>}
 */
export default function HTMLPlaceholderMixin(extendsTag, customTag, Class) {
  if (!customElements.get(customTag)) {
    Object.assign(Class.prototype, HTMLPlaceholderMixinBase);
    customElements.define(customTag, Class, { extends: extendsTag });
  }
  return Class;
}
