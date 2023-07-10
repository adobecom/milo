import defaults from '../src/defaults.js';
import { CheckoutWorkflow, CheckoutWorkflowStep, Env, WcsEnv, WcsLandscape } from '../src/deps.js';
import { getSettings } from '../src/settings.js';

import { expect } from './utils.js';

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
      wcsBufferDelay: 1,
      wcsBufferLimit: 1,
      wcsEnv: WcsEnv.PRODUCTION,
      wcsForceTaxExclusive: true,
      wcsLandscape: WcsLandscape.DRAFT,
    };
    expect(getSettings({
      commerce,
      locale: { prefix: 'africa' },
    })).to.deep.equal({
      ...commerce,
      country: 'ZA',
      env: Env.PRODUCTION,
      language: 'en',
      locale: 'en_ZA',
    });
  });
});
