import { AEM } from './aem.js';
import { createTag } from './utils.js';

const ATTR_AEM_BUCKET = 'aem-bucket';

const VARIANTS = {
    CATALOG: 'catalog',
    AH: 'ah',
    CCD_ACTION: 'ccd-action',
    SPECIAL_OFFERS: 'special-offers',
    CCD_SLICE: 'ccd-slice',
};

const cardContent = {
    [VARIANTS.CATALOG]: {
        title: { tag: 'h3', slot: 'heading-xs' },
        prices: { tag: 'h3', slot: 'heading-xs' },
        description: { tag: 'div', slot: 'body-xs' },
        ctas: { size: 'l' },
    },
    [VARIANTS.AH]: {
        title: { tag: 'h3', slot: 'heading-xxs' },
        prices: { tag: 'h3', slot: 'heading-xs' },
        description: { tag: 'div', slot: 'body-xxs' },
        ctas: { size: 's' },
    },
    [VARIANTS.CCD_ACTION]: {
        title: { tag: 'h3', slot: 'heading-xs' },
        prices: { tag: 'h3', slot: 'heading-xs' },
        description: { tag: 'div', slot: 'body-xs' },
        ctas: { size: 'l' },
    },
    [VARIANTS.SPECIAL_OFFERS]: {
        name: { tag: 'h4', slot: 'detail-m' },
        title: { tag: 'h4', slot: 'detail-m' },
        backgroundImage: { tag: 'div', slot: 'bg-image' },
        prices: { tag: 'h3', slot: 'heading-xs' },
        description: { tag: 'div', slot: 'body-xs' },
        ctas: { size: 'l' },
    },
    [VARIANTS.CCD_SLICE]: {
      backgroundImage: { tag: 'div', slot: 'image' },
      description: { tag: 'div', slot: 'body-xs' },
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
        // TODO improve image logic
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
        const footer = createTag('div', { slot: 'footer' }, item.ctas);
        const ctas = [];
        [...footer.querySelectorAll('a')].forEach((cta) => {
            const strong = cta.parentElement.tagName === 'STRONG';
            if (consonant) {
                cta.classList.add('con-button');
                if (strong) {
                    cta.classList.add('blue');
                }
                ctas.push(cta);
            } else {
                const treatment = strong ? 'fill' : 'outline';
                const variant = strong ? 'accent' : 'primary';
                const spectrumCta = createTag(
                    'sp-button',
                    { treatment, variant },
                    cta,
                );
                spectrumCta.addEventListener('click', (e) => {
                    /* c8 ignore next 2 */
                    e.stopPropagation();
                    cta.click();
                });
                ctas.push(spectrumCta);
            }
        });
        footer.innerHTML = '';
        footer.append(...ctas);
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

    /**
     * Internal promise to track the readiness of the web-component to render.
     */
    #readyPromise;

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
            this.getAttribute(ATTR_AEM_BUCKET) ?? 'publish-p22655-e59341';
        this.#aem = new AEM(bucket);
        this.refresh(false);
    }

    clearRefs() {
        this.refs.forEach((ref) => {
            ref.remove();
        });
    }

    async refresh(flushCache = true) {
        if (!this.path) return;

        if (this.#readyPromise) {
            const ready = await Promise.race([
                this.#readyPromise,
                Promise.resolve(false),
            ]);
            if (!ready) return; // already fetching data
        }

        this.clearRefs();
        this.refs = [];
        if (flushCache) {
            this.cache.remove(this.path);
        }
        this.#readyPromise = this.fetchData().then(() => true);
    }

    async fetchData() {
        let item = cache.get(this.path);
        if (!item) {
            item = await this.#aem.sites.cf.fragments.getByPath(this.path);
            cache.add(item);
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

    get updateComplete() {
        return (
            this.#readyPromise ??
            Promise.reject(new Error('datasource is not correctly configured'))
        );
    }
}

customElements.define('merch-datasource', MerchDataSource);
