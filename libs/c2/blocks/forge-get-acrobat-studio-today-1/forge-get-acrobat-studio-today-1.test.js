// L22 fixture test for the authored Milo C2 block forge-get-acrobat-studio-today-1.
// Runs under Milo's @web/test-runner (browser). Each it() loads its own fixture
// (no shared before/beforeEach hook) and the fixture is network-free (no <img>).
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-get-acrobat-studio-today-1.js';

const FIXTURE = './mocks/body.html';

describe('forge-get-acrobat-studio-today-1', () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs the lockup from the flat, class-less DA content', async () => {
    document.body.innerHTML = await readFile({ path: FIXTURE });
    const block = document.querySelector('.forge-get-acrobat-studio-today-1');
    await init(block);
    // The rebuilt structure exists (grid/lockup container present, not an empty stack).
    const foreground = block.querySelector('.foreground');
    expect(foreground, 'rebuilt .foreground container present').to.exist;
    expect(foreground.querySelector('.copy .eyebrow'), 'eyebrow promoted').to.exist;
    // Exactly one heading, promoted to C2 typography; no stray h1 (L8).
    expect(block.querySelectorAll('h1').length).to.equal(0);
    expect(block.querySelector('h2.heading-2'), 'heading promoted to heading-2').to.exist;
  });

  it('rebuilds both CTA pills (count equals authored links)', async () => {
    document.body.innerHTML = await readFile({ path: FIXTURE });
    const block = document.querySelector('.forge-get-acrobat-studio-today-1');
    await init(block);
    const buttons = block.querySelectorAll('.button-group .con-button');
    expect(buttons.length, 'two CTA pills rebuilt').to.equal(2);
    expect(block.getAttribute('daa-lh')).to.equal('forge-get-acrobat-studio-today-1');
  });
});
