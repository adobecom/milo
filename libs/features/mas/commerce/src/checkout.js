import { CheckoutLink } from './checkout-link.js';
import {
    CheckoutWorkflow,
    CheckoutWorkflowStep,
    buildCheckoutUrl,
    computePromoStatus,
    omitProperties,
    toBoolean,
    toEnumeration,
} from './external.js';
import { Defaults } from './defaults.js';
import { Log } from './log.js';
import { toOfferSelectorIds, toQuantity, useService } from './utilities.js';

/**
 * @param {{
 *  literals: Commerce.Literals;
 *  providers: { checkout: Iterable<Commerce.Checkout.provideCheckoutOptions> };
 *  settings: Commerce.Checkout.Settings;
 * }} startup
 * @param {Commerce.DataProviders} dataProviders
 * @returns {Commerce.Checkout.Client}
 */
export function Checkout({ providers, settings }, dataProviders) {
    const log = Log.module('checkout');

    /** @type {Commerce.Checkout.collectCheckoutOptions} */
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
            modal: toBoolean(modal),
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

    /** @type {Commerce.Checkout.buildCheckoutAction} */
    async function buildCheckoutAction(offers, options) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const instance = useService();
        const checkoutAction = await dataProviders.getCheckoutAction?.(
            offers,
            options,
            instance.imsSignedInPromise,
        );
        if (checkoutAction) {
            return checkoutAction;
        }
        return null;
    }

    /** @type {Commerce.Checkout.buildCheckoutURL} */
    function buildCheckoutURL(offers, options) {
        if (!Array.isArray(offers) || !offers.length || !options) {
            return '';
        }
        const { env, landscape } = settings;
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
        const context = window.frameElement ? 'if' : 'fp';
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
        if (offers.length === 1) {
            const [{ offerId, offerType, productArrangementCode }] = offers;
            const {
                // TODO: fix type definition in @pandora, Wcs responds with marketSegments (array)
                // @ts-ignore
                marketSegments: [marketSegment],
            } = offers[0];
            Object.assign(data, {
                marketSegment,
                offerType,
                productArrangementCode,
            });
            data.items.push(
                quantity[0] === 1
                    ? { id: offerId }
                    : { id: offerId, quantity: quantity[0] },
            );
        } else {
            data.items.push(
                ...offers.map(({ offerId }, index) => ({
                    id: offerId,
                    quantity: quantity[index] ?? Defaults.quantity,
                })),
            );
        }
        return buildCheckoutUrl(workflow, data);
    }

    const { createCheckoutLink, getCheckoutLinks } = CheckoutLink;
    return {
        CheckoutLink,
        CheckoutWorkflow,
        CheckoutWorkflowStep,
        buildCheckoutAction,
        buildCheckoutURL,
        collectCheckoutOptions,
        createCheckoutLink,
        getCheckoutLinks,
    };
}
