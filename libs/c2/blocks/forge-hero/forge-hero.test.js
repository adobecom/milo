// L22 fixture for the authored Milo C2 block forge-hero.
// Runs under Milo's @web/test-runner (browser); the ship gate scopes to
// libs/c2/blocks/forge-*/**/*.test.js, so a forge block gates on ITS own test.
// The mock mirrors the REAL class-less DA serialization (flat semantic nodes in
// document order, no .container/.hero__lead/.hero__media wrappers) so these
// assertions gate the JS reconstruction, not a pre-built layout.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-hero.js';

describe('forge-hero', () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs the split-media layout from flat DA content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.forge-hero');
    await init(block);
    // Reconstructed structure exists (not the flat input stack).
    expect(block.querySelector('.container .hero__lead')).to.exist;
    expect(block.querySelector('.container .hero__media img')).to.exist;
    // Exactly one h1, and the featured cluster (eyebrow + h2 + CTA anchor) rebuilt.
    expect(block.querySelectorAll('h1')).to.have.lengthOf(1);
    expect(block.querySelector('.featured .featured__title')).to.exist;
    expect(block.querySelector('.featured a[href]')).to.exist;
    // Analytics handle + forge marker stamped.
    expect(block.getAttribute('daa-lh')).to.equal('forge-hero');
  });
});
