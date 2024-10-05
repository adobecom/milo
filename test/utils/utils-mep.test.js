import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { stub, restore } from 'sinon';
import { getMepEnablement } from '../../libs/utils/utils.js';
import { combineMepSources } from '../../libs/features/personalization/personalization.js';

describe('MEP Utils', () => {
  describe('combineMepSources', async () => {
    before(() => {
      stub(URLSearchParams.prototype, 'get').returns([{ instant: '2023-02-11' }]);
    });
    after(() => {
      restore();
    });
    it('yields an empty list when everything is undefined', async () => {
      const manifests = await combineMepSources(undefined, undefined, undefined);
      expect(manifests.length).to.equal(0);
    });
    it('combines promos and personalization', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/mep/head-promo.html' });
      const promoUtilsPromise = import('../../libs/features/personalization/promo-utils.js');
      const manifests = await combineMepSources(
        '/pers/manifest.json',
        { manifestnames: 'pre-black-friday-global,black-friday-global' },
        promoUtilsPromise,
        undefined,
      );
      expect(manifests.length).to.equal(3);
    });
    it('combines promos and personalization and mep param', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/mep/head-promo.html' });
      const promoUtilsPromise = import('../../libs/features/personalization/promo-utils.js');
      const manifests = await combineMepSources(
        '/pers/manifest.json',
        { manifestnames: 'pre-black-friday-global,black-friday-global' },
        promoUtilsPromise,
        '/pers/manifest.json--var1---/mep-param/manifest1.json--all---/mep-param/manifest2.json--all',
      );
      expect(manifests.length).to.equal(5);
    });
  });
  describe('getMepEnablement', async () => {
    it('checks target metadata set to off', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/mep/head-target-on.html' });
      const targetEnabled = getMepEnablement('target');
      expect(targetEnabled).to.equal(true);
    });
    it('checks target metadata set to on', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/mep/head-target-off.html' });
      const targetEnabled = getMepEnablement('target');
      expect(targetEnabled).to.equal(false);
    });
    it('checks target metadata set to gnav', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/mep/head-target-gnav.html' });
      const targetEnabled = getMepEnablement('target');
      expect(targetEnabled).to.equal('gnav');
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
