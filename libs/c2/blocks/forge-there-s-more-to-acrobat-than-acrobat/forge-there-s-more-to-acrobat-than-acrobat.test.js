// Smoke + reconstruction test for the authored Milo C2 block
// forge-there-s-more-to-acrobat-than-acrobat. Runs under Milo's @web/test-runner
// (browser). Each it() is self-contained (loads the network-free fixture inline,
// no shared before/beforeEach hook) so the coverage session never hangs.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-there-s-more-to-acrobat-than-acrobat.js';

const BLOCK = 'forge-there-s-more-to-acrobat-than-acrobat';

describe(BLOCK, () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs the two-column layout from flat DA content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);
    // Grid container + both columns were rebuilt (not an empty grid).
    expect(block.querySelector(`.${BLOCK}-cols`), 'row container').to.exist;
    expect(block.querySelectorAll(`.${BLOCK}-left picture`).length, 'left photo card').to.equal(1);
    expect(block.querySelectorAll(`.${BLOCK}-right-media picture`).length, 'right screenshot card').to.equal(1);
    // Copy was stamped and the CTA became a real anchor with a chevron.
    expect(block.querySelector(`.${BLOCK}-headline`), 'headline').to.exist;
    const cta = block.querySelector(`a.${BLOCK}-cta`);
    expect(cta && cta.querySelector('svg'), 'learn-more link + chevron').to.exist;
    expect(block.dataset.forgeAuthored, 'forge marker').to.equal(BLOCK);
  });
});
