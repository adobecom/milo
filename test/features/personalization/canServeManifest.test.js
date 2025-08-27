import { expect } from '@esm-bundle/chai';
import { canServeManifest } from '../../../libs/features/personalization/personalization.js';

function setCookie(key, value) {
  document.cookie = `${key}=${value}; path=/`;
}

describe('canServeManifest', () => {
  beforeEach(() => {
    sessionStorage.setItem('akamai', 'us');
    setCookie('kndctr_9E1005A551ED61CA0A490D45_AdobeOrg_consent', 'general=in');
  });
  it('should return true if the action is core services', () => {
    setCookie('OptanonConsent', '');
    const result = canServeManifest('core services', null);
    expect(result).to.be.true;
  });
  it('should return true if the source is promo', () => {
    setCookie('OptanonConsent', 'groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0');
    const result = canServeManifest(null, ['promo']);
    expect(result).to.be.true;
  });
  it('should return true if the action is null and advertising is true', () => {
    setCookie('OptanonConsent', 'groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A1');
    const result = canServeManifest(null, null);
    expect(result).to.be.true;
  });
  it('should return false if the action is null, advertising is unspecified, country is explicit', () => {
    sessionStorage.setItem('akamai', 'ca');
    setCookie('kndctr_9E1005A551ED61CA0A490D45_AdobeOrg_consent', '');
    setCookie('OptanonConsent', '');
    const result = canServeManifest(null, null);
    expect(result).to.be.false;
  });
  it('should return true if the action is marketing and advertising is true', () => {
    setCookie('OptanonConsent', 'groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A1');
    const result = canServeManifest('marketing', null);
    expect(result).to.be.true;
  });
  it('should return false if the action is marketing and advertising is false', () => {
    sessionStorage.setItem('akamai', 'ca');
    setCookie('OptanonConsent', 'groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A0');
    const result = canServeManifest('marketing', null);
    expect(result).to.be.false;
  });
  it('should return true if the action is non-marketing and performance is true', () => {
    setCookie('OptanonConsent', 'groups=C0001%3A1%2CC0002%3A1%2CC0003%3A0%2CC0004%3A0');
    const result = canServeManifest('non-marketing', null);
    expect(result).to.be.true;
  });
  it('should return false if the action is non-marketing and performance is explicitly false', () => {
    setCookie('OptanonConsent', 'groups=C0001%3A1%2CC0002%3A0%2CC0003%3A1%2CC0004%3A1');
    const result = canServeManifest('non-marketing', null);
    expect(result).to.be.false;
  });
  it('should return true if the action is non-marketing, performance is unspecified and country is explicit', () => {
    sessionStorage.setItem('akamai', 'ca');
    setCookie('OptanonConsent', '');
    setCookie('kndctr_9E1005A551ED61CA0A490D45_AdobeOrg_consent', '');
    const result = canServeManifest('non-marketing', null);
    expect(result).to.be.true;
  });
});
