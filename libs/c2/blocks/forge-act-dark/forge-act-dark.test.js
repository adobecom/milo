// L22 fixture for the authored Milo C2 block forge-act-dark.
// Runs under Milo's @web/test-runner (browser); the ship gate scopes to
// libs/c2/blocks/forge-*/**/*.test.js, so a forge block gates on ITS own test.
// The mock mirrors the REAL class-less DA serialization (flat semantic nodes in
// document order, no .container / .act-dark__media / .act-dark__copy wrappers) so
// these assertions gate the JS reconstruction, not a pre-built layout.
// Fixture images are 1x1 data-URIs (network-free) so the unit server never 404s.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-act-dark.js';

describe('forge-act-dark', () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs the dark split-media layout from flat DA content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.forge-act-dark');
    await init(block);
    // Reconstructed structure exists (not the flat input stack).
    expect(block.querySelector('.container .act-dark__media img')).to.exist;
    // Copy cluster: eyebrow + heading + CTA anchor all rebuilt inside .act-dark__copy.
    expect(block.querySelector('.act-dark__copy .eyebrow')).to.exist;
    expect(block.querySelector('.act-dark__copy a[href]')).to.exist;
    // At most one h1 (this section authors an h3, so zero h1s).
    expect(block.querySelectorAll('h1').length).to.be.at.most(1);
    // Analytics handle + forge marker stamped.
    expect(block.getAttribute('daa-lh')).to.equal('forge-act-dark');
  });
});
