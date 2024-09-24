import { getFragmentById } from './getFragmentById.js';

const sheet = new CSSStyleSheet();
sheet.replaceSync(':host { display: contents; }');

const baseUrl =
    document.querySelector('meta[name="aem-base-url"]')?.content ??
    'https://publish-p22655-e155390.adobeaemcloud.com';

const ATTRIBUTE_FRAGMENT = 'fragment';

class FragmentCache {
    #fragmentCache = new Map();

    clear() {
        this.#fragmentCache.clear();
    }

    add(...fragments) {
        fragments.forEach((fragment) => {
            const { id: fragmentId } = fragment;
            if (fragmentId) {
                this.#fragmentCache.set(fragmentId, fragment);
            }
        });
    }

    has(fragmentId) {
        return this.#fragmentCache.has(fragmentId);
    }

    get(fragmentId) {
        return this.#fragmentCache.get(fragmentId);
    }

    remove(fragmentId) {
        this.#fragmentCache.delete(fragmentId);
    }
}
const cache = new FragmentCache();

/**
 * Custom element representing an aem fragment.
 *
 * @attr {string} title - fragment title, optional.
 * @attr {string} fragment - fragment id.
 */
export class AemFragment extends HTMLElement {
    cache = cache;

    data;

    /**
     * @type {string} fragment id
     */
    fragmentId;

    /**
     * Consonant styling for CTAs.
     */
    consonant = false;

    /**
     * Internal promise to track the readiness of the web-component to render.
     */
    _readyPromise;

    static get observedAttributes() {
        return [ATTRIBUTE_FRAGMENT];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.adoptedStyleSheets = [sheet];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === ATTRIBUTE_FRAGMENT) {
            this.fragmentId = newValue;
            this.refresh(false);
        }
    }

    async refresh(flushCache = true) {
        if (!this.fragmentId) return;

        if (this._readyPromise) {
            const ready = await Promise.race([
                this._readyPromise,
                Promise.resolve(false),
            ]);
            if (!ready) return; // already fetching data
        }
        if (flushCache) {
            this.cache.remove(this.fragmentId);
        }
        this._readyPromise = this.fetchData().then(() => {
            this.dispatchEvent(
                new CustomEvent('load', {
                    detail: this.data,
                    bubbles: true,
                    composed: true,
                }),
            );
            return true;
        });
    }

    async fetchData() {
        let fragment = cache.get(this.fragmentId);
        if (!fragment) {
            fragment = await getFragmentById(baseUrl, this.fragmentId);
            cache.add(fragment);
        }
        this.data = fragment;
    }

    get updateComplete() {
        return (
            this._readyPromise ??
            Promise.reject(new Error('AEM fragment cannot be loaded'))
        );
    }
}

customElements.define('aem-fragment', AemFragment);
