import { createTag } from '../../utils/utils.js';

function createImageCard(el) {
  const heading = el.querySelector('h1, h2, h3, h4, h5, h6');
  const textContent = el.querySelector('p');
  const img = el.querySelector('picture');
  const background = el.querySelector('div:first-child').innerText.trim();
  const dcCardContent = createTag('div', {class: 'directory-card-content', style: `background: ${background}`});
  dcCardContent.append(createTag('div', {class: 'content-card-header'}, heading.innerText.trim()));
  dcCardContent.append(createTag('div', {class: 'content-card-subheader'}, textContent.innerText.trim()));
  const dcimg = createTag('div', {class: 'ufd-image-card', style: "width: 240px;"}, img);
  const dcContainer = createTag('div', {}, dcimg);
  dcContainer.append(dcCardContent);
  return dcContainer;
}

export default async function init(el) {
  const cardsec = el.closest('.section').querySelector('.ufd-directory-card');
  if (cardsec) {
    const imgCard = createImageCard(el);
    cardsec.replace(imgCard, el)
    return;
  }
  const dc = createTag('div', {class: 'ufd-directory-card'});
  el.closest('.section').append(dc);
  const cards = el.closest('.section').querySelectorAll('.community-lcp');
  [...cards].forEach((c) => dc.append(c));
  const imgCard = createImageCard(el);
  cardsec.replace(imgCard, el)
  // el.remove();
}
