// Pure transforms: flatten, parse, normalize, canonicalize, cross-page rewrite.
import { expect } from '@esm-bundle/chai';

import {
  flattenPayload,
  parsePayload,
  normalizeNode,
  rewriteCrossPageRefs,
  canonicalizeBreadcrumbItems,
  canonicalizeOrgId,
} from '../../../libs/features/jsonld-graph-manager/jsonld-graph-manager.js';
import {
  setupSuite,
  PAGE_URL,
  ORG_ID,
  setCanonical,
  makeScript,
  trackedManager,
} from './helpers.js';

setupSuite();

describe('flattenPayload', () => {
  it('wraps a single object in an array', () => {
    const result = flattenPayload({ '@type': 'Article' });
    expect(result).to.deep.equal([{ '@type': 'Article' }]);
  });

  it('returns an array as-is', () => {
    const arr = [{ '@type': 'Article' }, { '@type': 'WebPage' }];
    expect(flattenPayload(arr)).to.deep.equal(arr);
  });

  it('extracts @graph nodes', () => {
    const result = flattenPayload({ '@graph': [{ '@type': 'Article' }] });
    expect(result).to.deep.equal([{ '@type': 'Article' }]);
  });

  it('recursively flattens an array containing a @graph wrapper (no wrapper passes through)', () => {
    const input = [
      { '@type': 'Article', headline: 'Outer' },
      { '@context': 'https://schema.org', '@graph': [{ '@type': 'VideoObject', name: 'Inner' }] },
    ];
    const result = flattenPayload(input);
    expect(result).to.have.length(2);
    expect(result[0]).to.deep.equal({ '@type': 'Article', headline: 'Outer' });
    expect(result[1]).to.deep.equal({ '@type': 'VideoObject', name: 'Inner' });
    // No element with a residual @graph property.
    expect(result.some((n) => '@graph' in n)).to.be.false;
  });

  it('preserves typed-wrapper fields when the object has both @type and @graph', () => {
    const input = {
      '@type': 'WebPage',
      name: 'Page X',
      '@graph': [{ '@type': 'Article', headline: 'Inner' }],
    };
    const result = flattenPayload(input);
    expect(result).to.have.length(2);
    // Wrapper's non-@graph fields preserved as a node (minus @graph itself).
    expect(result[0]).to.deep.equal({ '@type': 'WebPage', name: 'Page X' });
    expect(result[1]).to.deep.equal({ '@type': 'Article', headline: 'Inner' });
  });

  it('flattens nested @graph wrappers recursively', () => {
    const input = { '@graph': [{ '@graph': [{ '@type': 'Article' }] }] };
    expect(flattenPayload(input)).to.deep.equal([{ '@type': 'Article' }]);
  });

  it('drops a pure @graph wrapper without @type and emits only inner nodes', () => {
    const input = { '@context': 'https://schema.org', '@graph': [{ '@type': 'Article' }, { '@type': 'BreadcrumbList' }] };
    const result = flattenPayload(input);
    expect(result).to.deep.equal([{ '@type': 'Article' }, { '@type': 'BreadcrumbList' }]);
  });
});

describe('parsePayload', () => {
  it('parses a single object', () => {
    const nodes = parsePayload(makeScript({ '@type': 'Article', headline: 'Hello' }));
    expect(nodes).to.have.length(1);
    expect(nodes[0]['@type']).to.equal('Article');
  });

  it('parses an array payload', () => {
    const nodes = parsePayload(makeScript([{ '@type': 'Article' }, { '@type': 'WebPage' }]));
    expect(nodes).to.have.length(2);
  });

  it('parses a @graph payload', () => {
    const nodes = parsePayload(makeScript({ '@graph': [{ '@type': 'Article' }, { '@type': 'BreadcrumbList' }] }));
    expect(nodes).to.have.length(2);
  });

  it('logs a Lana warning and returns [] on invalid JSON', () => {
    const nodes = parsePayload(makeScript('{ bad json }'));
    expect(nodes).to.deep.equal([]);
    expect(window.lana.log.called).to.be.true;
    expect(window.lana.log.firstCall.args[1].severity).to.equal('warn');
  });
});

describe('normalizeNode', () => {
  it('assigns canonical page-scoped @id to Article', () => {
    const node = normalizeNode({ '@context': 'https://schema.org', '@type': 'Article', headline: 'Hi' });
    expect(node['@id']).to.equal(`${PAGE_URL}#article`);
  });

  it('assigns canonical page-scoped @id to WebPage', () => {
    const node = normalizeNode({ '@type': 'WebPage' });
    expect(node['@id']).to.equal(`${PAGE_URL}#webpage`);
  });

  it('assigns site-wide @id to Organization', () => {
    const node = normalizeNode({ '@type': 'Organization', name: 'Adobe' });
    expect(node['@id']).to.equal(ORG_ID);
  });

  it('strips per-node @context', () => {
    const node = normalizeNode({ '@context': 'https://schema.org', '@type': 'Article' });
    expect(node['@context']).to.be.undefined;
  });

  it('retains unknown types without @id', () => {
    const node = normalizeNode({ '@type': 'UnknownType', name: 'X' });
    expect(node['@id']).to.be.undefined;
    expect(node['@type']).to.equal('UnknownType');
  });

  it('retains nodes with no @type', () => {
    const node = normalizeNode({ name: 'bare node' });
    expect(node.name).to.equal('bare node');
    expect(node['@id']).to.be.undefined;
  });
});

describe('canonicalizeOrgId', () => {
  it('rewrites #org alias to #organization', () => {
    expect(canonicalizeOrgId('https://www.adobe.com/#org'))
      .to.equal('https://www.adobe.com/#organization');
  });

  it('rewrites #publisher and #adobe aliases', () => {
    expect(canonicalizeOrgId('https://www.adobe.com/#publisher'))
      .to.equal('https://www.adobe.com/#organization');
    expect(canonicalizeOrgId('https://www.adobe.com/#adobe'))
      .to.equal('https://www.adobe.com/#organization');
  });

  it('leaves canonical #organization unchanged', () => {
    const id = 'https://www.adobe.com/#organization';
    expect(canonicalizeOrgId(id)).to.equal(id);
  });

  it('leaves unrelated fragments unchanged', () => {
    const id = 'https://www.adobe.com/page#article';
    expect(canonicalizeOrgId(id)).to.equal(id);
  });

  it('handles ids with no fragment', () => {
    const id = 'https://www.adobe.com/page';
    expect(canonicalizeOrgId(id)).to.equal(id);
  });

  it('canonicalizes Org alias references end-to-end through manager', () => {
    document.head.appendChild(makeScript({
      '@type': 'Article',
      headline: 'Test',
      publisher: { '@id': 'https://www.adobe.com/#org' },
    }));
    const manager = trackedManager();
    manager.init();

    const { '@graph': graph } = JSON.parse(
      document.head.querySelector('script[data-milo-jsonld="graph"]').textContent,
    );
    const article = graph.find((n) => n['@type'] === 'Article');
    expect(article.publisher).to.deep.equal({ '@id': ORG_ID });
  });
});

describe('rewriteCrossPageRefs', () => {
  it('rewrites inline cross-page WebPage in isPartOf to canonical reference', () => {
    const node = {
      '@type': 'WebApplication',
      isPartOf: {
        '@type': 'WebPage',
        '@id': 'https://www.adobe.com/acrobat/online.html#webpage',
        name: 'Adobe Acrobat online tools',
        url: 'https://www.adobe.com/acrobat/online.html',
      },
    };
    rewriteCrossPageRefs(node);
    expect(node.isPartOf).to.deep.equal({ '@id': `${PAGE_URL}#webpage` });
  });

  it('rewrites cross-page WebPage reference stub (no @type) to canonical', () => {
    const node = {
      '@type': 'Article',
      isPartOf: { '@id': 'https://www.adobe.com/somewhere-else.html#webpage' },
    };
    rewriteCrossPageRefs(node);
    expect(node.isPartOf).to.deep.equal({ '@id': `${PAGE_URL}#webpage` });
  });

  it('rewrites mainEntityOfPage the same way', () => {
    const node = {
      '@type': 'Article',
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.adobe.com/parent.html#webpage' },
    };
    rewriteCrossPageRefs(node);
    expect(node.mainEntityOfPage).to.deep.equal({ '@id': `${PAGE_URL}#webpage` });
  });

  it('leaves non-WebPage isPartOf values alone', () => {
    const node = {
      '@type': 'Article',
      isPartOf: { '@type': 'CreativeWorkSeries', '@id': 'https://example.com/series#1' },
    };
    rewriteCrossPageRefs(node);
    expect(node.isPartOf).to.deep.equal({ '@type': 'CreativeWorkSeries', '@id': 'https://example.com/series#1' });
  });

  it('end-to-end: producer cross-page WebPage in isPartOf is rewritten in the managed graph', () => {
    document.head.appendChild(makeScript({
      '@type': 'WebApplication',
      '@id': `${PAGE_URL}#webapplication`,
      name: 'Compress PDF',
      isPartOf: {
        '@type': 'WebPage',
        '@id': 'https://www.adobe.com/acrobat/online.html#webpage',
        name: 'Adobe Acrobat online tools',
        url: 'https://www.adobe.com/acrobat/online.html',
      },
    }));
    const manager = trackedManager();
    manager.init();
    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
    // Exactly one WebPage node — singleton enforced.
    const webpages = graph.filter((n) => n['@type'] === 'WebPage');
    expect(webpages).to.have.length(1);
    expect(webpages[0]['@id']).to.equal(`${PAGE_URL}#webpage`);
    // No phantom cross-page WebPage node leaked into the graph.
    expect(graph.find((n) => n['@id'] === 'https://www.adobe.com/acrobat/online.html#webpage')).to.not.exist;
    // The WebApplication's isPartOf points at the canonical current-page #webpage.
    const app = graph.find((n) => n['@id'] === `${PAGE_URL}#softwareapplication`);
    expect(app.isPartOf).to.deep.equal({ '@id': `${PAGE_URL}#webpage` });
  });
});

describe('canonicalizeBreadcrumbItems', () => {
  it('is a no-op on non-BreadcrumbList nodes', () => {
    const node = { '@type': 'WebPage', '@id': `${PAGE_URL}#webpage`, url: 'https://example.com/foo' };
    canonicalizeBreadcrumbItems(node);
    expect(node.url).to.equal('https://example.com/foo');
  });

  it('is a no-op when canonical link is missing', () => {
    document.head.querySelector('link[rel="canonical"]')?.remove();
    const node = {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${window.location.origin}/foo?q=1` },
      ],
    };
    canonicalizeBreadcrumbItems(node);
    expect(node.itemListElement[0].item).to.equal(`${window.location.origin}/foo?q=1`);
    setCanonical(); // restore for subsequent tests
  });

  it('rewrites same-origin item URLs to canonical production origin and strips query/hash', () => {
    const node = {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'A', item: `${window.location.origin}/products?milolibs=hgpa&jsonld-graph-manager=true#section` },
        { '@type': 'ListItem', position: 2, name: 'B', item: `${window.location.origin}/products/photoshop.html` },
      ],
    };
    canonicalizeBreadcrumbItems(node);
    expect(node.itemListElement[0].item).to.equal('https://www.adobe.com/products');
    expect(node.itemListElement[1].item).to.equal('https://www.adobe.com/products/photoshop.html');
  });

  it('preserves external-host items (query/hash still stripped)', () => {
    const node = {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'External', item: 'https://example.com/x?keep=this#anchor' },
      ],
    };
    canonicalizeBreadcrumbItems(node);
    expect(node.itemListElement[0].item).to.equal('https://example.com/x');
  });

  it('end-to-end: producer breadcrumb on a non-prod hostname is rewritten in managed graph', () => {
    document.head.appendChild(makeScript({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${window.location.origin}/products` },
        { '@type': 'ListItem', position: 2, name: 'Photoshop', item: `${window.location.origin}/products/photoshop.html?ratings-token=abc` },
      ],
    }));
    const manager = trackedManager();
    manager.init();
    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
    const bc = graph.find((n) => n['@type'] === 'BreadcrumbList');
    expect(bc.itemListElement[0].item).to.equal('https://www.adobe.com/products');
    expect(bc.itemListElement[1].item).to.equal('https://www.adobe.com/products/photoshop.html');
  });
});
