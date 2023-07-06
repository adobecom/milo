import { expect } from '@esm-bundle/chai';

import { MiloEnv, defaults, getSettings } from '../settings.js';
import { CheckoutWorkflow, CheckoutWorkflowStep, Env, WcsEnv, WcsLandscape } from '../externals.js';

describe('getSettings', () => {
  it('returns default settings, if called without arguments', () => {
    expect(getSettings()).to.deep.equal({
      ...defaults,
      locale: `${defaults.language}_${defaults.country}`,
    });
  });

  it('uses Milo config', () => {
    const commerce = {
      checkoutClientId: 'checkout-client-id',
      checkoutWorkflow: CheckoutWorkflow.V2,
      checkoutWorkflowStep: CheckoutWorkflowStep.CHECKOUT,
      wcsApiKey: 'wcs-api-key',
      wcsDebounceDelay: 1,
      wcsEnv: WcsEnv.STAGE,
      wcsForceTaxExclusive: true,
      wcsLandscape: WcsLandscape.DRAFT,
      wcsOfferSelectorLimit: 1,
    }
    expect(getSettings({
      commerce,
      env: { name: MiloEnv.LOCAL },
      locale: { prefix: 'africa' }
    })).to.deep.equal({
      ...commerce,
      country: 'ZA',
      env: Env.STAGE,
      language: 'en',
      locale: `en_ZA`,
    });
  });
});
