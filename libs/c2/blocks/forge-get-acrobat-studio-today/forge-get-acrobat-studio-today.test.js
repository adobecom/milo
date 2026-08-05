// L22 fixture for the authored Milo C2 block forge-get-acrobat-studio-today.
// Runs under Milo's @web/test-runner (browser). Each it() is self-contained and
// loads the network-free fixture itself (no shared async hook that can hang the
// session). Assertions gate the RECONSTRUCTION so a regression to a flat stack
// fails the gate, not the user's eyes.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-get-acrobat-studio-today.js';

const BLOCK = 'forge-get-acrobat-studio-today';

describe('forge-get-acrobat-studio-today', () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs the full-bleed hero from the flat DA content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);

    // Background media layer built from the leading <picture> (not a flat stack).
    expect(block.querySelector(`.${BLOCK}-bg picture, .${BLOCK}-bg img`), 'background media layer').to.exist;
    // Exactly one h1, promoted inside the centred headline lockup.
    expect(block.querySelectorAll('h1').length, 'single h1 in lockup').to.equal(1);
    expect(block.querySelector(`.${BLOCK}-headline .${BLOCK}-heading`), 'heading in lockup').to.exist;
    // Two pill CTAs (primary + secondary) + the price line survived the rebuild.
    expect(block.querySelectorAll(`.${BLOCK}-buttons .${BLOCK}-button`).length, 'two CTA buttons').to.equal(2);
    expect(block.querySelector(`.${BLOCK}-price`), 'price line').to.exist;
  });
});
