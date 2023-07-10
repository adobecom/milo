import Service from './service.js';

export const FAILED = 'placeholder-failed';
export const PENDING = 'placeholder-pending';
export const RESOLVED = 'placeholder-resolved';

const setImmediate = (callback) => setTimeout(callback, 0);

/**
 * Stores private bucket of values for each instance of placeholder.
 * @type {WeakMap<HTMLPlaceholderMethods, {
 *  error?: Error;
 *  promises: {
 *    resolve: (HTMLPlaceholderMethods) => void;
 *    reject: (error: Error) => void;
 *  }[];
 *  state: FAILED | PENDING | RESOLVED | undefined;
 *  timer?: NodeJS.Timeout;
 *  version: number;
 * }>}
 */
const buckets = new WeakMap();

/** @type {Commerce.HTMLPlaceholderMixin & Record<string, any>} */
// @ts-ignore
export const HTMLPlaceholderMethods = {
  attributeChangedCallback(name, _, value) {
    this.log?.debug(`Attribute "${name}":`, value);
    this.update();
  },

  connectedCallback() {
    this.log?.debug('Connected:', this.parentElement);
    this.update();
  },

  init() {
    buckets.set(this, {
      promises: [],
      state: undefined,
      version: 0,
    });
  },

  onceSettled() {
    const { error, promises, state } = buckets.get(this);
    if (RESOLVED === state) return Promise.resolve(this);
    if (FAILED === state) return Promise.reject(error);
    return new Promise((resolve, reject) => {
      promises.push({ resolve, reject });
    });
  },

  toggle() {
    const bucket = buckets.get(this);
    [FAILED, PENDING, RESOLVED].forEach((state) => {
      this.classList.toggle(state, state === bucket.state);
    });
  },

  toggleResolved(version) {
    const bucket = buckets.get(this);
    // skip obsolete asyncs
    if (version !== bucket.version) return false;
    bucket.state = RESOLVED;
    this.toggle();
    this.log?.debug('Resolved:', { dataset: { ...this.dataset }, node: this, settings: Service.settings });
    // allow calling code to perform sync updates of this element
    // before notifying observers about state change
    setImmediate(() => {
      const { promises } = bucket;
      bucket.promises = [];
      promises.forEach(({ resolve }) => resolve(this));
      this.dispatchEvent(
        new CustomEvent(RESOLVED, { bubbles: true }),
      );
    });
    return true;
  },

  toggleFailed(version, error) {
    const bucket = buckets.get(this);
    // skip obsolete asyncs
    if (version !== bucket.version) return false;
    bucket.error = error;
    bucket.state = FAILED;
    this.toggle();
    this.log?.error(
      'Failed:',
      { dataset: { ...this.dataset }, node: this, settings: Service.settings },
      error,
    );
    setImmediate(() => {
      const { promises } = bucket;
      bucket.promises = [];
      promises.forEach(({ reject }) => reject(error));
      this.dispatchEvent(
        new CustomEvent(FAILED, { bubbles: true }),
      );
    });
    return true;
  },

  togglePending() {
    const bucket = buckets.get(this);
    // eslint-disable-next-line no-plusplus
    bucket.version++;
    if (PENDING !== bucket.state) {
      this.log?.debug('Pending');
      bucket.state = PENDING;
      this.toggle();
      setImmediate(() => {
        this.dispatchEvent(
          new CustomEvent(PENDING, { bubbles: true }),
        );
      });
    }
    return bucket.version;
  },

  update() {
    if (!this.isConnected) return;

    this.togglePending();
    const bucket = buckets.get(this);
    // batch consecutive updates
    if (!bucket.timer) {
      bucket.timer = setImmediate(() => {
        delete bucket.timer;
        this.render();
      });
    }
  },
};

// TODO: old name for backward compatibility, needs to be removed somewhen
HTMLPlaceholderMethods.onceResolved = HTMLPlaceholderMethods.onceSettled;

/**
 * @template T
 * @param {string} extendsTag
 * @param {string} customTag
 * @param {T extends CustomElementConstructor ? T : never} Class
 * @return {T & ReturnType<Commerce.HTMLPlaceholderMixin>}
 */
function HTMLPlaceholderMixin(extendsTag, customTag, Class) {
  if (!customElements.get(customTag)) {
    Object.assign(Class.prototype, HTMLPlaceholderMethods);
    customElements.define(customTag, Class, { extends: extendsTag });
  }
  return Class;
}

export default HTMLPlaceholderMixin;
