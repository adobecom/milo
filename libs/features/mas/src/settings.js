import {
    PARAM_ENV,
    PARAM_LANDSCAPE,
    PARAM_MAS_PREVIEW,
    Landscape,
    WCS_PROD_URL,
    WCS_STAGE_URL,
} from './constants.js';
import { Defaults } from './defaults.js';
import { Env, CheckoutWorkflow, CheckoutWorkflowStep } from './constants.js';

import {
    getParameter,
    toBoolean,
    toEnumeration,
} from '@dexter/tacocat-core';

import { toQuantity } from './utilities.js';

const PREVIEW_REGISTERED_SURFACE = { 'wcms-commerce-ims-ro.+': 'acom', 'CreativeCloud_.+': 'ccd', "CCHome.+": 'adobe-home' };

function getLocaleSettings({
    locale = undefined,
    country = undefined,
    language = undefined,
} = {}) {
    language ??= locale?.split('_')?.[0] || Defaults.language;
    country ??= locale?.split('_')?.[1] || Defaults.country;
    locale ??= `${language}_${country}`;
    return { locale, country, language };
}

function getPreviewSurface(wcsApiKey, previewParam) {
  for (const [key, value] of Object.entries(PREVIEW_REGISTERED_SURFACE)) {
    const pattern = new RegExp(key);
    if (pattern.test(wcsApiKey)) {
      return value;
    }
  }
  return previewParam ?? wcsApiKey;
}

function getSettings(config = {}) {
    // Always use `prod` env by default, regardless Milo env
    // but allow overriding it in metadata, location.search or storage
    // See https://github.com/adobecom/milo/pull/923
    // TODO: add alias names for meta, search and storage
    // See https://git.corp.adobe.com/wcms/tacocat.js/pull/348#discussion_r6557570
    const { commerce = {} } = config;
    let env = Env.PRODUCTION;
    let wcsURL = WCS_PROD_URL;

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
    const displayPlanType = toBoolean(
        getParameter('displayPlanType', commerce),
        Defaults.displayPlanType,
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

    let isStage = commerce?.env === 'stage';
    let landscape = Landscape.PUBLISHED;
    const allowOverride = ['true', ''].includes(commerce.allowOverride);
    if (allowOverride) {
        isStage =
            (getParameter(PARAM_ENV, commerce, {
                metadata: false,
            })?.toLowerCase() ?? commerce?.env) === 'stage';
        landscape = toEnumeration(
            getParameter(PARAM_LANDSCAPE, commerce),
            Landscape,
            landscape,
        );
    }

    if (isStage) {
        env = Env.STAGE;
        wcsURL = WCS_STAGE_URL;
    }

    const previewParam = getParameter(PARAM_MAS_PREVIEW) ?? config.preview;
    const preview = (typeof previewParam != 'undefined') && previewParam !== 'off' && previewParam !== 'false';
    let previewSettings = {};
    if (preview) previewSettings = { preview };
    const masIOUrl =
        getParameter('mas-io-url') ??
        config.masIOUrl ??
        `https://www${env === Env.STAGE ? '.stage' : ''}.adobe.com/mas/io`;
    return {
        ...getLocaleSettings(config),
        ...previewSettings,
        displayOldPrice,
        checkoutClientId,
        checkoutWorkflow,
        checkoutWorkflowStep,
        displayPerUnit,
        displayRecurrence,
        displayTax,
        displayPlanType,
        entitlement,
        extraOptions: Defaults.extraOptions,
        modal,
        env,
        forceTaxExclusive,
        promotionCode,
        quantity,
        alternativePrice: Defaults.alternativePrice,
        wcsApiKey,
        wcsURL,
        landscape,
        masIOUrl,
    };
}

export { getLocaleSettings, getSettings, getPreviewSurface };
