import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import init, { getOptions } from '../../../libs/blocks/merch-card-collection-autoblock/merch-card-collection-autoblock.js';
import { setConfig } from '../../../libs/utils/utils.js';

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const conf = { locales, miloLibs: '/libs' };
setConfig(conf);

const originalFetch = window.fetch;
describe('merch-card-collection autoblock', () => {
  describe('getOptions method', () => {
    it('gets fragment id', () => {
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&fragment=07b8be51-492a-4814-9953-a657fd3d9f67');
      expect(getOptions(a).fragment).to.equal('07b8be51-492a-4814-9953-a657fd3d9f67');
    });

    it('gets fragment id from query', () => {
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=07b8be51-492a-4814-9953-a657fd3d9f67');
      expect(getOptions(a).fragment).to.equal('07b8be51-492a-4814-9953-a657fd3d9f67');
    });

    it('handles missing fragment id', () => {
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom');
      expect(getOptions(a).fragment).to.be.undefined;
    });
  });

  describe('init method', () => {
    before(async () => {
      sinon.stub(window, 'fetch').callsFake(async () => {
        const result = await originalFetch('/test/blocks/merch-card-collection-autoblock/mocks/fragment.json').then((res) => {
          if (res.ok) return res;
          throw new Error(
            `Failed to get fragment: ${res.status} ${res.statusText}`,
          );
        });
        return result;
      });
    });

    afterEach(() => {
      document.body.innerHTML = '';
    });

    it('creates collection', async () => {
      const content = document.createElement('div');
      content.classList.add('content');
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=e58f8f75-b882-409a-9ff8-8826b36a8368');
      a.textContent = 'merch-card-collection: SANDBOX / Individual Plans';
      content.append(a);
      document.body.append(content);
      await init(a);
      const collection = document.querySelector('merch-card-collection');
      expect(collection).to.exist;
      expect(collection.className).to.include('plans');
    });

    it('creates creates sidenav by default', async () => {
      const content = document.createElement('div');
      content.classList.add('content');
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=e58f8f75-b882-409a-9ff8-8826b36a8368');
      a.textContent = 'merch-card-collection: SANDBOX / Individual Plans';
      content.append(a);
      document.body.append(content);
      await init(a);
      const collection = document.querySelector('merch-card-collection');
      expect(collection).to.exist;
      const sidenav = document.querySelector('merch-sidenav');
      expect(sidenav).to.exist;
    });

    it('creates does not create sidenav if specified in the query params', async () => {
      const content = document.createElement('div');
      content.classList.add('content');
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=e58f8f75-b882-409a-9ff8-8826b36a8368&sidenav=false');
      a.textContent = 'merch-card-collection: SANDBOX / Individual Plans';
      content.append(a);
      document.body.append(content);
      await init(a);
      const collection = document.querySelector('merch-card-collection');
      expect(collection).to.exist;
      const sidenav = document.querySelector('merch-sidenav');
      expect(sidenav).to.not.exist;
    });
  });
});
