// forge-contact — L22 test fixture. Runs under Milo's @web/test-runner (browser);
// the ship gate scopes to libs/c2/blocks/forge-*/**/*.test.js, so this forge block
// gates on ITS own test. Each it() is self-contained (loads the fixture itself,
// no shared async hook) and network-free (fixture images are data-URIs).
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-contact.js';

describe('forge-contact', () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs the contact structure from flat DA content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.forge-contact');
    await init(block);
    expect(block.querySelector('.forge-contact__container'), 'container built').to.exist;
    expect(block.querySelector('.forge-contact__icon'), 'icon wrapper built').to.exist;
    expect(block.querySelectorAll('.forge-contact__route').length, 'three route links').to.equal(3);
    expect(block.querySelectorAll('h1').length, 'no h1 in block').to.equal(0);
  });

  it('wires analytics and keeps the inquiry mailto links in the paragraph', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.forge-contact');
    await init(block);
    expect(block.getAttribute('daa-lh')).to.equal('forge-contact');
    expect(block.dataset.forgeAuthored).to.equal('forge-contact');
    const inquiries = block.querySelector('.forge-contact__inquiries');
    expect(inquiries, 'inquiries paragraph present').to.exist;
    expect(inquiries.querySelectorAll('a[href^="mailto:"]').length, 'both mailto links preserved').to.equal(2);
  });
});
