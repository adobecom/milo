import { AEM } from './aem.js';

const ATTR_AEM_BUCKET = 'aem-bucket';
const AEM_BUCKET = 'publish-p22655-e155390';

class FragmentCache {
    #fragmentCache = new Map();

    clear() {
        this.#fragmentCache.clear();
    }

    add(...items) {
        items.forEach((item) => {
            const { path } = item;
            if (path) {
                this.#fragmentCache.set(path, item);
            }
        });
    }

    has(path) {
        return this.#fragmentCache.has(path);
    }

    get(path) {
        return this.#fragmentCache.get(path);
    }

    remove(path) {
        this.#fragmentCache.delete(path);
    }
}
const cache = new FragmentCache();

/**
 * Custom element representing a AemDataSource.
 *
 * @attr {string} path - fragment path
 */
export class AemDataSource extends HTMLElement {
    /**
     * @type {import('@adobe/mas-web-components').AEM}
     */
    #aem;

    cache = cache;

    /**
     * @type {import('@adobe/mas-web-components').Fragment}
     */
    item;

    /**
     * @type {HtmlElement[]}
     */
    refs = [];

    /**
     * @type {string} fragment path
     */
    path;

    /**
     * Consonant styling for CTAs.
     */
    consonant = false;

    /**
     * Internal promise to track the readiness of the web-component to render.
     */
    _readyPromise;

    static get observedAttributes() {
        return ['path'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this[name] = newValue;
    }

    connectedCallback() {
        this.consonant = this.hasAttribute('consonant');
        this.clearRefs();
        const bucket = this.getAttribute(ATTR_AEM_BUCKET) ?? AEM_BUCKET;
        this.#aem = new AEM(bucket);
        this.refresh(false);
    }

    clearRefs() {
        this.refs.forEach((ref) => {
            ref.remove();
        });
    }

    async refresh(flushCache = true) {
        if (!this.path) return;

        if (this._readyPromise) {
            const ready = await Promise.race([
                this._readyPromise,
                Promise.resolve(false),
            ]);
            if (!ready) return; // already fetching data
        }

        this.clearRefs();
        this.refs = [];
        if (flushCache) {
            this.cache.remove(this.path);
        }
        this._readyPromise = this.fetchData().then(() => true);
    }

    async fetchData() {
        let item = cache.get(this.path);
        if (!item) {
            item = await this.#aem.sites.cf.fragments.getByPath(this.path);
            cache.add(item);
        }
        this.item = item;
        this.render();
    }

    get updateComplete() {
        return (
            this._readyPromise ??
            Promise.reject(new Error('datasource is not correctly configured'))
        );
    }

    /* c8 ignore next 3 */
    async render() {
        // abstract method
    }
}

customElements.define('aem-datasource', AemDataSource);
