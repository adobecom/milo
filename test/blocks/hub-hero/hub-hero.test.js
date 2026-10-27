import { readFile, sendMouse, setViewport } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { loadStyle } from '../../../libs/utils/utils.js';
import { mepMasStudioUrls } from '../../../libs/blocks/merch/mas-mep-utils.js';
import { watchForMasContent, unwatchForMasContent } from '../../../libs/features/mep/mep-next/mep-mas.js';

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
  describe('MEP inline MAS editing', () => {
    afterEach(() => {
      unwatchForMasContent();
      delete document.body.dataset.mepMasHighlight;
      sinon.restore();
    });

    it('preserves live MAS fields in the hero and carousel text', async () => {
      document.body.innerHTML = await readFile({ path: './mocks/default.html' });
      const block = document.querySelector('.hub-hero');
      const slide = block.children[4];
      const targets = [
        block.querySelector('h1'), slide.firstElementChild.querySelector('p'),
        slide.firstElementChild.querySelector('h3'),
      ];
      const fields = targets.map((target) => {
        target.innerHTML = '<mas-field field="cardTitle" data-mas-block="inline"><span data-role="mas-field-content">Creative apps</span></mas-field>';
        return target.firstElementChild;
      });
      const urls = fields.map((field, index) => {
        const url = `https://mas.adobe.com/studio.html#content-type=merch-card&query=hub-${index}&field=cardTitle`;
        mepMasStudioUrls.set(field, url);
        return url;
      });
      const readySpies = fields.map((field) => {
        const spy = sinon.spy();
        field.addEventListener('mas:ready', spy);
        return spy;
      });
      const media = slide.children[1].firstElementChild;
      const openStub = sinon.stub(window, 'open');
      document.body.dataset.mepMasHighlight = 'true';
      watchForMasContent();
      await init(block);

      expect(block.querySelector('.hub-hero-header h1 mas-field')).to.equal(fields[0]);
      const renderedSlide = block.querySelector('.hub-hero-carousel-item[data-index="1"]');
      expect(renderedSlide.querySelector('.hub-hero-carousel-item-header mas-field')).to.equal(fields[1]);
      expect(renderedSlide.querySelector('.hub-hero-carousel-item-footer mas-field')).to.equal(fields[2]);
      expect(renderedSlide.querySelector('.hub-hero-carousel-item-media picture')).to.equal(media);
      expect(renderedSlide.getAttribute('aria-labelledby'))
        .to.equal('hub-hero-slide-1-title hub-hero-slide-1-desc');
      fields.forEach((field, index) => {
        field.dispatchEvent(new Event('mas:ready'));
        expect(readySpies[index].calledOnce).to.be.true;
        sinon.stub(field, 'getBoundingClientRect').returns({ top: 100, right: 400, height: 30 });
        field.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, cancelable: true, clientX: 300, clientY: 90 }));
        expect(openStub.getCall(index).args).to.deep.equal([urls[index], '_blank', 'noopener,noreferrer']);
      });
    });
  });

  describe('MAS hero body copy', () => {
    let stylesheet;
    before(async () => {
      await new Promise((resolve, reject) => {
        loadStyle('/libs/c2/blocks/hub-hero/hub-hero.css', (status) => {
          if (status === 'error') reject(new Error('Failed to load Hub Hero styles'));
          else resolve();
        });
      });
      stylesheet = document.head.querySelector('link[href="/libs/c2/blocks/hub-hero/hub-hero.css"]');
    });
    after(() => stylesheet.remove());

    ['before decoration', 'after decoration', 'already unwrapped'].forEach((timing) => {
      ['lg', 'md'].forEach((size) => {
        it(`preserves body-${size} for fields resolved ${timing}`, async () => {
          document.body.innerHTML = await readFile({ path: './mocks/default.html' });
          const block = document.querySelector('.hub-hero');
          block.classList.replace('body-lg', `body-${size}`);
          const paragraph = block.firstElementChild.firstElementChild.querySelector('p');
          paragraph.innerHTML = '<mas-field field="shortDescription"><span data-role="mas-field-content"></span></mas-field>';
          const field = paragraph.firstElementChild;
          const resolve = () => {
            field.firstElementChild.innerHTML = '<p>Create with <span is="inline-price">US$9.99/mo</span>.</p><p><em>Terms apply.</em> <a href="/terms">See terms</a></p>';
          };
          if (timing !== 'after decoration') resolve();
          if (timing === 'already unwrapped') paragraph.replaceWith(field);
          await init(block);
          if (timing === 'after decoration') resolve();

          const body = field.parentElement;
          expect(body.tagName).to.equal('DIV');
          expect(body.classList.contains(`body-${size}`)).to.be.true;
          expect(body.closest('.hub-hero-header')).to.exist;
          expect(body.parentElement.classList.contains(`body-${size}`)).to.be.true;
          expect(getComputedStyle(body).maxWidth).to.equal('700px');
          expect(getComputedStyle(body).display).to.equal('block');
          body.style.fontSize = '22px';
          body.style.lineHeight = '30px';
          expect(field.querySelectorAll('p').length).to.equal(2);
          field.querySelectorAll('p').forEach((p) => {
            expect(getComputedStyle(p).display).to.equal('inline');
            expect(getComputedStyle(p).fontSize).to.equal('22px');
            expect(getComputedStyle(p).lineHeight).to.equal('30px');
          });
          expect(getComputedStyle(field.querySelector('p + p'), '::before').content).to.equal('" "');
          expect(field.querySelector('a').getAttribute('href')).to.equal('/terms');
          expect(field.querySelector('em').textContent).to.equal('Terms apply.');
          expect(field.querySelector('[is="inline-price"]').textContent).to.equal('US$9.99/mo');
          expect(block.querySelector('.promo-cta').getAttribute('href')).to.equal('https://www.adobe.com/explore');
          expect(block.querySelectorAll('.hub-hero-carousel-item:not(.placeholder)').length).to.equal(4);
        });
      });
    });
  });

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
      expect(modal.getAttribute('aria-haspopup')).to.equal('dialog');
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
      slides[0].focus();
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

    it('anchors overflow smaller than a classic scrollbar in both directions', () => {
      sinon.stub(document.documentElement, 'clientWidth').get(() => 1455);
      containerWidth = 1460;
      enterCard(slides[0]);
      expect(container.classList.contains('stick-left')).to.be.true;
      expect(container.style.getPropertyValue('--carousel-viewport-width')).to.equal('1455px');
      enterCard(slides[3]);
      expect(container.classList.contains('stick-right')).to.be.true;

      document.documentElement.setAttribute('dir', 'rtl');
      enterCard(slides[0]);
      expect(container.classList.contains('stick-right')).to.be.true;
    });

    it('does not count the vertical scrollbar as a right-edge hover gap', () => {
      sinon.stub(document.documentElement, 'clientWidth').get(() => 1455);
      containerWidth = 1500;
      container.getBoundingClientRect.callsFake(() => new DOMRect(-70, 0, containerWidth, 480));
      const clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
      enterCard(slides[3]);
      container.dispatchEvent(new MouseEvent('mouseleave', { clientX: 1460, clientY: 10 }));
      clock.tick(20);
      expect(slides[3].classList.contains('hovered')).to.be.false;
      expect(container.classList.contains('stick-right')).to.be.false;
    });

    it('cancels pending leave before ignoring a same-position mousemove', () => {
      containerWidth = 1500;
      const clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
      enterCard(slides[3]);
      container.dispatchEvent(new MouseEvent('mouseleave', { clientX: 4, clientY: 1 }));
      enterCard(slides[3]);
      clock.tick(20);
      expect(slides[3].classList.contains('hovered')).to.be.true;
      expect(container.classList.contains('stick-right')).to.be.true;
    });

    it('ignores layout-retargeted row movement without canceling a real blank-space leave', () => {
      containerWidth = 1500;
      const clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
      const move = (target, x) => target.dispatchEvent(new MouseEvent('mousemove', {
        bubbles: true,
        clientX: x,
        clientY: 10,
      }));
      move(slides[0].querySelector('img'), 10);
      move(container, 10);
      clock.tick(20);
      expect(slides[0].classList.contains('hovered')).to.be.true;
      const carousel = block.querySelector('.hub-hero-carousel');
      move(carousel, 20);
      move(carousel, 20);
      clock.tick(20);
      expect(slides[0].classList.contains('hovered')).to.be.false;
      expect(container.classList.contains('stick-left')).to.be.false;
    });

    [0, 3].forEach((index) => {
      it(`clears slide ${index + 1} hover in the outside margin of a fitting row`, () => {
        container.getBoundingClientRect.callsFake(() => new DOMRect(200, 0, 984, 480));
        const clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
        enterCard(slides[index]);
        block.querySelector('.hub-hero-carousel').dispatchEvent(new MouseEvent('mousemove', {
          bubbles: true,
          clientX: index === 0 ? 100 : 1300,
          clientY: 10,
        }));
        clock.tick(20);
        expect(slides[index].classList.contains('hovered')).to.be.false;
        expect(container.classList.contains('stick-left')).to.be.false;
        expect(container.classList.contains('stick-right')).to.be.false;
      });
    });

    it('recenters both edge cards on wheel without reactivating a stationary pointer', () => {
      containerWidth = 1500;
      for (const index of [0, 3]) {
        enterCard(slides[index]);
        expect(container.classList.contains(index === 0 ? 'stick-left' : 'stick-right')).to.be.true;
        window.dispatchEvent(new WheelEvent('wheel', { deltaY: 100 }));
        expect(slides[index].classList.contains('hovered')).to.be.false;
        expect(container.classList.contains('stick-left')).to.be.false;
        expect(container.classList.contains('stick-right')).to.be.false;
        enterCard(slides[index]);
        expect(slides[index].classList.contains('hovered')).to.be.false;
      }
    });

    it('keeps hover state while a modal curtain is open and clears it once closed', () => {
      const curtain = document.body.appendChild(document.createElement('div'));
      curtain.className = 'modal-curtain';
      enterCard(slides[0]);
      window.dispatchEvent(new WheelEvent('wheel', { deltaY: 100 }));
      expect(slides[0].classList.contains('hovered')).to.be.true;
      curtain.remove();
      window.dispatchEvent(new WheelEvent('wheel', { deltaY: 100 }));
      expect(slides[0].classList.contains('hovered')).to.be.false;
    });

    it('clears hover when the modal closes with the pointer off the cards', async () => {
      const curtain = document.body.appendChild(document.createElement('div'));
      curtain.className = 'modal-curtain';
      enterCard(slides[0]);
      window.dispatchEvent(new CustomEvent('milo:modal:closed'));
      curtain.remove();
      await new Promise((resolve) => { setTimeout(resolve); });
      expect(slides[0].classList.contains('hovered')).to.be.false;
    });

    it('does not expand a card for mouse-initiated focus', () => {
      sinon.stub(slides[0], 'matches').withArgs(':focus-visible').returns(false);
      slides[0].dispatchEvent(new FocusEvent('focus'));
      expect(slides[0].classList.contains('focused')).to.be.false;
    });

    it('keeps one active card and keeps keyboard focus through pointer clears', () => {
      slides[0].focus();
      window.dispatchEvent(new WheelEvent('wheel', { deltaY: 100 }));
      expect(slides[0].classList.contains('focused')).to.be.true;
      enterCard(slides[3]);
      expect(slides[0].classList.contains('focused')).to.be.false;
      expect(slides[3].classList.contains('hovered')).to.be.true;
    });

    it('restores the keyboard-focused card once the pointer leaves the carousel', async () => {
      slides[0].focus();
      enterCard(slides[3]);
      expect(slides[0].classList.contains('focused')).to.be.false;
      container.dispatchEvent(new MouseEvent('mouseleave', { clientX: 1460, clientY: 900 }));
      await new Promise((resolve) => { setTimeout(resolve, 30); });
      expect(slides[3].classList.contains('hovered')).to.be.false;
      expect(slides[0].classList.contains('focused')).to.be.true;
      expect(container.querySelectorAll('.hovered, .focused').length).to.equal(1);
    });

    it('reuses carousel context instead of querying slide ancestors during hover and focus', () => {
      const closest = sinon.spy(slides[0], 'closest');
      const styles = sinon.spy(window, 'getComputedStyle');
      slides[0].querySelector('img')
        .dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 10, clientY: 10 }));
      slides[0].dispatchEvent(new FocusEvent('focus'));
      expect(closest.calledWith('.hub-hero')).to.be.false;
      expect(closest.calledWith('.hub-hero-carousel')).to.be.false;
      expect(styles.calledWith(block)).to.be.false;
    });

    it('batches repeated viewport resize updates into one frame', async () => {
      await settleLayout();
      enterCard(slides[0]);
      container.getBoundingClientRect.resetHistory();
      const frames = sinon.stub(window, 'requestAnimationFrame').returns(1);
      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('resize'));
      expect(frames.calledOnce).to.be.true;
      expect(container.getBoundingClientRect.called).to.be.false;
      frames.firstCall.args[0]();
      expect(container.getBoundingClientRect.calledOnce).to.be.true;
    });

    it('does not measure an inactive row on resize', async () => {
      await settleLayout();
      container.getBoundingClientRect.resetHistory();
      container.style.width = '1500px';
      window.dispatchEvent(new Event('resize'));
      await settleLayout();
      expect(container.getBoundingClientRect.called).to.be.false;
    });

    it('cancels a queued anchoring frame when the block is removed', async () => {
      await settleLayout();
      enterCard(slides[0]);
      window.dispatchEvent(new Event('resize'));
      container.getBoundingClientRect.resetHistory();
      block.remove();
      await settleLayout();
      expect(container.getBoundingClientRect.called).to.be.false;
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
      clock.tick(5);
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

    const finishRowTransition = async (row) => {
      (row.closest('.hub-hero') || row).getAnimations({ subtree: true })
        .filter((animation) => animation instanceof window.CSSTransition)
        .forEach((animation) => animation.finish());
    };

    const settleTransitions = async (row) => {
      await new Promise((resolve) => { requestAnimationFrame(resolve); });
      await finishRowTransition(row);
    };

    // Steps running transitions through their timeline deterministically instead of in real time.
    const stepTransitions = (scope, steps, sample) => {
      const transitions = scope.getAnimations({ subtree: true })
        .filter((animation) => animation instanceof window.CSSTransition);
      transitions.forEach((animation) => animation.pause());
      const lengths = transitions.map((animation) => animation.effect.getComputedTiming().endTime);
      for (let step = 1; step <= steps; step += 1) {
        transitions.forEach((animation, index) => {
          animation.currentTime = (lengths[index] * step) / steps;
        });
        sample(step);
      }
      transitions.forEach((animation) => animation.finish());
    };

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

    afterEach(async () => {
      document.body.replaceChildren();
      window.scrollTo(0, 0);
      sinon.restore();
      // A pointer left over the old carousel position would hover or leave the next test's block.
      await sendMouse({ type: 'move', position: [0, 0] });
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

    it('centers the portrait stack when XL media reaches its 392px width cap', async () => {
      const stack = await loadResolvedStack();
      await setViewport({ width: 1920, height: 1200 });
      await settleLayout();
      await finishRowTransition(stack.row);
      expectCenteredStack(stack);
    });

    it('measures the final heading stack without observing its animated gap', async () => {
      const observe = sinon.spy(ResizeObserver.prototype, 'observe');
      const stack = await loadResolvedStack();
      const measuredHeight = stack.block.style.getPropertyValue('--hub-hero-carousel-header-height');
      const writes = sinon.spy(stack.block.style, 'setProperty');
      stack.heading.style.animation = 'none';
      stack.heading.style.gap = '64px';
      await settleLayout();
      expect(stack.heading.getBoundingClientRect().height).to.be.above(parseFloat(measuredHeight));
      expect(stack.block.style.getPropertyValue('--hub-hero-carousel-header-height'))
        .to.equal(measuredHeight);
      expect(writes.calledWith('--hub-hero-carousel-header-height')).to.be.false;
      expect(observe.calledWith(stack.heading)).to.be.false;
      expect(observe.calledWith(stack.heading.firstElementChild)).to.be.true;
    });

    it('tolerates a missing carousel heading wrapper', async () => {
      document.body.innerHTML = await readFile({ path: './mocks/default.html' });
      const block = document.querySelector('.hub-hero');
      const header = block.children[3];
      header.replaceChildren(...header.firstElementChild.children);
      await init(block);
      await settleLayout();
      expect(block.querySelector('.hub-hero-carousel')).to.exist;
      expect(block.style.getPropertyValue('--hub-hero-carousel-header-height')).to.equal('');
    });

    it('positions overflowing rows against the visible width rather than the scrollbar', async () => {
      await setViewport({ width: 1370, height: 770 });
      sinon.stub(document.documentElement, 'clientWidth').get(() => 1355);
      for (const direction of ['ltr', 'rtl']) {
        document.documentElement.setAttribute('dir', direction);
        const { carousel, row, cards } = await loadAssembledCarousel(4);
        // Reproduce the containing block width of a classic 15px scrollbar.
        carousel.style.width = '1355px';
        carousel.style.margin = '0 auto 0 0';
        row.style.width = '1360px';
        await settleLayout();
        const card = cards[direction === 'ltr' ? cards.length - 1 : 0];
        card.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 1200, clientY: 100 }));
        await settleLayout();
        await finishRowTransition(row);
        expect(row.classList.contains('stick-right')).to.be.true;
        expect(row.getBoundingClientRect().right).to.be.closeTo(1355 - 8, 0.1);
        expect(card.getBoundingClientRect().right).to.be.at.most(1355 - 8);
      }
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
      // Both slide counts and both directions are covered without the full cross product.
      [slideCount === 3 ? 'ltr' : 'rtl'].forEach((direction) => {
        it(`keeps ${slideCount}-slide ${direction} edge hovers stable through the gutter`, async () => {
          document.documentElement.setAttribute('dir', direction);
          await setViewport({ width: 1470, height: 770 });
          const { block, carousel, row, cards } = await loadAssembledCarousel(slideCount);
          for (const width of [1470, 800]) {
            await setViewport({ width, height: 770 });
            for (const side of ['left', 'right']) {
              await sendMouse({ type: 'move', position: [Math.round(width / 2), 700] });
              await settleTransitions(row);
              const firstCard = cards[direction === 'ltr' ? 0 : cards.length - 1];
              const lastCard = cards[direction === 'ltr' ? cards.length - 1 : 0];
              const card = side === 'left' ? firstCard : lastCard;
              const rect = card.getBoundingClientRect();
              const x = side === 'left' ? Math.max(1, Math.ceil(rect.left) + 1)
                : Math.min(width - 1, Math.floor(rect.right) - 1);
              const y = Math.round(rect.top + rect.height / 2);
              const rowWidth = row.getBoundingClientRect().width;
              const carouselBounds = carousel.getBoundingClientRect();
              expect(row.getBoundingClientRect().left + rowWidth / 2)
                .to.be.closeTo(carouselBounds.left + carouselBounds.width / 2, 0.1);
              const overflowing = rowWidth > width;
              const enteringPositions = [row.getBoundingClientRect().left];
              await sendMouse({ type: 'move', position: [x, y] });
              stepTransitions(block, 20, (frame) => {
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
              });
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
                for (let frame = 0; frame < 6; frame += 1) {
                  await new Promise((resolve) => { requestAnimationFrame(resolve); });
                  expect(card.matches(':hover')).to.be.false;
                  expect(carousel.contains(document.elementFromPoint(side === 'left' ? 1 : width - 1, y)))
                    .to.be.true;
                  expect(card.classList.contains('hovered')).to.be.true;
                  expect(row.classList.contains(`stick-${side}`)).to.be.true;
                  expect(card.getBoundingClientRect().width).to.equal(expandedWidth);
                }
              } else {
                const hovered = card.getBoundingClientRect();
                const outsideX = side === 'left' ? Math.floor(hovered.left) - 2
                  : Math.ceil(hovered.right) + 2;
                await sendMouse({ type: 'move', position: [outsideX, y] });
                await new Promise((resolve) => { setTimeout(resolve, 30); });
                expect(card.classList.contains('hovered')).to.be.false;
              }
              const leavingPositions = [row.getBoundingClientRect().left];
              await sendMouse({ type: 'move', position: [Math.round(width / 2), 700] });
              // Leaving clears hover on a short timer.
              await new Promise((resolve) => { setTimeout(resolve, 30); });
              stepTransitions(block, 20, () => {
                leavingPositions.push(row.getBoundingClientRect().left);
                expect(getComputedStyle(row).justifyContent).to.equal('center');
                expect(row.getBoundingClientRect().width).to.be.closeTo(rowWidth, 0.001);
              });
              await finishRowTransition(row);
              expectSmoothMovement(leavingPositions);
              expect(row.getBoundingClientRect().left).to.be.closeTo(enteringPositions[0], 0.1);
              expect(card.classList.contains('hovered')).to.be.false;
              expect(row.classList.contains('stick-left')).to.be.false;
              expect(row.classList.contains('stick-right')).to.be.false;
            }
          }
        }).timeout(20000);
      });
    });

    // The wheel recenter and hover handoff logic is independent of slide count and direction.
    [4].forEach((slideCount) => {
      ['rtl'].forEach((direction) => {
        it(`recenters ${slideCount}-slide ${direction} edge cards on wheel with a stationary pointer`, async () => {
          document.documentElement.setAttribute('dir', direction);
          await setViewport({ width: 800, height: 770 });
          const { row, cards } = await loadAssembledCarousel(slideCount);
          expect(row.getBoundingClientRect().width).to.be.above(800);
          for (const side of ['left', 'right']) {
            await sendMouse({ type: 'move', position: [400, 700] });
            await settleTransitions(row);
            const restingLeft = row.getBoundingClientRect().left;
            const index = side === 'left' ? 0 : cards.length - 1;
            const card = cards[direction === 'ltr' ? index : cards.length - 1 - index];
            const rect = card.getBoundingClientRect();
            const x = side === 'left' ? Math.max(1, Math.ceil(rect.left) + 1)
              : Math.min(799, Math.floor(rect.right) - 1);
            const y = Math.round(rect.top + rect.height / 2);
            await sendMouse({ type: 'move', position: [x, y] });
            await settleTransitions(row);
            expect(row.classList.contains(`stick-${side}`)).to.be.true;
            await sendMouse({ type: 'move', position: [side === 'left' ? 1 : 799, y] });
            expect(card.classList.contains('hovered')).to.be.true;
            window.dispatchEvent(new WheelEvent('wheel', { deltaY: 100 }));
            for (let frame = 0; frame < 12; frame += 1) {
              await new Promise((resolve) => { requestAnimationFrame(resolve); });
              expect(card.classList.contains('hovered')).to.be.false;
              expect(row.classList.contains('stick-left')).to.be.false;
              expect(row.classList.contains('stick-right')).to.be.false;
            }
            await finishRowTransition(row);
            expect(row.getBoundingClientRect().left).to.be.closeTo(restingLeft, 0.1);
          }
        }).timeout(5000);
      });
    });

    [3].forEach((slideCount) => {
      ['ltr'].forEach((direction) => {
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
            const previous = outgoing;
            const sizes = [incomingWidth];
            await sendMouse({
              type: 'move',
              position: [Math.round(rect.x + rect.width / 2), Math.round(rect.y + rect.height / 2)],
            });
            stepTransitions(row, 20, (frame) => {
              const nextWidth = incoming.getBoundingClientRect().width;
              sizes.push(nextWidth);
              expect(nextWidth, `incoming slide ${incoming.dataset.index}, frame ${frame}`)
                .to.be.at.least(incomingWidth - 0.1);
              incomingWidth = nextWidth;
              if (previous) {
                const nextOutgoingWidth = previous.getBoundingClientRect().width;
                expect(nextOutgoingWidth, `outgoing slide ${previous.dataset.index}, frame ${frame}`)
                  .to.be.at.most(outgoingWidth + 0.1);
                outgoingWidth = nextOutgoingWidth;
              }
              expect(incoming.classList.contains('hovered')).to.be.true;
              expect(row.getBoundingClientRect().width).to.be.closeTo(rowWidth, 0.001);
            });
            const distance = sizes.at(-1) - sizes[0];
            expect(distance).to.be.above(0);
            expectSmoothMovement(sizes);
            outgoing = incoming;
          }
        }).timeout(10000);
      });
    });
  });

  describe('reduced-motion cards', () => {
    let block;
    let container;
    let slides;

    beforeEach(async () => {
      const matchMedia = window.matchMedia.bind(window);
      sinon.stub(window, 'matchMedia').callsFake((query) => (
        query === '(prefers-reduced-motion: reduce)' ? { matches: true } : matchMedia(query)
      ));
      block = await loadBlock('./mocks/default.html');
      container = block.querySelector('.hub-hero-carousel-container');
      slides = [...container.querySelectorAll('[data-index]')];
      await settleLayout();
    });

    afterEach(() => {
      document.body.replaceChildren();
      sinon.restore();
    });

    it('preserves the existing hover state and card video playback', () => {
      const videoSlide = slides[2];
      const video = videoSlide.querySelector('video');
      const play = sinon.stub(video, 'play').resolves();
      video.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 10, clientY: 10 }));
      expect(videoSlide.classList.contains('hovered')).to.be.true;
      expect(play.calledOnce).to.be.true;
    });

    it('preserves focused state and the existing keyboard scroll target', async () => {
      sinon.stub(block, 'offsetHeight').get(() => 4000);
      sinon.stub(slides[0], 'matches').withArgs(':focus-visible').returns(true);
      const scrollTo = sinon.stub(window, 'scrollTo');
      slides[0].dispatchEvent(new FocusEvent('focus'));
      await settleLayout();
      expect(slides[0].classList.contains('focused')).to.be.true;
      expect(scrollTo.calledOnce).to.be.true;
      expect(scrollTo.firstCall.args[0].behavior).to.equal('instant');
    });

    it('does not clear hover or focus states on resize', async () => {
      slides[0].classList.add('hovered', 'focused');
      window.dispatchEvent(new Event('resize'));
      await settleLayout();
      expect(slides[0].classList.contains('hovered')).to.be.true;
      expect(slides[0].classList.contains('focused')).to.be.true;
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
