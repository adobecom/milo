// L22 fixture for the authored Milo C2 block forge-get-acrobat-studio-today.
// Runs under Milo's @web/test-runner (browser). The ship gate scopes to
// libs/c2/blocks/forge-*/**/*.test.js, so this block gates on ITS own test.
// Each it() loads the class-less DA fixture itself (self-contained, no shared
// async hook) and asserts init() RECONSTRUCTED the rich hero from flat content.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-get-acrobat-studio-today.js';

const BLOCK = 'forge-get-acrobat-studio-today';

describe(BLOCK, () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('rebuilds the centred hero lockup from the flat DA content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);
    expect(block.dataset.forgeAuthored, 'forge marker stamped').to.equal(BLOCK);
    expect(block.querySelector('.gast-foreground'), 'foreground container built').to.exist;
    expect(block.querySelectorAll('h1').length, 'exactly one h1').to.equal(1);
    expect(block.querySelector('.gast-copy .gast-eyebrow'), 'eyebrow routed into copy').to.exist;
    const ctas = block.querySelectorAll('.gast-actions .gast-cta');
    expect(ctas.length, 'both CTAs reconstructed').to.equal(2);
  });

  it('renders placeholder-href CTAs as keyboard-safe buttons', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);
    const ctas = block.querySelectorAll('.gast-actions .gast-cta');
    expect(ctas[0].tagName, 'href="#" CTA becomes a <button>').to.equal('BUTTON');
    expect(ctas[0].classList.contains('gast-cta--primary'), 'first CTA is primary').to.be.true;
    expect(ctas[1].classList.contains('gast-cta--secondary'), 'second CTA is secondary').to.be.true;
    expect(block.querySelector('.gast-cta-block .gast-price'), 'price routed into CTA block').to.exist;
  });
});
