import { createTag } from '../../utils/utils.js';

const PREV = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
  <path d="M10.8941 5.44045C10.8939 5.0491 10.5765 4.73157 10.1851 4.73147L2.43413 4.73147L4.95171 2.21389C5.22831 1.93705 5.22828 1.4888 4.95172 1.21194C4.67481 0.93503 4.22571 0.93505 3.94879 1.21194L0.221243 4.93948C-0.0556748 5.21639 -0.0556754 5.66549 0.221241 5.94241L3.94878 9.67092C4.22564 9.94759 4.67483 9.94758 4.95171 9.67092C5.22853 9.39406 5.22843 8.94491 4.95171 8.66799L2.43316 6.14944L10.1851 6.14944C10.5766 6.14933 10.8941 5.83201 10.8941 5.44045Z" fill="black"/>
</svg>`;

const NEXT = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
  <path d="M0.0148873 5.44045C0.0151254 5.0491 0.332488 4.73157 0.723871 4.73147L8.47485 4.73147L5.95727 2.21389C5.68067 1.93705 5.6807 1.4888 5.95727 1.21194C6.23417 0.93503 6.68328 0.93505 6.96019 1.21194L10.6877 4.93948C10.9647 5.21639 10.9647 5.66549 10.6877 5.94241L6.9602 9.67092C6.68334 9.94759 6.23415 9.94758 5.95728 9.67092C5.68045 9.39406 5.68055 8.94491 5.95727 8.66799L8.47583 6.14944L0.723873 6.14944C0.332342 6.14933 0.0148878 5.83201 0.0148873 5.44045Z" fill="black"/>
</svg>`;

function handlePrevious(previousElment, elements) {
  if (previousElment.previousElementSibling) {
    return previousElment.previousElementSibling;
  }
  return elements[elements.length - 1];
}

function handleNext(nextElement, elements) {
  if (nextElement.nextElementSibling) {
    return nextElement.nextElementSibling;
  }
  return elements[0];
}

function moveSlides(slideContainer, slides, dir) {
  let referenceSlide = slideContainer.querySelector('.reference-slide');
  let activeSlide = slideContainer.querySelector('.active');

  if (!referenceSlide) {
    referenceSlide = slides[slides.length - 1];
    referenceSlide.classList.add('reference-slide');
    referenceSlide.style.order = '1';
  }

  referenceSlide.classList.remove('reference-slide');
  referenceSlide.style.order = null;
  activeSlide.classList.remove('active');

  if (dir === 'next') {
    referenceSlide = handleNext(referenceSlide, slides);
    activeSlide = handleNext(activeSlide, slides);
    slideContainer?.classList.remove('is-reversing');
  }

  if (dir === 'prev') {
    referenceSlide = handlePrevious(referenceSlide, slides);
    activeSlide = handlePrevious(activeSlide, slides);
    slideContainer.classList.add('is-reversing');
    //   % slides.length;
  }

  referenceSlide.classList.add('reference-slide');
  referenceSlide.style.order = '1';

  activeSlide.classList.add('active');

  for (let i = 2; i <= slides.length; i += 1) {
    referenceSlide = handleNext(referenceSlide, slides);
    referenceSlide.style.order = i;
  }

  const slideDelay = 25;
  slideContainer.classList.remove('is-ready');
  return setTimeout(() => slideContainer.classList.add('is-ready'), slideDelay);
}

export default function init(el) {
  const carouselSection = el.closest('.section');
  if (!carouselSection) return;

  const keyDivs = el.querySelectorAll(':scope > div > div:first-child');
  const carouselName = keyDivs[0].textContent;
  const parentArea = el.closest('.fragment') || document;
  const candidateKeys = parentArea.querySelectorAll('div.section-metadata > div > div:first-child');
  const slides = [...candidateKeys].reduce((rdx, key) => {
    if (key.textContent === 'carousel' && key.nextElementSibling.textContent === carouselName) {
      const slide = key.closest('.section');
      slide.classList.add('carousel-slide');
      rdx.push(slide);
      slide.setAttribute('data-index', rdx.indexOf(slide));
    }
    return rdx;
  }, []);
  slides.forEach((slide, idx) => {
    const isLastSlide = slides.length - 1 === idx;
    slide.style.order = isLastSlide ? 1 : idx + 2;
    slide.classList.toggle('reference-slide', isLastSlide);
  });
  const wrapper = createTag('div', { class: 'new-carousel-wrapper is-ready' });
  slides[0].classList.add('active');
  el.textContent = '';
  wrapper.append(...slides);
  el.append(wrapper);
  const prevBtn = createTag('button', { class: 'prev' }, PREV);
  const nextBtn = createTag('button', { class: 'next' }, NEXT);
  el.append(...[prevBtn, nextBtn]);

  prevBtn.addEventListener('click', () => {
    moveSlides(wrapper, slides, 'prev');
  });
  nextBtn.addEventListener('click', () => {
    moveSlides(wrapper, slides, 'next');
  });
}
