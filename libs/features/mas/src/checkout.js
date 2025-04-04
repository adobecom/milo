import { CheckoutLink } from './checkout-link.js';
import { omitProperties, toBoolean, toEnumeration, computePromoStatus } from '@dexter/tacocat-core';
import { CheckoutWorkflow, CheckoutWorkflowStep } from './constants.js';

import { buildCheckoutUrl } from './buildCheckoutUrl.js';
import { Defaults } from './defaults.js';
import { toOfferSelectorIds, toQuantity } from './utilities.js';

/**
 * generate Checkout configuration
 */
export function Checkout({ providers, settings }) {
    // Memoize settings for frequently used values
    const {
        checkoutClientId,
        checkoutWorkflow: defaultWorkflow,
        checkoutWorkflowStep: defaultWorkflowStep,
        country: defaultCountry,
        language: defaultLanguage,
        promotionCode: defaultPromotionCode,
        quantity: defaultQuantity,
        env, 
        landscape
    } = settings;

    function collectCheckoutOptions(overrides, placeholder) {
        // Use nullish coalescing for simpler defaults
        const placeholderData = placeholder?.dataset ?? {};
        
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
        } = { ...placeholderData, ...overrides };
        
        const workflow = toEnumeration(
            checkoutWorkflow,
            CheckoutWorkflow,
            Defaults.checkoutWorkflow,
        );
        
        // Default workflow step based on workflow type
        const workflowStep = workflow === CheckoutWorkflow.V3 
            ? toEnumeration(
                checkoutWorkflowStep,
                CheckoutWorkflowStep,
                Defaults.checkoutWorkflowStep,
              )
            : CheckoutWorkflowStep.CHECKOUT;
        
        // Build options object once with all transformations
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
            modal: toBoolean(modal),
            perpetual: toBoolean(perpetual),
            promotionCode: computePromoStatus(promotionCode).effectivePromoCode,
            wcsOsi: toOfferSelectorIds(wcsOsi),
        });
        
        if (placeholder && providers.checkout) {
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
    function buildCheckoutURL(offers, options, modalType) {
        // Fast-path for empty offers
        if (!Array.isArray(offers) || !offers.length || !options) {
            return '';
        }
        
        const {
            checkoutClientId: clientId,
            checkoutMarketSegment: marketSegment,
            checkoutWorkflow: workflow,
            checkoutWorkflowStep: workflowStep,
            country,
            promotionCode: checkoutPromoCode,
            quantity,
            ...rest
        } = collectCheckoutOptions(options);
        
        // Determine context only once
        const context = window.frameElement || modalType ? 'if' : 'fp';
        
        // Create data object with defaults to avoid repetition
        const data = {
            checkoutPromoCode,
            clientId,
            context,
            country,
            env,
            items: [],
            marketSegment,
            workflowStep,
            landscape,
            ...rest,
        };
        
        // Optimize single vs multiple offer handling
        if (offers.length === 1) {
            const [{ offerId, offerType, productArrangementCode, marketSegments, customerSegment }] = offers;
            
            Object.assign(data, {
                marketSegment: marketSegments?.[0] ?? marketSegment,
                customerSegment,
                offerType,
                productArrangementCode,
            });
            
            // Avoid unnecessary object creation for quantity = 1
            data.items.push(
                quantity[0] === 1
                    ? { id: offerId }
                    : { id: offerId, quantity: quantity[0] }
            );
        } else {
            // Optimize multiple offers handling with map
            data.items = offers.map(({ offerId }, index) => ({
                id: offerId,
                quantity: quantity[index] ?? Defaults.quantity,
            }));
        }
        
        return buildCheckoutUrl(data, modalType);
    }

    // Destructure only once
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
