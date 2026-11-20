import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { waitFor } from '../helpers/waitfor.js';
import { loadArea, setConfig } from '../../libs/utils/utils.js';
import { JsonLdGraphManager } from '../../libs/features/jsonld-graph-manager/jsonld-graph-manager.js';

describe('Rich Results', () => {
  beforeEach(() => {
    setConfig({});
  });

  describe('JSON-LD manager preload', () => {
    let sandbox;
    let originalManager;
    let originalLana;
    let preload;
    let appendFails;
    let statusAtPreload;

    beforeEach(async () => {
      sandbox = sinon.createSandbox();
      originalManager = window.miloJsonLd;
      originalLana = window.lana;
      window.miloJsonLd = {};
      window.lana = { log: sandbox.spy() };
      setConfig({});
      document.head.innerHTML = '<meta name="jsonld-graph-manager" content="true">';
      document.body.innerHTML = await readFile({ path: './mocks/body.html' });
      const append = document.head.appendChild.bind(document.head);
      sandbox.stub(document.head, 'appendChild').callsFake((node) => {
        if (node.tagName === 'LINK' && node.rel === 'modulepreload' && node.href.endsWith('/jsonld-graph-manager.js')) {
          preload = node;
          statusAtPreload = document.querySelector('main > .section')?.dataset.status;
          if (appendFails) throw new Error('preload insertion failed');
          return node;
        }
        return append(node);
      });
    });

    afterEach(() => {
      window.miloJsonLd?.manager?.destroy();
      window.miloJsonLd = originalManager;
      window.lana = originalLana;
      sandbox.restore();
      preload = undefined;
      appendFails = false;
    });

    it('preloads after the section is revealed without holding up page loading', async () => {
      statusAtPreload = 'not scheduled';
      await loadArea();
      await waitFor(() => preload, 2000);
      expect(document.getElementById('page-load-ok-milo')).to.exist;
      expect(statusAtPreload).to.be.undefined;
      expect(window.miloJsonLd.manager).to.be.undefined;
      expect(preload.rel).to.equal('modulepreload');
      expect(preload.fetchPriority).to.equal('low');
      expect(preload.crossOrigin).to.equal('anonymous');
      expect(preload.href).to.equal(new URL('../../libs/features/jsonld-graph-manager/jsonld-graph-manager.js', import.meta.url).href);
      preload.dispatchEvent(new Event('load'));
      await waitFor(() => window.miloJsonLd.manager, 2000);
      expect(document.head.querySelector('script[data-milo-jsonld="graph"]')).to.exist;
    });

    it('reuses an existing link for the module URL', async () => {
      const url = new URL('../../libs/features/jsonld-graph-manager/jsonld-graph-manager.js', import.meta.url).href;
      const existingLink = document.createElement('link');
      existingLink.rel = 'prefetch';
      existingLink.href = url;
      document.head.appendChild(existingLink);

      await loadArea();
      await waitFor(() => window.miloJsonLd.manager, 2000);

      expect(preload).to.be.undefined;
      expect(existingLink.rel).to.equal('prefetch');
      expect(document.head.querySelector('script[data-milo-jsonld="graph"]')).to.exist;
    });

    it('does not preload or initialize when disabled', async () => {
      document.querySelector('meta[name="jsonld-graph-manager"]').content = 'false';
      await loadArea();
      await new Promise((resolve) => { setTimeout(resolve, 50); });
      expect(preload).to.be.undefined;
      expect(window.miloJsonLd.manager).to.be.undefined;
    });

    it('uses the plain import when modulepreload is unsupported', async () => {
      const { supports } = DOMTokenList.prototype;
      sandbox.stub(DOMTokenList.prototype, 'supports').callsFake(function supportsRel(token) {
        return token === 'modulepreload' ? false : supports.call(this, token);
      });
      await loadArea();
      await waitFor(() => window.miloJsonLd.manager, 2000);
      expect(preload).to.be.undefined;
    });

    it('falls back to the plain import if the preload fails', async () => {
      await loadArea();
      await waitFor(() => preload, 2000);
      preload.dispatchEvent(new Event('error'));
      await waitFor(() => window.miloJsonLd.manager, 2000);
      expect(window.lana.log.calledWithMatch('JSON-LD graph manager preload failed')).to.be.true;
    });

    it('falls back to the plain import if the preload cannot be inserted', async () => {
      appendFails = true;
      await loadArea();
      await waitFor(() => window.miloJsonLd.manager, 2000);
      expect(window.lana.log.calledWithMatch('preload insertion failed')).to.be.true;
    });

    it('falls back to the plain import if the preload stalls', async () => {
      const setTimer = window.setTimeout.bind(window);
      let expire;
      sandbox.stub(window, 'setTimeout').callsFake((callback, delay, ...args) => {
        if (delay === 10000) {
          expire = callback;
          return 0;
        }
        return setTimer(callback, delay, ...args);
      });
      await loadArea();
      await waitFor(() => preload, 2000);
      expect(window.miloJsonLd.manager).to.be.undefined;
      expire();
      await waitFor(() => window.miloJsonLd.manager, 2000);
      expect(window.lana.log.calledWithMatch('JSON-LD graph manager preload timed out')).to.be.true;
    });
  });

  it('add the Article rich results', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head-rich-results-article.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    await loadArea(document);
    const script = document.querySelector('script[type="application/ld+json"]');
    const actual = JSON.parse(script.innerHTML);
    const expected = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headLine: 'The war is over',
      image: 'https://example.com/photos/1x1/photo.jpg',
      description: 'Jane Doe Description',
      datePublished: '2022-12-24',
      dateModified: '2022-12-25',
      author: {
        '@type': 'Person',
        name: 'Emile Zola',
        url: 'https://example.com/zola',
      },
    };
    expect(actual).to.deep.equal(expected);
  });

  it('add the NewsArticle rich results', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head-rich-results.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    await loadArea(document);
    const script = document.querySelector('script[type="application/ld+json"]');
    const actual = JSON.parse(script.innerHTML);
    const expected = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headLine: 'The war is over',
      image: 'https://example.com/photos/1x1/photo.jpg',
      description: 'Jane Doe Description',
      datePublished: '2022-12-24',
      dateModified: '2022-12-25',
      author: {
        '@type': 'Person',
        name: 'Emile Zola',
        url: 'https://example.com/zola',
      },
    };
    expect(actual).to.deep.equal(expected);
  });

  it('links the real NewsArticle producer shape through graph management', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head-rich-results.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    await loadArea(document);
    const manager = new JsonLdGraphManager();
    try {
      manager.init();
      const graph = JSON.parse(
        document.head.querySelector('script[data-milo-jsonld="graph"]').textContent,
      )['@graph'];
      const canonicalPageUrl = `${window.location.origin}${window.location.pathname}`;
      const newsArticleId = `${canonicalPageUrl}#newsarticle`;
      const webpageId = `${canonicalPageUrl}#webpage`;
      const newsArticle = graph.find((node) => node['@type'] === 'NewsArticle');
      const webpage = graph.find((node) => node['@type'] === 'WebPage');

      expect(newsArticle['@id']).to.equal(newsArticleId);
      expect(newsArticle.isPartOf).to.deep.equal({ '@id': webpageId });
      expect(newsArticle.mainEntityOfPage).to.deep.equal({ '@id': webpageId });
      expect(newsArticle.publisher).to.deep.equal({ '@id': 'https://www.adobe.com/#organization' });
      expect(webpage.mainEntity).to.deep.equal({ '@id': newsArticleId });
    } finally {
      manager.destroy();
    }
  });

  it('disable the NewsArticle rich results', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head-rich-results.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    // remove the richresults meta tag
    document.querySelector('meta[name="richresults"]').remove();
    await loadArea(document);
    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).to.be.null;
  });

  it('add the Organization rich results', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head-rich-results-org.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    await loadArea(document);
    const script = document.querySelector('script[type="application/ld+json"]');
    const actual = JSON.parse(script.innerHTML);
    const expected = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      url: 'https://www.adobe.com',
      logo: 'https://www.adobe.com/favicon.ico',
    };
    expect(actual).to.deep.equal(expected);
  });

  it('preserves authored Organization URL and logo through graph management', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head-rich-results-org.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    await loadArea(document);
    const manager = new JsonLdGraphManager();
    try {
      manager.init();
      const graph = JSON.parse(
        document.head.querySelector('script[data-milo-jsonld="graph"]').textContent,
      )['@graph'];
      const org = graph.find((node) => node['@type'] === 'Organization');
      expect(org.url).to.equal('https://www.adobe.com');
      expect(org.logo).to.equal('https://www.adobe.com/favicon.ico');
    } finally {
      manager.destroy();
    }
  });

  it('keeps page loading and authored JSON-LD intact when manager initialization fails', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head-rich-results-org.html' });
    document.head.insertAdjacentHTML('beforeend', `
      <meta name="jsonld-graph-manager" content="true">
      <script id="authored-jsonld" type="application/ld+json">{"@type":"Article","headline":"Authored"}</script>
    `);
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    if (window.miloJsonLd) window.miloJsonLd.manager = null;
    const append = document.head.appendChild.bind(document.head);
    const appendStub = sinon.stub(document.head, 'appendChild').callsFake((node) => {
      if (node.matches?.('script[data-milo-jsonld="graph"]')) throw new Error('managed write failed');
      return append(node);
    });
    try {
      await loadArea(document);
      await waitFor(() => appendStub.called, 2000);
      expect(document.getElementById('page-load-ok-milo')).to.exist;
      expect(document.getElementById('authored-jsonld')).to.exist;
      expect(window.miloJsonLd.manager).to.not.exist;
    } finally {
      appendStub.restore();
    }
  });

  it('unsupported rich results type', async () => {
    sinon.stub(console, 'error');
    document.head.innerHTML = await readFile({ path: './mocks/head-rich-results-unsupported-type.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    await loadArea(document);
    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).to.be.null;
    expect(console.error.calledWith('Type Unsupported is not supported')).to.be.true;
  });

  it('add the Site Search Box rich results', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head-rich-results-sitesearchbox.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    await loadArea(document);
    const script = document.querySelector('script[type="application/ld+json"]');
    const actual = JSON.parse(script.innerHTML);
    const expected = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      url: 'https://www.example.com/',
      potentialAction: [{
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://query.example.com/search?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      }],
    };
    expect(actual).to.deep.equal(expected);
  });
});
