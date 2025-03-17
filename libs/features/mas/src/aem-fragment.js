import { EVENT_AEM_LOAD, EVENT_AEM_ERROR, EVENT_TYPE_READY } from './constants.js';
import { useService } from './utilities.js';

const sheet = new CSSStyleSheet();
sheet.replaceSync(':host { display: contents; }');

const ATTRIBUTE_FRAGMENT = 'fragment';

const fail = (message) => {
    throw new Error(`Failed to get fragment: ${message}`);
};

/**
 * Get fragment by ID
 * @param {string} id fragment id
 * @param {string} author should the fragment be fetched from author endpoint
 * @param {Object} headers optional request headers
 * @returns {Promise<Object>} the raw fragment item
 * @param {string} masCommerceService settings provider
 */
export async function getFragmentById(endpoint, headers) {
    const response = await fetch(endpoint, {
        cache: 'default',
        credentials: 'omit',
        headers,
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

    #baseUrl = false;

    #headers;

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
            document.addEventListener(EVENT_TYPE_READY, (e) => {
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
                this.#fail('Network error: failed to load fragment', e);
                this.#readyPromise = null;
                return false;
            });
        this.#readyPromise;
    }

    #fail(errorMessage, error) {
        console.error(error);
        this.classList.add('error');
        this.dispatchEvent(
            new CustomEvent(EVENT_AEM_ERROR, {
                detail: errorMessage,
                bubbles: true,
                composed: true,
            }),
        );
    }

    async fetchData(service) {
        this.#rawData = null;
        this.#data = null;
        let fragment = cache.get(this.#fragmentId);
        if (!fragment) {
          const { env, wcsApiKey, locale } = service.settings;
          if (!this.#baseUrl) {
            this.#baseUrl = `https://www${env?.toLowerCase() === 'stage' ? '.stage' : ''}.adobe.com/mas/io`;
            const overrideHost = document.querySelector('meta[name="mas-io-url"]')?.content;
            if (overrideHost) {
              this.#baseUrl = overrideHost;
              if (!this.#headers) {
                this.#headers = {
                    Authorization: `Bearer ${window.adobeid?.authorize?.()}`,
                };
              }
            }
          }

          const endpoint = `${this.#baseUrl}/fragment?id=${this.#fragmentId}&api_key=${wcsApiKey}&locale=${locale}`;
          fragment = await getFragmentById(endpoint, this.#headers);
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
        const isAuthor = Array.isArray(this.#rawData?.fields);
        if (isAuthor) {
            this.#transformAuthorData();
        } else {
            this.#transformPublishData();
        }
        return this.#data;
    }

    #transformAuthorData() {
        const { fields, id, tags } = this.#rawData;
        this.#data = fields.reduce(
            (acc, { name, multiple, values }) => {
                acc.fields[name] = multiple ? values : values[0];
                return acc;
            },
            { fields: {}, id, tags },
        );
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
