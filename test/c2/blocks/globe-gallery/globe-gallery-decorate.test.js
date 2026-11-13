import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../../libs/utils/utils.js';
import init, { parseAuthoredContent } from '../../../../libs/c2/blocks/globe-gallery/globe-gallery.js';

setConfig({ codeRoot: '/libs' });

const DEFAULT_HINT = 'Click and drag to rotate. Tap to dive deep into the artwork.';

async function loadBlock(mock = 'empty') {
  document.body.innerHTML = await readFile({ path: `./mocks/${mock}.html` });
  const block = document.querySelector('.globe-gallery');
  const authored = parseAuthoredContent(block);
  const result = await init(block);
  return { block, authored, result };
}

describe('C2 globe gallery', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('decorates a block with no rows and marks it empty without a runtime', async () => {
    const { block, result } = await loadBlock();
    expect(result).to.equal(block);
    expect(block.classList.contains('globe-empty')).to.be.true;
    expect(block.globeRuntime).to.be.undefined;
    expect(block.querySelectorAll('canvas')).to.have.length(2);
    expect(block.querySelector('.globe-canvas').parentElement)
      .to.equal(block.querySelector('.globe-world'));
    expect(block.querySelector('.globe-modal-canvas')).to.exist;
    expect(block.querySelector('.globe-pullquote-pin')).to.be.null;
  });

  it('builds rotation and spin controls with default labels and analytics', async () => {
    const { block } = await loadBlock();
    const left = block.querySelector('.globe-rotate[data-dir="-1"]');
    const right = block.querySelector('.globe-rotate[data-dir="1"]');
    const spin = block.querySelector('.globe-spin-toggle');
    expect(left.getAttribute('aria-label')).to.equal('Rotate left');
    expect(right.getAttribute('aria-label')).to.equal('Rotate right');
    expect(spin.getAttribute('aria-label')).to.equal('Pause spinning');
    expect(left.getAttribute('daa-ll')).to.equal('rotate_left--globe_gallery');
    expect(right.getAttribute('daa-ll')).to.equal('rotate_right--globe_gallery');
    expect(spin.getAttribute('daa-ll')).to.equal('pause_spin--globe_gallery');
    expect(block.querySelectorAll('button')).to.have.length(6);
    block.querySelectorAll('button').forEach((button) => {
      expect(button.getAttribute('type')).to.equal('button');
    });
  });

  ['empty', 'default'].forEach((mock) => {
    it(`uses hint and accessibility defaults with ${mock} authoring`, async () => {
      const { block, authored } = await loadBlock(mock);
      expect(block.querySelector('.globe-hint-text').textContent).to.equal(DEFAULT_HINT);
      expect(authored.touchHint.paras).to.have.length(0);
      expect(authored.hintText).to.equal('Click & Drag');
      expect(authored.fragmentHref).to.be.null;
      expect(authored.pullQuote).to.be.null;
      expect(authored.instructions)
        .to.equal('Press Enter to enter the gallery, then Tab through the images.');
      expect(authored.labels.resumeSpin).to.equal('Resume spinning');
      expect(authored.labels.cardLabel(2, 12)).to.equal('2 of 12');
      expect(block.querySelector('.globe-arc-copy-title').textContent).to.equal('');
      expect(block.querySelector('.globe-arc-copy-body').children).to.have.length(0);
    });
  });

  it('builds modal scaffolding with linked accessibility attributes and no CTA', async () => {
    const { block } = await loadBlock();
    const modal = block.querySelector('.globe-modal');
    expect(modal.getAttribute('aria-hidden')).to.equal('true');
    expect(modal.querySelector('.globe-modal-backdrop')).to.exist;
    const dialog = block.querySelector('dialog.globe-modal-chrome');
    const name = dialog.querySelector('h2.globe-modal-name');
    expect(name.getAttribute('tabindex')).to.equal('-1');
    expect(name.hasAttribute('autofocus')).to.be.true;
    name.getAttribute('aria-describedby').split(' ').forEach((id) => {
      expect(block.querySelector(`#${id}`)).to.exist;
    });
    expect(dialog.querySelector('.globe-modal-description').getAttribute('role'))
      .to.equal('document');
    expect(dialog.querySelector('ul.globe-modal-badges')).to.exist;
    expect(dialog.querySelector('.globe-modal-image').getAttribute('role')).to.equal('img');
    expect(dialog.querySelector('.globe-modal-counter').getAttribute('aria-hidden'))
      .to.equal('true');
    expect(dialog.querySelector('.globe-modal-announce').getAttribute('aria-live'))
      .to.equal('polite');
    expect(dialog.querySelector('[class*="cta"]')).to.be.null;
    const prev = dialog.querySelector('.globe-modal-nav-prev');
    const next = dialog.querySelector('.globe-modal-nav-next');
    const close = dialog.querySelector('.globe-modal-close');
    expect(prev.getAttribute('aria-label')).to.equal('Previous card');
    expect(next.getAttribute('aria-label')).to.equal('Next card');
    expect(close.getAttribute('aria-label')).to.equal('Close');
    expect(prev.getAttribute('daa-ll')).to.equal('prev_card-1--globe_card_modal');
    expect(next.getAttribute('daa-ll')).to.equal('next_card-2--globe_card_modal');
    expect(close.getAttribute('daa-ll')).to.equal('close-3--globe_card_modal');
  });

  it('moves authored arc copy and hint paragraphs into the decorated block', async () => {
    const { block, authored } = await loadBlock('heading-quote');
    expect(block.querySelector('.globe-arc-copy-title').textContent)
      .to.equal('Meet our creative community');
    const body = block.querySelector('.globe-arc-copy-body');
    expect(body.classList.contains('body-md')).to.be.true;
    expect([...body.children]).to.deep.equal(authored.arcCopy.body);
    expect(body.querySelector('p strong').textContent).to.equal('original artwork');
    expect(body.textContent).to.include('Every image tells a story.');
    const hint = block.querySelector('.globe-hint-text');
    expect([...hint.children]).to.deep.equal(authored.touchHint.paras);
    expect([...hint.querySelectorAll('p')].map((p) => p.textContent))
      .to.deep.equal(['Drag to explore.', 'Select an artwork.']);
    expect(authored.hintText).to.equal('Click & Drag');
  });

  it('renders a heading pull quote with its attribution', async () => {
    const { block, authored } = await loadBlock('heading-quote');
    expect(authored.pullQuote).to.deep.equal({
      quote: 'Creativity connects us.',
      name: 'Alex Rivera',
      role: 'Designer',
    });
    const figure = block.querySelector('.globe-pullquote-pin figure.globe-pullquote');
    const quote = figure.querySelector('blockquote.globe-pullquote-quote');
    expect(quote.classList.contains('heading-1')).to.be.true;
    expect(quote.textContent).to.equal('Creativity connects us.');
    expect(figure.querySelector('.globe-pullquote-name').textContent).to.equal('Alex Rivera');
    expect(figure.querySelector('.globe-pullquote-role').textContent).to.equal('Designer');
  });

  it('uses the first paragraph as the quote when no heading is authored', async () => {
    const { block } = await loadBlock('paragraph-quote');
    expect(block.querySelector('.globe-pullquote-quote').textContent)
      .to.equal('Everyone has a story to tell.');
    expect(block.querySelector('.globe-pullquote-name').textContent).to.equal('Sam Lee');
    expect(block.querySelector('.globe-pullquote-role').textContent).to.equal('Photographer');
  });

  it('keeps an empty pull quote pin when row 4 is authored without content', async () => {
    const { block, authored } = await loadBlock('empty-quote');
    expect(authored.pullQuote).to.deep.equal({ quote: '', name: '', role: '' });
    expect(block.querySelector('.globe-pullquote-pin')).to.exist;
    expect(block.querySelector('.globe-pullquote-quote').textContent).to.equal('');
  });

  it('falls back to a paragraph title, plain-text hints, and escaped localized labels', async () => {
    const { block, authored } = await loadBlock('localized');
    expect(block.querySelector('.globe-arc-copy-title').textContent)
      .to.equal('Galerie mondiale');
    const body = block.querySelector('.globe-arc-copy-body');
    expect(body.children).to.have.length(1);
    expect(body.textContent).to.equal('Découvrez des œuvres.');
    expect(body.querySelector('img')).to.be.null;
    expect(block.querySelector('.globe-hint-text').textContent)
      .to.equal('Faites glisser pour explorer.');
    expect(authored.hintText).to.equal('Glisser');
    expect(authored.instructions).to.equal('Entrez dans la galerie');
    expect(authored.labels.cardLabel(3, 9)).to.equal('Image 3 sur 9');
    expect(block.querySelector('.globe-rotate[data-dir="-1"]').getAttribute('aria-label'))
      .to.equal('Gauche & avant');
    expect(block.querySelector('.globe-rotate[data-dir="1"]').getAttribute('aria-label'))
      .to.equal('Droite "suivante"');
    expect(block.querySelector('.globe-spin-toggle').getAttribute('aria-label'))
      .to.equal('Pause');
    expect(block.querySelector('.globe-modal-nav-prev').getAttribute('aria-label'))
      .to.equal('Précédent');
    expect(block.querySelector('.globe-modal-nav-next').getAttribute('aria-label'))
      .to.equal('Suivant');
    expect(block.querySelector('.globe-modal-close').getAttribute('aria-label'))
      .to.equal('<Fermer>');
    expect(block.querySelectorAll('.globe-modal-close')).to.have.length(1);
  });

  it('falls back to the default card template when a placeholder is missing', async () => {
    const { authored } = await loadBlock('invalid-template');
    expect(authored.instructions).to.equal('Enter');
    expect(authored.labels.cardLabel(1, 4)).to.equal('1 of 4');
    expect(authored.labels.rotateLeft).to.equal('Rotate left');
  });

  it('gives each instance unique modal ids that resolve within the block', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/two-blocks.html' });
    const blocks = [...document.querySelectorAll('.globe-gallery')];
    await Promise.all(blocks.map((b) => init(b)));
    const ids = [...document.querySelectorAll('[id]')].map((n) => n.id);
    expect(ids).to.have.length(8);
    expect(new Set(ids).size).to.equal(8);
    blocks.forEach((b) => {
      const name = b.querySelector('.globe-modal-name');
      name.getAttribute('aria-describedby').split(' ').forEach((id) => {
        expect(b.querySelector(`#${id}`)).to.exist;
      });
    });
  });
});
