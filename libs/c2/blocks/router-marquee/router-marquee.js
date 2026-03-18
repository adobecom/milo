import { processTrackingLabels } from '../../../martech/attributes.js';
import { createTag, getFederatedUrl, getFederatedContentRoot, getConfig, createIntersectionObserver } from '../../../utils/utils.js';
import { getMetadata } from '../section-metadata/section-metadata.js';

const CHEVRON_SVG = '<svg width="5" height="8" viewBox="0 0 5 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.75 6.75L3.75 3.75L0.75 0.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const BREAKPOINTS = ['mobile', 'tablet', 'desktop'];
const AUTOPLAY_MS = 15000;
const TEXT_EXIT_MS = 260;
const TEXT_EXIT_PX = 28;
const TEXT_GAP_MS = 220;
const TEXT_ENTER_MS = 380;
const TEXT_ENTER_PX = 28;
const BG_FADE_MS = 650;
const BG_SHIFT_PX = 90;
const HOVER_DELAY_MS = 200;
const EASE = 'cubic-bezier(0.42, 0, 0, 1)';
const RESUME_DELAY = 2000;
const SWIPE_THRESHOLD = 100;
const TRANSITION_MS = Math.max(BG_FADE_MS, TEXT_EXIT_MS + TEXT_GAP_MS + TEXT_ENTER_MS);

const reflow = (el) => el?.getBoundingClientRect();

const clearInlineStyles = (el, props) => {
  if (!el) return;
  props.forEach((p) => { el.style[p] = ''; });
};

const resetSlide = (slide) => {
  clearInlineStyles(slide, ['opacity', 'zIndex', 'transition', 'pointerEvents']);
  clearInlineStyles(slide.querySelector('.rm-content'), ['transform', 'opacity', 'transition']);
  const bg = slide.querySelector('.rm-background');
  if (bg) { bg.style.transition = ''; bg.style.removeProperty('--slide-bg-x'); }
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
  const body = [...textCol.querySelectorAll('p')]
    .filter((p) => !p.querySelector('a')
    && [eyebrow, icon, label].every((x) => x !== p));

  const bodyEl = createTag('div', { class: 'rm-body' });
  body[0].before(bodyEl);
  body.forEach((p) => bodyEl.append(p));
};

const decorateCtas = (textCol) => {
  const cta = textCol.querySelector('p:has(em)');
  if (!cta) return;
  cta.classList.add('rm-ctas');
  const primary = cta.querySelector('em > strong a');
  const secondary = cta.querySelector('em > a');
  primary?.classList.add('con-button', 'rm-cta-primary');
  secondary?.classList.add('con-button');
  cta.replaceChildren(...[primary, secondary].filter(Boolean));
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

  const miloVideo = imageCol?.querySelector('.milo-video');
  const iframe = miloVideo?.querySelector('iframe');
  if (iframe?.src?.includes('.mp4')) {
    const video = createTag('video', { playsinline: '', autoplay: '', muted: '', loop: '' });
    video.appendChild(createTag('source', { src: iframe.src, type: 'video/mp4' }));
    miloVideo.replaceWith(video);
  }

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
  const href = slide.querySelector('.con-button')?.getAttribute('href') || '';

  icon.remove();
  label?.remove();

  const card = createTag('a', { class: 'rm-card', href });
  card.replaceChildren(
    createTag('img', { class: 'rm-card-icon', src: iconSrc, loading: 'lazy' }),
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

const buildCards = (slides) => {
  const cards = createTag('div', { class: 'rm-cards' });
  slides.forEach((slide) => cards.append(buildCard(slide)));
  return cards;
};

const buildPlayPause = () => {
  const root = getFederatedContentRoot();
  return createTag('a', {
    class: 'rm-pause-play',
    role: 'button',
    tabindex: '0',
    'aria-label': 'Pause',
  }, createTag('div', { class: 'offset-filler is-playing' }, [
    createTag('img', {
      class: 'accessibility-control pause-icon',
      attributes: { 'daa-ll': 'pause--router-marq-play-btn' },
      alt: 'Pause icon',
      src: `${root}/federal/assets/svgs/accessibility-pause.svg`,
    }),
    createTag('img', {
      class: 'accessibility-control play-icon',
      attributes: { 'daa-ll': 'play--router-marq-play-btn' },
      alt: 'Play icon',
      src: `${root}/federal/assets/svgs/accessibility-play.svg`,
    }),
  ]));
};

const setBar = (bar, tx, ms, timing = 'linear') => {
  bar.style.transition = ms > 0 ? `transform ${ms}ms ${timing}` : 'none';
  bar.style.transform = `translateX(${tx})`;
};

const slideBar = (bar, from, to, ms, timing = 'linear') => {
  setBar(bar, from, 0);
  reflow(bar);
  setBar(bar, to, ms, timing);
};

const animateBgShift = (oldBg, newBg, direction) => {
  const shift = window.matchMedia('(min-width: 1280px)').matches ? BG_SHIFT_PX : 0;
  if (!shift || !oldBg || !newBg) return;

  oldBg.style.transition = `transform ${BG_FADE_MS}ms ${EASE}`;
  oldBg.style.setProperty('--slide-bg-x', `${-direction * shift}px`);

  newBg.style.transition = 'none';
  newBg.style.setProperty('--slide-bg-x', `${direction * shift}px`);
  reflow(newBg);
  newBg.style.transition = `transform ${BG_FADE_MS}ms ${EASE}`;
  newBg.style.removeProperty('--slide-bg-x');
};

const animateContentExit = (content, direction) => {
  if (!content) return;
  content.style.transition = `transform ${TEXT_EXIT_MS}ms ${EASE}, opacity ${TEXT_EXIT_MS}ms ${EASE}`;
  content.style.transform = `translateX(${-direction * TEXT_EXIT_PX}px)`;
  content.style.opacity = '0';
};

const animateContentEnter = (content, direction) => {
  if (!content) return null;
  content.style.transition = 'none';
  content.style.opacity = '0';
  content.style.transform = `translateX(${direction * TEXT_ENTER_PX}px)`;
  reflow(content);
  return setTimeout(() => {
    content.style.transition = `transform ${TEXT_ENTER_MS}ms ${EASE}, opacity ${TEXT_ENTER_MS}ms ${EASE}`;
    content.style.transform = '';
    content.style.opacity = '';
  }, TEXT_EXIT_MS + TEXT_GAP_MS);
};

const fireAnalytic = (card, type = 'auto') => {
  const viewport = card.closest('.rm-viewport');
  if (card.getAttribute('slide-seen') === 'true' || viewport.getAttribute('not-in-view') === 'true') return;

  const position = [...card.parentNode.children].indexOf(card) + 1;
  const label = card.querySelector('.rm-card-label')?.textContent;
  const analyticText = `${type}-${processTrackingLabels(label, getConfig(), 15)}-${position}`;

  document.querySelectorAll(`.rm-card:nth-child(${position})`).forEach((c) => c.setAttribute('slide-seen', true));
  // fire analytic
  console.log(`Analytic Fired: ${analyticText}`);
};

const startAutoplay = (slides, cards, container, block) => {
  const cardEls = [...cards.children];
  const bars = cardEls.map((c) => c.querySelector('.rm-card-progress-bar'));
  const playPauseBtn = container.querySelector('.rm-pause-play');
  const filler = playPauseBtn?.querySelector('.offset-filler');
  let active = 0; // index of the current active slide
  let timer = null; // timer for the autoplay
  let paused = false; // whether the autoplay is paused
  let fillAnimation = null; // animation instance for the progress bar
  let slideTimer = null; // timer for delayed text entry animation
  let cleanupTimer = null; // cleanup timer that resets temp inline styles
  let pendingSlide = null; // the slide that is currently transitioning in
  let leaveTimer = null; // timer for restarting autoplay on block mouse leave
  let hoverTimer = null; // debounce timer for card hover

  const setPlayingState = (isPlaying) => {
    filler?.classList.toggle('is-playing', isPlaying);
    playPauseBtn?.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
  };

  const stop = () => {
    clearTimeout(timer);
    if (fillAnimation) { fillAnimation.cancel(); fillAnimation = null; }
  };

  const finishSlideTransition = () => {
    clearTimeout(slideTimer);
    clearTimeout(cleanupTimer);
    clearTimeout(hoverTimer);
    slideTimer = null;
    cleanupTimer = null;
    hoverTimer = null;
    [...slides].forEach(resetSlide);
    if (pendingSlide) {
      pendingSlide.classList.add('is-active');
      pendingSlide = null;
    }
  };

  const activate = (index, direction = 1) => {
    finishSlideTransition();

    const oldSlide = slides[active];
    const newSlide = slides[index];

    oldSlide.classList.remove('is-active');
    oldSlide.style.opacity = '1';
    oldSlide.style.zIndex = '1';
    oldSlide.style.pointerEvents = 'none';
    newSlide.style.opacity = '1';
    newSlide.style.pointerEvents = 'auto';
    pendingSlide = newSlide;

    reflow(oldSlide);
    oldSlide.style.transition = `opacity ${BG_FADE_MS}ms ${EASE}`;
    oldSlide.style.opacity = '0';

    animateBgShift(
      oldSlide.querySelector('.rm-background'),
      newSlide.querySelector('.rm-background'),
      direction,
    );
    animateContentExit(oldSlide.querySelector('.rm-content'), direction);
    slideTimer = animateContentEnter(newSlide.querySelector('.rm-content'), direction);

    oldSlide.querySelector('video')?.pause();
    if (!paused) {
      const vid = newSlide.querySelector('video');
      if (vid) { vid.muted = true; vid.play().catch(() => {}); }
    }

    cleanupTimer = setTimeout(finishSlideTransition, TRANSITION_MS + 50);

    cardEls[active]?.classList.remove('is-active');
    active = index;
    cardEls[active]?.classList.add('is-active');
    if (!window.matchMedia('(min-width: 1280px)').matches) {
      const scrollTarget = cardEls[active].offsetLeft - cards.offsetLeft;
      cards.scrollTo({ left: scrollTarget, behavior: 'smooth' });
    }
  };

  const advance = () => {
    stop();
    setBar(bars[active], '101%', BG_FADE_MS, EASE);
    activate((active + 1) % cardEls.length, 1);
    fireAnalytic(cardEls[active]);
    slideBar(bars[active], '-101%', '0%', AUTOPLAY_MS);
    timer = setTimeout(advance, AUTOPLAY_MS);
  };

  const pause = () => {
    stop();
    paused = true;
    setBar(bars[active], '0%', 0);
    setPlayingState(false);
    slides[active]?.querySelector('video')?.pause();
  };

  const cancelLeaveTimer = () => {
    clearTimeout(leaveTimer);
    leaveTimer = null;
  };

  const startLeaveTimer = () => {
    if (leaveTimer) return;
    leaveTimer = setTimeout(() => {
      leaveTimer = null;
      paused = false;
      setPlayingState(true);
      advance();
    }, RESUME_DELAY);
  };

  const pauseOnInteraction = (e) => {
    const target = e.target.closest('a, button');
    if (target && !target.classList.contains('rm-pause-play')) {
      cancelLeaveTimer();
      if (!paused) pause();
    }
  };

  cardEls.forEach((card, i) => {
    card.addEventListener('mouseenter', () => {
      cancelLeaveTimer();
      clearTimeout(hoverTimer);
      if (i === active) { pause(); return; }
      hoverTimer = setTimeout(() => {
        hoverTimer = null;
        stop();
        paused = true;
        const dir = i > active ? 1 : -1;
        setBar(bars[active], `${dir * 101}%`, BG_FADE_MS, EASE);
        activate(i, dir);
        fireAnalytic(cardEls[i], 'user');
        slideBar(bars[i], `${-dir * 101}%`, '0%', BG_FADE_MS, EASE);
      }, HOVER_DELAY_MS);
    });
  });

  container.addEventListener('mouseover', pauseOnInteraction);
  container.addEventListener('focusin', pauseOnInteraction);
  block.addEventListener('mouseenter', cancelLeaveTimer);

  block.addEventListener('mouseleave', () => {
    clearTimeout(hoverTimer);
    hoverTimer = null;
    if (paused) startLeaveTimer();
  });

  playPauseBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    clearTimeout(hoverTimer);
    hoverTimer = null;
    cancelLeaveTimer();
    if (paused) {
      paused = false;
      setPlayingState(true);
      advance();
    } else {
      pause();
    }
  });

  // mobile swipe
  let touchStartX = 0;
  let touchStartY = 0;
  let touchOnContent = false;

  container.addEventListener('touchstart', (e) => {
    touchOnContent = !!e.target.closest('.rm-content');
    if (touchOnContent) return;
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    if (touchOnContent) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dy) > Math.abs(dx)) return;

    stop();
    const dir = dx < 0 ? 1 : -1;
    const next = (active + dir + cardEls.length) % cardEls.length;
    setBar(bars[active], `${dir * 101}%`, BG_FADE_MS, EASE);
    activate(next, dir);
    fireAnalytic(cardEls[active], 'user');
    slideBar(bars[next], `${-dir * 101}%`, '0%', BG_FADE_MS, EASE);
    paused = true;
    setPlayingState(false);
  }, { passive: true });

  const bar = bars[active];
  setBar(bar, '-101%', 0);
  reflow(bar);
  fillAnimation = bar.animate(
    [{ transform: 'translateX(-101%)' }, { transform: 'translateX(0%)' }],
    { duration: AUTOPLAY_MS, fill: 'forwards', easing: 'linear' },
  );
  fillAnimation.finished.then(() => {
    fillAnimation?.cancel();
    fillAnimation = null;
    advance();
  }).catch(() => { fillAnimation = null; });

  return { pause };
};

const buildViewport = (viewport, slides) => {
  const container = createTag('div', { class: 'rm-viewport', 'data-viewport': viewport });
  slides.forEach((slide) => decorateSlide(slide));
  slides[0]?.classList.add('is-active');
  const cards = buildCards(slides);
  cards.children[0]?.classList.add('is-active');
  const controls = createTag('div', { class: 'rm-controls' });
  controls.append(buildPlayPause(), cards);
  container.append(...slides, controls);
  return container;
};

const initVideos = (el) => {
  el.querySelectorAll('.rm-background video').forEach((v) => {
    v.muted = true;
    v.play().catch(() => {});
  });
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

const setSlideObserver = (container) => {
  const callback = (el) => {
    const card = el.parentNode.querySelector('.rm-card.is-active');
    fireAnalytic(card);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
        entry.target.removeAttribute('not-in-view');
        callback(entry.target);
      } else {
        entry.target.setAttribute('not-in-view', true);
      }
    });
  });

  io.observe(container);
};

const setCardAnalytics = (cards) => {
  cards.querySelectorAll('.rm-card').forEach((el, index) => {
    const config = getConfig();
    const label = el.querySelector('.rm-card-label')?.textContent;
    const analyticText = `${processTrackingLabels(label, config, 20)}-${index + 1}--rm nav`;
    el.setAttribute('daa-ll', analyticText);
  });
};

export default function init(el) {
  const viewports = groupByViewport(el);
  reorderSlidesMaybe(el, viewports);
  const containers = Object.entries(viewports).map(([vp, slides]) => buildViewport(vp, slides));
  el.replaceChildren(...containers);
  initVideos(el);
  containers.forEach((container) => {
    const slides = container.querySelectorAll('.rm-slide');
    const cards = container.querySelector('.rm-cards');
    setSlideObserver(container);
    setCardAnalytics(cards);
    startAutoplay(slides, cards, container, el);
  });
}
