// L22 gate for the authored Milo C2 block forge-work-smarter-than-ever-with-documents.
// Runs under Milo's @web/test-runner (browser). Each it() loads the class-less
// DA-serialized fixture ITSELF (no shared hook) and asserts init() RECONSTRUCTED
// the rich 3-up use-case card grid from the flat content — so a regression to the
// empty-grid / dropped-card bug fails this gate, not the user's eyes.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-work-smarter-than-ever-with-documents.js';

const B = 'forge-work-smarter-than-ever-with-documents';

describe('forge-work-smarter-than-ever-with-documents', () => {
  it('exports a callable async init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs a 3-up card grid from the flat content (one card per heading)', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${B}`);
    await init(block);
    expect(block.querySelector(`.${B}-grid`), 'grid container built').to.exist;
    expect(block.querySelectorAll(`.${B}-card`).length, 'one card per heading').to.equal(3);
    expect(block.querySelectorAll(`.${B}-media`).length, 'every card has a media panel').to.equal(3);
    expect(block.querySelectorAll(`.${B}-hero-img`).length, 'every card has a hero image').to.equal(3);
    expect(block.querySelectorAll(`.${B}-title`).length, 'every card has a promoted heading').to.equal(3);
  });

  it('overlays app badges + pill chips and preserves every authored picture', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${B}`);
    await init(block);
    // 2 B_app_* badges (Acrobat, Firefly); 3 pill chips (PDF Spaces, Generate, Harmonize).
    expect(block.querySelectorAll(`.${B}-appicon`).length, 'app-mnemonic badges overlaid').to.equal(2);
    expect(block.querySelectorAll(`.${B}-chip`).length, 'pill chip labels overlaid').to.equal(3);
    // 9 authored pictures in, 9 out — nothing dropped (heroes + overlays + badges).
    expect(block.querySelectorAll('picture').length, 'no authored picture dropped').to.equal(9);
    expect(block.querySelectorAll(`.${B}-overlay`).length, 'extra card-1 visuals kept as overlays').to.equal(4);
  });

  it('builds a chevroned CTA per card and stamps analytics', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${B}`);
    await init(block);
    const ctas = block.querySelectorAll(`.${B}-cta`);
    expect(ctas.length, 'one CTA per card').to.equal(3);
    expect(ctas[0].querySelector('svg'), 'CTA has a chevron').to.exist;
    expect(ctas[0].getAttribute('daa-ll'), 'CTA carries analytics label').to.contain(B);
    expect(block.getAttribute('daa-lh')).to.equal(B);
    expect(block.dataset.forgeAuthored).to.equal(B);
  });
});
