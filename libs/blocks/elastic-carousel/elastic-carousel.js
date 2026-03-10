import { createTag } from '../../utils/utils.js';

let leaveTimeout;

const onCarouselLeave = (event) => {
  const carousel = event.currentTarget;
  leaveTimeout = setTimeout(() => {
    carousel.classList.remove('stick-left');
    carousel.classList.remove('stick-right');
  }, 10);
};

const onCarouselHover = (event) => {
  const slide = event.target.closest('.elastic-carousel__item');
  clearTimeout(leaveTimeout);
  if (!slide) return;
  const slideIndex = slide.dataset.index * 1;
  const carousel = event.currentTarget;
  carousel.classList.remove('stick-left');
  carousel.classList.remove('stick-right');
  if (slideIndex < 2) carousel.classList.add('stick-left');
  if (slideIndex > 4) carousel.classList.add('stick-right');
};

export default async function init(el) {
  const section = el.closest('.section');
  const slide = (index) => {
    const content = `
      <div class="elastic-carousel__item-container">
        <div class="elastic-carousel__item-header">
          <img src="https://www.adobe.com/cc-shared/assets/img/product-icons/svg/creative-cloud.svg">
          <p>Adobe Cloud</p>
        </div>
        <div class="elastic-carousel__item-media">
          <img src="https://www.adobe.com/cc-shared/fragments/creativecloud/pro/media_124da3b07bb29fe081c2748f8efbdadc8247b5c8c.jpg?width=2000&format=webply&optimize=medium"/>
        </div>
        <div class="elastic-carousel__item-footer">
          <h3>Content made easy</h3>
          <p>Quickly create and edit images, video, and audio with creative AI.</p>
        </div>
      </div>
    `;
    const slideEl = createTag('div', {
      class: `elastic-carousel__item${index === 5 ? ' stack-end' : ''}`,
      tabindex: 0,
      'aria-label': 'number',
      'data-index': index + 1,
    }, content);
    return slideEl;
  };

  section.innerHTML = `
    <div class="section before">some content before</div>
    <div class="elastic-carousel-container">
      <div class="elastic-carousel"></div>
    </div>
    <div class="section after">some content after</div>`;

  const carousel = section.querySelector('.elastic-carousel');
  carousel.addEventListener('mouseout', onCarouselLeave);
  carousel.addEventListener('mouseover', onCarouselHover);

  for (let i = 0; i < 5; i += 1) {
    carousel.append(slide(i));
  }
}
