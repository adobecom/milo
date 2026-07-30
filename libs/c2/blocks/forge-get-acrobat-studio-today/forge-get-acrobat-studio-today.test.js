// Gate test for the authored Milo block forge-get-acrobat-studio-today.
// Runs under Milo's @web/test-runner (browser). The fixture is the FLAT,
// class-less DA serialization, so these assertions prove init() RECONSTRUCTED
// the rich hero lockup from unstructured content (not that it kept authored
// wrappers). Fixture is loaded INSIDE each it() (self-contained, no shared hook).
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-get-acrobat-studio-today.js';

const BLOCK = 'forge-get-acrobat-studio-today';

describe(BLOCK, () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs the hero lockup from flat content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);

    // Structure rebuilt from the flat run (not the empty-grid regression).
    expect(block.querySelector('.foreground .lockup .text-group'), 'lockup rebuilt').to.exist;
    // One headline (single h1) + eyebrow + body copy all routed into the text group.
    expect(block.querySelectorAll('.text-group h1.headline').length).to.equal(1);
    expect(block.querySelector('.text-group .eyebrow'), 'eyebrow before headline').to.exist;
    // Price line and exactly two CTAs (primary + secondary) grouped for the actions.
    expect(block.querySelector('.cta-group .price'), 'price beside CTAs').to.exist;
    expect(block.querySelectorAll('.cta-group .btn-row .cta').length).to.equal(2);
    // Authored + analytics markers stamped.
    expect(block.dataset.forgeAuthored).to.equal(BLOCK);
  });
});
