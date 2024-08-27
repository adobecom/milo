// This file aliases and re-exports commonly used external dependencies
import {
    CheckoutType,
    WorkflowStep,
    buildCheckoutUrl,
} from '@pandora/commerce-checkout-url-builder';
import { Term, Commitment } from '@pandora/data-models-odm';
import {
    Environment,
    Landscape,
    ProviderEnvironment,
} from '@pandora/data-source-utils';
import { webCommerceArtifact } from '@pandora/data-source-wcs';

import {
    price,
    pricePromo,
    priceOptical,
    priceStrikethrough,
    priceAnnual,
    discount,
} from '@dexter/tacocat-consonant-templates';
import {
    computePromoStatus,
    delay,
    equalsCaseInsensitive,
    getParameter,
    ignore,
    isBoolean,
    isFunction,
    isNotEmptyString,
    isPositiveFiniteNumber,
    omitProperties,
    toBoolean,
    toEnumeration,
    toKebabCase,
    toPositiveFiniteInteger,
} from '@dexter/tacocat-core';
import {
    applyPlanType,
    forceTaxExclusivePrice,
    PlanType,
} from '@dexter/tacocat-wcs-client';

const { freeze } = Object;

/** @type {Commerce.Checkout.CheckoutWorkflow} */
const CheckoutWorkflow = freeze({ ...CheckoutType });
/** @type {Commerce.Checkout.CheckoutWorkflowStep} */
const CheckoutWorkflowStep = freeze({ ...WorkflowStep });
const Env = freeze({ ...ProviderEnvironment });
/** @type {Commerce.Wcs.WcsCommitment} */
const WcsCommitment = freeze({ ...Commitment });
const WcsEnv = freeze({ ...Environment });
/** @type {Commerce.Wcs.WcsPlanType} */
const WcsPlanType = freeze({ ...PlanType });
/** @type {Commerce.Wcs.WcsTerm} */
const WcsTerm = freeze({ ...Term });

export {
    CheckoutWorkflow,
    CheckoutWorkflowStep,
    Env,
    WcsCommitment,
    WcsEnv,
    Landscape,
    WcsTerm,
    WcsPlanType,
    applyPlanType,
    buildCheckoutUrl,
    computePromoStatus,
    delay,
    equalsCaseInsensitive,
    forceTaxExclusivePrice,
    getParameter,
    ignore,
    isBoolean,
    isFunction,
    isNotEmptyString,
    isPositiveFiniteNumber,
    omitProperties,
    price,
    pricePromo,
    priceOptical,
    priceStrikethrough,
    priceAnnual,
    discount,
    toBoolean,
    toEnumeration,
    toKebabCase,
    toPositiveFiniteInteger,
    webCommerceArtifact,
};
