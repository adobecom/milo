// Unit test for the authored Milo C2 block forge-get-acrobat-studio-today.
// Runs under Milo's @web/test-runner (browser). Each it() loads the class-less
// DA fixture itself (no shared async hook) and asserts init() REBUILT the rich
// hero structure from the flat content — so a regression to a flat stack fails.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-get-acrobat-studio-today.js';

const BLOCK = 'forge-get-acrobat-studio-today';

describe(BLOCK, () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs the centered hero lockup from the flat DA content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);
    expect(block.dataset.forgeAuthored, 'forge marker stamped').to.equal(BLOCK);
    expect(block.getAttribute('daa-lh'), 'section analytics handle').to.equal(BLOCK);
    const lockup = block.querySelector(`.${BLOCK}__lockup`);
    expect(lockup, 'reconstructed lockup container exists').to.exist;
    const h1 = lockup.querySelector(`h1.${BLOCK}__title`);
    expect(h1?.textContent, 'headline preserved').to.contain('Get Acrobat Studio today.');
    expect(lockup.querySelector(`.${BLOCK}__eyebrow`), 'eyebrow present').to.exist;
  });

  it('rebuilds one CTA per authored action with tagged variants', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);
    const ctas = block.querySelectorAll(`.${BLOCK}__actions .${BLOCK}__cta`);
    expect(ctas.length, 'both CTAs rebuilt (no dropped/empty action)').to.equal(2);
    expect(block.querySelector(`.${BLOCK}__cta--fill`), 'primary is filled').to.exist;
    expect(block.querySelector(`.${BLOCK}__cta--outline`), 'secondary is outlined').to.exist;
    expect(ctas[0].getAttribute('daa-ll'), 'CTA analytics label').to.contain(BLOCK);
    expect(block.querySelector(`.${BLOCK}__price`)?.textContent, 'price line preserved').to.contain('US$24.99');
  });
});
