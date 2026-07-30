// L22 gate for forge-explore-what-s-new. Runs under Milo's @web/test-runner
// (Chromium). Each it() is self-contained (loads the fixture itself, no shared
// async hook) and the fixture is network-free, so the session never hangs.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-explore-what-s-new.js';

describe('forge-explore-what-s-new', () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs the centered hero header from flat DA content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.forge-explore-what-s-new');
    await init(block);

    // section analytics handle + reconstructed copy container
    expect(block.getAttribute('daa-lh')).to.equal('forge-explore-what-s-new');
    expect(block.querySelector('.fewn-inner .fewn-copy'), 'copy rebuilt').to.exist;

    // EVERY flat CTA became a styled button (grouping count === content count)
    const ctas = block.querySelectorAll('.fewn-actions .fewn-cta');
    expect(ctas.length, 'both CTAs rebuilt').to.equal(2);
    expect(block.querySelectorAll('.fewn-cta--fill').length, 'one primary').to.equal(1);

    // exactly one <h1> (L8) and the copy text is preserved
    expect(block.querySelectorAll('h1').length, 'single h1').to.equal(1);
    expect(block.querySelector('.fewn-eyebrow').textContent).to.contain('Features and Releases');
  });
});
