// Web-test-runner (browser) gate for the Milo C2 block forge-get-acrobat-studio-today.
// Each it() loads the class-less DA fixture itself (no shared async hook) and
// asserts init() RECONSTRUCTED the hero from the flat content.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-get-acrobat-studio-today.js';

const BLOCK = 'forge-get-acrobat-studio-today';

describe(BLOCK, () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs the hero structure from the flat content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);
    expect(block.getAttribute('daa-lh'), 'block analytics handle').to.equal(BLOCK);
    expect(block.dataset.forgeAuthored, 'forge marker').to.equal(BLOCK);
    expect(block.querySelector('.media picture'), 'background media rebuilt').to.exist;
    expect(block.querySelector('.overlay'), 'gradient scrim rebuilt').to.exist;
    expect(block.querySelector('.foreground .content'), 'foreground column rebuilt').to.exist;
    expect(block.querySelectorAll('h1').length, 'exactly one h1').to.equal(1);
  });

  it('classifies the text run into eyebrow / heading / description / price', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);
    expect(block.querySelector('.text .eyebrow')?.textContent).to.contain('Acrobat Studio');
    expect(block.querySelector('.text .heading')?.tagName).to.equal('H1');
    expect(block.querySelector('.text .description')?.textContent).to.contain('e-signature');
    expect(block.querySelector('.actions .price')?.textContent).to.contain('$24.99');
  });

  it('builds two decorated CTA buttons with analytics labels', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);
    const ctas = block.querySelectorAll('.buttons a');
    expect(ctas.length, 'two CTAs').to.equal(2);
    expect(ctas[0].classList.contains('con-button'), 'primary is a con-button').to.be.true;
    expect(ctas[0].classList.contains('blue'), 'primary is solid').to.be.true;
    expect(ctas[1].classList.contains('outline'), 'secondary is outline').to.be.true;
    expect([...ctas].every((a) => a.hasAttribute('daa-ll')), 'every CTA is tagged').to.be.true;
  });
});
