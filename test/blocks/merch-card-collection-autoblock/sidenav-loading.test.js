import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import init from '../../../libs/blocks/merch-card-collection-autoblock/merch-card-collection-autoblock.js';
import { setConfig } from '../../../libs/utils/utils.js';

setConfig({ locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } }, miloLibs: '/libs' });

// The window keeps merch-sidenav.js once loaded, so the order of these tests
// matters: every case that must not request it runs first.
const originalFetch = window.fetch;
const COLLECTION = 'e58f8f75-b882-409a-9ff8-8826b36a8368';
const BLADE = 'a0b1c2d3-0000-4000-8000-blade0000001';
const PRODUCT_PRICING = 'a0b1c2d3-0000-4000-8000-pricing00001';

const sidenavRequests = () => performance.getEntriesByType('resource')
  .map(({ name }) => name)
  .filter((name) => name.endsWith('/merch-sidenav.js'));

// The same collection, with its cards at the root instead of under categories.
const toBlade = (fragment, id = BLADE) => {
  const [{ referencesTree: cards }] = fragment.referencesTree;
  return {
    ...fragment,
    id,
    fields: { cards: cards.map(({ identifier }) => identifier) },
    referencesTree: cards,
  };
};

const toProductPricing = (fragment) => {
  const blade = toBlade(fragment, PRODUCT_PRICING);
  const references = Object.fromEntries(Object.entries(blade.references).map(([key, ref]) => [
    key,
    ref.value?.fields?.variant
      ? { ...ref, value: { ...ref.value, fields: { ...ref.value.fields, variant: 'product-pricing' } } }
      : ref,
  ]));
  return { ...blade, references };
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

describe('merch-card-collection autoblock sidenav loading', () => {
  before(() => {
    document.head.append(document.createElement('mas-commerce-service'));
    sinon.stub(window, 'fetch').callsFake(async (url) => {
      const res = await originalFetch('/test/blocks/merch-card-collection-autoblock/mocks/fragment.json');
      if (url.includes(`id=${BLADE}`)) return new Response(JSON.stringify(toBlade(await res.json())), { status: 200 });
      if (url.includes(`id=${PRODUCT_PRICING}`)) return new Response(JSON.stringify(toProductPricing(await res.json())), { status: 200 });
      return res;
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
    window.location.hash = '';
  });

  after(() => {
    window.fetch.restore();
  });

  it('never requests merch-sidenav.js for a collection without categories', async () => {
    const collection = await mount(BLADE);
    expect(collection.data.hierarchy).to.have.lengthOf(0);
    expect(document.querySelector('merch-sidenav')).to.not.exist;
    expect(sidenavRequests()).to.deep.equal([]);
    expect(customElements.get('merch-sidenav')).to.be.undefined;
  });

  it('still mounts the product-pricing filter, without merch-sidenav.js', async () => {
    const collection = await mount(PRODUCT_PRICING);
    expect(collection.variant).to.equal('product-pricing');
    expect(collection.data.hierarchy).to.have.lengthOf(0);
    expect(document.querySelector('.product-pricing-filter-bar')).to.exist;
    expect(sidenavRequests()).to.deep.equal([]);
  });

  it('keeps the product-pricing filter off with an authored #sidenav=false', async () => {
    await mount(PRODUCT_PRICING, '&sidenav=false');
    expect(document.querySelector('.product-pricing-filter-bar')).to.not.exist;
  });

  it('keeps the sidenav off with an authored #sidenav=false, even with categories', async () => {
    const collection = await mount(COLLECTION, '&sidenav=false');
    expect(collection.data.hierarchy.length).to.be.above(0);
    expect(document.querySelector('merch-sidenav')).to.not.exist;
    expect(sidenavRequests()).to.deep.equal([]);
  });

  it('loads and attaches the sidenav when the collection has categories', async () => {
    const collection = await mount(COLLECTION);
    expect(sidenavRequests()).to.have.lengthOf(1);
    const sidenav = document.querySelector('merch-sidenav');
    expect(sidenav).to.exist;
    expect(collection.sidenav).to.equal(sidenav);
    expect(customElements.get('merch-sidenav')).to.exist;
    expect(sidenav.querySelectorAll('sp-sidenav-item').length).to.be.above(0);
  });

  it('renders no sidenav with an authored #sidenav=true and no categories', async () => {
    await mount(BLADE, '&sidenav=true');
    expect(document.querySelector('merch-sidenav')).to.not.exist;
  });
});
