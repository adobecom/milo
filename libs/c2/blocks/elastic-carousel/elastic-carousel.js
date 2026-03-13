import { createTag } from '../../../utils/utils.js';

const onCarouselLeave = (event) => {
  const carousel = event.currentTarget;
  carousel.classList.remove('stick-left');
  carousel.classList.remove('stick-right');
};

const disableHoverOnScroll = (carousel) => {
  let timer;
  window.addEventListener('scroll', () => {
    carousel.classList.add('disable-hover');
    clearTimeout(timer);
    timer = setTimeout(() => {
      carousel.classList.remove('disable-hover');
    }, 150);
  });
};

const onCarouselHover = (event) => {
  const slide = event.target.closest('.elastic-carousel__item');
  if (!slide) return;
  const slideIndex = slide.dataset.index * 1;
  const carousel = event.currentTarget;

  carousel.classList.remove('stick-right');
  carousel.classList.remove('stick-left');

  if (slideIndex < 3) { carousel.classList.add('stick-left'); }
  if (slideIndex > 3) { carousel.classList.add('stick-right'); }
};

const buildSlide = ({ slide, index }) => {
  const children = [...slide.children];
  const slideObj = {
    header: {
      iconSrc: children[0].querySelector('img')?.src,
      title: children[0].querySelector('p:not(:has(img))').innerText,
    },
    asset: {
      imgSrc: children[1].querySelector('img')?.src,
      videoSrc: children[1].querySelector('video')?.src,
    },
    footer: {
      title: children[2].querySelector('strong').innerText,
      text: children[2].querySelector('p:not(:has(strong))').innerText,
    },
  };

  const content = `
    <div class='elastic-carousel__item-container'>
      <div class='elastic-carousel__item-header'>
        <img src='${slideObj.header.iconSrc}'>
        <p>${slideObj.header.title}</p>
      </div>
      <div class='elastic-carousel__item-media'>
        ${slideObj.asset.imgSrc ? `<img src='${slideObj.asset.imgSrc}'/>` : ''}
        ${slideObj.asset.videoSrc ? `<video src='${slideObj.asset.videoSrc}'/>` : ''}
      </div>
      <div class='elastic-carousel__item-footer'>
        <h3>${slideObj.footer.title}</h3>
        <p>${slideObj.footer.text}</p>
      </div>
    </div>
  `;
  const slideEl = createTag('div', {
    class: 'elastic-carousel__item',
    tabindex: 0,
    'aria-label': 'slide X',
    'data-index': index + 1,
    'ddl-lh': '',
  }, content);
  return slideEl;
};

const buildSlides = (carousel) => {
  const slides = [...carousel.children];
  const decoratedSlides = slides.map((slide, index) => buildSlide({ slide, index }));
  // turn original div into carousel container
  carousel.replaceChildren();
  const newCarousel = createTag('div', { class: carousel.className });
  carousel.parentNode.prepend(createTag('div', { class: 'before' }, 'marquee'));
  carousel.append(newCarousel);
  carousel.parentNode.append(createTag('div', { class: 'after' }, 'content after'));
  carousel.className = 'elastic-carousel-container';
  decoratedSlides.forEach((slide) => newCarousel.append(slide));
  return newCarousel;
};

export default async function init(el) {
  const decoratedCarousel = buildSlides(el);
  disableHoverOnScroll(decoratedCarousel);
  decoratedCarousel.addEventListener('mouseleave', onCarouselLeave);
  decoratedCarousel.addEventListener('mouseover', onCarouselHover);
}
