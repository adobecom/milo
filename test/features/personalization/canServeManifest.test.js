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
  function setupEnvironment({
    signedOut = true,
    hasOptanonCookie = false,
    advertising = true,
    performance = true,
  }) {
    sessionStorage.setItem('akamai', 'us');
    getConfig().mep = { variantOverride: {} };
    if (!window.performance.getEntriesByType) {
      window.performance.getEntriesByType = () => [];
    }
    const originalGetEntriesByType = window.performance.getEntriesByType.bind(window.performance);
    window.performance.getEntriesByType = (type) => {
      if (type === 'navigation') {
        return [{
          serverTiming: [
            { name: 'sis', description: signedOut ? '0' : '1' },
          ],
        }];
      }
      return originalGetEntriesByType(type);
    };

    // Set up cookies for consent
    if (hasOptanonCookie) {
      const p = performance ? 1 : 0;
      const a = advertising ? 1 : 0;
      const groups = `C0001:${p},C0002:${p},C0003:${p},C0004:${a}`;
      document.cookie = `OptanonConsent=groups=${encodeURIComponent(groups)}`;
    } else {
      // Clear the cookie
      document.cookie = 'OptanonConsent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  }

  afterEach(() => {
    // Clean up
    document.cookie = 'OptanonConsent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  });

  it('should return false if the geo restriction is false', () => {
    setupEnvironment({ signedOut: true, hasOptanonCookie: false });
    expect(canServeManifest({ geoRestriction: 'fr, ca', manifestPath: '/test/test.json' })).to.be.false;
  });

  it('should return true if mktgAction is core services', () => {
    setupEnvironment({ signedOut: true, hasOptanonCookie: false });
    expect(canServeManifest({ mktgAction: 'core services', manifestPath: '/test/test.json' })).to.be.true;
  });

  it('should return true if mktgAction is non-marketing and performance is true', () => {
    const config = {
      signedOut: true,
      hasOptanonCookie: true,
      performance: true,
      advertising: true,
    };
    setupEnvironment(config);
    const manifestPath = '/test/test.json';
    expect(canServeManifest({ mktgAction: 'non-marketing', manifestPath })).to.be.true;
  });

  it('should return false if mktgAction is non-marketing and performance is false', () => {
    const config = {
      signedOut: true,
      hasOptanonCookie: true,
      performance: false,
      advertising: true,
    };
    setupEnvironment(config);
    const manifestPath = '/test/test.json';
    expect(canServeManifest({ mktgAction: 'non-marketing', manifestPath })).to.be.false;
  });

  it('should return true if mktgAction is marketing increase and advertising is true', () => {
    const config = {
      signedOut: true,
      hasOptanonCookie: true,
      performance: true,
      advertising: true,
    };
    setupEnvironment(config);
    const manifestPath = '/test/test.json';
    expect(canServeManifest({ mktgAction: 'marketing increase', manifestPath })).to.be.true;
  });

  it('should return false if mktgAction is marketing increase and advertising is false (logged in)', () => {
    const config = {
      signedOut: false,
      hasOptanonCookie: true,
      performance: true,
      advertising: false,
    };
    setupEnvironment(config);
    const manifestPath = '/test/test.json';
    expect(canServeManifest({ mktgAction: 'marketing increase', manifestPath })).to.be.false;
  });

  it('should return true if marketing increase and advertising is false but logged out', () => {
    const config = {
      signedOut: true,
      hasOptanonCookie: true,
      performance: true,
      advertising: false,
    };
    setupEnvironment(config);
    const manifestPath = '/test/test.json';
    expect(canServeManifest({ mktgAction: 'marketing increase', manifestPath })).to.be.true;
  });

  it('should return true if mktgAction is unspecified and performance and advertising are true', () => {
    const config = {
      signedOut: true,
      hasOptanonCookie: true,
      performance: true,
      advertising: true,
    };
    setupEnvironment(config);
    const manifestPath = '/test/test.json';
    expect(canServeManifest({ mktgAction: 'marketing decrease', manifestPath })).to.be.true;
  });

  it('should return true and override the variant if mktgAction is unspecified and performance is false', () => {
    const config = {
      signedOut: true,
      hasOptanonCookie: true,
      performance: false,
      advertising: true,
    };
    setupEnvironment(config);
    const manifestPath = '/test/test.json';
    const variantNames = ['test'];
    expect(canServeManifest({ mktgAction: 'marketing decrease', manifestPath, variantNames })).to.be.true;
    expect(getConfig().mep.variantOverride['/test/test.json']).to.be.equal('test');
  });
});
