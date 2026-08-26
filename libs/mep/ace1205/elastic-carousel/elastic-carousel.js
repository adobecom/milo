import { decorateBlockText } from '../../../utils/decorate.js';
import { createTag, getFederatedUrl } from '../../../utils/utils.js';
import { sendAnalytics } from '../../../martech/helpers.js';
import { processTrackingLabels } from '../../../martech/attributes.js';

const leaveTimeouts = new WeakMap();
let hoverTracked = false;
const rewindIntervals = new WeakMap();
const slideLeaveTimeouts = new WeakMap();

const isSvgUrl = (url) => /\.svg(\?.*)?$/i.test(url || '');
const isRtl = () => document.documentElement.getAttribute('dir') === 'rtl';
const isMobile = () => window.innerWidth <= 768;

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
    } else {
      const elapsed = Date.now() - startSystemTime;
      video.currentTime = Math.max(startVideoTime - elapsed / 1000, 0);
    }
  }, 30);
  rewindIntervals.set(video, intervalRewind);
};

const handleMobileAutoplay = (carousel) => {
  const slides = [...carousel.querySelectorAll('.elastic-carousel-item')];
  const observers = [];

  slides.forEach((slide, index) => {
    const video = slide.querySelector('video');
    if (!video) return;

    const nextSlide = slides[index + 1];

    // Play when this slide enters view — but not if the next slide is already covering it
    const slideObserver = new IntersectionObserver(
      ([entry]) => {
        if (!isMobile()) return;
        if (entry.isIntersecting) {
          const nextRect = nextSlide?.getBoundingClientRect();
          const isCovered = nextRect && nextRect.top < window.innerHeight * 0.7;
          if (!isCovered) video.play().catch(() => { });
        }
      },
      { threshold: 0.6 },
    );
    slideObserver.observe(slide);
    observers.push(slideObserver);

    if (!nextSlide) return;

    // Rewind when the next slide starts covering this one;
    // play again when it uncovers (user scrolls back up)
    const nextSlideObserver = new IntersectionObserver(
      ([entry]) => {
        if (!isMobile()) return;
        if (entry.isIntersecting) {
          rewindVideo(video);
        } else {
          const rect = slide.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= window.innerHeight) {
            video.play().catch(() => { });
          }
        }
      },
      { threshold: 0.6 },
    );
    nextSlideObserver.observe(nextSlide);
    observers.push(nextSlideObserver);
  });

  return observers;
};

const disableHoverOnScroll = (carousel) => {
  let timer;
  const controller = new AbortController();
  window.addEventListener('wheel', () => {
    clearTimeout(timer);
    carousel.classList.add('disable-hover');
    timer = setTimeout(() => {
      carousel.classList.remove('disable-hover');
    }, 100);
  }, { signal: controller.signal });
  return controller;
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
  const slides = carousel?.querySelectorAll('.elastic-carousel-item');
  [...slides]?.forEach((sld) => sld.classList.remove('hovered'));
};

const onCarouselLeave = (event) => {
  const carouselContainer = event.target;
  clearTimeout(leaveTimeouts.get(carouselContainer));
  leaveTimeouts.set(carouselContainer, setTimeout(() => {
    carouselContainer.classList.remove('stick-left', 'stick-right');
    removeHovered(carouselContainer.closest('.elastic-carousel'));
  }, 10));
};

const onHover = (event) => {
  const slideEl = event.target;
  const carouselContainer = slideEl.closest('.elastic-carousel-container');
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

  removeHovered(slideEl.closest('.elastic-carousel'));
  slideEl.classList.add('hovered');

  if (isRtl()) {
    container.classList.toggle('stick-right', slideIndex <= 3);
    container.classList.toggle('stick-left', slideIndex === 5);
  } else {
    container.classList.toggle('stick-left', slideIndex <= 3);
    container.classList.toggle('stick-right', slideIndex === 5);
  }

  if (!hoverTracked) {
    hoverTracked = true;
    const block = slideEl.closest('[daa-lh]');
    const blockName = block?.getAttribute('daa-lh');
    const section = block?.parentElement?.closest('[daa-lh]');
    const sectionName = section?.getAttribute('daa-lh');
    sendAnalytics(`user-hover|${sectionName}|${blockName}`);
  }
};

const buildSlide = ({ slide, index, slidesTotal }) => {
  const children = [...slide.children];
  const left = children[0];
  const right = children[1];

  const [iconContainer, heading, linkName, description] = left.children;
  const icon = iconContainer?.querySelector('img');
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
  if (isSvgUrl(icon?.src)) icon.src = getFederatedUrl(icon.src);

  // TODO: update to ensure classes are mapped to C2 variables
  // TODO: see if eyebrow class can be applied directly to footer headline
  decorateBlockText(left);

  const content = `
    <div class='elastic-carousel-item-container' id='elastic-carousel-slide-${index + 1}'>
      <div class='elastic-carousel-item-header'>
        ${icon.outerHTML}
        ${heading?.outerHTML}
      </div>
      <div class='elastic-carousel-item-media'>
        ${asset.outerHTML}
      </div>
      <div class='elastic-carousel-item-footer'>
        ${linkName?.outerHTML}
        ${description?.outerHTML}
      </div>
    </div>
  `;

  let ariaLabel = `${index + 1} of ${slidesTotal}`;
  // assign unique aria-label to the first slide
  if (index === 0) ariaLabel = `${getCarouselName(link)}, carousel. ${ariaLabel}`;

  const slideEl = createTag('a', {
    class: 'elastic-carousel-item',
    tabindex: 0,
    href: link?.href,
    'data-index': index + 1,
    role: 'link',
    ...(isMobile() && {
      'aria-roledescription': 'slide',
      'aria-label': ariaLabel,
    }),
    'aria-describedby': `elastic-carousel-slide-${index + 1}`,
    'daa-ll': `${processTrackingLabels(linkName?.textContent)}-${index + 1}--${processTrackingLabels(heading?.textContent)}`,
  }, content);

  slideEl.addEventListener('mouseleave', onSlideLeave);
  slideEl.addEventListener('mouseenter', onHover);
  slideEl.addEventListener('focus', onHover);
  return slideEl;
};

const decorateCarousel = (carousel) => {
  const slides = [...carousel.children];
  if (isRtl()) slides.reverse();
  const decoratedSlides = slides.map((slide, index) => buildSlide(
    { slide, index, slidesTotal: slides.length },
  ));
  const carouselContainer = createTag('div', { class: 'elastic-carousel-container' });
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

export default async function init(el) {
  const decoratedCarousel = decorateCarousel(el);
  upgradeVideoPreload(decoratedCarousel);
  const scrollController = disableHoverOnScroll(decoratedCarousel);
  decoratedCarousel.querySelector('.elastic-carousel-container')?.addEventListener('mouseleave', onCarouselLeave);
  const mobileObservers = handleMobileAutoplay(decoratedCarousel);

  new MutationObserver((_, observer) => {
    if (!document.contains(el)) {
      scrollController.abort();
      mobileObservers.forEach((o) => o.disconnect());
      observer.disconnect();
    }
  }).observe(document.body, { childList: true, subtree: true });
}
