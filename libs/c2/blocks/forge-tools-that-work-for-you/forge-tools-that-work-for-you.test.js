// L22 gate for the authored Milo C2 block forge-tools-that-work-for-you.
// Runs under Milo's @web/test-runner (real browser). The fixture is loaded
// INSIDE each it() (self-contained, no shared async hook) and every image is a
// data-URI, so nothing touches the network and the session never hangs.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-tools-that-work-for-you.js';

const BLOCK = 'forge-tools-that-work-for-you';

describe(BLOCK, () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('rebuilds the hero layer stack and the CTA pill row from flat DA content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);
    // Rich structure rebuilt from the flat run (background photo + copy lockup).
    expect(block.querySelector('.background img'), 'background photo layer').to.exist;
    expect(block.querySelector('.foreground .copy h2'), 'headline in copy lockup').to.exist;
    // Anti empty-container gate: the authored CTA survived into one pill row.
    expect(block.querySelectorAll('.button-group .con-button').length).to.equal(1);
    expect(block.querySelectorAll('h1').length).to.be.at.most(1);
    expect(block.dataset.forgeAuthored).to.equal(BLOCK);
  });
});
