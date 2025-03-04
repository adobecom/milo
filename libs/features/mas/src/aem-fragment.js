import { EVENT_AEM_LOAD, EVENT_AEM_ERROR, EVENT_TYPE_READY } from './constants.js';
import { useService } from './utilities.js';

const sheet = new CSSStyleSheet();
sheet.replaceSync(':host { display: contents; }');

const baseUrl =
    document.querySelector('meta[name="aem-base-url"]')?.content ??
    'https://odin.adobe.com';

const ATTRIBUTE_FRAGMENT = 'fragment';
const ATTRIBUTE_AUTHOR = 'author';
const ATTRIBUTE_IMS = 'ims';

const fail = (message) => {
    throw new Error(`Failed to get fragment: ${message}`);
};

/**
 * Get fragment by ID
 * @param {string} id fragment id
 * @param {string} masCommerceService settings provider
 * @returns {Promise<Object>} the raw fragment item
 */
export async function getFragmentById(id, masCommerceService) {
    const { env, wcsApiKey, locale } = masCommerceService.settings;
    const host = env === 'prod' ? 'https://www.adobe.com' : 'https://www.stage.adobe.com';
    const endpoint = `${host}/mas/io/fragment?id=${id}&api_key=${wcsApiKey}&locale=${locale}`;
    const response = await fetch(endpoint, {
        cache: 'default',
        credentials: 'omit',
    }).catch((e) => fail(e.message));
    if (!response?.ok) {
        fail(`${response.status} ${response.statusText}`);
    }
    return response.json();
}

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

    #rawData;
    #data;

    /**
     * @type {string} fragment id
     */
    #fragmentId;

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
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === ATTRIBUTE_FRAGMENT) {
            this.#fragmentId = newValue;
            this.refresh(false);
        }
    }

    connectedCallback() {
        if (!this.#fragmentId) {
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
            cache.remove(this.#fragmentId);
        }
        const service = useService();
        let servicePromise = service?.readyPromise;
        if (!servicePromise) {
          servicePromise = new Promise ((resolve) => {
            service.addEventListener(EVENT_TYPE_READY, (e) => {
              resolve(e.target);
            });
          });
        } 
        this.#readyPromise = servicePromise
            .then((service) => this.fetchData(service))
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
            .catch((e) => {
                /* c8 ignore next 3 */
                this.#fail('Network error: failed to load fragment');
                this.#readyPromise = null;
                return false;
            });
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

    async fetchData(masCommerceService) {
        this.#rawData = null;
        this.#data = null;
        let fragment = cache.get(this.#fragmentId);
        if (!fragment) {
            fragment = await getFragmentById(
                this.#fragmentId,
                masCommerceService,
            );
            cache.add(fragment);
        }
        this.#rawData = fragment;
    }

    get updateComplete() {
        return (
            this.#readyPromise ??
            Promise.reject(new Error('AEM fragment cannot be loaded'))
        );
    }

    get data() {
        if (this.#data) return this.#data;
        this.#transformPublishData();
        return this.#data;
    }

    #transformPublishData() {
        const { fields, id, tags } = this.#rawData;
        this.#data = Object.entries(fields).reduce(
            (acc, [key, value]) => {
                acc.fields[key] = value?.mimeType ? value.value : (value ?? '');
                return acc;
            },
            { fields: {}, id, tags },
        );
    }
}

customElements.define('aem-fragment', AemFragment);
