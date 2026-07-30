// L22 smoke fixture for the authored Milo C2 block. Runs under Milo's
// @web/test-runner (browser). The fixture (mocks/body.html) mirrors the REAL
// class-less DA serialization the block receives at runtime, so these tests gate
// that init() RECONSTRUCTS the feature-card grid from content order — not that it
// merely passes over the already-structured section.html.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-what-s-new-in-ai-creativity-and-customer-experience.js';

const BLOCK = 'forge-what-s-new-in-ai-creativity-and-customer-experience';

describe(BLOCK, () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('rebuilds the 3-up feature-card grid from the flat DA content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);

    expect(block.querySelector('.cards-3'), 'grid container rebuilt').to.exist;
    const cards = block.querySelectorAll('.feature-card');
    expect(cards.length, 'three feature cards').to.equal(3);
    const wellFormed = [...cards].every((c) => c.querySelector('picture.feature-card__media')
      && c.querySelector('.feature-card__body h3')
      && c.querySelector('.feature-card__body a.textlink'));
    expect(wellFormed, 'each card has media + heading + text link').to.be.true;
    expect(block.querySelectorAll('.badge').length, 'each card has a badge pill').to.equal(3);
  });

  it('keeps one h2 in the section head, no h1, and stamps analytics', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);

    expect(block.querySelectorAll('.section-head h2').length, 'single section h2').to.equal(1);
    expect(block.querySelectorAll('h1').length, 'no h1').to.equal(0);
    expect(block.getAttribute('daa-lh'), 'daa-lh handle set').to.equal(BLOCK);
    expect(block.dataset.forgeAuthored, 'forge marker set').to.equal(BLOCK);
  });
});
