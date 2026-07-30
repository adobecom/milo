// L22 fixture for the authored Milo C2 block forge-orchestrate-customer-experiences-with-ai.
// Runs under Milo's @web/test-runner (browser). The fixture mirrors the FLAT,
// class-less DA serialization (bare-text CTA/tab labels + a desktop/mobile
// duplicate + a trailing caption), so these assertions gate that init()
// RECONSTRUCTS the hero — and DEDUPES the repeats — rather than passing on a
// green-lie. Each it() loads the fixture itself (no shared async hook).
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-orchestrate-customer-experiences-with-ai.js';

const BLOCK = 'forge-orchestrate-customer-experiences-with-ai';

describe(BLOCK, () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs the hero and dedupes the duplicated copy', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);
    expect(block.dataset.forgeAuthored, 'forge marker').to.equal(BLOCK);
    expect(block.querySelector('.hero'), 'hero stage built').to.exist;
    expect(block.querySelectorAll('h2').length, 'duplicate heading deduped to one').to.equal(1);
    expect(block.querySelector('.hero__heading').textContent).to.contain('Orchestrate customer experiences');
  });

  it('rebuilds one tab-card per authored label (never an empty grid)', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);
    const cards = block.querySelectorAll('.hero__cards .hero__card');
    expect(cards.length, 'five category tabs').to.equal(5);
    const active = block.querySelector('.hero__card.is-active');
    expect(active, 'active tab present').to.exist;
    expect(active.textContent).to.contain('Adobe for Business');
  });

  it('keeps the background image and drops the nav logo link', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);
    expect(block.querySelector('.hero__bg img'), 'background image preserved').to.exist;
    expect(block.querySelector('a[href*="figma.com"]'), 'empty nav logo link dropped').to.not.exist;
    expect(block.querySelector('.hero__caption-heading'), 'mobile caption reconstructed').to.exist;
  });
});
