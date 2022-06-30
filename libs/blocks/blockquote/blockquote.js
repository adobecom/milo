/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */

export default async function decorate(block) {

  // <figure>
  //   <blockquote cite="https://www.huxley.net/bnw/four.html">
  //     <p>Words can be like X-rays, if you use them properly—they’ll go through anything. You read and you’re pierced.</p>
  //   </blockquote>
  //   <figcaption>—Aldous Huxley, <cite>Brave New World</cite></figcaption>
  // </figure>

  const figure = document.createElement('figure');
  const blockquote = document.createElement('blockquote');
  const figcaption = document.createElement('figcaption');
  figure.insertAdjacentElement('afterbegin', figcaption);
  figure.insertAdjacentElement('afterbegin', blockquote);
  block.insertAdjacentElement('beforeend', figure);
  const blockContent = block.querySelector(':scope > div');
  const quoteRows = blockContent.querySelectorAll(':scope > div');
  // const rowItems = quoteRows.querySelectorAll("h1, h2, h3, h4, h5, h6, p, div, span");
  // console.log({rowItems});

  blockquote.insertAdjacentElement('afterbegin', blockContent);
  // block.remove();
  // block.replaceWith(blockquote)

}
