import { getParameter } from '@dexter/tacocat-core';
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

const ATTRIBUTE_FRAGMENT = 'fragment';
const ATTRIBUTE_AUTHOR = 'author';
const ATTRIBUTE_PREVIEW = 'preview';
const ATTRIBUTE_LOADING = 'loading';
const ATTRIBUTE_TIMEOUT = 'timeout';
const AEM_FRAGMENT_TAG_NAME = 'aem-fragment';
const LOADING_EAGER = 'eager';
const LOADING_CACHE = 'cache';
const LOADING_VALUES = [LOADING_EAGER, LOADING_CACHE];

class FragmentCache {
    #fragmentCache = new Map();
    #fetchInfos = new Map();
    #promises = new Map();

    clear() {
        this.#fragmentCache.clear();
        this.#fetchInfos.clear();
        this.#promises.clear();
    }

    /**
     * Add fragment to cache
     * @param {Object} fragment fragment object.
     */
    add(fragment, references = true) {
        if (this.has(fragment.id)) return;
        if (this.has(fragment.fields?.originalId)) return;

        this.#fragmentCache.set(fragment.id, fragment);
        if (fragment.fields?.originalId) {
            this.#fragmentCache.set(fragment.fields.originalId, fragment);
        }
        if (this.#promises.has(fragment.id)) {
            const [, resolve] = this.#promises.get(fragment.id);
            resolve();
        }
        if (this.#promises.has(fragment.fields?.originalId)) {
            const [, resolve] = this.#promises.get(fragment.fields?.originalId);
            resolve();
        }

        if (!references || typeof fragment.references !== 'object' || Array.isArray(fragment.references)) return;

        for (const key in fragment.references) {
            const { type, value } = fragment.references[key];
            if (type === 'content-fragment') {
                value.settings = {
                    ...fragment?.settings,
                    ...value.settings,
                };
                value.placeholders = {
                    ...fragment?.placeholders,
                    ...value.placeholders,
                };
                value.dictionary = {
                    ...fragment?.dictionary,
                    ...value.dictionary,
                };
                value.priceLiterals = {
                    ...fragment?.priceLiterals,
                    ...value.priceLiterals,
                };
                this.add(value, fragment);
            }
        }
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

    getAsPromise(key) {
        let [promise] = this.#promises.get(key) ?? [];
        if (promise) {
            return promise;
        }
        let resolveFn;
        promise = new Promise((resolve) => {
            resolveFn = resolve;
            if (this.has(key)) {
                resolve();
            }
        });
        this.#promises.set(key, [promise, resolveFn]);
        return promise;
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
        this.#fetchInfos.delete(fragmentId);
        this.#promises.delete(fragmentId);
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
    cache = cache; // TO be deprecated
    static cache = cache;
    #log;

    #rawData = null;
    #data = null;
    #service = null;

    /**
     * @type {string} fragment id
     */
    #fragmentId;
    #fetchInfo;
    #loading = LOADING_EAGER;
    #timeout = 5000;

    /**
     * Internal promise to track if fetching is in progress.
     */
    #fetchPromise;

    #author = false;
    #fetchCount = 0;

    #preview = undefined;

    static get observedAttributes() {
        return [
            ATTRIBUTE_FRAGMENT,
            ATTRIBUTE_LOADING,
            ATTRIBUTE_TIMEOUT,
            ATTRIBUTE_AUTHOR,
            ATTRIBUTE_PREVIEW,
        ];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === ATTRIBUTE_FRAGMENT) {
            this.#fragmentId = newValue;
            this.#fetchInfo = cache.getFetchInfo(newValue);
        }
        if (name === ATTRIBUTE_LOADING && LOADING_VALUES.includes(newValue)) {
            this.#loading = newValue;
        }
        if (name === ATTRIBUTE_TIMEOUT) {
          this.#timeout = parseInt(newValue, 10);
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
        if (this.#loading === LOADING_CACHE) {
            await Promise.race([
                cache.getAsPromise(this.#fragmentId),
                new Promise((resolve) =>
                    setTimeout(resolve, this.#timeout),
                ),
            ]);
        }
        try {
            this.#fetchPromise = this.#fetchData();
            await this.#fetchPromise;
        } catch (e) {
            this.#fail(e.message);
            return false;
        }
        const { references, referencesTree, placeholders, wcs } =
            this.#rawData || {};

        if (wcs && !getParameter('mas.disableWcsCache')) {
            this.#service.prefillWcsCache(wcs);
        }

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
        const { masIOUrl, wcsApiKey, country, locale } = this.#service.settings;
        let endpoint = `${masIOUrl}/fragment?id=${this.#fragmentId}&api_key=${wcsApiKey}&locale=${locale}`;
        if (country && !locale.endsWith(`_${country}`)) {
            endpoint += `&country=${country}`;
        }

        fragment = await this.#getFragmentById(endpoint);
        fragment.fields.originalId ??= this.#fragmentId;
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

    /**
     * Gets the URL for loading fragment-client.js based on maslibs parameter
     * @returns {string} URL for fragment-client.js
     */
    getFragmentClientUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const masLibs = urlParams.get('maslibs');
        
        if (!masLibs || masLibs.trim() === '') {
            return 'https://mas.adobe.com/studio/libs/fragment-client.js';
        }      
        const sanitizedMasLibs = masLibs.trim().toLowerCase();
        
        if (sanitizedMasLibs === 'local') {
            return 'http://localhost:3030/studio/libs/fragment-client.js';
        }
        
        // Detect current domain extension (.page or .live)
        const { hostname } = window.location;
        const extension = hostname.endsWith('.page') ? 'page' : 'live';
        if (sanitizedMasLibs.includes('--')) {
            return `https://${sanitizedMasLibs}.aem.${extension}/studio/libs/fragment-client.js`;
        }
        return `https://${sanitizedMasLibs}--mas--adobecom.aem.${extension}/studio/libs/fragment-client.js`;
    }

    async generatePreview() {
        const fragmentClientUrl = this.getFragmentClientUrl();
        const { previewFragment } = await import(fragmentClientUrl);
        const data = await previewFragment(this.#fragmentId, {
            locale: this.#service.settings.locale,
            apiKey: this.#service.settings.wcsApiKey,
        });
        return data;
    }
}

customElements.define(AEM_FRAGMENT_TAG_NAME, AemFragment);
