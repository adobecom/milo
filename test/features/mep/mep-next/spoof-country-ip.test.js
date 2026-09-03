import { expect } from '@esm-bundle/chai';
import { applyGeoSpoof, COUNTRY_BROWSER_IP } from '../../../../libs/features/mep/mep-next/spoof-country-ip.js';

const IP_PARAM = 'mboxOverride.browserIp';

describe('applyGeoSpoof', () => {
  it('sets akamaiLocale and the matching browser IP for a mapped country', () => {
    const params = new URLSearchParams();
    applyGeoSpoof(params, 'de');
    expect(params.get('akamaiLocale')).to.equal('de');
    expect(params.get(IP_PARAM)).to.equal(COUNTRY_BROWSER_IP.DE);
  });

  it('looks up the IP case-insensitively while keeping akamaiLocale as given', () => {
    const params = new URLSearchParams();
    applyGeoSpoof(params, 'DE');
    expect(params.get('akamaiLocale')).to.equal('DE');
    expect(params.get(IP_PARAM)).to.equal(COUNTRY_BROWSER_IP.DE);
  });

  it('sets akamaiLocale but no browser IP for an unmapped country', () => {
    const params = new URLSearchParams();
    applyGeoSpoof(params, 'zz');
    expect(params.get('akamaiLocale')).to.equal('zz');
    expect(params.has(IP_PARAM)).to.be.false;
  });

  it('clears a stale browser IP when switching to an unmapped country', () => {
    const params = new URLSearchParams('akamaiLocale=de&mboxOverride.browserIp=2.247.255.255');
    applyGeoSpoof(params, 'zz');
    expect(params.get('akamaiLocale')).to.equal('zz');
    expect(params.has(IP_PARAM)).to.be.false;
  });

  it('deletes both params when the country code is empty', () => {
    const params = new URLSearchParams('akamaiLocale=de&mboxOverride.browserIp=2.247.255.255');
    applyGeoSpoof(params, '');
    expect(params.has('akamaiLocale')).to.be.false;
    expect(params.has(IP_PARAM)).to.be.false;
  });

  it('includes NG and PR to cover the live supported-market gap', () => {
    expect(COUNTRY_BROWSER_IP.NG).to.be.a('string');
    expect(COUNTRY_BROWSER_IP.PR).to.be.a('string');
  });
});
