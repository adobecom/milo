// L22 fixture for the authored Milo C2 block forge-all-the-best-models-all-in-one-place.
// Runs under Milo's @web/test-runner (browser). The fixture mirrors the FLAT,
// class-less DA serialization (bare-text CTA + category-tab labels, then a
// trailing mobile caption), so these assertions gate that init() RECONSTRUCTS
// the hero — grid container present, one card per authored category, active tab
// marked — rather than passing on a green-lie. Each it() loads the fixture
// itself (no shared async hook); every fixture img is a 1x1 data-URI (no net).
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-all-the-best-models-all-in-one-place.js';

const BLOCK = 'forge-all-the-best-models-all-in-one-place';

describe(BLOCK, () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs the hero copy and keeps a single h1-safe heading', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);
    expect(block.dataset.forgeAuthored, 'forge marker').to.equal(BLOCK);
    expect(block.querySelector('.hero'), 'hero stage built').to.exist;
    expect(block.querySelectorAll('h1').length, 'no h1 emitted').to.equal(0);
    expect(block.querySelector('.hero__heading').textContent).to.contain('All the best models');
    expect(block.querySelector('.hero__bg img'), 'background image preserved').to.exist;
  });

  it('rebuilds one tab-card per category and marks Content creation active', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);
    const cards = block.querySelectorAll('.hero__cards .hero__card');
    expect(cards.length, 'five category tabs (never an empty grid)').to.equal(5);
    const active = block.querySelectorAll('.hero__card.is-active');
    expect(active.length, 'exactly one active tab').to.equal(1);
    expect(active[0].textContent).to.contain('Content creation');
  });

  it('splits the two CTAs from the tab labels and rebuilds the caption', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);
    const ctas = block.querySelectorAll('.hero__ctas .hero__cta');
    expect(ctas.length, 'two pill CTAs').to.equal(2);
    expect(ctas[0].textContent).to.contain('Create with Firefly');
    expect(block.querySelector('.hero__caption-heading'), 'mobile caption reconstructed').to.exist;
  });
});
