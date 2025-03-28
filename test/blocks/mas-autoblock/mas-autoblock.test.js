import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import init, { getOptions, getTagName } from '../../../libs/blocks/mas-autoblock/mas-autoblock.js';

const originalFetch = window.fetch;
describe('mas autoblock', () => {
  describe('getOptions method', () => {
    it('get fragment id', () => {
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#path=acom&fragment=07b8be51-492a-4814-9953-a657fd3d9f67');
      expect(getOptions(a).fragment).to.equal('07b8be51-492a-4814-9953-a657fd3d9f67');
    });

    it('no fragment id in URL', () => {
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#path=acom');
      expect(getOptions(a).fragment).to.be.null;
    });

    it('no hash in URL', () => {
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html');
      init(a);
      expect(getOptions(a).fragment).to.be.null;
    });
  });

  describe('getTagName method', () => {
    it('get tag name', () => {
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#path=acom&fragment=07b8be51-492a-4814-9953-a657fd3d9f67');
      a.textContent = 'merch-card: ACOM / Catalog / Test Card';
      expect(getTagName(a)).to.equal('merch-card');
    });

    it('get tag name default', () => {
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#path=acom&fragment=07b8be51-492a-4814-9953-a657fd3d9f67');
      a.textContent = '';
      expect(getTagName(a)).to.equal('merch-card');
    });

    it('get tag name collection', () => {
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#path=acom&fragment=07b8be51-492a-4814-9953-a657fd3d9f67');
      a.textContent = 'merch-card-collection: ACOM / Catalog / Test Collection';
      expect(getTagName(a)).to.equal('merch-card-collection');
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
        const result = await originalFetch(`/test/blocks/mas-autoblock/mocks/${fileName}`).then((res) => {
          if (res.ok) return res;
          throw new Error(
            `Failed to get fragment: ${res.status} ${res.statusText}`,
          );
        });
        return result;
      });
    });

    it('create card', async () => {
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#path=acom&fragment=a657fd3d9f67');
      a.textContent = 'merch-card: ACOM / Catalog / Test Card';
      document.body.append(a);
      await init(a);
      const card = document.body.querySelector('merch-card');
      expect(card.querySelector('[slot="heading-xs"]')?.textContent).to.equal('Creative Cloud All Apps');
    });
  });
});
