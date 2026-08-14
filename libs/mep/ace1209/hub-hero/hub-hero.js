import { decorateBlockText } from '../../../utils/decorate.js';
import { createTag, getFederatedUrl } from '../../../utils/utils.js';
import { sendAnalytics } from '../../../martech/helpers.js';
import { processTrackingLabels } from '../../../martech/attributes.js';
import icons from '../../../c2/assets/icons.js';

const leaveTimeouts = new WeakMap();
let hoverTracked = false;
const rewindIntervals = new WeakMap();
const slideLeaveTimeouts = new WeakMap();

const isSvgUrl = (url) => /\.svg(\?.*)?$/i.test(url || '');
const isRtl = () => document.documentElement.getAttribute('dir') === 'rtl';
// 768px is this block's own breakpoint: hub-hero.css switches on `(width < 768px)` /
// `(width >= 768px)`. `(min-width: 768px)` therefore matched DESKTOP, so a predicate named
// `isMobile` was true on desktop and false on mobile.
const isMobile = () => window.matchMedia('(max-width: 767px)').matches;

const getCarouselName = (link) => link?.innerText?.split('|')?.[1]?.trim() || 'Adobe slides';

// Every `play()` in this block used to end in `.catch(() => { })`. A rejection here is
// usually routine — an AbortError when a competing pause()/rewind interrupts the play(), or a
// NotAllowedError from the autoplay policy — but swallowing it silently is exactly why a video
// that could never play at all (no `<source>`, so NETWORK_EMPTY) presented as intermittent
// rather than broken. Log it instead; `info`, because it is observable-not-actionable.
const playVideo = (video) => {
  video?.play().catch((error) => {
    window.lana?.log(`hub-hero: video play rejected: ${error?.name}: ${error?.message}`, { tags: 'hub-hero', severity: 'info' });
  });
};

// ── The carousel owns its own videos ────────────────────────────────────────
//
// `decorateAnchorVideo` registers every `#viewportplay` video with Milo's SHARED observer
// (`applyInViewPortPlay`, libs/utils/decorate.js:468), which plays above
// `intersectionRatio > 0.8` and pauses at `<= 0.8`. That is a sound default for a video
// sitting still in a page, but this block RESIZES its slides on hover
// (`.hub-hero-carousel-item.hovered { width: 150% }`, hub-hero.css:922), which shrinks every
// sibling — and resizing an observed element changes its intersectionRatio. So hovering ANY
// card drove the video in a card the pointer never touched. MEASURED on the real page:
//
//   hover the NEIGHBOURING card  -> decorate.js:459 play()   the video starts
//   hover the video's OWN card   -> decorate.js:457 pause()  the video stops
//
// which is exactly backwards, and it is why hovering across the cards behaved differently
// from hovering the video and then leaving the whole set.
//
// Release the video from that shared observer so `setVideoState` is the only thing that
// starts or stops it. The viewport axis is not lost: `handleMobileAutoplay` covers it on
// mobile, which is where `#viewportplay` autoplay is wanted. The SEPARATE per-video observer
// that lazily attaches the `<source>` (decorate.js:583) is deliberately left alone — that one
// is load-bearing, and unobserving it would put the block straight back to a video with
// nothing to play.
const releaseSharedViewportPlay = (video) => {
  if (!video) return;
  window.videoIntersectionObs?.unobserve(video);
};

const stopRewind = (video) => {
  clearInterval(rewindIntervals.get(video));
  rewindIntervals.delete(video);
};

const rewindVideo = (video) => {
  stopRewind(video);
  video.pause();
  const startVideoTime = video.currentTime;
  // Already at the start: there is nothing to rewind, and arming an interval here is how the
  // old code leaked one — its only exit test was `video.currentTime === 0`, which on an
  // unplayed video was already true on the first tick and called `video.load()` for nothing.
  if (!(startVideoTime > 0)) return;
  const startSystemTime = Date.now();
  const intervalRewind = setInterval(() => {
    const target = startVideoTime - (Date.now() - startSystemTime) / 1000;
    // Terminate on the COMPUTED target, never on a read-back of `currentTime`. The element
    // snaps `currentTime` to a seekable position, so `=== 0` is not guaranteed to ever hold
    // and the interval could run forever — one leaked timer per video per rewind. Also no
    // `video.load()` on completion: that resets the element to NETWORK_EMPTY and aborts any
    // `play()` already in flight.
    if (target <= 0) {
      video.currentTime = 0;
      stopRewind(video);
      return;
    }
    video.currentTime = target;
  }, 30);
  rewindIntervals.set(video, intervalRewind);
};

// ── ONE owner for "should this video be running?" ────────────────────────────
//
// Four handlers used to drive the same `<video>` with no arbitration between them: the
// mobile slideObserver played it, the nextSlideObserver rewound or played it, mouseenter/
// focus played it, and mouseleave rewound it 100ms later. Whichever fired last won, so a
// rewind could land on top of a hover-play and vice versa. Now every one of them reports a
// FACT about its own axis and this function is the only place that decides.
//
// Note there is a fifth owner outside this file: `applyInViewPortPlay` in
// libs/utils/decorate.js observes any `data-play-viewport` video with a shared global
// IntersectionObserver and plays/pauses it at a 0.8 ratio. That one is Milo's, it is not
// ours to arbitrate, and it only becomes reachable at all now that the carousel keeps the
// original video node instead of a re-parsed clone.
const videoStates = new WeakMap();

const setVideoState = (video, patch) => {
  if (!video) return;
  const state = videoStates.get(video) ?? { hovered: false, focused: false, inView: false };
  Object.assign(state, patch);
  videoStates.set(video, state);

  clearTimeout(slideLeaveTimeouts.get(video));
  slideLeaveTimeouts.delete(video);

  if (state.hovered || state.focused || state.inView) {
    stopRewind(video);
    // Guarded: re-calling play() on an already-playing element is harmless but manufactures
    // AbortError noise in the log we just started keeping.
    if (video.paused) playVideo(video);
    return;
  }
  // Debounced, as the mouseleave path always was — it coalesces observer chatter and stops a
  // one-pixel pointer wobble from restarting the video.
  slideLeaveTimeouts.set(video, setTimeout(() => rewindVideo(video), 100));
};

const handleMobileAutoplay = (carousel) => {
  const slides = [...carousel.querySelectorAll('.hub-hero-carousel-item')];
  const observers = [];

  slides.forEach((slide, index) => {
    const video = slide.querySelector('video');
    if (!video) return;

    const nextSlide = slides[index + 1];

    // Play when this slide enters view — but not if the next slide is already covering it.
    // `nextRect` is undefined-safe on the last slide, which by definition cannot be covered.
    const slideObserver = new IntersectionObserver(
      ([entry]) => {
        if (!isMobile()) return;
        const nextRect = nextSlide?.getBoundingClientRect();
        const isCovered = nextRect && nextRect.top < window.innerHeight * 0.7;
        setVideoState(video, { inView: entry.isIntersecting && !isCovered });
      },
      { threshold: 0.6 },
    );
    slideObserver.observe(slide);
    observers.push(slideObserver);

    // Only the "next slide covers this one" observer actually needs a next slide. This guard
    // used to sit above, and skipped the LAST slide entirely — including its play observer.
    if (!nextSlide) return;

    // Rewind when the next slide starts covering this one;
    // play again when it uncovers (user scrolls back up)
    const nextSlideObserver = new IntersectionObserver(
      ([entry]) => {
        if (!isMobile()) return;
        if (entry.isIntersecting) {
          setVideoState(video, { inView: false });
          return;
        }
        const rect = slide.getBoundingClientRect();
        setVideoState(video, { inView: rect.top >= 0 && rect.top <= window.innerHeight });
      },
      { threshold: 0.6 },
    );
    nextSlideObserver.observe(nextSlide);
    observers.push(nextSlideObserver);
  });

  return observers;
};

const scrollHubHeroTo = (el, progress) => {
  // double-rAF: runs after VoiceOver's async focus-scroll settles,
  // preventing it from cancelling our scroll on backward keyboard nav
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const hubHero = el.closest('.hub-hero');
      if (!hubHero) return;
      const totalScrollRange = hubHero.offsetHeight - window.innerHeight;
      if (totalScrollRange <= 0) return;
      const hubHeroAbsTop = window.scrollY + hubHero.getBoundingClientRect().top;
      const targetScrollY = hubHeroAbsTop + totalScrollRange * progress;
      window.scrollTo({ top: targetScrollY, behavior: 'instant' });
    });
  });
};

const onSlideLeave = (event) => {
  setVideoState(event?.target?.querySelector('video'), { hovered: false });
};

// The keyboard counterpart of `mouseleave`. Without it a slide entered by Tab kept playing
// and kept its class after focus moved on: `focus` was wired up on its own, and nothing
// else in this block listens for `blur` or `focusout`.
const onSlideBlur = (event) => {
  event.target?.classList?.remove('focused');
  setVideoState(event.target?.querySelector('video'), { focused: false });
};

// `onHover` writes `isFocus ? 'focused' : 'hovered'`, so clearing only 'hovered' left
// '.focused' permanently set — and Chrome focuses an `<a tabindex="0">` on mousedown, so a
// single click pinned it forever.
const removeHovered = (carousel) => {
  const slides = carousel?.querySelectorAll('.hub-hero-carousel-item');
  [...slides]?.forEach((sld) => sld.classList.remove('hovered', 'focused'));
};

const onCarouselLeave = (event) => {
  const carouselContainer = event.target;
  clearTimeout(leaveTimeouts.get(carouselContainer));
  leaveTimeouts.set(carouselContainer, setTimeout(() => {
    carouselContainer.classList.remove('stick-left', 'stick-right');
    removeHovered(carouselContainer.closest('.hub-hero-carousel'));
  }, 10));
};

const onHover = (event) => {
  const isFocus = event.type === 'focus';
  const slideEl = event.target;
  if (isFocus) scrollHubHeroTo(slideEl, 0.6);
  const carouselContainer = slideEl.closest('.hub-hero-carousel-container');
  if (!carouselContainer) return;
  clearTimeout(leaveTimeouts.get(carouselContainer));

  // Only KEYBOARD focus counts as an activation axis. Chrome focuses an `<a tabindex="0">` on
  // mousedown, so a plain `focus` test would latch `focused: true` on click and keep that
  // slide's video playing after the pointer moved to another one — while the CSS, which keys
  // off `:focus-visible` (hub-hero.css:923), showed nothing expanded. `:focus-visible` is the
  // pattern `decorateHubHeroCTA` already uses in this file.
  const isKeyboardFocus = isFocus && slideEl.matches(':focus-visible');
  setVideoState(slideEl.querySelector('video'), isKeyboardFocus ? { focused: true } : { hovered: true });

  const slideIndex = slideEl.dataset.index * 1;
  const container = slideEl.parentElement;
  if (!container) return;

  removeHovered(slideEl.closest('.hub-hero-carousel'));
  slideEl.classList.add(isFocus ? 'focused' : 'hovered');

  const rtl = isRtl();
  const maxIndex = slideEl.closest('.hub-hero')?.classList.contains('slides-3') ? 3 : 5;
  container.classList.toggle('stick-left', rtl ? slideIndex === maxIndex : slideIndex === 1);
  container.classList.toggle('stick-right', rtl ? slideIndex === 1 : slideIndex === maxIndex);

  if (hoverTracked) return;

  hoverTracked = true;
  const block = slideEl.closest('[daa-lh]');
  const blockName = block?.getAttribute('daa-lh');
  const section = block?.parentElement?.closest('[daa-lh]');
  const sectionName = section?.getAttribute('daa-lh');
  sendAnalytics(`user-hover|${sectionName}|${blockName}`);
};

const buildSlide = ({ slide, index, slidesTotal }) => {
  if (!slide?.children) return createTag('a', { class: 'hub-hero-carousel-item' });
  const children = [...slide.children];
  const left = children[0];
  const right = children[1] ?? children[0];

  const [eyebrow, heading] = left.children;
  const asset = right.children[0];
  const icon = right.children[1];
  const link = left.lastElementChild?.querySelector('a');

  // `asset` is the authored WRAPPER, not the media element: for a video cell the authored
  // markup is `<p><video data-video-source=...></video></p>`, so `asset.dataset.videoSource`
  // is undefined and this block never used to run at all.
  const video = asset?.matches?.('video') ? asset : asset?.querySelector?.('video');
  if (video?.dataset.videoSource) {
    releaseSharedViewportPlay(video);
    video.setAttribute('preload', 'none');
    if (!video.querySelector('source')) {
      video.appendChild(createTag('source', { src: video.dataset.videoSource, type: 'video/mp4' }));
    }
    video.setAttribute('muted', true);
    video.setAttribute('tabindex', '-1');
    video.removeAttribute('controls');
  }

  if (isSvgUrl(asset?.src)) asset.src = getFederatedUrl(asset.src);

  decorateBlockText(left);

  const content = `
    <div class='hub-hero-carousel-item-container' id='hub-hero-carousel-slide-${index + 1}'>
      <div class='hub-hero-carousel-item-header'>
        ${eyebrow?.outerHTML}
      </div>
      <div class='hub-hero-carousel-item-media'></div>
      <div class='hub-hero-carousel-item-footer'>
        ${heading?.outerHTML}
        <span aria-hidden='true'>${icons?.add}</span>
      </div>
    </div>
  `;

  let ariaLabel = `${index + 1} of ${slidesTotal}`;
  // assign unique aria-label to the first slide
  if (index === 0) ariaLabel = `${getCarouselName(link)}, carousel. ${ariaLabel}`;

  const slideEl = createTag('a', {
    class: 'hub-hero-carousel-item',
    tabindex: 0,
    href: link?.href,
    'data-index': index + 1,
    role: 'link',
    // Unconditional, not viewport-gated. `buildSlide` runs once at init, so any
    // viewport-dependent ARIA here is sampled once and goes stale on the first
    // resize/rotate; and the block presents itself as a carousel at every width — its
    // sibling `aria-describedby` below was already unconditional.
    'aria-roledescription': 'slide',
    'aria-label': ariaLabel,
    'aria-describedby': `hub-hero-carousel-slide-${index + 1}`,
    'daa-ll': `${processTrackingLabels(heading?.textContent)}-${index + 1}--${processTrackingLabels(heading?.textContent)}`,
  }, content);

  // MOVE the real asset/icon nodes in instead of re-parsing `${asset.outerHTML}`. Serialising
  // an element to a string and re-parsing it mints a NEW element, which silently drops every
  // JS-side association Milo already made on the original — including the lazy `<source>`
  // IntersectionObserver `decorateAnchorVideo` registers (utils/decorate.js), which is the only
  // thing that ever gives a `#viewportplay` video something to play.
  slideEl.querySelector('.hub-hero-carousel-item-media')?.append(...[asset, icon].filter(Boolean));

  if (link?.dataset?.modalHash) slideEl.dataset.modalHash = link.dataset.modalHash;
  if (link?.dataset?.modalPath) slideEl.dataset.modalPath = link.dataset.modalPath;

  slideEl.addEventListener('mouseleave', onSlideLeave);
  slideEl.addEventListener('mouseenter', onHover);
  slideEl.addEventListener('focus', onHover);
  slideEl.addEventListener('blur', onSlideBlur);
  return slideEl;
};

const decorateCarousel = (slides) => {
  const carousel = createTag('div', { class: 'hub-hero-carousel' }, slides);
  if (isRtl()) slides.reverse();
  const decoratedSlides = slides.map((slide, index) => buildSlide(
    { slide, index, slidesTotal: slides.length },
  ));
  const carouselContainer = createTag('div', { class: 'hub-hero-carousel-container' });
  carouselContainer.append(...decoratedSlides);
  carousel.replaceChildren();
  carousel.append(carouselContainer);
  carousel.dataset.role = 'group';
  carousel.dataset.ariaRoledescription = 'carousel';
  carousel.dataset.ariaLabel = getCarouselName(slides[0]?.querySelector('a'));
  carousel.dataset.ariaRole = 'group';
  return carousel;
};

const upgradeVideoPreload = (carousel) => {
  const videos = [...carousel.querySelectorAll('video')];
  if (!videos.length) return;
  const controller = new AbortController();
  const upgrade = () => {
    videos.forEach((video) => { video.preload = 'metadata'; });
    controller.abort();
  };
  ['scroll', 'mousemove', 'touchstart', 'keydown'].forEach((event) => {
    window.addEventListener(event, upgrade, { signal: controller.signal, once: true });
  });
};

const handleCarousel = (slds, isThreeSlides) => {
  const slides = isThreeSlides ? slds : [...slds.slice(0, 2), {}, ...slds.slice(2)];
  const decoratedCarousel = decorateCarousel(slides);
  upgradeVideoPreload(decoratedCarousel);
  decoratedCarousel.querySelector('.hub-hero-carousel-container')?.addEventListener('mouseleave', onCarouselLeave);
  const mobileObservers = handleMobileAutoplay(decoratedCarousel);
  const scrollController = new AbortController();
  window.addEventListener('wheel', () => removeHovered(decoratedCarousel), { signal: scrollController.signal });

  new MutationObserver((_, observer) => {
    if (!document.contains(decoratedCarousel)) {
      scrollController.abort();
      mobileObservers.forEach((o) => o.disconnect());
      observer.disconnect();
    }
  }).observe(document.body, { childList: true, subtree: true });
  return decoratedCarousel;
};

const setCarouselSlideOffsets = (grid, carousel) => {
  const hubHero = carousel.closest('.hub-hero');
  if (!hubHero) return;
  const cols = [...grid.querySelectorAll('.hub-hero-image-grid-container-col')];
  const gridHeight = grid.offsetHeight;
  // slide nth-child (1-based) → 0-based column index
  const colMap = { 1: 0, 2: 1, 4: 3, 5: 4 };
  Object.entries(colMap).forEach(([nthChild, colIdx]) => {
    const col = cols[colIdx];
    if (!col) return;
    // measure actual content height (offsetHeight is stretched by flex, use children sum)
    const colGap = parseFloat(getComputedStyle(col).rowGap) || 0;
    const children = [...col.children].slice(0, 2);
    const contentHeight = children.reduce((h, c) => h + c.offsetHeight, 0)
      + colGap * (children.length);
    const correction = contentHeight - gridHeight;
    hubHero.style.setProperty(`--carousel-slide-${nthChild}-correction`, `${correction}px`);
  });
};

const handleGridImages = (imageContainers, slides, isThreeSlides) => {
  const container = createTag('div', { class: 'hub-hero-image-grid-container' });
  [...imageContainers[0].children]?.forEach((cntr) => {
    container.appendChild(createTag('div', { class: 'hub-hero-image-grid-container-col' }, cntr));
  });

  [1, 2].forEach((i) => {
    [...(imageContainers[i]?.children ?? [])].forEach((img, index) => {
      if (img.children?.length) container.querySelector(`.hub-hero-image-grid-container-col:nth-child(${index + 1})`)?.appendChild(img);
    });
  });

  const gridColumns = [...container.querySelectorAll('.hub-hero-image-grid-container-col')];

  const leftSlideIndex = isThreeSlides ? 0 : 1;
  const rightSlideIndex = isThreeSlides ? 2 : 3;

  const leftClone = slides[leftSlideIndex]?.querySelector('div:has(img)')?.cloneNode(true);
  const rightClone = slides[rightSlideIndex]?.querySelector('div:has(img)')?.cloneNode(true);
  if (leftClone) gridColumns[1]?.append(leftClone);
  if (rightClone) gridColumns[3]?.append(rightClone);

  return container;
};

const decorateHubHeroCTA = (heroHeader) => {
  const img = heroHeader?.querySelector('img');
  const relativeSrc = img?.getAttribute('src');
  if (relativeSrc?.startsWith('/')) {
    img.src = getFederatedUrl(relativeSrc);
  }
  const linkEl = heroHeader.querySelector('a');
  const href = linkEl?.href;
  const sourceText = (linkEl ? linkEl.textContent : '').trim();
  const [ctaText, ariaLabel = ctaText] = sourceText.split('|').map((s) => s.trim());
  const arrow = createTag('span', { class: 'icon-button', 'aria-hidden': 'true' }, icons?.arrowRightWhite);
  const cta = createTag('a', { href, class: 'promo-cta', 'aria-label': ariaLabel }, [img, ctaText, arrow]);
  cta.addEventListener('focus', (e) => {
    if (e.currentTarget.matches(':focus-visible')) scrollHubHeroTo(e.currentTarget, 0);
  });
  linkEl.parentElement.replaceChildren(cta);
};

const handleCarouselItemsOffsets = ({ grid, elasticCarousel }) => {
  requestAnimationFrame(() => {
    setCarouselSlideOffsets(grid, elasticCarousel);
  });
};

const findSize = (classes, key) => classes.find((item) => item.match(key))?.split(key)?.[1];

export default async function init(el) {
  const heroHeader = el.querySelector('div:first-child');
  const classes = [...el.classList];
  const isThreeSlides = classes.includes('slides-3');

  decorateBlockText(heroHeader, {
    heading: findSize(classes, 'heading-') ?? '1',
    body: findSize(classes, 'body-') ?? 'lg',
    button: findSize(classes, 'button-') ?? 'lg',
  });

  heroHeader.classList.add('hub-hero-header');
  decorateHubHeroCTA(heroHeader);
  const carouselHeader = el.querySelector('.hub-hero > div:not(:first-child):not(:has(img))');
  carouselHeader.classList.add('hub-hero-carousel-header');
  const gridImages = [...el.querySelectorAll(`.hub-hero > div:nth-child(2), .hub-hero > div:nth-child(3)${isThreeSlides ? ', .hub-hero > div:nth-child(4)' : ''}`)];
  const carouselImages = [...el.querySelectorAll(`.hub-hero > div:nth-last-of-type(-n+${isThreeSlides ? 3 : 4})`)];

  const grid = handleGridImages(gridImages, carouselImages, isThreeSlides);
  const elasticCarousel = handleCarousel(carouselImages, isThreeSlides);
  elasticCarousel.prepend(carouselHeader);
  el.replaceChildren();
  el.append(heroHeader, grid, elasticCarousel);
  handleCarouselItemsOffsets({ heroHeader, grid, elasticCarousel, el });
}
