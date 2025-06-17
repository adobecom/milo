import {
    EVENT_AEM_LOAD,
    EVENT_AEM_ERROR,
    MARK_START_SUFFIX,
    MARK_DURATION_SUFFIX,
} from './constants.js';
import { MasError } from './mas-error.js';
import { getLogHeaders } from './utilities.js';
import { getService, printMeasure } from './utils.js';
import { masFetch } from './utils/mas-fetch.js';

const sheet = new CSSStyleSheet();
sheet.replaceSync(':host { display: contents; }');

const ATTRIBUTE_FRAGMENT = 'fragment';
const ATTRIBUTE_AUTHOR = 'author';
const ATTRIBUTE_PREVIEW = 'preview';
const AEM_FRAGMENT_TAG_NAME = 'aem-fragment';

class FragmentCache {
    #fragmentCache = new Map();
    #fetchInfos = new Map();

    clear() {
        this.#fragmentCache.clear();
        this.#fetchInfos.clear();
    }

    /**
     * Add fragment to cache
     * @param {Object} fragment fragment object.
     * @param {Object?} parentFragment parent fragment object, optional.
     */
    add(fragment, parentFragment) {
        if (this.get(fragment.originalId)) return;
        if (this.get(fragment.id)) return;
        this.#fragmentCache.set(fragment.originalId, fragment);
        this.#fragmentCache.set(fragment.id, fragment);
        if (!fragment.references) return;
        Object.entries(fragment.references)
            .filter(([, { type }]) => type === 'content-fragment')
            .forEach(([, { value }]) => {
            value.references = fragment.references;
            value.settings = { ...parentFragment?.settings, ...value.settings };
            value.placeholders = { ...parentFragment?.placeholders, ...value.placeholders };
            value.dictionary = { ...parentFragment?.dictionary, ...value.dictionary };
            value.priceLiterals = { ...parentFragment?.priceLiterals, ...value.priceLiterals };
            this.add(value, (parentFragment ?? fragment));
        });
    }

    has(fragmentId) {
        return this.#fragmentCache.has(fragmentId);
    }

    entries() {
        return this.#fragmentCache.entries();
    }

    get(key) {
        return this.#fragmentCache.get(key);
    }

    getFetchInfo(fragmentId) {
        let fetchInfo = this.#fetchInfos.get(fragmentId);
        if (!fetchInfo) {
            fetchInfo = {
                url: null,
                retryCount: 0,
                stale: false,
                measure: null,
                status: null,
            };
            this.#fetchInfos.set(fragmentId, fetchInfo);
        }
        return fetchInfo;
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
    #log;

    #rawData = null;
    #data = null;
    #service = null;

    /**
     * @type {string} fragment id
     */
    #fragmentId;
    #fetchInfo;

    /**
     * Internal promise to track if fetching is in progress.
     */
    #fetchPromise;

    #author = false;
    #fetchCount = 0;

    #preview = undefined;

    static get observedAttributes() {
        return [ATTRIBUTE_FRAGMENT, ATTRIBUTE_AUTHOR, ATTRIBUTE_PREVIEW];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.adoptedStyleSheets = [sheet];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === ATTRIBUTE_FRAGMENT) {
            this.#fragmentId = newValue;
            this.#fetchInfo = cache.getFetchInfo(newValue);
        }
        if (name === ATTRIBUTE_AUTHOR) {
            this.#author = ['', 'true'].includes(newValue);
        }
        if (name === ATTRIBUTE_PREVIEW) {
            this.#preview = newValue;
        }
    }

    connectedCallback() {
        if (this.#fetchPromise) return;
        this.#service ??= getService(this);
        this.#preview = this.#service.settings?.preview;
        this.#log ??= this.#service.log.module(
            `${AEM_FRAGMENT_TAG_NAME}[${this.#fragmentId}]`,
        );
        // TODO get rid of the special case for #
        if (!this.#fragmentId || this.#fragmentId === '#') {
            this.#fetchInfo ??= cache.getFetchInfo('missing-fragment-id');
            this.#fail('Missing fragment id');
            return;
        }
        this.refresh(false);
    }

    get fetchInfo() {
        return Object.fromEntries(
            Object.entries(this.#fetchInfo)
                .filter(([key, value]) => value != undefined)
                .map(([key, value]) => [`aem-fragment:${key}`, value]),
        );
    }

    /**
     * Get fragment by ID
     * @param {string} endpoint url to fetch fragment from
     * @param {string} id fragment id
     * @param {string} startMark performance mark to measure duration
     * @returns {Promise<Object>} the raw fragment item
     */
    async #getFragmentById(endpoint) {
        this.#fetchCount++;
        const markPrefix = `${AEM_FRAGMENT_TAG_NAME}:${this.#fragmentId}:${this.#fetchCount}`;
        const startMarkName = `${markPrefix}${MARK_START_SUFFIX}`;
        const measureName = `${markPrefix}${MARK_DURATION_SUFFIX}`;
        if (this.#preview) {
            return await this.generatePreview();
        }
        performance.mark(startMarkName);
        let response;
        try {
            this.#fetchInfo.stale = false;
            this.#fetchInfo.url = endpoint;
            response = await masFetch(endpoint, {
                cache: 'default',
                credentials: 'omit',
            });
            this.#applyHeaders(response);
            this.#fetchInfo.status = response?.status;
            this.#fetchInfo.measure = printMeasure(
                performance.measure(measureName, startMarkName),
            );
            this.#fetchInfo.retryCount = response.retryCount;
            if (!response?.ok) {
                throw new MasError('Unexpected fragment response', {
                    response,
                    ...this.#service.duration,
                });
            }
            return await response.json();
        } catch (e) {
            this.#fetchInfo.measure = printMeasure(
                performance.measure(measureName, startMarkName),
            );
            this.#fetchInfo.retryCount = e.retryCount;
            if (this.#rawData) {
                this.#fetchInfo.stale = true;
                this.#log.error(`Serving stale data`, this.#fetchInfo);
                return this.#rawData;
            }
            const reason = e.message ?? 'unknown';
            throw new MasError(`Failed to fetch fragment: ${reason}`, {});
        }
    }

    #applyHeaders(response) {
        Object.assign(this.#fetchInfo, getLogHeaders(response));
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
        try {
            this.#fetchPromise = this.#fetchData();
            await this.#fetchPromise;
        } catch (e) {
            this.#fail(e.message);
            return false;
        }
        const { references, referencesTree, placeholders } =
            this.#rawData || {};

        this.dispatchEvent(
            new CustomEvent(EVENT_AEM_LOAD, {
                detail: {
                    ...this.data,
                    references,
                    referencesTree,
                    placeholders,
                    ...this.#fetchInfo, // Spread all fetch info
                },
                bubbles: true,
                composed: true,
            }),
        );
        return this.#fetchPromise;
    }

    #fail(message) {
        this.#fetchPromise = null;
        this.#fetchInfo.message = message;
        this.classList.add('error');
        const detail = {
            ...this.#fetchInfo,
            ...this.#service.duration,
        };
        this.#log.error(message, detail);
        this.dispatchEvent(
            new CustomEvent(EVENT_AEM_ERROR, {
                detail,
                bubbles: true,
                composed: true,
            }),
        );
    }

    async #fetchData() {
        this.classList.remove('error');
        this.#data = null;
        let fragment = cache.get(this.#fragmentId);
        if (fragment) {
            this.#rawData = fragment;
            return true;
        }
        const { masIOUrl, wcsApiKey, locale } = this.#service.settings;
        const endpoint = `${masIOUrl}/fragment?id=${this.#fragmentId}&api_key=${wcsApiKey}&locale=${locale}`;

        fragment = await this.#getFragmentById(endpoint);
        fragment.originalId ??= this.#fragmentId;
        cache.add(fragment);
        this.#rawData = fragment;
        return true;
    }

    get updateComplete() {
        return (
            this.#fetchPromise ??
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
        const {
            fields,
            id,
            tags,
            settings = {},
            priceLiterals = {},
            dictionary = {},
            placeholders = {},
        } = this.#rawData;
        this.#data = fields.reduce(
            (acc, { name, multiple, values }) => {
                acc.fields[name] = multiple ? values : values[0];
                return acc;
            },
            {
                fields: {},
                id,
                tags,
                settings,
                priceLiterals,
                dictionary,
                placeholders,
            },
        );
    }

    transformPublishData() {
        const {
            fields,
            id,
            tags,
            settings = {},
            priceLiterals = {},
            dictionary = {},
            placeholders = {},
        } = this.#rawData;
        this.#data = Object.entries(fields).reduce(
            (acc, [key, value]) => {
                acc.fields[key] = value?.mimeType ? value.value : (value ?? '');
                return acc;
            },
            {
                fields: {},
                id,
                tags,
                settings,
                priceLiterals,
                dictionary,
                placeholders,
            },
        );
    }

    async generatePreview() {
        const { previewFragment } = await import(
            'https://mas.adobe.com/studio/libs/fragment-client.js'
        );
        const data = await previewFragment(this.#fragmentId, {
            locale: this.#service.settings.locale,
            apiKey: this.#service.settings.wcsApiKey,
        });
        return data;
    }
}

customElements.define(AEM_FRAGMENT_TAG_NAME, AemFragment);
