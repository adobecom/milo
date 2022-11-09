import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { loadDeferred } from '../../libs/utils/utils.js';

describe('Rich Results', () => {
  beforeEach(async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head-rich-results.html' });
  });

  it('adds the NewsArticle rich results', async () => {
    await loadDeferred(document);
    const script = document.querySelector('script[type="application/ld+json"]');
    const actual = JSON.parse(script.innerHTML);
    const expected = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headLine: 'The war is over',
      image: 'https://example.com/photos/1x1/photo.jpg',
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
    // remove the richresults meta tag
    document.querySelector('meta[name="richresults"]').remove();
    await loadDeferred(document);
    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).to.be.null;
  });
});
