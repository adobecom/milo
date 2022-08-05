/**
 * loads and decorates a blockquote
 * @param {Element} block element
 * @param {Element} node element
 *  ex...
 *   <figure>
 *    <blockquote>
 *      <p>Words can be like X-rays, if you use them properly—they’ll go through anything. You read and you’re pierced.</p>
 *    </blockquote>
 *    <figcaption>—Aldous Huxley, <cite>Brave New World</cite></figcaption>
 *   </figure>
 */
import createTag from '../../utils/utils.js';

function isHexColorDark(color) {
  if (!color.trim().startsWith('#')) return false;
  const hex = color.trim().replace('#', '');
  const cR = parseInt(hex.substr(0, 2), 16);
  const cG = parseInt(hex.substr(2, 2), 16);
  const cB = parseInt(hex.substr(4, 2), 16);
  const brightness = ((cR * 299) + (cG * 587) + (cB * 114)) / 1000;
  return brightness < 155;
}

function decorateBlockBg(block, node) {
  if (node.querySelector(':scope img')) {
    node.classList.add('quote-image');
  } else {
    block.classList.add('background');
    block.style.background = node.textContent.trim();
    node.remove();
  }
  if (isHexColorDark(node.textContent)) block.classList.add('dark');
}

export default function init(el) {
  const allRows = el.querySelectorAll(':scope > div');
  const lastRow = allRows[allRows.length - 1];
  lastRow.classList.add('last-row');
  const rows = el.querySelectorAll(':scope > div:not([class])');
  rows.forEach( row => {
    decorateBlockBg(el, row);
  });
  const copyNodes = lastRow.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
  const quoteCopy = copyNodes[0];
  const figcaptionCopy = copyNodes[1];
  const citeCopy = copyNodes[2];
  const blockquote = createTag('blockquote', { cite: '' }, quoteCopy);
  const figcaption = createTag('figcaption', {}, figcaptionCopy);
  const cite = createTag('cite', {}, citeCopy);
  const wrapper = createTag('div', { class: 'quote-wrapper' });
  const figure = createTag('figure', {}, wrapper);
  quoteCopy?.classList.add('quote');
  figcaptionCopy?.classList.add('figcaption');
  citeCopy?.classList.add('cite');
  lastRow.remove();
  figure.insertAdjacentElement('afterbegin', blockquote);
  el.insertAdjacentElement('afterbegin', figure);
  figcaption.insertAdjacentElement('beforeend', cite);
  blockquote.insertAdjacentElement('afterend', figcaption);
  const imageRow = el.querySelector(':scope > div.quote-image');
  if (imageRow) blockquote.insertAdjacentElement('beforebegin', imageRow);
  wrapper.insertAdjacentElement('beforeend', figcaption);
  wrapper.insertAdjacentElement('afterbegin', blockquote);
}
