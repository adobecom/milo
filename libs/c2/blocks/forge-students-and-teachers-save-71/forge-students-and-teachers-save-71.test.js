// Test for the authored Milo block forge-students-and-teachers-save-71.
// Runs under Milo's @web/test-runner (browser); the ship gate scopes to
// libs/c2/blocks/forge-*/**/*.test.js, so a forge block gates on ITS own test.
// The fixture mirrors the FLAT, class-less DA serialization (bare text labels +
// h2/p/picture, desktop+mobile duplicated) — the real runtime shape — so these
// assertions gate that init() reconstructs the hero rather than passing a lie.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-students-and-teachers-save-71.js';

const BLOCK = 'forge-students-and-teachers-save-71';

describe('forge-students-and-teachers-save-71', () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs the hero from the flat DA cell', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);
    // De-dupes the doubled desktop/mobile heading down to one h2, no h1.
    expect(block.querySelectorAll('h1').length).to.equal(0);
    expect(block.querySelectorAll('h2').length).to.equal(1);
    // Rebuilds the 5-tab router and the two hero CTAs from bare text nodes.
    expect(block.querySelectorAll('.s2t-tab[role="tab"]').length).to.equal(5);
    expect(block.querySelectorAll('.s2t-ctas .s2t-cta').length).to.equal(2);
    // Drops the "Sign In" nav-chrome token; stamps the forge marker + daa-lh.
    expect(block.textContent.includes('Sign In')).to.equal(false);
    expect(block.dataset.forgeAuthored).to.equal(BLOCK);
  });
});
