// L22 fixture for the authored Milo C2 block forge-explore-what-s-new.
// Runs under Milo's @web/test-runner (real browser). The fixture mirrors the
// FLAT, class-less DA serialization (EDS row/cell divs, no Figma classes) and
// carries no network refs, so the gate never stalls on a 404. Each it() loads
// the fixture itself (no shared async hook) and keeps assertions focused.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-explore-what-s-new.js';

const BLOCK = 'forge-explore-what-s-new';

describe(BLOCK, () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('rebuilds the centered intro (foreground/content) with one h1 and a 2-CTA action area', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    expect(block, 'mock body has the block root').to.exist;

    await init(block);

    // Reconstruction gate: the rich layout containers must exist (not a flat stack).
    expect(block.querySelector('.foreground .content'), 'foreground/content rebuilt').to.exist;
    // Exactly one h1 survives the rebuild (L8).
    expect(block.querySelectorAll('h1').length, 'single h1').to.equal(1);
    // Every CTA is accounted for — the action area is built AND populated (no empty container).
    expect(block.querySelectorAll('.action-area .con-button').length, 'two decorated CTAs').to.equal(2);
    // Forge marker stamped on the root.
    expect(block.dataset.forgeAuthored).to.equal(BLOCK);
  });
});
