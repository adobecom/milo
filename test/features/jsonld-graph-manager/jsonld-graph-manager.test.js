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
  siteRoot,
  defaultOrg,
  JsonLdGraphManager,
} from '../../../libs/features/jsonld-graph-manager.js';

const PAGE_URL = 'https://www.adobe.com/products/photoshop.html';
const ORG_ID = 'https://www.adobe.com/#organization'; // www default

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
  window.miloJsonLdGraphManager = null;
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

  it('does not emit a managed script when graph is empty', () => {
    const manager = trackedManager();
    manager.init();
    expect(document.head.querySelector('script[data-milo-jsonld="graph"]')).to.not.exist;
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
    expect(orgs[0].logo).to.equal('https://www.adobe.com/favicon.ico');
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
    expect(orgs[0].logo).to.equal('https://www.adobe.com/favicon.ico');
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
    expect(org.logo).to.equal('https://www.adobe.com/favicon.ico');
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
    expect(org.logo).to.equal('https://business.adobe.com/favicon.ico');
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

  it('leaves inline objects that already have @id untouched', () => {
    const node = {
      '@type': 'Article',
      publisher: { '@type': 'Organization', '@id': ORG_ID },
    };
    const extracted = extractInlineEntities(node);
    expect(extracted).to.have.length(0);
    expect(node.publisher['@id']).to.equal(ORG_ID);
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
