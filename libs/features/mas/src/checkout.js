import { CheckoutLink } from './checkout-link.js';
import { omitProperties, toBoolean, toEnumeration, computePromoStatus } from '@dexter/tacocat-core';
import { CheckoutWorkflow, CheckoutWorkflowStep } from './constants.js';

import { buildCheckoutUrl } from './buildCheckoutUrl.js';
import { Defaults } from './defaults.js';
import { toOfferSelectorIds, toQuantity } from './utilities.js';
import { MODAL_TYPE_3_IN_1 } from './constants.js';

/**
 * generate Checkout configuration
 */
export function Checkout({ providers, settings }) {
    function collectCheckoutOptions(overrides, placeholder) {
        const {
            checkoutClientId,
            checkoutWorkflow: defaultWorkflow,
            checkoutWorkflowStep: defaultWorkflowStep,
            country: defaultCountry,
            language: defaultLanguage,
            promotionCode: defaultPromotionCode,
            quantity: defaultQuantity,
        } = settings;
        const {
            checkoutMarketSegment,
            checkoutWorkflow = defaultWorkflow,
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
        const workflow = toEnumeration(
            checkoutWorkflow,
            CheckoutWorkflow,
            Defaults.checkoutWorkflow,
        );
        let workflowStep = CheckoutWorkflowStep.CHECKOUT;
        if (workflow === CheckoutWorkflow.V3) {
            workflowStep = toEnumeration(
                checkoutWorkflowStep,
                CheckoutWorkflowStep,
                Defaults.checkoutWorkflowStep,
            );
        }
        const options = omitProperties({
            ...rest,
            extraOptions,
            checkoutClientId,
            checkoutMarketSegment,
            country,
            quantity: toQuantity(quantity, Defaults.quantity),
            checkoutWorkflow: workflow,
            checkoutWorkflowStep: workflowStep,
            language,
            entitlement: toBoolean(entitlement),
            upgrade: toBoolean(upgrade),
            modal,
            perpetual: toBoolean(perpetual),
            promotionCode: computePromoStatus(promotionCode).effectivePromoCode,
            wcsOsi: toOfferSelectorIds(wcsOsi),
        });
        if (placeholder) {
            for (const provider of providers.checkout) {
                provider(placeholder, options);
            }
        }
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
            checkoutWorkflow: workflow,
            checkoutWorkflowStep: workflowStep,
            country,
            promotionCode: checkoutPromoCode,
            quantity,
            ...rest
        } = collectCheckoutOptions(options);
        const masFF3in1 = document.querySelector('meta[name=mas-ff-3in1]');
        const is3in1 = Object.values(MODAL_TYPE_3_IN_1).includes(options.modal) && (!masFF3in1 || masFF3in1.content !== 'off');
        const context = window.frameElement || is3in1 ? 'if' : 'fp';
        const data = {
            checkoutPromoCode,
            clientId,
            context,
            country,
            env,
            items: [],
            marketSegment: checkoutMarketSegment,
            workflowStep,
            landscape,
            ...rest,
        };
        // even if CTA has multiple offers, they should have same ms, cs, ot values
        const [{ productArrangementCode, marketSegments: [marketSegment], customerSegment, offerType }] = offers;
        Object.assign(data, {
            productArrangementCode,
            marketSegment,
            customerSegment,
            offerType,
        });
        if (offers.length === 1) {
            const { offerId } = offers[0];
            data.items.push(
                quantity[0] === 1
                    ? { id: offerId }
                    : { id: offerId, quantity: quantity[0] },
            );
        } else {
            /* c8 ignore next 7 */
            data.items.push(
                ...offers.map(({ offerId, productArrangementCode }, index) => ({
                    id: offerId,
                    quantity: quantity[index] ?? Defaults.quantity,
                    ...(is3in1 ? { productArrangementCode } : {}),
                })),
            );
        }
        return buildCheckoutUrl(data);
    }

    const { createCheckoutLink } = CheckoutLink;
    return {
      CheckoutLink,
      CheckoutWorkflow,
      CheckoutWorkflowStep,
      buildCheckoutURL,
      collectCheckoutOptions,
      createCheckoutLink,
    };
}
