/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/featured-article/featured-article.js')

describe('creates feature article block', async () => {
  await init(document);

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
