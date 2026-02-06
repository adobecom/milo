import { createTag } from '../../utils/utils.js';

const PREV = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
  <path d="M10.8935 5.44045C10.8932 5.0491 10.5759 4.73157 10.1845 4.73147L2.43352 4.73147L4.9511 2.21389C5.2277 1.93705 5.22767 1.4888 4.95111 1.21194C4.6742 0.93503 4.2251 0.93505 3.94818 1.21194L0.220632 4.93948C-0.0562851 5.21639 -0.0562857 5.66549 0.220631 5.94241L3.94817 9.67092C4.22503 9.94759 4.67422 9.94758 4.9511 9.67092C5.22792 9.39406 5.22782 8.94491 4.9511 8.66799L2.43254 6.14944L10.1845 6.14944C10.576 6.14933 10.8935 5.83201 10.8935 5.44045Z" fill="white"/>
</svg>`;

const NEXT = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M0.0156198 5.44045C0.0158578 5.0491 0.33322 4.73157 0.724603 4.73147L8.47558 4.73147L5.958 2.21389C5.6814 1.93705 5.68143 1.4888 5.958 1.21194C6.2349 0.93503 6.68401 0.93505 6.96093 1.21194L10.6885 4.93948C10.9654 5.21639 10.9654 5.66549 10.6885 5.94241L6.96094 9.67092C6.68407 9.94759 6.23488 9.94758 5.95801 9.67092C5.68118 9.39406 5.68128 8.94491 5.95801 8.66799L8.47656 6.14944L0.724605 6.14944C0.333075 6.14933 0.0156202 5.83201 0.0156198 5.44045Z" fill="white"/>
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
  const prevBtn = createTag('button', {}, PREV);
  const nextBtn = createTag('button', {}, NEXT);
  const btnContainer = createTag('div', { class: 'btn-container' });
  btnContainer.append(...[prevBtn, nextBtn]);
  el.append(btnContainer);

  prevBtn.addEventListener('click', () => {
    moveSlides(wrapper, slides, 'prev');
  });
  nextBtn.addEventListener('click', () => {
    moveSlides(wrapper, slides, 'next');
  });
}
