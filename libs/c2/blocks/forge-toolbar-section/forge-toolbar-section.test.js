// Test for the authored Milo block forge-toolbar-section.
// Runs under Milo's @web/test-runner (browser); the ship gate scopes to
// libs/c2/blocks/forge-*/**/*.test.js, so a forge block gates on ITS own test.
// Each it() loads the class-less DA fixture itself (self-contained, no shared
// async hook) and asserts init() RECONSTRUCTED the toolbar from the flat content.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-toolbar-section.js';

describe('forge-toolbar-section', () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('rebuilds the toolbar (title + one button per label, last is dark)', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.forge-toolbar-section');
    expect(block, 'mock body has the block root').to.exist;

    await init(block);

    // Reconstructed toolbar bar + title (title demoted off h1 for page outline).
    const toolbar = block.querySelector('.section-inner .feds-toolbar');
    expect(toolbar, 'reconstructed toolbar bar').to.exist;
    expect(toolbar.querySelector('.toolbar-title')?.textContent.trim()).to.equal('Feds Promobar');
    expect(block.querySelectorAll('h1').length).to.equal(0);

    // One button per authored label (5); the last one is the dark primary.
    const buttons = toolbar.querySelectorAll('.toolbar-buttons .action-button');
    expect(buttons.length).to.equal(5);
    expect(buttons[buttons.length - 1].classList.contains('is-dark')).to.equal(true);

    // Reconstruction marker.
    expect(block.dataset.forgeAuthored).to.equal('forge-toolbar-section');
  });
});
