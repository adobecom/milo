import { EVENT_AEM_LOAD, EVENT_AEM_ERROR, MARK_START_SUFFIX, MARK_DURATION_SUFFIX } from './constants.js';
import { Log } from './log.js';
import { MasError } from './mas-error.js';
import { getMasCommerceServiceDurationLog } from './utils.js';
import { masFetch } from './utils/mas-fetch.js';
import { discoverService } from './utilities.js';

const sheet = new CSSStyleSheet();
sheet.replaceSync(':host { display: contents; }');

const ATTRIBUTE_FRAGMENT = 'fragment';
const ATTRIBUTE_AUTHOR = 'author';
const AEM_FRAGMENT_TAG_NAME = 'aem-fragment';

/**
 * Get fragment by ID
 * @param {string} endpoint url to fetch fragment from
 * @param {string} id fragment id
 * @returns {Promise<Object>} the raw fragment item
 * @param {string} masCommerceService settings provider
 */
export async function getFragmentById(endpoint, id, startMark) {
    const measureName = `${AEM_FRAGMENT_TAG_NAME}:${id}${MARK_DURATION_SUFFIX}`;
    let response;
    try {
        response = await masFetch(endpoint, {
            cache: 'default',
            credentials: 'omit',
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

    /**
   * Add fragment to cache
   * @param {string} fragmentId requested id. 
   * requested id can differe from returned fragment.id because of translation
   */
    addByRequestedId(fragmentId, fragment) {
      this.#fragmentCache.set(fragmentId, fragment);
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

    get(key) {
        return this.#fragmentCache.get(key);
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
    #service = null;
    
    /**
     * @type {string} fragment id
     */
    #fragmentId;

    /**
     * Internal promise to track the readiness of the web-component to render.
     */
    #readyPromise;
    /**
     * Internal promise to track if fetching is in progress.
     */
    #fetchPromise;

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
        }
        if (name === ATTRIBUTE_AUTHOR) {
            this.#author = ['', 'true'].includes(newValue);
        }
    }

    connectedCallback() {
        if (!this.#fragmentId) {
            this.#fail({ message: 'Missing fragment id' });
            return;
        }
        this.#startMark = `${AEM_FRAGMENT_TAG_NAME}:${this.#fragmentId}${MARK_START_SUFFIX}`;
        performance.mark(this.#startMark);
        this.#readyPromise = new Promise((resolve, reject) => {
          this.dispose = discoverService((masCommerceService) => this.activate(masCommerceService, resolve, reject));
        });
    }

    async activate(masCommerceService, resolve, reject) {
      this.#service = masCommerceService;
      const flushCache = !this.#author;
      this.refresh(flushCache)
        .then((result) => resolve(result))
        .catch((e)=> reject(e));
    }

    async refresh(flushCache = true) {
        if (this.#fetchPromise) {
            const ready = await Promise.race([
                this.#fetchPromise,
                Promise.resolve(false),
            ]);
            if (!ready) return; // already fetching data
        }
        if (flushCache) {
            cache.remove(this.#fragmentId);
        }

        this.#fetchPromise = this.fetchData().then(() => {
                this.dispatchEvent(
                    new CustomEvent(EVENT_AEM_LOAD, {
                        detail: { ...this.data, stale: this.#stale },
                        bubbles: true,
                        composed: true,
                    }),
                );
                return true;
            })
            .catch((e) => {
                if (this.#rawData) {
                    cache.addByRequestedId(this.#fragmentId, this.#rawData);
                    return true;
                }
                this.#readyPromise = null;
                this.#fail(e);
                return false;
            });
        return this.#fetchPromise;
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

    async fetchData() {
        this.classList.remove('error');
        this.#data = null;
        let fragment = cache.get(this.#fragmentId);
        if (fragment) {
            this.#rawData = fragment;
            return;
        }
        this.#stale = true;
        const { masIOUrl, wcsApiKey, locale } = this.#service.settings;
        const endpoint = `${masIOUrl}/fragment?id=${this.#fragmentId}&api_key=${wcsApiKey}&locale=${locale}`;
        
        fragment = await getFragmentById(
            endpoint,
            this.#fragmentId,
            this.#startMark,
        );
        cache.addByRequestedId(this.#fragmentId, fragment);
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
      if (this.#author) {
        this.transformAuthorData();
      } else {
        this.transformPublishData();
      }
      return this.#data;
    }

    transformAuthorData() {
        const { fields, id, tags } = this.#rawData;
        this.#data = fields.reduce(
            (acc, { name, multiple, values }) => {
                acc.fields[name] = multiple ? values : values[0];
                return acc;
            },
            { fields: {}, id, tags },
        );
    }

    transformPublishData() {
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
