import { expect } from '@esm-bundle/chai';
import {
  overrideVariant,
  getGeoRestriction,
  getManifestMarketingAction,
  canServeManifest,
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

describe('getGeoRestriction', () => {
  before(() => {
    sessionStorage.setItem('akamai', 'us');
    getConfig().mep = {};
  });
  it('should return true if the geo restriction is null', () => {
    expect(getGeoRestriction({ geoRestriction: null, manifestPath: '/test/test.json' })).to.be.true;
  });
  it('should return true if the geo restriction includes US', () => {
    expect(getGeoRestriction({ geoRestriction: 'fr, us', manifestPath: '/test/test.json' })).to.be.false;
  });
  it('should return false and override the variant if the geo restriction does not include US', () => {
    getGeoRestriction({ geoRestriction: 'fr, ca', manifestPath: '/test/test.json' });
    expect(getConfig().mep.variantOverride['/test/test.json']).to.be.equal('Default');
  });
});

describe('getManifestMarketingAction', () => {
  it('should return the same action if it is in the allowed list', () => {
    expect(getManifestMarketingAction('marketing increase', 'promo')).to.be.equal('marketing increase');
  });
  it('should return core services if the action is promo and the action is undefined', () => {
    expect(getManifestMarketingAction(undefined, 'promo')).to.be.equal('core services');
  });
  it('should return marketing increase if the action is not in the allowed list and the source is not promo', () => {
    expect(getManifestMarketingAction('marketing', 'pzn')).to.be.equal('marketing increase');
  });
  it('should return marketing increase if the action is undefined and the source is not promo', () => {
    expect(getManifestMarketingAction(undefined, 'pzn')).to.be.equal('marketing increase');
  });
});

describe('canServeManifest', () => {
  beforeEach(() => {
    sessionStorage.setItem('akamai', 'us');
    getConfig().mep.consentState = { performance: true, advertising: true };
    getConfig().mep.variantOverride = {};
  });
  it('should return false if the geo restriction is false', () => {
    expect(canServeManifest({ geoRestriction: 'fr, ca', manifestPath: '/test/test.json' })).to.be.false;
  });
  it('should return true if mktgAction is core services', () => {
    expect(canServeManifest({ mktgAction: 'core services', manifestPath: '/test/test.json' })).to.be.true;
  });
  it('should return true if mktgAction is non-marketing and performance is true', () => {
    expect(canServeManifest({ mktgAction: 'non-marketing', manifestPath: '/test/test.json' })).to.be.true;
  });
  it('should return true if mktgAction is non-marketing and performance is false', () => {
    getConfig().mep.consentState = { performance: false, advertising: true };
    expect(canServeManifest({ mktgAction: 'non-marketing', manifestPath: '/test/test.json' })).to.be.false;
  });
  it('should return true if mktgAction is marketing increase and advertising is true', () => {
    expect(canServeManifest({ mktgAction: 'marketing increase', manifestPath: '/test/test.json' })).to.be.true;
  });
  it('should return false if mktgAction is marketing increase and advertising is false', () => {
    getConfig().mep.consentState = { performance: true, advertising: false };
    expect(canServeManifest({ mktgAction: 'marketing increase', manifestPath: '/test/test.json' })).to.be.false;
  });
  it('should return true if mktgAction is unspecified and performance and advertising are true', () => {
    expect(canServeManifest({ mktgAction: 'marketing decrease', manifestPath: '/test/test.json' })).to.be.true;
  });
  it('should return true and override the variant if mktgAction is unspecified and performance is false', () => {
    getConfig().mep.consentState = { performance: false, advertising: true };
    expect(canServeManifest({ mktgAction: 'marketing decrease', manifestPath: '/test/test.json', variantNames: ['test'] })).to.be.true;
    expect(getConfig().mep.variantOverride['/test/test.json']).to.be.equal('test');
  });
});
