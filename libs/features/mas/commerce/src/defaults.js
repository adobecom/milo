import {
    CheckoutWorkflow,
    CheckoutWorkflowStep,
    Env,
    Landscape,
    WcsEnv,
} from './external.js';

/** @type {Commerce.Defaults} */
export const Defaults = Object.freeze({
    checkoutClientId: 'adobe_com',
    checkoutWorkflow: CheckoutWorkflow.V3,
    checkoutWorkflowStep: CheckoutWorkflowStep.EMAIL,
    country: 'US',
    displayOldPrice: true,
    displayPerUnit: false,
    displayRecurrence: true,
    displayTax: false,
    domainSwitch: false,
    env: Env.PRODUCTION,
    forceTaxExclusive: false,
    language: 'en',
    entitlement: false,
    extraOptions: {},
    modal: false,
    promotionCode: '',
    quantity: 1,
    wcsApiKey: 'wcms-commerce-ims-ro-user-milo',
    wcsBufferDelay: 1,
    wcsEnv: WcsEnv.PRODUCTION,
    landscape: Landscape.PUBLISHED,
    wcsBufferLimit: 1,
});
