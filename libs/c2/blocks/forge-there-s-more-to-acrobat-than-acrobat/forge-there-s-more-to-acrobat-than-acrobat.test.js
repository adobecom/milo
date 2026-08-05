// L22 fixture test for the authored Milo C2 block forge-there-s-more-to-acrobat-than-acrobat.
// Runs under Milo's @web/test-runner (browser). Each it() loads the class-less DA
// serialization (mocks/body.html) itself — no shared before/beforeEach hook — and
// asserts init() RECONSTRUCTED the bento from the flat content (gates the empty-grid
// regression: card count must equal the fixture's <picture> count).
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-there-s-more-to-acrobat-than-acrobat.js';

const BLOCK = 'forge-there-s-more-to-acrobat-than-acrobat';

describe(BLOCK, () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs the two-card bento from the flat DA content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);
    expect(block.querySelector('.jtbd-inner'), 'rich wrapper built').to.exist;
    expect(block.querySelector('.jtbd-cards-row'), 'cards grid built').to.exist;
    // one card per authored <picture> — never an empty grid.
    expect(block.querySelectorAll('.jtbd-card').length).to.equal(2);
    expect(block.querySelector('.jtbd-card--overlay'), 'overlay card').to.exist;
    expect(block.querySelector('.jtbd-card--panel'), 'panel card').to.exist;
  });

  it('preserves media/CTA and stamps analytics + the forge marker', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);
    expect(block.querySelectorAll('picture img').length, 'both images preserved').to.equal(2);
    expect(block.querySelector('.jtbd-cta'), 'learn-more CTA built').to.exist;
    expect(block.getAttribute('daa-lh')).to.equal(BLOCK);
    expect(block.querySelector('img[daa-im]'), 'image analytics tagged').to.exist;
    expect(block.dataset.forgeAuthored).to.equal(BLOCK);
  });
});
