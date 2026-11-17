import { expect } from '@esm-bundle/chai';
import { mountBlade, restore, setPage, sidenavRequests, stubCollection } from './mocks/sidenav-page.js';

// Fresh page per file: the window keeps merch-sidenav.js once loaded, so order matters.
describe('merch-card-collection autoblock on creativecloud/plans', () => {
  before(stubCollection);
  after(restore);
  afterEach(() => { document.body.innerHTML = ''; });

  it('does not treat a page under creativecloud/plans as the plans page', async () => {
    setPage('/creativecloud/plans/business.html');
    await mountBlade();
    expect(sidenavRequests()).to.deep.equal([]);
  });

  it('loads merch-sidenav.js up front, without .html', async () => {
    expect(setPage('/de/creativecloud/plans')).to.equal('/de');
    await mountBlade();
    expect(sidenavRequests()).to.have.lengthOf(1);
  });
});
