// Test fixture for the authored Milo C2 block forge-act-dark.
// Runs under Milo's @web/test-runner (browser); the ship gate scopes to
// libs/c2/blocks/forge-*/**/*.test.js, so a forge block gates on ITS own test.
// mocks/body.html mirrors DA's FLAT, class-LESS serialization (no panel/chip/
// tile-grid wrappers), so these assertions gate that init() RECONSTRUCTS the
// layout from content shape — not that the authored classes survived.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-act-dark.js';

const BLOCK = 'forge-act-dark';
const sel = (s) => document.querySelector(`.${BLOCK}${s}`);
const all = (s) => document.querySelectorAll(`.${BLOCK}${s}`);

describe(BLOCK, () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs the catalog: chips, featured panel and product-tile grid', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = sel('');
    expect(block, 'mock body has the block root').to.exist;
    await init(block);
    expect(sel('__panel'), 'featured panel container built').to.exist;
    expect(all('__cat').length, 'six category chips').to.equal(6);
    expect(all('__tile').length, 'eight product tiles').to.equal(8);
    expect(all('__tile-new').length, 'six tiles carry a New badge').to.equal(6);
    expect(block.querySelectorAll('h1').length, 'no stray h1 (L8)').to.equal(0);
  });

  it('rebuilds head, media and wires analytics', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = sel('');
    await init(block);
    expect(sel('__head h2'), 'section heading present').to.exist;
    expect(sel('__media img'), 'featured visual carries its image').to.exist;
    expect(block.getAttribute('daa-lh'), 'section analytics handle').to.equal(BLOCK);
    expect(all('__tile')[0].getAttribute('daa-ll'), 'tiles are analytics-tagged').to.be.a('string');
    expect(block.dataset.forgeAuthored, 'forge marker stamped').to.equal(BLOCK);
  });
});
