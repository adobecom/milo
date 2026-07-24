import { expect } from '@esm-bundle/chai';
import setJsonLdProductInfo from '../../../../libs/blocks/review/utils/setJsonLdProductInfo.js';
import { JsonLdGraphManager } from '../../../../libs/features/jsonld-graph-manager/jsonld-graph-manager.js';

describe('setJsonLdProductInfo Util', () => {
  beforeEach(() => {
    document.head.querySelectorAll('script[type="application/ld+json"]').forEach((script) => script.remove());
  });

  it('could set header', () => {
    setJsonLdProductInfo({ product: 'PS' }, 2.8, 10);
    const ldJsonTag = document.head.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(ldJsonTag).to.be.not.null;
  });

  it('preserves qualifying ratings from the review producer', () => {
    setJsonLdProductInfo({ '@type': 'Product', name: 'Photoshop' }, 4.2, 120);
    const manager = new JsonLdGraphManager();
    try {
      manager.init();
      const graph = JSON.parse(
        document.head.querySelector('script[data-milo-jsonld="graph"]').textContent,
      )['@graph'];
      const app = graph.find((node) => node['@type'] === 'SoftwareApplication');
      const rating = graph.find((node) => node['@type'] === 'AggregateRating');
      expect(rating.ratingValue).to.equal('4.2');
      expect(rating.ratingCount).to.equal('120');
      expect(app.aggregateRating).to.deep.equal({ '@id': rating['@id'] });
    } finally {
      manager.destroy();
    }
  });
});
