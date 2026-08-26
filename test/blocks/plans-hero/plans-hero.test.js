import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from '../../../libs/c2/blocks/plans-hero/plans-hero.js';

describe('plans-hero', () => {
  describe('with text and media', () => {
    let block;

    beforeEach(async () => {
      document.body.innerHTML = await readFile({ path: './mocks/default.html' });
      block = document.querySelector('.plans-hero');
      init(block);
    });

    it('adds the container class to the block', () => {
      expect(block.classList.contains('container')).to.be.true;
    });

    it('replaces the row with a media div and a content div', () => {
      const children = [...block.children];
      expect(children).to.have.lengthOf(2);
      expect(children[0].classList.contains('plans-hero-media')).to.be.true;
      expect(children[1].classList.contains('plans-hero-content')).to.be.true;
      // the original row wrapper is gone
      expect(block.querySelector(':scope > div > div > picture')).to.be.null;
    });

    it('moves the media cell picture into the media div', () => {
      const media = block.querySelector('.plans-hero-media');
      const picture = media.querySelector('picture');
      expect(picture).to.exist;
      expect(picture.querySelector('img').getAttribute('src')).to.equal('/media/plans-hero.png');
      // the picture is moved, not duplicated
      expect(block.querySelectorAll('picture')).to.have.lengthOf(1);
    });

    it('keeps the text cell as the content div and decorates its heading', () => {
      const content = block.querySelector('.plans-hero-content');
      const heading = content.querySelector('h2');
      expect(heading).to.exist;
      expect(heading.classList.contains('heading-2')).to.be.true;
    });

    it('decorates body copy paragraphs with the body size class', () => {
      const content = block.querySelector('.plans-hero-content');
      const bodyParas = [...content.querySelectorAll('p')];
      expect(bodyParas).to.have.lengthOf.at.least(1);
      bodyParas.forEach((p) => expect(p.classList.contains('body-md')).to.be.true);
    });
  });

  describe('without a media picture', () => {
    let block;

    beforeEach(async () => {
      document.body.innerHTML = await readFile({ path: './mocks/no-media.html' });
      block = document.querySelector('.plans-hero');
      init(block);
    });

    it('still produces an (empty) media div', () => {
      const media = block.querySelector('.plans-hero-media');
      expect(media).to.exist;
      expect(media.querySelector('picture')).to.be.null;
    });

    it('still decorates the text content', () => {
      const content = block.querySelector('.plans-hero-content');
      expect(content).to.exist;
      expect(content.querySelector('h2').classList.contains('heading-2')).to.be.true;
    });
  });

  describe('with an empty row (no text cell)', () => {
    let block;

    beforeEach(async () => {
      document.body.innerHTML = await readFile({ path: './mocks/empty-row.html' });
      block = document.querySelector('.plans-hero');
      init(block);
    });

    it('falls back to an empty media div and empty content div', () => {
      const children = [...block.children];
      expect(children).to.have.lengthOf(2);
      const media = block.querySelector('.plans-hero-media');
      const content = block.querySelector('.plans-hero-content');
      expect(media).to.exist;
      expect(media.children).to.have.lengthOf(0);
      expect(content).to.exist;
      expect(content.textContent.trim()).to.equal('');
    });
  });

  describe('with no rows', () => {
    it('adds the container class but does not reshape the block', async () => {
      document.body.innerHTML = await readFile({ path: './mocks/no-rows.html' });
      const block = document.querySelector('.plans-hero');
      expect(() => init(block)).to.not.throw();
      expect(block.classList.contains('container')).to.be.true;
      expect(block.querySelector('.plans-hero-media')).to.be.null;
      expect(block.querySelector('.plans-hero-content')).to.be.null;
      expect(block.children).to.have.lengthOf(0);
    });
  });
});
