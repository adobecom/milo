import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

import {
  flattenPayload,
  parsePayload,
  normalizeNode,
  unionByRef,
  mergeNodes,
  injectLinks,
  extractInlineEntities,
  rewriteCrossPageRefs,
  canonicalizeBreadcrumbItems,
  canonicalizeOrgId,
  aggregateRatingMeetsThresholds,
  shouldIgnoreScript,
  parseIgnoreParam,
  siteRoot,
  defaultOrg,
  JsonLdGraphManager,
} from '../../../libs/features/jsonld-graph-manager/jsonld-graph-manager.js';

const PAGE_URL = 'https://www.adobe.com/products/photoshop.html';
const ORG_ID = 'https://www.adobe.com/#organization'; // www default
const ADOBE_LOGO_URL = 'https://www.adobe.com/content/dam/cc/icons/Adobe_Corporate_Horizontal_Red_HEX.svg';
const ADOBE_LOGO_OBJECT = {
  '@type': 'ImageObject',
  url: ADOBE_LOGO_URL,
  contentUrl: ADOBE_LOGO_URL,
};

function setCanonical(url = PAGE_URL) {
  document.head.querySelector('link[rel="canonical"]')?.remove();
  const link = document.createElement('link');
  link.rel = 'canonical';
  link.href = url;
  document.head.appendChild(link);
}

function makeScript(obj) {
  const el = document.createElement('script');
  el.type = 'application/ld+json';
  el.textContent = typeof obj === 'string' ? obj : JSON.stringify(obj);
  return el;
}

const activeManagers = new Set();

const OriginalManager = JsonLdGraphManager;
function trackedManager(...args) {
  const m = new OriginalManager(...args);
  activeManagers.add(m);
  return m;
}

function resetManager() {
  activeManagers.forEach((m) => m.destroy?.());
  activeManagers.clear();
  if (window.miloJsonLd) {
    window.miloJsonLd.manager = null;
    window.miloJsonLd.htmlJsonLd = null;
  }
  document.head.querySelector('script[data-milo-jsonld="graph"]')?.remove();
  document.head.querySelectorAll('script[type="application/ld+json"]').forEach((s) => s.remove());
  document.body.querySelectorAll('script[type="application/ld+json"]').forEach((s) => s.remove());
}

before(() => {
  window.lana = { log: sinon.stub() };
  setCanonical();
});

afterEach(() => {
  resetManager();
  window.lana.log.resetHistory();
});

// ---------------------------------------------------------------------------
// flattenPayload
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// parsePayload
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// normalizeNode
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// unionByRef
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// mergeNodes
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// injectLinks
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// JsonLdGraphManager — boot scan & rewrite
// ---------------------------------------------------------------------------
describe('JsonLdGraphManager boot scan', () => {
  it('ingests pre-existing scripts and produces a managed graph', () => {
    const script = makeScript({ '@type': 'Article', headline: 'Hello' });
    document.head.appendChild(script);

    const manager = trackedManager();
    manager.init();

    const managed = document.head.querySelector('script[data-milo-jsonld="graph"]');
    expect(managed).to.exist;
    const graph = JSON.parse(managed.textContent);
    expect(graph['@context']).to.equal('https://schema.org');
    expect(graph['@graph']).to.be.an('array');
    const article = graph['@graph'].find((n) => n['@type'] === 'Article');
    expect(article).to.exist;
    expect(article['@id']).to.equal(`${PAGE_URL}#article`);
  });

  it('removes ingested unmanaged scripts from the DOM', () => {
    const script = makeScript({ '@type': 'Article', headline: 'Hello' });
    document.head.appendChild(script);
    const manager = trackedManager();
    manager.init();
    expect(document.head.contains(script)).to.be.false;
  });

  it('does not re-ingest the managed script', () => {
    const script = makeScript({ '@type': 'Article' });
    document.head.appendChild(script);
    const manager = trackedManager();
    manager.init();

    const managedScripts = document.head.querySelectorAll('script[data-milo-jsonld="graph"]');
    expect(managedScripts).to.have.length(1);
    const count = JSON.parse(managedScripts[0].textContent)['@graph'].length;

    manager.rebuild();
    const afterCount = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'].length;
    expect(afterCount).to.equal(count);
  });

  it('emits a baseline WebPage + Organization graph when no producers are present', () => {
    const manager = trackedManager();
    manager.init();
    const managed = document.head.querySelector('script[data-milo-jsonld="graph"]');
    expect(managed).to.exist;
    const graph = JSON.parse(managed.textContent)['@graph'];
    const types = graph.map((n) => n['@type']);
    expect(types).to.include.members(['WebPage', 'Organization']);
    const webpage = graph.find((n) => n['@type'] === 'WebPage');
    expect(webpage.publisher).to.deep.equal({ '@id': ORG_ID });
    const org = graph.find((n) => n['@type'] === 'Organization');
    expect(org['@id']).to.equal(ORG_ID);
    expect(org.name).to.equal('Adobe');
    expect(org.url).to.equal('https://www.adobe.com/');
    expect(org.logo).to.deep.equal(ADOBE_LOGO_OBJECT);
  });
});

// ---------------------------------------------------------------------------
// JsonLdGraphManager — singleton enforcement
// ---------------------------------------------------------------------------
describe('JsonLdGraphManager singleton enforcement', () => {
  it('merges two Organization nodes into one', () => {
    const s1 = makeScript({ '@type': 'Organization', name: 'Adobe', logo: 'logo.png' });
    const s2 = makeScript({ '@type': 'Organization', name: 'Adobe Inc.' });
    document.head.appendChild(s1);
    document.head.appendChild(s2);

    const manager = trackedManager();
    manager.init();

    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
    const orgs = graph.filter((n) => n['@type'] === 'Organization');
    expect(orgs).to.have.length(1);
    expect(orgs[0]['@id']).to.equal(ORG_ID);
    // generated baseline wins — logo is the manager default, not the producer-supplied value
    expect(orgs[0].logo).to.deep.equal(ADOBE_LOGO_OBJECT);
  });
});

// ---------------------------------------------------------------------------
// JsonLdGraphManager — output contract
// ---------------------------------------------------------------------------
describe('JsonLdGraphManager output contract', () => {
  it('emits exactly one managed script', () => {
    document.head.appendChild(makeScript({ '@type': 'Article' }));
    const manager = trackedManager();
    manager.init();
    manager.rebuild();
    expect(document.head.querySelectorAll('script[data-milo-jsonld="graph"]')).to.have.length(1);
  });

  it('managed script has @context: https://schema.org at root', () => {
    document.head.appendChild(makeScript({ '@type': 'Article' }));
    const manager = trackedManager();
    manager.init();
    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent);
    expect(graph['@context']).to.equal('https://schema.org');
  });

  it('individual nodes do not have @context', () => {
    document.head.appendChild(makeScript({ '@context': 'https://schema.org', '@type': 'Article' }));
    const manager = trackedManager();
    manager.init();
    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent);
    for (const node of graph['@graph']) {
      expect(node['@context']).to.be.undefined;
    }
  });

  it('WebPage appears first in @graph', () => {
    document.head.appendChild(makeScript({ '@type': 'Article' }));
    document.head.appendChild(makeScript({ '@type': 'WebPage' }));
    const manager = trackedManager();
    manager.init();
    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent);
    expect(graph['@graph'][0]['@type']).to.equal('WebPage');
  });
});

// ---------------------------------------------------------------------------
// JsonLdGraphManager — MutationObserver (runtime mutation)
// ---------------------------------------------------------------------------
describe('JsonLdGraphManager mutation observer', () => {
  it('picks up a script appended after init', async () => {
    const manager = trackedManager();
    manager.init();

    const script = makeScript({ '@type': 'WebPage' });
    document.head.appendChild(script);

    // Flush the microtask queue so MutationObserver fires; then rebuild directly
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((r) => setTimeout(r, 0));
    manager.rebuild();

    const managed = document.head.querySelector('script[data-milo-jsonld="graph"]');
    expect(managed).to.exist;
    const graph = JSON.parse(managed.textContent)['@graph'];
    expect(graph.some((n) => n['@type'] === 'WebPage')).to.be.true;
  });
});

// ---------------------------------------------------------------------------
// End-to-end pipeline — editorial fixture
// ---------------------------------------------------------------------------
describe('end-to-end: editorial page', () => {
  beforeEach(async () => {
    resetManager();
    document.body.innerHTML = await readFile({ path: './mocks/editorial.html' });
    // appendChild moves nodes from body to head (no s.remove() needed)
    [...document.body.querySelectorAll('script[type="application/ld+json"]')]
      .forEach((s) => document.head.appendChild(s));
  });

  afterEach(() => {
    document.body.innerHTML = '';
    resetManager();
  });

  it('produces a linked @graph for an editorial page', () => {
    const manager = trackedManager();
    manager.init();

    const managed = document.head.querySelector('script[data-milo-jsonld="graph"]');
    expect(managed).to.exist;
    const { '@graph': graph } = JSON.parse(managed.textContent);

    const webpage = graph.find((n) => n['@type'] === 'WebPage');
    const article = graph.find((n) => n['@type'] === 'Article');
    const org = graph.find((n) => n['@type'] === 'Organization');
    const bc = graph.find((n) => n['@type'] === 'BreadcrumbList');

    expect(webpage).to.exist;
    expect(article).to.exist;
    expect(org).to.exist;
    expect(bc).to.exist;

    expect(org['@id']).to.equal(ORG_ID);
    expect(webpage['@id']).to.equal(`${PAGE_URL}#webpage`);
    expect(article['@id']).to.equal(`${PAGE_URL}#article`);
    expect(bc['@id']).to.equal(`${PAGE_URL}#breadcrumb`);

    expect(webpage.mainEntity?.['@id']).to.equal(`${PAGE_URL}#article`);
    expect(webpage.breadcrumb?.['@id']).to.equal(`${PAGE_URL}#breadcrumb`);
    expect(webpage.publisher?.['@id']).to.equal(ORG_ID);
    expect(article.isPartOf?.['@id']).to.equal(`${PAGE_URL}#webpage`);
    expect(bc.isPartOf?.['@id']).to.equal(`${PAGE_URL}#webpage`);
  });
});

// ---------------------------------------------------------------------------
// End-to-end pipeline — product fixture
// ---------------------------------------------------------------------------
describe('end-to-end: product page', () => {
  beforeEach(async () => {
    resetManager();
    document.body.innerHTML = await readFile({ path: './mocks/product.html' });
    [...document.body.querySelectorAll('script[type="application/ld+json"]')]
      .forEach((s) => document.head.appendChild(s));
  });

  afterEach(() => {
    document.body.innerHTML = '';
    resetManager();
  });

  it('produces a linked @graph for a product page', () => {
    const manager = trackedManager();
    manager.init();

    const { '@graph': graph } = JSON.parse(
      document.head.querySelector('script[data-milo-jsonld="graph"]').textContent,
    );

    const webpage = graph.find((n) => n['@type'] === 'WebPage');
    const app = graph.find((n) => n['@type'] === 'SoftwareApplication');

    expect(webpage).to.exist;
    expect(app).to.exist;
    expect(webpage.mainEntity?.['@id']).to.equal(`${PAGE_URL}#softwareapplication`);
    expect(app.provider?.['@id']).to.equal(ORG_ID);
  });
});

// ---------------------------------------------------------------------------
// End-to-end pipeline — multi-producer conflict
// ---------------------------------------------------------------------------
describe('end-to-end: multi-producer conflict', () => {
  beforeEach(async () => {
    resetManager();
    document.body.innerHTML = await readFile({ path: './mocks/multi-producer.html' });
    // appendChild moves nodes from body to head without an explicit remove
    [...document.body.querySelectorAll('script[type="application/ld+json"]')]
      .forEach((s) => document.head.appendChild(s));
  });

  afterEach(() => {
    document.body.innerHTML = '';
    resetManager();
  });

  it('merges two Organization nodes into one entry', () => {
    const manager = trackedManager();
    // Enqueue first script as bootDom, second as runtime to test priority
    const allScripts = [...document.head.querySelectorAll('script[type="application/ld+json"]')];
    const orgScripts = allScripts.filter((s) => {
      try { return JSON.parse(s.textContent)['@type'] === 'Organization'; } catch { return false; }
    });

    orgScripts.forEach((s, i) => manager.enqueue(s, i === 0 ? 'bootDom' : 'runtime'));
    manager.rebuild();

    const { '@graph': graph } = JSON.parse(
      document.head.querySelector('script[data-milo-jsonld="graph"]').textContent,
    );
    const orgs = graph.filter((n) => n['@type'] === 'Organization');
    expect(orgs).to.have.length(1);
    expect(orgs[0]['@id']).to.equal(ORG_ID);
    // generated baseline wins over all producer sources
    expect(orgs[0].name).to.equal('Adobe');
    expect(orgs[0].logo).to.deep.equal(ADOBE_LOGO_OBJECT);
    // producer-only field (sameAs) is preserved
    expect(orgs[0].sameAs).to.equal('https://en.wikipedia.org/wiki/Adobe_Inc.');
  });
});

// ---------------------------------------------------------------------------
// Organization synthesis and domain selection
// ---------------------------------------------------------------------------
describe('Organization synthesis', () => {
  it('synthesizes a default Organization when none is provided', () => {
    document.head.appendChild(makeScript({ '@type': 'Article', headline: 'Hello' }));
    const manager = trackedManager();
    manager.init();

    const { '@graph': graph } = JSON.parse(
      document.head.querySelector('script[data-milo-jsonld="graph"]').textContent,
    );
    const org = graph.find((n) => n['@type'] === 'Organization');
    expect(org).to.exist;
    expect(org['@id']).to.equal(ORG_ID);
    expect(org.name).to.equal('Adobe');
    expect(org.url).to.equal('https://www.adobe.com/');
    expect(org.logo).to.deep.equal(ADOBE_LOGO_OBJECT);
  });

  it('generated baseline fields win over producer-supplied values', () => {
    document.head.appendChild(makeScript({ '@type': 'Organization', name: 'Acme', url: 'https://acme.com/', sameAs: 'https://example.com' }));
    const manager = trackedManager();
    manager.init();

    const { '@graph': graph } = JSON.parse(
      document.head.querySelector('script[data-milo-jsonld="graph"]').textContent,
    );
    const org = graph.find((n) => n['@type'] === 'Organization');
    expect(org.name).to.equal('Adobe');
    expect(org.url).to.equal('https://www.adobe.com/');
    // producer-only field preserved
    expect(org.sameAs).to.equal('https://example.com');
  });

  it('siteRoot() returns business URL for business/bacom hostnames', () => {
    expect(siteRoot('business.adobe.com')).to.equal('https://business.adobe.com');
    expect(siteRoot('bacom.adobe.com')).to.equal('https://business.adobe.com');
    expect(siteRoot('www.adobe.com')).to.equal('https://www.adobe.com');
    expect(siteRoot('localhost')).to.equal('https://www.adobe.com');
  });

  it('defaultOrg() returns correct values for business hostname', () => {
    const org = defaultOrg('business.adobe.com');
    expect(org.name).to.equal('Adobe for Business');
    expect(org['@id']).to.equal('https://business.adobe.com/#organization');
    expect(org.url).to.equal('https://business.adobe.com/');
    expect(org.logo).to.deep.equal(ADOBE_LOGO_OBJECT);
  });
});

// ---------------------------------------------------------------------------
// extractInlineEntities
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Type transform: Product → SoftwareApplication
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Inline Offer hoisting (extractInlineEntities array handling)
// ---------------------------------------------------------------------------
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
    expect(extracted[0]['@id']).to.equal(`${PAGE_URL}#offer`);
    expect(extracted[0].price).to.equal('19.99');
    expect(node.offers).to.deep.equal([{ '@id': `${PAGE_URL}#offer` }]);
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

// ---------------------------------------------------------------------------
// Brand stays inline (not in RULES)
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// canonicalizeOrgId — defensive #org → #organization rewrite
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// BreadcrumbList "when applicable"
// ---------------------------------------------------------------------------
describe('graph without BreadcrumbList', () => {
  it('produces a valid graph without breadcrumb property on WebPage', () => {
    document.head.appendChild(makeScript({
      '@type': 'Article',
      headline: 'No breadcrumbs here',
    }));
    const manager = trackedManager();
    manager.init();

    const { '@graph': graph } = JSON.parse(
      document.head.querySelector('script[data-milo-jsonld="graph"]').textContent,
    );
    expect(graph.some((n) => n['@type'] === 'BreadcrumbList')).to.be.false;
    const webpage = graph.find((n) => n['@type'] === 'WebPage');
    expect(webpage.breadcrumb).to.be.undefined;
    // Article still links back to WebPage; Organization synthesized.
    expect(graph.some((n) => n['@type'] === 'Organization')).to.be.true;
    expect(graph.some((n) => n['@type'] === 'Article')).to.be.true;
  });
});

// ---------------------------------------------------------------------------
// End-to-end: merch-card-style Product transformation
// ---------------------------------------------------------------------------
describe('end-to-end: merch-card Product transformation', () => {
  beforeEach(async () => {
    resetManager();
    setCanonical();
    const html = await readFile({ path: './mocks/merch-card.html' });
    const tpl = document.createElement('template');
    tpl.innerHTML = html;
    [...tpl.content.querySelectorAll('script[type="application/ld+json"]')].forEach((s) => {
      document.head.appendChild(s);
    });
  });

  it('converts Product → SoftwareApplication, hoists Offer, keeps Brand inline, canonicalizes seller', () => {
    const manager = trackedManager();
    manager.init();
    const { '@graph': graph } = JSON.parse(
      document.head.querySelector('script[data-milo-jsonld="graph"]').textContent,
    );

    expect(graph.some((n) => n['@type'] === 'Product')).to.be.false;

    const sa = graph.find((n) => n['@type'] === 'SoftwareApplication');
    expect(sa).to.exist;
    expect(sa['@id']).to.equal(`${PAGE_URL}#softwareapplication`);
    expect(sa.name).to.equal('Photoshop');
    expect(sa.brand).to.deep.equal({ '@type': 'Brand', name: 'Adobe' });
    expect(sa.image).to.have.length(2);
    expect(sa.offers).to.deep.equal([{ '@id': `${PAGE_URL}#offer` }]);

    const offer = graph.find((n) => n['@type'] === 'Offer');
    expect(offer).to.exist;
    expect(offer['@id']).to.equal(`${PAGE_URL}#offer`);
    expect(offer.price).to.equal('662.9');
    expect(offer.priceCurrency).to.equal('USD');
    expect(offer.priceSpecification).to.exist;
    // Seller alias #org canonicalized to #organization.
    expect(offer.seller).to.deep.equal({ '@id': ORG_ID });
  });
});

// ---------------------------------------------------------------------------
// SoftwareApplication subtype preservation (WebApplication, MobileApplication, VideoGame)
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// rewriteCrossPageRefs (policy C: cross-page WebPage references collapse to current canonical)
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// injectLinks: subtype-aware lookup for mainEntity and linksBack
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// AggregateRating extraction (singleton, hoisted from inline values)
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// AggregateRating quality thresholds (Milo policy, not Google)
// ---------------------------------------------------------------------------
describe('AggregateRating quality thresholds', () => {
  it('aggregateRatingMeetsThresholds passes when both ratingValue >= 3.2 and ratingCount >= 100', () => {
    expect(aggregateRatingMeetsThresholds({ ratingValue: '4.5', ratingCount: '100' })).to.be.true;
    expect(aggregateRatingMeetsThresholds({ ratingValue: '3.2', ratingCount: '100' })).to.be.true;
    expect(aggregateRatingMeetsThresholds({ ratingValue: 4.5, ratingCount: 100 })).to.be.true;
  });

  it('aggregateRatingMeetsThresholds fails when ratingValue is below 3.2', () => {
    expect(aggregateRatingMeetsThresholds({ ratingValue: '3.1', ratingCount: '500' })).to.be.false;
    expect(aggregateRatingMeetsThresholds({ ratingValue: '1.0', ratingCount: '10000' })).to.be.false;
  });

  it('aggregateRatingMeetsThresholds fails when ratingCount is below 100', () => {
    expect(aggregateRatingMeetsThresholds({ ratingValue: '4.9', ratingCount: '99' })).to.be.false;
    expect(aggregateRatingMeetsThresholds({ ratingValue: '5.0', ratingCount: '1' })).to.be.false;
  });

  it('aggregateRatingMeetsThresholds fails on missing or non-numeric fields', () => {
    expect(aggregateRatingMeetsThresholds({ ratingValue: '4.5' })).to.be.false;
    expect(aggregateRatingMeetsThresholds({ ratingCount: '500' })).to.be.false;
    expect(aggregateRatingMeetsThresholds({ ratingValue: 'high', ratingCount: '500' })).to.be.false;
    expect(aggregateRatingMeetsThresholds(null)).to.be.false;
    expect(aggregateRatingMeetsThresholds(undefined)).to.be.false;
  });

  it('end-to-end: AggregateRating with ratingValue 2.5 is omitted from the graph', () => {
    document.head.appendChild(makeScript({
      '@type': 'WebApplication',
      '@id': `${PAGE_URL}#webapplication`,
      name: 'Low-rated app',
      aggregateRating: { '@type': 'AggregateRating', ratingValue: '2.5', ratingCount: '5000' },
    }));
    const manager = trackedManager();
    manager.init();
    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
    // No AggregateRating node in the graph.
    expect(graph.find((n) => n['@type'] === 'AggregateRating')).to.not.exist;
    // The SA reference to aggregateRating is removed (no dangling @id).
    const app = graph.find((n) => n['@id'] === `${PAGE_URL}#softwareapplication`);
    expect(app.aggregateRating).to.be.undefined;
  });

  it('end-to-end: AggregateRating with ratingCount 50 is omitted from the graph', () => {
    document.head.appendChild(makeScript({
      '@type': 'SoftwareApplication',
      name: 'Niche tool',
      aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', ratingCount: '50' },
    }));
    const manager = trackedManager();
    manager.init();
    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
    expect(graph.find((n) => n['@type'] === 'AggregateRating')).to.not.exist;
    const app = graph.find((n) => n['@id'] === `${PAGE_URL}#softwareapplication`);
    expect(app.aggregateRating).to.be.undefined;
  });

  it('end-to-end: AggregateRating meeting both thresholds is emitted normally', () => {
    document.head.appendChild(makeScript({
      '@type': 'SoftwareApplication',
      name: 'Healthy app',
      aggregateRating: { '@type': 'AggregateRating', ratingValue: '3.2', ratingCount: '100' },
    }));
    const manager = trackedManager();
    manager.init();
    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
    const rating = graph.find((n) => n['@type'] === 'AggregateRating');
    expect(rating).to.exist;
    expect(rating['@id']).to.equal(`${PAGE_URL}#aggregaterating`);
    const app = graph.find((n) => n['@id'] === `${PAGE_URL}#softwareapplication`);
    expect(app.aggregateRating).to.deep.equal({ '@id': `${PAGE_URL}#aggregaterating` });
  });
});

// ---------------------------------------------------------------------------
// softwareapplication-default-offer (synthesize free Offer for primary SA)
// ---------------------------------------------------------------------------
describe('SoftwareApplication default Offer synthesis', () => {
  it('synthesizes a free Offer when SoftwareApplication is present without offers', () => {
    document.head.appendChild(makeScript({
      '@type': 'SoftwareApplication',
      name: 'Photoshop',
    }));
    const manager = trackedManager();
    manager.init();
    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
    const offer = graph.find((n) => n['@type'] === 'Offer');
    expect(offer).to.exist;
    expect(offer['@id']).to.equal(`${PAGE_URL}#offer`);
    expect(offer.price).to.equal('0');
    expect(offer.priceCurrency).to.equal('USD');
    expect(offer.availability).to.equal('https://schema.org/InStock');
    expect(offer.category).to.equal('Free Trial');
    const app = graph.find((n) => n['@id'] === `${PAGE_URL}#softwareapplication`);
    expect(app.offers).to.deep.equal([{ '@id': `${PAGE_URL}#offer` }]);
  });

  it('synthesizes the default Offer for WebApplication (SA subtype) lacking offers', () => {
    document.head.appendChild(makeScript({
      '@type': 'WebApplication',
      '@id': `${PAGE_URL}#webapplication`,
      name: 'Compress PDF',
    }));
    const manager = trackedManager();
    manager.init();
    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
    const offer = graph.find((n) => n['@type'] === 'Offer');
    expect(offer).to.exist;
    expect(offer.price).to.equal('0');
    const app = graph.find((n) => n['@id'] === `${PAGE_URL}#softwareapplication`);
    expect(app['@type']).to.equal('WebApplication');
    expect(app.offers).to.deep.equal([{ '@id': `${PAGE_URL}#offer` }]);
  });

  it('does NOT synthesize a default Offer when SoftwareApplication already supplies offers', () => {
    document.head.appendChild(makeScript({
      '@type': 'SoftwareApplication',
      name: 'Photoshop',
      offers: [
        {
          '@type': 'Offer',
          '@id': `${PAGE_URL}#paid`,
          price: '19.99',
          priceCurrency: 'USD',
        },
      ],
    }));
    const manager = trackedManager();
    manager.init();
    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
    const offers = graph.filter((n) => n['@type'] === 'Offer');
    // Only the producer's offer exists; no synthesized free Offer.
    expect(offers).to.have.length(1);
    expect(offers[0]['@id']).to.equal(`${PAGE_URL}#paid`);
    expect(offers[0].price).to.equal('19.99');
    const app = graph.find((n) => n['@id'] === `${PAGE_URL}#softwareapplication`);
    expect(app.offers).to.deep.equal([{ '@id': `${PAGE_URL}#paid` }]);
  });

  it('does NOT synthesize a default Offer when no SoftwareApplication is present', () => {
    document.head.appendChild(makeScript({
      '@type': 'Article',
      headline: 'Hello',
    }));
    const manager = trackedManager();
    manager.init();
    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
    expect(graph.find((n) => n['@type'] === 'Offer')).to.not.exist;
  });

  it('synthesizes the default Offer when SoftwareApplication.offers is an empty array', () => {
    document.head.appendChild(makeScript({
      '@type': 'SoftwareApplication',
      name: 'Photoshop',
      offers: [],
    }));
    const manager = trackedManager();
    manager.init();
    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
    const offer = graph.find((n) => n['@type'] === 'Offer');
    expect(offer).to.exist;
    expect(offer.price).to.equal('0');
    const app = graph.find((n) => n['@id'] === `${PAGE_URL}#softwareapplication`);
    expect(app.offers).to.deep.equal([{ '@id': `${PAGE_URL}#offer` }]);
  });

  it('preserves distinct producer fragments (#paid, #free-trial) — repeatable-types rule', () => {
    document.head.appendChild(makeScript({
      '@type': 'SoftwareApplication',
      name: 'Photoshop',
      offers: [
        { '@type': 'Offer', '@id': 'https://producer.example/path#paid', price: '19.99', priceCurrency: 'USD' },
        { '@type': 'Offer', '@id': 'https://producer.example/path#free-trial', price: '0.00', priceCurrency: 'USD' },
      ],
    }));
    const manager = trackedManager();
    manager.init();
    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
    const offers = graph.filter((n) => n['@type'] === 'Offer');
    expect(offers).to.have.length(2);
    const ids = offers.map((o) => o['@id']).sort();
    // Producer fragments preserved; URL prefix canonicalized to current page.
    expect(ids).to.deep.equal([`${PAGE_URL}#free-trial`, `${PAGE_URL}#paid`]);
    const app = graph.find((n) => n['@id'] === `${PAGE_URL}#softwareapplication`);
    expect(app.offers).to.deep.equal([
      { '@id': `${PAGE_URL}#paid` },
      { '@id': `${PAGE_URL}#free-trial` },
    ]);
  });
});

// ---------------------------------------------------------------------------
// canonicalizeBreadcrumbItems (rewrite item URLs to canonical production origin)
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// ignore-types bypass (jsonld-graph-manager-ignore query param)
// ---------------------------------------------------------------------------
describe('ignore-types bypass', () => {
  it('parseIgnoreParam: empty / absent / whitespace yields empty Set', () => {
    expect(parseIgnoreParam('')).to.deep.equal(new Set());
    expect(parseIgnoreParam('?jsonld-graph-manager-ignore=')).to.deep.equal(new Set());
    expect(parseIgnoreParam('?jsonld-graph-manager-ignore= , ,')).to.deep.equal(new Set());
  });

  it('parseIgnoreParam: trims, lowercases, and drops empty entries', () => {
    const set = parseIgnoreParam('?jsonld-graph-manager-ignore=BreadcrumbList, FAQPage ,,howto,');
    expect(set).to.deep.equal(new Set(['breadcrumblist', 'faqpage', 'howto']));
  });

  it('shouldIgnoreScript returns false when ignoreTypes is empty', () => {
    const script = makeScript({ '@type': 'BreadcrumbList', itemListElement: [] });
    expect(shouldIgnoreScript(script, new Set())).to.be.false;
  });

  it('shouldIgnoreScript matches single-node @type case-insensitively', () => {
    const script = makeScript({ '@type': 'BreadcrumbList', itemListElement: [] });
    expect(shouldIgnoreScript(script, new Set(['breadcrumblist']))).to.be.true;
    expect(shouldIgnoreScript(script, new Set(['BREADCRUMBLIST']))).to.be.false;
    // BREADCRUMBLIST in the ignore Set wouldn't match because the Set holds the user-supplied
    // value verbatim; parseIgnoreParam is what does the lowercasing. Test via parseIgnoreParam.
    expect(shouldIgnoreScript(script, parseIgnoreParam('?jsonld-graph-manager-ignore=BREADCRUMBLIST'))).to.be.true;
  });

  it('shouldIgnoreScript matches the @graph pseudo-type or any nested @type', () => {
    const script = makeScript({ '@context': 'https://schema.org', '@graph': [{ '@type': 'SoftwareApplication', name: 'X' }] });
    // 'graph' pseudo-type matches the wrapper directly.
    expect(shouldIgnoreScript(script, new Set(['graph']))).to.be.true;
    // Type-name matching recurses into the @graph contents — SA inside the wrapper
    // matches an 'softwareapplication' ignore even when 'graph' is not listed.
    expect(shouldIgnoreScript(script, new Set(['softwareapplication']))).to.be.true;
    // An ignore-list entry that does NOT appear anywhere in the script is a no-match.
    expect(shouldIgnoreScript(script, new Set(['breadcrumblist']))).to.be.false;
  });

  it('shouldIgnoreScript: type-name matching recurses through a top-level array containing a wrapper (real-world DA Express case)', () => {
    // Real-world: [{@context, @graph: [WebPage, SoftwareApplication, BreadcrumbList, ...]}]
    const script = makeScript([
      { '@context': 'https://schema.org', '@graph': [{ '@type': 'WebPage' }, { '@type': 'SoftwareApplication' }, { '@type': 'BreadcrumbList' }] },
    ]);
    // 'graph' matches the wrapper.
    expect(shouldIgnoreScript(script, new Set(['graph']))).to.be.true;
    // 'webpage' matches the nested WebPage even though it's inside the wrapper.
    expect(shouldIgnoreScript(script, new Set(['webpage']))).to.be.true;
    // 'breadcrumblist' likewise.
    expect(shouldIgnoreScript(script, new Set(['breadcrumblist']))).to.be.true;
    // A type not present anywhere is a no-match.
    expect(shouldIgnoreScript(script, new Set(['faqpage']))).to.be.false;
  });

  it('shouldIgnoreScript matches an item that carries both @type and @graph (mixed warning)', () => {
    const lanaSpy = sinon.spy();
    const previousLana = window.lana;
    window.lana = { log: lanaSpy };
    try {
      const script = makeScript({ '@type': 'WebPage', name: 'P', '@graph': [{ '@type': 'Article' }] });
      // Ignoring 'webpage' alone matches the @type id but not the 'graph' id → mixed → warn.
      expect(shouldIgnoreScript(script, new Set(['webpage']))).to.be.true;
      const warnCall = lanaSpy.getCalls().find((c) => c.args[1]?.severity === 'warn');
      expect(warnCall, 'expected mixed-types Lana warn').to.exist;
      // Ignoring both 'graph' and 'webpage' — no mixed warning.
      lanaSpy.resetHistory();
      expect(shouldIgnoreScript(script, new Set(['webpage', 'graph']))).to.be.true;
      const warnCall2 = lanaSpy.getCalls().find((c) => c.args[1]?.severity === 'warn');
      expect(warnCall2, 'no warn when all ids match').to.not.exist;
    } finally {
      window.lana = previousLana;
    }
  });

  it('shouldIgnoreScript returns false on unparseable JSON', () => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = '{ this is not JSON';
    expect(shouldIgnoreScript(script, new Set(['breadcrumblist']))).to.be.false;
  });

  it('end-to-end: ignored single-type script remains in the DOM and is absent from managed graph', () => {
    const bcScript = makeScript({
      '@type': 'BreadcrumbList',
      itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.adobe.com/' }],
    });
    document.head.appendChild(bcScript);
    const manager = trackedManager({ ignoreTypes: new Set(['breadcrumblist']) });
    manager.init();
    // Producer script preserved verbatim.
    expect(document.head.contains(bcScript)).to.be.true;
    // Managed graph contains no BreadcrumbList node.
    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
    expect(graph.find((n) => n['@type'] === 'BreadcrumbList')).to.not.exist;
  });

  it('end-to-end: ignoring one type does not affect siblings — Article still ingested', () => {
    const bcScript = makeScript({ '@type': 'BreadcrumbList', itemListElement: [] });
    const articleScript = makeScript({ '@type': 'Article', headline: 'Hello' });
    document.head.appendChild(bcScript);
    document.head.appendChild(articleScript);
    const manager = trackedManager({ ignoreTypes: new Set(['breadcrumblist']) });
    manager.init();
    expect(document.head.contains(bcScript)).to.be.true;
    // Article was a normal producer: script removed, node ingested.
    expect(document.head.contains(articleScript)).to.be.false;
    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
    expect(graph.find((n) => n['@type'] === 'Article')).to.exist;
  });

  it('end-to-end: @graph container ignored when list contains \'graph\'', () => {
    const graphScript = makeScript({
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'SoftwareApplication', '@id': `${PAGE_URL}#softwareapplication`, name: 'Bypassed' },
      ],
    });
    document.head.appendChild(graphScript);
    const manager = trackedManager({ ignoreTypes: new Set(['graph']) });
    manager.init();
    expect(document.head.contains(graphScript)).to.be.true;
    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
    // The nested SoftwareApplication did NOT enter the managed graph.
    expect(graph.find((n) => n['@type'] === 'SoftwareApplication')).to.not.exist;
  });

  it('mixed-type script with one ignored type skips whole script and warns via Lana', () => {
    const lanaSpy = sinon.spy();
    const previousLana = window.lana;
    window.lana = { log: lanaSpy };
    try {
      const mixedScript = makeScript([
        { '@type': 'Article', headline: 'Kept' },
        { '@type': 'BreadcrumbList', itemListElement: [] },
      ]);
      document.head.appendChild(mixedScript);
      const manager = trackedManager({ ignoreTypes: new Set(['breadcrumblist']) });
      manager.init();
      // Whole script preserved.
      expect(document.head.contains(mixedScript)).to.be.true;
      // Article did NOT make it into the managed graph (whole-script bypass).
      const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
      expect(graph.find((n) => n['@type'] === 'Article')).to.not.exist;
      // Lana warning fired.
      const warnCall = lanaSpy.getCalls().find((c) => c.args[1]?.severity === 'warn');
      expect(warnCall, 'expected a Lana warn-severity log').to.exist;
      expect(warnCall.args[0]).to.match(/mixed types/i);
    } finally {
      window.lana = previousLana;
    }
  });

  it('runtime path (MutationObserver simulation): runtime-ingested ignored script is bypassed', () => {
    const manager = trackedManager({ ignoreTypes: new Set(['faqpage']) });
    manager.init();
    const faqScript = makeScript({ '@type': 'FAQPage', mainEntity: [] });
    document.head.appendChild(faqScript);
    // Simulate the MutationObserver path explicitly.
    manager.enqueue(faqScript, 'runtime');
    manager.rebuild();
    expect(document.head.contains(faqScript)).to.be.true;
    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
    expect(graph.find((n) => n['@type'] === 'FAQPage')).to.not.exist;
  });
});

// ---------------------------------------------------------------------------
// Recursive flatten: graph wrappers nested inside arrays do not leak into output
// ---------------------------------------------------------------------------
describe('end-to-end: graph wrapper inside array script', () => {
  it('does not emit a wrapper node and ingests inner content correctly', () => {
    document.head.appendChild(makeScript([
      { '@type': 'Article', headline: 'Outer article' },
      { '@context': 'https://schema.org', '@graph': [{ '@type': 'VideoObject', name: 'Inner video' }] },
    ]));
    const manager = trackedManager();
    manager.init();
    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
    // No managed node carries a residual @graph property.
    expect(graph.some((n) => '@graph' in n), 'no embedded graph wrapper in output').to.be.false;
    // Inner VideoObject is present as a top-level node.
    expect(graph.find((n) => n['@type'] === 'VideoObject')).to.exist;
    expect(graph.find((n) => n['@type'] === 'Article')).to.exist;
  });
});

// ---------------------------------------------------------------------------
// Real-world DA Express scenario: producer ships [{@graph:[...]}] and user
// ignores 'graph' → manager must NOT ingest any of the wrapped nodes.
// ---------------------------------------------------------------------------
describe('end-to-end: ignore=graph against an array-wrapped pre-baked graph', () => {
  it('bypasses the wrapped script entirely; baseline graph still synthesized', () => {
    document.head.appendChild(makeScript([
      {
        '@context': 'https://schema.org',
        '@graph': [
          { '@type': 'WebPage', '@id': `${PAGE_URL}#webpage`, name: 'Producer WP' },
          { '@type': 'SoftwareApplication', '@id': `${PAGE_URL}#softwareapplication`, name: 'Bypassed App' },
          { '@type': 'BreadcrumbList', '@id': `${PAGE_URL}#breadcrumb`, itemListElement: [] },
          { '@type': 'FAQPage', '@id': `${PAGE_URL}#faq`, mainEntity: [] },
        ],
      },
    ]));
    const manager = trackedManager({ ignoreTypes: new Set(['graph']) });
    manager.init();
    const managed = document.head.querySelector('script[data-milo-jsonld="graph"]');
    expect(managed).to.exist;
    const graph = JSON.parse(managed.textContent)['@graph'];
    // None of the producer's wrapped nodes leaked in.
    expect(graph.find((n) => n.name === 'Producer WP')).to.not.exist;
    expect(graph.find((n) => n.name === 'Bypassed App')).to.not.exist;
    expect(graph.find((n) => n['@type'] === 'FAQPage')).to.not.exist;
    // Baseline still synthesized.
    expect(graph.find((n) => n['@type'] === 'WebPage' && !n.name)).to.exist;
    expect(graph.find((n) => n['@type'] === 'Organization')).to.exist;
  });

  it('bypasses a wrapped script when a NESTED @type matches the ignore list (recursive type matching)', () => {
    // Producer ships a pre-baked graph that contains BreadcrumbList nested inside @graph.
    // User passes ignore=breadcrumblist without 'graph' — should still bypass the wrapper.
    document.head.appendChild(makeScript([
      {
        '@context': 'https://schema.org',
        '@graph': [
          { '@type': 'WebPage', '@id': `${PAGE_URL}#webpage`, name: 'Wrapped WP' },
          { '@type': 'BreadcrumbList', '@id': `${PAGE_URL}#breadcrumb`, itemListElement: [] },
        ],
      },
    ]));
    const lanaSpy = sinon.spy();
    const previousLana = window.lana;
    window.lana = { log: lanaSpy };
    try {
      const manager = trackedManager({ ignoreTypes: new Set(['breadcrumblist']) });
      manager.init();
      const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
      // No wrapped nodes ingested (script bypassed).
      expect(graph.find((n) => n.name === 'Wrapped WP')).to.not.exist;
      expect(graph.find((n) => n['@type'] === 'BreadcrumbList')).to.not.exist;
      // Mixed-types warning fired because WebPage was also bypassed but not on the list.
      const warnCall = lanaSpy.getCalls().find((c) => c.args[1]?.severity === 'warn');
      expect(warnCall, 'expected mixed-types Lana warn').to.exist;
      expect(warnCall.args[0]).to.match(/breadcrumblist/);
      expect(warnCall.args[0]).to.match(/webpage/);
    } finally {
      window.lana = previousLana;
    }
  });
});
