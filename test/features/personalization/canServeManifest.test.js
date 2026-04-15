/* eslint-disable no-underscore-dangle */
import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
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
  it('should normalize core services to core services/non-marketing', () => {
    expect(getManifestMarketingAction('core services', 'pzn')).to.be.equal('core services/non-marketing');
  });
  it('should return core services/non-marketing if the action is promo and the action is undefined', () => {
    expect(getManifestMarketingAction(undefined, 'promo')).to.be.equal('core services/non-marketing');
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
  afterEach(() => {
    delete window._satellite;
  });
  it('should return false if the geo restriction is false', () => {
    expect(canServeManifest({ geoRestriction: 'fr, ca', manifestPath: '/test/test.json' })).to.be.false;
  });
  it('should return true if mktgAction is core services/non-marketing', () => {
    expect(canServeManifest({ mktgAction: 'core services/non-marketing', manifestPath: '/test/test.json' })).to.be.true;
  });
  it('should return true if mktgAction is core services (legacy name)', () => {
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

  // "was served" analytics: MEP gates _satellite.track on both performance (C0002)
  // and advertising (C0004) consent. Launch independently checks C0002 and suppresses
  // events when it's off, so the effect is not observable at the network payload level.
  // These tests verify the MEP-side gating so we don't rely on Launch's internal
  // consent logic as the only safeguard.
  it('should fire analytics for marketing increase when both consent flags are true', () => {
    const trackStub = stub();
    window._satellite = { track: trackStub };
    canServeManifest({ mktgAction: 'marketing increase', manifestPath: '/test/test.json' });
    expect(trackStub.calledOnce).to.be.true;
    const [, payload] = trackStub.firstCall.args;
    expect(payload.xdm.web.webInteraction.name).to.equal('test was served');
  });

  it('should fire analytics for marketing decrease when both consent flags are true', () => {
    const trackStub = stub();
    window._satellite = { track: trackStub };
    canServeManifest({ mktgAction: 'marketing decrease', manifestPath: '/test/test.json', variantNames: ['test'] });
    expect(trackStub.calledOnce).to.be.true;
    const [, payload] = trackStub.firstCall.args;
    expect(payload.xdm.web.webInteraction.name).to.equal('test was served');
  });

  it('should not fire analytics for marketing decrease when advertising consent is false', () => {
    getConfig().mep.consentState = { performance: true, advertising: false };
    const trackStub = stub();
    window._satellite = { track: trackStub };
    canServeManifest({ mktgAction: 'marketing decrease', manifestPath: '/test/test.json', variantNames: ['test'] });
    expect(trackStub.called).to.be.false;
  });

  it('should not fire analytics for marketing decrease when performance consent is false', () => {
    getConfig().mep.consentState = { performance: false, advertising: true };
    const trackStub = stub();
    window._satellite = { track: trackStub };
    canServeManifest({ mktgAction: 'marketing decrease', manifestPath: '/test/test.json', variantNames: ['test'] });
    expect(trackStub.called).to.be.false;
  });

  it('should not fire analytics for marketing increase when advertising consent is false', () => {
    getConfig().mep.consentState = { performance: true, advertising: false };
    const trackStub = stub();
    window._satellite = { track: trackStub };
    canServeManifest({ mktgAction: 'marketing increase', manifestPath: '/test/test.json' });
    expect(trackStub.called).to.be.false;
  });

  it('should not fire analytics for marketing increase when performance consent is false', () => {
    getConfig().mep.consentState = { performance: false, advertising: true };
    const trackStub = stub();
    window._satellite = { track: trackStub };
    canServeManifest({ mktgAction: 'marketing increase', manifestPath: '/test/test.json' });
    expect(trackStub.called).to.be.false;
  });

  it('should serve marketing decrease manifest with default variant but suppress analytics when consent is missing', () => {
    getConfig().mep.consentState = { performance: false, advertising: true };
    const trackStub = stub();
    window._satellite = { track: trackStub };
    const result = canServeManifest({ mktgAction: 'marketing decrease', manifestPath: '/test/test.json', variantNames: ['default'] });
    expect(result).to.be.true;
    expect(getConfig().mep.variantOverride['/test/test.json']).to.equal('default');
    expect(trackStub.called).to.be.false;
  });
});
