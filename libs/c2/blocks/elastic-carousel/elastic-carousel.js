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

export default async function init(el) {
  const section = el.closest('.section');
  const slide = (index) => {
    const content = `
      <div class='elastic-carousel__item-container'>
        <div class='elastic-carousel__item-header'>
          <img src='https://www.adobe.com/cc-shared/assets/img/product-icons/svg/creative-cloud.svg'>
          <p>Adobe Cloud</p>
        </div>
        <div class='elastic-carousel__item-media'>
          <img src='https://www.adobe.com/cc-shared/fragments/creativecloud/pro/media_124da3b07bb29fe081c2748f8efbdadc8247b5c8c.jpg?width=2000&format=webply&optimize=medium'/>
        </div>
        <div class='elastic-carousel__item-footer'>
          <h3>Content made easy</h3>
          <p>Quickly create and edit images, video, and audio with creative AI.</p>
        </div>
      </div>
    `;
    const slideEl = createTag('div', {
      class: 'elastic-carousel__item',
      tabindex: 0,
      'aria-label': 'number',
      'data-index': index + 1,
    }, content);
    return slideEl;
  };

  section.innerHTML = `
  <div class='section before'>some content before</div>
  <div class='elastic-carousel-container'>
  <div class='elastic-carousel'></div>
  </div>
  <div class='section after'>some content after</div>`;

  const carousel = section.querySelector('.elastic-carousel');
  disableHoverOnScroll(carousel);
  carousel.addEventListener('mouseleave', onCarouselLeave);
  carousel.addEventListener('mouseover', onCarouselHover);

  for (let i = 0; i < 5; i += 1) {
    carousel.append(slide(i));
  }
}
