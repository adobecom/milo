// L22 test fixture for the authored Milo C2 block forge-tools-that-work-for-you.
// Runs under Milo's @web/test-runner (browser). The fixture (mocks/body.html)
// mirrors the FLAT, class-less DA serialization the block gets at runtime, and
// these assertions gate that init() RECONSTRUCTED the rich lockup — so a
// regression to a flat, un-built stack fails here, not in the user's eyes.
// Each it() loads the fixture itself (no shared async hook) to keep the gate fast.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-tools-that-work-for-you.js';

const BLOCK = 'forge-tools-that-work-for-you';

describe(BLOCK, () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs the centered lockup from flat DA content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);
    // Structure was rebuilt (not left as a flat stack).
    expect(block.querySelector('.foreground .lockup .text-group'), 'lockup rebuilt').to.exist;
    // The one heading landed in the text group.
    expect(block.querySelectorAll('.text-group h2').length, 'heading count').to.equal(1);
    // The one authored link became the pill CTA in the actions slot.
    expect(block.querySelectorAll('.actions a.con-button').length, 'cta count').to.equal(1);
    // Analytics + authored marker are stamped.
    expect(block.getAttribute('daa-lh')).to.equal(BLOCK);
    expect(block.dataset.forgeAuthored).to.equal(BLOCK);
  });
});
