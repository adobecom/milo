// This file aliases and re-exports commonly used external dependencies
import { Term, Commitment } from '@pandora/data-models-odm';

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
} from './price/index.js';

import { discount } from './discount/index.js';

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
    toPositiveFiniteInteger,
    applyPlanType,
    forceTaxExclusivePrice,
    PlanType,
} from '@dexter/tacocat-core';

const { freeze } = Object;

/** @type {Commerce.Checkout.CheckoutWorkflow} */
const CheckoutType = { V2: 'UCv2', V3: 'UCv3' };
const CheckoutWorkflow = freeze({ ...CheckoutType });
/** @type {Commerce.Checkout.CheckoutWorkflowStep} */
const WorkflowStep ={
  CHECKOUT: 'checkout',
  CHECKOUT_EMAIL: 'checkout/email',
  SEGMENTATION: 'segmentation',
  BUNDLE: 'bundle',
  COMMITMENT: 'commitment',
  RECOMMENDATION: 'recommendation',
  EMAIL: 'email',
  PAYMENT: 'payment',
  CHANGE_PLAN_TEAM_PLANS: 'change-plan/team-upgrade/plans',
  CHANGE_PLAN_TEAM_PAYMENT: 'change-plan/team-upgrade/payment'
};
const CheckoutWorkflowStep = freeze({ ...WorkflowStep });
const Env = {
    STAGE: 'STAGE',
    PRODUCTION: 'PRODUCTION',
    LOCAL: 'LOCAL',
};
/** @type {Commerce.Wcs.WcsCommitment} */
const WcsCommitment = freeze({ ...Commitment });
/** @type {Commerce.Wcs.WcsPlanType} */
const WcsPlanType = freeze({ ...PlanType });
/** @type {Commerce.Wcs.WcsTerm} */
const WcsTerm = freeze({ ...Term });

export {
    CheckoutWorkflow,
    CheckoutWorkflowStep,
    Env,
    WcsCommitment,
    WcsTerm,
    WcsPlanType,
    applyPlanType,
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
    priceAlternative,
    priceOpticalAlternative,
    priceWithAnnual,
    pricePromoWithAnnual,
    discount,
    toBoolean,
    toEnumeration,
    toPositiveFiniteInteger,
};
