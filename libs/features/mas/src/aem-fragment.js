import { EVENT_AEM_LOAD, EVENT_AEM_ERROR, MARK_START_SUFFIX, MARK_DURATION_SUFFIX, EVENT_TYPE_READY } from './constants.js';
import { Log } from './log.js';
import { MasError } from './mas-error.js';
import { getMasCommerceServiceDurationLog } from './utils.js';
import { masFetch } from './utils/mas-fetch.js';
import { useService, withTimeout } from './utilities.js';

const sheet = new CSSStyleSheet();
sheet.replaceSync(':host { display: contents; }');

const ATTRIBUTE_FRAGMENT = 'fragment';
// 10 seconds timeout
const AEM_FRAGMENT_TIMEOUT = 10000;
const TIMEOUT_MESSAGE = 'aem-fragment: mas-commerce-service did not intialize within timeout';

const AEM_FRAGMENT_TAG_NAME = 'aem-fragment';

/**
 * Get fragment by ID
 * @param {string} endpoint fragment id
 * @param {Object} headers optional request headers
 * @returns {Promise<Object>} the raw fragment item
 */
export async function getFragmentById(endpoint, headers, startMark) {
    const endpoint = author
        ? `${baseUrl}/adobe/sites/cf/fragments/${id}`
        : `${baseUrl}/adobe/sites/fragments/${id}`;
    const measureName = `${AEM_FRAGMENT_TAG_NAME}:${id}${MARK_DURATION_SUFFIX}`;
    let response;
    try {
        response = await masFetch(endpoint, {
            cache: 'default',
            credentials: 'omit',
            headers,
        });
        if (!response?.ok) {
            const { startTime, duration } = performance.measure(
                measureName,
                startMark,
            );
            throw new MasError('Unexpected fragment response', {
                response,
                startTime,
                duration,
            });
        }
        return response.json();
    } catch (e) {
        const { startTime, duration } = performance.measure(
            measureName,
            startMark,
        );
        if (!response) {
            response = { url: endpoint };
        }

        throw new MasError('Failed to fetch fragment', {
            response,
            startTime,
            duration,
            ...getMasCommerceServiceDurationLog(),
        });
    }
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
    #log = Log.module(AEM_FRAGMENT_TAG_NAME);

    #rawData = null;
    #data = null;
    #stale = false;
    #startMark = null;
    
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
            this.#fail({ message: 'Missing fragment id' });
            return;
        }
        this.#startMark = `${AEM_FRAGMENT_TAG_NAME}:${this.#fragmentId}${MARK_START_SUFFIX}`;
        performance.mark(this.#startMark);
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
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const service = useService();
        if (!service) {
          const message = 'aem-fragment failed to load: mas-commerce-service not found';
          this.#fail(message);
          throw new Error(message);
        }
        let servicePromise = service?.readyPromise;
        if (!servicePromise) {
          if (!servicePromise) {
            servicePromise = new Promise ((resolve) => {
              service?.addEventListener(EVENT_TYPE_READY, (e) => {
                resolve(e.target);
              });
            });
          }
        }
        this.#readyPromise = withTimeout(servicePromise, AEM_FRAGMENT_TIMEOUT, TIMEOUT_MESSAGE)
            .then((service) => this.fetchData(service))
            .then(() => {
                this.dispatchEvent(
                    new CustomEvent(EVENT_AEM_LOAD, {
                        detail: { ...this.data, stale: this.#stale },
                        bubbles: true,
                        composed: true,
                    }),
                );
                return true;
            })
            .catch((e) => { //todo why??
                if (this.#rawData) {
                    cache.add(this.#rawData);
                    return true;
                }
                this.#readyPromise = null;
                this.#fail(e);
                return false;
            });
    }

    #fail({ message, context }) {
        this.classList.add('error');
        this.#log.error(`aem-fragment: ${message}`, context);
        this.dispatchEvent(
            new CustomEvent(EVENT_AEM_ERROR, {
                detail: { message, ...context },
                bubbles: true,
                composed: true,
            }),
        );
    }

    async fetchData(service) {
        this.classList.remove('error');
        let fragment = cache.get(this.#fragmentId);
        if (fragment) {
            this.#rawData = fragment;
            return;
        }
        this.#stale = true;
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
        
        fragment = await getFragmentById(
            endpoint,
            this.#headers,
            this.#startMark,
        );
        cache.add(fragment);
        this.#rawData = fragment;
        this.#stale = false;
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

customElements.define(AEM_FRAGMENT_TAG_NAME, AemFragment);
