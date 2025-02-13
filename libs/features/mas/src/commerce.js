import { CheckoutLink } from './checkout-link.js';
import { CheckoutButton } from './checkout-button.js';
import { Landscape } from './constants.js';
import { Defaults } from './defaults.js';
import { TAG_NAME_SERVICE } from './mas-commerce-service.js';
import {
    CheckoutWorkflow,
    CheckoutWorkflowStep,
    WcsCommitment,
    WcsTerm,
    WcsPlanType,
    applyPlanType,
} from './external.js';
import { InlinePrice } from './inline-price.js';
import { Log } from './log.js';
import { getSettings } from './settings.js';

export {
    TAG_NAME_SERVICE,
    CheckoutLink,
    CheckoutButton,
    CheckoutWorkflow,
    CheckoutWorkflowStep,
    Defaults,
    InlinePrice,
    Log,
    WcsCommitment,
    Landscape,
    WcsTerm,
    WcsPlanType,
    applyPlanType,
    getSettings,
};

// At the bottom of commerce.js
(() => {
  const tagName = 'checkout-button';
  if (!window.customElements.get(tagName)) {
      window.customElements.define(tagName, CheckoutButton);
      console.log('Commerce.js evaluated at', Date.now()); // Remove in prod
  }
})();
