import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig, getConfig } from '../../../libs/utils/utils.js';

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const conf = { locales };
setConfig(conf);
const config = getConfig();

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: initFeaturedArticleBlock } = await import('../../../libs/blocks/featured-article/featured-article.js');

describe('creates feature article block', () => {
  const featuredArticles = document.querySelectorAll('.featured-article');
  it('has card with url', async () => {
    config.locale.contentRoot = '/test/blocks/featured-article/mocks';
    await initFeaturedArticleBlock(featuredArticles[0]);
    const card = featuredArticles[0].querySelector('.featured-article-card');
    expect(card).to.exist;
  });

  it('disregards bad card requests', async () => {
    config.locale.contentRoot = '/test/blocks/featured-article/mocks';
    await initFeaturedArticleBlock(featuredArticles[1]);
    const card = featuredArticles[1].querySelector('.featured-article-card');
    expect(card).to.not.exist;
  });

  it('doesnot contain any anchor tag', async () => {
    config.locale.contentRoot = '/test/blocks/featured-article/mocks';
    await initFeaturedArticleBlock(featuredArticles[2]);
    const card = featuredArticles[2].querySelector('a');
    expect(card).to.not.exist;
  });
});
