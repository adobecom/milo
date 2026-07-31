// L22 gate for the authored Milo C2 block forge-introducing-color-mode.
// Runs under Milo's @web/test-runner (browser). Each it() loads the class-less
// DA-serialized fixture itself (no shared hook) and asserts init() RECONSTRUCTED
// the rich media-card structure from the flat content.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-introducing-color-mode.js';

const B = 'forge-introducing-color-mode';

describe('forge-introducing-color-mode', () => {
  it('exports a callable async init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('rebuilds the media panel with hero image + app-mnemonic badge', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${B}`);
    await init(block);
    expect(block.querySelector(`.${B}-foreground`), 'foreground container built').to.exist;
    expect(block.querySelector(`.${B}-media`), 'media panel built').to.exist;
    expect(block.querySelector(`.${B}-hero-img`), 'hero image carries its own scoped class').to.exist;
    expect(block.querySelector(`.${B}-badge-img`), 'app badge image carries its own scoped class').to.exist;
    expect(block.querySelectorAll(`.${B}-media img`).length).to.equal(2);
  });

  it('rebuilds the copy row (heading + body + CTA) and stamps analytics', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${B}`);
    await init(block);
    expect(block.querySelector(`.${B}-copy h2`), 'headline moved into copy column').to.exist;
    expect(block.querySelector(`.${B}-copy p`), 'body copy in column').to.exist;
    const cta = block.querySelector(`a.${B}-cta`);
    expect(cta, 'CTA is an anchor with the cta class').to.exist;
    expect(cta.querySelector('svg'), 'CTA has a chevron').to.exist;
    expect(block.getAttribute('daa-lh')).to.equal(B);
    expect(block.dataset.forgeAuthored).to.equal(B);
  });
});
