import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import init from '../../../libs/blocks/merch-card-collection-autoblock/merch-card-collection-autoblock.js';
import { setConfig } from '../../../libs/utils/utils.js';

setConfig({ locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } }, miloLibs: '/libs' });

// The window keeps Spectrum registered once loaded, so the order of these
// tests matters: no Spectrum at all, then the sidenav.
const originalFetch = window.fetch;
const COLLECTION = 'e58f8f75-b882-409a-9ff8-8826b36a8368';
const BLADE = 'a0b1c2d3-0000-4000-8000-blade0000001';

const spectrumRequests = () => performance.getEntriesByType('resource')
  .map(({ name }) => name)
  .filter((name) => name.includes('/features/spectrum-web-components/'));

const spectrumElements = ['sp-theme', 'sp-button', 'sp-search', 'sp-action-menu', 'sp-sidenav', 'sp-checkbox'];
const definedSpectrumElements = () => spectrumElements.filter((tag) => customElements.get(tag));

// The same collection, with its cards at the root instead of under categories.
const toBlade = (fragment) => {
  const [{ referencesTree: cards }] = fragment.referencesTree;
  return {
    ...fragment,
    id: BLADE,
    fields: { cards: cards.map(({ identifier }) => identifier) },
    referencesTree: cards,
  };
};

const mount = async (id, hash = '') => {
  const content = document.createElement('div');
  content.classList.add('content');
  const a = document.createElement('a');
  a.setAttribute('href', `https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=${id}${hash}`);
  a.textContent = 'merch-card-collection: SANDBOX / Individual Plans';
  content.append(a);
  document.body.append(content);
  await init(a);
  return document.querySelector('merch-card-collection');
};

describe('merch-card-collection autoblock Spectrum loading', () => {
  before(() => {
    document.head.append(document.createElement('mas-commerce-service'));
    sinon.stub(window, 'fetch').callsFake(async (url) => {
      const res = await originalFetch('/test/blocks/merch-card-collection-autoblock/mocks/fragment.json');
      if (!url.includes(`id=${BLADE}`)) return res;
      return new Response(JSON.stringify(toBlade(await res.json())), { status: 200 });
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
    window.location.hash = '';
  });

  after(() => {
    window.fetch.restore();
  });

  describe('blade (no hierarchy)', () => {
    it('requests no Spectrum on init', async () => {
      const collection = await mount(BLADE);
      expect(collection.data.hierarchy).to.have.lengthOf(0);
      expect(collection.querySelectorAll(':scope > merch-card').length).to.be.above(0);
      expect(document.querySelector('merch-sidenav')).to.not.exist;
      expect(spectrumRequests()).to.deep.equal([]);
      expect(definedSpectrumElements()).to.deep.equal([]);
    });

    it('requests no Spectrum on interactions', async () => {
      const collection = await mount(BLADE);
      window.location.hash = 'filter=all&sort=alphabetical';
      await new Promise((resolve) => { setTimeout(resolve, 100); });
      collection.requestUpdate();
      await collection.updateComplete;
      collection.querySelector('merch-card').click();
      expect(spectrumRequests()).to.deep.equal([]);
      expect(definedSpectrumElements()).to.deep.equal([]);
    });

    it('requests no Spectrum with sidenav=false either', async () => {
      await mount(BLADE, '&sidenav=false');
      expect(spectrumRequests()).to.deep.equal([]);
      expect(definedSpectrumElements()).to.deep.equal([]);
    });
  });

  describe('collection with a hierarchy', () => {
    it('requests no Spectrum when the sidenav is not rendered', async () => {
      const collection = await mount(COLLECTION, '&sidenav=false');
      expect(collection.data.hierarchy.length).to.be.above(0);
      expect(document.querySelector('merch-sidenav')).to.not.exist;
      expect(spectrumRequests()).to.deep.equal([]);
      expect(definedSpectrumElements()).to.deep.equal([]);
    });

    it('loads Spectrum when the sidenav is rendered', async () => {
      await mount(COLLECTION);
      const sidenav = document.querySelector('merch-sidenav');
      expect(sidenav).to.exist;
      expect(definedSpectrumElements()).to.deep.equal(spectrumElements);
      ['theme', 'base', 'shared', 'button', 'search', 'action-menu', 'sidenav', 'checkbox'].forEach((dep) => {
        expect(spectrumRequests().some((name) => name.endsWith(`/${dep}.js`)), dep).to.be.true;
      });
      expect(sidenav.querySelectorAll('sp-sidenav-item').length).to.be.above(0);
    });
  });
});
