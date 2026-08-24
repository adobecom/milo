import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

import init from '../../../libs/c2/blocks/hub-hero/hub-hero.js';

const loadBlock = async (path) => {
  document.body.innerHTML = await readFile({ path });
  const block = document.querySelector('.hub-hero');
  await init(block);
  return block;
};

describe('hub-hero block', () => {
  describe('top-level structure (default.html)', () => {
    let block;
    before(async () => {
      block = await loadBlock('./mocks/default.html');
    });

    it('replaces the block content with header, grid and carousel in order', () => {
      const kids = [...block.children];
      expect(kids).to.have.lengthOf(3);
      expect(kids[0].classList.contains('hub-hero-header')).to.be.true;
      expect(kids[1].classList.contains('hub-hero-image-grid-container')).to.be.true;
      expect(kids[2].classList.contains('hub-hero-carousel')).to.be.true;
    });

    it('decorates the hero header CTA as a promo-cta with an alias aria-label', () => {
      const cta = block.querySelector('.hub-hero-header a.promo-cta');
      expect(cta).to.exist;
      // text before the pipe is the label, text after is the aria-label
      expect(cta.getAttribute('aria-label')).to.equal('Explore all Adobe products');
      expect(cta.textContent).to.contain('Explore now');
      expect(cta.textContent).to.not.contain('Explore all Adobe products');
      expect(cta.querySelector('img')).to.exist;
      expect(cta.querySelector('span.icon-button svg')).to.exist;
    });

    it('builds a 5-column image grid and clones slide media into columns 2 and 4', () => {
      const grid = block.querySelector('.hub-hero-image-grid-container');
      const cols = grid.querySelectorAll('.hub-hero-image-grid-container-col');
      expect(cols).to.have.lengthOf(5);
      expect(cols[1].querySelector('img[alt="s2"]')).to.exist;
      expect(cols[3].querySelector('img[alt="s4"]')).to.exist;
    });

    it('prepends the carousel header and exposes carousel aria metadata', () => {
      const carousel = block.querySelector('.hub-hero-carousel');
      const header = carousel.firstElementChild;
      expect(header.classList.contains('hub-hero-carousel-header')).to.be.true;
      expect(header.querySelector('h2').textContent).to.contain('Featured cards');
      expect(carousel.querySelector('.hub-hero-carousel-container')).to.exist;
      expect(carousel.dataset.ariaRoledescription).to.equal('carousel');
      // name comes from the first slide link text after the pipe
      expect(carousel.dataset.ariaLabel).to.equal('Adobe Creative Cloud');
    });
  });

  describe('carousel slides (default.html)', () => {
    let slides;
    before(async () => {
      const block = await loadBlock('./mocks/default.html');
      slides = [...block.querySelectorAll('.hub-hero-carousel-item')];
    });

    it('creates four authored slides plus one placeholder slide', () => {
      expect(slides).to.have.lengthOf(5);
      const placeholders = slides.filter((s) => s.classList.contains('placeholder'));
      expect(placeholders).to.have.lengthOf(1);
      // the placeholder is injected as the third slide and carries no link or index
      expect(slides[2].classList.contains('placeholder')).to.be.true;
      expect(slides[2].getAttribute('href')).to.be.null;
      expect(slides[2].getAttribute('data-index')).to.be.null;
    });

    it('assigns continuous data-index values across the real slides', () => {
      const indices = slides
        .filter((s) => !s.classList.contains('placeholder'))
        .map((s) => s.getAttribute('data-index'));
      expect(indices).to.eql(['1', '2', '3', '4']);
    });

    it('builds header/media/footer containers with the add icon for each real slide', () => {
      slides
        .filter((s) => !s.classList.contains('placeholder'))
        .forEach((slide) => {
          expect(slide.querySelector('.hub-hero-carousel-item-container')).to.exist;
          expect(slide.querySelector('.hub-hero-carousel-item-header')).to.exist;
          expect(slide.querySelector('.hub-hero-carousel-item-media')).to.exist;
          const footer = slide.querySelector('.hub-hero-carousel-item-footer');
          expect(footer).to.exist;
          expect(footer.querySelector('span[aria-hidden="true"] svg')).to.exist;
        });
    });

    it('links eyebrow and heading ids through aria-labelledby', () => {
      const first = slides[0];
      expect(first.getAttribute('aria-labelledby')).to.equal('hub-hero-slide-1-title hub-hero-slide-1-desc');
      expect(first.querySelector('#hub-hero-slide-1-title')).to.exist;
      expect(first.querySelector('#hub-hero-slide-1-desc')).to.exist;
      expect(first.getAttribute('daa-ll')).to.equal('Slide One Heading-1--Slide One Heading');
    });

    it('marks a standard link slide with role="link" and no modal data', () => {
      const standard = slides[0];
      expect(standard.getAttribute('role')).to.equal('link');
      expect(standard.getAttribute('href')).to.equal('https://www.adobe.com/slide1');
      expect(standard.dataset.modalHash).to.be.undefined;
      expect(standard.dataset.modalPath).to.be.undefined;
    });

    it('marks a modal link slide with role="button" and modal data attributes', () => {
      const modal = slides[1];
      expect(modal.getAttribute('role')).to.equal('button');
      expect(modal.dataset.modalHash).to.equal('#slide2-modal');
      expect(modal.dataset.modalPath).to.equal('/modals/slide2');
    });

    it('prepares a video asset slide with autoplay-friendly attributes', () => {
      const videoSlide = slides.find((s) => s.getAttribute('data-index') === '3');
      const video = videoSlide.querySelector('.hub-hero-carousel-item-media video');
      expect(video).to.exist;
      expect(video.getAttribute('preload')).to.equal('none');
      expect(video.getAttribute('muted')).to.equal('true');
      expect(video.getAttribute('tabindex')).to.equal('-1');
      expect(video.hasAttribute('controls')).to.be.false;
      const source = video.querySelector('source');
      expect(source.getAttribute('type')).to.equal('video/mp4');
      expect(source.getAttribute('src')).to.equal('https://example.com/slide3.mp4');
    });

    it('renders picture-based slides with an image in the media area', () => {
      const pictureSlide = slides[0];
      expect(pictureSlide.querySelector('.hub-hero-carousel-item-media img[alt="s1"]')).to.exist;
      expect(pictureSlide.querySelector('.hub-hero-carousel-item-media video')).to.be.null;
    });
  });

  describe('fallback branches (fallbacks.html)', () => {
    let block;
    before(async () => {
      block = await loadBlock('./mocks/fallbacks.html');
    });

    it('falls back to the CTA text for the aria-label when there is no alias', () => {
      const cta = block.querySelector('.hub-hero-header a.promo-cta');
      expect(cta.getAttribute('aria-label')).to.equal('Get started');
      expect(cta.textContent).to.contain('Get started');
    });

    it('falls back to the default carousel name when no name is authored', () => {
      const carousel = block.querySelector('.hub-hero-carousel');
      expect(carousel.dataset.ariaLabel).to.equal('Adobe Cards');
    });

    it('still produces the full header/grid/carousel structure', () => {
      expect(block.querySelector('.hub-hero-header')).to.exist;
      expect(block.querySelectorAll('.hub-hero-image-grid-container-col')).to.have.lengthOf(5);
      expect(block.querySelectorAll('.hub-hero-carousel-item')).to.have.lengthOf(5);
    });
  });
});
