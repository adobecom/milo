import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import loadTaxonomy from '../../libs/scripts/taxonomy.js';

describe('Taxonomy requests', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('deduplicates concurrent requests for the normalized target URL', async () => {
    const fetchStub = sinon.stub(window, 'fetch')
      .resolves({ json: () => Promise.resolve({ data: [] }) });
    const config = { locale: { contentRoot: '/content' } };
    const target = './taxonomy-concurrent.json';

    const [first, second] = await Promise.all([
      loadTaxonomy(config, undefined, target),
      loadTaxonomy(config, undefined, target),
    ]);

    expect(fetchStub.calledOnceWith(target)).to.be.true;
    expect(first.CATEGORIES).to.equal('categories');
    expect(second.PRODUCTS).to.equal('products');
  });
});
