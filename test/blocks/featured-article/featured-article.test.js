import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';

const articleHtml = await readFile({ path: './mocks/article.html' });

const ogFetch = window.fetch;
window.fetch = stub();
window.fetch.withArgs(`https://main--blog--adobecom.hlx.page/published/2022/11/15/voices-of-our-community`).returns(
  new Promise((resolve) => {
    resolve({
      ok: true,
      text: () => articleHtml});
  }),
);
const restoreFetch = () => {
  window.fetch = ogFetch;
};

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/featured-article/featured-article.js')

describe('creates feature article block', async () => {
  before(async () => {
    await init(document.body);
  });
  after(() => {
    restoreFetch()
  });

  it('has card with url', () => {
    const card = document.querySelector('.featured-article-card');
    expect(card).to.exist;
  });
  it('has featured article image', () => {
    const image = document.querySelector('.featured-article-card-image');
    expect(image).to.exist;
  });
  it('has content', () => {
    const content = document.querySelector('.featured-article-card-body');
    expect(content).to.exist;
  });
});
