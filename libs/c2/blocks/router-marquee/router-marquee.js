import { processTrackingLabels, sendAnalytics } from '../../../martech/attributes.js';
import { createTag, getFederatedUrl, getFederatedContentRoot, getConfig } from '../../../utils/utils.js';
import { getMetadata } from '../section-metadata/section-metadata.js';

const CHEVRON_SVG = '<svg width="5" height="8" viewBox="0 0 5 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.75 6.75L3.75 3.75L0.75 0.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const BREAKPOINTS = ['mobile', 'tablet', 'desktop'];
const AUTOPLAY_MS = 15000;
const TEXT_ENTER_MS = 380;
const BG_SHIFT_MS = 650;
const BG_SHIFT_PX = 90;
const STAGGER_MS = 30;
const STAGGER_PX = 60;
const HOVER_DELAY_MS = 200;
const EASE = 'cubic-bezier(0.42, 0, 0, 1)';
const RESUME_DELAY = 2000;
const SWIPE_THRESHOLD = 100;

const reflow = (el) => el?.getBoundingClientRect();

const clearInlineStyles = (el, props) => {
  if (!el) return;
  props.forEach((p) => { el.style[p] = ''; });
};

const STAGGER_CHILDREN = ['.rm-eyebrow', '.rm-title', '.rm-body', '.rm-ctas'];

const resetSlide = (slide) => {
  clearInlineStyles(slide, ['zIndex', 'pointerEvents']);
  const content = slide.querySelector('.rm-content');
  clearInlineStyles(content, ['transform', 'transition']);
  STAGGER_CHILDREN.forEach((sel) => {
    clearInlineStyles(content?.querySelector(sel), ['transform', 'transition']);
  });
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

const animateBgShift = (oldBg, newBg, direction) => {
  const shift = window.matchMedia('(min-width: 1280px)').matches ? BG_SHIFT_PX : 0;
  if (!shift || !oldBg || !newBg) return;

  oldBg.style.transition = `transform ${BG_SHIFT_MS}ms ${EASE}`;
  oldBg.style.setProperty('--slide-bg-x', `${-direction * shift}px`);

  newBg.style.transition = 'none';
  newBg.style.setProperty('--slide-bg-x', `${direction * shift}px`);
  reflow(newBg);
  newBg.style.transition = `transform ${BG_SHIFT_MS}ms ${EASE}`;
  newBg.style.removeProperty('--slide-bg-x');
};

const animateContentEnter = (content, direction) => {
  if (!content) return;
  const targets = STAGGER_CHILDREN
    .map((sel) => content.querySelector(sel))
    .filter(Boolean);
  targets.forEach((el) => {
    el.style.transition = 'none';
    el.style.transform = `translateX(${direction * STAGGER_PX}px)`;
  });
  reflow(content);
  targets.forEach((el, i) => {
    const delay = i * STAGGER_MS;
    el.style.transition = `transform ${TEXT_ENTER_MS}ms ${EASE} ${delay}ms`;
    el.style.transform = '';
  });
};

const fireAnalytic = (card, type = 'auto') => {
  const viewport = card.closest('.rm-viewport');
  if (card.getAttribute('slide-seen') === 'true' || viewport.getAttribute('not-in-view') === 'true') return;

  const position = [...card.parentNode.children].indexOf(card) + 1;
  const label = card.querySelector('.rm-card-label')?.textContent;
  const analyticText = `${type}-${processTrackingLabels(label, getConfig(), 15)}-${position}`;

  document.querySelectorAll(`.rm-card:nth-child(${position})`).forEach((c) => c.setAttribute('slide-seen', true));
  // fire analytic
  sendAnalytics(analyticText);
};

const startAutoplay = (slides, cards, container, block) => {
  const cardEls = [...cards.children];
  const bars = cardEls.map((c) => c.querySelector('.rm-card-progress-bar'));
  const playPauseBtn = container.querySelector('.rm-pause-play');
  const filler = playPauseBtn?.querySelector('.offset-filler');
  let active = 0; // index of the current active slide
  let timer = null; // timer for the autoplay
  let paused = false; // whether the autoplay is paused
  let videoPaused = false; // whether the user has paused video via the button
  let cleanupTimer = null; // cleanup timer that resets temp inline styles
  let pendingSlide = null; // the slide that is currently transitioning in
  let leaveTimer = null; // timer for restarting autoplay on block mouse leave
  let hoverTimer = null; // debounce timer for card hover

  const setPlayingState = (isPlaying) => {
    filler?.classList.toggle('is-playing', isPlaying);
    playPauseBtn?.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
  };

  const clearFill = (i) => {
    const bar = bars[i];
    bar.style.transition = 'none';
    bar.style.transform = 'translateX(-101%)';
  };

  const startFill = (i) => {
    const bar = bars[i];
    bar.style.transition = 'none';
    bar.style.transform = 'translateX(-101%)';
    reflow(bar);
    bar.style.transition = `transform ${AUTOPLAY_MS}ms linear`;
    bar.style.transform = 'translateX(0%)';
  };

  const finishSlideTransition = () => {
    clearTimeout(cleanupTimer);
    clearTimeout(hoverTimer);
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
    oldSlide.style.zIndex = '1';
    oldSlide.style.pointerEvents = 'none';
    newSlide.style.pointerEvents = 'auto';
    newSlide.classList.add('is-active');
    pendingSlide = null;

    animateBgShift(
      oldSlide.querySelector('.rm-background'),
      newSlide.querySelector('.rm-background'),
      direction,
    );
    animateContentEnter(newSlide.querySelector('.rm-content'), direction);

    oldSlide.querySelector('video')?.pause();
    if (!videoPaused) {
      const vid = newSlide.querySelector('video');
      if (vid) { vid.muted = true; vid.play().catch(() => {}); }
    }

    const transitionMs = Math.max(
      BG_SHIFT_MS,
      3 * STAGGER_MS + TEXT_ENTER_MS,
    );
    cleanupTimer = setTimeout(finishSlideTransition, transitionMs + 50);

    playPauseBtn?.classList.toggle('is-hidden', !newSlide.querySelector('video'));

    cardEls[active]?.classList.remove('is-active');
    active = index;
    cardEls[active]?.classList.add('is-active');
    if (!window.matchMedia('(min-width: 1280px)').matches) {
      const scrollTarget = cardEls[active].offsetLeft - cards.offsetLeft;
      cards.scrollTo({ left: scrollTarget, behavior: 'smooth' });
    }
  };

  const advance = () => {
    clearTimeout(timer);
    clearFill(active);
    activate((active + 1) % cardEls.length, 1);
    fireAnalytic(cardEls[active]);
    startFill(active);
    timer = setTimeout(advance, AUTOPLAY_MS);
  };

  const pause = () => {
    clearTimeout(timer);
    clearFill(active);
    paused = true;
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
      advance();
    }, RESUME_DELAY);
  };

  const pauseOnInteraction = (e) => {
    const target = e.target.closest('a, button');
    if (target) {
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
        clearTimeout(timer);
        clearFill(active);
        paused = true;
        const dir = i > active ? 1 : -1;
        activate(i, dir);
        fireAnalytic(cardEls[i], 'user');
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
    videoPaused = !videoPaused;
    setPlayingState(!videoPaused);
    const vid = slides[active]?.querySelector('video');
    if (videoPaused) {
      vid?.pause();
    } else if (vid) {
      vid.muted = true;
      vid.play().catch(() => {});
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

    clearTimeout(timer);
    clearFill(active);
    const dir = dx < 0 ? 1 : -1;
    const next = (active + dir + cardEls.length) % cardEls.length;
    activate(next, dir);
    fireAnalytic(cardEls[active], 'user');
    paused = true;
  }, { passive: true });

  if (!slides[active]?.querySelector('video')) playPauseBtn?.classList.add('is-hidden');

  requestAnimationFrame(() => {
    startFill(active);
    timer = setTimeout(advance, AUTOPLAY_MS);
  });
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
