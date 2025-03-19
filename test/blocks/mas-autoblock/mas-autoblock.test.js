import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import init, {
  getFragmentId,
  getTagName,
  createControl,
} from '../../../libs/blocks/mas-autoblock/mas-autoblock.js';

const originalFetch = window.fetch;
describe('mas autoblock', () => {
  describe('getFragmentId method', () => {
    it('get fragment id', () => {
      const a = document.createElement('a');
      a.setAttribute(
        'href',
        'https://mas.adobe.com/studio.html#path=acom&fragment=07b8be51-492a-4814-9953-a657fd3d9f67'
      );
      expect(getFragmentId(a)).to.equal('07b8be51-492a-4814-9953-a657fd3d9f67');
    });

    it('no fragment id in URL', () => {
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#path=acom');
      expect(getFragmentId(a)).to.be.null;
    });

    it('no hash in URL', () => {
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html');
      init(a);
      expect(getFragmentId(a)).to.be.null;
    });
  });

  describe('getTagName method', () => {
    it('get tag name', () => {
      const a = document.createElement('a');
      a.setAttribute(
        'href',
        'https://mas.adobe.com/studio.html#path=acom&fragment=07b8be51-492a-4814-9953-a657fd3d9f67'
      );
      a.textContent = 'merch-card: ACOM / Catalog / Test Card';
      expect(getTagName(a)).to.equal('merch-card');
    });

    it('get tag name default', () => {
      const a = document.createElement('a');
      a.setAttribute(
        'href',
        'https://mas.adobe.com/studio.html#path=acom&fragment=07b8be51-492a-4814-9953-a657fd3d9f67'
      );
      a.textContent = '';
      expect(getTagName(a)).to.equal('merch-card');
    });

    it('get tag name collection', () => {
      const a = document.createElement('a');
      a.setAttribute(
        'href',
        'https://mas.adobe.com/studio.html#path=acom&fragment=07b8be51-492a-4814-9953-a657fd3d9f67'
      );
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
        const result = await originalFetch(
          `/test/blocks/mas-autoblock/mocks/${fileName}`
        ).then((res) => {
          if (res.ok) return res;
          throw new Error(
            `Failed to get fragment: ${res.status} ${res.statusText}`
          );
        });
        return result;
      });
    });

    it('no hash in URL', () => {
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html');
      init(a);
      expect(getFragmentId(a)).to.be.null;
    });

    it('get tag name', () => {
      const a = document.createElement('a');
      a.setAttribute(
        'href',
        'https://mas.adobe.com/studio.html#path=acom&fragment=07b8be51-492a-4814-9953-a657fd3d9f67'
      );
      a.textContent = 'merch-card: ACOM / Catalog / Test Card';
      expect(getTagName(a)).to.equal('merch-card');
    });

    it('get tag name default', () => {
      const a = document.createElement('a');
      a.setAttribute(
        'href',
        'https://mas.adobe.com/studio.html#path=acom&fragment=07b8be51-492a-4814-9953-a657fd3d9f67'
      );
      a.textContent = '';
      expect(getTagName(a)).to.equal('merch-card');
    });

    it('get tag name collection', () => {
      const a = document.createElement('a');
      a.setAttribute(
        'href',
        'https://mas.adobe.com/studio.html#path=acom&fragment=07b8be51-492a-4814-9953-a657fd3d9f67'
      );
      a.textContent = 'merch-card-collection: ACOM / Catalog / Test Collection';
      expect(getTagName(a)).to.equal('merch-card-collection');
    });

    it('create card', async () => {
      const a = document.createElement('a');
      a.setAttribute(
        'href',
        'https://mas.adobe.com/studio.html#path=acom&fragment=a657fd3d9f67'
      );
      a.textContent = 'merch-card: ACOM / Catalog / Test Card';
      const fragmentId = getFragmentId(a);
      document.body.append(a);
      createControl(a, fragmentId);
      const card = document.body.querySelector('merch-card');
      expect(card.outerHTML).to.equal(
        '<merch-card consonant=""><aem-fragment fragment="a657fd3d9f67"></aem-fragment></merch-card>'
      );
    });

    it('create card', async () => {
      const a = document.createElement('a');
      a.setAttribute(
        'href',
        'https://mas.adobe.com/studio.html#path=acom&fragment=a657fd3d9f67'
      );
      a.textContent = 'merch-card: ACOM / Catalog / Test Card';
      document.body.append(a);
      await init(a);
      const card = document.body.querySelector('merch-card');
      expect(card.querySelector('[slot="heading-xs"]')?.textContent).to.equal(
        'Creative Cloud All Apps'
      );
    });
  });
});
