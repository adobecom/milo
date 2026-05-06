import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../../libs/c2/blocks/hub-hero-modal/hub-hero-modal.js');

describe('hub-hero-modal', () => {
  const el = document.querySelector('.hub-hero-modal');
  init(el);

  it('renders the carousel container', () => {
    expect(el.querySelector('.hub-hero-modal-slides')).to.exist;
  });

  it('renders all three slides', () => {
    const slides = el.querySelectorAll('.hub-hero-modal-slide');
    expect(slides.length).to.equal(3);
  });

  it('activates the first slide by default', () => {
    const slides = el.querySelectorAll('.hub-hero-modal-slide');
    expect(slides[0].classList.contains('active')).to.be.true;
    expect(slides[1].classList.contains('active')).to.be.false;
    expect(slides[2].classList.contains('active')).to.be.false;
  });

  it('renders the counter showing first slide', () => {
    const counter = el.querySelector('.hub-hero-modal-counter');
    expect(counter).to.exist;
    expect(counter.textContent).to.equal('1 / 3');
  });

  it('renders prev and next buttons', () => {
    expect(el.querySelector('.hub-hero-modal-prev')).to.exist;
    expect(el.querySelector('.hub-hero-modal-next')).to.exist;
  });

  it('navigates to the next slide on next button click', () => {
    const slides = el.querySelectorAll('.hub-hero-modal-slide');
    const counter = el.querySelector('.hub-hero-modal-counter');
    const nextBtn = el.querySelector('.hub-hero-modal-next');

    nextBtn.click();

    expect(slides[0].classList.contains('active')).to.be.false;
    expect(slides[1].classList.contains('active')).to.be.true;
    expect(counter.textContent).to.equal('2 / 3');
  });

  it('navigates to the previous slide on prev button click', () => {
    const slides = el.querySelectorAll('.hub-hero-modal-slide');
    const counter = el.querySelector('.hub-hero-modal-counter');
    const prevBtn = el.querySelector('.hub-hero-modal-prev');

    prevBtn.click();

    expect(slides[0].classList.contains('active')).to.be.true;
    expect(slides[1].classList.contains('active')).to.be.false;
    expect(counter.textContent).to.equal('1 / 3');
  });

  it('wraps around from last slide to first on next', () => {
    const slides = el.querySelectorAll('.hub-hero-modal-slide');
    const counter = el.querySelector('.hub-hero-modal-counter');
    const nextBtn = el.querySelector('.hub-hero-modal-next');

    // currently on slide 1, advance to 3 then wrap
    nextBtn.click(); // -> slide 2
    nextBtn.click(); // -> slide 3
    nextBtn.click(); // -> wraps to slide 1

    expect(slides[0].classList.contains('active')).to.be.true;
    expect(counter.textContent).to.equal('1 / 3');
  });

  it('wraps around from first slide to last on prev', () => {
    const slides = el.querySelectorAll('.hub-hero-modal-slide');
    const counter = el.querySelector('.hub-hero-modal-counter');
    const prevBtn = el.querySelector('.hub-hero-modal-prev');

    // currently on slide 1, go back to wrap to last
    prevBtn.click();

    expect(slides[2].classList.contains('active')).to.be.true;
    expect(counter.textContent).to.equal('3 / 3');
  });

  it('respects data-start-slide attribute', () => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="hub-hero-modal" data-start-slide="2">
        <div><div><h2>Slide A</h2></div><div></div></div>
        <div><div><h2>Slide B</h2></div><div></div></div>
        <div><div><h2>Slide C</h2></div><div></div></div>
      </div>`;
    document.body.append(wrapper);
    const startEl = wrapper.querySelector('.hub-hero-modal');
    init(startEl);

    const slides = startEl.querySelectorAll('.hub-hero-modal-slide');
    const counter = startEl.querySelector('.hub-hero-modal-counter');

    expect(slides[1].classList.contains('active')).to.be.true;
    expect(counter.textContent).to.equal('2 / 3');
    wrapper.remove();
  });

  it('slides have correct aria attributes', () => {
    const slides = el.querySelectorAll('.hub-hero-modal-slide');
    slides.forEach((slide) => {
      expect(slide.getAttribute('role')).to.equal('group');
      expect(slide.getAttribute('aria-roledescription')).to.equal('slide');
    });
    // active slide should not be aria-hidden
    const activeSlide = el.querySelector('.hub-hero-modal-slide.active');
    expect(activeSlide.getAttribute('aria-hidden')).to.equal('false');
  });

  it('renders content and media areas in each slide', () => {
    const slides = el.querySelectorAll('.hub-hero-modal-slide');
    slides.forEach((slide) => {
      expect(slide.querySelector('.hub-hero-modal-content')).to.exist;
      expect(slide.querySelector('.hub-hero-modal-media')).to.exist;
    });
  });

  it('sets daa-lh analytics attribute on the block', () => {
    expect(el.getAttribute('daa-lh')).to.equal('hub-hero-modal');
  });
});
