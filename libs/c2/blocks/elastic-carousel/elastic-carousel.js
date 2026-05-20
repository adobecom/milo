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
  cancelAnimationFrame(rewindIntervals.get(video));
  rewindIntervals.delete(video);
};

/**
 * Fallback. "Fakes" rewind of the original video, if no reverse video was provided.
 * NOTE: This is heavy on CPU and will most likely result into "choppy" user experience
*/
const rewindVideo = (video) => {
  stopRewind(video);
  video.pause();
  const startSystemTime = Date.now();
  const startVideoTime = video.currentTime;
  const frame = () => {
    const elapsed = Date.now() - startSystemTime;
    const newTime = Math.max(startVideoTime - elapsed / 1000, 0);
    video.currentTime = newTime;
    if (newTime === 0) {
      stopRewind(video);
      video.load();
    } else {
      rewindIntervals.set(video, requestAnimationFrame(frame));
    }
  };
  rewindIntervals.set(video, requestAnimationFrame(frame));
};

/**
 * Preferred way of "playing video backwards" by swapping it with
 * a reversed version of the orignal video. Must be added as a link under
 * original video in CMS.
 * Easy on CPU.
 */
const swapVideo = (from, to) => {
  const duration = from.duration || to.duration || 0;
  if (!duration) return;
  to.currentTime = duration - from.currentTime;
  const doSwap = () => {
    from.pause();
    from.classList.remove('active');
    to.classList.add('active');
    to.play().catch(() => {});
  };
  if (to.readyState >= 2) {
    doSwap();
  } else {
    to.addEventListener('seeked', doSwap, { once: true });
  }
};

const swapToReverse = (slide) => {
  const forward = slide.querySelector('video.forward');
  const reverse = slide.querySelector('video.reverse');
  if (!forward) return;
  if (!reverse) { rewindVideo(forward); return; }
  swapVideo(forward, reverse);
};

const swapToForward = (slide) => {
  const forward = slide.querySelector('video.forward');
  const reverse = slide.querySelector('video.reverse');
  if (!forward) return;
  if (!reverse) { stopRewind(forward); forward.play().catch(() => {}); return; }
  swapVideo(reverse, forward);
};

const handleMobileAutoplay = (carousel) => {
  const slides = [...carousel.querySelectorAll('.elastic-carousel-item')];
  const observers = [];

  slides.forEach((slide, index) => {
    const forward = slide.querySelector('video.forward');
    if (!forward) return;

    const nextSlide = slides[index + 1];

    // Play when this slide enters view — but not if the next slide is already covering it
    const slideObserver = new IntersectionObserver(
      ([entry]) => {
        if (!isMobile()) return;
        if (entry.isIntersecting) {
          const nextRect = nextSlide?.getBoundingClientRect();
          const isCovered = nextRect && nextRect.top < window.innerHeight * 0.7;
          if (!isCovered) swapToForward(slide);
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
          swapToReverse(slide);
        } else {
          const rect = slide.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= window.innerHeight) {
            swapToForward(slide);
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
  const slideEl = event?.target;
  if (!slideEl?.querySelector('video')) return;

  clearTimeout(slideLeaveTimeouts.get(slideEl));
  slideLeaveTimeouts.set(slideEl, setTimeout(() => {
    swapToReverse(slideEl);
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

  clearTimeout(slideLeaveTimeouts.get(slideEl));
  slideLeaveTimeouts.delete(slideEl);

  if (slideEl.querySelector('video')) {
    swapToForward(slideEl);
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
  const reverseAsset = right.children[1];
  const link = left.lastElementChild?.querySelector('a');

  let reverseHtml = '';
  if (asset?.dataset.videoSource) {
    const videoSrc = asset.dataset.videoSource;
    asset.setAttribute('preload', 'none');
    asset.appendChild(createTag('source', { src: videoSrc, type: 'video/mp4' }));
    asset.setAttribute('muted', true);
    asset.setAttribute('tabindex', '-1');
    asset.removeAttribute('controls');
    asset.classList.add('forward', 'active');

    if (reverseAsset?.dataset.videoSource) {
      const reverseSrc = reverseAsset.dataset.videoSource;
      const reverseVideo = createTag('video', {
        preload: 'none',
        muted: true,
        tabindex: '-1',
        class: 'reverse',
      });
      reverseVideo.appendChild(createTag('source', { src: reverseSrc, type: 'video/mp4' }));
      reverseHtml = reverseVideo.outerHTML;
    }
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
        ${reverseHtml}
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
