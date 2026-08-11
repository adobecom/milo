// Smoke + reconstruction test for the authored Milo C2 block forge-section-3.
// Runs under Milo's @web/test-runner (browser). Each it() is self-contained
// (loads the network-free fixture inline, no shared before/beforeEach hook) so
// the coverage session never hangs.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-section-3.js';

const BLOCK = 'forge-section-3';

describe(BLOCK, () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs the five-card collage from flat DA content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);
    // Collage stage with all five clusters rebuilt into cards (C24).
    expect(block.querySelector(`.${BLOCK}-collage`), 'collage stage').to.exist;
    expect(block.querySelectorAll(`.${BLOCK}-card`).length, 'five cards').to.equal(5);
    // Media-mix treemap reconstructed from the four "NN%" labels.
    expect(block.querySelectorAll(`.${BLOCK}-card--media .${BLOCK}-cell`).length, 'treemap cells').to.equal(4);
    // Tab pairs were built for the growth + media cards.
    expect(block.querySelectorAll(`.${BLOCK}-tab--active`).length, 'active tabs').to.be.at.least(2);
    expect(block.dataset.forgeAuthored, 'forge marker').to.equal(BLOCK);
  });
});
