import { readFile, setViewport } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

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
      expect(carousel.getAttribute('role')).to.equal('group');
      expect(carousel.getAttribute('aria-roledescription')).to.equal('carousel');
      // name comes from the first slide link text after the pipe
      expect(carousel.getAttribute('aria-label')).to.equal('Adobe Creative Cloud');
    });
  });

  describe('hub-hero header pinning with a gnav promo', () => {
    let block;
    let heroHeader;
    let promo;
    let nav;
    let observeSpy;
    let originalMargin;
    let originalViewport;

    const settleLayout = async () => {
      for (let frame = 0; frame < 3; frame += 1) {
        await new Promise((resolve) => { requestAnimationFrame(resolve); });
      }
    };

    beforeEach(async () => {
      originalMargin = document.body.style.margin;
      originalViewport = { width: window.innerWidth, height: window.innerHeight };
      await setViewport({ width: 1280, height: 800 });
      document.body.innerHTML = await readFile({ path: './mocks/default.html' });
      document.body.style.margin = '0';
      document.body.insertAdjacentHTML('afterbegin', `
        <style>
          .hub-hero { position: relative; z-index: 5; height: 4000px; }
          .hub-hero-header { padding-top: 188px; }
          .hub-hero-header.pinned { position: fixed; top: 0; left: 0; right: 0; }
          .feds-promo-aside-wrapper {
            display: flex; align-items: center; justify-content: center; overflow: hidden;
          }
        </style>
        <header></header>
        <div class="feds-promo-aside-wrapper" style="height: 0px">
          <a href="#promo">Promo offer</a>
        </div>
      `);
      nav = document.querySelector('header');
      promo = document.querySelector('.feds-promo-aside-wrapper');
      block = document.querySelector('.hub-hero');
      observeSpy = sinon.spy(ResizeObserver.prototype, 'observe');
      window.scrollTo(0, 0);
      await init(block);
      heroHeader = block.querySelector('.hub-hero-header');
      await settleLayout();
    });

    afterEach(async () => {
      document.body.replaceChildren();
      document.body.style.margin = originalMargin;
      await settleLayout();
      sinon.restore();
      await setViewport(originalViewport);
    });

    it('unpins after a late 72px promo shift and exposes its link without scrolling', async () => {
      expect(block.getBoundingClientRect().top).to.equal(0);
      expect(heroHeader.classList.contains('pinned')).to.be.true;
      const { scrollY } = window;

      promo.style.height = '72px';
      await settleLayout();

      expect(window.scrollY).to.equal(scrollY);
      expect(block.getBoundingClientRect().top).to.equal(72);
      expect(heroHeader.classList.contains('pinned')).to.be.false;
      const link = promo.querySelector('a');
      const rect = link.getBoundingClientRect();
      const target = document.elementFromPoint(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
      );
      expect(target.closest('a')).to.equal(link);
    });

    it('repins when the promo collapses without scrolling', async () => {
      promo.style.height = '72px';
      await settleLayout();
      expect(heroHeader.classList.contains('pinned')).to.be.false;

      promo.style.height = '0px';
      await settleLayout();
      expect(block.getBoundingClientRect().top).to.equal(0);
      expect(heroHeader.classList.contains('pinned')).to.be.true;
      expect(window.scrollY).to.equal(0);
    });

    it('observes a promo wrapper inserted after initialization', async () => {
      promo.remove();
      await settleLayout();
      expect(heroHeader.classList.contains('pinned')).to.be.true;

      const replacement = promo.cloneNode(true);
      replacement.style.height = '72px';
      document.body.prepend(replacement);
      await settleLayout();
      expect(heroHeader.classList.contains('pinned')).to.be.false;

      replacement.style.height = '0px';
      await settleLayout();
      expect(heroHeader.classList.contains('pinned')).to.be.true;
    });

    it('rechecks pinning when the gnav height changes', async () => {
      nav.style.height = '64px';
      await settleLayout();
      expect(block.getBoundingClientRect().top).to.equal(64);
      expect(heroHeader.classList.contains('pinned')).to.be.false;
    });

    it('still pins on scroll and unpins after the carousel assembles', async () => {
      promo.style.height = '72px';
      await settleLayout();
      expect(heroHeader.classList.contains('pinned')).to.be.false;

      window.scrollTo(0, 100);
      await settleLayout();
      expect(heroHeader.classList.contains('pinned')).to.be.true;

      window.scrollTo(0, 2200);
      await settleLayout();
      expect(heroHeader.classList.contains('pinned')).to.be.false;

      window.scrollTo(0, 0);
      await settleLayout();
      expect(heroHeader.classList.contains('pinned')).to.be.false;
    });

    it('disconnects layout observation and cancels a queued pin check on removal', async () => {
      const layoutObserver = observeSpy.getCalls().find((call) => call.args[0] === promo).thisValue;
      const disconnectSpy = sinon.spy(layoutObserver, 'disconnect');
      const cancelSpy = sinon.spy(window, 'cancelAnimationFrame');
      window.dispatchEvent(new Event('scroll'));
      block.remove();
      await settleLayout();

      expect(disconnectSpy.calledOnce).to.be.true;
      expect(cancelSpy.calledOnce).to.be.true;
      expect(cancelSpy.firstCall.args[0]).to.be.greaterThan(0);
      expect(heroHeader.classList.contains('pinned')).to.be.true;
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

  describe('carousel desktop geometry', () => {
    let styles;
    let originalViewport;
    let originalDirection;

    const settleLayout = async () => {
      for (let frame = 0; frame < 3; frame += 1) {
        await new Promise((resolve) => { requestAnimationFrame(resolve); });
      }
    };

    before(async () => {
      originalViewport = { width: window.innerWidth, height: window.innerHeight };
      originalDirection = document.documentElement.getAttribute('dir');
      styles = document.createElement('style');
      styles.textContent = await readFile({ path: '../../../libs/c2/styles/styles.css' })
        + await readFile({ path: '../../../libs/c2/blocks/hub-hero/hub-hero.css' });
      document.head.append(styles);
    });

    afterEach(async () => {
      document.body.replaceChildren();
      window.scrollTo(0, 0);
      if (originalDirection === null) document.documentElement.removeAttribute('dir');
      else document.documentElement.setAttribute('dir', originalDirection);
      await settleLayout();
    });

    after(async () => {
      styles.remove();
      await setViewport(originalViewport);
    });

    const loadCarousel = async (slideCount = 3) => {
      document.body.innerHTML = await readFile({ path: './mocks/default.html' });
      const block = document.querySelector('.hub-hero');
      if (slideCount === 3) {
        block.classList.add('slides-3');
        block.insertBefore(block.children[2].cloneNode(true), block.children[3]);
        block.lastElementChild.remove();
      }
      const image = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="300" height="300" fill="gray"/></svg>';
      const svg = `data:image/svg+xml,${encodeURIComponent(image)}`;
      block.querySelectorAll('img').forEach((img) => { img.src = svg; });
      // Match the paragraph-authored footers used by current C2 content.
      block.querySelectorAll('h3').forEach((heading) => {
        const paragraph = document.createElement('p');
        paragraph.textContent = heading.textContent;
        heading.replaceWith(paragraph);
      });
      await init(block);
      await settleLayout();
      return block;
    };

    [
      { width: 1280, height: 800, expectedGridWidth: 256, finalWidth: 240 },
      { width: 1470, height: 800, expectedGridWidth: 294, finalWidth: 392 },
      { width: 1470, height: 1100, expectedGridWidth: 294, finalWidth: 392 },
    ].forEach(({ width: viewportWidth, height, expectedGridWidth, finalWidth }) => {
      ['ltr', 'rtl'].forEach((direction) => {
        it(`matches the grid then assembles smoothly at ${viewportWidth}x${height} in ${direction}`, async () => {
          await setViewport({ width: viewportWidth, height });
          document.documentElement.setAttribute('dir', direction);
          const block = await loadCarousel();
          const row = block.querySelector('.hub-hero-carousel-container');
          expect(getComputedStyle(row).animationName).to.equal('carousel-slides-three-assemble');
          const cards = [...row.querySelectorAll('[data-index]')];
          const gridWidth = block.querySelector('.hub-hero-image-grid-container-col > div')
            .getBoundingClientRect().width;
          expect(gridWidth).to.be.closeTo(expectedGridWidth, 0.1);
          cards.forEach((card) => {
            expect(card.getBoundingClientRect().width).to.be.closeTo(gridWidth, 0.1);
          });
          const startGap = parseFloat(getComputedStyle(row).gap);
          const initialWidth = 3 * gridWidth + 2 * startGap;
          expect(row.getBoundingClientRect().width).to.be.closeTo(initialWidth, 0.1);
          let previousWidths = cards.map((card) => card.getBoundingClientRect().width);
          for (const scrollY of [400, 800, 1200, 1800]) {
            window.scrollTo(0, scrollY);
            await settleLayout();
            const widths = cards.map((card) => card.getBoundingClientRect().width);
            for (let index = 0; index < widths.length; index += 1) {
              const width = widths[index];
              expect(width).to.be.at.least(Math.min(gridWidth, finalWidth) - 0.1);
              expect(width).to.be.at.most(Math.max(gridWidth, finalWidth) + 0.1);
              if (finalWidth < gridWidth) {
                expect(width).to.be.at.most(previousWidths[index] + 0.1);
              } else {
                expect(width).to.be.at.least(previousWidths[index] - 0.1);
              }
            }
            previousWidths = widths;
          }
          cards.forEach((card) => {
            expect(card.getBoundingClientRect().width).to.be.closeTo(finalWidth, 0.1);
          });
          const endGap = parseFloat(getComputedStyle(row).gap);
          const rowWidth = row.getBoundingClientRect().width;
          expect(rowWidth).to.be.closeTo(3 * finalWidth + 2 * endGap, 0.1);
          cards[0].classList.add('hovered');
          await new Promise((resolve) => { setTimeout(resolve, 350); });
          expect(row.getBoundingClientRect().width).to.be.closeTo(rowWidth, 0.1);
        });
      });
    });

    it('does not change four-slide row animation', async () => {
      await setViewport({ width: 1470, height: 800 });
      const block = await loadBlock('./mocks/default.html');
      expect(getComputedStyle(block.querySelector('.hub-hero-carousel-container')).animationName)
        .to.equal('carouselGapShrinkWidthGrowth');
    });

    it('does not apply the desktop row-sizing animation on mobile', async () => {
      await setViewport({ width: 375, height: 800 });
      const block = await loadCarousel();
      expect(getComputedStyle(block.querySelector('.hub-hero-carousel-container')).animationName)
        .to.not.include('carousel-slides-three-assemble');
    });

    [3, 4].forEach((slideCount) => {
      ['ltr', 'rtl'].forEach((direction) => {
        it(`reveals ${slideCount}-slide ${direction} footer icons without a layout jump`, async () => {
          await setViewport({ width: 1470, height: 800 });
          document.documentElement.setAttribute('dir', direction);
          const block = await loadCarousel(slideCount);
          window.scrollTo(0, 1800);
          await settleLayout();
          const card = block.querySelector('.hub-hero-carousel-item[data-index]');
          const footer = card.querySelector('.hub-hero-carousel-item-footer');
          const paragraph = footer.querySelector('p');
          const icon = footer.querySelector('span');
          paragraph.textContent = 'Create, edit, and organize images and digital art. '.repeat(3);
          await settleLayout();
          const measure = () => {
            const bounds = footer.getBoundingClientRect();
            const text = paragraph.getBoundingClientRect();
            const symbol = icon.getBoundingClientRect();
            const style = getComputedStyle(footer);
            const innerWidth = bounds.width
              - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
            return {
              height: bounds.height,
              textWidth: text.width,
              reserved: innerWidth - text.width,
              opacity: parseFloat(getComputedStyle(icon).opacity),
              inset: direction === 'ltr' ? bounds.right - symbol.right : symbol.left - bounds.left,
              padding: parseFloat(direction === 'ltr' ? style.paddingRight : style.paddingLeft),
            };
          };
          const initial = measure();
          expect(getComputedStyle(icon).position).to.equal('absolute');
          expect(initial.reserved).to.be.closeTo(0, 0.1);
          expect(initial.opacity).to.equal(0);
          expect(initial.inset).to.be.closeTo(initial.padding, 0.1);
          const samples = [];
          const start = performance.now();
          card.classList.add('hovered');
          await new Promise((resolve) => {
            const sample = () => {
              const elapsed = performance.now() - start;
              samples.push({ elapsed, ...measure() });
              if (elapsed < 450) requestAnimationFrame(sample);
              else resolve();
            };
            requestAnimationFrame(sample);
          });
          const hovered = measure();
          const gap = parseFloat(getComputedStyle(footer).getPropertyValue('--s2a-spacing-xs'));
          expect(hovered.reserved).to.be.closeTo(icon.getBoundingClientRect().width + gap, 0.1);
          expect(hovered.opacity).to.equal(1);
          expect(samples.filter((sample) => sample.reserved > 1
            && sample.reserved < hovered.reserved - 1).length).to.be.at.least(2);
          samples.filter((sample) => sample.elapsed < 280).forEach((sample) => {
            expect(sample.opacity).to.equal(0);
          });
          samples.forEach((sample) => {
            expect(sample.height).to.be.closeTo(initial.height, 0.1);
            expect(sample.inset).to.be.closeTo(sample.padding, 0.1);
            expect(sample.textWidth)
              .to.be.at.least(Math.min(initial.textWidth, hovered.textWidth) - 0.1);
            expect(sample.textWidth)
              .to.be.at.most(Math.max(initial.textWidth, hovered.textWidth) + 0.1);
          });
          card.classList.remove('hovered');
          expect(parseFloat(getComputedStyle(icon).transitionDelay)).to.equal(0);
          await new Promise((resolve) => { setTimeout(resolve, 130); });
          expect(measure().opacity).to.equal(0);
          await new Promise((resolve) => { setTimeout(resolve, 220); });
          expect(measure().reserved).to.be.closeTo(0, 0.1);
          block.style.setProperty('--s2a-spacing-lg', '32px');
          await settleLayout();
          expect(measure().inset).to.be.closeTo(32, 0.1);
        });
      });
    });

    it('reveals the footer icon for native keyboard focus without a focused class', async () => {
      await setViewport({ width: 1470, height: 800 });
      const block = await loadCarousel();
      window.scrollTo(0, 1800);
      await settleLayout();
      const original = block.querySelector('.hub-hero-carousel-item[data-index]');
      const card = original.cloneNode(true);
      original.replaceWith(card);
      card.focus();
      expect(card.matches(':focus-visible')).to.be.true;
      expect(card.classList.contains('focused')).to.be.false;
      await new Promise((resolve) => { setTimeout(resolve, 450); });
      expect(getComputedStyle(card.querySelector('.hub-hero-carousel-item-footer span')).opacity)
        .to.equal('1');
    });

    it('never temporarily narrows footer text before a card expands', async () => {
      for (const width of [1280, 1100, 850]) {
        await setViewport({ width, height: 800 });
        const block = await loadCarousel();
        window.scrollTo(0, 1800);
        await settleLayout();
        const card = block.querySelector('.hub-hero-carousel-item[data-index]');
        const paragraph = card.querySelector('.hub-hero-carousel-item-footer p');
        const initialWidth = paragraph.getBoundingClientRect().width;
        const samples = [initialWidth];
        card.classList.add('hovered');
        await new Promise((resolve) => {
          const start = performance.now();
          const sample = () => {
            samples.push(paragraph.getBoundingClientRect().width);
            if (performance.now() - start < 400) requestAnimationFrame(sample);
            else resolve();
          };
          requestAnimationFrame(sample);
        });
        expect(samples.at(-1)).to.be.above(initialWidth);
        for (let index = 1; index < samples.length; index += 1) {
          expect(samples[index]).to.be.at.least(samples[index - 1] - 0.1);
        }
        block.remove();
        window.scrollTo(0, 0);
        await settleLayout();
      }
    }).timeout(5000);
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
      expect(carousel.getAttribute('aria-label')).to.equal('Adobe slides');
    });

    it('still produces the full header/grid/carousel structure', () => {
      expect(block.querySelector('.hub-hero-header')).to.exist;
      expect(block.querySelectorAll('.hub-hero-image-grid-container-col')).to.have.lengthOf(5);
      expect(block.querySelectorAll('.hub-hero-carousel-item')).to.have.lengthOf(5);
    });
  });
});
