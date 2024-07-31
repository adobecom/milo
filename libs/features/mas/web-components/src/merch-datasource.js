import { AEM } from './aem.js';
import { createTag } from './utils.js';

const ATTR_AEM_BUCKET = 'aem-bucket';

const cardContent = {
    catalog: {
        name: 'catalog',
        title: {
            tag: 'h3',
            slot: 'heading-xs',
        },
        prices: {
            tag: 'h3',
            slot: 'heading-xs',
        },
        description: {
            tag: 'div',
            slot: 'body-xs',
        },
        ctas: { size: 'l' },
    },
    ah: {
        name: 'ah',
        title: {
            tag: 'h3',
            slot: 'heading-xxs',
        },
        prices: {
            tag: 'h3',
            slot: 'heading-xs',
        },
        description: {
            tag: 'div',
            slot: 'body-xxs',
        },
        ctas: { size: 's' },
    },
    'ccd-action': {
        name: 'ccd-action',
        title: {
            tag: 'h3',
            slot: 'heading-xs',
        },
        prices: {
            tag: 'h3',
            slot: 'heading-xs',
        },
        description: {
            tag: 'div',
            slot: 'body-xs',
        },
        ctas: { size: 'l' },
    },
};

async function parseMerchCard(item, merchCard) {
    const cardJson = item.fields.reduce((acc, { name, multiple, values }) => {
        acc[name] = multiple ? values : values[0];
        return acc;
    }, {});
    const { type = 'catalog' } = cardJson;
    const cardType = cardContent[type] || cardContent.catalog;

    merchCard.variant = type;

    merchCard.setAttribute('variant', type);
    cardJson.icon?.forEach((icon) => {
        const merchIcon = createTag('merch-icon', {
            slot: 'icons',
            src: icon,
            alt: '',
            href: '',
            size: 'l',
        });
        merchCard.append(merchIcon);
    });

    if (cardJson.title) {
        merchCard.append(
            createTag(
                cardType.title.tag,
                { slot: cardType.title.slot },
                cardJson.title,
            ),
        );
    }

    if (cardJson.prices) {
        const prices = cardJson.prices;
        const headingM = createTag(
            cardType.prices.tag,
            { slot: cardType.prices.slot },
            prices,
        );
        merchCard.append(headingM);
    }

    merchCard.append(
        createTag('p', { slot: 'body-xxs', id: 'individuals1' }, 'Desktop'),
    );

    if (cardJson.description) {
        const body = createTag(
            cardType.description.tag,
            { slot: cardType.description.slot },
            cardJson.description,
        );
        merchCard.append(body);
    }

    if (cardJson.ctas) {
        let ctas = cardJson.ctas;
        const footer = createTag('div', { slot: 'footer' }, ctas);
        merchCard.append(footer);
    }
}

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
 * Custom element representing a MerchDataSource.
 *
 * @attr {string} path - fragment path
 */
export class MerchDataSource extends HTMLElement {
    /**
     * @type {import('./aem.js').AEM}
     */
    #aem;
    cache = cache;

    /**
     * @type {string} fragment path
     */
    path;

    static get observedAttributes() {
        return ['source', 'path'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this[name] = newValue;
    }

    connectedCallback() {
        const bucket =
            this.getAttribute(ATTR_AEM_BUCKET) ??
            document.querySelector('mas-studio')?.getAttribute(ATTR_AEM_BUCKET);
        this.#aem = new AEM(bucket);
        this.fetchData();
    }

    refresh() {
        this.cache.remove(this.path);
        this.fetchData();
    }

    async fetchData() {
        let item = cache.get(this.path);
        if (!item) {
            item = await this.#aem.sites.cf.fragments.getCfByPath(this.path);
        }
        if (item) {
            parseMerchCard(item, this.parentElement);
            this.render();
            return;
        }

        this.render();
    }

    async render() {
        if (!this.isConnected) return;
        if (this.parentElement.tagName !== 'MERCH-CARD') return;
        await Promise.all(
            [
                ...this.parentElement.querySelectorAll(
                    '[is="inline-price"],[is="checkout-link"]',
                ),
            ].map((el) => el.onceSettled()),
        );
    }
}

customElements.define('merch-datasource', MerchDataSource);
