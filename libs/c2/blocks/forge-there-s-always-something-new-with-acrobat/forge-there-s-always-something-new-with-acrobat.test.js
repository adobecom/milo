// L22 fixture for the authored Milo C2 block. Runs under Milo's @web/test-runner
// (browser); the ship gate scopes to libs/c2/blocks/forge-*/**/*.test.js, so this
// block gates on ITS own test. The fixture (mocks/body.html) mirrors the REAL
// class-less DA serialization, so these assertions gate the reconstruction that
// init() performs — not the authored grouping (which does not survive to runtime).
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-there-s-always-something-new-with-acrobat.js';

const BLOCK = 'forge-there-s-always-something-new-with-acrobat';

describe(BLOCK, () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs the header + two three-up rows from flat content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);
    // Grid container + a single header with exactly one h1.
    expect(block.querySelector('.wn-wrap .wn-head .wn-title'), 'title in header').to.exist;
    expect(block.querySelectorAll('h1').length, 'exactly one h1').to.equal(1);
    // Two reconstructed rows: three feature cards and three teaser cards.
    expect(block.querySelectorAll('.wn-row').length, 'two rows').to.equal(2);
    expect(block.querySelectorAll('.wn-row--features .wn-col').length, 'three feature cards').to.equal(3);
    expect(block.querySelectorAll('.wn-row--teasers .wn-col--teaser').length, 'three teaser cards').to.equal(3);
  });

  it('wires each feature card (media + heading + body + CTA) and stamps analytics', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);
    const first = block.querySelector('.wn-row--features .wn-col');
    expect(first.querySelector('picture .wn-card-img'), 'card image preserved').to.exist;
    expect(first.querySelector('.wn-hb .wn-h3'), 'card heading').to.exist;
    expect(first.querySelector('.wn-cta .wn-cta-label'), 'CTA label wrapped').to.exist;
    // Analytics floor + forge marker.
    expect(block.getAttribute('daa-lh')).to.equal(BLOCK);
    expect(block.querySelector('a[daa-ll]'), 'links tagged').to.exist;
    expect(block.dataset.forgeAuthored).to.equal(BLOCK);
  });
});
