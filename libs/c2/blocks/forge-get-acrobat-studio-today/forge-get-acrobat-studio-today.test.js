// L22 fixture test for the authored Milo C2 block forge-get-acrobat-studio-today.
// Runs under Milo's @web/test-runner (browser). Each it() loads the fixture
// itself (no shared async hook) and keeps to a handful of focused assertions,
// so the coverage gate never hangs the session.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-get-acrobat-studio-today.js';

const BLOCK = 'forge-get-acrobat-studio-today';

describe('forge-get-acrobat-studio-today', () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs the hero from the flat DA content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);
    // The rebuilt centred column exists and carries exactly one h1 (L8).
    expect(block.querySelector(`.${BLOCK}__foreground`), 'foreground column').to.exist;
    expect(block.querySelectorAll('h1').length, 'single h1').to.equal(1);
    // Eyebrow, price and both CTAs were probed + rebuilt from the flat run.
    expect(block.querySelector(`.${BLOCK}__eyebrow`), 'eyebrow').to.exist;
    expect(block.querySelector(`.${BLOCK}__price`), 'price').to.exist;
    expect(block.querySelectorAll(`.${BLOCK}__cta`).length, 'two CTAs').to.equal(2);
    expect(block.dataset.forgeAuthored, 'forge marker').to.equal(BLOCK);
  });
});
