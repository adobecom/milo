import { createTag } from '../../utils/utils.js';

function defineDeviceByScreenSize() {
  const DESKTOP_SIZE = 1200;
  const MOBILE_SIZE = 600;
  const screenWidth = window.innerWidth;
  if (screenWidth >= DESKTOP_SIZE) {
    return 'DESKTOP';
  }
  if (screenWidth <= MOBILE_SIZE) {
    return 'MOBILE';
  }
  return 'TABLET';
}

function createImageCard(el) {
  const heading = el.querySelector('h1, h2, h3, h4, h5, h6');
  const textContent = el.querySelector('a').innerText.trim();
  const redirectLink = el.querySelector('a').href;
  const screenWidth = defineDeviceByScreenSize()
  const pics = el.querySelector(':scope > div:nth-child(2) picture');
  let background = el.querySelector(':scope div:first-child > div:first-child').innerText.trim();
  let img = pics[0];
  if (screenWidth == 'DESKTOP') {
    background = el.querySelector(':scope div:first-child > div:last-child').innerText.trim();
    img = pics[pics.length - 1];
  }
  const dcCardContent = createTag('div', {class: 'directory-card-content', style: `background: ${background}`});
  dcCardContent.append(createTag('div', {class: 'content-card-header'}, heading.innerText.trim()));
  dcCardContent.append(createTag('div', {class: 'content-card-subheader'}, textContent));
  const dcimg = createTag('div', {class: 'ufd-image-card'}, img);
  const dcContainer = createTag('div', {}, dcimg);
  dcContainer.append(dcCardContent);
  dcContainer.addEventListener('click', () => {
    window.location.href = redirectLink;
  });
  return dcContainer;
}

export default async function init(el) {
  const cardsec = el.closest('.section').querySelector('.ufd-directory-card');
  if (cardsec) {
    const imgCard = createImageCard(el);
    el.replaceWith(imgCard);
    return;
  }
  const dc = createTag('div', {class: 'ufd-directory-card'});
  el.closest('.section').append(dc);
  const cards = el.closest('.section').querySelectorAll('.community-lcp');
  [...cards].forEach((c) => dc.append(c));
  const imgCard = createImageCard(el);
  el.replaceWith(imgCard);
}
