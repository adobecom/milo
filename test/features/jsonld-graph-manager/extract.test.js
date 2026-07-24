// Inline-entity extraction and type transforms.
import { expect } from '@esm-bundle/chai';

import {
  normalizeNode,
  extractInlineEntities,
} from '../../../libs/features/jsonld-graph-manager/jsonld-graph-manager.js';
import {
  setupSuite,
  PAGE_URL,
  ORG_ID,
  makeScript,
  trackedManager,
} from './helpers.js';

setupSuite();

describe('extractInlineEntities', () => {
  it('hoists inline Organization to top-level and replaces with @id ref', () => {
    const node = {
      '@type': 'Article',
      '@id': `${PAGE_URL}#article`,
      publisher: { '@type': 'Organization', name: 'Adobe' },
    };
    const extracted = extractInlineEntities(node);
    expect(extracted).to.have.length(1);
    expect(extracted[0]['@type']).to.equal('Organization');
    expect(extracted[0]['@id']).to.equal(ORG_ID);
    expect(node.publisher).to.deep.equal({ '@id': ORG_ID });
  });

  it('hoists inline objects that already have @id and rewrites them as references', () => {
    const node = {
      '@type': 'Article',
      publisher: { '@type': 'Organization', '@id': ORG_ID, name: 'Adobe' },
    };
    const extracted = extractInlineEntities(node);
    expect(extracted).to.have.length(1);
    expect(extracted[0]['@type']).to.equal('Organization');
    expect(extracted[0]['@id']).to.equal(ORG_ID);
    expect(node.publisher).to.deep.equal({ '@id': ORG_ID });
  });

  it('leaves inline objects with unknown @type untouched', () => {
    const node = { '@type': 'Article', publisher: { '@type': 'UnknownThing', name: 'X' } };
    const extracted = extractInlineEntities(node);
    expect(extracted).to.have.length(0);
  });

  it('integrates hoisted entities into the graph via manager', () => {
    document.head.appendChild(makeScript({
      '@type': 'Article',
      headline: 'Hello',
      publisher: { '@type': 'Organization', name: 'Adobe' },
    }));
    const manager = trackedManager();
    manager.init();

    const { '@graph': graph } = JSON.parse(
      document.head.querySelector('script[data-milo-jsonld="graph"]').textContent,
    );
    const article = graph.find((n) => n['@type'] === 'Article');
    const org = graph.find((n) => n['@type'] === 'Organization');
    expect(org).to.exist;
    expect(article.publisher).to.deep.equal({ '@id': ORG_ID });
  });
});

describe('Product → SoftwareApplication transform', () => {
  it('rewrites @type and assigns canonical SA @id', () => {
    const out = normalizeNode({ '@type': 'Product', name: 'X', description: 'Y' });
    expect(out['@type']).to.equal('SoftwareApplication');
    expect(out['@id']).to.equal(`${PAGE_URL}#softwareapplication`);
    expect(out.name).to.equal('X');
    expect(out.description).to.equal('Y');
  });

  it('produces no Product nodes in the managed graph (review-block shape)', () => {
    document.head.appendChild(makeScript({
      '@context': 'http://schema.org',
      '@type': 'Product',
      name: 'Adobe Photoshop',
      description: 'Photo editor',
    }));
    const manager = trackedManager();
    manager.init();

    const { '@graph': graph } = JSON.parse(
      document.head.querySelector('script[data-milo-jsonld="graph"]').textContent,
    );
    expect(graph.some((n) => n['@type'] === 'Product')).to.be.false;
    const sa = graph.find((n) => n['@type'] === 'SoftwareApplication');
    expect(sa).to.exist;
    expect(sa.name).to.equal('Adobe Photoshop');
    expect(sa.description).to.equal('Photo editor');
    expect(sa['@id']).to.equal(`${PAGE_URL}#softwareapplication`);
  });
});

describe('inline Offer hoisting', () => {
  it('hoists inline Offers from offers array and replaces with @id refs', () => {
    const node = {
      '@type': 'SoftwareApplication',
      offers: [
        { '@type': 'Offer', '@id': 'producer/path#offer', price: '19.99', priceCurrency: 'USD' },
      ],
    };
    const extracted = extractInlineEntities(node);
    expect(extracted).to.have.length(1);
    expect(extracted[0]['@type']).to.equal('Offer');
    expect(extracted[0]['@id']).to.match(new RegExp(`^${PAGE_URL}#offer-`));
    expect(extracted[0].price).to.equal('19.99');
    expect(node.offers).to.deep.equal([{ '@id': extracted[0]['@id'] }]);
  });

  it('preserves non-typed array entries (e.g., URL strings)', () => {
    const node = {
      '@type': 'BreadcrumbList',
      itemListElement: ['https://example.com/a', 'https://example.com/b'],
    };
    const extracted = extractInlineEntities(node);
    expect(extracted).to.have.length(0);
    expect(node.itemListElement).to.deep.equal([
      'https://example.com/a',
      'https://example.com/b',
    ]);
  });
});

describe('inline Brand handling', () => {
  it('does not hoist anonymous Brand', () => {
    const node = {
      '@type': 'SoftwareApplication',
      brand: { '@type': 'Brand', name: 'Adobe' },
    };
    const extracted = extractInlineEntities(node);
    expect(extracted).to.have.length(0);
    expect(node.brand).to.deep.equal({ '@type': 'Brand', name: 'Adobe' });
  });

  it('does not hoist Brand even when producer assigns @id', () => {
    const node = {
      '@type': 'SoftwareApplication',
      brand: { '@type': 'Brand', '@id': 'https://example.com/#brand', name: 'Adobe' },
    };
    const extracted = extractInlineEntities(node);
    expect(extracted).to.have.length(0);
    expect(node.brand['@type']).to.equal('Brand');
  });
});

describe('AggregateRating singleton', () => {
  it('extractInlineEntities hoists inline AggregateRating to top-level and references it by @id', () => {
    const node = {
      '@type': 'SoftwareApplication',
      '@id': `${PAGE_URL}#softwareapplication`,
      aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.5', ratingCount: '100' },
    };
    const extracted = extractInlineEntities(node);
    expect(extracted).to.have.length(1);
    expect(extracted[0]['@type']).to.equal('AggregateRating');
    expect(extracted[0]['@id']).to.equal(`${PAGE_URL}#aggregaterating`);
    expect(extracted[0].ratingValue).to.equal('4.5');
    expect(node.aggregateRating).to.deep.equal({ '@id': `${PAGE_URL}#aggregaterating` });
  });

  it('end-to-end: two producers contributing aggregateRating merge into one canonical node', () => {
    // Enqueue first as bootDom (team hardcode), second as runtime (review block).
    const bootScript = makeScript({
      '@type': 'WebApplication',
      '@id': `${PAGE_URL}#webapplication`,
      name: 'Compress PDF',
      aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.6', ratingCount: '279157' },
    });
    const runtimeScript = makeScript({
      '@type': 'Product',
      name: 'Compress PDF',
      aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.61', ratingCount: '269519' },
    });
    document.head.appendChild(bootScript);
    document.head.appendChild(runtimeScript);
    const manager = trackedManager();
    manager.enqueue(bootScript, 'bootDom');
    manager.enqueue(runtimeScript, 'runtime');
    manager.rebuild();

    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
    const ratings = graph.filter((n) => n['@type'] === 'AggregateRating');
    expect(ratings).to.have.length(1);
    const rating = ratings[0];
    expect(rating['@id']).to.equal(`${PAGE_URL}#aggregaterating`);
    // Runtime wins over bootDom on scalar conflicts (source-priority).
    expect(rating.ratingValue).to.equal('4.61');
    expect(rating.ratingCount).to.equal('269519');
    // The SA reference points at the canonical aggregateRating @id.
    const app = graph.find((n) => n['@id'] === `${PAGE_URL}#softwareapplication`);
    expect(app.aggregateRating).to.deep.equal({ '@id': `${PAGE_URL}#aggregaterating` });
  });
});
