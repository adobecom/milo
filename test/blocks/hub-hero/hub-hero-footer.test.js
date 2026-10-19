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

describe('hub-hero footer and assembly', () => {
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
      sinon.restore();
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

    const loadCarousel = async (slideCount = 3, footerTag = 'p') => {
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
      if (footerTag === 'p') {
        block.querySelectorAll('h3').forEach((heading) => {
          const paragraph = document.createElement('p');
          paragraph.textContent = heading.textContent;
          heading.replaceWith(paragraph);
        });
      }
      await init(block);
      await settleLayout();
      return block;
    };

    const enableTouchScroll = () => {
      const nativeMatchMedia = window.matchMedia.bind(window);
      const touchQuery = '(hover: none) and (min-width: 768px) and (max-width: 1230px)';
      return sinon.stub(window, 'matchMedia').callsFake((query) => (
        nativeMatchMedia(query === touchQuery ? '(min-width: 0px)' : query)
      ));
    };

    [
      { width: 1280, height: 800, expectedGridWidth: 256, finalWidth: 240 },
      { width: 1440, height: 760, expectedGridWidth: 288, finalWidth: 222 },
      { width: 1470, height: 800, expectedGridWidth: 294, finalWidth: 240 },
      { width: 1470, height: 1100, expectedGridWidth: 294, finalWidth: 375 },
      { width: 1536, height: 730, expectedGridWidth: 302, finalWidth: 208.5 },
      { width: 1920, height: 1200, expectedGridWidth: 302, finalWidth: 392 },
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
      it(`settles ${slideCount}-slide touch tablet page height without interaction`, async () => {
        await setViewport({ width: 1024, height: 800 });
        const matchMedia = enableTouchScroll();
        try {
          const block = await loadCarousel(slideCount, 'h3');
          expect(block.classList.contains('touch-scroll')).to.be.true;
          expect(block.querySelector('.hub-hero-carousel-scroll')).to.exist;
          expect(parseFloat(block.style.getPropertyValue('--hub-hero-content-height')))
            .to.be.above(0);
          const following = document.createElement('div');
          following.style.height = '200px';
          document.body.append(following);
          await document.fonts.ready;
          await settleLayout();
          const samples = [];
          const start = performance.now();
          await new Promise((resolve) => {
            const sample = () => {
              samples.push({
                page: document.documentElement.scrollHeight,
                hero: block.offsetHeight,
                following: following.getBoundingClientRect().top + window.scrollY,
              });
              if (performance.now() - start < 2000) requestAnimationFrame(sample);
              else resolve();
            };
            requestAnimationFrame(sample);
          });
          for (const key of ['page', 'hero', 'following']) {
            const heights = samples.map((sample) => sample[key]);
            expect(Math.max(...heights) - Math.min(...heights), key).to.be.at.most(1);
          }
          expect(window.scrollY).to.equal(0);
        } finally {
          matchMedia.restore();
        }
      }).timeout(5000);
    });

    ['ltr', 'rtl'].forEach((direction) => {
      it(`preserves native ${direction} tablet scrolling after the carousel locks`, async () => {
        await setViewport({ width: 1024, height: 800 });
        document.documentElement.setAttribute('dir', direction);
        const matchMedia = enableTouchScroll();
        try {
          const block = await loadCarousel(4, 'h3');
          window.scrollTo(0, Math.ceil((block.offsetHeight - window.innerHeight) * 0.8));
          await settleLayout();
          expect(block.classList.contains('touch-scroll')).to.be.true;
          expect(block.classList.contains('carousel-locked')).to.be.true;
          const scroller = block.querySelector('.hub-hero-carousel-scroll');
          const distance = scroller.scrollWidth - scroller.clientWidth;
          expect(distance).to.be.above(0);
          scroller.scrollLeft = direction === 'rtl' ? -distance : distance;
          await settleLayout();
          expect(Math.abs(scroller.scrollLeft)).to.be.closeTo(distance, 1);
          scroller.scrollLeft = 0;
          await settleLayout();
          expect(scroller.scrollLeft).to.equal(0);
        } finally {
          matchMedia.restore();
        }
      });
    });

    ['p', 'h3'].forEach((footerTag) => {
      [3, 4].forEach((slideCount) => {
        ['ltr', 'rtl'].forEach((direction) => {
          it(`expands proportional XL ${slideCount}-slide ${direction} ${footerTag} cards in short viewports without narrowing footer text`, async () => {
            document.documentElement.setAttribute('dir', direction);
            for (const viewport of [
              { width: 1536, height: 730 },
              { width: 1440, height: 760 },
              { width: 1470, height: 800 },
            ]) {
              await setViewport(viewport);
              const block = await loadCarousel(slideCount, footerTag);
              window.scrollTo(0, 1800);
              await settleLayout();
              const row = block.querySelector('.hub-hero-carousel-container');
              const card = row.querySelector('[data-index]');
              const paragraph = card.querySelector('.hub-hero-carousel-item-footer-text');
              expect(paragraph.tagName.toLowerCase()).to.equal(footerTag);
              const icon = card.querySelector('.hub-hero-carousel-item-footer span');
              paragraph.textContent = 'Create, edit, and organize images and digital art. '.repeat(3);
              await settleLayout();
              const restingWidth = (viewport.height * 0.6 - 64 - 96) * 0.75;
              row.querySelectorAll('[data-index]').forEach((slide) => {
                const media = slide.querySelector('.hub-hero-carousel-item-media');
                expect(slide.getBoundingClientRect().width).to.be.closeTo(restingWidth, 0.1);
                expect(media.getBoundingClientRect().width / media.getBoundingClientRect().height)
                  .to.be.closeTo(3 / 4, 0.001);
              });
              const rowWidth = row.getBoundingClientRect().width;
              const textWidth = paragraph.getBoundingClientRect().width;
              const gap = parseFloat(getComputedStyle(block).getPropertyValue('--s2a-spacing-xs'));
              for (const state of ['hovered', 'focused']) {
                card.classList.add(state);
                const start = performance.now();
                const samples = [];
                await new Promise((resolve) => {
                  const sample = () => {
                    samples.push({
                      cardWidth: card.getBoundingClientRect().width,
                      textWidth: paragraph.getBoundingClientRect().width,
                      rowWidth: row.getBoundingClientRect().width,
                    });
                    if (performance.now() - start < 400) requestAnimationFrame(sample);
                    else resolve();
                  };
                  requestAnimationFrame(sample);
                });
                samples.forEach((sample) => {
                  expect(sample.cardWidth).to.be.at.least(restingWidth - 0.1);
                  expect(sample.textWidth).to.be.at.least(textWidth - 0.1);
                  expect(sample.rowWidth).to.be.closeTo(rowWidth, 0.1);
                });
                expect(card.getBoundingClientRect().width)
                  .to.be.at.least(restingWidth + icon.getBoundingClientRect().width + gap - 0.1);
                card.classList.remove(state);
                await new Promise((resolve) => { setTimeout(resolve, 350); });
                expect(card.getBoundingClientRect().width).to.be.closeTo(restingWidth, 0.1);
              }
              block.remove();
              window.scrollTo(0, 0);
              await settleLayout();
            }
          }).timeout(10000);

          it(`reveals ${slideCount}-slide ${direction} ${footerTag} footer icons without narrowing text`, async () => {
            await setViewport({ width: 1470, height: 800 });
            document.documentElement.setAttribute('dir', direction);
            const block = await loadCarousel(slideCount, footerTag);
            window.scrollTo(0, 1800);
            await settleLayout();
            const card = block.querySelector('.hub-hero-carousel-item[data-index]');
            const footer = card.querySelector('.hub-hero-carousel-item-footer');
            const paragraph = footer.querySelector('.hub-hero-carousel-item-footer-text');
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
              expect(sample.height).to.be.at.least(initial.height - 0.1);
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

          it(`exposes complete ${slideCount}-slide ${direction} ${footerTag} footer text on mobile and desktop hover/focus at doubled text sizes`, async () => {
            document.documentElement.setAttribute('dir', direction);
            for (const width of [375, 1470]) {
              await setViewport({ width, height: 800 });
              const block = await loadCarousel(slideCount, footerTag);
              window.scrollTo(0, 1800);
              await settleLayout();
              const card = block.querySelector('.hub-hero-carousel-item[data-index]');
              const paragraph = card.querySelector('.hub-hero-carousel-item-footer-text');
              const fullText = 'Create, edit, and organize images and digital art. '.repeat(12);
              const expectFullText = () => {
                expect(getComputedStyle(paragraph).webkitLineClamp).to.equal('none');
                expect(paragraph.scrollHeight).to.be.at.most(paragraph.clientHeight + 1);
                const text = paragraph.getBoundingClientRect();
                const footer = paragraph.parentElement.getBoundingClientRect();
                const bounds = card.getBoundingClientRect();
                const carousel = block.querySelector('.hub-hero-carousel').getBoundingClientRect();
                expect(text.top).to.be.at.least(footer.top - 1);
                expect(text.bottom).to.be.at.most(footer.bottom + 1);
                expect(footer.bottom).to.be.at.most(bounds.bottom + 1);
                expect(text.bottom).to.be.at.most(carousel.bottom + 1);
                if (width < 768) {
                  expect(parseFloat(card.style.getPropertyValue('--slide-content-height')))
                    .to.be.closeTo(card.offsetHeight, 1);
                }
                expect(card.getAttribute('aria-labelledby').split(' ')).to.include(paragraph.id);
                expect(document.getElementById(paragraph.id).textContent).to.equal(fullText);
              };
              for (const scale of [1, 2]) {
                card.blur();
                card.classList.remove('hovered', 'focused');
                await new Promise((resolve) => { setTimeout(resolve, 350); });
                paragraph.style.fontSize = `calc(var(--s2a-typography-font-size-eyebrow) * ${scale})`;
                paragraph.textContent = 'Short';
                await settleLayout();
                const lineHeight = paragraph.getBoundingClientRect().height;
                paragraph.textContent = fullText;
                await settleLayout();
                if (width < 768) {
                  expectFullText();
                } else {
                  expect(getComputedStyle(paragraph).webkitLineClamp).to.equal('2');
                  expect(paragraph.getBoundingClientRect().height)
                    .to.be.closeTo(lineHeight * 2, 0.1);
                  expect(paragraph.scrollHeight).to.be.above(paragraph.clientHeight);
                  card.classList.add('hovered');
                  await new Promise((resolve) => { setTimeout(resolve, 350); });
                  expectFullText();
                  card.classList.remove('hovered');
                  card.focus();
                  await new Promise((resolve) => { setTimeout(resolve, 350); });
                  expect(card.matches(':focus-visible')).to.be.true;
                  expectFullText();
                }
                if (width < 768) {
                  const row = card.parentElement.getBoundingClientRect();
                  window.scrollTo(0, window.scrollY + row.top
                    + card.offsetHeight - window.innerHeight + 24);
                } else window.scrollTo(0, document.documentElement.scrollHeight);
                await new Promise((resolve) => { setTimeout(resolve, 150); });
                const range = document.createRange();
                const node = paragraph.firstChild;
                range.setStart(node, node.length - 5);
                range.setEnd(node, node.length);
                const lastLine = range.getBoundingClientRect();
                expect(lastLine.top).to.be.at.least(0);
                expect(lastLine.bottom).to.be.at.most(window.innerHeight);
                const target = document.elementFromPoint(
                  lastLine.left + lastLine.width / 2,
                  lastLine.top + lastLine.height / 2,
                );
                expect(target.closest('.hub-hero-carousel-item-footer-text')).to.equal(paragraph);
              }
              block.remove();
              window.scrollTo(0, 0);
              await settleLayout();
            }
          }).timeout(10000);
        });
      });
    });

    [3, 4].forEach((slideCount) => {
      ['ltr', 'rtl'].forEach((direction) => {
        it(`preserves the ${slideCount}-slide ${direction} XL portrait ratio and 392px cap on resize`, async () => {
          await setViewport({ width: 1920, height: 1200 });
          document.documentElement.setAttribute('dir', direction);
          const block = await loadCarousel(slideCount, 'h3');
          const row = block.querySelector('.hub-hero-carousel-container');
          for (const { width, height, expected } of [
            { width: 1470, height: 800, expected: 240 },
            { width: 1470, height: 1100, expected: slideCount === 3 ? 375 : 351.5 },
            { width: 1920, height: 1200, expected: 392 },
            { width: 1920, height: 800, expected: 240 },
            { width: 1920, height: 1200, expected: 392 },
          ]) {
            await setViewport({ width, height });
            await settleLayout();
            window.scrollTo(0, (block.offsetHeight - window.innerHeight) * 0.95);
            await new Promise((resolve) => { setTimeout(resolve, 350); });
            await settleLayout();
            row.querySelectorAll('[data-index]').forEach((card) => {
              const bounds = card.getBoundingClientRect();
              const media = card.querySelector('.hub-hero-carousel-item-media').getBoundingClientRect();
              expect(bounds.width).to.be.closeTo(expected, 0.1);
              expect(bounds.width).to.be.at.most(392.1);
              expect(media.width).to.be.closeTo(expected, 0.1);
              expect(media.width / media.height).to.be.closeTo(3 / 4, 0.001);
            });
            const gap = parseFloat(getComputedStyle(row).gap);
            expect(row.getBoundingClientRect().width)
              .to.be.closeTo(slideCount * expected + (slideCount - 1) * gap, 0.1);
            expect(row.getBoundingClientRect().width).to.be.at.most(width);
          }
        }).timeout(5000);
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
      const text = card.querySelector('.hub-hero-carousel-item-footer-text');
      text.textContent = 'Read the complete description on keyboard focus. '.repeat(12);
      card.focus();
      expect(card.matches(':focus-visible')).to.be.true;
      expect(card.classList.contains('focused')).to.be.false;
      await new Promise((resolve) => { setTimeout(resolve, 450); });
      expect(getComputedStyle(card.querySelector('.hub-hero-carousel-item-footer span')).opacity)
        .to.equal('1');
      expect(getComputedStyle(text).webkitLineClamp).to.equal('none');
      expect(text.scrollHeight).to.be.at.most(text.clientHeight + 1);
      expect(text.getBoundingClientRect().bottom)
        .to.be.at.most(card.getBoundingClientRect().bottom + 1);
    });

    it('disconnects footer sizing observation when the block is removed', async () => {
      const observe = sinon.spy(ResizeObserver.prototype, 'observe');
      try {
        const block = await loadCarousel();
        const card = block.querySelector('.hub-hero-carousel-item[data-index]');
        const observer = observe.getCalls().find((call) => call.args[0] === card).thisValue;
        const disconnect = sinon.spy(observer, 'disconnect');
        block.remove();
        await settleLayout();
        expect(disconnect.calledOnce).to.be.true;
      } finally {
        sinon.restore();
      }
    });

    it('never temporarily narrows footer text before a card expands', async () => {
      for (const width of [1280, 1100, 850]) {
        await setViewport({ width, height: 800 });
        const block = await loadCarousel();
        window.scrollTo(0, 1800);
        await settleLayout();
        const card = block.querySelector('.hub-hero-carousel-item[data-index]');
        const paragraph = card.querySelector('.hub-hero-carousel-item-footer-text');
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
});
