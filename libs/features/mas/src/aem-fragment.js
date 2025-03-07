import { EVENT_AEM_LOAD, EVENT_AEM_ERROR } from './constants.js';
import { Log } from './log.js';
import { MasError } from './mas-error.js';
import { getMasCommerceServiceDurationLog } from './utils.js';
import { masFetch } from './utils/mas-fetch.js';

const sheet = new CSSStyleSheet();
sheet.replaceSync(':host { display: contents; }');

const baseUrl =
    document.querySelector('meta[name="aem-base-url"]')?.content ??
    'https://odin.adobe.com';

const ATTRIBUTE_FRAGMENT = 'fragment';
const ATTRIBUTE_AUTHOR = 'author';
const ATTRIBUTE_IMS = 'ims';

/**
 * Get fragment by ID
 * @param {string} baseUrl the aem base url
 * @param {string} id fragment id
 * @param {string} author should the fragment be fetched from author endpoint
 * @param {Object} headers optional request headers
 * @returns {Promise<Object>} the raw fragment item
 */
export async function getFragmentById(baseUrl, id, author, headers) {
    const endpoint = author
        ? `${baseUrl}/adobe/sites/cf/fragments/${id}`
        : `${baseUrl}/adobe/sites/fragments/${id}`;
    const startTime = Date.now();
    let response;
    try {
        response = await masFetch(endpoint, {
            cache: 'default',
            credentials: 'omit',
            headers,
        });
        if (!response?.ok) {
            const duration = Date.now() - startTime;
            throw new MasError('Unexpected fragment response', {
                response,
                startTime,
                duration,
            });
        }
        return response.json();
    } catch (e) {
        const duration = Date.now() - startTime;
        if (!response) {
            response = { url: endpoint };
        }

        throw new MasError('Failed to get fragment', {
            response,
            startTime,
            duration,
            ...getMasCommerceServiceDurationLog(),
        });
    }
}

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
    #log = Log.module('aem-fragment');

    #rawData = null;
    #data = null;
    #stale = false;
    /**
     * @type {string} fragment id
     */
    #fragmentId;

    /**
     * @type {boolean} whether an access token should be used via IMS.
     */
    #ims = false;

    /**
     * Internal promise to track the readiness of the web-component to render.
     */
    #readyPromise;

    #author = false;

    static get observedAttributes() {
        return [ATTRIBUTE_FRAGMENT, ATTRIBUTE_AUTHOR];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.adoptedStyleSheets = [sheet];

        const ims = this.getAttribute(ATTRIBUTE_IMS);
        if (['', true, 'true'].includes(ims)) {
            this.#ims = true;
            if (!headers) {
                headers = {
                    Authorization: `Bearer ${window.adobeid?.authorize?.()}`,
                };
            }
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === ATTRIBUTE_FRAGMENT) {
            this.#fragmentId = newValue;
            this.refresh(false);
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
        this.#readyPromise = this.fetchData()
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
            .catch((e) => {
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

    async fetchData() {
        this.classList.remove('error');
        let fragment = cache.get(this.#fragmentId);
        if (fragment) {
            this.#rawData = fragment;
            return;
        }
        this.#stale = true;
        fragment = await getFragmentById(
            baseUrl,
            this.#fragmentId,
            this.#author,
            this.#ims ? headers : undefined,
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
        if (this.#author) {
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
