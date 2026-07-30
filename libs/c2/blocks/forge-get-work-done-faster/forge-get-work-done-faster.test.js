// L22 fixture for the authored Milo C2 block forge-get-work-done-faster.
// Runs under Milo's @web/test-runner (browser). The fixture mirrors the FLAT,
// class-less DA serialization (nav-chrome + CTA labels as bare text, then a
// trailing "Optimized Workflows" caption), so these assertions gate that init()
// RECONSTRUCTS the hero and DROPS the nav chrome — not a green-lie on the
// authored structure. Each it() loads the fixture itself (no shared async hook).
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-get-work-done-faster.js';

const BLOCK = 'forge-get-work-done-faster';

describe(BLOCK, () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs the hero copy from the flat content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);
    expect(block.dataset.forgeAuthored, 'forge marker').to.equal(BLOCK);
    expect(block.querySelector('.hero'), 'hero stage built').to.exist;
    expect(block.querySelectorAll('h2').length, 'exactly one h2').to.equal(1);
    expect(block.querySelector('.hero__heading').textContent).to.contain('Get work done');
    expect(block.querySelector('.hero__eyebrow').textContent).to.contain('Acrobat');
  });

  it('builds both pill CTAs and keeps the background image', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);
    const ctas = block.querySelectorAll('.hero__ctas .hero__cta');
    expect(ctas.length, 'two CTAs rebuilt').to.equal(2);
    expect(ctas[0].textContent).to.contain('Free trial');
    expect(block.querySelector('.hero__bg img'), 'background image preserved').to.exist;
  });

  it('drops the nav chrome and reconstructs the mobile caption', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);
    expect(block.querySelector('a[href="#"]'), 'nav logo link dropped').to.not.exist;
    expect(block.textContent, 'nav "Sign In" chrome dropped').to.not.contain('Sign In');
    expect(block.querySelector('.hero__caption-heading').textContent).to.contain('Everything you need');
  });
});
