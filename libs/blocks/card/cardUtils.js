/* eslint-disable import/prefer-default-export */
import { createTag } from '../../utils/utils.js';
import { getMetadata } from '../section-metadata/section-metadata.js';

const DOUBLE_WIDE = 'DoubleWideCard';
const HALF_HEIGHT = 'HalfHeightCard';

export const addBackgroundImg = (picture, cardType, card) => {
  const url = picture.querySelector('img').src;
  card.append(createTag('div', { class: `consonant-${cardType}-img`, style: `background-image: url(${url})` }));
};

export const addVideoBtn = (link, cardType, card) => {
  const cardImage = card.querySelector(`.consonant-${cardType}-img`);
  const playBtn = createTag('div', { class: `consonant-${cardType}-videoIco` });
  if (cardType === HALF_HEIGHT) return cardImage.append(playBtn);
  link.innerHTML = '';
  link.appendChild(playBtn);
  link.classList.add('consonant-videoButton-wrapper');
  return cardImage.append(link);
};

export const getUpFromSectionMetadata = (section) => {
  const sectionMetadata = section.querySelector('.section-metadata');
  if (!sectionMetadata) return null;
  const metadata = getMetadata(sectionMetadata);
  const styles = metadata.style?.text.split(', ').map((style) => style.replaceAll(' ', '-'));
  return styles?.find((style) => style.includes('-up'));
};

export const addFooter = (links, container, merch) => {
  const linksArr = Array.from(links);
  const linksLeng = linksArr.length;
  const hrTag = merch ? '<hr>' : '';
  const footer = createTag('div', { class: 'consonant-CardFooter' }, hrTag);
  const row = createTag('div', { class: 'consonant-CardFooter-row', 'data-cells': '1' });
  linksArr.forEach((link, index) => {
    const { parentElement } = link;
    if (parentElement && document.body.contains(parentElement)) parentElement.remove();
    const holder = createTag('div', { class: `consonant-CardFooter-cell consonant-CardFooter-cell--${(linksLeng === 2 && index === 0) ? 'left' : 'right'}` });
    holder.append(link);
    row.append(holder);
  });

  footer.append(row);
  container.insertAdjacentElement('beforeend', footer);
};

export const addWrapper = (el, section, cardType) => {
  const gridCl = 'consonant-CardsGrid';
  const prevGrid = section.querySelector(`.consonant-Wrapper .${gridCl}`);

  if (prevGrid) return;
  const card = el.classList[0];
  let upClass = getUpFromSectionMetadata(section);
  // Authored w/ a typed out number reference... 'two-up' vs. '2-up'
  const list = ['two-up', 'three-up', 'four-up', 'five-up'];
  const idx = list.findIndex((i) => i.includes(upClass));
  if (idx > -1) {
    upClass = `${idx + 2}-up`;
    const classToRemove = list[idx];
    new MutationObserver(() => { if (section.classList.contains(classToRemove)) section.classList.remove(classToRemove); }).observe(section, { attributes: true, attributeFilter: ['class'] });
  }
  const up = upClass?.replace('-', '') || '3up';
  const gridClass = `${gridCl} ${gridCl}--${up} ${gridCl}--with4xGutter${cardType === DOUBLE_WIDE ? ` ${gridCl}--doubleWideCards` : ''}`;
  const grid = createTag('div', { class: gridClass });
  const collection = createTag('div', { class: 'consonant-Wrapper-collection' }, grid);
  const inner = createTag('div', { class: 'consonant-Wrapper-inner' }, collection);
  const wrapper = createTag('div', { class: 'milo-card-wrapper consonant-Wrapper consonant-Wrapper--1200MaxWidth' }, inner);
  const cards = section.querySelectorAll(`.${card}`);
  const prevSib = cards[0].previousElementSibling;

  grid.append(...cards);

  if (prevSib) {
    prevSib.after(wrapper);
  } else {
    section.prepend(wrapper);
  }
};
