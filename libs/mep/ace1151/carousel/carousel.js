import { createTag, getConfig, MILO_EVENTS } from '../../../utils/utils.js';
import { decorateAnchorVideo, syncPausePlayIcon } from '../../../utils/decorate.js';
import { debounce } from '../../../utils/action.js';

const { miloLibs, codeRoot } = getConfig();
const isMobile = window.innerWidth < 900;
const base = miloLibs || codeRoot;

const ARROW_NEXT_IMG = `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21">
<title>Next slide arrow</title>
<path d="M19.2214 10.8918C19.3516 10.5773 19.3516 10.2226 19.2214 9.90808C19.1562 9.75098 19.0621 9.60895 18.9435 9.49041L12.9241 3.47092C12.4226 2.96819 11.6076 2.96819 11.1061 3.47092C10.604 3.97239 10.604 4.78743 11.1061 5.2889L14.9312 9.11399H2.4314C1.72109 9.11399 1.146 9.69036 1.146 10.4C1.146 11.1097 1.72109 11.6861 2.4314 11.6861H14.9312L11.1061 15.5112C10.604 16.0126 10.604 16.8277 11.1061 17.3291C11.3568 17.5805 11.6863 17.7062 12.0151 17.7062C12.3439 17.7062 12.6733 17.5805 12.9241 17.3291L18.9436 11.3097C19.0622 11.1911 19.1562 11.0491 19.2214 10.8918Z"/>
</svg>`;

const ARROW_PREVIOUS_IMG = `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21">
<title>Previous slide arrow</title>
<path d="M19.2214 10.8918C19.3516 10.5773 19.3516 10.2226 19.2214 9.90808C19.1562 9.75098 19.0621 9.60895 18.9435 9.49041L12.9241 3.47092C12.4226 2.96819 11.6076 2.96819 11.1061 3.47092C10.604 3.97239 10.604 4.78743 11.1061 5.2889L14.9312 9.11399H2.4314C1.72109 9.11399 1.146 9.69036 1.146 10.4C1.146 11.1097 1.72109 11.6861 2.4314 11.6861H14.9312L11.1061 15.5112C10.604 16.0126 10.604 16.8277 11.1061 17.3291C11.3568 17.5805 11.6863 17.7062 12.0151 17.7062C12.3439 17.7062 12.6733 17.5805 12.9241 17.3291L18.9436 11.3097C19.0622 11.1911 19.1562 11.0491 19.2214 10.8918Z"/>
</svg>`;
const LIGHTBOX_ICON = `<img class="expand-icon" alt="Expand carousel to full screen" src="${base}/blocks/carousel/img/expand.svg" height="14" width="20">`;
const CLOSE_ICON = `<img class="expand-icon" alt="Expand carousel to full screen" src="${base}/blocks/carousel/img/close.svg" height="20" width="20">`;
const EXPAND_ICON = `<svg class="icon-expand" xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
  <title>Expand slide</title>
  <circle cx="9.9375" cy="9.5" r="9.5" fill="black"/>
  <path d="M13.301 8.28592H11.1505V5.78397C11.1505 5.03653 10.6289 4.42969 9.98641 4.42969C9.34397 4.42969 8.82237 5.03653 8.82237 5.78397V8.28592H6.67186C6.02942 8.28592 5.50781 8.89277 5.50781 9.64021C5.50781 10.3876 6.02942 10.9945 6.67186 10.9945H8.82237V13.4964C8.82237 14.2439 9.34397 14.8507 9.98641 14.8507C10.6289 14.8507 11.1505 14.2439 11.1505 13.4964V10.9945H13.301C13.9434 10.9945 14.465 10.3876 14.465 9.64021C14.465 8.89277 13.9434 8.28592 13.301 8.28592Z" fill="white"/>
</svg>`;
const COLLAPSE_ICON = `
<svg class="icon-collapse" xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
  <circle cx="9.5" cy="9.5" r="9.5" fill="white"/>
  <path d="M6.23047 8.86426H12.8594C13.0668 8.86426 13.3926 9.09511 13.3926 9.58691C13.3925 10.0786 13.0668 10.3096 12.8594 10.3096H6.23047C6.02302 10.3096 5.69734 10.0786 5.69727 9.58691C5.69727 9.09511 6.023 8.86426 6.23047 8.86426Z" fill="#292929" stroke="black" stroke-width="1.26269"/>
</svg>
`;

const KEY_CODES = {
  SPACE: 'Space',
  END: 'End',
  HOME: 'Home',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
};

const FOCUSABLE_SELECTOR = 'a, :not(.video-container, .pause-play-wrapper) > video';

const DEFAULT_INITIAL_ACTIVE_INDEX = 0;
let INDEX_OFFSET = 0;

function getPreviousAriaLabel(currentIndex, totalSlides) {
  return currentIndex === 0 && totalSlides > 0
    ? `Previous slide, slide ${currentIndex + 1} of ${totalSlides}`
    : 'Previous slide';
}
function isHovering(el) {
  return el?.classList.contains('s2a-hovering');
}
function isPeaking(el) {
  return el?.classList.contains('s2a-peaking');
}
function isWhatsnew(el) {
  return el?.classList.contains('s2a-whatsnew');
}
function isLinkedSlides(el) {
  return el?.classList.contains('s2a-linked-slides');
}
function updatePreviousAriaLabel(carouselElements) {
  const { slides, nextPreviousBtns, currentActiveIndex } = carouselElements;
  if (!nextPreviousBtns?.[0]) return;

  nextPreviousBtns[0].setAttribute('aria-label', getPreviousAriaLabel(currentActiveIndex, slides.length));
}

function decorateNextPreviousBtns(slides, currentIndex = 0) {
  const totalSlides = slides ? slides.length : 0;
  const previousBtn = createTag(
    'button',
    {
      class: 'carousel-button carousel-previous is-delayed',
      'aria-label': getPreviousAriaLabel(currentIndex, totalSlides),
      'data-toggle': 'previous',
    },
    ARROW_PREVIOUS_IMG,
  );

  const nextBtn = createTag(
    'button',
    {
      class: 'carousel-button carousel-next is-delayed',
      'aria-label': 'Next slide',
      'data-toggle': 'next',
    },
    ARROW_NEXT_IMG,
  );
  return [previousBtn, nextBtn];
}

function decorateLightboxButtons() {
  const expandBtn = createTag(
    'button',
    {
      class: 'lightbox-button carousel-expand is-delayed',
      'aria-label': 'Open in full screen',
    },
    LIGHTBOX_ICON,
  );
  const closeBtn = createTag(
    'button',
    {
      class: 'lightbox-button carousel-close is-delayed',
      'aria-label': 'Close full screen carousel',
    },
    CLOSE_ICON,
  );
  return [expandBtn, closeBtn];
}

function setIndexOffeset(el) {
  const offsetClass = [...el.classList].find((cls) => cls.startsWith('offset-'));
  INDEX_OFFSET = offsetClass ? Number(offsetClass.split('-')[1]) : 0;
}

function decorateSlideIndicators(slides, jumpTo, activeSlideIndex) {
  const indicatorDots = [];

  for (let i = 0; i < slides.length; i += 1) {
    const li = createTag('li', {
      class: 'carousel-indicator',
      'data-index': i,
    });

    if (jumpTo) {
      li.setAttribute('role', 'tab');
      li.setAttribute('tabindex', -1);
      li.setAttribute('aria-selected', false);
      li.setAttribute('aria-labelledby', `Viewing Slide ${i + 1}`);
    }
    // Set inital active state
    if (i === activeSlideIndex) {
      li.classList.add('active');
      li.setAttribute('aria-current', 'location');
    }
    if (i === activeSlideIndex - 1) li.classList.add('previous-slide');
    if (i === activeSlideIndex + 1) li.classList.add('next-slide');
    indicatorDots.push(li);
  }
  return indicatorDots;
}

function updateButtonStates(carouselElements) {
  const { slides, nextPreviousBtns, currentActiveIndex } = carouselElements;
  const activeSlideIndex = currentActiveIndex;

  const totalSlides = slides.length;
  const isFirst = currentActiveIndex === 0;
  const isLast = currentActiveIndex === totalSlides - 1;

  nextPreviousBtns?.forEach((btn, index) => {
    if (isMobile) {
      const disable = (index === 0 && isFirst) || (index === 1 && isLast);
      btn.disabled = disable;
      btn.classList.toggle('disabled', disable);
    } else {
      btn.disabled = false;
      btn.classList.remove('disabled');
    }
  });

  const lastSlide = slides[slides.length - 1];
  const firstSlide = slides[0];
  if (isMobile) {
    lastSlide?.classList.toggle('hide-left-hint', activeSlideIndex === 0);
    firstSlide?.classList.toggle('hide-left-hint', activeSlideIndex === totalSlides - 1);
  } else {
    firstSlide?.classList.remove('hide-left-hint');
    lastSlide?.classList.remove('hide-left-hint');
  }
}

function handleNext(nextElement, elements) {
  if (nextElement.nextElementSibling) {
    return nextElement.nextElementSibling;
  }
  return elements[0];
}

function handlePrevious(previousElment, elements) {
  if (previousElment.previousElementSibling) {
    return previousElment.previousElementSibling;
  }
  return elements[elements.length - 1];
}

function setEqualHeight(slides, slideContainer, currentActiveIndex = 0) {
  const maxHeight = Math.max(...slides.map((slide) => slide.offsetHeight));
  const activeSlide = slides[currentActiveIndex];
  slides.forEach((slide) => {
    if (slide === activeSlide) {
      slide.style.height = `${maxHeight}px`;
      slide.style.transition = 'height 0.2s ease-out';
    } else {
      slide.style.height = `${maxHeight - 40}px`;
      slide.style.transition = 'height 0.2s ease-out';
    }
  });
  slideContainer.style.height = `${maxHeight}px`;
}

function removeEqualHeight(slides, slideContainer) {
  slides.forEach((slide) => {
    slide.style.height = '';
    slide.style.transition = '';
  });
  slideContainer.style.height = '';
}

function handleLightboxButtons(lightboxBtns, el, slideWrapper) {
  const curtain = createTag('div', { class: 'carousel-curtain' });

  [...lightboxBtns].forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      if (button.classList.contains('carousel-expand')) {
        el.classList.add('lightbox-active');
        slideWrapper.append(curtain);
      }

      if (button.classList.contains('carousel-close')) {
        el.classList.remove('lightbox-active');
        curtain.remove();
      }
    }, true);
  });

  // Handle click outside of Carousel
  curtain.addEventListener('click', (event) => {
    event.preventDefault();
    el.classList.remove('lightbox-active');
    curtain.remove();
  }, true);
}

function jumpToDirection(activeSlideIndex, jumpToIndex, slideContainer) {
  slideContainer.classList.add('is-reversing');
  if (Math.abs(activeSlideIndex - jumpToIndex) > 1) {
    if (activeSlideIndex > jumpToIndex) slideContainer.classList.remove('is-reversing');
  } else if (activeSlideIndex < jumpToIndex) slideContainer.classList.remove('is-reversing');
}

function checkSlideForVideo(activeSlide) {
  if (!activeSlide) return;
  const video = activeSlide.querySelector('video');
  /* c8 ignore start */
  if (video?.played.length > 0 && !video?.paused) {
    video.pause();
    syncPausePlayIcon(video);
  }
  /* c8 ignore end */
}

// Sets a multiplier variable, used by CSS, to move the indicator dots.
function setIndicatorMultiplier(carouselElements, activeSlideIndicator, event) {
  const { slides, direction } = carouselElements;
  const maxViewableIndicators = 6;
  if (slides.length <= maxViewableIndicators) return;

  const { currentTarget, key } = event;
  const eventDirection = currentTarget.dataset.toggle || direction;
  const keyNavDirection = key === KEY_CODES.ARROW_RIGHT || undefined;
  const multiplierOffset = (eventDirection === 'next' || eventDirection === 'left')
    || keyNavDirection ? 4 : 3;
  const activeSlideIndex = Number(activeSlideIndicator.dataset.index);
  if (activeSlideIndex > multiplierOffset && activeSlideIndex <= slides.length) {
    /*
      * Stop adding to the multiplier if it equals the difference
      * between the slides length and maxViewableIndicators
    */
    const multiplier = activeSlideIndex - multiplierOffset >= slides.length - maxViewableIndicators
      ? slides.length - maxViewableIndicators
      : activeSlideIndex - multiplierOffset;
    activeSlideIndicator.parentElement.classList.add('move-indicators');
    activeSlideIndicator.parentElement.style = `--indicator-multiplier: ${multiplier}`;
  } else {
    const multiplier = 0;
    activeSlideIndicator.parentElement.style = `--indicator-multiplier: ${multiplier}`;
  }
}

function updateAriaLive(ariaLive, slide, carouselElements) {
  let text = '';
  slide.querySelectorAll(':scope > :not(.section-metadata').forEach((el, index) => {
    text += `${index ? ' ' : ''}${el.textContent.trim()}`;
  });

  const { slides, el: block } = carouselElements;

  let slideInfo = '';
  if (![...block.classList].find((cls) => cls.startsWith('show-'))) {
    slideInfo = `Slide ${+slide.dataset.index + 1} of ${slides.length}`;
  }

  if (!text) {
    const el = slide.querySelector('img[alt], video[title], iframe[title]');
    text = el?.getAttribute('alt') || el?.getAttribute('title') || '';
  }

  ariaLive.textContent = [text, slideInfo].filter(Boolean).join(', ');
}

function setAriaHiddenAndTabIndex({ el: block, slides }, activeEl, el) {
  const active = activeEl ?? block.querySelector('.carousel-slide.active');
  const activeIdx = slides.findIndex((elm) => elm === active);
  const isWide = window.matchMedia('(min-width: 900px)').matches;
  const showClass = [...block.classList].find((cls) => cls.startsWith('show-'));
  const visible = isWide && showClass ? showClass.split('-')[1] : 1;
  const ordered = activeIdx > 0
    ? [...slides.slice(activeIdx), ...slides.slice(0, activeIdx)] : slides;
  ordered.forEach((slide, i) => {
    let isVisible = i < visible;
    if (isHovering(el)) isVisible = slide === active;
    slide.setAttribute('aria-hidden', !isVisible);
    slide.querySelectorAll(FOCUSABLE_SELECTOR).forEach((el) => {
      el.setAttribute('tabindex', isVisible ? 0 : -1);
    });
  });
}

function toggleActiveSlide(event, carouselElements, jumpToIndex) {
  const { slides } = carouselElements;
  if (!isMobile) slides.forEach((slide) => slide.classList.remove('active'));
  slides[jumpToIndex].classList.add('active');
}

function moveSlides(event, carouselElements, jumpToIndex) {
  if (isMobile && jumpToIndex >= 0) return toggleActiveSlide(event, carouselElements, jumpToIndex);
  const {
    slideContainer,
    slides,
    menuItems,
    menuItemsContainer,
    nextPreviousBtns,
    slideDescriptionsContainer,
    slideIndicators,
    controlsContainer,
    direction,
    ariaLive,
    jumpTo,
    el,
  } = carouselElements;

  ariaLive.textContent = '';

  let referenceSlide = slideContainer.querySelector('.reference-slide');
  let activeSlide = slideContainer.querySelector('.active');
  let activeMenuItem = menuItemsContainer?.querySelector('.active');
  let activeSlideDescription = slideDescriptionsContainer?.querySelector('.active');
  let activeSlideIndicator = controlsContainer.querySelector('.active');
  const activeSlideIndex = activeSlideIndicator.dataset.index * 1;

  if (activeSlideIndex === jumpToIndex) return null;

  checkSlideForVideo(activeSlide);

  // Track reference slide - last slide initially
  if (!referenceSlide) {
    referenceSlide = slides[slides.length - 1];
    referenceSlide.classList.add('reference-slide');
    referenceSlide.style.order = '1';
  }

  // Remove class/attributes after being tracked
  referenceSlide.classList.remove('reference-slide');
  referenceSlide.style.order = null;
  activeSlide.classList.remove('active');
  activeMenuItem?.classList.remove('active');
  activeSlideDescription?.classList.remove('active');
  activeSlideIndicator.classList.remove('active');
  // ? -- remove for daves
  [...activeSlide.parentElement.children].forEach((item) => {
    item.classList.remove('previous-slide');
    item.classList.remove('next-slide');
  });

  if (jumpTo) activeSlideIndicator.setAttribute('tabindex', -1);

  /*
   * If indicator dot buttons are clicked update:
   * reference slide, active indicator dot, and active slide
  */

  if (jumpToIndex >= 0) {
    const adjustedJumpToIndex = jumpToIndex + INDEX_OFFSET;
    const index = adjustedJumpToIndex > slides.length - 1
      ? adjustedJumpToIndex - slides.length
      : adjustedJumpToIndex;
    referenceSlide = slides[index > slides.length - 1 ? index - slides.length : index];
    referenceSlide.classList.add('reference-slide');
    // referenceSlide.style.order = '1';
    activeSlideIndicator = slideIndicators[jumpToIndex];
    activeSlide = slides[jumpToIndex];
    activeMenuItem = menuItemsContainer?.querySelector(`[data-index='${jumpToIndex}']`);
    activeMenuItem?.classList.add('active');
    activeSlideDescription = slideDescriptionsContainer?.querySelector(`[data-index='${jumpToIndex}']`);
    // Determine direction to jump
    const from = slides[activeSlideIndex].style.order !== '' ? slides[activeSlideIndex].style.order * 1 : activeSlideIndex;
    const to = slides[jumpToIndex].style.order !== '' ? slides[jumpToIndex].style.order * 1 : jumpToIndex;
    jumpToDirection(
      from,
      to,
      slideContainer,
    );
  }
  // ? - daves end
  activeSlideIndicator.removeAttribute('aria-current');
  // Next arrow button, swipe, keyboard navigation
  if ((event.currentTarget).dataset.toggle === 'next'
    || event.key === KEY_CODES.ARROW_RIGHT
    || (direction === 'left' && event.type === 'touchend')) {
    nextPreviousBtns[1].focus();
    referenceSlide = handleNext(referenceSlide, slides);
    activeSlideIndicator = handleNext(activeSlideIndicator, slideIndicators);
    activeMenuItem = activeMenuItem ? handleNext(activeMenuItem, menuItems) : null;
    activeSlide = handleNext(activeSlide, slides);
    slideContainer?.classList.remove('is-reversing');
    carouselElements.currentActiveIndex = (carouselElements.currentActiveIndex + 1) % slides.length;
  }

  // Previous arrow button, swipe, keyboard navigation
  if ((event.currentTarget).dataset.toggle === 'previous'
    || event.key === KEY_CODES.ARROW_LEFT
    || (direction === 'right' && event.type === 'touchend')) {
    nextPreviousBtns[0].focus();
    referenceSlide = handlePrevious(referenceSlide, slides);
    activeSlideIndicator = handlePrevious(activeSlideIndicator, slideIndicators);
    activeSlide = handlePrevious(activeSlide, slides);
    activeMenuItem = activeMenuItem ? handlePrevious(activeMenuItem, menuItems) : null;
    slideContainer.classList.add('is-reversing');
    carouselElements.currentActiveIndex = (carouselElements.currentActiveIndex - 1 + slides.length)
      % slides.length;
  }

  const isReversing = slideContainer.classList.contains('is-reversing');

  // Update reference slide attributes
  referenceSlide.classList.add('reference-slide');
  referenceSlide.style.order = slides.length + 1;

  updateAriaLive(ariaLive, activeSlide, carouselElements);

  // Update active slide and indicator dot attributes
  activeSlide.classList.add('active');
  activeMenuItem?.classList.add('active');
  activeSlideDescription?.classList.add('active');

  // add classes to nearby siblings
  if (activeSlide.previousElementSibling) {
    activeSlide.previousElementSibling.classList.add('previous-slide');
  } else {
    activeSlide.parentElement.lastElementChild.classList.add('previous-slide');
  }
  if (activeSlide.nextElementSibling) {
    activeSlide.nextElementSibling.classList.add('next-slide');
  } else {
    activeSlide.parentElement.firstElementChild.classList.add('next-slide');
  }

  setAriaHiddenAndTabIndex(carouselElements, activeSlide, el);
  // Update heights dynamically for disable-button
  if (carouselElements.el.classList.contains('disable-buttons') && window.innerWidth < 900) {
    setEqualHeight(slides, slideContainer, carouselElements.currentActiveIndex);
  }
  activeSlideIndicator.classList.add('active');
  activeSlideIndicator.setAttribute('aria-current', 'location');
  setIndicatorMultiplier(carouselElements, activeSlideIndicator, event);

  // Loop over all slide siblings to update their order
  const from = isReversing ? 1 : 2;
  for (let i = from; i <= slides.length; i += 1) {
    referenceSlide = handleNext(referenceSlide, slides);
    referenceSlide.style.order = i;
  }

  updatePreviousAriaLabel(carouselElements);

  if (carouselElements.el.classList.contains('disable-buttons') && window.innerWidth < 900) {
    updateButtonStates(carouselElements);
  }

  /*
   * Activates slide animation.
   * Delay time matches animation time for next/previous controls.
  */
  const slideDelay = 25;
  slideContainer.classList.remove('is-ready');
  return setTimeout(() => slideContainer.classList.add('is-ready'), slideDelay);
}

export function getSwipeDistance(start, end) {
  if (end === 0) {
    const updateStart = 0;
    return Math.abs(updateStart - end);
  }
  return Math.abs(start - end);
}

export function getSwipeDirection(swipe, swipeDistance) {
  const { xDistance } = swipeDistance;

  if (xDistance !== swipe.xStart && xDistance > swipe.xMin) {
    return (swipe.xEnd > swipe.xStart) ? 'right' : 'left';
  }
  return undefined;
}

/**
  * Mobile swipe/touch direction detection
  */
function mobileSwipeDetect(carouselElements) {
  const { el, slides } = carouselElements;
  const swipe = { xMin: 50 };
  /* c8 ignore start */
  el.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    swipe.xStart = touch.screenX;
    swipe.yStart = touch.screenY;
  });

  el.addEventListener('touchmove', (event) => {
    const touch = event.touches[0];
    swipe.xEnd = touch.screenX;
    swipe.yEnd = touch.screenY;
    const xDistance = Math.abs(swipe.xEnd - swipe.xStart);
    const yDistance = Math.abs(swipe.yEnd - swipe.yStart);
    // If horizontal movement is greater than vertical, prevent default to stop vertical scrolling
    if (xDistance > yDistance && xDistance > 10) {
      event.preventDefault();
    }
  });

  el.addEventListener('touchend', (event) => {
    const swipeDistance = {};
    swipeDistance.xDistance = getSwipeDistance(swipe.xStart, swipe.xEnd);
    carouselElements.direction = getSwipeDirection(swipe, swipeDistance);

    // stop swipe for disabled-buttons variant.
    const activeSlideIndex = carouselElements.currentActiveIndex;
    if (carouselElements.el.classList.contains('disable-buttons')
      && ((activeSlideIndex === 0 && carouselElements.direction === 'right')
        || (activeSlideIndex === slides.length - 1 && carouselElements.direction === 'left'))) {
      swipe.xStart = 0;
      swipe.xEnd = 0;
      return;
    }
    // reset end swipe values
    swipe.xStart = 0;
    swipe.xEnd = 0;

    if (swipeDistance.xDistance > swipe.xMin) {
      moveSlides(event, carouselElements);
    }
  });
  /* c8 ignore end */
}

function handleChangingSlides(carouselElements) {
  const { el, nextPreviousBtns, jumpTo, slideIndicators } = carouselElements;

  // Handle Next/Previous Buttons
  [...nextPreviousBtns].forEach((btn) => {
    btn.addEventListener('click', (event) => {
      moveSlides(event, carouselElements);
    });
  });

  // Handle keyboard navigation
  el.addEventListener('keydown', (event) => {
    if (event.key === KEY_CODES.ARROW_RIGHT
      || event.key === KEY_CODES.ARROW_LEFT) { moveSlides(event, carouselElements); }
  });

  // Handle slide indictors click
  if (jumpTo) {
    [...slideIndicators].forEach((li) => {
      li.addEventListener('click', (event) => {
        const jumpToIndex = Number(li.dataset.index);
        moveSlides(event, carouselElements, jumpToIndex);
      });
    });
  }

  el.addEventListener('carousel:jumpTo', (event) => {
    const { index } = event.detail;
    const jumpToIndex = Number(index);
    moveSlides(event, carouselElements, jumpToIndex);
  });

  // Swipe Events
  mobileSwipeDetect(carouselElements);
}

function convertMpcMp4(slides) {
  slides.forEach((slide) => {
    const a = slide.querySelector('a');
    if (a?.href.includes('images-tv.adobe')) {
      decorateAnchorVideo({
        src: a.href,
        anchorTag: a,
      });
    }
  });
}

function readySlides(slides, slideContainer, isUpsDesktop, carouselElements) {
  slideContainer.classList.add('is-ready');

  const setOrder = () => {
    carouselElements.currentActiveIndex = 0;
    slides.forEach((slide, idx) => {
      const isLastSlide = slides.length - 1 === idx;
      slide.style.order = isLastSlide ? 1 : idx + 2;
      slide.classList.toggle('reference-slide', isLastSlide);
    });
  };

  const isDesktop = window.matchMedia('(min-width: 900px)');
  const setUpsOrder = () => {
    if (!isDesktop.matches) setOrder();
    else slides.forEach((slide) => { slide.style.order = ''; });
  };

  if (!isUpsDesktop) setOrder();
  else {
    setUpsOrder();
    isDesktop.addEventListener('change', setUpsOrder);
  }
}

const buildMenuItems = (slides, el) => {
  if (isHovering(el)) {
    const slideDescriptions = [];
    let menuItems = slides.map((slide, index) => {
      const title = slide.querySelector('h2,h3');
      const description = slide.querySelector('p:not(:has(picture))');
      slideDescriptions.push(description ? createTag('p', { class: 'carousel-slide-description', 'data-index': index }, description.innerHTML) : '');
      if (!title) return null;
      const item = createTag('button', {
        class: 'carousel-menu-item',
        tabindex: 0,
        'aria-label': title.textContent,
        'daa-ll': `slide-title-${title.textContent.toLowerCase().replace(/\s+/g, '-')}`,
      }, title.textContent);
      const headerWrapper = createTag('h2', {
        class: 'slide-header-control',
      }, `${title.textContent}<a daa-ll="slide-open-${title.textContent.toLowerCase().replace(/\s+/g, '-')}">${EXPAND_ICON}</a><a class="collapse-wrapper" daa-ll="slide-close-${title.textContent.toLowerCase().replace(/\s+/g, '-')}" >${COLLAPSE_ICON}</a>`);
      title.parentElement.insertBefore(headerWrapper, title);
      title.remove();
      item.dataset.index = index;
      headerWrapper.querySelector('a.collapse-wrapper').addEventListener('click', (event) => {
        event.stopPropagation();
        slide.classList.add('collapsing');
        setTimeout(() => {
          slide.classList.remove('active');
          slide.classList.remove('collapsing');
        }, 290);
      });
      item.addEventListener('click', (event) => {
        const customEvent = new CustomEvent('carousel:jumpTo', { detail: { index: event.target.dataset.index * 1 } });
        el.dispatchEvent(customEvent);
      });
      item.setAttribute('data-index', index);
      item.setAttribute('tab-index', 0);
      return item;
    }).filter((item) => item);

    let offsetUndoneMenuItems;
    offsetUndoneMenuItems = menuItems.slice(INDEX_OFFSET);
    offsetUndoneMenuItems = offsetUndoneMenuItems.concat(menuItems.slice(0, INDEX_OFFSET));
    menuItems = offsetUndoneMenuItems;
    return {
      menuItemsContainer: createTag('div', { class: 'carousel-menu' }, menuItems),
      slideDescriptionsContainer: createTag('div', { class: 'carousel-slide-descriptions' }, slideDescriptions),
      menuItems,
      slideDescriptions,
    };
  } return {
    menuItemsContainer: null,
    slideDescriptionsContainer: null,
    slideDescriptions: null,
    menuItems: null,
  };
};
function updateDisableButtonsHeights(carouselElements) {
  const { slides, slideContainer, currentActiveIndex } = carouselElements;
  if (window.innerWidth < 900) {
    setEqualHeight(slides, slideContainer, currentActiveIndex);
  } else {
    removeEqualHeight(slides, slideContainer);
  }
}

export default function init(el) {
  setIndexOffeset(el);
  const activeSlideIndex = DEFAULT_INITIAL_ACTIVE_INDEX + (isMobile ? 0 : INDEX_OFFSET);
  const carouselSection = el.closest('.section');
  if (!carouselSection) return;
  const keyDivs = el.querySelectorAll(':scope > div > div:first-child');
  const carouselName = keyDivs[0].textContent;
  const parentArea = el.closest('.fragment') || document;
  const candidateKeys = parentArea.querySelectorAll('div.section-metadata > div > div:first-child');
  let slides = [...candidateKeys].reduce((rdx, key) => {
    if (key.textContent === 'carousel' && key.nextElementSibling.textContent === carouselName) {
      const slide = key.closest('.section');
      slide.classList.add('carousel-slide');
      // handle mobile vs desktop content
      const contentToRemove = slide.querySelector(`.text > div > div:has(p):nth-child(${isMobile ? '2' : '1'})`);
      contentToRemove?.remove();
      rdx.push(slide);
      slide.setAttribute('data-index', rdx.indexOf(slide));
      const title = slide.querySelector('h2,h3');

      if (isLinkedSlides(el)) {
        slide.setAttribute('daa-ll', `slide-image-${title.textContent.toLowerCase().replace(/\s+/g, '-')}`);
        slide.addEventListener('click', () => {
          window.open(slide.querySelector('a')?.href || '#', '_self');
        });
      }
      if (isHovering(el)) {
        slide.querySelector('a')?.setAttribute('tabindex', -1);
        slide.setAttribute('daa-ll', `slide-image-${title.textContent.toLowerCase().replace(/\s+/g, '-')}`);
        slide.addEventListener('click', (event) => {
          const customEvent = new CustomEvent('carousel:jumpTo', {
            detail: { index: event.target.closest('.carousel-slide').dataset.index * 1 },
          });
          el.dispatchEvent(customEvent);
        });
      }
    }
    return rdx;
  }, []);
  // handle offset for non-mobile carousel
  if (!isMobile && INDEX_OFFSET > 0) {
    let offsetAdjustedSlides;
    offsetAdjustedSlides = slides.slice(INDEX_OFFSET + 1);
    offsetAdjustedSlides = offsetAdjustedSlides.concat(slides.slice(0, INDEX_OFFSET + 1));
    slides = offsetAdjustedSlides;
    slides.forEach((slide, index) => { slide.setAttribute('data-index', index); });
  }
  // TODO: REFEDRENCE SLIDE POSTITION CHANGE =BASED ON DIRECTION (left ot right)
  const jumpTo = el.classList.contains('jump-to');
  const fragment = new DocumentFragment();
  const nextPreviousBtns = decorateNextPreviousBtns(slides);
  const nextPreviousContainer = createTag('div', { class: 'carousel-button-container' });
  const slideIndicators = decorateSlideIndicators(slides, jumpTo, activeSlideIndex);
  const controlsContainer = createTag('div', { class: 'carousel-controls is-delayed' });

  convertMpcMp4(slides);
  fragment.append(...slides);
  const slideWrapper = createTag('div', { class: 'carousel-wrapper' });
  const ariaLive = createTag('div', {
    class: 'aria-live-container',
    'aria-live': 'polite',
  });
  slideWrapper.appendChild(ariaLive);

  const {
    menuItemsContainer,
    menuItems,
    slideDescriptions,
    slideDescriptionsContainer,
  } = buildMenuItems(slides, el);

  const slideContainer = createTag('div', { class: 'carousel-slides' }, fragment);
  if (isHovering(el) || isPeaking(el) || isWhatsnew(el)) {
    slideContainer.classList.add('is-ready');
  }
  const carouselElements = {
    el,
    menuItemsContainer,
    slideDescriptions,
    slideDescriptionsContainer,
    jumpTo,
    menuItems,
    nextPreviousBtns,
    slideContainer,
    slides,
    slideIndicators,
    controlsContainer,
    direction: undefined,
    ariaLive,
    currentActiveIndex: 0,
  };

  if (el.classList.contains('lightbox')) {
    const lightboxBtns = decorateLightboxButtons();
    slideWrapper.append(slideContainer, ...lightboxBtns);
    handleLightboxButtons(lightboxBtns, el, slideWrapper);
  } else {
    slideWrapper.append(slideContainer);
  }
  /*
   * Hinting center variant - Set slides order
   * before moveSlides is called for centering to work.
  */
  if (el.classList.contains('hinting-center-mobile')) {
    const isUpsDesktop = el.classList.contains('ups-desktop');
    readySlides(slides, slideContainer, isUpsDesktop, carouselElements);
  }

  el.textContent = '';
  if (slideDescriptionsContainer) el.append(slideDescriptionsContainer);
  if (menuItemsContainer) el.append(menuItemsContainer);
  el.append(slideWrapper);

  const dotsUl = createTag('ul', { class: 'carousel-indicators' });

  dotsUl.append(...slideIndicators);
  controlsContainer.append(dotsUl);
  nextPreviousContainer.append(...nextPreviousBtns, controlsContainer);
  el.append(nextPreviousContainer);

  function normalizeVideoHeights() {
    const videos = el.querySelectorAll('video');
    if (!videos.length) return;

    const videoData = [];
    let maxHeight = 0;

    videos.forEach((video) => {
      const foreground = video.closest('.editorial-card')?.querySelector('.foreground');
      const videoHeight = video.offsetHeight;
      const totalHeight = videoHeight + (foreground ? foreground.offsetHeight : 0);
      videoData.push({ video, foreground, videoHeight, totalHeight });
      if (totalHeight > maxHeight) maxHeight = totalHeight;
    });

    videoData.forEach(({ video, foreground, videoHeight }) => {
      const finalHeight = foreground ? videoHeight : maxHeight;
      video.style.height = `${finalHeight}px`;
      video.style.maxHeight = `${finalHeight}px`;
    });
  }

  if (el.classList.contains('align-height')) setTimeout(normalizeVideoHeights, 100);

  window.addEventListener('resize', debounce(() => { if (el.classList.contains('align-height')) normalizeVideoHeights(); }));

  function handleDeferredImages() {
    const images = el.querySelectorAll('img[loading="lazy"]');
    images.forEach((img) => {
      img.removeAttribute('loading');
    });
    parentArea.removeEventListener(MILO_EVENTS.DEFERRED, handleDeferredImages, true);
  }
  parentArea.addEventListener(MILO_EVENTS.DEFERRED, handleDeferredImages, true);

  slides[activeSlideIndex - 1]?.classList.add('previous-slide');
  slides[activeSlideIndex].classList.add('active');
  if (menuItems) menuItems[0].classList.add('active');
  if (slideDescriptions) slideDescriptions[0].classList.add('active');
  if (isHovering(el)) slides[activeSlideIndex].querySelector('a')?.setAttribute('tabindex', 0);
  slides[activeSlideIndex + 1]?.classList.add('next-slide');
  handleChangingSlides(carouselElements);
  setAriaHiddenAndTabIndex(carouselElements, slides[activeSlideIndex], el);

  window.addEventListener('resize', () => {
    setAriaHiddenAndTabIndex(carouselElements);
    if (el.classList.contains('disable-buttons')) {
      updateDisableButtonsHeights(carouselElements);
      updateButtonStates(carouselElements);
    }
  });

  function handleDeferredHeights() {
    updateDisableButtonsHeights(carouselElements);
  }

  if (el.classList.contains('disable-buttons')) {
    updateButtonStates(carouselElements);
    setTimeout(handleDeferredHeights, 1000);
  }

  function handleLateLoadingNavigation() {
    [...el.querySelectorAll('.is-delayed')].forEach((item) => item.classList.remove('is-delayed'));
    parentArea.removeEventListener(MILO_EVENTS.DEFERRED, handleLateLoadingNavigation, true);
  }

  parentArea.addEventListener(MILO_EVENTS.DEFERRED, handleLateLoadingNavigation, true);
}
