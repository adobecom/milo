// L22 gate for the authored Milo C2 block forge-get-acrobat-studio-today.
// Runs under Milo's @web/test-runner (browser). Fixtures load INSIDE each it()
// (self-contained; no shared async hook) and images are 1×1 data-URIs so the
// unit server never makes a network request.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-get-acrobat-studio-today.js';

const B = 'forge-get-acrobat-studio-today';

describe('forge-get-acrobat-studio-today', () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs the hero structure from the flat DA content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${B}`);
    await init(block);

    // media + overlay + foreground rebuilt (no empty containers)
    expect(block.querySelector(`.${B}-media img`), 'background image reserved').to.exist;
    expect(block.querySelector(`.${B}-overlay`), 'gradient scrim').to.exist;
    expect(block.querySelectorAll('h1').length, 'exactly one h1').to.equal(1);
    // both CTAs survive, first is the primary
    const btns = block.querySelectorAll(`.${B}-buttons .con-button`);
    expect(btns.length, 'two CTAs').to.equal(2);
    expect(btns[0].classList.contains('primary'), 'first CTA is primary').to.be.true;
    expect(block.dataset.forgeAuthored, 'forge marker').to.equal(B);
  });
});
