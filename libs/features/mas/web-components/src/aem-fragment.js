import { EVENT_AEM_LOAD, EVENT_AEM_ERROR } from './constants.js';
import { getFragmentById } from './getFragmentById.js';

const sheet = new CSSStyleSheet();
sheet.replaceSync(':host { display: contents; }');

const baseUrl =
    document.querySelector('meta[name="aem-base-url"]')?.content ??
    'https://odin.adobe.com';

const ATTRIBUTE_FRAGMENT = 'fragment';
const ATTRIBUTE_IMS = 'ims';

let headers;

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
     * @type {boolean} whether an access token should be used via IMS.
     */
    ims = false;

    /**
     * Internal promise to track the readiness of the web-component to render.
     */
    #readyPromise;

    static get observedAttributes() {
        return [ATTRIBUTE_FRAGMENT];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.adoptedStyleSheets = [sheet];

        const ims = this.getAttribute(ATTRIBUTE_IMS);
        if (['', true].includes(ims)) {
            this.ims = true;
            if (!headers) {
                headers = {
                    Authorization: `Bearer ${window.adobeid?.authorize?.()}`,
                    pragma: 'no-cache',
                    'cache-control': 'no-cache',
                };
            }
        } else {
            this.ims = false;
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === ATTRIBUTE_FRAGMENT) {
            this.fragmentId = newValue;
            this.refresh(false);
        }
    }

    connectedCallback() {
        if (!this.fragmentId) {
            this.#fail('Missing fragment id');
            return;
        }
    }

    async refresh(flushCache = true) {
        if (this.#readyPromise) {
            const ready = await Promise.race([
                this.#readyPromise,
                Promise.resolve(false),
            ]);
            if (!ready) return; // already fetching data
        }
        if (flushCache) {
            cache.remove(this.fragmentId);
        }
        this.#readyPromise = this.fetchData()
            .then(() => {
                this.dispatchEvent(
                    new CustomEvent(EVENT_AEM_LOAD, {
                        detail: this.data,
                        bubbles: true,
                        composed: true,
                    }),
                );
                return true;
            })
            .catch(() => {
                /* c8 ignore next 3 */ 
                this.#fail('Network error: failed to load fragment');
                this.#readyPromise = null;
                return false;
            });
        this.#readyPromise;
    }

    #fail(error) {
        this.classList.add('error');
        this.dispatchEvent(
            new CustomEvent(EVENT_AEM_ERROR, {
                detail: error,
                bubbles: true,
                composed: true,
            }),
        );
    }

    async fetchData() {
        let fragment = cache.get(this.fragmentId);
        if (!fragment) {
            fragment = await getFragmentById(
                baseUrl,
                this.fragmentId,
                this.ims ? headers : undefined,
            );
            cache.add(fragment);
        }
        this.data = fragment;
    }

    get updateComplete() {
        return (
            this.#readyPromise ??
            Promise.reject(new Error('AEM fragment cannot be loaded'))
        );
    }
}

customElements.define('aem-fragment', AemFragment);
