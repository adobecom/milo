import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { loadArea, setConfig } from '../../libs/utils/utils.js';

describe('Rich Results', () => {
  beforeEach(() => {
    setConfig({});
  });

  it('add the Article rich results', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head-rich-results-article.html' });
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
    // remove the richresults meta tag
    document.querySelector('meta[name="richresults"]').remove();
    await loadArea(document);
    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).to.be.null;
  });

  it('add the Organization rich results', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head-rich-results-org.html' });
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

  it('unsupported rich results type', async () => {
    sinon.stub(console, 'error');
    document.head.innerHTML = await readFile({ path: './mocks/head-rich-results-unsupported-type.html' });
    await loadArea(document);
    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).to.be.null;
    expect(console.error.calledWith('Type Unsupported is not supported')).to.be.true;
  });

  it('add the Site Search Box rich results', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head-rich-results-sitesearchbox.html' });
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
