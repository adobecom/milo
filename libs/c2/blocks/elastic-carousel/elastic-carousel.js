/* eslint-disable no-underscore-dangle */
import { decorateBlockText } from '../../../utils/decorate.js';
import { createTag, getFederatedUrl, getConfig } from '../../../utils/utils.js';
import { processTrackingLabels, sendAnalytics } from '../../../martech/attributes.js';

let leaveTimeout;

const isSvgUrl = (url) => /\.svg(\?.*)?$/i.test(url || '');
const isRtl = () => document.documentElement.getAttribute('dir') === 'rtl';
const isMobile = () => window.innerWidth <= 768;
const trackedCardHovers = [];

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
  window.addEventListener('scroll', () => {
    clearTimeout(timer);
    carousel.classList.add('disable-hover');
    timer = setTimeout(() => {
      carousel.classList.remove('disable-hover');
    }, 150);
  });
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
  let reversing = true;
  let lastTime = null;

  function reverseAnimate(timestamp) {
    if (!reversing) return;
    const now = timestamp || performance.now();

    if (!lastTime) lastTime = now;

    const delta = (now - lastTime) / 1000;
    lastTime = now;

    // rewind at 1x speed (match normal playback)
    video.currentTime -= delta * 0.3;
    if (video.currentTime <= 0) {
      reversing = false;
      return;
    }

    video.currentTime -= 0.03;
    requestAnimationFrame(reverseAnimate);
  }
  reverseAnimate();
};

const onCarouselLeave = (event) => {
  clearTimeout(leaveTimeout);
  const carouselContainer = event.currentTarget.querySelector('.elastic-carousel-container');
  leaveTimeout = setTimeout(() => {
    carouselContainer.classList.remove('stick-left', 'stick-right');
  }, 10);
};

const onCarouselHover = (event) => {
  const slide = event.target.closest('.elastic-carousel-item');
  if (!slide) return;
  handleVideoPlay(event);
  const slideIndex = slide.dataset.index * 1;
  const carouselContainer = event.target.closest('.elastic-carousel').querySelector('.elastic-carousel-container');

  if (isRtl()) {
    carouselContainer.classList.toggle('stick-right', slideIndex < 3);
    carouselContainer.classList.toggle('stick-left', slideIndex > 3);
  } else {
    carouselContainer.classList.toggle('stick-left', slideIndex < 3);
    carouselContainer.classList.toggle('stick-right', slideIndex > 3);
  }

  const slideName = slide.dataset.cardLabel;
  if (slideName && !trackedCardHovers.includes(slideName)) {
    trackedCardHovers.push(slideName);
    sendAnalytics(`hover-${slideName}`);
  }
};
// RTL
// Alt attr

const buildSlide = ({ slide, index }) => {
  const children = [...slide.children];
  const left = children[0];
  const right = children[1];

  const [iconContainer, heading, linkName, description] = left.children;
  const icon = iconContainer?.querySelector('img');
  const asset = right.children[0];

  if (asset?.dataset.videoSource) {
    asset.appendChild(createTag('source', { src: asset?.dataset.videoSource, type: 'video/mp4' }));
    asset.setAttribute('muted', true);
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
  const cardName = `${index + 1}--${processTrackingLabels(heading?.textContent, getConfig(), 20)}`;
  const slideEl = createTag('a', {
    class: 'elastic-carousel-item',
    tabindex: 0,
    href: left.children[4]?.querySelector('a')?.href,
    'data-index': index + 1,
    'aria-label': left.children[1]?.innerContent,
    'daa-ll': `click-${cardName}`,
    'data-card-label': cardName,
  }, content);

  slideEl.addEventListener('focus', onCarouselHover);
  slideEl.addEventListener('blur', onCarouselLeave);
  slideEl.addEventListener('mouseleave', onSlideLeave);
  return slideEl;
};

const decorateCarousel = (carousel) => {
  const slides = [...carousel.children];
  const decoratedSlides = slides.map((slide, index) => buildSlide({ slide, index }));
  const carouselContainer = createTag('div', { class: 'elastic-carousel-container' });
  carouselContainer.append(...decoratedSlides);
  carousel.replaceChildren();
  carousel.append(carouselContainer);
  return carousel;
};

export default async function init(el) {
  const decoratedCarousel = decorateCarousel(el);
  disableHoverOnScroll(decoratedCarousel);
  decoratedCarousel.addEventListener('mouseleave', onCarouselLeave);
  decoratedCarousel.addEventListener('mouseover', onCarouselHover);
  handleMobileAutoplay(decoratedCarousel);
}
