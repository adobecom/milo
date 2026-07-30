// Test fixture for the authored Milo C2 block
// forge-address-your-biggest-customer-experience-challenges-with-adobe.
// Runs under Milo's @web/test-runner (browser); the ship gate scopes to
// libs/c2/blocks/forge-*/**/*.test.js, so a forge block gates on ITS own test.
// mocks/body.html mirrors DA's FLAT, class-LESS serialization (no grid/tile/row
// wrappers), so these assertions gate that init() RECONSTRUCTS the layout from
// content shape — not that the authored classes survived.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-address-your-biggest-customer-experience-challenges-with-adobe.js';

const BLOCK = 'forge-address-your-biggest-customer-experience-challenges-with-adobe';
const sel = (s) => document.querySelector(`.${BLOCK}${s}`);
const all = (s) => document.querySelectorAll(`.${BLOCK}${s}`);

describe(BLOCK, () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs the grid of solution cards from the flat DA content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = sel('');
    expect(block, 'mock body has the block root').to.exist;
    await init(block);
    expect(sel('__grid'), 'a grid container was built').to.exist;
    expect(all('__card').length, 'five solution cards').to.equal(5);
    expect(all('__card--wide').length, 'two media-bearing feature cards').to.equal(2);
    expect(block.querySelectorAll('h1').length, 'no stray h1 (L8)').to.equal(0);
  });

  it('rebuilds head, eyebrows and media, and wires analytics', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = sel('');
    await init(block);
    expect(sel('__head h2'), 'lead-in heading present').to.exist;
    expect(all('__eyebrow').length, 'one eyebrow per card').to.equal(5);
    expect(all('__media img').length, 'media cards carry their picture').to.equal(2);
    expect(block.getAttribute('daa-lh'), 'section analytics handle').to.equal(BLOCK);
    expect(sel('__link').getAttribute('daa-ll'), 'links are analytics-tagged').to.be.a('string');
    expect(block.dataset.forgeAuthored, 'forge marker stamped').to.equal(BLOCK);
  });
});
