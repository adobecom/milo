/* eslint-disable no-shadow, consistent-return, max-len, quote-props, prefer-const */
import { createTag } from '../../utils/utils.js';

console.log('>>>> caas-marquee.js loaded');

function getMetadata(el) {
  console.log('>>>> getMetadata', el);
  let metadata = {};
  for (const row of el.children) {
    const key = row.children[0].textContent.trim().toLowerCase() || '';
    let val = row.children[1]?.innerHTML || '';
    metadata[key.toLowerCase()] = val;
  }
  // console.log('>>>> metadata', metadata); 

  return metadata;
}

function getClasses(el) {
  const classes = el.className;
  return classes;
}

function getMarqueeData(entityid) {
  console.log('>>>> getMarqueeData', entityid);
  const marqueeData = fetch(`https://www.adobe.com/chimera-api/collection?featuredCards=${entityid}`)
    .then((response) => response.json())
    .then((data) => {
      console.log('>>>> data', data);
      return data;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
    return marqueeData;
}





/**
 * function renderMarquee()
 * @param {HTMLElement} marquee - marquee container
 * @param {Array} marquees - marquee data
 * @param {string} id - marquee id
 * @returns {void}
 */
export function renderMarquee(marquee, classes) {
  const card = marquee.cards[0];
  return `<div class="${classes}" data-block-status="" daa-lh="b1|marquee">
    <div class="background"></div>
    <div class="foreground container">
      <div class="text">
        <h1 id="adobe-commerce-magento" class="detail-m">${card.contentArea.detailText}</h1>
        <h2 id="powerful-alone-a-force-when-combined" class="heading-xl">${card.contentArea.title}</h2>
        <p class="body-m">${card.contentArea.description}</p>
      </div>
      <div class="asset image">
        <picture>
          <source type="image/webp" srcset="${card.styles.backgroundImage}?width=2000&amp;format=webply&amp;optimize=medium" media="(min-width: 600px)">
          <source type="image/webp" srcset="${card.styles.backgroundImage}?width=750&amp;format=webply&amp;optimize=medium">
          <source type="image/png" srcset="${card.styles.backgroundImage}?width=2000&amp;format=png&amp;optimize=medium" media="(min-width: 600px)">
          <img loading="lazy" alt="" src="${card.styles.backgroundImage}?width=750&amp;format=png&amp;optimize=medium" width="1200" height="900">
        </picture>
      </div>
    </div>
  </div>`;
}

/**
 * function init()
 * @param {*} el - element with metadata for marquee
 */
export default async function init(el) {
  console.log('>>>> init', el);
  const metadata = getMetadata(el);
  const classes = getClasses(el);
  const entityid = metadata.entityid;
  console.log('>>>> entityid', entityid);

  // const marquee = createTag('div', { class: 'marquee' }, '');
  // el.parentNode.prepend(marquee);
  
  const marquee = await getMarqueeData(entityid);

  // el.parentNode.prepend(renderMarquee(marquee));
  el.parentNode.innerHTML = renderMarquee(marquee, classes);
  ;
}
