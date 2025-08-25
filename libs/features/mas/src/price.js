import { Defaults } from './defaults.js';
import {
    price,
    pricePromo,
    priceOptical,
    priceStrikethrough,
    priceAnnual,
    priceWithAnnual,
    pricePromoWithAnnual,
    priceAlternative,
    priceOpticalAlternative,
    legal,
} from './price/index.js';

import { discount } from './discount/index.js';

import {
    omitProperties,
    computePromoStatus,
    toBoolean,
} from '@dexter/tacocat-core';
import { InlinePrice } from './inline-price.js';
import { toOfferSelectorIds, toQuantity } from './utilities.js';

export function Price({ literals, providers, settings }) {
    function collectPriceOptions(overrides, placeholder = null) {
        
        let options = {
            country: settings.country,
            language: settings.language,
            locale: settings.locale,
            literals: { ...literals.price },
        };

        if (placeholder && providers?.price) {
            for (const provider of providers.price) {
                provider(placeholder, options);
            }
        }
        const {
            displayOldPrice,
            displayPerUnit,
            displayRecurrence,
            displayTax,
            displayPlanType,
            forceTaxExclusive,
            perpetual,
            displayAnnual,
            promotionCode,
            quantity,
            alternativePrice,
            wcsOsi,
            ...rest
        } = Object.assign(options, placeholder?.dataset ?? {}, overrides ?? {});

        options = omitProperties(
            Object.assign({
              ...options,
              ...rest,
                displayOldPrice: toBoolean(displayOldPrice),
                displayPerUnit: toBoolean(displayPerUnit),
                displayRecurrence: toBoolean(displayRecurrence),
                displayTax: toBoolean(displayTax),
                displayPlanType: toBoolean(displayPlanType),
                forceTaxExclusive: toBoolean(forceTaxExclusive),
                perpetual: toBoolean(perpetual),
                displayAnnual: toBoolean(displayAnnual),
                promotionCode:
                    computePromoStatus(promotionCode).effectivePromoCode,
                quantity: toQuantity(quantity, Defaults.quantity),
                alternativePrice: toBoolean(alternativePrice),
                wcsOsi: toOfferSelectorIds(wcsOsi),
            }),
        );

        return options;
    }

    function buildPriceHTML(offers, options) {
        if (!Array.isArray(offers) || !offers.length || !options) {
            return '';
        }
        /* c8 ignore next 20 */
        const { template } = options;
        let method;
        switch (template) {
            // TODO: use price template name constants, export them from `consonant-templates`
            case 'discount':
                method = discount;
                break;
            case 'strikethrough':
                method = priceStrikethrough;
                break;
            case 'annual':
                method = priceAnnual;
                break;
            case 'legal':
                method = legal;
                break;
            default:
                if (
                    options.template === 'optical' &&
                    options.alternativePrice
                ) {
                    method = priceOpticalAlternative;
                } else if (options.template === 'optical') {
                    method = priceOptical;
                } else if (
                    options.displayAnnual &&
                    offers[0].planType === 'ABM'
                ) {
                    method = options.promotionCode
                        ? pricePromoWithAnnual
                        : priceWithAnnual;
                } else if (options.alternativePrice) {
                    method = priceAlternative;
                } else {
                    method = options.promotionCode ? pricePromo : price;
                }
        }

        let [offer] = offers;
        offer = { ...offer, ...offer.priceDetails };
        return method({...settings, ...options}, offer);
    }

    const createInlinePrice = InlinePrice.createInlinePrice;

    return {
        InlinePrice,
        buildPriceHTML,
        collectPriceOptions,
        createInlinePrice,
    };
}
