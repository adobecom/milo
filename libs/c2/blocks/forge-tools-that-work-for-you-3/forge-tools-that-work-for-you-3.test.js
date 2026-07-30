// L22 gate for the authored Milo block forge-tools-that-work-for-you-3.
// Runs under Milo's @web/test-runner (browser). The fixture is loaded INSIDE
// each it() (self-contained, no shared async hook) and is network-free.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-tools-that-work-for-you-3.js';

describe('forge-tools-that-work-for-you-3', () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs the hero lockup from the flat DA content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.forge-tools-that-work-for-you-3');
    await init(block);

    // The lockup was rebuilt (C24): a foreground wrapping a copy column and a
    // populated action area — not the flat, class-less run it received.
    const foreground = block.querySelector('.foreground');
    expect(foreground, 'foreground rebuilt').to.exist;
    expect(foreground.querySelector('.copy .title').tagName).to.equal('H2');
    expect(foreground.querySelector('.copy .subtitle')?.textContent).to.contain('Bring any idea');
    const cta = foreground.querySelector('.action-area a.cta');
    expect(cta, 'outline pill CTA in action area').to.exist;
    expect(cta.classList.contains('con-button')).to.equal(true);
    expect(block.dataset.forgeAuthored).to.equal('forge-tools-that-work-for-you-3');
  });
});
