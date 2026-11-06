import { expect } from '@esm-bundle/chai';
import { mountBlade, restore, setPage, sidenavRequests, stubCollection } from './mocks/sidenav-page.js';

// Fresh page per file: the window keeps merch-sidenav.js once loaded, so order matters.
describe('merch-card-collection autoblock on products/catalog', () => {
  before(stubCollection);
  after(restore);
  afterEach(() => { document.body.innerHTML = ''; });

  it('never requests merch-sidenav.js on other pages without categories', async () => {
    setPage('/acrobat/plans.html');
    const collection = await mountBlade();
    expect(collection.data.hierarchy).to.have.lengthOf(0);
    expect(sidenavRequests()).to.deep.equal([]);
  });

  it('keeps it off with an authored #sidenav=false', async () => {
    setPage('/products/catalog.html');
    await mountBlade('&sidenav=false');
    expect(sidenavRequests()).to.deep.equal([]);
    expect(document.querySelector('merch-sidenav')).to.not.exist;
  });

  it('loads merch-sidenav.js up front on a localized catalog page', async () => {
    expect(setPage('/fr/products/catalog.html')).to.equal('/fr');
    await mountBlade();
    expect(sidenavRequests()).to.have.lengthOf(1);
    // no categories, so nothing to render
    expect(document.querySelector('merch-sidenav')).to.not.exist;
  });
});
