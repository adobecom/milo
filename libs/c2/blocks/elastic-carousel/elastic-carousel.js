import { decorateBlockText } from '../../../utils/decorate.js';
import { createTag, getFederatedUrl } from '../../../utils/utils.js';

let leaveTimeout;

const isSvgUrl = (url) => /\.svg(\?.*)?$/i.test(url || '');
const isRtl = () => document.documentElement.getAttribute('dir') === 'rtl';


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
};


// RTL
// Alt attr

const buildSlide = ({ slide, index }) => {
  const children = [...slide.children];
  const left = children[0];
  const right = children[1];

  const icon = left.children[0]?.querySelector('img');
  const asset = right.children[0];

  if (asset?.dataset.videoSource) {
    asset.appendChild(createTag('source', { src: asset?.dataset.videoSource, type: 'video/mp4' }));
    asset.setAttribute('muted', true);
    asset.removeAttribute('controls');
  }

  if (isSvgUrl(asset?.src)) asset.src = getFederatedUrl(asset.src);
  if (isSvgUrl(icon?.src)) icon.src = getFederatedUrl(icon.src);

  decorateBlockText(left.children[2]);
  decorateBlockText(left.children[3]);

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
  const slideEl = createTag('a', {
    class: 'elastic-carousel-item',
    tabindex: 0,
    href: left.children[4]?.href,
    'data-index': index + 1,
    'aria-label': left.children[1]?.innerContent,
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
}
