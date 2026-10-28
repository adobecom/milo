import { readFile, setViewport } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from '../../../libs/c2/blocks/side-by-side/side-by-side.js';

describe('side-by-side (c2)', () => {
  describe('default (two rows, picture media)', () => {
    let block;
    beforeEach(async () => {
      document.body.innerHTML = await readFile({ path: './mocks/default.html' });
      block = document.querySelector('.side-by-side');
      init(block);
    });

    it('builds exactly two cards from the media and text rows', () => {
      const cards = block.querySelectorAll(':scope > .card');
      expect(cards.length).to.equal(2);
    });

    it('assigns the overlay and stacked card variants in order', () => {
      const [first, second] = block.children;
      expect(first.classList.contains('card-overlay')).to.be.true;
      expect(second.classList.contains('card-stacked')).to.be.true;
    });

    it('pairs each card with a .media then a .foreground child', () => {
      const [overlay, stacked] = block.children;
      // card-overlay gets an extra .content-aux layer before the media/foreground
      expect(overlay.querySelector(':scope > .content-aux')).to.exist;
      [overlay, stacked].forEach((card) => {
        const media = card.querySelector(':scope > .media');
        const foreground = card.querySelector(':scope > .foreground');
        expect(media).to.exist;
        expect(foreground).to.exist;
        expect(media.nextElementSibling).to.equal(foreground);
      });
    });

    it('keeps the picture inside the decorated media cell', () => {
      const media = block.querySelector('.card-overlay .media');
      expect(media.querySelector('picture img')).to.exist;
      expect(media.querySelector('img').getAttribute('src')).to.equal('/media/overlay.png');
    });

    it('decorates foreground text with heading, title and body styles', () => {
      const foreground = block.querySelector('.card-overlay .foreground');
      expect(foreground.querySelector('h3').classList.contains('heading-6')).to.be.true;
      expect(foreground.querySelector('p:has(strong)').classList.contains('title-6')).to.be.true;
      expect(foreground.querySelector('p:has(strong)').classList.contains('body-md')).to.be.false;
      const bodyP = [...foreground.querySelectorAll('p')].find((p) => p.textContent.startsWith('Overlay body'));
      expect(bodyP.classList.contains('body-md')).to.be.true;
    });

    it('promotes an inline (em > a) link into a con-button action area', () => {
      const foreground = block.querySelector('.card-overlay .foreground');
      const cta = foreground.querySelector('a[href="https://www.adobe.com/overlay"]');
      expect(cta.classList.contains('con-button')).to.be.true;
      expect(cta.closest('em')).to.be.null;
      expect(cta.closest('p').classList.contains('action-area')).to.be.true;
    });

    it('leaves a standalone (plain) link untouched', () => {
      const foreground = block.querySelector('.card-stacked .foreground');
      const link = foreground.querySelector('a[href="https://www.adobe.com/stacked"]');
      expect(link.classList.contains('con-button')).to.be.false;
      expect(link.closest('p').classList.contains('action-area')).to.be.false;
    });

    it('adds the dark class to the overlay card when the block is not dark', () => {
      expect(block.classList.contains('dark')).to.be.false;
      expect(block.querySelector('.card-overlay').classList.contains('dark')).to.be.true;
    });
  });

  describe('dark block variant', () => {
    it('does not add dark to the overlay card when the block is already dark', async () => {
      document.body.innerHTML = await readFile({ path: './mocks/dark.html' });
      const block = document.querySelector('.side-by-side');
      init(block);
      expect(block.classList.contains('dark')).to.be.true;
      const overlay = block.querySelector('.card-overlay');
      expect(overlay.classList.contains('dark')).to.be.false;
    });
  });

  describe('video media', () => {
    it('decorates without throwing and keeps the video inside the media cell', async () => {
      document.body.innerHTML = await readFile({ path: './mocks/video.html' });
      const block = document.querySelector('.side-by-side');
      expect(() => init(block)).to.not.throw();
      const media = block.querySelector('.card-overlay .media');
      expect(media.querySelector('video')).to.exist;
      expect(block.querySelectorAll(':scope > .card').length).to.equal(2);
    });
  });

  describe('MPC player in the overlay card', () => {
    const loadCss = (href) => new Promise((resolve) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = resolve;
      document.head.append(link);
    });

    before(async () => {
      await loadCss('/libs/c2/blocks/side-by-side/side-by-side.css');
      await loadCss('/libs/blocks/adobetv/adobetv.css');
    });

    afterEach(() => {
      document.body.style.removeProperty('--s2a-spacing-lg');
      return setViewport({ width: 800, height: 600 });
    });

    it('keeps the playing player controls clear of the mobile overlay copy', async () => {
      await setViewport({ width: 390, height: 844 });
      document.body.innerHTML = await readFile({ path: './mocks/default.html' });
      document.body.style.setProperty('--s2a-spacing-lg', '24px');
      const block = document.querySelector('.side-by-side');
      init(block);
      const card = block.querySelector('.card-overlay');
      card.querySelector('.media').innerHTML = `
        <div class="mpc-poster modal-img-link is-playing">
          <picture><img src="/media/overlay.png" width="1024" height="1024"></picture>
          <div class="milo-video"><iframe class="adobetv"></iframe></div>
        </div>`;
      const player = card.querySelector('.milo-video').getBoundingClientRect();
      const copy = card.querySelector('.foreground').getBoundingClientRect();
      const box = card.querySelector('.mpc-poster').getBoundingClientRect();

      expect(Math.round(copy.top - player.bottom) > 0, 'gap between player and copy').to.be.true;
      expect(player.height > box.height * 0.6, 'player fills the media area').to.be.true;
      expect(Math.round(box.height), 'poster box keeps its size').to.equal(Math.round(card.getBoundingClientRect().height));
    });
  });

  describe('no-op branches', () => {
    it('does nothing when the block has only one row', async () => {
      document.body.innerHTML = await readFile({ path: './mocks/single-row.html' });
      const block = document.querySelector('.side-by-side');
      const before = block.innerHTML;
      init(block);
      expect(block.querySelector('.card')).to.be.null;
      expect(block.innerHTML).to.equal(before);
    });

    it('does nothing when the block is empty', () => {
      document.body.innerHTML = '<main><div class="section"><div class="side-by-side"></div></div></main>';
      const block = document.querySelector('.side-by-side');
      expect(() => init(block)).to.not.throw();
      expect(block.children.length).to.equal(0);
    });
  });
});
