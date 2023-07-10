import { buildCheckoutUrl } from './deps.js';
import Log from './log.js';

/**
 * @param {Commerce.Checkout.Settings} settings
 * @returns {Commerce.Checkout.Client}
 */
function Checkout(settings) {
  const log = Log.commerce.module('checkout');

  /** @type {Commerce.Checkout.buildUrl} */
  function buildUrl(options) {
    // collect checkout settings
    const {
      checkoutClientId,
      checkoutWorkflow,
      checkoutWorkflowStep,
      country: checkoutCountry,
      env,
      language: checkoutLanguage,
    } = settings;

    // collect provided options
    const {
      clientId = checkoutClientId,
      country = checkoutCountry,
      language = checkoutLanguage,
      workflow = checkoutWorkflow,
      workflowStep = checkoutWorkflowStep,
      ...rest
    } = options;

    // call pandora
    const url = buildCheckoutUrl(workflow, {
      clientId,
      context: window.frameElement ? 'if' : 'fp',
      country,
      env,
      language,
      workflowStep,
      ...rest,
    });

    log.debug(`Url: ${url}`, { options });
    return url;
  }

  return { buildUrl };
}

export default Checkout;
export { Checkout };
