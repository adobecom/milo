import { buildCheckoutUrl } from './deps.js';
import Log from "./log.js";

/**
 * @param {Commerce.Checkout.Settings} settings
 * @returns {Commerce.Checkout.Client}
 */
export default function Checkout(settings) {
  const log = Log.commerce.module('checkout');

  function buildUrl(options) {
    const {
      checkoutClientId,
      checkoutWorkflow,
      checkoutWorkflowStep,
      country: checkoutCountry,
      env,
      language: checkoutLanguage,
    } = settings;

    const {
      clientId = checkoutClientId,
      country = checkoutCountry,
      language = checkoutLanguage,
      workflow = checkoutWorkflow,
      workflowStep = checkoutWorkflowStep,
      ...rest
    } = options;

    const url = buildCheckoutUrl(
      workflow, {
      clientId,
      context: window.frameElement ? 'if' : 'fp',
      country,
      env,
      language,
      workflowStep,
      ...rest,
    });

    log.debug('Url:', { options, url });
    return url;
  };

  return { buildUrl };
}
