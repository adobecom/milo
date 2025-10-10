import { STATE_FAILED, FF_DEFAULTS } from './constants.js';
import {
    createMasElement,
    MasElement,
} from './mas-element.js';
import { selectOffers, getService } from './utilities.js';
import { Defaults } from './defaults.js';

const INDIVIDUAL = 'INDIVIDUAL_COM';
const BUSINESS = 'TEAM_COM';
const STUDENT = 'INDIVIDUAL_EDU';
const UNIVERSITY = 'TEAM_EDU';

// countries where tax is displayed for all segments by default
const DISPLAY_ALL_TAX_COUNTRIES = [
    'GB_en',
    'AU_en',
    'FR_fr',
    'AT_de',
    'BE_en',
    'BE_fr',
    'BE_nl',
    'BG_bg',
    'CH_de',
    'CH_fr',
    'CH_it',
    'CZ_cs',
    'DE_de',
    'DK_da',
    'EE_et',
    'EG_ar',
    'EG_en',
    'ES_es',
    'FI_fi',
    'GR_el',
    'GR_en',
    'HU_hu',
    'IE_en',
    'IT_it',
    'LU_de',
    'LU_en',
    'LU_fr',
    'NL_nl',
    'NO_nb',
    'PL_pl',
    'PT_pt',
    'RO_ro',
    'SE_sv',
    'SI_sl',
    'SK_sk',
    'TR_tr',
    'UA_uk',
    'ID_en',
    'ID_in',
    'IN_en',
    'IN_hi',
    'JP_ja',
    'MY_en',
    'MY_ms',
    'NZ_en',
    'TH_en',
    'TH_th',
];

// countries where tax is displayed for some segments only by default
const DISPLAY_TAX_MAP = {
    [INDIVIDUAL]: [
        'MU_en',
        'LT_lt',
        'LV_lv',
        'NG_en',
        'SA_ar',
        'SA_en',
        'SG_en',
        'KR_ko',
    ],
    [BUSINESS]: ['MU_en', 'LT_lt', 'LV_lv', 'NG_en', 'CO_es', 'KR_ko'],
    [STUDENT]: ['LT_lt', 'LV_lv', 'SA_en', 'SG_en'],
    [UNIVERSITY]: ['SG_en', 'KR_ko'],
};

// For most countries where tax label is displayed the tax is included for Individuals and Students
// and excluded for Business and Universities. This is the map of TaxExclusive values for other countries
const TAX_EXCLUDED_MAP = {
  ['MU_en']: [false, false, false, false],
  ['NG_en']: [false, false, false, false],
  ['AU_en']: [false, false, false, false],
  ['JP_ja']: [false, false, false, false],
  ['NZ_en']: [false, false, false, false],
  ['TH_en']: [false, false, false, false],
  ['TH_th']: [false, false, false, false],
  ['CO_es']: [false, true, false, false],
  ['AT_de']: [false, false, false, true],
  ['SG_en']: [false, false, false, true],
};
const TAX_EXCLUDED_MAP_INDEX = [INDIVIDUAL, BUSINESS, STUDENT, UNIVERSITY];
const defaultTaxExcluded = (segment) => [BUSINESS, UNIVERSITY].includes(segment);

/**
 * Resolves the default value for forceTaxExclusive for the provided geo info and segments.
 * @param {string} country - uppercase country code e.g. US, AT, MX
 * @param {string} language - lowercase language code e.g. en, de, es
 * @param {string} customerSegment - customer segment: INDIVIDUAL or TEAM
 * @param {string} marketSegment - market segment: COM or EDU
 * @returns {boolean} true if price will be displayed without tax, otherwise false (default)
 */
const resolveTaxExclusive = (country, language, customerSegment, marketSegment) => {
    const locale = `${country}_${language}`;
    const segment = `${customerSegment}_${marketSegment}`;
    const val = TAX_EXCLUDED_MAP[locale];
    if (val) {
        const index = TAX_EXCLUDED_MAP_INDEX.indexOf(segment);
        return val[index];
    }

    return defaultTaxExcluded(segment);
}

/**
 * Resolves the default value of displayTax property, for the provided geo info and segments.
 * @param {string} country - uppercase country code e.g. US, AT, MX
 * @param {string} language - lowercase language code e.g. en, de, es
 * @param {string} customerSegment - customer segment: INDIVIDUAL or TEAM
 * @param {string} marketSegment - market segment: COM or EDU
 * @returns {boolean} true if tax label will be displayed, otherwise false (default)
 */
const resolveDisplayTaxForGeoAndSegment = (country, language, customerSegment, marketSegment) => {
    const locale = `${country}_${language}`;
    if (DISPLAY_ALL_TAX_COUNTRIES.includes(country)
        || DISPLAY_ALL_TAX_COUNTRIES.includes(locale)) {
        return true;
    }

    const segmentConfig = DISPLAY_TAX_MAP[`${customerSegment}_${marketSegment}`];
    if (!segmentConfig) {
        return Defaults.displayTax;
    }

    if (segmentConfig.includes(country) || segmentConfig.includes(locale)) {
        return true;
    }

    return Defaults.displayTax;
}

/**
 * Resolves default values of displayTax and forceTaxExclusive, based on provided geo info and segments extracted from offers object.
 * These values will be used when the query parameters "tax" and "exclusive" are not set in the merch link, and in OST for initial
 * values for checkboxes "Tax label" and "Include tax".
 * @param {string} country - uppercase country code e.g. US, AT, MX
 * @param {string} language - lowercase language code e.g. en, de, es
 * @param {string} customerSegment - customer segment: INDIVIDUAL or TEAM
 * @param {string} marketSegment - market segment: COM or EDU
 * @returns {Promise<{displayTax: boolean, forceTaxExclusive: boolean}>} A promise with boolean properties displayTax and forceTaxExclusive
 */
export const resolvePriceTaxFlags = async (country, language, customerSegment, marketSegment) => {
    const displayTax = resolveDisplayTaxForGeoAndSegment(country, language, customerSegment, marketSegment);
    return {
        displayTax,
        forceTaxExclusive: displayTax ? resolveTaxExclusive(country, language, customerSegment, marketSegment) : Defaults.forceTaxExclusive
    };
}

export class InlinePrice extends HTMLSpanElement {
    static is = 'inline-price';
    static tag = 'span';
    static get observedAttributes() {
        return [
            'data-display-old-price',
            'data-display-per-unit',
            'data-display-recurrence',
            'data-display-tax',
            'data-display-plan-type',
            'data-display-annual',
            'data-perpetual',
            'data-promotion-code',
            'data-force-tax-exclusive',
            'data-template',
            'data-wcs-osi',
            'data-quantity',
        ];
    }

    static createInlinePrice(options) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const service = getService();
        if (!service) return null;
        const {
            displayOldPrice,
            displayPerUnit,
            displayRecurrence,
            displayTax,
            displayPlanType,
            displayAnnual,
            forceTaxExclusive,
            perpetual,
            promotionCode,
            quantity,
            alternativePrice,
            template,
            wcsOsi,
        } = service.collectPriceOptions(options);
        const element = createMasElement(InlinePrice, {
            displayOldPrice,
            displayPerUnit,
            displayRecurrence,
            displayTax,
            displayPlanType,
            displayAnnual,
            forceTaxExclusive,
            perpetual,
            promotionCode,
            quantity,
            alternativePrice,
            template,
            wcsOsi,
        });
        return element;
    }

    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
    }

    get isInlinePrice() {
        return true;
    }

    masElement = new MasElement(this);

    attributeChangedCallback(name, _, value) {
        this.masElement.attributeChangedCallback(name, _, value);
    }

    connectedCallback() {
        this.masElement.connectedCallback();
        this.addEventListener('click', this.handleClick);
    }

    disconnectedCallback() {
        this.masElement.disconnectedCallback();
        this.removeEventListener('click', this.handleClick);
    }

    handleClick(event) {
        /* c8 ignore next 4 */
        if (event.target === this) return;
        // re-dispatch click event from the price element
        event.stopImmediatePropagation();
        this.dispatchEvent(
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
            }),
        );
    }

    onceSettled() {
        return this.masElement.onceSettled();
    }

    get value() {
        return this.masElement.value;
    }

    get options() {
        return this.masElement.options;
    }

    get isFailed() {
        return this.masElement.state === STATE_FAILED;
    }

    requestUpdate(force = false) {
        return this.masElement.requestUpdate(force);
    }

    /**
     * Resolves associated osi via Wcs and renders price offer.
     * @param {Record<string, any>} overrides
     */
    async render(overrides = {}) {
        if (!this.isConnected) return false;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const service = getService();
        if (!service) return false;
        const priceOptions = service.collectPriceOptions(overrides, this);
        const options = {
            ...service.settings,
            ...priceOptions,
        };
        if (!options.wcsOsi.length) return false;
        try {
            const version = this.masElement.togglePending({});
            this.innerHTML = '';
            const [offerSelectors] =
                await service.resolveOfferSelectors(options);
            let offers = selectOffers(await offerSelectors, options);
            let [offer] = offers;

            if (service.featureFlags[FF_DEFAULTS]) {
                if (priceOptions.displayPerUnit === undefined) {
                    options.displayPerUnit =
                        offer.customerSegment !== 'INDIVIDUAL';
                }
                // if displayTax or forceTaxExclusive is not set, we need to resolve the values based on the geo and segment
                if (
                    priceOptions.displayTax === undefined ||
                    priceOptions.forceTaxExclusive === undefined
                ) {
                    const { country, language } = options;
                    const [marketSegment = ''] = offer.marketSegments;
                    // set default value for displayTax and forceTaxExclusive if not set neither in OST nor in merch link
                    const flags = await resolvePriceTaxFlags(
                        country,
                        language,
                        offer.customerSegment,
                        marketSegment,
                    );
                    if (priceOptions.displayTax === undefined) {
                        options.displayTax =
                            flags?.displayTax || options.displayTax;
                    }
                    if (priceOptions.forceTaxExclusive === undefined) {
                        options.forceTaxExclusive =
                            flags?.forceTaxExclusive ||
                            options.forceTaxExclusive;
                    }
                    if (options.forceTaxExclusive) {
                        offers = selectOffers(offers, options);
                    }
                }
            } else {
                if (priceOptions.displayOldPrice === undefined) {
                    options.displayOldPrice = true;
                }
            }
            return this.renderOffers(offers, options, version);
        } catch (error) {
            this.innerHTML = '';
            throw error;
        }
    }

    // TODO: can be extended to accept array of offers and compute subtotal price
    /**
     * Renders price offer as HTML of this component
     * using consonant price template functions
     * @param {Offer[]} offers
     * @param {Record<string, any>} options
     * @param {number} version
     */
    renderOffers(offers, options, version = undefined) {
        if (!this.isConnected) return;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const service = getService();
        if (!service) return false;
        version ??= this.masElement.togglePending();
        if (offers.length) {
            if (this.masElement.toggleResolved(version, offers, options)) {
                this.innerHTML = service.buildPriceHTML(offers, this.options);

                // Adding logic for options.alternativePrice to add <sr-only>Alternatively at</sr-only>
                const parentEl = this.closest('p, h3, div');
                if (
                    !parentEl ||
                    !parentEl.querySelector(
                        'span[data-template="strikethrough"]',
                    ) ||
                    parentEl.querySelector('.alt-aria-label')
                )
                    return true;
                const inlinePrices = parentEl?.querySelectorAll(
                    'span[is="inline-price"]',
                );
                if (
                    inlinePrices.length > 1 &&
                    inlinePrices.length ===
                        parentEl.querySelectorAll(
                            'span[data-template="strikethrough"]',
                        ).length *
                            2
                ) {
                    inlinePrices.forEach((price) => {
                        if (
                            price.dataset.template !== 'strikethrough' &&
                            price.options &&
                            !price.options.alternativePrice &&
                            !price.isFailed
                        ) {
                            price.options.alternativePrice = true;
                            price.innerHTML = service.buildPriceHTML(
                                offers,
                                price.options,
                            );
                        }
                    });
                }
                return true;
            }
        } else {
            const error = new Error(
                `Not provided: ${this.options?.wcsOsi ?? '-'}`,
            );
            if (this.masElement.toggleFailed(version, error, this.options)) {
                this.innerHTML = '';
                return true;
            }
        }
        /* c8 ignore next 1 */
        return false;
    }
}

// Define custom DOM element
if (!window.customElements.get(InlinePrice.is)) {
    window.customElements.define(InlinePrice.is, InlinePrice, {
        extends: InlinePrice.tag,
    });
}
