import { sendAnalytics } from '../../../martech/helpers.js';
import { processTrackingLabels } from '../../../martech/attributes.js';
import { createTag, getFederatedUrl, getFederatedContentRoot, getConfig } from '../../../utils/utils.js';
import { getMetadata } from '../section-metadata/section-metadata.js';

let USER_ACTION = false;
const SLIDE_ANALYTICS = [];

const getViewport = (el) => el.closest('.rm-viewport')?.dataset.viewport;
const getIndex = (el) => [...el.parentNode.children].indexOf(el);

const fireAnalytic = (card) => {
  const section = card.parentNode.closest('.section');

  const fireSendAnalytics = () => {
    const index = getIndex(card);
    const viewport = getViewport(card);
    const { label, seen, visible } = SLIDE_ANALYTICS[viewport][index] || {};

    if (seen || !visible) return;

    const analytic = `${USER_ACTION ? 'user' : 'auto'}-slideseen-${index + 1}--${processTrackingLabels(label, getConfig(), 20)}|${section?.getAttribute('daa-lh')}|b${index + 1}`;
    SLIDE_ANALYTICS[viewport][index].seen = true;

    sendAnalytics(analytic);
    USER_ACTION = false;
  };

  if (section?.getAttribute('daa-lh')) fireSendAnalytics();
  else {
    const observer = new MutationObserver(() => {
      if (section?.getAttribute('daa-lh')) {
        fireSendAnalytics();
        observer.disconnect();
      }
    });
    observer.observe(section, { attributes: true, attributeFilter: ['daa-lh'] });
  }
};

const setSlideObserver = (slides) => {
  slides.forEach((slide) => {
    const titleEl = slide.querySelector('.rm-title');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const viewport = getViewport(entry.target);
        const index = getIndex(slide);
        SLIDE_ANALYTICS[viewport][index].visible = entry.isIntersecting;
        if (entry.isIntersecting && slide.classList.contains('is-active')) {
          const card = slide.closest('.rm-viewport').querySelector('.rm-card.is-active');
          fireAnalytic(card);
        }
      });
    }, { threshold: 1.0 });
    io.observe(titleEl);
  });
};

const setAnalytics = (slides, cards, container, el) => {
  const config = getConfig();
  const mepMartech = config?.mep?.martech || '';
  SLIDE_ANALYTICS[container.dataset.viewport] = {};

  el.setAttribute('data-block-daa-lh', true);
  slides.forEach((slide, index) => {
    const label = slide.querySelector('.rm-title')?.textContent;
    SLIDE_ANALYTICS[container.dataset.viewport][index] = { visible: false, label };
    slide.setAttribute('daa-lh', `b${index + 1}|rm-slide${mepMartech}`);
  });
  cards.querySelectorAll('.rm-card').forEach((card, index) => {
    const { label } = SLIDE_ANALYTICS[container.dataset.viewport][index];
    card.setAttribute('daa-ll', `rm-nav-${index + 1}--${processTrackingLabels(label, config, 20)}`);
  });
};

const CHEVRON_SVG = '<svg aria-hidden="true" width="5" height="8" viewBox="0 0 5 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.75 6.75L3.75 3.75L0.75 0.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const RESET_SVG = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none"><g clip-path="url(#clip0_3399_7947)"><rect x="0.333984" y="2" width="1" height="8" rx="0.5" fill="white"/><path d="M7.10412 1.28574C7.36448 1.02559 7.78654 1.02546 8.04682 1.28574C8.30711 1.54602 8.30698 1.96808 8.04682 2.22845L4.94201 5.33327H11.3326C11.7008 5.33327 11.9993 5.63174 11.9993 5.99993C11.9993 6.36812 11.7008 6.6666 11.3326 6.6666H4.94201L8.04682 9.77142C8.30698 10.0318 8.30711 10.4538 8.04682 10.7141C7.78654 10.9744 7.36448 10.9743 7.10412 10.7141L2.86128 6.47129C2.60093 6.21094 2.60093 5.78893 2.86128 5.52858L7.10412 1.28574Z" fill="white"/></g><defs><clipPath id="clip0_3399_7947"><rect width="12" height="12" fill="white"/></clipPath></defs></svg>';
const BREAKPOINTS = ['mobile', 'tablet', 'desktop'];
const AUTOPLAY_MS = 5000;
const SLIDE_MS = 300;
const STAGGER_MS = 1000;
const STAGGER_BASE = 60;
const STAGGER_STEP = 20;
const EASE = 'cubic-bezier(0.42, 0, 0, 1)';
const SWIPE_THRESHOLD = 100;

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isRtl = () => document.documentElement.dir === 'rtl';
const reflow = (el) => el?.getBoundingClientRect();
const getCssPx = (el, prop) => parseFloat(getComputedStyle(el).getPropertyValue(prop)) || 0;

const clearInlineStyles = (el, props) => {
  if (!el) return;
  props.forEach((p) => { el.style[p] = ''; });
};

const STAGGER_CHILDREN = ['.rm-eyebrow', '.rm-title', '.rm-body', '.rm-ctas'];

const resetSlide = (slide) => {
  clearInlineStyles(slide, ['zIndex', 'pointerEvents', 'transform', 'transition']);
  const content = slide.querySelector('.rm-content');
  clearInlineStyles(content, ['transform', 'transition']);
  STAGGER_CHILDREN.forEach((sel) => {
    clearInlineStyles(content?.querySelector(sel), ['transform', 'transition']);
  });
};

const groupByViewport = (el) => {
  const viewports = {};
  let current = null;
  [...el.children].forEach((row) => {
    const firstCol = row.querySelector(':scope > div');
    const breakpoint = BREAKPOINTS.find((b) => firstCol?.textContent.trim().toLowerCase() === b);
    if (breakpoint) {
      current = breakpoint;
      viewports[current] = [];
    } else if (current) {
      viewports[current].push(row);
    }
  });

  // if breakpoints are missing slides, we clone from the lower breakpoint
  BREAKPOINTS.slice(1).forEach((breakpoint, idx) => {
    const lower = BREAKPOINTS[idx];
    if (!viewports[breakpoint]) {
      viewports[breakpoint] = viewports[lower].map((s) => s.cloneNode(true));
      return;
    }
    viewports[breakpoint].forEach((slide, j) => {
      const lowerSlide = viewports[lower][j];
      if (!lowerSlide) return;
      const [textCol, imageCol] = slide.querySelectorAll(':scope > div');
      const lowerCols = lowerSlide.querySelectorAll(':scope > div');
      [textCol, imageCol].forEach((col, k) => {
        if (col && !col.children.length && lowerCols[k]) {
          col.replaceWith(lowerCols[k].cloneNode(true));
        }
      });
    });
  });

  return viewports;
};

const decorateText = (textCol) => {
  const heading = textCol.querySelector('h1, h2');
  heading?.classList.add('rm-title');
  heading?.previousElementSibling?.classList.add('rm-eyebrow');

  const eyebrow = textCol.querySelector('.rm-eyebrow');
  const icon = textCol.querySelector('p a[href*=".svg"]');
  const label = textCol.querySelector(':scope > p:has(a[href*=".svg"]) + p');
  const cta = textCol.querySelector('p:has(em)');
  const body = [...textCol.querySelectorAll('p')]
    .filter((p) => [eyebrow, icon?.closest('p'), label, cta].every((x) => x !== p));

  if (!body.length) return;
  const bodyEl = createTag('div', { class: 'rm-body' });
  body[0].before(bodyEl);
  body.forEach((p) => bodyEl.append(p));
};

const decorateCtas = (textCol) => {
  const cta = textCol.querySelector('p:has(em)');
  if (!cta) return;
  cta.classList.add('rm-ctas', 'dark', 'action-area');
  const primary = cta.querySelector('em > strong a');
  const secondary = cta.querySelector('em > a');
  primary?.classList.add('con-button', 'rm-cta-primary', 'fill', 'button-lg', 'outline');
  secondary?.classList.add('con-button', 'button-lg', 'outline');
  cta.replaceChildren(...[primary, secondary].filter(Boolean));
};

const prepareVideo = (imageCol) => {
  const videoContainer = imageCol?.querySelector('.video-container');
  const video = videoContainer?.querySelector('video');
  if (!video) return;
  // data-hoverplay is used as an opt out from the decoration logic in decorate.js
  ['playsinline', 'muted', 'loop', 'data-hoverplay'].forEach((attr) => {
    video.setAttribute(attr, '');
  });
  video.muted = true;
  video.removeAttribute('autoplay');
  const src = video.dataset.videoSource || video.src;
  video.removeAttribute('src');
  video.querySelectorAll('source').forEach((s) => s.remove());
  video.dataset.lazySrc = src;
  videoContainer.querySelector('.pause-play-wrapper')?.remove();
  videoContainer.replaceWith(video);
};

const getActiveViewport = () => {
  if (window.matchMedia('(width >= 1280px)').matches) return 'desktop';
  if (window.matchMedia('(width > 767px)').matches) return 'tablet';
  return 'mobile';
};

const loadVideo = (video) => {
  if (!video || video.dataset.loaded) return;
  const src = video.dataset.lazySrc;
  if (src && !video.querySelector('source')) {
    video.appendChild(createTag('source', { src, type: 'video/mp4' }));
  }
  video.load();
  video.dataset.loaded = 'true';
};

const loadViewportVideos = (el) => {
  const active = getActiveViewport();
  el.querySelectorAll('.rm-viewport').forEach((vp) => {
    const isActive = vp.dataset.viewport === active;
    vp.querySelectorAll('.rm-background video').forEach((v) => {
      if (!isActive) return;
      const isActiveSlide = v.closest('.rm-slide')?.classList.contains('is-active');
      if (isActiveSlide) {
        loadVideo(v);
        if (!prefersReducedMotion()) v.play().catch(() => {});
      }
    });
  });
};

const decorateSlide = (slide) => {
  const [textCol, imageCol] = slide.querySelectorAll(':scope > div');
  slide.classList.add('rm-slide');
  imageCol?.classList.add('rm-background');
  textCol.classList.add('rm-content');
  const contentWrapper = createTag('div', { class: 'rm-content-wrapper' });
  slide.insertBefore(contentWrapper, textCol);
  contentWrapper.append(textCol);
  slide.insertBefore(createTag('div', { class: 'rm-overlay' }), contentWrapper);

  prepareVideo(imageCol);

  if (!textCol) return;
  decorateText(textCol);
  decorateCtas(textCol);
};

const buildCard = (slide) => {
  const icon = [...slide.querySelectorAll('p')]
    .find((p) => p.querySelector('img[src*=".svg"]'));
  const label = icon.nextElementSibling;
  const iconSrc = getFederatedUrl(icon.querySelector('img[src*=".svg"]')?.getAttribute('src'));
  const labelText = label?.textContent.trim();
  const href = label?.querySelector('a')?.getAttribute('href') || '';
  const eyebrowText = slide.querySelector('.rm-eyebrow')?.textContent.trim();
  const ariaLabel = eyebrowText ? `${eyebrowText}, ${labelText}` : labelText;

  icon.remove();
  label?.remove();

  const card = createTag('a', {
    class: 'rm-card',
    href,
    'aria-label': ariaLabel,
    role: 'tab',
    'aria-selected': 'false',
  });
  card.replaceChildren(
    createTag('img', { class: 'rm-card-icon', src: iconSrc, alt: labelText, loading: 'lazy' }),
    createTag('div', { class: 'rm-card-content' }, [
      createTag('span', { class: 'rm-card-label' }, labelText),
      createTag('span', { class: 'rm-card-chevron', 'aria-hidden': 'true' }, CHEVRON_SVG),
    ]),
    createTag('div', { class: 'rm-card-progress' }, [
      createTag('div', { class: 'rm-card-progress-bar' }),
    ]),
  );
  return card;
};

const buildReset = () => createTag('button', {
  class: 'rm-card-reset',
  type: 'button',
  'aria-label': 'Back to first',
}, RESET_SVG);

const buildCards = (slides) => {
  const cards = createTag('div', { class: 'rm-cards', role: 'tablist' });
  slides.forEach((slide) => cards.append(buildCard(slide)));
  cards.append(buildReset());
  return cards;
};

const buildPlayPause = () => {
  const root = getFederatedContentRoot();
  return createTag('button', {
    class: 'rm-pause-play',
    type: 'button',
    'aria-label': 'Pause',
  }, createTag('div', { class: 'offset-filler is-playing' }, [
    createTag('img', {
      class: 'accessibility-control pause-icon',
      alt: 'Pause icon',
      src: `${root}/federal/assets/svgs/accessibility-pause.svg`,
    }),
    createTag('img', {
      class: 'accessibility-control play-icon',
      alt: 'Play icon',
      src: `${root}/federal/assets/svgs/accessibility-play.svg`,
    }),
  ]));
};

const animateContentEnter = (content, direction) => {
  if (!content || prefersReducedMotion()) return;
  const targets = STAGGER_CHILDREN
    .map((sel) => content.querySelector(sel))
    .filter(Boolean);
  targets.forEach((el, i) => {
    el.style.transition = 'none';
    el.style.transform = `translateX(${direction * (STAGGER_BASE + i * STAGGER_STEP)}px)`;
  });
  reflow(content);
  targets.forEach((el) => {
    el.style.transition = `transform ${STAGGER_MS}ms ${EASE}`;
    el.style.transform = 'translateX(0)';
  });
};

const setAriaHiddenAndTabIndex = (slides) => {
  slides.forEach((slide) => {
    const isActive = slide.classList.contains('is-active');
    slide.setAttribute('aria-hidden', String(!isActive));
    slide.toggleAttribute('inert', !isActive);
  });
};

const updateControlsLayout = (el) => {
  const activeSlides = el.querySelectorAll('.rm-slide.is-active');
  const activeSlide = [...activeSlides].find((s) => s.offsetParent !== null);
  if (!activeSlide) return;
  const vp = activeSlide.closest('.rm-viewport');
  const controls = vp?.querySelector('.rm-controls');
  const playPause = vp?.querySelector('.rm-pause-play');
  if (!controls || !playPause) return;
  const cardsWrapper = vp.querySelector('.rm-cards');
  const cards = vp.querySelectorAll('.rm-card');
  // the best thing I could find to determine when the play button is running out of space
  // is this formula of: (side paddings) + (cards max width) + (cards gaps) + (play button width)
  // which gives the min total width of the controls section.
  // If the viewport gets smaller than this min width, I move the play button
  const needed = (2 * getCssPx(controls, 'padding-left')) + (cards.length * getCssPx(cards[0], 'max-width')) + (cards.length * getCssPx(cardsWrapper, 'gap')) + getCssPx(playPause, 'width');
  const stacked = needed > window.innerWidth;
  controls.classList.toggle('rm-controls-column', stacked);
  playPause.classList.toggle('rm-pause-play-column', stacked);
};

const updateContentSpacing = (el) => {
  const activeSlides = el.querySelectorAll('.rm-slide.is-active');
  const activeSlide = [...activeSlides].find((s) => s.offsetParent !== null);
  if (!activeSlide) return;
  const vp = activeSlide.closest('.rm-viewport');
  const wrapper = activeSlide.querySelector('.rm-content-wrapper');
  const content = activeSlide.querySelector('.rm-content');
  const controls = vp?.querySelector('.rm-controls');
  if (!wrapper || !content || !controls || !vp) return;

  // Set min-height so the viewport never shrinks below what the content needs
  const wrapperPadTop = getCssPx(wrapper, 'padding-top');
  const contentH = content.offsetHeight;
  const needed = wrapperPadTop + contentH + 24 + controls.offsetHeight;

  vp.style.minHeight = `${Math.max(window.innerHeight, needed)}px`;
  // Compact padding-top when content overlaps controls
  // Applied to all wrappers to handle slide changes
  const allWrappers = vp.querySelectorAll('.rm-content-wrapper');
  const controlsTop = controls.getBoundingClientRect().top - 24;
  const contentBottom = content.getBoundingClientRect().bottom;
  const isCompact = wrapper.classList.contains('rm-compact');
  if (!isCompact && contentBottom >= controlsTop) {
    allWrappers.forEach((w) => w.classList.add('rm-compact'));
  } else if (isCompact && contentBottom + 80 < controlsTop) {
    allWrappers.forEach((w) => w.classList.remove('rm-compact'));
  }
};

const dynamicLayoutUpdates = (el) => {
  updateControlsLayout(el);
  updateContentSpacing(el);
};

const startAutoplay = (slides, cards, container, block) => {
  const cardEls = [...cards.querySelectorAll('.rm-card')];
  const bars = cardEls.map((c) => c.querySelector('.rm-card-progress-bar'));
  const playPauseBtn = container.querySelector('.rm-pause-play');
  const filler = playPauseBtn?.querySelector('.offset-filler');
  const srHint = container.querySelector('.rm-sr-hint');
  let active = 0; // index of the current active slide
  let timer = null; // timer for the autoplay
  let paused = false; // whether the autoplay is paused
  let cleanupTimer = null; // cleanup timer that resets temp inline styles
  let pendingSlide = null; // the slide that is currently transitioning in

  const isMobile = () => !window.matchMedia('(min-width: 1280px)').matches;
  const isDesktopSmallVp = isMobile()
    && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const trackXForCard = (i) => {
    if (i <= 0) return 0;
    const card = cardEls[i];
    return -(card.offsetLeft - cardEls[0].offsetLeft);
  };

  const setTrackX = (x, animated) => {
    if (!isMobile()) {
      cards.style.transition = '';
      cards.style.transform = '';
      return;
    }
    cards.style.transition = animated ? `transform ${SLIDE_MS}ms ${EASE}` : 'none';
    cards.style.transform = `translateX(${x}px)`;
  };

  const setPlayingState = (isPlaying) => {
    filler?.classList.toggle('is-playing', isPlaying);
    playPauseBtn?.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
    if (srHint) srHint.hidden = !isPlaying;
  };

  const fillOrigin = () => `translateX(${isRtl() ? '101%' : '-101%'})`;

  const clearFill = (i) => {
    const bar = bars[i];
    bar.style.transition = 'none';
    bar.style.transform = fillOrigin();
  };

  const startFill = (i) => {
    const bar = bars[i];
    bar.style.transition = 'none';
    bar.style.transform = fillOrigin();
    reflow(bar);
    bar.style.transition = `transform ${AUTOPLAY_MS}ms linear`;
    bar.style.transform = 'translateX(0%)';
  };

  const finishSlideTransition = () => {
    clearTimeout(cleanupTimer);
    cleanupTimer = null;
    [...slides].forEach(resetSlide);
    if (pendingSlide) {
      pendingSlide.classList.add('is-active');
      pendingSlide = null;
    }
  };

  const activate = (index, direction = 1, { skipTrack = false } = {}) => {
    finishSlideTransition();

    const oldSlide = slides[active];
    const newSlide = slides[index];
    const vid = newSlide.querySelector('video');
    loadVideo(vid);
    const reducedMotion = prefersReducedMotion();

    oldSlide.classList.remove('is-active');
    newSlide.classList.add('is-active');
    pendingSlide = null;
    setAriaHiddenAndTabIndex([oldSlide, newSlide]);

    if (reducedMotion) {
      resetSlide(oldSlide);
      resetSlide(newSlide);
    } else {
      oldSlide.style.transition = 'none';
      oldSlide.style.transform = 'translateX(0%)';
      newSlide.style.transition = 'none';
      newSlide.style.transform = `translateX(${direction * 100}%)`;

      reflow(newSlide);

      oldSlide.style.transition = `transform ${SLIDE_MS}ms ${EASE}`;
      oldSlide.style.transform = `translateX(${-direction * 100}%)`;
      newSlide.style.transition = `transform ${SLIDE_MS}ms ${EASE}`;
      newSlide.style.transform = 'translateX(0%)';

      animateContentEnter(newSlide.querySelector('.rm-content'), direction);

      const transitionMs = Math.max(SLIDE_MS, STAGGER_MS);
      cleanupTimer = setTimeout(finishSlideTransition, transitionMs + 50);
    }

    oldSlide.querySelector('video')?.pause();
    if (vid) vid.currentTime = 0;
    if (!paused) {
      vid?.play().catch(() => {});
    } else {
      vid?.pause();
    }

    cardEls[active]?.classList.remove('is-active');
    cardEls[active]?.setAttribute('aria-selected', 'false');
    active = index;
    cardEls[active]?.classList.add('is-active');
    cardEls[active]?.setAttribute('aria-selected', 'true');
    if (isMobile() && !skipTrack) {
      setTrackX(trackXForCard(active), !reducedMotion);
    }

    requestAnimationFrame(() => dynamicLayoutUpdates(block));
  };

  const preloadNextVideo = () => {
    const nextIdx = (active + 1) % slides.length;
    loadVideo(slides[nextIdx]?.querySelector('video'));
  };

  const advance = () => {
    if (paused) return;
    clearTimeout(timer);
    clearFill(active);
    activate((active + 1) % cardEls.length, 1);
    startFill(active);
    timer = setTimeout(advance, AUTOPLAY_MS);
    preloadNextVideo();
  };

  const pause = () => {
    if (paused) return;
    clearTimeout(timer);
    finishSlideTransition();
    clearFill(active);
    paused = true;
    setPlayingState(false);
    slides[active]?.querySelector('video')?.pause();
  };

  const resume = () => {
    if (!paused) return;
    paused = false;
    setPlayingState(true);
    startFill(active);
    timer = setTimeout(advance, AUTOPLAY_MS);
    slides[active]?.querySelector('video')?.play().catch(() => {});
  };

  const pauseOnInteraction = (e) => {
    const target = e.target.closest('a, button');
    if (target && !target.closest('.rm-pause-play')) {
      if (!paused) pause();
    }
  };

  const noHover = () => window.matchMedia('(hover: none)').matches;

  cardEls.forEach((card, i) => {
    card.addEventListener('mouseenter', () => {
      if (noHover()) return;
      if (i === active) { pause(); return; }
      clearTimeout(timer);
      clearFill(active);
      paused = true;
      const dir = i > active ? 1 : -1;
      activate(i, dir, { skipTrack: isDesktopSmallVp });
      USER_ACTION = true;
    });
  });

  const resetBtn = cards.querySelector('.rm-card-reset');
  resetBtn?.addEventListener('click', () => {
    if (active === 0) return;
    clearTimeout(timer);
    clearFill(active);
    paused = true;
    activate(0, -1);
  });

  // this is to handle the use case where the user is on desktop, but shrinks
  // the viewport to tablet/mobile size. This was causing the next card to be
  // tracked incorrectly.
  const handleDesktopSmallVp = () => {
    if (!isDesktopSmallVp) return;
    resetBtn?.remove();
    const playPause = container.querySelector('.rm-pause-play');
    const nextBtn = createTag('button', {
      class: 'rm-arrow-next',
      type: 'button',
      'aria-label': 'Next card',
    }, RESET_SVG);
    const controlsTop = createTag('div', { class: 'rm-controls-top' });
    playPause.before(controlsTop);
    controlsTop.append(playPause, nextBtn);
    nextBtn.addEventListener('click', () => {
      const next = (active + 1) % cardEls.length;
      clearTimeout(timer);
      clearFill(active);
      paused = true;
      setPlayingState(false);
      activate(next, 1);
    });
  };

  handleDesktopSmallVp();

  container.addEventListener('mouseover', pauseOnInteraction);
  container.addEventListener('focusin', (e) => {
    if (!e.target.closest('.rm-pause-play') && !paused) pause();
  });

  playPauseBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (paused) {
      resume();
    } else {
      pause();
    }
  });

  // mobile swipe
  let touchStartX = 0;
  let touchStartY = 0;

  container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dy) > Math.abs(dx)) return;

    clearTimeout(timer);
    clearFill(active);
    const dir = dx < 0 ? 1 : -1;
    const next = (active + dir + cardEls.length) % cardEls.length;
    activate(next, dir);
    paused = true;
    USER_ACTION = true;
    setPlayingState(false);
  }, { passive: true });

  requestAnimationFrame(() => {
    if (prefersReducedMotion()) {
      paused = true;
      setPlayingState(false);
      return;
    }
    startFill(active);
    timer = setTimeout(advance, AUTOPLAY_MS);
    preloadNextVideo();
  });

  return { pause, resume };
};

const buildViewport = (viewport, slides) => {
  const container = createTag('div', { class: 'rm-viewport', 'data-viewport': viewport });
  slides.forEach((slide, i) => {
    decorateSlide(slide);
    slide.setAttribute('role', 'tabpanel');
    slide.setAttribute('aria-roledescription', 'slide');
    if (i > 0) slide.querySelector('video')?.removeAttribute('poster');
  });
  slides[0]?.classList.add('is-active');
  setAriaHiddenAndTabIndex(slides);
  const cards = buildCards(slides);
  const firstCard = cards.children[0];
  firstCard?.classList.add('is-active');
  firstCard?.setAttribute('aria-selected', 'true');
  const controls = createTag('div', { class: 'rm-controls' });
  const srHint = createTag('p', { class: 'rm-sr-hint' }, 'Autoplay is on. Use the Pause button for a better experience with a screen reader.');
  controls.append(srHint, buildPlayPause(), cards);
  container.append(controls, ...slides);
  return container;
};

const reorderSlidesMaybe = (el, viewports) => {
  const sectionMeta = el.parentElement?.querySelector('.section-metadata');
  if (!sectionMeta) return;
  const metadata = getMetadata(sectionMeta);
  const startIdx = Number(metadata['starting-marquee']?.text?.[0]) - 1;
  if (startIdx > 0) {
    Object.keys(viewports).forEach((vp) => {
      const slides = viewports[vp];
      if (startIdx >= slides.length) return;
      viewports[vp] = [slides[startIdx], ...slides.filter((_, i) => i !== startIdx)];
    });
  }
};

export default function init(el) {
  const viewports = groupByViewport(el);
  reorderSlidesMaybe(el, viewports);
  const containers = Object.entries(viewports).map(([vp, slides]) => buildViewport(vp, slides));
  el.replaceChildren(...containers);
  const initializedVps = new Set();
  const autoplayControllers = [];
  const initViewportAutoplay = () => {
    const activeVp = getActiveViewport();
    if (initializedVps.has(activeVp)) return;
    initializedVps.add(activeVp);
    const container = containers.find((c) => c.dataset.viewport === activeVp);
    if (!container) return;
    const slides = container.querySelectorAll('.rm-slide');
    const cards = container.querySelector('.rm-cards');
    setSlideObserver(slides);
    setAnalytics(slides, cards, container, el);
    autoplayControllers.push(startAutoplay(slides, cards, container, el));
  };

  loadViewportVideos(el);
  initViewportAutoplay();
  requestAnimationFrame(() => dynamicLayoutUpdates(el));
  window.addEventListener('resize', () => {
    dynamicLayoutUpdates(el);
    loadViewportVideos(el);
    initViewportAutoplay();
  });

  const nextSection = el.closest('.section')?.nextElementSibling;
  if (nextSection) {
    new IntersectionObserver(([entry]) => {
      const action = entry.isIntersecting ? 'pause' : 'resume';
      if (entry.isIntersecting || entry.boundingClientRect.top > 0) {
        autoplayControllers.forEach((ctrl) => ctrl[action]());
      }
    }, { rootMargin: '0px 0px -30% 0px' }).observe(nextSection);
  }
}
