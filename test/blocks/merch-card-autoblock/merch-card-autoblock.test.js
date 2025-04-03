import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import init, { getOptions } from '../../../libs/blocks/merch-card-autoblock/merch-card-autoblock.js';

const originalFetch = window.fetch;
describe('merch-card-autoblock autoblock', () => {
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
      sinon.stub(window, 'fetch').callsFake(async (url) => {
        let fileName = '';
        if (url.includes('/mas/io/fragment')) {
          fileName = 'fragment.json';
        }
        if (url.includes('/web_commerce_artifact')) {
          fileName = 'artifact.json';
        }
        const result = await originalFetch(`/test/blocks/merch-card-autoblock/mocks/${fileName}`).then((res) => {
          if (res.ok) return res;
          throw new Error(
            `Failed to get fragment: ${res.status} ${res.statusText}`,
          );
        });
        return result;
      });
    });

    it('creates card', async () => {
      const content = document.createElement('div');
      content.classList.add('content');
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card&path=acom&fragment=a657fd3d9f67');
      a.textContent = 'merch-card: ACOM / Catalog / Test Card';
      content.append(a);
      document.body.append(content);
      await init(a);
      const card = document.querySelector('merch-card');
      expect(card.querySelector('[slot="heading-xs"]')?.textContent).to.equal('Creative Cloud All Apps');
    });
  });
});
