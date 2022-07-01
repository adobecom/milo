/**
 * loads and decorates a blockquote
 * @param {Element} block element
 * @param {Element} node element
 *  ex...
 *   <figure>
 *    <blockquote cite="https://www.huxley.net/bnw/four.html">
 *      <p>Words can be like X-rays, if you use them properly—they’ll go through anything. You read and you’re pierced.</p>
 *    </blockquote>
 *    <figcaption>—Aldous Huxley, <cite>Brave New World</cite></figcaption>
 *   </figure>
 */

function decorateBlockBg(block, node) {
  node.classList.add('background');
  if (!node.querySelector(':scope img')) {
    block.style.background = node.textContent;
    node.remove();
  }
}

export default async function init(el) {
  const rows = el.querySelectorAll(':scope > div');
  decorateBlockBg(el, rows[0]);
  const lastRow = rows[rows.length - 1];
  const imageRow = rows[1];
  imageRow.classList.add('image');

  const copyNodes = lastRow.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
  const quoteCopy = copyNodes[0];
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

  figcaption.insertAdjacentElement('afterbegin', figcaptionCopy);
  cite.insertAdjacentElement('afterbegin', citeCopy)
  figcaption.insertAdjacentElement('beforeend', cite);
  blockquote.insertAdjacentElement('afterend', figcaption);
  blockquote.insertAdjacentElement('afterbegin', quoteCopy);
  blockquote.insertAdjacentElement('beforebegin', imageRow);
  wrapper.insertAdjacentElement('beforeend', figcaption);
  wrapper.insertAdjacentElement('afterbegin', blockquote);

}
