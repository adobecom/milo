// Runs under Milo's @web/test-runner (browser). The ship gate scopes to
// libs/c2/blocks/forge-*/**/*.test.js, so this block gates on ITS own test.
// Each it() loads the class-less DA fixture itself (no shared async hook) and the
// fixture images are 1x1 data-URIs (network-free) so the session never churns.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-create-beautifully.js';

describe('forge-create-beautifully', () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs the showcase grid + copy panels from flat content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.forge-create-beautifully');
    await init(block);
    expect(block.dataset.forgeAuthored, 'forge marker').to.equal('forge-create-beautifully');
    expect(block.querySelector('.forge-create-beautifully__inner'), 'inner wrapper').to.exist;
    expect(block.querySelectorAll('.fcb-grid').length, 'card grids').to.be.greaterThan(1);
    expect(block.querySelectorAll('.fcb-card').length, 'document cards').to.be.greaterThan(3);
    expect(block.querySelector('.fcb-copy .fcb-heading'), 'copy heading').to.exist;
  });

  it('builds the Test drive CTA region and tags analytics', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.forge-create-beautifully');
    await init(block);
    const cta = block.querySelector('.fcb-try .fcb-cta--solid');
    expect(cta, 'solid CTA button').to.exist;
    expect(cta.tagName, 'CTA is a button, not a fake link').to.equal('BUTTON');
    expect(block.getAttribute('daa-lh'), 'section analytics handle').to.equal('forge-create-beautifully');
    expect(cta.hasAttribute('daa-ll'), 'CTA analytics label').to.be.true;
  });
});
