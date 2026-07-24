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
