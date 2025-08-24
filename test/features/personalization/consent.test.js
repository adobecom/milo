import { expect } from '@esm-bundle/chai';
import { getConsentLevels, canServeManifest } from '../../../libs/features/personalization/personalization.js';

function setCookie(name, value) {
  document.cookie = `${name}=${value}; path=/`;
}

describe('getConsentLevels', () => {
  beforeEach(() => {
    setCookie('kndctr_9E1005A551ED61CA0A490D45_AdobeOrg_consent', '');
    setCookie('OptanonConsent', '');
    sessionStorage.setItem('akamai', 'us');
  });
  it('should return the default consent levels for non-explicit consent countries', () => {
    const consent = getConsentLevels();
    expect(consent).to.deep.equal({ nonMktg: true, mktg: false });
  });
  it('should return everything true if the country is an explicit consent country', () => {
    sessionStorage.setItem('akamai', 'ca');
    const consent = getConsentLevels();
    expect(consent).to.deep.equal({ nonMktg: false, mktg: false });
  });
  it('should return everything true if kndctr is in', () => {
    document.cookie = 'kndctr_9E1005A551ED61CA0A490D45_AdobeOrg_consent=general=in';
    const consent = getConsentLevels();
    expect(consent).to.deep.equal({ nonMktg: true, mktg: true });
  });
  it('should return everything false if kndctr is out', () => {
    document.cookie = 'kndctr_9E1005A551ED61CA0A490D45_AdobeOrg_consent=general=out';
    const consent = getConsentLevels();
    expect(consent).to.deep.equal({ nonMktg: false, mktg: false });
  });
  it('should return everything true if optanon is all on', () => {
    document.cookie = 'OptanonConsent=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1';
    const consent = getConsentLevels();
    expect(consent).to.deep.equal({ nonMktg: true, mktg: true });
  });
  it('should return everything false if optanon is all out', () => {
    document.cookie = 'OptanonConsent=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0';
    const consent = getConsentLevels();
    expect(consent).to.deep.equal({ nonMktg: false, mktg: false });
  });
  it('should return mixed if optanon is mixed', () => {
    document.cookie = 'OptanonConsent=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A1';
    const consent = getConsentLevels();
    expect(consent).to.deep.equal({ nonMktg: false, mktg: true });
  });
});

describe('canServeManifest', () => {
  it('should return true if the action is core services', () => {
    const result = canServeManifest('core services', null, { nonMktg: false, mktg: false });
    expect(result).to.be.true;
  });
  it('should return true if the source is promo', () => {
    const result = canServeManifest(null, ['promo'], { nonMktg: false, mktg: false });
    expect(result).to.be.true;
  });
  it('should return true if the action is non-marketing and nonMktg is true', () => {
    const result = canServeManifest('non-marketing', null, { nonMktg: true, mktg: false });
    expect(result).to.be.true;
  });
  it('should return false if the action is non-marketing and nonMktg is false', () => {
    const result = canServeManifest('non-marketing', null, { nonMktg: false, mktg: false });
    expect(result).to.be.false;
  });
  it('should return true if the action is null and mktg is true', () => {
    const result = canServeManifest(null, null, { nonMktg: false, mktg: true });
    expect(result).to.be.true;
  });
  it('should return false if the action is null and mktg is false', () => {
    const result = canServeManifest(null, null, { nonMktg: true, mktg: false });
    expect(result).to.be.false;
  });
  it('should return true if the action is marketing and mktg is true', () => {
    const result = canServeManifest('marketing', null, { nonMktg: false, mktg: true });
    expect(result).to.be.true;
  });
  it('should return false if the action is marketing and mktg is false', () => {
    const result = canServeManifest('marketing', null, { nonMktg: true, mktg: false });
    expect(result).to.be.false;
  });
});
