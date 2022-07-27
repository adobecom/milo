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
    node.classList.add('image');
  } else {
    node.classList.add('background');
    block.style.background = node.textContent.trim();
    node.remove();
  }
  if (isHexColorDark(node.textContent)) block.classList.add('dark');
  // if (node.innerHTML.trim() === '') node.remove();
}

export default async function init(el) {
  const rows = el.querySelectorAll(':scope > div');
  const lastRow = rows[rows.length - 1];
  lastRow.classList.add('last-row');
  const leftovers = el.querySelectorAll(':scope > div:not([class])');
  leftovers.forEach( row => {
    decorateBlockBg(el, row);
  });
  const copyNodes = lastRow.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
  const quoteCopy = copyNodes[0];
  const imageRow = el.querySelector(':scope > div.image');
  quoteCopy?.classList.add('quote');
  const figcaptionCopy = copyNodes[1];
  figcaptionCopy?.classList.add('figcaption');
  const citeCopy = copyNodes[2];
  citeCopy?.classList.add('cite');
  lastRow.remove();

  const figure = document.createElement('figure');
  const blockquote = document.createElement('blockquote');
  const figcaption = document.createElement('figcaption');
  const cite = document.createElement('cite');
  const wrapper = document.createElement('div');
  wrapper.classList.add('quote-wrapper');

  figure.insertAdjacentElement('afterbegin', wrapper);
  figure.insertAdjacentElement('afterbegin', blockquote);
  el.insertAdjacentElement('afterbegin', figure);

  if (figcaptionCopy) figcaption.insertAdjacentElement('afterbegin', figcaptionCopy);
  if (citeCopy) cite.insertAdjacentElement('afterbegin', citeCopy)
  figcaption.insertAdjacentElement('beforeend', cite);
  blockquote.insertAdjacentElement('afterend', figcaption);
  if (quoteCopy) blockquote.insertAdjacentElement('afterbegin', quoteCopy);
  if (imageRow) blockquote.insertAdjacentElement('beforebegin', imageRow);
  wrapper.insertAdjacentElement('beforeend', figcaption);
  wrapper.insertAdjacentElement('afterbegin', blockquote);

}
