import { expect } from '@esm-bundle/chai';
import {
  buildArticleCard,
  createOptimizedPicture,
  getArticleTaxonomy,
} from '../../../libs/blocks/article-feed/article-helpers.js';

describe('adobetv autoblock', () => {
  it('Creates article taxonomy from strings', async () => {
    const article = {
      tags: 'hello, world',
      path: '/no/types/for/you',
    };
    const taxonomy = getArticleTaxonomy(article);
    expect(taxonomy.topics[0]).to.equal('hello');
  });

  it('Creates article taxonomy from an array of strings', async () => {
    const article = {
      tags: ['goodnight', 'moon'],
      path: '/no/types/for/you',
    };
    const taxonomy = getArticleTaxonomy(article);
    expect(taxonomy.topics[0]).to.equal('goodnight');
  });

  it('creates responsive card images with intrinsic dimensions and priority hints', () => {
    const sizes = '(min-width: 1200px) 378px, 100vw';
    const picture = createOptimizedPicture(
      '/media/card.jpg',
      'Card',
      true,
      [{ width: '320' }, { width: '480' }, { width: '750' }],
      { sizes, width: '378', height: '250' },
    );
    const source = picture.querySelector('source');
    const img = picture.querySelector('img');

    expect(source.srcset).to.include('320w');
    expect(source.srcset).to.include('480w');
    expect(source.srcset).to.include('750w');
    expect(source.sizes).to.equal(sizes);
    expect(img.srcset).to.include('320w');
    expect(img.sizes).to.equal(sizes);
    expect(img.width).to.equal(378);
    expect(img.height).to.equal(250);
    expect(img.loading).to.equal('eager');
    expect(img.decoding).to.equal('async');
    expect(img.getAttribute('fetchpriority')).to.equal('high');
  });

  it('keeps media-based picture support lazy by default', () => {
    const picture = createOptimizedPicture('/media/card.jpg', 'Card');
    const img = picture.querySelector('img');

    expect(picture.querySelectorAll('source').length).to.equal(3);
    expect(img.loading).to.equal('lazy');
    expect(img.getAttribute('fetchpriority')).to.be.null;
  });

  it('builds cards with the feed layout sizes and lazy defaults', () => {
    const card = buildArticleCard({
      title: 'Article',
      description: 'Description',
      image: '/media/card.jpg',
      imageAlt: 'Card',
      date: 45000,
      path: '/article.html',
      tags: 'News',
    });
    const img = card.querySelector('img');

    expect(img.sizes).to.equal(
      '(min-width: 1200px) 378px, (min-width: 600px) min(378px, calc((100vw - 96px) / 2)), clamp(268px, calc(100vw - 64px), 378px)',
    );
    expect(img.loading).to.equal('lazy');
    expect(img.width).to.equal(378);
    expect(img.height).to.equal(250);
  });
});
