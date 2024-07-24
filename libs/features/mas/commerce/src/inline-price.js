import {
    createPlaceholder,
    definePlaceholder,
    selectPlaceholders,
    updatePlaceholder,
} from './placeholder.js';
import { selectOffers, useService } from './utilities.js';
import { GeoMap } from './settings';

// countries where tax is displayed for all segments by default
const DISPLAY_ALL_TAX_COUNTRIES = [
    GeoMap.uk,
    GeoMap.au,
    GeoMap.fr,
    GeoMap.at,
    GeoMap.be_en,
    GeoMap.be_fr,
    GeoMap.be_nl,
    GeoMap.bg,
    GeoMap.ch_de,
    GeoMap.ch_fr,
    GeoMap.ch_it,
    GeoMap.cz,
    GeoMap.de,
    GeoMap.dk,
    GeoMap.ee,
    GeoMap.eg_ar,
    GeoMap.eg_en,
    GeoMap.es,
    GeoMap.fi,
    GeoMap.fr,
    GeoMap.gr_el,
    GeoMap.gr_en,
    GeoMap.hu,
    GeoMap.ie,
    GeoMap.it,
    GeoMap.lu_de,
    GeoMap.lu_en,
    GeoMap.lu_fr,
    GeoMap.nl,
    GeoMap.no,
    GeoMap.pl,
    GeoMap.pt,
    GeoMap.ro,
    GeoMap.se,
    GeoMap.si,
    GeoMap.sk,
    GeoMap.tr,
    GeoMap.ua,
    GeoMap.id_en,
    GeoMap.id_id,
    GeoMap.in_en,
    GeoMap.in_hi,
    GeoMap.jp,
    GeoMap.my_en,
    GeoMap.my_ms,
    GeoMap.nz,
    GeoMap.th_en,
    GeoMap.th_th,
];
// countries where tax is displayed for some segments only by default
const DISPLAY_TAX_MAP = {
    INDIVIDUAL_COM: [
        GeoMap.za,
        GeoMap.lt,
        GeoMap.lv,
        GeoMap.ng,
        GeoMap.sa_ar,
        GeoMap.sa_en,
        GeoMap.za,
        GeoMap.sg,
        GeoMap.kr,
    ], // individual
    TEAM_COM: [
        GeoMap.za,
        GeoMap.lt,
        GeoMap.lv,
        GeoMap.ng,
        GeoMap.za,
        GeoMap.co,
        GeoMap.kr,
    ], // business
    INDIVIDUAL_EDU: [GeoMap.lt, GeoMap.lv, GeoMap.sa_en, GeoMap.sea], // student
    TEAM_EDU: [GeoMap.sea, GeoMap.kr], // school and uni
};

/** @type {Commerce.Price.PlaceholderConstructor} */
export class HTMLPriceSpanElement extends HTMLSpanElement {
    static is = 'inline-price';
    static tag = 'span';
    static get observedAttributes() {
        return [
            'data-display-old-price',
            'data-display-per-unit',
            'data-display-recurrence',
            'data-display-tax',
            'data-perpetual',
            'data-promotion-code',
            'data-tax-exclusive',
            'data-template',
            'data-wcs-osi',
        ];
    }

    /** @type {Commerce.Price.PlaceholderConstructor["createInlinePrice"]} */
    static createInlinePrice(options) {
        const service = useService();
        if (!service) return null;
        const {
            displayOldPrice,
            displayPerUnit,
            displayRecurrence,
            displayTax,
            forceTaxExclusive,
            perpetual,
            promotionCode,
            quantity,
            template,
            wcsOsi,
        } = service.collectPriceOptions(options);
        /** @type {Commerce.Price.Placeholder} */
        // @ts-ignore
        const element = createPlaceholder(HTMLPriceSpanElement, {
            displayOldPrice,
            displayPerUnit,
            displayRecurrence,
            displayTax,
            forceTaxExclusive,
            perpetual,
            promotionCode,
            quantity,
            template,
            wcsOsi,
        });
        return element;
    }

    // TODO: consider moving this function to the `web-components` package
    /** @type {Commerce.Price.PlaceholderConstructor["getInlinePrices"]} */
    static getInlinePrices(container) {
        /** @type {Commerce.Price.Placeholder[]} */
        // @ts-ignore
        const elements = selectPlaceholders(HTMLPriceSpanElement, container);
        return elements;
    }

    get isInlinePrice() {
        return true;
    }

    /**
     * Returns `this`, typed as Placeholder mixin.
     * @type {Commerce.Price.Placeholder}
     */
    get placeholder() {
        // @ts-ignore
        return this;
    }

    /**
     * Resolves default value of displayTax property, based on provided geo info and segments.
     * @returns {boolean}
     */
    resolveDisplayTaxForGeoAndSegment(
        country,
        language,
        customerSegment,
        marketSegment,
    ) {
        const locale = `${country}_${language}`;
        if (
            DISPLAY_ALL_TAX_COUNTRIES.includes(country) ||
            DISPLAY_ALL_TAX_COUNTRIES.includes(locale)
        ) {
            return true;
        }

        const segmentConfig =
            DISPLAY_TAX_MAP[`${customerSegment}_${marketSegment}`];
        if (!segmentConfig) {
            return false;
        }

        if (segmentConfig.includes(country) || segmentConfig.includes(locale)) {
            return true;
        }

        return false;
    }

    /**
     * Resolves default value of displayTax property, based on provided geo info and segments extracted from offers object.
     * @returns {boolean}
     */
    async resolveDisplayTax(service, options) {
        const [offerSelectors] = await service.resolveOfferSelectors(options);
        const offers = selectOffers(await offerSelectors, options);
        if (offers?.length) {
            const { country, language } = options;
            const offer = offers[0];
            const [marketSegment = ''] = offer.marketSegments;
            return this.resolveDisplayTaxForGeoAndSegment(
                country,
                language,
                offer.customerSegment,
                marketSegment,
            );
        }
    }

    /**
     * Resolves associated osi via Wcs and renders price offer.
     * @param {Record<string, any>} overrides
     */
    async render(overrides = {}) {
        if (!this.isConnected) return false;
        const service = useService();
        if (!service) return false;
        const options = service.collectPriceOptions(
            overrides,
            this.placeholder,
        );
        if (!options.wcsOsi.length) return false;

        /*
        Commented out until issues in content with manually added tax labels are resolved

        if (!this.placeholder.dataset.displayTax) {
            // set default value for displayTax if not set neither in OST nor in price URL
            options.displayTax =
                (await this.resolveDisplayTax(service, options)) || false;
        }
        */

        const version = this.placeholder.togglePending(options);
        this.innerHTML = '';
        const [promise] = service.resolveOfferSelectors(options);
        return this.renderOffers(
            selectOffers(await promise, options),
            options,
            version,
        );
    }

    // TODO: can be extended to accept array of offers and compute subtotal price
    /**
     * Renders price offer as HTML of this component
     * using consonant price template functions
     * from package `@dexter/tacocat-consonant-templates`.
     * @param {Commerce.Wcs.Offer[]} offers
     * @param {Record<string, any>} overrides
     * Optional object with properties to use as overrides
     * over those collected from dataset of this component.
     */
    renderOffers(offers, overrides = {}, version = undefined) {
        if (!this.isConnected) return;
        const service = useService();
        if (!service) return false;
        const options = service.collectPriceOptions({
            ...this.dataset,
            ...overrides,
        });
        version ??= this.placeholder.togglePending(options);
        if (offers.length) {
            if (this.placeholder.toggleResolved(version, offers, options)) {
                this.innerHTML = service.buildPriceHTML(offers, options);
                return true;
            }
        } else {
            const error = new Error(`Not provided: ${options?.wcsOsi ?? '-'}`);
            if (this.placeholder.toggleFailed(version, error, options)) {
                this.innerHTML = '';
                return true;
            }
        }
        return false;
    }

    updateOptions(options) {
        const service = useService();
        if (!service) return false;
        const {
            displayOldPrice,
            displayPerUnit,
            displayRecurrence,
            displayTax,
            forceTaxExclusive,
            perpetual,
            promotionCode,
            quantity,
            template,
            wcsOsi,
        } = service.collectPriceOptions(options);
        updatePlaceholder(this, {
            displayOldPrice,
            displayPerUnit,
            displayRecurrence,
            displayTax,
            forceTaxExclusive,
            perpetual,
            promotionCode,
            quantity,
            template,
            wcsOsi,
        });
        return true;
    }
}

export const InlinePrice = definePlaceholder(HTMLPriceSpanElement);
