// Runs under Milo's @web/test-runner (browser). Each it() loads the fixture
// itself (no shared async hook) and the fixture uses only data-URI images, so
// the session never hangs on a network fetch. Assertions key on the structure
// init() BUILDS (not on foundation=c2 typography classes, which differ between
// the unit runner and production).
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-dark-act.js';

describe('forge-dark-act', () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs the split-media layout from the flat DA content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.forge-dark-act');
    await init(block);
    expect(block.querySelector('.fda-grid'), 'grid container built').to.exist;
    expect(block.querySelector('.fda-copy h2'), 'heading moved into copy column').to.exist;
    expect(block.querySelector('.fda-media picture'), 'media moved into media column').to.exist;
    expect(block.getAttribute('daa-lh'), 'analytics header on block').to.equal('forge-dark-act');
  });

  it('styles the CTA via Milo and preserves the authored image attributes', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.forge-dark-act');
    await init(block);
    const cta = block.querySelector('.fda-copy a[href]');
    expect(cta?.classList.contains('con-button'), 'CTA decorated as con-button').to.be.true;
    expect(cta?.getAttribute('daa-ll'), 'CTA analytics label').to.be.a('string');
    const img = block.querySelector('.fda-media img');
    expect(img?.getAttribute('loading'), 'lazy preserved').to.equal('lazy');
    expect(img?.getAttribute('width'), 'width preserved (CLS)').to.equal('900');
  });
});
