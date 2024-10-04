import { PARAM_ENV, PARAM_LANDSCAPE, Landscape, WCS_PROD_URL, WCS_STAGE_URL } from './constants.js';
import { Defaults } from './defaults.js';
import {
    CheckoutWorkflow,
    CheckoutWorkflowStep,
    Env,
    getParameter,
    toBoolean,
    toEnumeration,
    toPositiveFiniteInteger,
} from './external.js';
import { toQuantity } from './utilities.js';
import { getLocaleSettings } from './localeSettings.js';

const HostEnv = Object.freeze({
    LOCAL: 'local',
    PROD: 'prod',
    STAGE: 'stage',
});

function getSettings(config = {}) {
    // Always use `prod` env by default, regardless Milo env
    // but allow overriding it in metadata, location.search or storage
    // See https://github.com/adobecom/milo/pull/923
    // TODO: add alias names for meta, search and storage
    // See https://git.corp.adobe.com/wcms/tacocat.js/pull/348#discussion_r6557570
    const { commerce = {}, locale = undefined } = config;
    let env = Env.PRODUCTION;
    let wcsURL = WCS_PROD_URL;

    const lowHostEnv = ['local', 'stage'].includes(config.env?.name);
    const forceWcsStage = getParameter(PARAM_ENV, commerce, { metadata: false })?.toLowerCase() === 'stage';
    if (lowHostEnv && forceWcsStage) {
      env = Env.STAGE;
      wcsURL = WCS_STAGE_URL;
    }
    
    const checkoutClientId =
        getParameter('checkoutClientId', commerce) ?? Defaults.checkoutClientId;
    const checkoutWorkflow = toEnumeration(
        getParameter('checkoutWorkflow', commerce),
        CheckoutWorkflow,
        Defaults.checkoutWorkflow,
    );
    let checkoutWorkflowStep = CheckoutWorkflowStep.CHECKOUT;
    if (checkoutWorkflow === CheckoutWorkflow.V3) {
        checkoutWorkflowStep = toEnumeration(
            getParameter('checkoutWorkflowStep', commerce),
            CheckoutWorkflowStep,
            Defaults.checkoutWorkflowStep,
        );
    }
    const displayOldPrice = toBoolean(
        getParameter('displayOldPrice', commerce),
        Defaults.displayOldPrice,
    );
    const displayPerUnit = toBoolean(
        getParameter('displayPerUnit', commerce),
        Defaults.displayPerUnit,
    );
    const displayRecurrence = toBoolean(
        getParameter('displayRecurrence', commerce),
        Defaults.displayRecurrence,
    );
    const displayTax = toBoolean(
        getParameter('displayTax', commerce),
        Defaults.displayTax,
    );
    const entitlement = toBoolean(
        getParameter('entitlement', commerce),
        Defaults.entitlement,
    );
    const modal = toBoolean(getParameter('modal', commerce), Defaults.modal);
    const forceTaxExclusive = toBoolean(
        getParameter('forceTaxExclusive', commerce),
        Defaults.forceTaxExclusive,
    );
    const promotionCode =
        getParameter('promotionCode', commerce) ?? Defaults.promotionCode;
    const quantity = toQuantity(getParameter('quantity', commerce));
    const wcsApiKey = getParameter('wcsApiKey', commerce) ?? Defaults.wcsApiKey;
    const landscape =
        config.env?.name === HostEnv.PROD
            ? Landscape.PUBLISHED
            : toEnumeration(
                  getParameter(PARAM_LANDSCAPE, commerce),
                  Landscape,
                  Defaults.landscape,
              );
    let wcsBufferDelay = toPositiveFiniteInteger(
        getParameter('wcsBufferDelay', commerce),
        Defaults.wcsBufferDelay,
    );
    let wcsBufferLimit = toPositiveFiniteInteger(
        getParameter('wcsBufferLimit', commerce),
        Defaults.wcsBufferLimit,
    );

    return {
        ...getLocaleSettings(config),
        displayOldPrice,
        checkoutClientId,
        checkoutWorkflow,
        checkoutWorkflowStep,
        displayPerUnit,
        displayRecurrence,
        displayTax,
        entitlement,
        extraOptions: Defaults.extraOptions,
        modal,
        env,
        forceTaxExclusive,
        promotionCode,
        quantity,
        wcsApiKey,
        wcsBufferDelay,
        wcsBufferLimit,
        wcsURL,
        landscape,
    };
}

export { HostEnv as MiloEnv, getLocaleSettings, getSettings };
