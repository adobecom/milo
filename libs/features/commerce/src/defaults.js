import {
  CheckoutWorkflow,
  CheckoutWorkflowStep,
  Env,
  WcsEnv,
  WcsLandscape
} from './deps.js';

/** @type {Commerce.Defaults} */
const defaults = {
  checkoutClientId: 'adobe_com',
  checkoutWorkflow: CheckoutWorkflow.V3,
  checkoutWorkflowStep: CheckoutWorkflowStep.EMAIL,
  country: 'US',
  env: Env.PRODUCTION,
  language: 'en',
  wcsApiKey: 'wcms-commerce-ims-ro-user-milo',
  wcsDebounceDelay: 50,
  wcsEnv: WcsEnv.PRODUCTION,
  wcsForceTaxExclusive: false,
  wcsLandscape: WcsLandscape.PUBLISHED,
  wcsOfferSelectorLimit: 20,
};

export default defaults;
