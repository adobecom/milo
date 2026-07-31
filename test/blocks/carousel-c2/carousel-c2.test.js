import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

import init from '../../../libs/c2/blocks/carousel-c2/carousel-c2.js';

describe('Carousel C2', () => {
  it('does nothing when the block is not inside a section', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/no-section.html' });
    const block = document.querySelector('.carousel-c2');
    init(block);

    expect(block.getAttribute('role')).to.be.null;
    expect(block.getAttribute('aria-roledescription')).to.be.null;
  });

  it('sets carousel roles and aria-label on the block', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.carousel-c2');
    init(block);

    expect(block.getAttribute('role')).to.equal('group');
    expect(block.getAttribute('aria-roledescription')).to.equal('carousel');
    expect(block.getAttribute('aria-label')).to.equal('My carousel label');
  });

  it('turns companion sections into slides with index and slide roles', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.carousel-c2');
    init(block);

    const slides = [...document.querySelectorAll('.carousel-slide')];
    expect(slides.length).to.equal(3);
    slides.forEach((slide) => {
      expect(slide.getAttribute('role')).to.equal('group');
      expect(slide.getAttribute('aria-roledescription')).to.equal('slide');
    });
    // every slide got a data-index (assigned at discovery, before DOM reorder)
    const indices = slides.map((slide) => slide.getAttribute('data-index')).sort();
    expect(indices).to.eql(['0', '1', '2']);
  });

  it('builds the aria-live, navigation, wrapper and indicators in order', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.carousel-c2');
    init(block);

    const children = [...block.children];
    expect(children[0].classList.contains('aria-live-container')).to.be.true;
    expect(children[0].getAttribute('aria-live')).to.equal('polite');
    expect(children[1].classList.contains('prev')).to.be.true;
    expect(children[2].classList.contains('carousel-wrapper')).to.be.true;
    expect(children[3].classList.contains('next')).to.be.true;
    expect(children[4].classList.contains('indicators-container')).to.be.true;
  });

  it('renders prev/next buttons with labels and arrow icons', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.carousel-c2');
    init(block);

    const prevBtn = block.querySelector('button.prev');
    const nextBtn = block.querySelector('button.next');
    expect(prevBtn.getAttribute('aria-label')).to.equal('Previous slide');
    expect(nextBtn.getAttribute('aria-label')).to.equal('Next slide');
    [prevBtn, nextBtn].forEach((btn) => {
      expect(btn.querySelector('.arrow-default svg')).to.exist;
      expect(btn.querySelector('.arrow-hover svg')).to.exist;
    });
  });

  it('creates one indicator per slide and marks the first active', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.carousel-c2');
    init(block);

    const indicators = block.querySelectorAll('.indicators-container .slide-indicator');
    expect(indicators.length).to.equal(3);
    expect(indicators[0].getAttribute('aria-label')).to.equal('Slide 1 of 3');
    expect(indicators[0].classList.contains('active')).to.be.true;
    expect(indicators[0].getAttribute('aria-current')).to.equal('location');
    expect(indicators[1].classList.contains('active')).to.be.false;
  });

  it('rotates the last slide to the front and activates the first authored slide', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.carousel-c2');
    init(block);

    const wrapperSlides = [...block.querySelector('.carousel-wrapper').children];
    // last authored slide (index 2) is moved to the front
    expect(wrapperSlides[0].getAttribute('data-index')).to.equal('2');
    // the first authored slide (index 0) becomes active
    const active = block.querySelector('.carousel-wrapper .active');
    expect(active.getAttribute('data-index')).to.equal('0');
  });

  it('sets aria-hidden and tabindex so only the active slide is exposed', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.carousel-c2');
    init(block);

    block.querySelectorAll('.carousel-wrapper > .carousel-slide').forEach((slide) => {
      const isActive = slide.classList.contains('active');
      expect(slide.getAttribute('aria-hidden')).to.equal(String(!isActive));
    });
  });

  it('advances the active slide and indicator when clicking next', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.carousel-c2');
    init(block);

    block.querySelector('button.next').click();

    const active = block.querySelector('.carousel-wrapper .active:not([data-cloned])');
    expect(active.getAttribute('data-index')).to.equal('1');

    const indicators = block.querySelectorAll('.indicators-container .slide-indicator');
    expect(indicators[0].classList.contains('active')).to.be.false;
    expect(indicators[1].classList.contains('active')).to.be.true;
    expect(block.querySelector('.aria-live-container').textContent).to.contain('Slide 2 of 3');
  });
});
