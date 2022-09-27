/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const { default: init } = await import('../../../libs/blocks/manual-card/manual-card.js');

describe('Manual Card', () => {
  it('Shows half card, 3up by default', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    init(document.querySelector('.manual-card'));
    expect(document.querySelector('.consonant-OneHalfCard')).to.exist;
    expect(document.querySelector('.consonant-CardsGrid--3up')).to.exist;
  });

  it('Adds one wrapper per section', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/half.html' });
    init(document.querySelectorAll('.manual-card')[0]);
    init(document.querySelectorAll('.manual-card')[1]);
    expect(document.querySelectorAll('.consonant-Wrapper').length).to.equal(1);
  });

  it('Supports Half card', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/half.html' });
    init(document.querySelector('.manual-card'));
    expect(document.querySelector('.consonant-OneHalfCard')).to.exist;
  });

  it('Supports Double Width card', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/double-width.html' });
    init(document.querySelector('.manual-card'));
    expect(document.querySelector('.consonant-DoubleWideCard')).to.exist;
  });

  it('Supports Product card', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/product.html' });
    init(document.querySelector('.manual-card'));
    expect(document.querySelector('.consonant-ProductCard')).to.exist;
  });

  it('Supports Half Height card', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/half-height.html' });
    init(document.querySelector('.manual-card'));
    expect(document.querySelector('.consonant-HalfHeightCard')).to.exist;
  });
});
