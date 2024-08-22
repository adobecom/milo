import { AEM } from './aem.js';
import { createTag } from './utils.js';

const ATTR_AEM_BUCKET = 'aem-bucket';

const xglMappings = {
    '3f499a92-88ac-4376-8c1e-90eda48565db': 'illustrator-lapsed',
    'd50952b3-1245-4074-8edf-b72f44094ea9': 'photoshop-lapsed',
    'f731437c-1d9c-4e94-949b-5ab010f5d72b': 'photography-upsell',
    '1abe0afe-e370-42b2-9daa-cb3ea9802b12': 'photoshop-single-app',
};

const cardContent = {
    catalog: {
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
    'special-offers': {
        name: {
            tag: 'h4',
            slot: 'detail-m',
        },
        title: {
            tag: 'h4',
            slot: 'detail-m',
        },
        backgroundImage: {
            tag: 'div',
            slot: 'bg-image',
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

async function parseMerchCard(fragmentData, appendFn, merchCard, consonant) {
    const item = fragmentData.fields.reduce(
        (acc, { name, multiple, values }) => {
            acc[name] = multiple ? values : values[0];
            return acc;
        },
        { id: fragmentData.id },
    );
    item.path = item.path;
    item.model = item.model;

    const { variant = 'catalog' } = item;
    merchCard.setAttribute('variant', variant);
    const cardMapping = cardContent[variant] ?? 'catalog';
    item.icon?.forEach((icon) => {
        const merchIcon = createTag('merch-icon', {
            slot: 'icons',
            src: icon,
            alt: '',
            href: '',
            size: 'l',
        });
        appendFn(merchIcon);
    });

    if (item.title && cardMapping.title) {
        appendFn(
            createTag(
                cardMapping.title.tag,
                { slot: cardMapping.title.slot },
                item.title,
            ),
        );
    }

    if (item.backgroundImage && cardMapping.backgroundImage) {
        appendFn(
            createTag(
                cardMapping.backgroundImage.tag,
                { slot: cardMapping.backgroundImage.slot },
                `<img loading="lazy" src="${item.backgroundImage}" width="600" height="362">`,
            ),
        );
    }

    if (item.prices && cardMapping.prices) {
        const prices = item.prices;
        const headingM = createTag(
            cardMapping.prices.tag,
            { slot: cardMapping.prices.slot },
            prices,
        );
        appendFn(headingM);
    }

    if (item.description && cardMapping.description) {
        const body = createTag(
            cardMapping.description.tag,
            { slot: cardMapping.description.slot },
            item.description,
        );
        appendFn(body);
    }

    if (item.ctas) {
        let ctas = item.ctas;
        const footer = createTag('div', { slot: 'footer' }, ctas);
        [...footer.querySelectorAll('a')].forEach((cta) => {
            if (consonant) {
                cta.classList.add('con-button');
                if (cta.parentElement.tagName === 'STRONG') {
                    cta.classList.add('blue');
                }
                footer.appendChild(cta);
            } else {
                const spectrumCta = createTag('sp-button', {}, cta);
                spectrumCta.addEventListener('click', (e) => {
                    e.stopPropagation();
                    cta.click();
                });
                footer.appendChild(spectrumCta);
            }
        });
        appendFn(footer);
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
     * @type {import('@adobe/mas-web-components').AEM}
     */
    #aem;
    cache = cache;

    /**
     * @type {HtmlElement[]}
     */
    refs = [];

    /**
     * @type {string} fragment path
     */
    path;

    /**
     * Consonant styling for CTAs.
     */
    consonant = false;

    static get observedAttributes() {
        return ['source', 'path', 'consonant'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this[name] = newValue;
    }

    connectedCallback() {
        this.consonant = this.hasAttribute('consonant');
        this.clearRefs();
        const bucket =
            this.getAttribute(ATTR_AEM_BUCKET) ??
            document
                .querySelector('mas-studio')
                ?.getAttribute(ATTR_AEM_BUCKET) ??
            'publish-p22655-e59341';
        this.#aem = new AEM(bucket);
        this.fetchData();
    }

    clearRefs() {
        this.refs.forEach((ref) => {
            ref.remove();
        });
    }

    refresh(flushCache = true) {
        this.clearRefs();
        this.refs = [];
        if (flushCache) {
            this.cache.remove(this.path);
        }
        this.fetchData();
    }

    async fetchData() {
        let item = cache.get(this.path);
        if (!item) {
            item = await this.#aem.sites.cf.fragments.getByPath(this.path);
        }
        const mostRelevantProfile = (
            sessionStorage.getItem('mas_xlg') ??
            window.alloy_all?.data?._adobe_corpnew?.digitalData?.adobe?.xlg
        )
            ?.split(',')
            ?.map((id) => xglMappings[id])
            .find(Boolean);
        const itemXlg = item.fields.find((field) => field.name === 'xlg')?.values[0];
        if (mostRelevantProfile && itemXlg?.includes(mostRelevantProfile)) {
            const promo = await this.#aem.sites.cf.fragments
                .getByPath(`${this.path}-${mostRelevantProfile}`)
                .catch(() => null);
            if (promo) {
                item = promo;
            }
        }
        if (item) {
            const appendFn = (element) => {
                this.parentElement.appendChild(element);
                this.refs.push(element);
            };
            parseMerchCard(item, appendFn, this.parentElement, this.consonant);
            return;
        }
    }
}

customElements.define('merch-datasource', MerchDataSource);
