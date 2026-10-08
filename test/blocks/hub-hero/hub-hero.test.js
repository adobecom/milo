import { readFile, sendKeys, sendMouse, setViewport } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

import init from '../../../libs/c2/blocks/hub-hero/hub-hero.js';

const settleLayout = async () => {
  for (let frame = 0; frame < 3; frame += 1) {
    await new Promise((resolve) => { requestAnimationFrame(resolve); });
  }
};

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

  describe('carousel edge anchoring', () => {
    let block;
    let container;
    let slides;
    let containerWidth;
    let originalViewport;
    let originalDirection;
    let observeSpy;

    const enterCard = (target) => target.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: Number(target.dataset.index), clientY: 1 }));
    before(() => {
      originalViewport = { width: window.innerWidth, height: window.innerHeight };
    });

    beforeEach(async () => {
      await setViewport({ width: 1470, height: 800 });
      originalDirection = document.documentElement.getAttribute('dir');
      observeSpy = sinon.spy(ResizeObserver.prototype, 'observe');
      block = await loadBlock('./mocks/default.html');
      block.style.setProperty('--slide-width', '392px');
      block.style.setProperty('--slides', '4');
      block.style.setProperty('--end-gap', '.5rem');
      container = block.querySelector('.hub-hero-carousel-container');
      slides = [...container.querySelectorAll('.hub-hero-carousel-item[data-index]')];
      containerWidth = 984;
      sinon.stub(container, 'getBoundingClientRect')
        .callsFake(() => new DOMRect(0, 0, containerWidth, 480));
    });

    afterEach(() => {
      document.body.replaceChildren();
      sinon.restore();
      if (originalDirection === null) document.documentElement.removeAttribute('dir');
      else document.documentElement.setAttribute('dir', originalDirection);
    });

    after(async () => {
      await setViewport(originalViewport);
    });

    it('does not anchor fitting cards using the larger authored width cap', () => {
      enterCard(slides[0]);
      expect(slides[0].classList.contains('hovered')).to.be.true;
      expect(container.classList.contains('stick-left')).to.be.false;
      expect(container.classList.contains('stick-right')).to.be.false;

      enterCard(slides[3]);
      expect(slides[3].classList.contains('hovered')).to.be.true;
      expect(container.classList.contains('stick-left')).to.be.false;
      expect(container.classList.contains('stick-right')).to.be.false;
    });

    it('updates both edge anchors when a shorter viewport narrows the active row', async () => {
      container.getBoundingClientRect.restore();
      container.style.width = '200vh';
      await setViewport({ width: 1470, height: 900 });
      enterCard(slides[0]);
      await settleLayout();
      expect(container.getBoundingClientRect().width).to.equal(1800);
      expect(container.classList.contains('stick-left')).to.be.true;

      await setViewport({ width: 1470, height: 600 });
      await settleLayout();
      expect(container.getBoundingClientRect().width).to.equal(1200);
      expect(slides[0].classList.contains('hovered')).to.be.true;
      expect(container.classList.contains('stick-left')).to.be.false;
      expect(container.classList.contains('stick-right')).to.be.false;

      await setViewport({ width: 1470, height: 900 });
      await settleLayout();
      expect(container.classList.contains('stick-left')).to.be.true;
      enterCard(slides[3]);
      expect(container.classList.contains('stick-right')).to.be.true;

      await setViewport({ width: 1470, height: 600 });
      await settleLayout();
      expect(slides[3].classList.contains('hovered')).to.be.true;
      expect(container.classList.contains('stick-left')).to.be.false;
      expect(container.classList.contains('stick-right')).to.be.false;
    });

    it('updates the viewport-width threshold even when the row does not resize', async () => {
      containerWidth = 1500;
      container.style.width = '1500px';
      container.style.height = '480px';
      enterCard(slides[0]);
      await settleLayout();
      expect(container.classList.contains('stick-left')).to.be.true;

      await setViewport({ width: 1600, height: 800 });
      await settleLayout();
      expect(container.classList.contains('stick-left')).to.be.false;
      expect(container.classList.contains('stick-right')).to.be.false;

      await setViewport({ width: 1400, height: 800 });
      await settleLayout();
      expect(slides[0].classList.contains('hovered')).to.be.true;
      expect(container.classList.contains('stick-left')).to.be.true;
    });

    it('disconnects row observation and the resize listener when the block is removed', async () => {
      const rowObserver = observeSpy.getCalls()
        .find((call) => call.args[0] === container).thisValue;
      const disconnect = sinon.spy(rowObserver, 'disconnect');
      enterCard(slides[0]);
      block.remove();
      await settleLayout();
      expect(disconnect.calledOnce).to.be.true;

      container.getBoundingClientRect.resetHistory();
      window.dispatchEvent(new Event('resize'));
      expect(container.getBoundingClientRect.called).to.be.false;
    });

    it('uses the same rendered-width check for keyboard focus', () => {
      slides[0].dispatchEvent(new FocusEvent('focus'));
      expect(slides[0].classList.contains('focused')).to.be.true;
      expect(container.classList.contains('stick-left')).to.be.false;
      expect(container.classList.contains('stick-right')).to.be.false;
    });

    it('does not anchor a carousel that is exactly as wide as the viewport', () => {
      containerWidth = 1470;
      enterCard(slides[0]);
      expect(container.classList.contains('stick-left')).to.be.false;
      expect(container.classList.contains('stick-right')).to.be.false;

      enterCard(slides[3]);
      expect(container.classList.contains('stick-left')).to.be.false;
      expect(container.classList.contains('stick-right')).to.be.false;
    });

    it('anchors only the outside cards when the rendered carousel overflows', () => {
      containerWidth = 1500;
      enterCard(slides[0]);
      expect(container.classList.contains('stick-left')).to.be.true;
      expect(container.classList.contains('stick-right')).to.be.false;

      enterCard(slides[3]);
      expect(container.classList.contains('stick-left')).to.be.false;
      expect(container.classList.contains('stick-right')).to.be.true;

      enterCard(slides[1]);
      expect(container.classList.contains('stick-left')).to.be.false;
      expect(container.classList.contains('stick-right')).to.be.false;
    });

    it('reverses outside-card anchoring in RTL', () => {
      document.documentElement.setAttribute('dir', 'rtl');
      containerWidth = 1500;
      enterCard(slides[0]);
      expect(container.classList.contains('stick-right')).to.be.true;
      expect(container.classList.contains('stick-left')).to.be.false;

      enterCard(slides[3]);
      expect(container.classList.contains('stick-left')).to.be.true;
      expect(container.classList.contains('stick-right')).to.be.false;
    });

    it('activates nested card content only when the pointer actually moves', () => {
      containerWidth = 1500;
      const move = (target, x) => target.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: x, clientY: 10 }));
      move(slides[0].querySelector('img'), 10);
      expect(slides[0].classList.contains('hovered')).to.be.true;
      expect(container.classList.contains('stick-left')).to.be.true;

      move(slides[3].querySelector('.hub-hero-carousel-item-header'), 10);
      expect(slides[0].classList.contains('hovered')).to.be.true;
      expect(slides[3].classList.contains('hovered')).to.be.false;
      expect(container.classList.contains('stick-left')).to.be.true;

      move(slides[3].querySelector('.hub-hero-carousel-item-header'), 11);
      expect(slides[3].classList.contains('hovered')).to.be.true;
      expect(container.classList.contains('stick-right')).to.be.true;
    });

    it('does not replay video on every move but resumes after leaving and rewinding', async () => {
      await settleLayout();
      const videoSlide = slides[2];
      const video = videoSlide.querySelector('video');
      const play = sinon.stub(video, 'play').resolves();
      const pause = sinon.stub(video, 'pause');
      let videoTime = 5;
      sinon.stub(video, 'currentTime').get(() => videoTime).set((value) => { videoTime = value; });
      const clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
      const move = (x) => video.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: x, clientY: 10 }));
      move(10);
      move(11);
      expect(play.calledOnce).to.be.true;

      videoSlide.dispatchEvent(new MouseEvent('mouseleave'));
      clock.tick(140);
      expect(pause.calledOnce).to.be.true;
      const rewoundTime = video.currentTime;
      expect(rewoundTime).to.be.below(5);

      move(12);
      expect(play.calledTwice).to.be.true;
      clock.tick(300);
      expect(video.currentTime).to.equal(rewoundTime);
    });

    it('holds the edge gap but clears hover when moving from it to the heading', () => {
      containerWidth = 1500;
      container.getBoundingClientRect.callsFake(() => new DOMRect(8, 0, containerWidth, 480));
      const clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
      enterCard(slides[0]);
      container.dispatchEvent(new MouseEvent('mouseleave', { clientX: 1, clientY: 10 }));
      clock.tick(20);
      expect(slides[0].classList.contains('hovered')).to.be.true;
      expect(container.classList.contains('stick-left')).to.be.true;

      block.querySelector('.hub-hero-carousel-header')
        .dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 1, clientY: 500 }));
      clock.tick(20);
      expect(slides[0].classList.contains('hovered')).to.be.false;
      expect(container.classList.contains('stick-left')).to.be.false;
    });
  });

  describe('normal-motion carousel geometry', () => {
    let styles;
    let originalViewport;
    let originalDirection;

    const expectSmoothMovement = (positions) => {
      const distance = Math.abs(positions.at(-1) - positions[0]);
      const largestStep = Math.max(...positions.slice(1)
        .map((position, index) => Math.abs(position - positions[index])));
      if (distance > 1) expect(largestStep).to.be.below(distance / 2);
      else expect(largestStep).to.be.at.most(0.1);
    };

    const finishRowTransition = (row) => Promise.all(row.getAnimations()
      .filter((animation) => animation instanceof window.CSSTransition)
      .map((animation) => animation.finished));

    const loadAssembledCarousel = async (slideCount) => {
      document.body.innerHTML = await readFile({ path: './mocks/default.html' });
      const block = document.querySelector('.hub-hero');
      if (slideCount === 3) {
        block.classList.add('slides-3');
        block.insertBefore(block.children[2].cloneNode(true), block.children[3]);
        block.lastElementChild.remove();
      }
      await init(block);
      // Freeze scroll animation at the assembled carousel; keep real hover transitions.
      block.style.animation = 'none';
      block.querySelectorAll('*').forEach((element) => { element.style.animation = 'none'; });
      block.style.setProperty('--invisible-slide-width', '0px');
      block.querySelector('.hub-hero-header').style.display = 'none';
      block.querySelector('.hub-hero-image-grid-container').style.display = 'none';
      block.querySelector('.hub-hero-carousel-header').style.display = 'none';
      const carousel = block.querySelector('.hub-hero-carousel');
      carousel.style.position = 'relative';
      carousel.style.top = '0';
      const row = block.querySelector('.hub-hero-carousel-container');
      row.style.gap = '8px';
      const placeholder = row.querySelector('.placeholder');
      if (placeholder) {
        placeholder.style.width = '0';
        placeholder.style.maxWidth = '0';
        placeholder.style.marginInline = '-4px';
      }
      const cards = [...row.querySelectorAll('[data-index]')];
      cards.forEach((card) => {
        card.style.pointerEvents = 'auto';
        card.style.height = 'var(--hub-hero-carousel-container-height)';
      });
      await settleLayout();
      return { block, carousel, row, cards };
    };

    before(async () => {
      originalViewport = { width: window.innerWidth, height: window.innerHeight };
      originalDirection = document.documentElement.getAttribute('dir');
      const tokens = await readFile({ path: '../../../libs/c2/styles/styles.css' });
      const css = await readFile({ path: '../../../libs/c2/blocks/hub-hero/hub-hero.css' });
      styles = document.createElement('style');
      styles.textContent = tokens + css;
      document.head.append(styles);
    });

    afterEach(() => {
      document.body.replaceChildren();
      window.scrollTo(0, 0);
      if (originalDirection === null) document.documentElement.removeAttribute('dir');
      else document.documentElement.setAttribute('dir', originalDirection);
    });

    after(async () => {
      styles.remove();
      await setViewport(originalViewport);
    });

    const loadResolvedStack = async (navHeight = 80) => {
      await setViewport({ width: 1470, height: 800 });
      document.body.innerHTML = await readFile({ path: './mocks/default.html' });
      const header = document.createElement('header');
      header.style.cssText = `position: fixed; top: 0; height: ${navHeight}px; width: 100%;`;
      document.body.prepend(header);
      const block = document.querySelector('.hub-hero');
      const heading = block.querySelector('h2');
      heading.textContent = 'Work faster.';
      const secondHeading = heading.cloneNode(true);
      secondHeading.textContent = 'No matter the work.';
      heading.after(secondHeading);
      await init(block);
      window.scrollTo(0, 1800);
      await settleLayout();
      return {
        block,
        header,
        heading: block.querySelector('.hub-hero-carousel-header > div'),
        row: block.querySelector('.hub-hero-carousel-container'),
      };
    };

    const expectCenteredStack = ({ header, heading, row }) => {
      const headline = heading.getBoundingClientRect();
      const cards = row.getBoundingClientRect();
      const navBottom = header.getBoundingClientRect().bottom;
      expect(cards.top - headline.bottom).to.be.closeTo(40, 0.1);
      expect(headline.top).to.be.at.least(navBottom);
      expect(cards.bottom).to.be.at.most(window.innerHeight);
      expect(headline.top - navBottom)
        .to.be.closeTo(window.innerHeight - cards.bottom, 0.1);
    };

    [80, 136].forEach((navHeight) => {
      it(`centers the resolved headline and cards below ${navHeight}px navigation at 1470x800`, async () => {
        const stack = await loadResolvedStack(navHeight);
        expect(stack.row.getBoundingClientRect().height).to.be.closeTo(480, 0.1);
        expectCenteredStack(stack);
      });
    });

    it('recenters after navigation height, headline wrapping and viewport changes', async () => {
      const stack = await loadResolvedStack();
      stack.header.style.height = '136px';
      await settleLayout();
      expectCenteredStack(stack);
      await setViewport({ width: 1470, height: 1000 });
      const initialHeadingHeight = stack.heading.getBoundingClientRect().height;
      stack.heading.style.width = '450px';
      await settleLayout();
      expect(stack.heading.getBoundingClientRect().height).to.be.above(initialHeadingHeight);
      expectCenteredStack(stack);
      document.documentElement.setAttribute('dir', 'rtl');
      await settleLayout();
      expectCenteredStack(stack);
    });

    it('keeps the headline below navigation when the complete stack cannot fit', async () => {
      const stack = await loadResolvedStack();
      await setViewport({ width: 1470, height: 500 });
      await settleLayout();
      expect(stack.heading.getBoundingClientRect().top)
        .to.be.at.least(stack.header.getBoundingClientRect().bottom);
      expect(stack.row.getBoundingClientRect().top - stack.heading.getBoundingClientRect().bottom)
        .to.be.closeTo(40, 0.1);
    });

    [3, 4].forEach((slideCount) => {
      ['ltr', 'rtl'].forEach((direction) => {
        it(`keeps ${slideCount}-slide ${direction} edge hovers stable through the gutter`, async () => {
          document.documentElement.setAttribute('dir', direction);
          await setViewport({ width: 1470, height: 770 });
          const { block, carousel, row, cards } = await loadAssembledCarousel(slideCount);
          for (const width of [1470, 1100, 800]) {
            await setViewport({ width, height: 770 });
            for (const side of ['left', 'right']) {
              await sendMouse({ type: 'move', position: [Math.round(width / 2), 700] });
              await new Promise((resolve) => { setTimeout(resolve, 350); });
              const firstCard = cards[direction === 'ltr' ? 0 : cards.length - 1];
              const lastCard = cards[direction === 'ltr' ? cards.length - 1 : 0];
              const card = side === 'left' ? firstCard : lastCard;
              const rect = card.getBoundingClientRect();
              const x = side === 'left' ? Math.max(1, Math.ceil(rect.left) + 1)
                : Math.min(width - 1, Math.floor(rect.right) - 1);
              const y = Math.round(rect.top + rect.height / 2);
              const rowWidth = row.getBoundingClientRect().width;
              const overflowing = rowWidth > width;
              const enteringPositions = [row.getBoundingClientRect().left];
              await sendMouse({ type: 'move', position: [x, y] });
              for (let frame = 0; frame < 30; frame += 1) {
                await new Promise((resolve) => { requestAnimationFrame(resolve); });
                enteringPositions.push(row.getBoundingClientRect().left);
                const hovered = card.getBoundingClientRect();
                const context = JSON.stringify({
                  width,
                  side,
                  direction,
                  frame,
                  x,
                  y,
                  before: rect.toJSON(),
                  after: hovered.toJSON(),
                  row: row.getBoundingClientRect().toJSON(),
                  classes: row.className,
                });
                expect(card.classList.contains('hovered'), context).to.be.true;
                expect(carousel.contains(document.elementFromPoint(x, y)), context).to.be.true;
                const hitArea = overflowing ? carousel.getBoundingClientRect() : hovered;
                expect(x, context).to.be.at.least(hitArea.left);
                expect(x, context).to.be.below(hitArea.right);
                expect(row.classList.contains(`stick-${side}`), context).to.equal(overflowing);
                expect(row.getBoundingClientRect().width, context).to.be.closeTo(rowWidth, 0.001);
                expect(getComputedStyle(row).justifyContent, context).to.equal('center');
              }
              await finishRowTransition(row);
              expectSmoothMovement(enteringPositions);
              if (overflowing) {
                const gutter = parseFloat(getComputedStyle(block).getPropertyValue('--s2a-spacing-xs'));
                const hovered = card.getBoundingClientRect();
                const bounds = row.getBoundingClientRect();
                expect(side === 'left' ? bounds.left : bounds.right)
                  .to.be.closeTo(side === 'left' ? gutter : width - gutter, 0.1);
                expect(hovered.left).to.be.at.least(gutter);
                expect(hovered.right).to.be.at.most(width - gutter);
                const expandedWidth = hovered.width;
                await sendMouse({ type: 'move', position: [side === 'left' ? 1 : width - 1, y] });
                for (let frame = 0; frame < 12; frame += 1) {
                  await new Promise((resolve) => { requestAnimationFrame(resolve); });
                  expect(card.matches(':hover')).to.be.false;
                  expect(carousel.contains(document.elementFromPoint(side === 'left' ? 1 : width - 1, y)))
                    .to.be.true;
                  expect(card.classList.contains('hovered')).to.be.true;
                  expect(row.classList.contains(`stick-${side}`)).to.be.true;
                  expect(card.getBoundingClientRect().width).to.equal(expandedWidth);
                }
              }
              const leavingPositions = [row.getBoundingClientRect().left];
              await sendMouse({ type: 'move', position: [Math.round(width / 2), 700] });
              for (let frame = 0; frame < 30; frame += 1) {
                await new Promise((resolve) => { requestAnimationFrame(resolve); });
                leavingPositions.push(row.getBoundingClientRect().left);
                expect(getComputedStyle(row).justifyContent).to.equal('center');
                expect(row.getBoundingClientRect().width).to.be.closeTo(rowWidth, 0.001);
              }
              await finishRowTransition(row);
              expectSmoothMovement(leavingPositions);
              expect(row.getBoundingClientRect().left).to.be.closeTo(enteringPositions[0], 0.1);
              expect(card.classList.contains('hovered')).to.be.false;
              expect(row.classList.contains('stick-left')).to.be.false;
              expect(row.classList.contains('stick-right')).to.be.false;
            }
          }
        }).timeout(15000);

        it(`sizes ${slideCount}-slide ${direction} cards monotonically during hover handoffs`, async () => {
          document.documentElement.setAttribute('dir', direction);
          await setViewport({ width: 1470, height: 700 });
          const { row, cards } = await loadAssembledCarousel(slideCount);
          const rowWidth = row.getBoundingClientRect().width;
          let outgoing;
          for (const incoming of [cards[1], cards[2], cards[1]]) {
            const rect = incoming.getBoundingClientRect();
            let incomingWidth = rect.width;
            let outgoingWidth = outgoing?.getBoundingClientRect().width;
            const sizes = [{ time: performance.now(), width: incomingWidth }];
            await sendMouse({
              type: 'move',
              position: [Math.round(rect.x + rect.width / 2), Math.round(rect.y + rect.height / 2)],
            });
            for (let frame = 0; frame < 40; frame += 1) {
              const time = await new Promise((resolve) => { requestAnimationFrame(resolve); });
              const nextWidth = incoming.getBoundingClientRect().width;
              sizes.push({ time, width: nextWidth });
              expect(nextWidth, `incoming slide ${incoming.dataset.index}, frame ${frame}`)
                .to.be.at.least(incomingWidth - 0.1);
              incomingWidth = nextWidth;
              if (outgoing) {
                const nextOutgoingWidth = outgoing.getBoundingClientRect().width;
                expect(nextOutgoingWidth, `outgoing slide ${outgoing.dataset.index}, frame ${frame}`)
                  .to.be.at.most(outgoingWidth + 0.1);
                outgoingWidth = nextOutgoingWidth;
              }
              expect(incoming.classList.contains('hovered')).to.be.true;
              expect(row.getBoundingClientRect().width).to.be.closeTo(rowWidth, 0.001);
            }
            const distance = sizes.at(-1).width - sizes[0].width;
            const peakSpeed = Math.max(...sizes.slice(1).map((size, index) => {
              const previous = sizes[index];
              const elapsed = size.time - previous.time;
              return elapsed > 5 ? (size.width - previous.width) / elapsed : 0;
            }));
            expect(distance).to.be.above(0);
            expect((peakSpeed * 300) / distance).to.be.below(3);
            outgoing = incoming;
          }
        }).timeout(10000);
      });
    });
  });

  describe('reduced-motion cards', () => {
    let styles;
    let originalViewport;
    let originalURL;
    let originalDirection;
    let block;
    let container;
    let modalSlide;

    const expectContained = (element, parent) => {
      const rect = element.getBoundingClientRect();
      const bounds = parent.getBoundingClientRect();
      expect(rect.left).to.be.at.least(bounds.left - 0.1);
      expect(rect.right).to.be.at.most(bounds.right + 0.1);
      expect(rect.top).to.be.at.least(bounds.top - 0.1);
      expect(rect.bottom).to.be.at.most(bounds.bottom + 0.1);
    };

    const expectGridOffsets = (grid) => {
      const offsets = ['one', 'two', 'three', 'four', 'five'];
      grid.querySelectorAll('.hub-hero-image-grid-container-col').forEach((column, index) => {
        const style = getComputedStyle(column);
        const offset = parseFloat(style.getPropertyValue(`--grid-col-${offsets[index]}-offset`));
        expect(style.transform).to.equal('none');
        expect(column.getBoundingClientRect().top - grid.getBoundingClientRect().top)
          .to.be.closeTo(offset, 0.1);
        expect(column.getBoundingClientRect().bottom)
          .to.be.at.most(grid.getBoundingClientRect().bottom + 0.1);
      });
    };

    before(async () => {
      originalViewport = { width: window.innerWidth, height: window.innerHeight };
      originalURL = window.location.href;
      const tokens = await readFile({ path: '../../../libs/c2/styles/styles.css' });
      const css = await readFile({ path: '../../../libs/c2/blocks/hub-hero/hub-hero.css' });
      styles = document.createElement('style');
      // Activate reduced-motion CSS without changing the runner's browser preferences.
      styles.textContent = tokens + css
        .replaceAll('prefers-reduced-motion: reduce', 'min-width: 0px')
        .replaceAll('prefers-reduced-motion: no-preference', 'min-width: 100000px');
      document.head.append(styles);
    });

    afterEach(() => {
      document.body.replaceChildren();
      window.history.replaceState(null, '', originalURL);
      if (originalDirection === null) document.documentElement.removeAttribute('dir');
      else document.documentElement.setAttribute('dir', originalDirection);
      sinon.restore();
    });

    after(async () => {
      styles.remove();
      await setViewport(originalViewport);
    });

    [3, 4].forEach((slideCount) => {
      describe(`${slideCount}-slide variant`, () => {
        beforeEach(async () => {
          originalDirection = document.documentElement.getAttribute('dir');
          await setViewport({ width: 390, height: 844 });
          const matchMedia = window.matchMedia.bind(window);
          sinon.stub(window, 'matchMedia').callsFake((query) => (
            query === '(prefers-reduced-motion: reduce)'
              ? { matches: true }
              : matchMedia(query)
          ));
          document.body.innerHTML = await readFile({ path: './mocks/default.html' });
          block = document.querySelector('.hub-hero');
          if (slideCount === 3) {
            block.classList.add('slides-3');
            block.insertBefore(block.children[2].cloneNode(true), block.children[3]);
            block.lastElementChild.remove();
          }
          block.querySelector('[data-modal-hash]').href = '#slide2-modal';
          await init(block);
          await settleLayout();
          container = block.querySelector('.hub-hero-carousel-container');
          modalSlide = container.querySelector('[data-index="2"]');
        });

        it('keeps desktop cards inside the hero with a compact normal-flow gap', async () => {
          block.parentElement.style.overflow = 'hidden';
          for (const width of [768, 1024, 1414, 1470]) {
            await setViewport({ width, height: 800 });
            await settleLayout();
            const row = container;
            const carousel = block.querySelector('.hub-hero-carousel');
            const grid = block.querySelector('.hub-hero-image-grid-container');
            const carouselStyle = getComputedStyle(carousel);
            expect(carouselStyle.top).to.equal('0px');
            expect(parseFloat(carouselStyle.paddingTop)).to.equal(64);
            expect(carousel.getBoundingClientRect().top)
              .to.be.closeTo(grid.getBoundingClientRect().bottom, 0.1);
            expectContained(container, block);
            expectGridOffsets(grid);
            const heroBottom = block.getBoundingClientRect().bottom;
            container.querySelectorAll('[data-index]').forEach((card) => {
              const cardRect = card.getBoundingClientRect();
              const header = card.querySelector('.hub-hero-carousel-item-header');
              const footer = card.querySelector('.hub-hero-carousel-item-footer');
              expect(cardRect.bottom).to.be.at.most(heroBottom + 0.1);
              expect(header.getBoundingClientRect().top).to.be.at.least(cardRect.top - 0.1);
              expect(footer.getBoundingClientRect().bottom).to.be.at.most(cardRect.bottom + 0.1);
              expectContained(card, row);
              expectContained(header, card);
              expectContained(footer, card);
            });
          }
        });

        it('keeps symmetric gutters and caps the row width across mobile sizes', async () => {
          for (const width of [320, 390, 410, 767]) {
            await setViewport({ width, height: 844 });
            await settleLayout();
            const row = container;
            const heroRect = block.getBoundingClientRect();
            const rowRect = container.getBoundingClientRect();
            const gutter = parseFloat(getComputedStyle(block).getPropertyValue('--s2a-spacing-lg'));
            expect(rowRect.width).to.equal(Math.min(550, heroRect.width - gutter * 2));
            expect(rowRect.left - heroRect.left)
              .to.be.closeTo(heroRect.right - rowRect.right, 0.1);
            expect(rowRect.left - heroRect.left).to.be.at.least(gutter);
            const carousel = block.querySelector('.hub-hero-carousel');
            const carouselHeader = carousel.querySelector('.hub-hero-carousel-header');
            const grid = block.querySelector('.hub-hero-image-grid-container');
            expect(getComputedStyle(container).marginTop).to.equal('0px');
            expect(parseFloat(getComputedStyle(carousel).paddingTop)).to.equal(40);
            expect(rowRect.top - carouselHeader.getBoundingClientRect().bottom)
              .to.be.closeTo(64, 0.1);
            expectContained(container, block);
            expectGridOffsets(grid);
            const cards = [...container.querySelectorAll('[data-index]')];
            cards.forEach((card, index) => {
              expect(getComputedStyle(card).position).to.equal('relative');
              expect(getComputedStyle(card).top).to.equal('0px');
              expectContained(card, row);
              const footer = card.querySelector('.hub-hero-carousel-item-footer');
              expectContained(footer, card);
              expectContained(footer.firstElementChild, footer);
              if (index > 0) {
                expect(card.getBoundingClientRect().top - cards[index - 1]
                  .getBoundingClientRect().bottom).to.be.closeTo(12, 0.1);
              }
            });
          }
        });

        it('keeps long mobile headings in flow between the staggered grid and cards', async () => {
          const header = block.querySelector('.hub-hero-carousel-header');
          const cell = header.firstElementChild;
          cell.querySelector('h2').textContent = 'Trabaja más rápido';
          const heading = document.createElement('h2');
          heading.textContent = 'No importa cuál sea el trabajo '
            + 'ColaboraciónInternacionalConDocumentosDigitales';
          cell.append(heading);
          const grid = block.querySelector('.hub-hero-image-grid-container');
          for (const width of [320, 410, 767]) {
            await setViewport({ width, height: 844 });
            await settleLayout();
            const headerRect = header.getBoundingClientRect();
            const rowRect = container.getBoundingClientRect();
            expect(getComputedStyle(header).position).to.equal('relative');
            expect(getComputedStyle(cell).position).to.equal('relative');
            expect(getComputedStyle(header).top).to.equal('0px');
            expect(headerRect.left).to.equal(rowRect.left);
            expect(headerRect.width).to.equal(rowRect.width);
            expect(headerRect.top - grid.getBoundingClientRect().bottom).to.be.closeTo(40, 0.1);
            expect(rowRect.top - headerRect.bottom).to.be.closeTo(64, 0.1);
            expectContained(cell, header);
            expectContained(heading, header);
            const range = document.createRange();
            range.selectNodeContents(heading);
            [...range.getClientRects()].forEach((rect) => {
              expect(rect.left).to.be.at.least(headerRect.left - 0.1);
              expect(rect.right).to.be.at.most(headerRect.right + 0.1);
            });
          }
        });

        it('keeps the RTL desktop row centered without transformed anchoring', async () => {
          document.documentElement.setAttribute('dir', 'rtl');
          await setViewport({ width: 1024, height: 800 });
          await settleLayout();
          const row = container.getBoundingClientRect();
          const hero = block.getBoundingClientRect();
          expect(row.left - hero.left).to.be.closeTo(hero.right - row.right, 0.1);
          expect(getComputedStyle(container).transform).to.equal('none');
          expectContained(container, block);
        });

        it('does not jump to animated scroll progress when a static card is focused', async () => {
          const scrollTo = sinon.spy(window, 'scrollTo');
          sinon.stub(modalSlide, 'matches').withArgs(':focus-visible').returns(true);
          modalSlide.focus({ preventScroll: true });
          await settleLayout();
          expect(document.activeElement).to.equal(modalSlide);
          expect(scrollTo.called).to.be.false;
        });

        it('does not apply motion states or replay video on hover and focus', async () => {
          const video = container.querySelector('video');
          const play = sinon.stub(video, 'play').resolves();
          for (const width of [410, 1024]) {
            await setViewport({ width, height: 844 });
            await settleLayout();
            for (const card of container.querySelectorAll('[data-index]')) {
              play.resetHistory();
              card.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
              card.focus({ preventScroll: true });
              expect(play.called).to.be.false;
              await settleLayout();
              expect(card.classList.contains('hovered')).to.be.false;
              expect(card.classList.contains('focused')).to.be.false;
              expect(document.activeElement).to.equal(card);
              expect(container.classList.contains('stick-left')).to.be.false;
              expect(container.classList.contains('stick-right')).to.be.false;
            }
          }
        });

        it('clears stale motion classes when reduced-motion anchoring is refreshed', async () => {
          modalSlide.classList.add('hovered', 'focused');
          container.classList.add('stick-left', 'stick-right');
          window.dispatchEvent(new Event('resize'));
          await settleLayout();
          expect(modalSlide.classList.contains('hovered')).to.be.false;
          expect(modalSlide.classList.contains('focused')).to.be.false;
          expect(container.classList.contains('stick-left')).to.be.false;
          expect(container.classList.contains('stick-right')).to.be.false;
        });

        it('ignores real hover and focus-visible for static card sizing', async () => {
          for (const width of [410, 1024]) {
            await setViewport({ width, height: 844 });
            modalSlide.scrollIntoView({ block: 'center' });
            await settleLayout();
            const before = modalSlide.getBoundingClientRect();
            const media = modalSlide.querySelector('.hub-hero-carousel-item-media img');
            const imageTransform = getComputedStyle(media).transform;
            await sendMouse({
              type: 'move',
              position: [
                Math.round(before.x + before.width / 2),
                Math.round(before.y + before.height / 2),
              ],
            });
            await settleLayout();
            expect(modalSlide.matches(':hover')).to.be.true;
            expect(modalSlide.classList.contains('hovered')).to.be.false;
            await sendKeys({ press: 'Tab' });
            modalSlide.focus({ preventScroll: true });
            await settleLayout();
            expect(modalSlide.matches(':focus-visible')).to.be.true;
            expect(modalSlide.classList.contains('focused')).to.be.false;
            expect(modalSlide.getBoundingClientRect().width).to.equal(before.width);
            expect(modalSlide.getBoundingClientRect().x).to.equal(before.x);
            expect(getComputedStyle(media).transform).to.equal(imageTransform);
            modalSlide.classList.add('hovered', 'focused');
            expect(modalSlide.getBoundingClientRect().width).to.equal(before.width);
            expect(getComputedStyle(media).transform).to.equal(imageTransform);
            modalSlide.classList.remove('hovered', 'focused');
          }
        });

        it('keeps every mobile card width stable for hover and keyboard focus', async () => {
          await setViewport({ width: 410, height: 844 });
          await settleLayout();
          for (const card of container.querySelectorAll('[data-index]')) {
            const before = card.getBoundingClientRect();
            expect(before.width).to.equal(container.getBoundingClientRect().width);
            card.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            expect(card.getBoundingClientRect().width).to.equal(before.width);
            card.focus({ preventScroll: true });
            await settleLayout();
            expect(document.activeElement).to.equal(card);
            const after = card.getBoundingClientRect();
            expect(after.width).to.equal(before.width);
            expect(after.x).to.equal(before.x);
          }
        });

        it('opens the modal on the first text click without shrinking the card', async () => {
          modalSlide.scrollIntoView({ block: 'center' });
          await settleLayout();
          const before = modalSlide.getBoundingClientRect();
          const heading = modalSlide.querySelector('.hub-hero-carousel-item-header');
          const rect = heading.getBoundingClientRect();
          const click = sinon.spy();
          modalSlide.addEventListener('click', click);
          await sendMouse({
            type: 'click',
            position: [
              Math.round(rect.x + rect.width / 2),
              Math.round(rect.y + rect.height / 2),
            ],
            button: 'left',
          });
          expect(click.calledOnce).to.be.true;
          expect(window.location.hash).to.equal('#slide2-modal');
          const after = modalSlide.getBoundingClientRect();
          expect(after.width).to.equal(before.width);
          expect(after.x).to.equal(before.x);
        });
      });
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
      expect(carousel.getAttribute('aria-label')).to.equal('Adobe slides');
    });

    it('still produces the full header/grid/carousel structure', () => {
      expect(block.querySelector('.hub-hero-header')).to.exist;
      expect(block.querySelectorAll('.hub-hero-image-grid-container-col')).to.have.lengthOf(5);
      expect(block.querySelectorAll('.hub-hero-carousel-item')).to.have.lengthOf(5);
    });
  });
});
