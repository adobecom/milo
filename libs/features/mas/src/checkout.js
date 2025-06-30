import { CheckoutLink } from './checkout-link.js';
import { omitProperties, toBoolean, toEnumeration, computePromoStatus } from '@dexter/tacocat-core';
import { CheckoutWorkflowStep } from './constants.js';

import { buildCheckoutUrl } from './buildCheckoutUrl.js';
import { Defaults } from './defaults.js';
import { toOfferSelectorIds, toQuantity } from './utilities.js';
import { MODAL_TYPE_3_IN_1 } from './constants.js';

/**
 * generate Checkout configuration
 */
export function Checkout({ settings }) {
    function collectCheckoutOptions(overrides, placeholder) {
        const {
            checkoutClientId,
            checkoutWorkflowStep: defaultWorkflowStep,
            country: defaultCountry,
            language: defaultLanguage,
            promotionCode: defaultPromotionCode,
            quantity: defaultQuantity,
            preselectPlan,
        } = settings;
        const {
            checkoutMarketSegment,
            checkoutWorkflowStep = defaultWorkflowStep,
            imsCountry,
            country = imsCountry ?? defaultCountry,
            language = defaultLanguage,
            quantity = defaultQuantity,
            entitlement,
            upgrade,
            modal,
            perpetual,
            promotionCode = defaultPromotionCode,
            wcsOsi,
            extraOptions,
            ...rest
        } = Object.assign({}, placeholder?.dataset ?? {}, overrides ?? {});  
        let workflowStep = toEnumeration(checkoutWorkflowStep, CheckoutWorkflowStep, Defaults.checkoutWorkflowStep);
        const options = omitProperties({
            ...rest,
            extraOptions,
            checkoutClientId,
            checkoutMarketSegment,
            country,
            quantity: toQuantity(quantity, Defaults.quantity),
            checkoutWorkflowStep: workflowStep,
            language,
            entitlement: toBoolean(entitlement),
            upgrade: toBoolean(upgrade),
            modal,
            perpetual: toBoolean(perpetual),
            promotionCode: computePromoStatus(promotionCode).effectivePromoCode,
            wcsOsi: toOfferSelectorIds(wcsOsi),
            preselectPlan,
        });
        return options;
    }

    /**
     * @param {*} offers
     * @param {*} options
     * @returns a checkout URL
     */
    function buildCheckoutURL(offers, options) {
      /* c8 ignore next 3 */
        if (!Array.isArray(offers) || !offers.length || !options) {
            return '';
        }
        const { env, landscape } = settings;
        const {
            checkoutClientId: clientId,
            checkoutMarketSegment,
            checkoutWorkflowStep: workflowStep,
            country,
            promotionCode: checkoutPromoCode,
            quantity: optionsQuantity,
            preselectPlan,
            ms, 
            cs,
            ...rest
        } = collectCheckoutOptions(options);
        const masFF3in1 = document.querySelector('meta[name=mas-ff-3in1]');
        const is3in1 = Object.values(MODAL_TYPE_3_IN_1).includes(options.modal) && (!masFF3in1 || masFF3in1.content !== 'off');
        const context = window.frameElement || is3in1 ? 'if' : 'fp';
        // even if CTA has multiple offers, they should have same ms, cs, ot values
        const [{ 
          productArrangementCode, 
          marketSegments: [offerMarketSegment], 
          customerSegment: offerCustomerSegment, 
          offerType }] = offers;
        // cleanup checkoutMarketSegment  - not needed
        let marketSegment = ms ?? offerMarketSegment ?? checkoutMarketSegment;
        let customerSegment = cs ?? offerCustomerSegment;
        //used on catalog page by MEP to preselect plan
        if (preselectPlan?.toLowerCase() === 'edu') {
          marketSegment = 'EDU';
        } else if (preselectPlan?.toLowerCase() === 'team') {
          customerSegment = 'TEAM';
        }
        const data = {
            is3in1,
            checkoutPromoCode,
            clientId,
            context,
            country,
            env,
            items: [],
            marketSegment,
            customerSegment,
            offerType,
            productArrangementCode,
            workflowStep,
            landscape,
            ...rest,
        };
        // even if there are multiple offers, only first main offer is used for quantity
        const quantity = optionsQuantity[0] > 1 ? optionsQuantity[0] : undefined;
        if (offers.length === 1) {
            const { offerId } = offers[0];
            data.items.push({ id: offerId, quantity });
        } else {
            /* c8 ignore next 7 */
            data.items.push(
                ...offers.map(({ offerId, productArrangementCode }) => ({
                    id: offerId,
                    quantity,
                    ...(is3in1 ? { productArrangementCode } : {}),
                })),
            );
        }
        return buildCheckoutUrl(data);
    }

    const { createCheckoutLink } = CheckoutLink;
    return {
      CheckoutLink,
      CheckoutWorkflowStep,
      buildCheckoutURL,
      collectCheckoutOptions,
      createCheckoutLink,
    };
}
