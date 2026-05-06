import { createTag } from '../../../utils/utils.js';
import { decorateBlockText } from '../../../utils/decorate.js';
import { processTrackingLabels } from '../../../martech/attributes.js';

const PREV_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="9" viewBox="0 0 11 9" fill="none" aria-hidden="true">
  <title>Previous slide</title>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M10.8809 4.43606C10.8806 4.04471 10.5633 3.72718 10.1719 3.72707L2.4209 3.72707L4.93849 1.2095C5.21508 0.932652 5.21505 0.484406 4.93849 0.207542C4.66158 -0.0693646 4.21248 -0.0693445 3.93556 0.207542L0.208014 3.93508C-0.0689041 4.212 -0.0689047 4.66109 0.208012 4.93801L3.93555 8.66653C4.21241 8.94319 4.6616 8.94318 4.93848 8.66653C5.2153 8.38967 5.2152 7.94052 4.93848 7.6636L2.41993 5.14504L10.1719 5.14504C10.5634 5.14494 10.8809 4.82761 10.8809 4.43606Z" fill="currentColor"/>
</svg>`;

const NEXT_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="9" viewBox="0 0 11 9" fill="none" aria-hidden="true">
  <title>Next slide</title>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M-5.23729e-06 4.43606C0.000232801 4.04471 0.317595 3.72718 0.708978 3.72707L8.45995 3.72707L5.94237 1.2095C5.66578 0.932652 5.66581 0.484406 5.94237 0.207542C6.21928 -0.0693646 6.66838 -0.0693445 6.9453 0.207542L10.6728 3.93508C10.9498 4.212 10.9498 4.66109 10.6728 4.93801L6.94531 8.66653C6.66845 8.94319 6.21925 8.94318 5.94238 8.66653C5.66556 8.38967 5.66566 7.94052 5.94238 7.6636L8.46093 5.14504L0.70898 5.14504C0.31745 5.14494 -4.81515e-06 4.82761 -5.23729e-06 4.43606Z" fill="currentColor"/>
</svg>`;

function buildSlide(row, index, total) {
  const cells = [...row.children];
  const textCell = cells[0];
  const mediaCell = cells[1];

  decorateBlockText(textCell);

  const content = createTag('div', { class: 'hub-hero-modal-content' });
  [...textCell.children].forEach((child) => content.append(child));

  const media = createTag('div', { class: 'hub-hero-modal-media' });
  if (mediaCell) [...mediaCell.children].forEach((child) => media.append(child));

  const slide = createTag('div', {
    class: 'hub-hero-modal-slide',
    role: 'group',
    'aria-roledescription': 'slide',
    'aria-label': `Slide ${index + 1} of ${total}`,
    'aria-hidden': 'true',
  });

  const heading = textCell.querySelector('h1, h2, h3, h4, h5, h6');
  const cta = textCell.querySelector('a');
  if (cta) {
    cta.setAttribute('daa-ll', processTrackingLabels(cta.textContent));
  }

  slide.append(content, media);

  return { slide, heading };
}

function updateCounter(counter, activeIndex, total) {
  counter.textContent = `${activeIndex + 1} / ${total}`;
  counter.setAttribute('aria-label', `Slide ${activeIndex + 1} of ${total}`);
}

function goToSlide(state, targetIndex) {
  const { slides, counter, total } = state;

  slides[state.activeIndex].classList.remove('active');
  slides[state.activeIndex].setAttribute('aria-hidden', 'true');

  slides[targetIndex].classList.add('active');
  slides[targetIndex].setAttribute('aria-hidden', 'false');

  state.activeIndex = targetIndex;
  updateCounter(counter, targetIndex, total);

  const firstFocusable = slides[targetIndex].querySelector('a, button');
  firstFocusable?.focus();
}

export default function init(el) {
  const rows = [...el.children];
  const total = rows.length;

  // Default to slide 1; Hub Hero can pass data-start-slide (1-based) to deep-link
  const startIndex = Math.max(0, Math.min(parseInt(el.dataset.startSlide || '1', 10) - 1, total - 1));

  const builtSlides = rows.map((row, index) => buildSlide(row, index, total));
  const slides = builtSlides.map(({ slide }) => slide);

  // Counter
  const counter = createTag('div', {
    class: 'hub-hero-modal-counter',
    role: 'status',
    'aria-live': 'polite',
    'aria-atomic': 'true',
  });
  updateCounter(counter, startIndex, total);

  // Navigation
  const prevBtn = createTag('button', {
    class: 'hub-hero-modal-prev',
    'aria-label': 'Previous slide',
    'daa-ll': 'prev',
  }, PREV_ICON);

  const nextBtn = createTag('button', {
    class: 'hub-hero-modal-next',
    'aria-label': 'Next slide',
    'daa-ll': 'next',
  }, NEXT_ICON);

  const slidesContainer = createTag('div', {
    class: 'hub-hero-modal-slides',
    role: 'region',
    'aria-roledescription': 'carousel',
    'aria-label': 'Hub hero modal carousel',
  });
  slidesContainer.append(...slides);

  const header = createTag('div', { class: 'hub-hero-modal-header' });
  header.append(counter, prevBtn, nextBtn);

  // Set initial active slide
  slides[startIndex].classList.add('active');
  slides[startIndex].setAttribute('aria-hidden', 'false');

  const state = { slides, counter, activeIndex: startIndex, total };

  prevBtn.addEventListener('click', () => {
    goToSlide(state, (state.activeIndex - 1 + total) % total);
  });

  nextBtn.addEventListener('click', () => {
    goToSlide(state, (state.activeIndex + 1) % total);
  });

  el.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft') prevBtn.click();
    if (e.code === 'ArrowRight') nextBtn.click();
  });

  el.setAttribute('daa-lh', 'hub-hero-modal');
  el.textContent = '';
  el.append(header, slidesContainer);
}
