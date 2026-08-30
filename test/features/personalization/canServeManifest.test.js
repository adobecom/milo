/* eslint-disable no-underscore-dangle */
import { expect } from '@esm-bundle/chai';
import {
  overrideVariant,
  setCountryEnabled,
  normalizeConsentType,
  setConsentEnabled,
} from '../../../libs/features/personalization/personalization.js';
import { getConfig } from '../../../libs/utils/utils.js';

describe('overrideVariant', () => {
  beforeEach(() => {
    getConfig().mep = {};
  });
  it('should override the variant', () => {
    overrideVariant('/test/test.json', 'test');
    expect(getConfig().mep.variantOverride['/test/test.json']).to.be.equal('test');
  });
  it('should not override the manifest variant if it already exists', () => {
    overrideVariant('/test/test.json', 'test');
    overrideVariant('/test/test.json', 'test2');
    expect(getConfig().mep.variantOverride['/test/test.json']).to.be.equal('test');
  });
});

describe('setCountryEnabled', () => {
  before(() => {
    sessionStorage.setItem('akamai', 'us');
    getConfig().mep = {};
  });
  it('should set countryEnabled to true if the country restriction is null', () => {
    const manifestConfig = { countryRestriction: null, manifestPath: '/test/test.json' };
    setCountryEnabled(manifestConfig);
    expect(manifestConfig.countryEnabled).to.be.true;
  });
  it('should set countryEnabled to false if the akamai code is not in the restriction list', () => {
    const manifestConfig = { countryRestriction: 'fr, us', manifestPath: '/test/test.json' };
    setCountryEnabled(manifestConfig);
    expect(manifestConfig.countryEnabled).to.be.false;
  });
  it('should set countryEnabled to true if the akamai code is in the restriction list', () => {
    getConfig().mep.akamaiCode = 'us';
    const manifestConfig = { countryRestriction: 'fr, us', manifestPath: '/test/test.json' };
    setCountryEnabled(manifestConfig);
    expect(manifestConfig.countryEnabled).to.be.true;
    delete getConfig().mep.akamaiCode;
  });
  it('should override the variant to Default if the country restriction is not met', () => {
    const manifestConfig = { countryRestriction: 'fr, ca', manifestPath: '/test/test.json' };
    setCountryEnabled(manifestConfig);
    expect(getConfig().mep.variantOverride['/test/test.json']).to.be.equal('Default');
  });
});

describe('normalizeConsentType', () => {
  it('should return the same value if it is already the new promo value', () => {
    expect(normalizeConsentType('promo or no offer changes', {}, 'promo')).to.be.equal('promo or no offer changes');
  });
  it('should return the same value if it is already the new non-personalized offer test value', () => {
    expect(normalizeConsentType('non-personalized offer test', {}, 'pzn')).to.be.equal('non-personalized offer test');
  });
  it('should map legacy core services to promo or no offer changes', () => {
    expect(normalizeConsentType('core services', {}, 'pzn')).to.be.equal('promo or no offer changes');
  });
  it('should map legacy core services/non-marketing to promo or no offer changes', () => {
    expect(normalizeConsentType('core services/non-marketing', {}, 'pzn')).to.be.equal('promo or no offer changes');
  });
  it('should map legacy non-marketing to promo or no offer changes', () => {
    expect(normalizeConsentType('non-marketing', {}, 'pzn')).to.be.equal('promo or no offer changes');
  });
  it('should map legacy marketing increase to non-personalized offer test', () => {
    expect(normalizeConsentType('marketing increase', {}, 'pzn')).to.be.equal('non-personalized offer test');
  });
  it('should map legacy marketing decrease to non-personalized offer test', () => {
    expect(normalizeConsentType('marketing decrease', {}, 'pzn')).to.be.equal('non-personalized offer test');
  });
  it('should return promo or no offer changes if the value is unrecognized and the source is promo', () => {
    expect(normalizeConsentType(undefined, {}, 'promo')).to.be.equal('promo or no offer changes');
  });
  it('should return personalized offer if the value is unrecognized and the source is not promo', () => {
    expect(normalizeConsentType('marketing', {}, 'pzn')).to.be.equal('personalized offer');
  });
  it('should return personalized offer if the value is undefined and the source is not promo', () => {
    expect(normalizeConsentType(undefined, {}, 'pzn')).to.be.equal('personalized offer');
  });
  it('should return the same value if it is already personalized offer', () => {
    expect(normalizeConsentType('personalized offer', {}, 'pzn')).to.be.equal('personalized offer');
  });
  it('should set consentNotSpecified to true on the manifestConfig when no value is provided', () => {
    const manifestConfig = {};
    normalizeConsentType(undefined, manifestConfig, 'pzn');
    expect(manifestConfig.consentNotSpecified).to.be.true;
  });
  it('should not set consentNotSpecified when a value is provided', () => {
    const manifestConfig = {};
    normalizeConsentType('personalized offer', manifestConfig, 'pzn');
    expect(manifestConfig.consentNotSpecified).to.be.undefined;
  });
});

describe('setConsentEnabled', () => {
  beforeEach(() => {
    sessionStorage.setItem('akamai', 'us');
    getConfig().mep.consentState = { performance: true, advertising: true };
    getConfig().mep.variantOverride = {};
    localStorage.removeItem('mep-/test/test.json');
  });
  afterEach(() => {
    localStorage.removeItem('mep-/test/test.json');
  });

  it('should set consentEnabled true and not override the variant for promo or no offer changes', () => {
    const manifestConfig = { consentType: 'promo or no offer changes', manifestPath: '/test/test.json' };
    setConsentEnabled(manifestConfig);
    expect(manifestConfig.consentEnabled).to.be.true;
    expect(getConfig().mep.variantOverride['/test/test.json']).to.be.undefined;
  });

  it('should set consentEnabled true for promo or no offer changes even when consent is missing', () => {
    getConfig().mep.consentState = { performance: false, advertising: false };
    const manifestConfig = { consentType: 'promo or no offer changes', manifestPath: '/test/test.json' };
    setConsentEnabled(manifestConfig);
    expect(manifestConfig.consentEnabled).to.be.true;
  });

  it('should keep consentEnabled true for non-personalized offer test when performance is true', () => {
    const manifestConfig = { consentType: 'non-personalized offer test', manifestPath: '/test/test.json' };
    setConsentEnabled(manifestConfig);
    expect(manifestConfig.consentEnabled).to.be.true;
    expect(getConfig().mep.variantOverride['/test/test.json']).to.be.undefined;
  });

  it('should set consentEnabled false and use the variant saved in local storage when performance is false', () => {
    getConfig().mep.consentState = { performance: false, advertising: true };
    localStorage.setItem('mep-/test/test.json', 'sticky');
    const manifestConfig = { consentType: 'non-personalized offer test', manifestPath: '/test/test.json', variantNames: ['test'] };
    setConsentEnabled(manifestConfig);
    expect(manifestConfig.consentEnabled).to.be.false;
    expect(getConfig().mep.variantOverride['/test/test.json']).to.be.equal('sticky');
  });

  it('should randomly choose and persist a variant when performance is false and nothing is saved', () => {
    getConfig().mep.consentState = { performance: false, advertising: true };
    const manifestConfig = { consentType: 'non-personalized offer test', manifestPath: '/test/test.json', variantNames: ['test'] };
    setConsentEnabled(manifestConfig);
    const chosen = getConfig().mep.variantOverride['/test/test.json'];
    expect(['test', 'Default']).to.include(chosen);
    expect(localStorage.getItem('mep-/test/test.json')).to.equal(chosen);
  });

  it('should set consentEnabled true for personalized offer when performance and advertising are true', () => {
    const manifestConfig = { consentType: 'personalized offer', manifestPath: '/test/test.json', variantNames: ['test'] };
    setConsentEnabled(manifestConfig);
    expect(manifestConfig.consentEnabled).to.be.true;
    expect(getConfig().mep.variantOverride['/test/test.json']).to.be.undefined;
  });

  it('should set consentEnabled false and override to Default for personalized offer when performance is false', () => {
    getConfig().mep.consentState = { performance: false, advertising: true };
    const manifestConfig = { consentType: 'personalized offer', manifestPath: '/test/test.json', variantNames: ['test'] };
    setConsentEnabled(manifestConfig);
    expect(manifestConfig.consentEnabled).to.be.false;
    expect(getConfig().mep.variantOverride['/test/test.json']).to.be.equal('Default');
  });

  it('should set consentEnabled false and override to Default for personalized offer when advertising is false', () => {
    getConfig().mep.consentState = { performance: true, advertising: false };
    const manifestConfig = { consentType: 'personalized offer', manifestPath: '/test/test.json', variantNames: ['test'] };
    setConsentEnabled(manifestConfig);
    expect(manifestConfig.consentEnabled).to.be.false;
    expect(getConfig().mep.variantOverride['/test/test.json']).to.be.equal('Default');
  });
});
