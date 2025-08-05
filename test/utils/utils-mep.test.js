import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { getMepEnablement, getMartechConsent, determineCountry } from '../../libs/utils/utils.js';
import { combineMepSources } from '../../libs/features/personalization/personalization.js';

function setCookie(key, value) {
  document.cookie = `${key}=${value};path=/;`;
}
function clearSlate() {
  // Clear all cookies
  document.cookie.split(';').forEach((cookie) => {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
  });
  sessionStorage.clear();
  window.adobePrivacy = undefined;
  // eslint-disable-next-line no-underscore-dangle
  window._satellite = undefined;
}

describe('MEP Utils', () => {
  describe('getMartechConsent', async () => {
    it('returns false when consent is off', async () => {
      clearSlate();
      setCookie('OptanonAlertBoxClosed', 'true');
      setCookie('OptanonConsent', 'C0002=0;');
      const martechConsent = await getMartechConsent();
      expect(martechConsent).to.deep.equal({ martechConsent: false });
    });
    it('returns false when country is GB and consent not chosen', async () => {
      clearSlate();
      sessionStorage.setItem('akamai', 'gb');
      const martechConsent = await getMartechConsent();
      expect(martechConsent).to.deep.equal({ country: 'gb', martechConsent: false });
    });
    it('returns true when kndctr shows consent chosen', async () => {
      clearSlate();
      setCookie('kndctr_9E1005A551ED61CA0A490D45_AdobeOrg_consent', 'general=in;');
      const martechConsent = await getMartechConsent();
      expect(martechConsent).to.deep.equal({ martechConsent: true });
    });
    it('returns true when adobe privacy shows consent chosen', async () => {
      clearSlate();
      const adobePrivacy = {
        hasUserProvidedConsent: () => true,
        hasUserProvidedCustomConsent: () => true,
        activeCookieGroups: () => ['C0002'],
      };
      window.adobePrivacy = adobePrivacy;
      const martechConsent = await getMartechConsent();
      expect(martechConsent).to.deep.equal({ martechConsent: true });
    });
    it('returns true when optanon shows consent chosen', async () => {
      clearSlate();
      setCookie('OptanonAlertBoxClosed', 'true');
      setCookie('OptanonConsent', 'C0002:1');
      const martechConsent = await getMartechConsent();
      expect(martechConsent).to.deep.equal({ martechConsent: true });
    });
    it('returns true when country is US and consent not chosen', async () => {
      clearSlate();
      sessionStorage.setItem('akamai', 'us');
      const martechConsent = await getMartechConsent();
      expect(martechConsent).to.deep.equal({ country: 'us', martechConsent: true });
    });
  });
  describe('determineCountry', async () => {
    it('returns the country from the search params', async () => {
      clearSlate();
      const country = await determineCountry({ akamaiLocale: 'fr' });
      expect(country).to.equal('fr');
    });
    it('returns the country from the server timing', async () => {
      clearSlate();
      // eslint-disable-next-line no-underscore-dangle
      window._satellite = { getVar: () => ({ geo: 'de' }) };
      const country = await determineCountry();
      expect(country).to.equal('de');
    });
    it('returns the country from the feds location', async () => {
      clearSlate();
      sessionStorage.setItem('feds_location', JSON.stringify({ country: 'de' }));
      const country = await determineCountry();
      expect(country).to.equal('de');
    });
    it('returns the country from the session storage', async () => {
      clearSlate();
      sessionStorage.setItem('akamai', 'au');
      const country = await determineCountry();
      expect(country).to.equal('au');
    });
    // getAkamaiCode tested in georoutingv2.test.js
  });
  describe('combineMepSources', async () => {
    it('yields an empty list when everything is undefined', async () => {
      const manifests = await combineMepSources(undefined, undefined, undefined, undefined);
      expect(manifests.length).to.equal(0);
    });
    it('combines promos and personalization', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/mep/head-promo.html' });
      const manifests = await combineMepSources('/pers/manifest.json', undefined, { manifestnames: 'pre-black-friday-global,black-friday-global' }, undefined);
      expect(manifests.length).to.equal(3);
      expect(manifests[0].manifestPath).to.equal('/pers/manifest.json');
      expect(manifests[1].manifestPath).to.equal('/pre-black-friday.json');
      expect(manifests[2].manifestPath).to.equal('/black-friday.json');
    });
    it('combines promos and personalization and mep param', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/mep/head-promo.html' });
      const manifests = await combineMepSources(
        '/pers/manifest.json',
        undefined,
        { manifestnames: 'pre-black-friday-global,black-friday-global' },
        '/pers/manifest.json--var1---/mep-param/manifest1.json--all---/mep-param/manifest2.json--all',
      );
      expect(manifests.length).to.equal(5);
      expect(manifests[0].manifestPath).to.equal('/pers/manifest.json');
      expect(manifests[1].manifestPath).to.equal('/pre-black-friday.json');
      expect(manifests[2].manifestPath).to.equal('/black-friday.json');
      expect(manifests[3].manifestPath).to.equal('/mep-param/manifest1.json');
      expect(manifests[4].manifestPath).to.equal('/mep-param/manifest2.json');
    });
    it('combines promos and personalization, personalization-roc and mep param', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/mep/head-promo.html' });
      const manifests = await combineMepSources(
        '/pers/manifest.json',
        '/persroc/manifest.json',
        { manifestnames: 'pre-black-friday-global,black-friday-global' },
        '/pers/manifest.json--var1---/mep-param/manifest1.json--all---/mep-param/manifest2.json--all',
      );
      expect(manifests.length).to.equal(6);
      expect(manifests[0].manifestPath).to.equal('/pers/manifest.json');
      expect(manifests[1].manifestPath).to.equal('/persroc/manifest.json');
      expect(manifests[2].manifestPath).to.equal('/pre-black-friday.json');
      expect(manifests[3].manifestPath).to.equal('/black-friday.json');
      expect(manifests[4].manifestPath).to.equal('/mep-param/manifest1.json');
      expect(manifests[5].manifestPath).to.equal('/mep-param/manifest2.json');
    });
  });
  describe('getMepEnablement', async () => {
    it('checks target metadata set to on', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/mep/head-target-on.html' });
      const targetEnabled = getMepEnablement('target');
      expect(targetEnabled).to.equal(true);
    });
    it('checks target metadata set to off', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/mep/head-target-off.html' });
      const targetEnabled = getMepEnablement('target');
      expect(targetEnabled).to.equal(false);
    });
    it('checks target metadata set to postlcp', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/mep/head-target-postlcp.html' });
      const targetEnabled = getMepEnablement('target');
      expect(targetEnabled).to.equal('postlcp');
    });
    it('checks ajo metadata set to on', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/mep/head-ajo-on.html' });
      const ajoEnabled = getMepEnablement('ajo');
      expect(ajoEnabled).to.equal(true);
    });
    it('checks ajo metadata set to off', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/mep/head-ajo-off.html' });
      const ajoEnabled = getMepEnablement('ajo');
      expect(ajoEnabled).to.equal(false);
    });
    it('checks ajo metadata set to postlcp', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/mep/head-ajo-postlcp.html' });
      const ajoEnabled = getMepEnablement('ajo');
      expect(ajoEnabled).to.equal('postlcp');
    });
    it('checks mepgeolocation metadata set to off', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/mep/head-mepgeolocation-off.html' });
      const mepGelocationEnabled = getMepEnablement('mepgeolocation');
      expect(mepGelocationEnabled).to.equal(false);
    });
    it('checks mepgeolocation metadata set to off', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/mep/head-mepgeolocation-on.html' });
      const mepGelocationEnabled = getMepEnablement('mepgeolocation');
      expect(mepGelocationEnabled).to.equal(true);
    });
    it('checks from just metadata with no target metadata', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/mep/head-promo.html' });
      const persEnabled = getMepEnablement('personalization');
      const promoEnabled = getMepEnablement('manifestnames', 'promo');
      const targetEnabled = getMepEnablement('target');
      expect(promoEnabled).to.deep.equal({
        apac_manifestnames: 'kr-special-promo',
        americas_manifestnames: 'us-special-promo',
        manifestnames: 'pre-black-friday-global,black-friday-global',
      });
      expect(persEnabled).to.equal('https://main--milo--adobecom.hlx.page/products/special-offers-manifest.json');
      expect(targetEnabled).to.equal(false);
    });
    it('checks xlg metadata', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/mep/head-xlg.html' });
      const xlgEnabled = getMepEnablement('xlg');
      expect(xlgEnabled).to.equal('loggedout');
    });
  });
});
