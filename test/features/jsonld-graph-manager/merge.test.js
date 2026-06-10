// Merge + link injection: union, mergeNodes, injectLinks, subtype promotion.
import { expect } from '@esm-bundle/chai';

import {
  normalizeNode,
  unionByRef,
  mergeNodes,
  injectLinks,
} from '../../../libs/features/jsonld-graph-manager/jsonld-graph-manager.js';
import {
  setupSuite,
  PAGE_URL,
  ORG_ID,
  makeScript,
  trackedManager,
} from './helpers.js';

setupSuite();

describe('unionByRef', () => {
  it('unions two arrays by @id, deduplicating', () => {
    const a = [{ '@id': '#a' }, { '@id': '#b' }];
    const b = [{ '@id': '#b' }, { '@id': '#c' }];
    const result = unionByRef(a, b);
    expect(result).to.have.length(3);
    expect(result.map((n) => n['@id'])).to.include.members(['#a', '#b', '#c']);
  });

  it('handles undefined inputs', () => {
    expect(unionByRef(undefined, [{ '@id': '#a' }])).to.deep.equal([{ '@id': '#a' }]);
    expect(unionByRef([{ '@id': '#a' }], undefined)).to.deep.equal([{ '@id': '#a' }]);
  });

  it('wraps non-array values', () => {
    const result = unionByRef({ '@id': '#a' }, { '@id': '#b' });
    expect(result).to.have.length(2);
  });
});

describe('mergeNodes', () => {
  it('runtime source wins over bootDom on scalar conflict', () => {
    const bootNode = { '@type': 'Organization', '@id': ORG_ID, name: 'Adobe' };
    const runtimeNode = { '@type': 'Organization', '@id': ORG_ID, name: 'Adobe Inc.' };
    const result = mergeNodes(bootNode, runtimeNode, 'bootDom', 'runtime');
    expect(result.name).to.equal('Adobe Inc.');
  });

  it('bootDom wins over another bootDom (first wins via >=)', () => {
    const a = { '@type': 'Organization', '@id': ORG_ID, name: 'First' };
    const b = { '@type': 'Organization', '@id': ORG_ID, name: 'Second' };
    const result = mergeNodes(a, b, 'bootDom', 'bootDom');
    expect(result.name).to.equal('First');
  });

  it('merges fields present only on loser', () => {
    const a = { '@type': 'Organization', '@id': ORG_ID, name: 'Adobe' };
    const b = { '@type': 'Organization', '@id': ORG_ID, logo: 'https://www.adobe.com/logo.png' };
    const result = mergeNodes(a, b, 'runtime', 'bootDom');
    expect(result.name).to.equal('Adobe');
    expect(result.logo).to.equal('https://www.adobe.com/logo.png');
  });

  it('unions reference arrays', () => {
    const a = { '@type': 'Article', '@id': `${PAGE_URL}#article`, hasPart: [{ '@id': '#howto' }] };
    const b = { '@type': 'Article', '@id': `${PAGE_URL}#article`, hasPart: [{ '@id': '#faq' }] };
    const result = mergeNodes(a, b, 'bootDom', 'runtime');
    expect(result.hasPart).to.have.length(2);
  });
});

describe('injectLinks', () => {
  it('adds isPartOf to Article pointing at WebPage', () => {
    const webpage = { '@type': 'WebPage', '@id': `${PAGE_URL}#webpage` };
    const article = { '@type': 'Article', '@id': `${PAGE_URL}#article` };
    injectLinks([webpage, article]);
    expect(article.isPartOf).to.deep.equal({ '@id': `${PAGE_URL}#webpage` });
  });

  it('adds mainEntity to WebPage pointing at Article', () => {
    const webpage = { '@type': 'WebPage', '@id': `${PAGE_URL}#webpage` };
    const article = { '@type': 'Article', '@id': `${PAGE_URL}#article` };
    injectLinks([webpage, article]);
    expect(webpage.mainEntity).to.deep.equal({ '@id': `${PAGE_URL}#article` });
  });

  it('adds publisher to WebPage pointing at Organization', () => {
    const org = { '@type': 'Organization', '@id': ORG_ID };
    const webpage = { '@type': 'WebPage', '@id': `${PAGE_URL}#webpage` };
    injectLinks([org, webpage]);
    expect(webpage.publisher).to.deep.equal({ '@id': ORG_ID });
  });

  it('does not overwrite existing links', () => {
    const webpage = { '@type': 'WebPage', '@id': `${PAGE_URL}#webpage`, mainEntity: { '@id': '#custom' } };
    const article = { '@type': 'Article', '@id': `${PAGE_URL}#article` };
    injectLinks([webpage, article]);
    expect(webpage.mainEntity).to.deep.equal({ '@id': '#custom' });
  });
});

describe('SoftwareApplication subtype preservation', () => {
  it('normalizeNode preserves WebApplication @type and assigns canonical SA @id', () => {
    const node = normalizeNode({
      '@type': 'WebApplication',
      '@id': 'https://producer.example/some-id',
      name: 'Compress PDF',
      browserRequirements: 'Requires HTML5',
    });
    expect(node['@type']).to.equal('WebApplication');
    expect(node['@id']).to.equal(`${PAGE_URL}#softwareapplication`);
    expect(node.name).to.equal('Compress PDF');
    expect(node.browserRequirements).to.equal('Requires HTML5');
  });

  it('normalizeNode preserves MobileApplication @type', () => {
    const node = normalizeNode({ '@type': 'MobileApplication', name: 'Adobe Scan' });
    expect(node['@type']).to.equal('MobileApplication');
    expect(node['@id']).to.equal(`${PAGE_URL}#softwareapplication`);
  });

  it('mergeNodes promotes type to subtype when one input is plain SoftwareApplication', () => {
    const sa = { '@type': 'SoftwareApplication', '@id': `${PAGE_URL}#softwareapplication`, name: 'Photoshop', aggregateRating: { ratingValue: '4.61' } };
    const webapp = { '@type': 'WebApplication', '@id': `${PAGE_URL}#softwareapplication`, name: 'Compress PDF', browserRequirements: 'HTML5' };
    // Even with bootDom (lower) for webapp and runtime (higher) for sa, subtype wins.
    const merged = mergeNodes(sa, webapp, 'runtime', 'bootDom');
    expect(merged['@type']).to.equal('WebApplication');
    // Source priority still applies to scalars: runtime sa.name wins.
    expect(merged.name).to.equal('Photoshop');
    // Producer-only fields preserved on both sides.
    expect(merged.browserRequirements).to.equal('HTML5');
    expect(merged.aggregateRating).to.deep.equal({ ratingValue: '4.61' });
  });

  it('end-to-end: producer WebApplication + review-block Product merge into single WebApplication node', () => {
    document.head.appendChild(makeScript({
      '@type': 'WebApplication',
      '@id': `${PAGE_URL}#webapplication`,
      name: 'Compress PDF',
      browserRequirements: 'HTML5',
      applicationCategory: 'BusinessApplication',
    }));
    document.head.appendChild(makeScript({
      '@type': 'Product',
      name: 'Compress PDF',
      aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.61', ratingCount: '269519' },
    }));
    const manager = trackedManager();
    manager.init();
    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
    // Exactly one node at #softwareapplication.
    const apps = graph.filter((n) => n['@id'] === `${PAGE_URL}#softwareapplication`);
    expect(apps).to.have.length(1);
    const app = apps[0];
    // Subtype preserved.
    expect(app['@type']).to.equal('WebApplication');
    // Producer-only fields preserved from both contributions.
    expect(app.browserRequirements).to.equal('HTML5');
    expect(app.applicationCategory).to.equal('BusinessApplication');
    // AggregateRating hoisted to top-level node, referenced by @id.
    expect(app.aggregateRating).to.deep.equal({ '@id': `${PAGE_URL}#aggregaterating` });
    const rating = graph.find((n) => n['@type'] === 'AggregateRating');
    expect(rating).to.exist;
    expect(rating['@id']).to.equal(`${PAGE_URL}#aggregaterating`);
    expect(rating.ratingValue).to.equal('4.61');
    expect(rating.ratingCount).to.equal('269519');
  });
});

describe('injectLinks subtype awareness', () => {
  it('sets WebPage.mainEntity to a SoftwareApplication subtype (WebApplication) when no plain SA exists', () => {
    document.head.appendChild(makeScript({
      '@type': 'WebApplication',
      '@id': `${PAGE_URL}#webapplication`,
      name: 'Compress PDF',
    }));
    const manager = trackedManager();
    manager.init();
    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
    const webpage = graph.find((n) => n['@type'] === 'WebPage');
    expect(webpage.mainEntity).to.deep.equal({ '@id': `${PAGE_URL}#softwareapplication` });
  });

  it('auto-injects provider on a WebApplication via SoftwareApplication linksBack', () => {
    document.head.appendChild(makeScript({
      '@type': 'WebApplication',
      '@id': `${PAGE_URL}#webapplication`,
      name: 'Compress PDF',
    }));
    const manager = trackedManager();
    manager.init();
    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
    const app = graph.find((n) => n['@id'] === `${PAGE_URL}#softwareapplication`);
    expect(app['@type']).to.equal('WebApplication');
    expect(app.provider).to.deep.equal({ '@id': ORG_ID });
  });

  it('sets WebPage.mainEntity to a NewsArticle node by @id when present', () => {
    document.head.appendChild(makeScript({
      '@type': 'NewsArticle',
      '@id': `${PAGE_URL}#newsarticle`,
      headline: 'Adobe announces…',
    }));
    const manager = trackedManager();
    manager.init();
    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
    const webpage = graph.find((n) => n['@type'] === 'WebPage');
    expect(webpage.mainEntity).to.deep.equal({ '@id': `${PAGE_URL}#newsarticle` });
  });
});
