import { createTag, getFederatedUrl, getFederatedContentRoot } from '../../../utils/utils.js';

const CHEVRON_SVG = '<svg width="5" height="8" viewBox="0 0 5 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.75 6.75L3.75 3.75L0.75 0.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const BREAKPOINTS = ['mobile', 'tablet', 'desktop'];
const AUTOPLAY_MS = 15000;
const TRANSITION_MS = 500;
const ENTER_MS = 300;
const SLIDE_SHIFT = 100;
const RESUME_DELAY = 2000;

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

  return viewports;
};

const decorateText = (textCol) => {
  const heading = textCol.querySelector('h1, h2');
  heading?.classList.add('rm-title');
  heading?.previousElementSibling?.classList.add('rm-eyebrow');

  const eyebrow = textCol.querySelector('.rm-eyebrow');
  const iconP = textCol.querySelector('p a[href*=".svg"]');
  const labelP = iconP?.parentElement?.querySelector(
    ':scope > p:has(a[href*=".svg"]) + p',
  );
  const bodyPs = [...textCol.querySelectorAll('p')]
    .filter((p) => !p.querySelector('a')
    && [eyebrow, iconP, labelP].every((el) => el !== p));

  const body = createTag('div', { class: 'rm-body' });
  bodyPs[0].before(body);
  bodyPs.forEach((p) => body.append(p));
};

const decorateCtas = (textCol) => {
  const ctaP = textCol.querySelector('p:has(em)');
  if (!ctaP) return;
  ctaP.classList.add('rm-ctas');
  const primary = ctaP.querySelector('em > strong a');
  const secondary = ctaP.querySelector('em > a');
  primary?.classList.add('con-button', 'rm-cta-primary');
  secondary?.classList.add('con-button');
  ctaP.replaceChildren(...[primary, secondary].filter(Boolean));
};

const decorateSlide = (slide) => {
  const [textCol, imageCol] = slide.querySelectorAll(':scope > div');

  slide.classList.add('rm-slide');
  imageCol?.classList.add('rm-background');
  textCol?.classList.add('rm-content');
  slide.insertBefore(createTag('div', { class: 'rm-overlay' }), textCol);

  const milo = imageCol?.querySelector('.milo-video');
  const iframe = milo?.querySelector('iframe');
  if (iframe?.src?.includes('.mp4')) {
    const video = createTag('video', { playsinline: '', autoplay: '', muted: '', loop: '' });
    video.appendChild(createTag('source', { src: iframe.src, type: 'video/mp4' }));
    milo.replaceWith(video);
  }

  if (!textCol) return;
  decorateText(textCol);
  decorateCtas(textCol);
};

const buildCard = (slide) => {
  const iconP = [...slide.querySelectorAll('p')]
    .find((p) => p.querySelector('img[src*=".svg"]'));

  const labelP = iconP.nextElementSibling;
  const iconImg = iconP.querySelector('img[src*=".svg"]');
  const iconHref = getFederatedUrl(iconImg?.getAttribute('src'));
  const label = labelP?.textContent.trim();
  const primaryHref = slide.querySelector('.con-button')?.getAttribute('href') || '';

  iconP.remove();
  labelP?.remove();

  const card = createTag('a', {
    class: 'rm-card',
    href: primaryHref,
  });
  card.replaceChildren(
    createTag('img', {
      class: 'rm-card-icon',
      src: getFederatedUrl(iconHref),
      loading: 'lazy',
    }),
    createTag('div', { class: 'rm-card-content' }, [
      createTag('span', { class: 'rm-card-label' }, label),
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
  slides.forEach((slide) => {
    const card = buildCard(slide);
    if (card) cards.append(card);
  });
  return cards;
};

const buildPlayPause = () => {
  const root = getFederatedContentRoot();
  return createTag('a', {
    class: 'rm-pause-play pause-play-wrapper',
    role: 'button',
    tabindex: '0',
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

const reflow = (el) => el?.getBoundingClientRect();

const setBar = (bar, tx, ms, timing = 'linear') => {
  bar.style.transition = ms > 0 ? `transform ${ms}ms ${timing}` : 'none';
  bar.style.transform = `translateX(${tx})`;
};

const slideBar = (bar, from, to, ms, timing = 'linear') => {
  setBar(bar, from, 0);
  reflow(bar);
  setBar(bar, to, ms, timing);
};

const startAutoplay = (slides, cards, container, block) => {
  const cardEls = [...cards.children];
  const bars = cardEls.map((c) => c.querySelector('.rm-card-progress-bar'));
  const playPauseBtn = container.querySelector('.rm-pause-play');
  const filler = playPauseBtn?.querySelector('.offset-filler');
  let active = 0;
  let timer = null;
  let paused = false;
  let userPaused = false;
  let fillAnimation = null;
  let slideTimer = null;
  let slideTimer2 = null;
  let pendingSlide = null;
  let leaveTimer = null;

  const setPlayingState = (isPlaying) => {
    filler?.classList.toggle('is-playing', isPlaying);
    playPauseBtn?.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
  };

  const pauseActiveVideo = () => {
    slides[active]?.querySelector('video')?.pause();
  };

  const stop = () => {
    clearTimeout(timer);
    if (fillAnimation) { fillAnimation.cancel(); fillAnimation = null; }
  };

  const finishSlideTransition = () => {
    clearTimeout(slideTimer);
    clearTimeout(slideTimer2);
    slideTimer = null;
    slideTimer2 = null;
    [...slides].forEach((s) => {
      s.style.opacity = '';
      s.style.zIndex = '';
      s.style.transform = '';
      s.style.transition = '';
    });
    if (pendingSlide) {
      pendingSlide.classList.add('is-active');
      pendingSlide = null;
    }
  };

  const activate = (index, direction = 1) => {
    finishSlideTransition();

    const oldSlide = slides[active];
    const newSlide = slides[index];

    oldSlide.style.opacity = '1';
    oldSlide.style.zIndex = '1';
    oldSlide.style.transform = `translateX(${-direction * SLIDE_SHIFT}px)`;
    oldSlide.classList.remove('is-active');

    pendingSlide = newSlide;
    slideTimer = setTimeout(() => {
      oldSlide.style.opacity = '';
      oldSlide.style.zIndex = '';
      oldSlide.style.transform = '';
      oldSlide.querySelector('video')?.pause();

      newSlide.style.transition = 'none';
      newSlide.style.transform = `translateX(${direction * SLIDE_SHIFT}px)`;
      newSlide.classList.add('is-active');
      reflow(newSlide);
      newSlide.style.transition = `transform ${ENTER_MS}ms ease-out`;
      newSlide.style.transform = '';

      // This might need to be removed after I get feedback from design on
      // whether the video should autoplay on hover or not
      if (!userPaused && !paused) {
        const vid = newSlide.querySelector('video');
        if (vid) { vid.muted = true; vid.play().catch(() => {}); }
      }

      slideTimer2 = setTimeout(() => {
        pendingSlide = null;
        slideTimer = null;
        slideTimer2 = null;
      }, ENTER_MS);
    }, TRANSITION_MS);

    cardEls[active]?.classList.remove('is-active');
    active = index;
    cardEls[active]?.classList.add('is-active');
  };

  const advance = () => {
    stop();
    setBar(bars[active], '101%', TRANSITION_MS, 'ease-out');
    activate((active + 1) % cardEls.length, 1);
    slideBar(bars[active], '-101%', '0%', AUTOPLAY_MS);
    timer = setTimeout(advance, AUTOPLAY_MS);
  };

  const pause = () => {
    stop();
    paused = true;
    setBar(bars[active], '0%', 0);
    setPlayingState(false);
    pauseActiveVideo();
  };

  const cancelLeaveTimer = () => {
    clearTimeout(leaveTimer);
    leaveTimer = null;
  };

  const startLeaveTimer = () => {
    if (leaveTimer) return;
    leaveTimer = setTimeout(() => {
      leaveTimer = null;
      if (!userPaused && paused) {
        paused = false;
        setPlayingState(true);
        advance();
      }
    }, RESUME_DELAY);
  };

  cardEls.forEach((card, i) => {
    card.addEventListener('mouseenter', () => {
      cancelLeaveTimer();
      if (i === active) { pause(); return; }
      stop();
      paused = true;
      const dir = i > active ? 1 : -1;
      setBar(bars[active], `${dir * 101}%`, TRANSITION_MS, 'ease-out');
      activate(i, dir);
      slideBar(bars[i], `${-dir * 101}%`, '0%', TRANSITION_MS, 'ease-out');
    });
  });

  container.addEventListener('mouseover', (e) => {
    if (userPaused) return;
    const interactive = e.target.closest('a, button');
    if (interactive && !interactive.classList.contains('rm-pause-play')) {
      cancelLeaveTimer();
      if (!paused) pause();
    }
  });

  block.addEventListener('mouseenter', cancelLeaveTimer);

  block.addEventListener('mouseleave', () => {
    if (userPaused) return;
    if (paused) startLeaveTimer();
  });

  container.addEventListener('focusin', (e) => {
    if (userPaused) return;
    const interactive = e.target.closest('a, button');
    if (interactive && !interactive.classList.contains('rm-pause-play')) {
      cancelLeaveTimer();
      if (!paused) pause();
    }
  });

  playPauseBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (paused) {
      userPaused = false;
      cancelLeaveTimer();
      paused = false;
      setPlayingState(true);
      advance();
    } else {
      userPaused = true;
      cancelLeaveTimer();
      pause();
    }
  });

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
  container.append(...slides, cards, buildPlayPause());
  return container;
};

export default function init(el) {
  const viewports = groupByViewport(el);
  const containers = Object.entries(viewports).map(([vp, slides]) => buildViewport(vp, slides));
  el.replaceChildren(...containers);
  el.querySelectorAll('.rm-background video').forEach((v) => {
    v.muted = true;
    v.play().catch(() => {});
  });
  containers.forEach((container) => {
    const slides = container.querySelectorAll('.rm-slide');
    const cards = container.querySelector('.rm-cards');
    if (slides.length && cards) startAutoplay(slides, cards, container, el);
  });
}
