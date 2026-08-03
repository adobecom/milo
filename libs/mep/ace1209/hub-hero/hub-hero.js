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
const isMobile = () => window.matchMedia('(min-width: 768px)').matches;

const getCarouselName = (link) => link?.innerText?.split('|')?.[1]?.trim() || 'Adobe slides';

const stopRewind = (video) => {
  clearInterval(rewindIntervals.get(video));
  rewindIntervals.delete(video);
};

const rewindVideo = (video) => {
  stopRewind(video);
  video.pause();
  const startSystemTime = Date.now();
  const startVideoTime = video.currentTime;
  const intervalRewind = setInterval(() => {
    if (video.currentTime === 0) {
      stopRewind(video);
      video.load();
      return;
    }
    const elapsed = Date.now() - startSystemTime;
    video.currentTime = Math.max(startVideoTime - elapsed / 1000, 0);
  }, 30);
  rewindIntervals.set(video, intervalRewind);
};

const handleMobileAutoplay = (carousel) => {
  const slides = [...carousel.querySelectorAll('.hub-hero-carousel-item')];
  const observers = [];

  slides.forEach((slide, index) => {
    const video = slide.querySelector('video');
    if (!video) return;

    const nextSlide = slides[index + 1];

    if (!nextSlide) return;
    // Play when this slide enters view — but not if the next slide is already covering it
    const slideObserver = new IntersectionObserver(
      ([entry]) => {
        if (!isMobile() || !entry.isIntersecting) return;
        const nextRect = nextSlide?.getBoundingClientRect();
        const isCovered = nextRect && nextRect.top < window.innerHeight * 0.7;
        if (!isCovered) video.play().catch(() => { });
      },
      { threshold: 0.6 },
    );
    slideObserver.observe(slide);
    observers.push(slideObserver);

    // Rewind when the next slide starts covering this one;
    // play again when it uncovers (user scrolls back up)
    const nextSlideObserver = new IntersectionObserver(
      ([entry]) => {
        if (!isMobile()) return;
        if (entry.isIntersecting) {
          rewindVideo(video);
          return;
        }
        const rect = slide.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= window.innerHeight) {
          video.play().catch(() => { });
        }
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
  const video = event?.target?.querySelector('video');
  if (!video) return;

  clearTimeout(slideLeaveTimeouts.get(video));
  slideLeaveTimeouts.set(video, setTimeout(() => {
    rewindVideo(video);
  }, 100));
};

const removeHovered = (carousel) => {
  const slides = carousel?.querySelectorAll('.hub-hero-carousel-item');
  [...slides]?.forEach((sld) => sld.classList.remove('hovered'));
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

  const video = slideEl.querySelector('video');
  clearTimeout(slideLeaveTimeouts.get(video));
  slideLeaveTimeouts.delete(video);

  if (video) {
    stopRewind(video);
    video.play().catch(() => { });
  }

  const slideIndex = slideEl.dataset.index * 1;
  const container = slideEl.parentElement;
  if (!container) return;

  removeHovered(slideEl.closest('.hub-hero-carousel'));
  slideEl.classList.add(isFocus ? 'focused' : 'hovered');

  const rtl = isRtl();
  container.classList.toggle('stick-left', rtl ? slideIndex === 5 : slideIndex === 1);
  container.classList.toggle('stick-right', rtl ? slideIndex === 1 : slideIndex === 5);

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
  const right = children[1];

  const [eyebrow, heading] = left.children;
  const asset = right.children[0];
  const link = left.lastElementChild?.querySelector('a');

  if (asset?.dataset.videoSource) {
    asset.setAttribute('preload', 'none');
    asset.appendChild(createTag('source', { src: asset?.dataset.videoSource, type: 'video/mp4' }));
    asset.setAttribute('muted', true);
    asset.setAttribute('tabindex', '-1');
    asset.removeAttribute('controls');
  }

  if (isSvgUrl(asset?.src)) asset.src = getFederatedUrl(asset.src);

  decorateBlockText(left);

  const content = `
    <div class='hub-hero-carousel-item-container' id='hub-hero-carousel-slide-${index + 1}'>
      <div class='hub-hero-carousel-item-header'>
        ${eyebrow?.outerHTML}
      </div>
      <div class='hub-hero-carousel-item-media'>
        ${asset?.outerHTML}
      </div>
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
    ...(isMobile() && {
      'aria-roledescription': 'slide',
      'aria-label': ariaLabel,
    }),
    'aria-describedby': `hub-hero-carousel-slide-${index + 1}`,
    'daa-ll': `${processTrackingLabels(heading?.textContent)}-${index + 1}--${processTrackingLabels(heading?.textContent)}`,
  }, content);

  if (link?.dataset?.modalHash) slideEl.dataset.modalHash = link.dataset.modalHash;
  if (link?.dataset?.modalPath) slideEl.dataset.modalPath = link.dataset.modalPath;

  slideEl.addEventListener('mouseleave', onSlideLeave);
  slideEl.addEventListener('mouseenter', onHover);
  slideEl.addEventListener('focus', onHover);
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

const handleCarousel = (slds) => {
  const slides = [...slds.slice(0, 2), {}, ...slds.slice(2)];
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

const handleGridImages = (imageContainers, slides) => {
  const container = createTag('div', { class: 'hub-hero-image-grid-container' });
  [...imageContainers[0].children]?.forEach((img) => {
    container.appendChild(createTag('div', { class: 'hub-hero-image-grid-container-col' }, img));
  });
  [...imageContainers[1].children]?.forEach((img, index) => {
    container.querySelector(`.hub-hero-image-grid-container-col:nth-child(${index + 1}`)?.appendChild(img);
  });

  const col2 = container.querySelector('.hub-hero-image-grid-container-col:nth-child(2)');
  const col4 = container.querySelector('.hub-hero-image-grid-container-col:nth-child(4)');

  col2.append(slides[1]?.querySelector('div:has(img)')?.cloneNode(true));
  col4.append(slides[3]?.querySelector('div:has(img)')?.cloneNode(true));

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

  decorateBlockText(heroHeader, {
    heading: findSize(classes, 'heading-') ?? '1',
    body: findSize(classes, 'body-') ?? 'lg',
    button: findSize(classes, 'button-') ?? 'lg',
  });

  heroHeader.classList.add('hub-hero-header');
  decorateHubHeroCTA(heroHeader);
  const carouselHeader = el.querySelector('.hub-hero > div:not(:first-child):not(:has(img))');
  carouselHeader.classList.add('hub-hero-carousel-header');
  const gridImages = [...el.querySelectorAll('.hub-hero > div:nth-child(2), .hub-hero > div:nth-child(3)')];
  const carouselImages = [...el.querySelectorAll('.hub-hero > div:nth-last-of-type(-n+4)')];
  const grid = handleGridImages(gridImages, carouselImages);
  const elasticCarousel = handleCarousel(carouselImages);
  elasticCarousel.prepend(carouselHeader);
  el.replaceChildren();
  el.append(heroHeader, grid, elasticCarousel);
  handleCarouselItemsOffsets({ heroHeader, grid, elasticCarousel, el });
}
