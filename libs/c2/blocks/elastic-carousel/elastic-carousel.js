import { decorateBlockText } from '../../../utils/decorate.js';
import { createTag, getFederatedUrl } from '../../../utils/utils.js';

let leaveTimeout;
const rewindIntervals = new WeakMap();

const isSvgUrl = (url) => /\.svg(\?.*)?$/i.test(url || '');
const isRtl = () => document.documentElement.getAttribute('dir') === 'rtl';
const isMobile = () => window.innerWidth <= 768;

const getCarouselName = (link) => link?.innerText?.split('|')?.[1]?.trim() || '';

const handleMobileAutoplay = (carousel) => {
  const videos = carousel.querySelectorAll('video');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!isMobile()) return;
        const video = entry.target;

        if (entry.isIntersecting) {
          video.play().catch(() => { });
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0.6 }, // play when 60% visible
  );

  videos.forEach((video) => observer.observe(video));
};

const disableHoverOnScroll = (carousel) => {
  let timer;
  const controller = new AbortController();
  window.addEventListener('scroll', () => {
    clearTimeout(timer);
    carousel.classList.add('disable-hover');
    timer = setTimeout(() => {
      carousel.classList.remove('disable-hover');
    }, 150);
  }, { signal: controller.signal });
  return controller;
};

const handleVideoPlay = (event) => {
  const slide = event.target.closest('.elastic-carousel-item');
  if (!slide) return;
  const video = slide?.querySelector('video');
  if (!video) return;
  video.play().catch(() => { });
};

const onSlideLeave = (event) => {
  const video = event?.target?.querySelector('video');
  if (!video) return;
  video.pause();

  const rewind = (rewindSpeed) => {
    clearInterval(rewindIntervals.get(video));
    const startSystemTime = new Date().getTime();
    const startVideoTime = video.currentTime;

    const intervalRewind = setInterval(() => {
      video.playbackRate = 1.0;
      if (video.currentTime === 0) {
        clearInterval(rewindIntervals.get(video));
        rewindIntervals.delete(video);
        video.pause();
      } else {
        const elapsed = new Date().getTime() - startSystemTime;
        const val = Math.max(startVideoTime - elapsed * (rewindSpeed / 1000.0), 0);
        video.currentTime = val;
      }
    }, 30);
    rewindIntervals.set(video, intervalRewind);
  };
  rewind(1);
};

const onCarouselLeave = (event) => {
  const carouselContainer = event.currentTarget.querySelector('.elastic-carousel-container');
  leaveTimeout = setTimeout(() => {
    carouselContainer.classList.remove('stick-left', 'stick-right');
  }, 50);
};

const onCarouselHover = (event) => {
  const slide = event.target.closest('.elastic-carousel-item');
  if (!slide) return;
  handleVideoPlay(event);
  clearTimeout(leaveTimeout);

  const slideIndex = slide.dataset.index * 1;
  const carouselContainer = event.target.closest('.elastic-carousel').querySelector('.elastic-carousel-container');

  if (isRtl()) {
    carouselContainer.classList.toggle('stick-right', slideIndex < 3);
    carouselContainer.classList.toggle('stick-left', slideIndex > 3);
  } else {
    carouselContainer.classList.toggle('stick-left', slideIndex < 3);
    carouselContainer.classList.toggle('stick-right', slideIndex > 3);
  }
};

const buildSlide = ({ slide, index, slidesTotal }) => {
  const children = [...slide.children];
  const left = children[0];
  const right = children[1];

  const icon = left.children[0]?.querySelector('img');
  const asset = right.children[0];
  const link = left.children[4]?.querySelector('a');

  if (asset?.dataset.videoSource) {
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
    <div class='elastic-carousel-item-container'>
      <div class='elastic-carousel-item-header'>
        ${icon.outerHTML}
        ${left.children[1]?.outerHTML}
      </div>
      <div class='elastic-carousel-item-media'>
        ${asset.outerHTML}
      </div>
      <div class='elastic-carousel-item-footer'>
        ${left.children[2]?.outerHTML}
        ${left.children[3]?.outerHTML}
      </div>
    </div>
  `;

  let ariaLabel = `${index + 1} of ${slidesTotal}`;
  // assign unique label to the first slide
  if (index === 0) ariaLabel = `${getCarouselName(link)}, carousel. ${ariaLabel}`;

  const slideEl = createTag('a', {
    class: 'elastic-carousel-item',
    tabindex: 0,
    href: link?.href,
    'data-index': index + 1,
    role: 'link',
    'aria-roledescription': 'slide',
    'aria-label': ariaLabel,
  }, content);

  slideEl.addEventListener('mouseleave', onSlideLeave);
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

export default async function init(el) {
  const decoratedCarousel = decorateCarousel(el);
  const scrollController = disableHoverOnScroll(decoratedCarousel);
  decoratedCarousel.addEventListener('mouseleave', onCarouselLeave);
  decoratedCarousel.addEventListener('mouseover', onCarouselHover);
  handleMobileAutoplay(decoratedCarousel);

  new MutationObserver((_, observer) => {
    if (!document.contains(el)) {
      scrollController.abort();
      observer.disconnect();
    }
  }).observe(document.body, { childList: true, subtree: true });
}
