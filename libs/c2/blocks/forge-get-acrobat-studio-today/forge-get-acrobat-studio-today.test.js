// L22 test for the Forge-authored Milo C2 block forge-get-acrobat-studio-today.
// Runs under Milo's @web/test-runner (browser). The fixture is the CLASS-LESS
// flat DA serialization; each it() loads it inline (no shared hook) and asserts
// that init() RECONSTRUCTED the centred hero lockup from that flat content.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-get-acrobat-studio-today.js';

describe('forge-get-acrobat-studio-today', () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs the centred hero lockup from flat content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.forge-get-acrobat-studio-today');
    await init(block);
    expect(block.getAttribute('daa-lh')).to.equal('forge-get-acrobat-studio-today');
    expect(block.querySelector('.foreground > .content'), 'foreground/content built').to.exist;
    expect(block.querySelectorAll('h1').length, 'exactly one h1').to.equal(1);
    expect(block.querySelector('.text-group h1.headline'), 'headline in text group').to.exist;
    expect(block.querySelector('.text-group .eyebrow'), 'eyebrow present').to.exist;
    expect(block.querySelector('.text-group .copy'), 'sub-copy present').to.exist;
  });

  it('builds the price and two distinct pill CTAs', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.forge-get-acrobat-studio-today');
    await init(block);
    expect(block.querySelector('.cta-group .price'), 'price present').to.exist;
    const ctas = block.querySelectorAll('.action-area .cta');
    expect(ctas.length, 'two CTAs rebuilt').to.equal(2);
    expect(ctas[0].classList.contains('primary'), 'first CTA is primary').to.be.true;
    expect(ctas[1].classList.contains('secondary'), 'second CTA is secondary').to.be.true;
    expect(ctas[0].getAttribute('daa-ll'), 'first CTA tagged').to.equal('free-trial');
  });
});
