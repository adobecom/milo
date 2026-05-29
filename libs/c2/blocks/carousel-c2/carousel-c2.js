import { createTag } from '../../../utils/utils.js';

const PREV = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="9" viewBox="0 0 11 9" fill="none">
  <title>Previous slide</title>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M10.8809 4.43606C10.8806 4.04471 10.5633 3.72718 10.1719 3.72707L2.4209 3.72707L4.93849 1.2095C5.21508 0.932652 5.21505 0.484406 4.93849 0.207542C4.66158 -0.0693646 4.21248 -0.0693445 3.93556 0.207542L0.208014 3.93508C-0.0689041 4.212 -0.0689047 4.66109 0.208012 4.93801L3.93555 8.66653C4.21241 8.94319 4.6616 8.94318 4.93848 8.66653C5.2153 8.38967 5.2152 7.94052 4.93848 7.6636L2.41993 5.14504L10.1719 5.14504C10.5634 5.14494 10.8809 4.82761 10.8809 4.43606Z" fill="currentColor"/>
</svg>`;

const NEXT = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="9" viewBox="0 0 11 9" fill="none">
  <title>Next slide</title>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M-5.23729e-06 4.43606C0.000232801 4.04471 0.317595 3.72718 0.708978 3.72707L8.45995 3.72707L5.94237 1.2095C5.66578 0.932652 5.66581 0.484406 5.94237 0.207542C6.21928 -0.0693646 6.66838 -0.0693445 6.9453 0.207542L10.6728 3.93508C10.9498 4.212 10.9498 4.66109 10.6728 4.93801L6.94531 8.66653C6.66845 8.94319 6.21925 8.94318 5.94238 8.66653C5.66556 8.38967 5.66566 7.94052 5.94238 7.6636L8.46093 5.14504L0.70898 5.14504C0.31745 5.14494 -4.81515e-06 4.82761 -5.23729e-06 4.43606Z" fill="currentColor"/>
</svg>`;

const FOCUSABLE_SELECTOR = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"]), video';
const MIN_SLIDE_TRANISTION_DURATION = 100;
const MAX_SLIDE_TRANISTION_DURATION = 500;
let carouselGap = 8;
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setSlideSpreadSign(activeSlide, slides) {
  if (!activeSlide || !slides) return;
  const activeIndex = slides.indexOf(activeSlide);
  if (activeIndex < 0) return;
  slides.forEach((slide, i) => {
    const newSign = i - activeIndex;
    const current = parseInt(slide.style.getPropertyValue('--slide-spread-sign'), 10);
    if (current === newSign) return;
    slide.style.setProperty('--slide-spread-sign', newSign);
  });
}

function handlePrevious(previousElment, elements) {
  const indexOfActive = elements.indexOf(previousElment);
  return elements[indexOfActive - 1] ?? elements[elements.length - 1];
}

function handleNext(nextElement, elements) {
  const indexOfActive = elements.indexOf(nextElement);
  return elements[indexOfActive + 1] ?? elements[0];
}

function setAriaHiddenAndTabIndex(slides, activeSlide) {
  slides.forEach((slide) => {
    const isActive = slide === activeSlide;
    slide.setAttribute('aria-hidden', String(!isActive));
    slide.querySelectorAll(FOCUSABLE_SELECTOR).forEach((el) => {
      el.setAttribute('tabindex', isActive ? '0' : '-1');
    });
  });
}

function updateAriaLive(carouselEls) {
  const { ariaLive, slides } = carouselEls;
  const activeSlide = slides.find((slide) => slide.classList.contains('active'));
  ariaLive.textContent = '';
  const index = parseInt(activeSlide.getAttribute('data-index'), 10);
  let text = '';
  activeSlide.querySelectorAll(':scope > :not(.section-metadata)').forEach((el, i) => {
    text += `${i ? ' ' : ''}${el.textContent.trim()}`;
  });
  if (!text) {
    const media = activeSlide.querySelector('img[alt], video[title]');
    text = media?.getAttribute('alt') || media?.getAttribute('title') || '';
  }
  ariaLive.textContent = [`Slide ${index + 1} of ${slides.length}`, text].filter(Boolean).join(', ');
}

function decorateNavigation() {
  const prevBtn = createTag(
    'button',
    { class: 'prev', 'aria-label': 'Previous slide' },
    `<span class="arrow-default">${PREV}</span><span class="arrow-hover">${PREV}</span>`,
  );
  const nextBtn = createTag(
    'button',
    { class: 'next', 'aria-label': 'Next slide' },
    `<span class="arrow-default">${NEXT}</span><span class="arrow-hover">${NEXT}</span>`,
  );
  return [prevBtn, nextBtn];
}

function setActualSlideWidth(carousel, carouselWidth) {
  const gridMarginProperty = getComputedStyle(carousel).getPropertyValue('--grid-margin-width');
  const isGridMarginPer = gridMarginProperty?.endsWith('%');
  const gridMarginPropertyValue = isGridMarginPer
    ? parseFloat(gridMarginProperty) / 100 : parseFloat(gridMarginProperty);
  const actualSlideWidth = Math.min(carouselWidth - 2
    * (isGridMarginPer ? carouselWidth : 1) * gridMarginPropertyValue, 1920);
  carousel.style.setProperty('--actual-slide-width', `${actualSlideWidth}px`);

  return actualSlideWidth;
}

function getCarouselDimensions(slide) {
  const carousel = slide.closest('.carousel-c2');
  const carouselWidth = carousel.getBoundingClientRect().width;
  const slideWidth = setActualSlideWidth(carousel, carouselWidth);

  const fluidGrid = parseFloat(getComputedStyle(carousel).getPropertyValue('--grid-max-width-fluid'));
  const maxSlideWidth = Math.min(carouselWidth, fluidGrid);

  return { marginWidth: (carouselWidth - slideWidth) / 2, slideWidth, maxSlideWidth };
}

function isRTL() {
  return document.documentElement.dir === 'rtl';
}

function getDirection(direction) {
  if (!isRTL()) return direction;
  return direction === 'next' ? 'prev' : 'next';
}

function goToActive(carouselEls) {
  const { wrapper, marginWidth, el, allSlides, activeSlide } = carouselEls;
  const actualSlideWidth = parseFloat(el.style.getPropertyValue('--actual-slide-width'));
  const indexOfActive = [...wrapper.children].indexOf(activeSlide);
  const gaps = indexOfActive * carouselGap;
  const translateValue = isRTL()
    ? indexOfActive * actualSlideWidth - marginWidth + gaps
    : indexOfActive * actualSlideWidth * -1 + marginWidth - gaps;
  wrapper.style.transition = 'none';
  wrapper.style.translate = `${translateValue}px`;
  setSlideSpreadSign(activeSlide, allSlides);

  // eslint-disable-next-line
  wrapper._timeout = null;
}

function cloneSlides(carouselEls) {
  const { wrapper, slides, activeSlide } = carouselEls;
  const cloneBack = slides.slice(0, 3).map((slide) => slide.cloneNode(true));
  const cloneFront = slides.slice(-3).map((slide) => slide.cloneNode(true));
  [...cloneFront, ...cloneBack].forEach((slide) => {
    slide.setAttribute('data-cloned', 'true');
    slide.removeAttribute('data-index');
    slide.style.removeProperty('--slide-spread-sign');
    slide.classList.remove('active');
  });
  const allSlides = [...cloneFront, ...slides, ...cloneBack];
  allSlides.forEach((slide) => {
    slide.querySelectorAll('img').forEach((img) => {
      img?.setAttribute('loading', 'eager');
    });
  });
  wrapper.replaceChildren(...allSlides);
  carouselEls.allSlides = allSlides;
  goToActive(carouselEls, activeSlide);
  wrapper.setAttribute('data-slides-cloned', 'true');
}

/* eslint-disable */
const eventTimeStamp = {
  set: (el, timeStamp) => {
    if(!el._oldTimeStamp) el._oldTimeStamp = timeStamp;
    el._newTimeStamp = timeStamp;
  },
  diff: (el) => {
    return el._newTimeStamp - el._oldTimeStamp;
  },
  updateOld: (el) => {
    el._oldTimeStamp = el._newTimeStamp;
  },
}
/* eslint-enable */

function slideAnimation(carouselEls, direction) {
  const { wrapper, slideWidth, allSlides, activeClone } = carouselEls;
  const alreadyTranslated = parseFloat(wrapper.style.translate);
  let duration = parseFloat(getComputedStyle(wrapper).getPropertyValue('--transition-duration'));
  const eventInterval = Math.min(eventTimeStamp.diff(wrapper), MAX_SLIDE_TRANISTION_DURATION);
  eventTimeStamp.updateOld(wrapper);
  if (eventInterval !== 0) {
    wrapper.style.setProperty('--transition-duration', `${eventInterval}ms`);
    duration = eventInterval;
  }
  const negate = (direction === 'next') !== isRTL() ? -1 : 1;
  const translateValue = alreadyTranslated + (negate * slideWidth) + (negate * carouselGap);
  wrapper.style.transition = 'translate var(--transition-duration) var(--animation-curve)';
  setSlideSpreadSign(activeClone, allSlides);

  if (prefersReducedMotion()) {
    wrapper.style.transition = 'none';
    duration = 20;
  }

  wrapper.style.translate = `${translateValue}px`;

  /* eslint-disable */
  if (wrapper._timeout) clearTimeout(wrapper._timeout);
  wrapper._timeout = setTimeout(() => goToActive(carouselEls), duration - 20);
  /* eslint-enable */
}

function moveSlides(carouselEls, direction, e) {
  const {
    wrapper,
    slides,
    indicatorsContainer,
    slideIndicators,
    prevBtn,
    nextBtn,
    activeSlide: active,
    activeClone: clone,
  } = carouselEls;
  const { timeStamp, type: eventType } = e;

  eventTimeStamp.set(wrapper, timeStamp);
  const eventTimeStampDiff = eventTimeStamp.diff(wrapper);
  if (eventTimeStampDiff !== 0 && eventTimeStampDiff < MIN_SLIDE_TRANISTION_DURATION) return;

  let activeSlide = active;
  let activeClone = clone;
  let activeSlideIndicator = indicatorsContainer.querySelector('.active');
  if (wrapper.getAttribute('data-slides-cloned') !== 'true') {
    cloneSlides(carouselEls);
  }

  const { allSlides } = carouselEls;

  activeClone?.classList.remove('active-clone');
  activeSlide.classList.remove('active');
  activeSlideIndicator.classList.remove('active');
  activeSlideIndicator.removeAttribute('aria-current');

  if (direction === 'next') {
    activeClone = handleNext(activeSlide, allSlides);
    activeSlide = handleNext(activeSlide, slides);
    activeSlideIndicator = handleNext(activeSlideIndicator, slideIndicators);
    if (eventType !== 'pointerup') nextBtn.focus();
  }

  if (direction === 'prev') {
    activeClone = handlePrevious(activeSlide, allSlides);
    activeSlide = handlePrevious(activeSlide, slides);
    activeSlideIndicator = handlePrevious(activeSlideIndicator, slideIndicators);
    if (eventType !== 'pointerup') prevBtn.focus();
  }
  activeSlide.classList.add('active');
  activeClone?.classList.add('active-clone');
  activeSlideIndicator.classList.add('active');
  activeSlideIndicator.setAttribute('aria-current', 'location');
  carouselEls.activeClone = activeClone;
  carouselEls.activeSlide = activeSlide;

  slideAnimation(carouselEls, direction);

  setAriaHiddenAndTabIndex(allSlides, activeSlide);
  updateAriaLive(carouselEls);
}

function attachListeners(carouselEls) {
  const { el, prevBtn, nextBtn, wrapper } = carouselEls;

  prevBtn.addEventListener('click', (e) => moveSlides(carouselEls, 'prev', e));
  nextBtn.addEventListener('click', (e) => moveSlides(carouselEls, 'next', e));

  el.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft') moveSlides(carouselEls, getDirection('prev'), e);
    if (e.code === 'ArrowRight') moveSlides(carouselEls, getDirection('next'), e);
  });

  el.addEventListener('keyup', (e) => {
    const { code, target } = e;
    if (prefersReducedMotion() || code !== 'Tab' || !target.matches('button.prev')) return;
    const slideSpreadAnimation = wrapper.getAnimations({ subtree: true }).find((a) => a.animationName === 'slide-spread');
    if (!slideSpreadAnimation || slideSpreadAnimation.playState === 'finished') return;
    wrapper.scrollIntoView({ block: 'center' });
  });

  let startX = 0;
  let isDragging = false;

  wrapper.addEventListener('pointerdown', (e) => {
    const { target } = e;
    if (target.tagName === 'A') return;
    e.preventDefault();
    wrapper.classList.add('grabbing');
    startX = e.clientX;
    isDragging = true;
    wrapper.setPointerCapture(e.pointerId);
  });

  wrapper.addEventListener('pointerup', (e) => {
    if (!isDragging) return;
    wrapper.classList.remove('grabbing');
    isDragging = false;
    const diff = e.clientX - startX;
    if (Math.abs(diff) <= 100) return;
    moveSlides(carouselEls, getDirection(diff < 0 ? 'next' : 'prev'), e);
  });

  const slideToObserve = wrapper.querySelector('.active');
  const mq = window.matchMedia('(width >= 1280px)');
  let ro;
  function createObserver() {
    ro?.disconnect();
    const observeEl = mq.matches ? wrapper : slideToObserve;
    ro = new ResizeObserver(() => {
      const activeSlide = wrapper.querySelector('.active');
      const { marginWidth, slideWidth, maxSlideWidth } = getCarouselDimensions(activeSlide);
      carouselGap = parseFloat(getComputedStyle(wrapper).gap);
      carouselEls.marginWidth = marginWidth;
      carouselEls.slideWidth = slideWidth;

      const slideScaleMult = maxSlideWidth / slideWidth;
      el.style.setProperty('--slide-scale-multiplier', slideScaleMult);

      goToActive(carouselEls, activeSlide);
    });
    ro.observe(observeEl);
  }
  mq.addEventListener('change', createObserver);
  createObserver();
}

export default function init(el) {
  const carouselSection = el.closest('.section');
  if (!carouselSection) return;

  const keyDivs = el.querySelectorAll(':scope > div > div');
  const carouselName = keyDivs[0].textContent;
  const carouselAriaLabel = keyDivs[1].textContent;

  el.setAttribute('role', 'group');
  el.setAttribute('aria-label', carouselAriaLabel);
  el.setAttribute('aria-roledescription', 'carousel');

  const parentArea = el.closest('.fragment') || document;
  const candidateKeys = parentArea.querySelectorAll('div.section-metadata > div > div:first-child');
  const slides = [...candidateKeys].reduce((rdx, key) => {
    if (key.textContent === 'carousel' && key.nextElementSibling.textContent === carouselName) {
      const slide = key.closest('.section');
      slide.classList.add('carousel-slide');
      rdx.push(slide);
      const slideIndex = rdx.indexOf(slide);
      slide.setAttribute('data-index', slideIndex);
    }
    return rdx;
  }, []);

  const indicatorsContainer = createTag('ul', { class: 'indicators-container' });
  slides.forEach((slide, index) => {
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    const indicator = createTag('li', { class: 'slide-indicator', 'aria-label': `Slide ${index + 1} of ${slides.length}` });
    indicatorsContainer.appendChild(indicator);
  });

  const ariaLive = createTag('div', {
    class: 'aria-live-container',
    'aria-live': 'polite',
    'aria-atomic': 'true',
  });

  const wrapper = createTag('div', { class: 'carousel-wrapper' });
  wrapper.style.setProperty('--transition-duration', `${MAX_SLIDE_TRANISTION_DURATION}ms`);
  const lastSlide = slides.pop();
  slides.unshift(lastSlide);
  slides[1].classList.add('active');
  setSlideSpreadSign(slides[1], slides);
  indicatorsContainer.children[0]?.classList.add('active');
  indicatorsContainer.children[0]?.setAttribute('aria-current', 'location');

  el.textContent = '';
  wrapper.append(...slides);
  const [prevBtn, nextBtn] = decorateNavigation();
  el.append(ariaLive, prevBtn, wrapper, nextBtn, indicatorsContainer);

  const carouselEls = {
    el,
    wrapper,
    slides,
    indicatorsContainer,
    slideIndicators: [...indicatorsContainer.children],
    prevBtn,
    nextBtn,
    ariaLive,
    carouselAriaLabel,
    activeSlide: slides[1],
  };

  setAriaHiddenAndTabIndex(slides, slides[1]);
  attachListeners(carouselEls);
}
