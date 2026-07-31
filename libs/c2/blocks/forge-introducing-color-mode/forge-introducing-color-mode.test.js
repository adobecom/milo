// L22 fixture for the authored Milo C2 block forge-introducing-color-mode.
// Runs under Milo's @web/test-runner (real browser). The fixture mirrors the
// FLAT, class-less DA serialization (EDS row/cell divs, no Figma classes) and
// carries only data-URI images, so the gate never stalls on a 404. Each it()
// loads the fixture itself (no shared async hook) and keeps assertions focused.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-introducing-color-mode.js';

const BLOCK = 'forge-introducing-color-mode';

describe(BLOCK, () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('rebuilds the featured card (asset with fill + badge, copy row, chevron CTA)', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    expect(block, 'mock body has the block root').to.exist;

    await init(block);

    // Reconstruction gate: the rich containers exist (not a flat stack).
    const asset = block.querySelector('.fic-inner .fic-asset');
    expect(asset, 'media asset rebuilt').to.exist;
    // The two authored pictures land as the fill + the badge overlay (no dropped media).
    expect(asset.querySelector('.fic-fill'), 'first picture is the fill').to.exist;
    expect(asset.querySelectorAll('.fic-badge').length, 'second picture is the badge').to.equal(1);
    // Copy row is built AND populated: single h2 heading + a chevron CTA link.
    expect(block.querySelectorAll('.fic-copy .fic-text h2').length, 'single heading').to.equal(1);
    expect(block.querySelectorAll('h1').length, 'no h1 (L8)').to.equal(0);
    const cta = block.querySelector('.fic-copy a.fic-cta');
    expect(cta, 'CTA link present with analytics').to.exist;
    expect(cta.getAttribute('daa-ll'), 'CTA tagged for analytics').to.be.a('string');
    // Forge marker stamped on the root.
    expect(block.dataset.forgeAuthored).to.equal(BLOCK);
  });
});
