// Gate test for the authored Milo block forge-plans-that-work-for-you.
// Runs under Milo's @web/test-runner (browser); the ship gate scopes to
// libs/c2/blocks/forge-*/**/*.test.js, so a forge block gates on ITS own test.
// Each it() loads the fixture itself (no shared async hook) so the coverage
// session never hangs; the plans section has no <img> so there is no network.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-plans-that-work-for-you.js';

const NAME = 'forge-plans-that-work-for-you';

describe(NAME, () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('rebuilds the flat DA content into the tab + card grid', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${NAME}`);
    expect(block, 'mock body has the block root').to.exist;
    await init(block);

    // reconstruction is gated, not assumed: grid + exactly 4 plan cards + 3 tabs
    expect(block.querySelector('.ptw__cards'), 'card grid built').to.exist;
    expect(block.querySelectorAll('.ptw__card').length, '4 plan cards').to.equal(4);
    expect(block.querySelectorAll('.ptw__tab').length, '3 view tabs').to.equal(3);
    expect(block.querySelectorAll('.ptw__card--dark').length, 'one best-value dark card').to.equal(1);
    expect(block.querySelector('.ptw__compare-btn')?.textContent, 'compare CTA').to.contain('Compare Plans');
    expect(block.dataset.forgeAuthored, 'forge marker').to.equal(NAME);
  });

  it('accounts for every feature token and drops the footer/AI chrome', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${NAME}`);
    await init(block);

    // Acrobat Pro card keeps all 5 of its feature items (no dropped tokens)
    const cards = [...block.querySelectorAll('.ptw__card')];
    expect(cards.some((c) => c.querySelectorAll('.ptw__fitem').length === 5), 'a card lists 5 features').to.equal(true);
    // AI Assistant groups render the gradient mnemonic dot
    expect(block.querySelectorAll('.ptw__ficon--ai').length, 'AI groups present').to.be.greaterThan(0);
    // single responsibility: the trailing AI-search band + footer are NOT rendered
    expect(block.textContent, 'AI-search heading dropped').to.not.contain('Find what you');
    expect(block.querySelector('a'), 'no footer links rendered').to.equal(null);
  });
});
