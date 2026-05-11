// import { createTag } from '../../../utils/utils.js';
// import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

// function decorate(block) {
//   const rows = [...block.children];
//   if (!rows.length) return;

//   // Row 1: section headline
//   const headingCol = rows[0]?.children[0];
//   const headline = createTag('div', { class: 'faq-headline' });
//   if (headingCol) {
//     decorateBlockText(headingCol, { heading: '2' });
//     headline.append(...headingCol.childNodes);
//   }

//   // Rows 2-N: list items
//   const list = createTag('ol', { class: 'faq-list' });
//   rows.slice(1).forEach((row, i) => {
//     const textCol = row.children[0];
//     const mediaCol = row.children[1];

//     const item = createTag('li', { class: 'faq-item' });
//     const number = createTag('span', { class: 'faq-number eyebrow' }, String(i + 1).padStart(2, '0'));

//     const text = createTag('div', { class: 'faq-text' });
//     if (textCol) {
//       textCol.querySelectorAll('p').forEach((p) => p.classList.add('title-4'));
//       text.append(...textCol.childNodes);
//     }

//     item.append(number, text);

//     if (mediaCol) {
//       const pic = mediaCol.querySelector('picture');
//       if (pic) {
//         const media = createTag('div', { class: 'faq-media' });
//         media.append(pic);
//         item.append(media);
//       }
//     }

//     list.append(item);
//   });

//   const listCol = createTag('div', { class: 'faq-list-col' });
//   listCol.append(list);

//   block.replaceChildren(headline, listCol);
// }

export default function init(el) {
  console.log('el', el);
  // decorateViewportContent(el, decorate);
}
