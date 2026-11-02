// JsonLdGraphManager lifecycle, synthesis, thresholds, and ignore bypass.
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { readFile } from '@web/test-runner-commands';

import initJsonLd, {
  aggregateRatingMeetsThresholds,
  shouldIgnoreScript,
  parseIgnoreParam,
  siteRoot,
  defaultOrg,
} from '../../../libs/features/jsonld-graph-manager/jsonld-graph-manager.js';
import {
  setupSuite,
  PAGE_URL,
  ORG_ID,
  ADOBE_LOGO_OBJECT,
  makeScript,
  trackedManager,
  resetManager,
  setCanonical,
  getManagedGraph,
} from './helpers.js';

setupSuite();

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

  it('uses the captured boot text when the source changes before initialization', () => {
    const script = makeScript({ '@type': 'Article', headline: 'Captured' });
    document.head.appendChild(script);
    const bootScripts = [{ scriptEl: script, textContent: script.textContent }];
    script.textContent = JSON.stringify({ '@type': 'Article', headline: 'Changed' });

    const manager = trackedManager({ bootScripts });
    manager.init();

    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
    expect(graph.find((node) => node['@type'] === 'Article').headline).to.equal('Captured');
  });

  it('treats scripts added after the boot snapshot as runtime producers', () => {
    const bootScript = makeScript({ '@type': 'Article', headline: 'Boot' });
    document.head.appendChild(bootScript);
    const bootScripts = [{ scriptEl: bootScript, textContent: bootScript.textContent }];
    document.head.appendChild(makeScript({ '@type': 'Article', headline: 'Runtime' }));

    const manager = trackedManager({ bootScripts });
    manager.init();

    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
    expect(graph.find((node) => node['@type'] === 'Article').headline).to.equal('Runtime');
  });
});

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
    expect(orgs[0].logo).to.equal('logo.png');
  });
});

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

describe('JsonLdGraphManager failure handling', () => {
  it('keeps malformed JSON-LD while processing valid sibling scripts', () => {
    const malformed = makeScript('{not-json');
    const valid = makeScript({ '@type': 'Article', headline: 'Valid' });
    document.head.append(malformed, valid);
    const consoleStub = sinon.stub(console, 'error');
    try {
      const manager = trackedManager();
      manager.init();

      expect(document.head.contains(malformed)).to.be.true;
      expect(document.head.contains(valid)).to.be.false;
      const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
      expect(graph.find((node) => node['@type'] === 'Article').headline).to.equal('Valid');
    } finally {
      consoleStub.restore();
    }
  });

  it('preserves the previous graph and source script when a rebuild fails', () => {
    document.head.appendChild(makeScript({ '@type': 'Article', headline: 'Stable' }));
    const manager = trackedManager();
    manager.init();
    const managed = document.head.querySelector('script[data-milo-jsonld="graph"]');
    const previousGraph = managed.textContent;
    const next = makeScript({ '@type': 'Article', headline: 'Next' });
    document.head.appendChild(next);
    manager.enqueue(next, 'runtime');
    const replaceStub = sinon.stub(managed, 'replaceWith').throws(new Error('write failed'));
    const consoleStub = sinon.stub(console, 'error');
    try {
      expect(manager.rebuild()).to.be.false;
      expect(managed.textContent).to.equal(previousGraph);
      expect(document.head.contains(next)).to.be.true;
      expect(manager.graph.get(`${PAGE_URL}#article`).headline).to.equal('Stable');
    } finally {
      replaceStub.restore();
      consoleStub.restore();
    }
  });

  it('does not publish the global manager after a failed initial rebuild', async () => {
    const script = makeScript({ '@type': 'Article', headline: 'Initial' });
    document.head.appendChild(script);
    const appendStub = sinon.stub(document.head, 'appendChild').throws(new Error('write failed'));
    const consoleStub = sinon.stub(console, 'error');
    let error;
    try {
      await initJsonLd({ bootScripts: [{ scriptEl: script, textContent: script.textContent }] });
    } catch (caught) {
      error = caught;
    } finally {
      appendStub.restore();
      consoleStub.restore();
    }
    expect(error).to.be.an('error');
    expect(window.miloJsonLd.manager).to.not.exist;
    expect(document.head.contains(script)).to.be.true;
    expect(document.head.querySelector('script[data-milo-jsonld="graph"]')).to.not.exist;
  });
});

describe('repeatable producer entities', () => {
  it('preserves multiple anonymous Events and their Offers with distinct stable IDs', () => {
    document.head.append(
      makeScript({
        '@type': 'Event',
        name: 'Event One',
        startDate: '2026-01-01',
        offers: { '@type': 'Offer', url: 'https://example.com/events/one', price: '10', priceCurrency: 'USD' },
      }),
      makeScript({
        '@type': 'Event',
        name: 'Event Two',
        startDate: '2026-02-01',
        offers: { '@type': 'Offer', url: 'https://example.com/events/two', price: '20', priceCurrency: 'USD' },
      }),
    );
    const manager = trackedManager();
    manager.init();

    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
    const events = graph.filter((node) => node['@type'] === 'Event');
    const offers = graph.filter((node) => node['@type'] === 'Offer');
    expect(events).to.have.length(2);
    expect(offers).to.have.length(2);
    expect(new Set(events.map((node) => node['@id'])).size).to.equal(2);
    expect(new Set(offers.map((node) => node['@id'])).size).to.equal(2);
    expect(new Set(events.map((node) => node.offers['@id'])).size).to.equal(2);
  });
});

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
    expect(orgs[0].name).to.equal('Adobe Inc.');
    expect(orgs[0].logo).to.deep.equal(ADOBE_LOGO_OBJECT);
    expect(orgs[0].sameAs).to.equal('https://en.wikipedia.org/wiki/Adobe_Inc.');
  });
});

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

  it('uses generated baseline fields only when producers omit them', () => {
    document.head.appendChild(makeScript({ '@type': 'Organization', name: 'Acme', url: 'https://acme.com/', sameAs: 'https://example.com' }));
    const manager = trackedManager();
    manager.init();

    const { '@graph': graph } = JSON.parse(
      document.head.querySelector('script[data-milo-jsonld="graph"]').textContent,
    );
    const org = graph.find((n) => n['@type'] === 'Organization');
    expect(org.name).to.equal('Acme');
    expect(org.url).to.equal('https://acme.com/');
    expect(org.logo).to.deep.equal(ADOBE_LOGO_OBJECT);
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

  it('uses the canonical hostname for the generated Organization identity', () => {
    setCanonical('https://business.adobe.com/products.html');
    try {
      const manager = trackedManager();
      manager.init();
      const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
      const org = graph.find((node) => node['@type'] === 'Organization');
      expect(org['@id']).to.equal('https://business.adobe.com/#organization');
      expect(org.url).to.equal('https://business.adobe.com/');
      expect(org.name).to.equal('Adobe for Business');
    } finally {
      setCanonical();
    }
  });
});

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

describe('AggregateRating quality thresholds', () => {
  it('aggregateRatingMeetsThresholds passes when both ratingValue >= 4.0 and ratingCount >= 100', () => {
    expect(aggregateRatingMeetsThresholds({ ratingValue: '4.5', ratingCount: '100' })).to.be.true;
    expect(aggregateRatingMeetsThresholds({ ratingValue: '4.0', ratingCount: '100' })).to.be.true;
    expect(aggregateRatingMeetsThresholds({ ratingValue: 4.5, ratingCount: 100 })).to.be.true;
  });

  it('aggregateRatingMeetsThresholds fails when ratingValue is below 4.0', () => {
    expect(aggregateRatingMeetsThresholds({ ratingValue: '3.9', ratingCount: '500' })).to.be.false;
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
      aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.0', ratingCount: '100' },
    }));
    const manager = trackedManager();
    manager.init();
    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
    expect(graph.find((n) => n['@type'] === 'AggregateRating')).to.not.exist;
    const app = graph.find((n) => n['@id'] === `${PAGE_URL}#softwareapplication`);
    expect(app.aggregateRating).to.deep.equal({
      '@type': 'AggregateRating',
      ratingValue: '4.0',
      ratingCount: '100',
    });
  });
});

describe('SoftwareApplication default Offer synthesis', () => {
  it('transforms an offer-less Product and serializes the fallback Offer with exact fields', () => {
    document.head.appendChild(makeScript({
      '@type': 'Product',
      name: 'Photoshop',
    }));
    const manager = trackedManager();
    manager.init();
    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
    expect(graph.find((n) => n['@type'] === 'Offer')).to.not.exist;
    const app = graph.find((n) => n['@id'] === `${PAGE_URL}#softwareapplication`);
    expect(app.offers).to.deep.equal([{
      '@type': 'Offer',
      price: '0',
      availability: 'https://schema.org/InStock',
    }]);
    expect(app['@type']).to.equal('SoftwareApplication');
    expect(manager.graph.has(`${PAGE_URL}#offer`)).to.be.false;
    expect(manager.sources.has(`${PAGE_URL}#offer`)).to.be.false;
    expect(manager.graph.get(`${PAGE_URL}#softwareapplication`).offers).to.be.undefined;
  });

  it('serializes the fallback Offer when offers is an empty array', () => {
    document.head.appendChild(makeScript({
      '@type': 'SoftwareApplication',
      name: 'Photoshop',
      offers: [],
    }));
    const manager = trackedManager();
    manager.init();
    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
    const app = graph.find((n) => n['@id'] === `${PAGE_URL}#softwareapplication`);
    expect(app.offers).to.deep.equal([{ '@type': 'Offer', price: '0', availability: 'https://schema.org/InStock' }]);
    expect(graph.find((n) => n['@type'] === 'Offer')).to.not.exist;
    expect(manager.graph.get(`${PAGE_URL}#softwareapplication`).offers).to.deep.equal([]);
  });

  it('serializes the fallback Offer for a supported SoftwareApplication subtype', () => {
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
    expect(app.offers).to.deep.equal([{ '@type': 'Offer', price: '0', availability: 'https://schema.org/InStock' }]);
    expect(graph.find((n) => n['@type'] === 'Offer')).to.not.exist;
  });

  it('preserves producer-supplied Offers without generating a fallback', () => {
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
    expect(graph.filter((n) => n['@type'] === 'Offer')).to.have.length(0);
    const app = graph.find((n) => n['@id'] === `${PAGE_URL}#softwareapplication`);
    expect(app.offers).to.deep.equal([{ '@type': 'Offer', price: '19.99', priceCurrency: 'USD' }]);
  });

  it('does not generate or attach an Offer when no application exists', () => {
    document.head.append(
      makeScript({ '@type': 'Article', headline: 'Hello' }),
      makeScript({
        '@type': 'Offer',
        '@id': `${PAGE_URL}#standalone`,
        price: '5',
        priceCurrency: 'USD',
      }),
    );
    const manager = trackedManager();
    manager.init();
    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
    const offers = graph.filter((n) => n['@type'] === 'Offer');
    expect(offers).to.have.length(1);
    expect(offers[0]['@id']).to.equal(`${PAGE_URL}#standalone`);
    expect(graph.find((n) => ['SoftwareApplication', 'WebApplication', 'MobileApplication', 'VideoGame'].includes(n['@type']))).to.not.exist;
  });

  it('preserves an unrelated node and its references without a fallback ID collision', () => {
    document.head.append(
      makeScript({
        '@type': 'SoftwareApplication',
        name: 'Photoshop',
      }),
      makeScript({
        '@type': 'Event',
        name: 'Launch event',
        offers: { '@id': `${PAGE_URL}#offer` },
      }),
      makeScript({
        '@type': 'Offer',
        '@id': `${PAGE_URL}#offer`,
        description: 'Standalone event offer',
      }),
    );
    const manager = trackedManager();
    manager.init();

    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
    const standalone = graph.find((n) => n.description === 'Standalone event offer');
    expect(standalone['@id']).to.equal(`${PAGE_URL}#offer`);
    const event = graph.find((n) => n['@type'] === 'Event');
    expect(event.offers).to.deep.equal({ '@id': `${PAGE_URL}#offer` });
    const app = graph.find((n) => n['@id'] === `${PAGE_URL}#softwareapplication`);
    expect(app.offers).to.deep.equal([{ '@type': 'Offer', price: '0', availability: 'https://schema.org/InStock' }]);
    expect(manager.graph.has(`${PAGE_URL}#offer`)).to.be.true;
    expect(manager.graph.has(`${PAGE_URL}#offer-authored`)).to.be.false;
  });

  it('replaces the serialized fallback when a runtime producer authors an Offer', () => {
    document.head.appendChild(makeScript({
      '@type': 'SoftwareApplication',
      name: 'Photoshop',
    }));
    const manager = trackedManager();
    manager.init();

    const runtime = makeScript({
      '@type': 'SoftwareApplication',
      name: 'Photoshop',
      offers: [{
        '@type': 'Offer',
        '@id': `${PAGE_URL}#paid`,
        price: '19.99',
        priceCurrency: 'USD',
      }],
    });
    document.head.appendChild(runtime);
    manager.enqueue(runtime, 'runtime');
    manager.rebuild();

    const graph = JSON.parse(document.head.querySelector('script[data-milo-jsonld="graph"]').textContent)['@graph'];
    expect(graph.filter((n) => n['@type'] === 'Offer')).to.have.length(0);
    const app = graph.find((n) => n['@id'] === `${PAGE_URL}#softwareapplication`);
    expect(app.offers).to.deep.equal([{ '@type': 'Offer', price: '19.99', priceCurrency: 'USD' }]);
    expect(manager.graph.has(`${PAGE_URL}#offer`)).to.be.false;
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
    expect(graph.filter((n) => n['@type'] === 'Offer')).to.have.length(0);
    expect(manager.graph.has(`${PAGE_URL}#paid`)).to.be.true;
    expect(manager.graph.has(`${PAGE_URL}#free-trial`)).to.be.true;
    const app = graph.find((n) => n['@id'] === `${PAGE_URL}#softwareapplication`);
    expect(app.offers).to.deep.equal([
      { '@type': 'Offer', price: '19.99', priceCurrency: 'USD' },
      { '@type': 'Offer', price: '0.00', priceCurrency: 'USD' },
    ]);
  });
});

describe('SoftwareApplication nested entities', () => {
  it('preserves rating arrays and removes child contexts and IDs', () => {
    document.head.appendChild(makeScript({
      '@type': 'SoftwareApplication',
      name: 'Photoshop',
      aggregateRating: [{
        '@context': 'https://schema.org',
        '@type': 'AggregateRating',
        '@id': 'https://producer.example/#rating',
        ratingValue: '4.5',
        ratingCount: '200',
      }],
      offers: [{
        '@context': 'https://schema.org',
        '@type': 'Offer',
        price: '19.99',
        priceCurrency: 'USD',
      }],
    }));
    trackedManager().init();
    const graph = getManagedGraph()['@graph'];
    const app = graph.find((node) => node['@type'] === 'SoftwareApplication');
    expect(app.aggregateRating).to.deep.equal([{ '@type': 'AggregateRating', ratingValue: '4.5', ratingCount: '200' }]);
    expect(app.offers).to.deep.equal([{ '@type': 'Offer', price: '19.99', priceCurrency: 'USD' }]);
    expect(graph.some((node) => ['Offer', 'AggregateRating'].includes(node['@type']))).to.be.false;
  });

  ['SoftwareApplication', 'Product', 'WebApplication', 'MobileApplication', 'VideoGame'].forEach((type) => {
    it(`serializes referenced Offer and AggregateRating bodies without IDs for ${type}`, () => {
      const offerId = 'https://producer.example/#paid';
      const ratingId = 'https://producer.example/#rating';
      document.head.appendChild(makeScript({
        '@graph': [
          {
            '@type': type,
            name: 'Photoshop',
            offers: { '@id': offerId },
            aggregateRating: { '@id': ratingId },
          },
          {
            '@type': 'Offer',
            '@id': offerId,
            price: '19.99',
            priceCurrency: 'USD',
            itemOffered: { '@id': `${PAGE_URL}#softwareapplication` },
          },
          {
            '@type': 'AggregateRating',
            '@id': ratingId,
            ratingValue: '4.5',
            ratingCount: '200',
            bestRating: '5',
          },
        ],
      }));
      const manager = trackedManager();
      manager.init();

      const graph = getManagedGraph()['@graph'];
      const app = graph.find((node) => node['@id'] === `${PAGE_URL}#softwareapplication`);
      expect(app.offers).to.deep.equal({
        '@type': 'Offer',
        price: '19.99',
        priceCurrency: 'USD',
        itemOffered: { '@id': app['@id'] },
      });
      expect(app.aggregateRating).to.deep.equal({ '@type': 'AggregateRating', ratingValue: '4.5', ratingCount: '200', bestRating: '5' });
      expect(graph.some((node) => ['Offer', 'AggregateRating'].includes(node['@type']))).to.be.false;
      expect(manager.graph.get(app['@id']).offers).to.deep.equal({ '@id': `${PAGE_URL}#paid` });
      const initial = getManagedGraph();
      manager.rebuild();
      expect(getManagedGraph()).to.deep.equal(initial);
    });
  });

  it('keeps shared entities addressable outside the application', () => {
    const offerId = 'https://producer.example/#paid';
    const ratingId = 'https://producer.example/#rating';
    document.head.appendChild(makeScript([
      {
        '@type': 'SoftwareApplication',
        name: 'Photoshop',
        offers: { '@type': 'Offer', '@id': offerId, price: '19.99', priceCurrency: 'USD' },
        aggregateRating: { '@type': 'AggregateRating', '@id': ratingId, ratingValue: '4.5', ratingCount: '200' },
      },
      { '@type': 'Event', name: 'Launch', offers: { '@id': offerId } },
      { '@type': 'Article', aggregateRating: { '@id': ratingId } },
    ]));
    trackedManager().init();

    const graph = getManagedGraph()['@graph'];
    const app = graph.find((node) => node['@type'] === 'SoftwareApplication');
    expect(app.offers).to.not.have.property('@id');
    expect(app.aggregateRating).to.not.have.property('@id');
    expect(graph.find((node) => node['@type'] === 'Offer')['@id']).to.equal(`${PAGE_URL}#paid`);
    expect(graph.find((node) => node['@type'] === 'Event').offers).to.deep.equal({ '@id': `${PAGE_URL}#paid` });
    expect(graph.find((node) => node['@type'] === 'AggregateRating')['@id']).to.equal(`${PAGE_URL}#aggregaterating`);
    expect(graph.find((node) => node['@type'] === 'Article').aggregateRating).to.deep.equal({ '@id': `${PAGE_URL}#aggregaterating` });
  });

  it('keeps a root Offer when a typed relationship outside the application references it', () => {
    const offerId = 'https://producer.example/#paid';
    document.head.appendChild(makeScript([
      {
        '@type': 'SoftwareApplication',
        name: 'Photoshop',
        offers: { '@type': 'Offer', '@id': offerId, price: '19.99', priceCurrency: 'USD' },
      },
      { '@type': 'Article', about: { '@type': 'Offer', '@id': offerId } },
    ]));
    trackedManager().init();

    const graph = getManagedGraph()['@graph'];
    expect(graph.find((node) => node['@type'] === 'Offer')).to.deep.include({ '@id': `${PAGE_URL}#paid`, price: '19.99', priceCurrency: 'USD' });
    expect(graph.find((node) => node['@type'] === 'Article').about).to.deep.equal({ '@type': 'Offer', '@id': `${PAGE_URL}#paid` });
  });

  it('merges untyped reference bodies using runtime source priority', () => {
    const offerId = `${PAGE_URL}#paid`;
    const ratingId = `${PAGE_URL}#rating`;
    const boot = makeScript({
      '@type': 'SoftwareApplication',
      name: 'Photoshop',
      offers: [{ '@id': offerId, price: '19.99', priceCurrency: 'USD' }],
      aggregateRating: { '@id': ratingId, ratingValue: '4.5', ratingCount: '200' },
    });
    const manager = trackedManager();
    manager.enqueue(boot, 'bootDom');
    manager.rebuild();
    const runtime = makeScript({
      '@type': 'SoftwareApplication',
      offers: [{ '@id': offerId, price: '24.99', priceCurrency: 'USD' }],
      aggregateRating: { '@id': ratingId, ratingValue: '4.8', ratingCount: '300' },
    });
    manager.enqueue(runtime, 'runtime');
    manager.rebuild();

    const app = getManagedGraph()['@graph'].find((node) => node['@type'] === 'SoftwareApplication');
    expect(app.offers).to.deep.equal([{ '@type': 'Offer', price: '24.99', priceCurrency: 'USD' }]);
    expect(app.aggregateRating).to.deep.equal({ '@type': 'AggregateRating', ratingValue: '4.8', ratingCount: '300' });
    expect(manager.graph.get(`${PAGE_URL}#softwareapplication`).offers).to.deep.equal([{ '@id': offerId }]);
  });

  it('removes remapped low-quality rating references, including array values', () => {
    document.head.appendChild(makeScript([
      {
        '@type': 'SoftwareApplication',
        name: 'Photoshop',
        aggregateRating: [{ '@id': 'https://producer.example/#rating' }],
      },
      {
        '@type': 'AggregateRating',
        '@id': 'https://producer.example/#rating',
        ratingValue: '3.9',
        ratingCount: '200',
      },
    ]));
    trackedManager().init();
    const graph = getManagedGraph()['@graph'];
    expect(graph.find((node) => node['@type'] === 'SoftwareApplication')).to.not.have.property('aggregateRating');
    expect(graph.some((node) => node['@type'] === 'AggregateRating')).to.be.false;
  });

  it('removes a low-quality rating body supplied with an aggregateRating reference', () => {
    document.head.appendChild(makeScript([
      {
        '@type': 'SoftwareApplication',
        name: 'Photoshop',
        aggregateRating: {
          '@id': 'https://producer.example/#rating',
          ratingValue: '3.9',
          ratingCount: '99',
        },
      },
      {
        '@type': 'AggregateRating',
        '@id': 'https://producer.example/#rating',
        ratingValue: '4.5',
        ratingCount: '200',
      },
    ]));
    trackedManager().init();
    const graph = getManagedGraph()['@graph'];
    expect(graph.find((node) => node['@type'] === 'SoftwareApplication')).to.not.have.property('aggregateRating');
    expect(graph.some((node) => node['@type'] === 'AggregateRating')).to.be.false;
  });

  it('does not infer relationships from standalone entities', () => {
    document.head.appendChild(makeScript([
      { '@type': 'SoftwareApplication', name: 'Photoshop' },
      { '@type': 'Offer', '@id': `${PAGE_URL}#paid`, price: '19.99', priceCurrency: 'USD' },
      { '@type': 'AggregateRating', ratingValue: '4.5', ratingCount: '200' },
    ]));
    trackedManager().init();
    const graph = getManagedGraph()['@graph'];
    const app = graph.find((node) => node['@type'] === 'SoftwareApplication');
    expect(app).to.not.have.property('aggregateRating');
    expect(app.offers[0].price).to.equal('0');
    expect(graph.filter((node) => ['Offer', 'AggregateRating'].includes(node['@type']))).to.have.length(2);
  });

  it('preserves unresolved references instead of fabricating child data', () => {
    document.head.appendChild(makeScript({
      '@type': 'SoftwareApplication',
      name: 'Photoshop',
      offers: { '@id': 'https://external.example/#offer' },
      aggregateRating: { '@id': 'https://external.example/#rating' },
    }));
    trackedManager().init();
    const app = getManagedGraph()['@graph'].find((node) => node['@type'] === 'SoftwareApplication');
    expect(app.offers).to.deep.equal({ '@id': 'https://external.example/#offer' });
    expect(app.aggregateRating).to.deep.equal({ '@id': 'https://external.example/#rating' });
  });
});

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
